import { AuthService } from './../services/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class RolGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router){ }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      let rol = this.auth.esAdmin()
      
      if( rol === 'Administrador' || rol === 'Editor'){
        return true;
      }else if(rol == undefined){
        this.router.navigateByUrl('/login');  
        return false;
      }
      Swal.fire({
        title: 'No tiene permisos para realizar esta acción',
        icon: 'error',
        timer: 3500
      })
      this.router.navigateByUrl('/home');
    return false;
  }

  // canActivateChild(
  //   route: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  //     if(this.auth.esAdmin()){
  //       return true;
  //     }
  //     Swal.fire({
  //       title: 'No tiene permisos para esta vista',
  //       icon: 'error',
  //       timer: 3500
  //     })
  //     this.router.navigateByUrl('/home');
  //   return false;
  // }
  
}
