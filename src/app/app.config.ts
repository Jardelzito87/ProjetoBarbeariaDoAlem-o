import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { DatabaseService } from './services/database.service';
import { MockDatabaseService } from './services/mock-database.service';

import { routes } from './app.routes';

// Configurado para usar apenas o banco de dados Neon
const useMockService = false; // Usando apenas o serviço real com PostgreSQL Neon

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideHttpClient(),
    { 
      provide: DatabaseService, 
      useClass: useMockService ? MockDatabaseService : DatabaseService 
    }
  ]
};
