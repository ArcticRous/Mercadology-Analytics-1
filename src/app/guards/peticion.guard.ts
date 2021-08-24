import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PeticionGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    let rol = sessionStorage.getItem('rol')
    let puesto = sessionStorage.getItem('puesto')
    let depto = sessionStorage.getItem('depto')
    if (rol === '12345' || (rol === '234567' && puesto === 'Manager' && depto === 'Diseño')) {
      return true;
    } else {
      Swal.fire({
        title: 'No tiene permisos para realizar esta acción',
        icon: 'error',
        timer: 3500
      })
      this.router.navigateByUrl('/home');
      return false;
    }


  }

}
