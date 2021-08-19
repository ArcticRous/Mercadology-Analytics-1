import { ComunicadoGuard } from './guards/comunicado.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { CuentasComponent } from './components/cuentas/cuentas.component';
import { CuentaComponent } from './components/cuenta/cuenta.component';
import { MostrarComponent } from './components/mostrar/mostrar.component';
import { GeneradorReportesComponent } from './components/generador-reportes/generador-reportes.component';
import { RegistroComponent } from './components/usuarios/registro/registro.component';
import { ModificarComponent } from './components/usuarios/modificar/modificar.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { PerfilComponent } from './components/usuarios/perfil/perfil.component';
import { AccesosComponent } from './components/accesos/accesos.component';
import { AuthGuard } from './guards/auth.guard';
import { RolGuard } from './guards/rol.guard';
import { ComunicadosComponent } from './components/comunicados/comunicados.component';
import { ComunicadoIndividualComponent } from './components/comunicado-individual/comunicado-individual.component';
import { MiscomunicadosComponent } from './components/miscomunicados/miscomunicados.component';
import { PeticionesComponent } from './components/peticiones/peticiones.component';
import { SolicitudesComponent } from './components/solicitudes/solicitudes.component';
import { PeticionComponent } from './components/peticion/peticion.component';
import { PeticionGuard } from './guards/peticion.guard';
import { MinutaComponent } from './components/minuta/minuta.component';


const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'home' , component: HomeComponent,canActivate: [AuthGuard]},
  {path: 'accesos' , component: AccesosComponent,canActivate: [AuthGuard]},
  {path: 'cuentas', component: CuentasComponent,canActivate: [AuthGuard]},
  {path: 'comunicados' , component: ComunicadosComponent,canActivate: [AuthGuard]},
  {path: 'solicitud' , component: SolicitudesComponent},
  {path: 'comunicado', component: ComunicadoIndividualComponent,canActivate: [AuthGuard]},
  {path: 'comunicado/:ids' , component: ComunicadoIndividualComponent,canActivate: [AuthGuard, ComunicadoGuard]},
  {path: 'MisComun' , component: MiscomunicadosComponent,canActivate: [AuthGuard, ComunicadoGuard]},
  {path: 'minuta' , component: MinutaComponent},
  {path: 'peticiones' , component: PeticionesComponent,canActivate: [AuthGuard, PeticionGuard]},
  {path: 'peticion/:id' , component: PeticionComponent,canActivate: [AuthGuard, PeticionGuard]},
  {path: 'cuenta/:ids', component: CuentaComponent, canActivate: [AuthGuard, RolGuard]},
  {path: 'mostrar/:ids' , component: MostrarComponent,canActivate: [AuthGuard]},
  {path: 'generadorReportes', component: GeneradorReportesComponent, canActivate: [AuthGuard]},
  {path: 'usuarios', component: UsuariosComponent, canActivate: [AuthGuard, RolGuard]}, 
  {path: 'registro', component: RegistroComponent, canActivate: [AuthGuard, RolGuard]},
  {path: 'modificar/:id', component: ModificarComponent, canActivate: [AuthGuard, RolGuard]},
  {path: 'perfil/:id', component: PerfilComponent, canActivate: [AuthGuard]},
  {path: 'login' , component: LoginComponent, canActivate: [AuthGuard]},
  {path: '**' , redirectTo: 'login'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
