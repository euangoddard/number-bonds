import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AnswerPipe } from 'src/app/bonds/answer.pipe';
import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { AutoFocusDirective } from './bonds/auto-focus.directive';
import { BondsComponent } from './bonds/bonds.component';
import { ControlsComponent } from './controls/controls.component';

@NgModule({
  declarations: [AppComponent, BondsComponent, AutoFocusDirective, ControlsComponent, AnswerPipe],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
