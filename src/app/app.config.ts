import {
  ApplicationConfig,
  ErrorHandler,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
  inject,
} from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { GlobalErrorHandler } from './core/error-handling/global-error-handler';
import { SeedService } from './core/persistence/seed.service';
import { FoldersRepository } from './core/folders/data/folders.repository';
import { LocalFoldersRepository } from './core/folders/data/local-folders.repository';
import { NotesRepository } from './features/notes/data/notes.repository';
import { LocalNotesRepository } from './features/notes/data/local-notes.repository';
import { AssignmentsRepository } from './features/assignments/data/assignments.repository';
import { LocalAssignmentsRepository } from './features/assignments/data/local-assignments.repository';
import { AiService } from './core/ai/services/ai.service';
import { MockAiService } from './core/ai/services/mock-ai.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding()),
    provideClientHydration(withEventReplay()),
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    { provide: FoldersRepository, useClass: LocalFoldersRepository },
    { provide: NotesRepository, useClass: LocalNotesRepository },
    { provide: AssignmentsRepository, useClass: LocalAssignmentsRepository },
    { provide: AiService, useClass: MockAiService },
    provideAppInitializer(() => inject(SeedService).ensureSeeded()),
  ],
};
