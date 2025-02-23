import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { AdminService } from '../../../../services/admin.service';
import { lastValueFrom } from 'rxjs';
import Swal from 'sweetalert2';
import { UsuarioModel } from '../../../../models/Usuario';
import { CookieService } from 'ngx-cookie-service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-maintenance',
  imports: [MatCardModule, MatIcon, MatFormFieldModule, ReactiveFormsModule, CommonModule, MatButtonModule],
  templateUrl: './maintenance.component.html',
  styleUrl: './maintenance.component.css'
})
export class MaintenanceComponent implements OnInit{
  mantenForm: FormGroup;
  findTechn: boolean = false;
  user: UsuarioModel = new UsuarioModel();
  nombreComp: string = "";

  constructor(private fb: FormBuilder, private admServ: AdminService, private cookie: CookieService, private _router: Router) {
    this.mantenForm = this.fb.group({
      rfc_tec: [null, [Validators.maxLength(13), Validators.minLength(13), Validators.required]],
      tipo: ["", Validators.required],
      fecha: [null, Validators.required],
      descrip: [null, Validators.required],
    });
  }
  ngOnInit(): void {

  }

  onSubmit() {
  }

  async searchTecn() {
    try {
      let res = await lastValueFrom(this.admServ.search_tec(this.mantenForm.value.rfc_tec));
      this.nombreComp = res.nombre;
      this.user = res;
      console.log(this.user);
      this.user.imagen = this.admServ.url_server+"/image/clients/"+this.user.imagen
      this.findTechn = true;
    } catch (error: any) {
      if (error.status == 400) {
        Swal.fire("El usuario deber se un técnico", error.error, "info");
      } else if (error.status == 401) {
        Swal.fire(error.error.error, "Tu  sesión ha expirado, porfavor vuelve a iniciar sesión.", 'info').then(() =>{
          this._router.navigate(['/']);
          this.cookie.delete("token");
        });
      } else {
        Swal.fire("Error", "Ocurrio un error inesperado", "error");
      }
      console.log(error);
      this.findTechn = false;
    }
  }
}
