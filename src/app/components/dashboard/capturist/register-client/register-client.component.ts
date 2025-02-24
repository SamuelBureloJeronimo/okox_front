import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import Swal from 'sweetalert2';
import { ColoniaModel } from '../../../../models/Colonia';
import { EstadoModel } from '../../../../models/Estado';
import { MunicipioModel } from '../../../../models/Municipio';
import { PaisModel } from '../../../../models/Pais';
import { AdminService } from '../../../../services/admin.service';
import { GeneralService } from '../../../../services/general.service';
import { CommonModule } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register-client',
    imports: [MatFormFieldModule, MatButton, MatIconModule, RouterModule, CommonModule, MatInputModule,
      MatSidenavModule, MatCardModule, MatSelectModule, ReactiveFormsModule],
  templateUrl: './register-client.component.html',
  styleUrl: './register-client.component.css'
})
export class RegisterClientComponent {
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
      "value": 2}
    ];

  constructor(private fb: FormBuilder, private genServ: GeneralService, private adminServ: AdminService) {
    this.empleadoForm = this.fb.group({
      rfc: [null, [Validators.maxLength(13), Validators.minLength(13), Validators.required]],
      nombre: [null, Validators.required],
      app: [null, Validators.required],
      apm: [null, Validators.required],
      fech_nac: [null, Validators.required],
      sexo: ["", Validators.required],
      telefono: [null, Validators.required],
      correo: [null, [Validators.required, Validators.email]],
      pais: ["", Validators.required],
      estado: ["", Validators.required],
      municipio: ["", Validators.required],
      colonia: ["", Validators.required],
    });

  }

  async ngOnInit() {
      this.paises  = await lastValueFrom(this.genServ.get_paises());
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
      form.set("tel", this.empleadoForm.value.telefono);
      form.set("email", this.empleadoForm.value.correo);
      try {
        let res = await lastValueFrom(this.adminServ.create_user(form));
        console.log(res);
        Swal.fire("Success", "Contraseña: "+res.pass, "success");
        let form_mail = new FormData();
        //form_mail.set("nombreComp", );
        let mai = await lastValueFrom(this.genServ.sendEmail(this.empleadoForm.value.correo, form_mail));
        console.log(mai)
      } catch (error:any) {
        if(error.error.msg){
          Swal.fire("Error", error.error.msg, "error");
        } else {
          Swal.fire("Error", "Ocurrio un error inesperado", "error");
          console.log(error);
        }
      }
    }
  }
  async selectPais() {

    this.hEstado = true;
    this.hMunicipios = true;
    this.hColonia = true;
    const id_pais = this.empleadoForm.get('pais')?.value;
    this.estados = await lastValueFrom(this.genServ.get_estados(id_pais));
    this.hEstado = false;
  }

  async changeEstado() {
    this.hMunicipios = true;
    this.hColonia = true;

    const id_estado = this.empleadoForm.get('estado')?.value;

    this.municipios = await lastValueFrom(this.genServ.get_municipios(id_estado));
    this.hMunicipios = false;
  }


  async changeMunicipio() {
    this.hColonia = true;

    const id_mun = this.empleadoForm.get('municipio')?.value;

    this.colonias = await lastValueFrom(this.genServ.get_colonias(id_mun));
    this.hColonia = false;
  }

}
