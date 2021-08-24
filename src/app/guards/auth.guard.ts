import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  constructor( private auth: AuthService, private router: Router){

  }
  canActivate( route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // console.log(route);
    
    if(this.auth.estaAutenticado()){
      return true;
    }else{
      this.router.navigateByUrl('/login');
      return false;
    }
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      // console.log(this.auth.esAdmin());
      
      if(this.auth.esAdmin() === 'Administrador'){
        return true;
      }
      Swal.fire({
        title: 'No tiene permisos para esta vista',
        icon: 'error',
        timer: 3500
      })
      this.router.navigateByUrl('/home');
    return false;
  }

  
}
