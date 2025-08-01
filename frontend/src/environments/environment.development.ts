// Configurações do ambiente - Barbearia do Além
export const environment = {
  production: true,
  apiUrl: 'https://projetobarbeariadoalem-o-3.onrender.com/api',
  
  // Configurações padrão do sistema
  defaultCredentials: {
    email: 'admin@barbeariadoalem.com',
    password: 'admin123'
  },
  
  // URLs importantes
  urls: {
    backend: 'https://projetobarbeariadoalem-o-3.onrender.com/api',
    frontend: 'https://jardelzito87.github.io',
    login: 'https://jardelzito87.github.io/login',
    admin: 'https://jardelzito87.github.io/admin'
  },
  
  // Configurações de banco
  database: {
    name: 'barbeariadoalem_db',
    provider: 'Neon PostgreSQL'
  },
  
  // Instruções para configuração após clone
  setupInstructions: {
    step1: 'Execute: setup-projeto.bat',
    step2: 'Se erro de banco, edite backend/.env',
    step3: 'Execute: start-completo.bat',
    step4: 'Acesse: https://jardelzito87.github.io/login'
  }
};
