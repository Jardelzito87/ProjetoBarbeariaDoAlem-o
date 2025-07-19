import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { DatabaseService } from './services/database.service';
import { MockDatabaseService } from './services/mock-database.service';

import { routes } from './app.routes';

// Para alternar entre o serviço real e o mock, basta comentar/descomentar as linhas abaixo
const useMockService = false; // Defina como true para usar o mock, false para usar o serviço real (PostgreSQL)

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
