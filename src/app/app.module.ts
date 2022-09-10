import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FullCalendarModule } from '@fullcalendar/angular';
import { FormsModule } from '@angular/forms';

import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import listPlugin  from '@fullcalendar/list'; // a plugin!
import interactionPlugin from '@fullcalendar/interaction'; // a plugin!

import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';

import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { DropdownModule } from 'primeng/dropdown';
import { ContextMenuModule } from 'primeng/contextmenu';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmationService } from 'primeng/api';
import { ToolbarModule } from 'primeng/toolbar';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { CardModule } from 'primeng/card';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { MultiSelectModule } from 'primeng/multiselect';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { SelectButtonModule } from 'primeng/selectbutton';

import { FantaroiComponent } from './fantaroi/fantaroi.component';
import { OverallDetailsComponent } from './overall-details/overall-details.component';
import { environment } from '../environments/environment';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFireModule } from '@angular/fire/compat';
import { StatsComponent } from './stats/stats.component';
import { DayDetailsComponent } from './day-details/day-details.component';
import { OffsComponent } from './offs/offs.component';
import { FantarosDetailsComponent } from './fantaros-details/fantaros-details.component';
import { CalendarComponent } from './calendar/calendar.component';
import { CookieService } from 'ngx-cookie-service';
import { FantaroiReadOnlyComponent } from './fantaroi-read-only/fantaroi-read-only.component';
import { RegisterComponent } from './register/register.component';
import { DatePipe } from '@angular/common';

FullCalendarModule.registerPlugins([dayGridPlugin, interactionPlugin, listPlugin]);

@NgModule({
  declarations: [
    AppComponent,
    FantaroiComponent,
    OverallDetailsComponent,
    StatsComponent,
    DayDetailsComponent,
    OffsComponent,
    FantarosDetailsComponent,
    CalendarComponent,
    FantaroiReadOnlyComponent,
    RegisterComponent,
  ],
  imports: [
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FullCalendarModule,
    TooltipModule,
    DialogModule,
    TableModule,
    TabViewModule,
    DropdownModule,
    ContextMenuModule,
    CalendarModule,
    ButtonModule,
    ConfirmPopupModule,
    ToolbarModule,
    RippleModule,
    InputTextModule,
    CardModule,
    AutoCompleteModule,
    MultiSelectModule,
    OverlayPanelModule,
    SelectButtonModule,
  ],
  providers: [
    ConfirmationService,
    CookieService,
    DatePipe
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
