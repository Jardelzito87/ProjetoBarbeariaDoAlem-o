const { Pool } = require('pg');
const config = require('../config');

class DatabaseConnection {
  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      ...config.database.pool
    });

    // Eventos do pool
    this.pool.on('connect', () => {
      console.log('🔗 Nova conexão estabelecida com o banco de dados');
    });

    this.pool.on('error', (err) => {
      console.error('❌ Erro no pool de conexões:', err);
    });

    this.pool.on('remove', () => {
      console.log('📤 Cliente removido do pool');
    });
  }

  // Método para executar queries
  async query(text, params) {
    const start = Date.now();
    try {
      const result = await this.pool.query(text, params);
      const duration = Date.now() - start;
      
      if (config.logging.level === 'debug') {
        console.log('📊 Query executada:', {
          text: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
          duration: `${duration}ms`,
          rows: result.rowCount
        });
      }
      
      return result;
    } catch (error) {
      const duration = Date.now() - start;
      console.error('❌ Erro na query:', {
        error: error.message,
        duration: `${duration}ms`,
        text: text.substring(0, 100) + (text.length > 100 ? '...' : '')
      });
      throw error;
    }
  }

  // Método para obter cliente do pool
  async getClient() {
    try {
      const client = await this.pool.connect();
      return client;
    } catch (error) {
      console.error('❌ Erro ao obter cliente do pool:', error);
      throw error;
    }
  }

  // Método para testar conexão
  async testConnection() {
    try {
      await this.pool.query('SELECT 1');
      return true;
    } catch (err) {
      return false;
    }
  }

  // Método para fechar conexões
  async close() {
    try {
      await this.pool.end();
      console.log('🔒 Pool de conexões fechado');
    } catch (error) {
      console.error('❌ Erro ao fechar pool:', error);
    }
  }

  // Método para obter status do pool
  getPoolStatus() {
    return {
      totalClients: this.pool.totalCount,
      idleClients: this.pool.idleCount,
      waitingClients: this.pool.waitingCount
    };
  }
}

// Singleton - uma única instância
const dbConnection = new DatabaseConnection();

module.exports = dbConnection;
