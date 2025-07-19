const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Servir arquivos estáticos da pasta public

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

// GET para listar agendamentos
app.get('/api/agendamentos', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT a.*, c.nome as cliente_nome, c.email as cliente_email, c.telefone as cliente_telefone,
             s.nome as servico_nome, s.preco as servico_preco
      FROM agendamentos a
      JOIN clientes c ON a.cliente_id = c.id
      JOIN servicos s ON a.servico_id = s.id
      ORDER BY a.data_agendada DESC, a.hora_agendada ASC
    `);
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

// PATCH para atualizar status do agendamento
app.patch('/api/agendamentos/:id', async (req, res) => {
  const { id } = req.params;
  const { status, alterado_por = 'sistema' } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'Status é obrigatório' });
  }

  // Verificar se o status é válido
  const statusValidos = ['pendente', 'confirmado', 'cancelado', 'concluído', 'não compareceu'];
  if (!statusValidos.includes(status)) {
    return res.status(400).json({ 
      error: 'Status inválido', 
      statusValidos: statusValidos 
    });
  }

  try {
    // Obter o status atual do agendamento
    const agendamentoAtual = await pool.query(
      'SELECT status FROM agendamentos WHERE id = $1',
      [id]
    );

    if (agendamentoAtual.rows.length === 0) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }

    const statusAnterior = agendamentoAtual.rows[0].status;

    // Atualizar o status do agendamento
    const result = await pool.query(
      'UPDATE agendamentos SET status = $1, alterado_em = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, id]
    );

    // Registrar o log da alteração
    await pool.query(
      `INSERT INTO logs_agendamentos 
      (agendamento_id, status_anterior, status_novo, alterado_por) 
      VALUES ($1, $2, $3, $4)`,
      [id, statusAnterior, status, alterado_por]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao atualizar status do agendamento:', err);
    console.error('Detalhes do erro:', err.detail || err.message);
    res.status(500).json({ error: 'Erro interno no servidor', details: err.detail || err.message });
  }
});

// Iniciar servidor após testar conexão
testConnection().then(connected => {
  if (connected) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
  } else {
    console.error('Não foi possível iniciar o servidor devido a problemas na conexão com o banco de dados');
  }
});