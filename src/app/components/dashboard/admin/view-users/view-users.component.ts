import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { UsuarioModel } from '../../../../models/Usuario';
import { AdminService } from '../../../../services/admin.service';
import { lastValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-view-users',
  imports: [MatTableModule, CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './view-users.component.html',
  styleUrl: './view-users.component.css'
})
export class ViewUsersComponent implements OnInit {

  displayedColumns: string[] = ['RFC', 'Correo', 'nombre', 'Cargo', 'Perfil'];
  users: UsuarioModel[] = [];

  constructor(private adminServ: AdminService, private _router: Router, private cookie: CookieService){

  }

  verPerfil(id: number){

  }

  async ngOnInit() {
    try {
      let res = await lastValueFrom(this.adminServ.get_users());
      this.users = res;
      console.log(this.users);
    } catch (error:any) {
      if (error.error.msg) {
        Swal.fire("Error", error.error.msg, "error");
      } else if (error.status == 401) {
        Swal.fire(error.error.error, "Tu  sesión ha expirado, porfavor vuelve a iniciar sesión.", 'info').then(() =>{
          this._router.navigate(['/']);
          this.cookie.delete("token");
        });
      } else {
        Swal.fire("Error", "Ocurrio un error inesperado", "error");
      }
      console.log(error);
    }
  }
}
