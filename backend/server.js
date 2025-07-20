const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const path = require('path');

// Configurar dotenv com caminho específico
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Importar módulo de disponibilidade
// const disponibilidadeRoutes = require('./disponibilidade');

const app = express();

// Configurar CORS para permitir acesso da Vercel
app.use(cors({
  origin: ['http://localhost:4200', 'https://barbearia-do-alem.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.static('public')); // Servir arquivos estáticos da pasta public

// Configurar sessões
app.use(session({
  secret: process.env.SESSION_SECRET || 'barbearia-do-alem-secret-key-2025',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, // true em produção com HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  }
}));

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'barbearia-jwt-secret-2025';

// Rota raiz
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Configurar conexão PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Testar conexão ao iniciar
async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('Conexão com o banco de dados estabelecida com sucesso!');
    client.release();
    return true;
  } catch (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return false;
  }
}

// Limpar todas as sessões ativas ao reiniciar o servidor
async function limparSessoesAtivas() {
  try {
    console.log('🔄 Limpando todas as sessões ativas devido ao reinício do servidor...');
    
    // Contar sessões ativas antes da limpeza
    const countResult = await pool.query(
      'SELECT COUNT(*) as total FROM sessoes_admin WHERE expira_em > CURRENT_TIMESTAMP'
    );
    const sessoesAtivas = parseInt(countResult.rows[0].total);
    
    // Limpar todas as sessões (ativas e expiradas)
    const deleteResult = await pool.query('DELETE FROM sessoes_admin');
    
    if (sessoesAtivas > 0) {
      console.log(`✅ ${sessoesAtivas} sessão(ões) ativa(s) foram invalidadas`);
      console.log('📋 Todos os administradores precisarão fazer login novamente');
    } else {
      console.log('✅ Nenhuma sessão ativa encontrada');
    }
    
    console.log(`🗑️ Total de ${deleteResult.rowCount} registro(s) removidos da tabela de sessões`);
    
  } catch (err) {
    console.error('❌ Erro ao limpar sessões ativas:', err);
  }
}

// Middleware para verificar autenticação
function verificarAuth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]; // Bearer token
  
  if (!token) {
    return res.status(401).json({ error: 'Token de acesso requerido' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido' });
  }
}

// POST - Login administrativo
app.post('/api/admin/login', async (req, res) => {
  const { email, senha } = req.body;
  const ipAddress = req.ip || req.connection.remoteAddress;
  const userAgent = req.get('User-Agent') || '';
  
  if (!email || !senha) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  }
  
  try {
    // Buscar administrador
    const adminResult = await pool.query(
      'SELECT * FROM administradores WHERE email = $1 AND ativo = true',
      [email]
    );
    
    if (adminResult.rows.length === 0) {
      // Log da tentativa falhada (sem admin_id, vamos pular o log)
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }
    
    const admin = adminResult.rows[0];
    
    // Verificar senha
    const senhaValida = await bcrypt.compare(senha, admin.senha_hash);
    
    if (!senhaValida) {
      // Log da tentativa falhada
      await pool.query(
        'INSERT INTO logs_login (admin_id, ip_address, user_agent, sucesso) VALUES ($1, $2, $3, false)',
        [admin.id, ipAddress, userAgent]
      );
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Verificar se já existe uma sessão ativa para este admin
    const sessaoAtivaResult = await pool.query(
      'SELECT * FROM sessoes_admin WHERE admin_id = $1 AND expira_em > CURRENT_TIMESTAMP',
      [admin.id]
    );
    
    if (sessaoAtivaResult.rows.length > 0) {
      // Existe uma sessão ativa
      const sessaoAtiva = sessaoAtivaResult.rows[0];
      
      // Log da tentativa de login duplo
      await pool.query(
        'INSERT INTO logs_login (admin_id, ip_address, user_agent, sucesso) VALUES ($1, $2, $3, false)',
        [admin.id, ipAddress, userAgent]
      );
      
      return res.status(409).json({ 
        error: 'Já existe uma sessão ativa para este administrador',
        details: {
          existingSessionCreated: sessaoAtiva.criado_em,
          existingSessionExpires: sessaoAtiva.expira_em,
          message: 'Faça logout da sessão atual ou aguarde a expiração'
        }
      });
    }

    // Limpar sessões expiradas do admin antes de criar nova
    await pool.query(
      'DELETE FROM sessoes_admin WHERE admin_id = $1 AND expira_em <= CURRENT_TIMESTAMP',
      [admin.id]
    );
    
    // Gerar JWT token
    const token = jwt.sign(
      { 
        adminId: admin.id, 
        email: admin.email, 
        nome: admin.nome,
        nivelAcesso: admin.nivel_acesso 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // Atualizar último login
    await pool.query(
      'UPDATE administradores SET ultimo_login = CURRENT_TIMESTAMP WHERE id = $1',
      [admin.id]
    );
    
    // Log da tentativa bem-sucedida
    await pool.query(
      'INSERT INTO logs_login (admin_id, ip_address, user_agent, sucesso) VALUES ($1, $2, $3, true)',
      [admin.id, ipAddress, userAgent]
    );

    // Calcular data de expiração (24 horas)
    const expiraEm = new Date();
    expiraEm.setHours(expiraEm.getHours() + 24);

    // Criar uma hash do token para armazenar (JWT é muito longo para o campo)
    const crypto = require('crypto');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex').substring(0, 64);

    // Armazenar sessão na tabela sessoes_admin
    await pool.query(
      'INSERT INTO sessoes_admin (admin_id, token, ip_address, user_agent, expira_em) VALUES ($1, $2, $3, $4, $5)',
      [admin.id, tokenHash, ipAddress, userAgent, expiraEm]
    );
    
    // Armazenar sessão express
    req.session.adminId = admin.id;
    req.session.admin = {
      id: admin.id,
      nome: admin.nome,
      email: admin.email,
      nivelAcesso: admin.nivel_acesso
    };
    
    res.json({
      success: true,
      token,
      admin: {
        id: admin.id,
        nome: admin.nome,
        email: admin.email,
        nivelAcesso: admin.nivel_acesso,
        ultimoLogin: admin.ultimo_login
      }
    });
    
  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST - Logout administrativo
app.post('/api/admin/logout', verificarAuth, async (req, res) => {
  try {
    const adminId = req.admin.adminId;
    
    // Remover sessão da tabela sessoes_admin
    await pool.query(
      'DELETE FROM sessoes_admin WHERE admin_id = $1',
      [adminId]
    );
    
    // Limpar sessão express
    req.session.destroy((err) => {
      if (err) {
        console.error('Erro ao destruir sessão:', err);
      }
    });
    
    res.json({ success: true, message: 'Logout realizado com sucesso' });
  } catch (err) {
    console.error('Erro no logout:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET - Verificar status de autenticação
app.get('/api/admin/status', verificarAuth, async (req, res) => {
  try {
    const adminResult = await pool.query(
      'SELECT id, nome, email, nivel_acesso, ultimo_login FROM administradores WHERE id = $1',
      [req.admin.adminId]
    );
    
    if (adminResult.rows.length === 0) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }
    
    res.json({
      authenticated: true,
      admin: adminResult.rows[0]
    });
  } catch (err) {
    console.error('Erro ao verificar status:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET para listar serviços
app.get('/api/servicos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM servicos');
    console.log('Serviços encontrados:', result.rows);
    
    // Se não houver serviços no banco, retornar serviços padrão
    if (result.rows.length === 0) {
      console.log('Nenhum serviço encontrado, retornando serviços padrão');
      const servicosPadrao = [
        { id: 1, nome: 'Corte Sobrenatural', descricao: 'Transformação completa com técnicas ancestrais. Inclui ritual de purificação capilar', preco: 45.00 },
        { id: 2, nome: 'Degradê Espectral', descricao: 'Fade perfeito com transições invisíveis. Realizado com tesouras forjadas em metal do além', preco: 55.00 },
        { id: 3, nome: 'Navalha Demoníaca', descricao: 'Precisão sobrenatural com nossa navalha ritual. Inclui massagem craniana com óleos místicos', preco: 65.00 },
        { id: 4, nome: 'Barba Maldita', descricao: 'Modelagem completa da barba com produtos infernais. Inclui toalha quente e óleo de barba especial', preco: 40.00 },
        { id: 5, nome: 'Pacto Completo', descricao: 'Combo de corte e barba com direito a ritual completo. Inclui bebida e tratamento especial', preco: 90.00 },
        { id: 6, nome: 'Transformação Sombria', descricao: 'Mudança radical de visual com direito a coloração e tratamento capilar das trevas', preco: 120.00 }
      ];
      return res.json(servicosPadrao);
    }
    
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar serviços:', err);
    console.log('Retornando serviços padrão devido ao erro');
    
    // Em caso de erro, retornar serviços padrão
    const servicosPadrao = [
      { id: 1, nome: 'Corte Sobrenatural', descricao: 'Transformação completa com técnicas ancestrais. Inclui ritual de purificação capilar', preco: 45.00 },
      { id: 2, nome: 'Degradê Espectral', descricao: 'Fade perfeito com transições invisíveis. Realizado com tesouras forjadas em metal do além', preco: 55.00 },
      { id: 3, nome: 'Navalha Demoníaca', descricao: 'Precisão sobrenatural com nossa navalha ritual. Inclui massagem craniana com óleos místicos', preco: 65.00 },
      { id: 4, nome: 'Barba Maldita', descricao: 'Modelagem completa da barba com produtos infernais. Inclui toalha quente e óleo de barba especial', preco: 40.00 },
      { id: 5, nome: 'Pacto Completo', descricao: 'Combo de corte e barba com direito a ritual completo. Inclui bebida e tratamento especial', preco: 90.00 },
      { id: 6, nome: 'Transformação Sombria', descricao: 'Mudança radical de visual com direito a coloração e tratamento capilar das trevas', preco: 120.00 }
    ];
    res.json(servicosPadrao);
  }
});

// Rota de teste para serviços
app.get('/api/servicos-teste', (req, res) => {
  const servicosTeste = [
    { id: 1, nome: 'Corte Sobrenatural', descricao: 'Transformação completa com técnicas ancestrais. Inclui ritual de purificação capilar', preco: 45.00 },
    { id: 2, nome: 'Degradê Espectral', descricao: 'Fade perfeito com transições invisíveis. Realizado com tesouras forjadas em metal do além', preco: 55.00 },
    { id: 3, nome: 'Navalha Demoníaca', descricao: 'Precisão sobrenatural com nossa navalha ritual. Inclui massagem craniana com óleos místicos', preco: 65.00 },
    { id: 4, nome: 'Barba Maldita', descricao: 'Modelagem completa da barba com produtos infernais. Inclui toalha quente e óleo de barba especial', preco: 40.00 },
    { id: 5, nome: 'Pacto Completo', descricao: 'Combo de corte e barba com direito a ritual completo. Inclui bebida e tratamento especial', preco: 90.00 },
    { id: 6, nome: 'Transformação Sombria', descricao: 'Mudança radical de visual com direito a coloração e tratamento capilar das trevas', preco: 120.00 }
  ];
  res.json(servicosTeste);
});

// GET para listar clientes
app.get('/api/clientes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM clientes ORDER BY nome');
    console.log('Clientes encontrados:', result.rows.length);
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar clientes:', err);
    res.status(500).json({ error: 'Erro ao buscar clientes' });
  }
});

// GET para listar logs de agendamentos
app.get('/api/logs-agendamentos', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        l.id,
        l.agendamento_id,
        l.status_anterior,
        l.status_novo,
        l.alterado_por,
        CASE 
          WHEN l.data_agendada IS NOT NULL THEN TO_CHAR(l.data_agendada, 'YYYY-MM-DD')
          ELSE TO_CHAR(a.data_agendada, 'YYYY-MM-DD')
        END as data_agendada,
        CASE 
          WHEN l.hora_agendada IS NOT NULL THEN l.hora_agendada::text
          ELSE TO_CHAR(a.hora_agendada, 'HH24:MI:SS')
        END as hora_agendada,
        COALESCE(l.cliente_nome, c.nome, 'Cliente removido') as cliente_nome,
        TO_CHAR(l.criado_em, 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as criado_em
      FROM logs_agendamentos l
      LEFT JOIN agendamentos a ON l.agendamento_id = a.id
      LEFT JOIN clientes c ON a.cliente_id = c.id
      ORDER BY l.criado_em DESC
    `);
    
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar logs de agendamentos:', err);
    res.status(500).json({ error: 'Erro ao buscar logs de agendamentos' });
  }
});

// POST para criar cliente
app.post('/api/clientes', async (req, res) => {
  console.log('Recebido POST para /api/clientes:', req.body);
  const { nome, email, telefone } = req.body;

  if (!nome || !email || !telefone) {
    console.log('Campos obrigatórios ausentes:', { nome, email, telefone });
    return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
  }

  try {
    // Verificar se o cliente já existe com o mesmo email
    console.log('Verificando se cliente existe:', email);
    const clienteExistente = await pool.query(
      'SELECT * FROM clientes WHERE email = $1',
      [email]
    );
    
    if (clienteExistente.rows.length > 0) {
      console.log('Cliente existente encontrado:', clienteExistente.rows[0]);
      // Se o cliente já existe, retorna o cliente existente
      return res.status(200).json(clienteExistente.rows[0]);
    }
    
    // Inserir novo cliente
    console.log('Inserindo novo cliente:', { nome, email, telefone });
    const result = await pool.query(
      'INSERT INTO clientes (nome, email, telefone) VALUES ($1, $2, $3) RETURNING *',
      [nome, email, telefone]
    );
    
    console.log('Cliente criado com sucesso:', result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao criar cliente:', err);
    console.error('Detalhes do erro:', err.detail || err.message);
    res.status(500).json({ error: 'Erro interno no servidor', details: err.detail || err.message });
  }
});

// POST para criar agendamento
app.post('/api/agendamentos', async (req, res) => {
  console.log('Recebido POST para /api/agendamentos:', req.body);
  const { cliente_id, servico_id, data_agendada, hora_agendada, observacoes } = req.body;

  if (!cliente_id || !servico_id || !data_agendada || !hora_agendada) {
    console.log('Campos obrigatórios ausentes:', { cliente_id, servico_id, data_agendada, hora_agendada });
    return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
  }

  try {
    // Verificar se o cliente existe
    console.log('Verificando se o cliente existe:', cliente_id);
    const clienteExiste = await pool.query('SELECT id FROM clientes WHERE id = $1', [cliente_id]);
    if (clienteExiste.rows.length === 0) {
      console.log('Cliente não encontrado');
      return res.status(400).json({ error: 'Cliente não encontrado' });
    }

    // Verificar se o serviço existe
    console.log('Verificando se o serviço existe:', servico_id);
    const servicoExiste = await pool.query('SELECT id FROM servicos WHERE id = $1', [servico_id]);
    if (servicoExiste.rows.length === 0) {
      console.log('Serviço não encontrado');
      return res.status(400).json({ error: 'Serviço não encontrado' });
    }

    // Verificar se data/hora está bloqueada
    console.log('Verificando se data está bloqueada:', data_agendada);
    const bloqueio = await pool.query(
      'SELECT * FROM datas_bloqueadas WHERE data = $1',
      [data_agendada]
    );
    if (bloqueio.rows.length > 0) {
      console.log('Data bloqueada encontrada');
      return res.status(400).json({ error: 'Data bloqueada para agendamento' });
    }

    // Verificar se já existe agendamento no mesmo horário
    console.log('Verificando agendamentos existentes para:', data_agendada, hora_agendada);
    const agendamentoExistente = await pool.query(
      "SELECT * FROM agendamentos WHERE data_agendada = $1 AND hora_agendada = $2 AND status NOT IN ('cancelado', 'não compareceu')",
      [data_agendada, hora_agendada]
    );
    if (agendamentoExistente.rows.length > 0) {
      console.log('Horário já ocupado');
      return res.status(400).json({ error: 'Horário já está ocupado' });
    }
    
    // Verificar se o cliente já tem agendamento no mesmo dia
    console.log('Verificando se o cliente já tem agendamento no mesmo dia:', cliente_id, data_agendada);
    const agendamentoClienteMesmoDia = await pool.query(
      "SELECT * FROM agendamentos WHERE cliente_id = $1 AND data_agendada = $2 AND status NOT IN ('cancelado', 'não compareceu')",
      [cliente_id, data_agendada]
    );
    if (agendamentoClienteMesmoDia.rows.length > 0) {
      console.log('Cliente já possui agendamento neste dia');
      return res.status(400).json({ error: 'Você já possui um agendamento neste dia. Escolha outra data.' });
    }
    
    // Verificar se já atingiu o limite de 7 agendamentos por dia (1 em cada horário)
    console.log('Verificando limite de agendamentos para o dia:', data_agendada);
    const agendamentosNoDia = await pool.query(
      "SELECT COUNT(*) as total FROM agendamentos WHERE data_agendada = $1 AND status NOT IN ('cancelado', 'não compareceu')",
      [data_agendada]
    );
    
    const totalAgendamentos = parseInt(agendamentosNoDia.rows[0].total);
    console.log(`Total de agendamentos para ${data_agendada}: ${totalAgendamentos}`);
    
    if (totalAgendamentos >= 7) {
      console.log('Limite de agendamentos para este dia atingido');
      return res.status(400).json({ error: 'Limite de agendamentos para este dia atingido. Por favor, escolha outra data.' });
    }

    // Inserir agendamento
    console.log('Inserindo novo agendamento:', { cliente_id, servico_id, data_agendada, hora_agendada });
    const result = await pool.query(
      `INSERT INTO agendamentos 
      (cliente_id, servico_id, data_agendada, hora_agendada, observacoes, status) 
      VALUES ($1, $2, $3, $4, $5, 'pendente') RETURNING *`,
      [cliente_id, servico_id, data_agendada, hora_agendada, observacoes || null]
    );

    // Registrar log de criação do agendamento
    await pool.query(
      `INSERT INTO logs_agendamentos 
      (agendamento_id, status_anterior, status_novo, alterado_por) 
      VALUES ($1, NULL, 'pendente', 'sistema')`,
      [result.rows[0].id]
    );

    console.log('Agendamento criado com sucesso:', result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao criar agendamento:', err);
    console.error('Detalhes do erro:', err.detail || err.message);
    res.status(500).json({ error: 'Erro interno no servidor', details: err.detail || err.message });
  }
});

// GET para verificar disponibilidade de horários
app.get('/api/disponibilidade', async (req, res) => {
  const { data } = req.query;
  
  if (!data) {
    return res.status(400).json({ error: 'Data é obrigatória' });
  }
  
  try {
    // Definir horários disponíveis
    const horarios = [
      '09:00:00', '10:00:00', '11:00:00', '14:00:00', '15:00:00', '16:00:00', '17:00:00'
    ];
    
    // Buscar agendamentos para a data especificada
    const agendamentosResult = await pool.query(
      "SELECT hora_agendada FROM agendamentos WHERE data_agendada = $1 AND status NOT IN ('cancelado', 'não compareceu')",
      [data]
    );
    
    // Mapear horários ocupados
    const horariosOcupados = agendamentosResult.rows.map(row => row.hora_agendada);
    
    // Criar lista de disponibilidade
    const disponibilidade = horarios.map(horario => ({
      horario,
      disponivel: !horariosOcupados.includes(horario)
    }));
    
    res.json(disponibilidade);
  } catch (err) {
    console.error('Erro ao verificar disponibilidade:', err);
    res.status(500).json({ error: 'Erro ao verificar disponibilidade' });
  }
});

// GET para listar agendamentos (PROTEGIDA - APENAS ADMIN)
app.get('/api/agendamentos', verificarAuth, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        a.id,
        a.cliente_id,
        a.servico_id,
        TO_CHAR(a.data_agendada, 'YYYY-MM-DD') as data_agendada,
        a.hora_agendada,
        a.observacoes,
        a.status,
        a.alterado_em,
        c.nome as cliente_nome,
        c.email as cliente_email,
        c.telefone as cliente_telefone,
        s.nome as servico_nome,
        s.preco as servico_preco,
        s.descricao as servico_descricao
      FROM agendamentos a
      JOIN clientes c ON a.cliente_id = c.id
      JOIN servicos s ON a.servico_id = s.id
      ORDER BY a.data_agendada DESC, a.hora_agendada ASC
    `);
    
    console.log('Agendamentos carregados com sucesso:', result.rows.length);
    // Verificar se os preços estão sendo retornados corretamente
    if (result.rows.length > 0) {
      console.log('Exemplo de agendamento com preço:', {
        id: result.rows[0].id,
        servico_nome: result.rows[0].servico_nome,
        servico_preco: result.rows[0].servico_preco
      });
    }
    
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar agendamentos:', err);
    res.status(500).json({ error: 'Erro ao buscar agendamentos' });
  }
});

// POST para bloquear data
app.post('/api/datas-bloqueadas', async (req, res) => {
  const { data, motivo } = req.body;

  if (!data) {
    return res.status(400).json({ error: 'Data é obrigatória' });
  }

  try {
    await pool.query(
      'INSERT INTO datas_bloqueadas (data, motivo) VALUES ($1, $2) ON CONFLICT (data) DO NOTHING',
      [data, motivo || null]
    );
    res.status(201).json({ success: true });
  } catch (err) {
    console.error('Erro ao bloquear data:', err);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

// DELETE para desbloquear data
app.delete('/api/datas-bloqueadas/:data', async (req, res) => {
  const { data } = req.params;

  try {
    await pool.query('DELETE FROM datas_bloqueadas WHERE data = $1', [data]);
    res.json({ success: true });
  } catch (err) {
    console.error('Erro ao desbloquear data:', err);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

// GET para listar datas bloqueadas
app.get('/api/datas-bloqueadas', async (req, res) => {
  try {
    const result = await pool.query('SELECT data, motivo FROM datas_bloqueadas ORDER BY data');
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar datas bloqueadas:', err);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

// GET para listar logs de agendamentos
app.get('/api/logs-agendamentos', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT l.*, a.data_agendada, a.hora_agendada, c.nome as cliente_nome
      FROM logs_agendamentos l
      JOIN agendamentos a ON l.agendamento_id = a.id
      JOIN clientes c ON a.cliente_id = c.id
      ORDER BY l.criado_em DESC
      LIMIT 100
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar logs de agendamentos:', err);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

// PATCH para atualizar status do agendamento (PROTEGIDA - APENAS ADMIN)
app.patch('/api/agendamentos/:id', verificarAuth, async (req, res) => {
  const { id } = req.params;
  const { status, alterado_por = 'sistema' } = req.body;

  console.log(`🔄 PATCH /api/agendamentos/${id} - Status: ${status}, Alterado por: ${alterado_por}`);

  if (!status) {
    console.log('❌ Status não fornecido');
    return res.status(400).json({ error: 'Status é obrigatório' });
  }

  // Verificar se o status é válido
  const statusValidos = ['pendente', 'confirmado', 'cancelado', 'concluido', 'não compareceu'];
  if (!statusValidos.includes(status)) {
    console.log(`❌ Status inválido: ${status}. Válidos: ${statusValidos.join(', ')}`);
    return res.status(400).json({ 
      error: 'Status inválido', 
      statusValidos: statusValidos 
    });
  }

  try {
    // Obter o status atual e informações do agendamento
    console.log(`🔍 Buscando agendamento ID: ${id}`);
    const agendamentoAtual = await pool.query(`
      SELECT a.*, c.nome as cliente_nome, c.email as cliente_email, c.telefone as cliente_telefone
      FROM agendamentos a
      JOIN clientes c ON a.cliente_id = c.id
      WHERE a.id = $1
    `, [id]);

    if (agendamentoAtual.rows.length === 0) {
      console.log(`❌ Agendamento não encontrado: ID ${id}`);
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }

    const statusAnterior = agendamentoAtual.rows[0].status;
    console.log(`📋 Agendamento encontrado. Status atual: ${statusAnterior} → Novo status: ${status}`);

    // Atualizar o status do agendamento
    console.log(`💾 Atualizando status do agendamento ${id}`);
    await pool.query(
      'UPDATE agendamentos SET status = $1, alterado_em = CURRENT_TIMESTAMP WHERE id = $2',
      [status, id]
    );
    console.log(`✅ Status atualizado com sucesso`);

    // Registrar o log da alteração
    console.log(`📝 Registrando log da alteração`);
    console.log(`Log dados:`, {
      agendamento_id: parseInt(id),
      status_anterior: statusAnterior,
      status_novo: status,
      alterado_por: alterado_por,
      data_agendada: agendamentoAtual.rows[0].data_agendada,
      hora_agendada: agendamentoAtual.rows[0].hora_agendada,
      cliente_nome: agendamentoAtual.rows[0].cliente_nome
    });
    
    await pool.query(
      `INSERT INTO logs_agendamentos 
      (agendamento_id, status_anterior, status_novo, alterado_por, data_agendada, hora_agendada, cliente_nome) 
      VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        parseInt(id), 
        statusAnterior, 
        status, 
        alterado_por,
        agendamentoAtual.rows[0].data_agendada,
        agendamentoAtual.rows[0].hora_agendada,
        agendamentoAtual.rows[0].cliente_nome || 'Cliente não identificado'
      ]
    );
    console.log(`✅ Log registrado com sucesso`);

    // Buscar o agendamento atualizado com todas as informações
    console.log(`🔍 Buscando agendamento atualizado`);
    const agendamentoAtualizado = await pool.query(`
      SELECT 
        a.id,
        a.cliente_id,
        a.servico_id,
        TO_CHAR(a.data_agendada, 'YYYY-MM-DD') as data_agendada,
        a.hora_agendada,
        a.observacoes,
        a.status,
        a.alterado_em,
        c.nome as cliente_nome, 
        c.email as cliente_email, 
        c.telefone as cliente_telefone,
        s.nome as servico_nome, 
        s.preco as servico_preco
      FROM agendamentos a
      JOIN clientes c ON a.cliente_id = c.id
      JOIN servicos s ON a.servico_id = s.id
      WHERE a.id = $1
    `, [id]);

    console.log(`✅ Atualização completa do agendamento ${id}`);
    res.json(agendamentoAtualizado.rows[0]);
  } catch (err) {
    console.error(`❌ Erro ao atualizar status do agendamento ${id}:`, err);
    console.error('Detalhes do erro:', err.detail || err.message);
    console.error('Stack:', err.stack);
    res.status(500).json({ error: 'Erro interno no servidor', details: err.detail || err.message });
  }
});

// Iniciar servidor após testar conexão
testConnection().then(async connected => {
  if (connected) {
    // Limpar todas as sessões ativas ao reiniciar
    await limparSessoesAtivas();
    
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log('🔐 Sistema de login pronto - todas as sessões anteriores foram invalidadas');
    });
  } else {
    console.error('❌ Não foi possível iniciar o servidor devido a problemas na conexão com o banco de dados');
  }
});

// Handlers para encerramento gracioso do servidor
process.on('SIGINT', async () => {
  console.log('\n🔄 Recebido SIGINT, encerrando servidor...');
  console.log('🔒 Na próxima inicialização, todas as sessões ativas serão invalidadas');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🔄 Recebido SIGTERM, encerrando servidor...');
  console.log('🔒 Na próxima inicialização, todas as sessões ativas serão invalidadas');
  process.exit(0);
});