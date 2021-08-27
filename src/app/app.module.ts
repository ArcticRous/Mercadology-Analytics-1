//import { environment } from './../environments/environment.prod';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule} from '@angular/common/http';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClipboardModule } from '@angular/cdk/clipboard';


import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatSelectModule } from '@angular/material/select';

import { NgxDropzoneModule } from 'ngx-dropzone';
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CuentasComponent } from './components/cuentas/cuentas.component';
import { LoginComponent } from './components/login/login.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { GeneradorReportesComponent } from './components/generador-reportes/generador-reportes.component';
import { RegistroComponent } from './components/usuarios/registro/registro.component';
import { ModificarComponent } from './components/usuarios/modificar/modificar.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { PerfilComponent } from './components/usuarios/perfil/perfil.component';
import { CuentaComponent } from './components/cuenta/cuenta.component';
import { HomeComponent } from './components/home/home.component';
import { MostrarComponent } from './components/mostrar/mostrar.component';
import { AccesosComponent } from './components/accesos/accesos.component';
import { MiscomunicadosComponent  } from './components/miscomunicados/miscomunicados.component';
import { ComunicadosComponent } from './components/comunicados/comunicados.component';
import { ComunicadoIndividualComponent } from './components/comunicado-individual/comunicado-individual.component';
import { PeticionesComponent } from './components/peticiones/peticiones.component';
import { SolicitudesComponent } from './components/solicitudes/solicitudes.component';
import { PeticionComponent } from './components/peticion/peticion.component';
import { MinutaComponent } from './components/minuta/minuta.component';
import { CalendarioComponent } from './components/calendario/calendario.component';

import { FullCalendarModule } from '@fullcalendar/angular'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import interactionPlugin from '@fullcalendar/interaction'; // a plugin!
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { MinutasComponent } from './components/minutas/minutas.component';

FullCalendarModule.registerPlugins([
  dayGridPlugin,
  timeGridPlugin,
  listPlugin,
  interactionPlugin
])


@NgModule({
  declarations: [
    AppComponent,
    CuentasComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    GeneradorReportesComponent,
    RegistroComponent,
    UsuariosComponent,
    ModificarComponent,
    HomeComponent,
    CuentaComponent,
    PerfilComponent,
    MostrarComponent,
    AccesosComponent,
    ComunicadosComponent,
    ComunicadoIndividualComponent,
    MiscomunicadosComponent,
    PeticionesComponent,
    SolicitudesComponent,
    PeticionComponent,
    MinutaComponent,
    CalendarioComponent,
    MinutasComponent
  ],
  imports: [
    MatTabsModule,
    BrowserModule,
    BrowserAnimationsModule,
    ClipboardModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSnackBarModule,
    MatDatepickerModule, 
    // MatNativeDateModule,
    MatMomentDateModule,
    FullCalendarModule,
    NgxDropzoneModule,
    ToastrModule.forRoot(), // ToastrModule added
  ],
  providers: [
    
  ],
  bootstrap: [AppComponent,CalendarioComponent]
})
export class AppModule { }
