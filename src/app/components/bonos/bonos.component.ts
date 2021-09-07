import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { BonoModel } from '../../models/bono.model';

@Component({
  selector: 'app-bonos',
  templateUrl: './bonos.component.html',
  styleUrls: ['./bonos.component.css']
})
export class BonosComponent implements OnInit {
  bonos: BonoModel[] = [];

  constructor( private AuthService:AuthService) { }

  ngOnInit(): void {
    this.AuthService.getBono()
      .subscribe( data => {
        console.log(data);
        this.bonos = data;
    });
  }

}
