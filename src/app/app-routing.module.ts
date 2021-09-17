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
import { CalendarioComponent } from './components/calendario/calendario.component';
import { MinutasComponent } from './components/minutas/minutas.component';
import { ProductividadesComponent } from './components/productividades/productividades.component';
import { ProductividadComponent } from './components/productividad/productividad.component';
import { BonoComponent } from './components/bono/bono.component';
import { BonosComponent } from './components/bonos/bonos.component';
import { StatusBonoComponent } from './components/status-bono/status-bono.component';
import { StatusBonosComponent } from './components/status-bonos/status-bonos.component';
import { CalendarGuard } from './guards/calendario.guard';
import { ShowcalendarioComponent } from './components/calendario/showcalendario/showcalendario.component';
import { VistaComunicadoComponent } from './components/vista-comunicado/vista-comunicado.component';
import { ProductividadUsuarioComponent } from './components/productividad-usuario/productividad-usuario.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'home' , component: HomeComponent,canActivate: [AuthGuard]},
  {path: 'accesos' , component: AccesosComponent,canActivate: [AuthGuard]},
  {path: 'cuentas', component: CuentasComponent,canActivate: [AuthGuard]},
  {path: 'comunicados' , component: ComunicadosComponent,canActivate: [AuthGuard]},
  {path: 'eventos' , component: ShowcalendarioComponent},
  {path: 'calendario' , component: CalendarioComponent,canActivate: [AuthGuard, CalendarGuard]},
  {path: 'calendario/:id' , component: CalendarioComponent,canActivate: [AuthGuard, CalendarGuard]},
  {path: 'solicitud' , component: SolicitudesComponent},
  {path: 'comunicado', component: ComunicadoIndividualComponent,canActivate: [AuthGuard]},
  {path: 'comunicado/view/:id' , component: VistaComunicadoComponent,canActivate: [AuthGuard, ComunicadoGuard]},
  {path: 'comunicado/:ids' , component: ComunicadoIndividualComponent,canActivate: [AuthGuard, ComunicadoGuard]},
  {path: 'MisComun' , component: MiscomunicadosComponent,canActivate: [AuthGuard, ComunicadoGuard]},
  {path: 'minuta' , component: MinutaComponent,canActivate: [AuthGuard]},
  {path: 'minuta/view/:id' , component: MinutaComponent,canActivate: [AuthGuard]},
  {path: 'minuta/:id' , component: MinutaComponent,canActivate: [AuthGuard]},
  {path: 'minutas' , component: MinutasComponent,canActivate: [AuthGuard]},
  {path: 'peticiones' , component: PeticionesComponent,canActivate: [AuthGuard, PeticionGuard]},
  {path: 'peticion/:id' , component: PeticionComponent,canActivate: [AuthGuard, PeticionGuard]},
  {path: 'cuenta/:ids', component: CuentaComponent, canActivate: [AuthGuard, RolGuard]},
  {path: 'mostrar/:ids' , component: MostrarComponent,canActivate: [AuthGuard]},
  {path: 'generadorReportes', component: GeneradorReportesComponent, canActivate: [AuthGuard]},
  {path: 'productividades', component: ProductividadesComponent, canActivate: [AuthGuard]},
  {path: 'productividad', component: ProductividadComponent, canActivate: [AuthGuard]},
  {path: 'productividad/view/:id', component: ProductividadComponent, canActivate: [AuthGuard]},
  {path: 'productividad/usuario/:id', component: ProductividadUsuarioComponent},
  {path: 'productividad/:id', component: ProductividadComponent, canActivate: [AuthGuard]},
  {path: 'bonos', component: BonosComponent, canActivate: [AuthGuard]},
  {path: 'bono/:id', component: BonoComponent, canActivate: [AuthGuard]},
  {path: 'bono', component: BonoComponent, canActivate: [AuthGuard]},
  {path: 'status-bonos', component: StatusBonosComponent, canActivate: [AuthGuard]},
  {path: 'status-bono/:id', component: StatusBonoComponent, canActivate: [AuthGuard]},
  {path: 'status-bono', component: StatusBonoComponent, canActivate: [AuthGuard]},
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
