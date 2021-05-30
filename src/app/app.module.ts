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
    MostrarComponent
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
    MatSnackBarModule,
    MatDatepickerModule, 
    // MatNativeDateModule,
    MatMomentDateModule
  ],
  providers: [
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
