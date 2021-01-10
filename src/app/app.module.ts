import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogModule } from 'primeng/dialog';
import { MenuModule } from 'primeng/menu';

import { AppComponent } from './app.component';
import { WgoComponent } from './components/wgo/wgo.component';

@NgModule({
    declarations: [
        AppComponent,
        WgoComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        DialogModule,
        FormsModule,
        MenuModule,
    ],
    providers: [],
    bootstrap: [ AppComponent ],
})
export class AppModule {
}
