import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ComunicadoGuard implements CanActivate {

  constructor(private router: Router){
    
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      console.log(sessionStorage.getItem('puesto'));

      let puesto = sessionStorage.getItem('puesto');
      let rol = sessionStorage.getItem('rol');

      if(puesto == "Manager" || puesto == "Director" || rol == "12345" || rol == "234567" ){
        return true;
      }else{

        Swal.fire({
          title: 'No tiene permisos para realizar esta acción',
          icon: 'error',
          timer: 3500
        })
        
        this.router.navigateByUrl('/login');  
        return false;
      }
    
  }
  
}
