import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { BondsComponent } from './bonds/bonds.component';
import { AutoFocusDirective } from './bonds/auto-focus.directive';

@NgModule({
  declarations: [AppComponent, BondsComponent, AutoFocusDirective],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
