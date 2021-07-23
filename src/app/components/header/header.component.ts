import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, AfterViewInit {

  id: string;
  local: string;
  rol: string;

  constructor( private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.id = sessionStorage.getItem('idUsuario');    
    this.local = sessionStorage.getItem('local');
    this.rol = sessionStorage.getItem('rol');
  }

  ngAfterViewInit(){

  }

  salir(){
    this.auth.Logout();
    this.router.navigateByUrl('/login');
  }

  guardarLocal(propio: string): void {
    sessionStorage.setItem('local', propio);
  }

}
