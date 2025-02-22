import { MatCardModule } from '@angular/material/card';
import { MatFormField } from '@angular/material/form-field';
import { GeneralService } from './../../../../services/general.service';
import { CompanyModel } from '../.././../../models/Company';
import { Component, OnInit } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'
import { jwtDecode } from "jwt-decode";

// - IMPORTS
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatLabel } from '@angular/material/form-field';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ColoniaModel } from '../../../../models/Colonia';
import { EstadoModel } from '../../../../models/Estado';
import { MunicipioModel } from '../../../../models/Municipio';
import { PaisModel } from '../../../../models/Pais';
import { AdminService } from '../../../../services/admin.service';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-register-user',
  imports: [MatFormFieldModule, MatIconModule, MatLabel, RouterModule, CommonModule,
    MatSidenavModule, MatFormField, MatCardModule, MatSelectModule, ReactiveFormsModule],
  templateUrl: './register-user.component.html',
  styleUrl: './register-user.component.css'
})
export class RegisterUserComponent {
  empleadoForm: FormGroup;
  public paises: PaisModel[] = [];
  public estados: EstadoModel[] = [];
  public municipios: MunicipioModel[] = [];
  public colonias: ColoniaModel[] = [];

  id_col: number = 0;

  hEstado = true;
  hMunicipios = true;
  hColonia = true;
  finishForm = true;

  roles = [
    {
      "name": 'Capturista',
      "value": 1
    },
    {
      "name": 'Técnico',
      "value": 2
    }
  ];

  constructor(private fb: FormBuilder, private genServ: GeneralService, private adminServ: AdminService) {
    this.empleadoForm = this.fb.group({
      rfc: [null, [Validators.maxLength(13), Validators.minLength(13), Validators.required]],
      nombre: [null, Validators.required],
      app: [null, Validators.required],
      apm: [null, Validators.required],
      fech_nac: [null, Validators.required],
      sexo: [null, Validators.required],
      telefono: [null, Validators.required],
      correo: [null, [Validators.required, Validators.email]],
      rol: [null, Validators.required],
      pais: [null, Validators.required],
      estado: [null, Validators.required],
      municipio: [null, Validators.required],
      colonia: [null, Validators.required],
    });

  }

  async ngOnInit() {
    this.paises = await lastValueFrom(this.genServ.get_paises());
  }

  async onSubmit() {
    if (this.empleadoForm.valid) {
      let form = new FormData();
      form.set("rfc", this.empleadoForm.value.rfc);
      form.set("nombre", this.empleadoForm.value.nombre);
      form.set("app", this.empleadoForm.value.app);
      form.set("apm", this.empleadoForm.value.apm);
      form.set("fech_nac", this.empleadoForm.value.fech_nac);
      form.set("sex", this.empleadoForm.value.sexo);
      form.set("id_colonia", this.id_col.toString());
      form.set("rol", this.empleadoForm.value.rol);
      form.set("tel", this.empleadoForm.value.telefono);
      form.set("email", this.empleadoForm.value.correo);
      try {
        let res = await lastValueFrom(this.adminServ.create_user(form));
        console.log(res);
        Swal.fire("Success", "Contraseña: " + res.pass, "success");
        let form_mail = new FormData();
        //form_mail.set("nombreComp", );
        let mai = await lastValueFrom(this.genServ.sendEmail(this.empleadoForm.value.correo, form_mail));
        console.log(mai)
      } catch (error: any) {
        if (error.error.msg) {
          Swal.fire("Error", error.error.msg, "error");
        } else {
          Swal.fire("Error", "Ocurrio un error inesperado", "error");
          console.log(error);
        }
      }
    }
  }

  async selectPais(id: number) {
    this.hEstado = true;
    this.hMunicipios = true;
    this.finishForm = true;
    this.hColonia = true;

    this.estados = await lastValueFrom(this.genServ.get_estados(id));
    this.hEstado = false;
  }



  async changeEstado(id: number) {
    this.hMunicipios = true;
    this.hColonia = true;
    this.finishForm = true;

    this.municipios = await lastValueFrom(this.genServ.get_municipios(id));
    this.hMunicipios = false;
  }


  async changeMunicipio(id: number) {
    this.hColonia = true;
    this.finishForm = true;

    this.colonias = await lastValueFrom(this.genServ.get_colonias(id));
    this.hColonia = false;
  }

  changeColonia(id: number) {
    this.finishForm = false;
    this.id_col = id;
  }
}
