import { MatCardModule } from '@angular/material/card';
import { GeneralService } from './../../../../services/general.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import Swal from 'sweetalert2'

// - IMPORTS
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ColoniaModel } from '../../../../models/Colonia';
import { EstadoModel } from '../../../../models/Estado';
import { MunicipioModel } from '../../../../models/Municipio';
import { PaisModel } from '../../../../models/Pais';
import { AdminService } from '../../../../services/admin.service';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-register-user',
  imports: [MatFormFieldModule, MatButton, MatIconModule, RouterModule, CommonModule, MatInputModule,
    MatSidenavModule, MatCardModule, MatSelectModule, ReactiveFormsModule],
  templateUrl: './register-user.component.html',
  styleUrl: './register-user.component.css'
})
export class RegisterUserComponent implements OnInit {
  empleadoForm: FormGroup;
  public paises: PaisModel[] = [];
  public estados: EstadoModel[] = [];
  public municipios: MunicipioModel[] = [];
  public colonias: ColoniaModel[] = [];

  email: string = "";

  hEstado = true;
  hMunicipios = true;
  hColonia = true;

  constructor(private fb: FormBuilder, private genServ: GeneralService, private cookie: CookieService,
              private adminServ: AdminService, private _router: Router) {
    this.empleadoForm = this.fb.group({
      rfc: [null, [Validators.maxLength(13), Validators.minLength(13), Validators.required]],
      nombre: [null, Validators.required],
      app: [null, Validators.required],
      apm: [null, Validators.required],
      fech_nac: [null, Validators.required],
      sexo: ["", Validators.required],
      telefono: [null, Validators.required],
      correo: [null, [Validators.required, Validators.email]],
      rol: ["", Validators.required],
      pais: ["", Validators.required],
      estado: ["", Validators.required],
      municipio: ["", Validators.required],
      colonia: ["", Validators.required],
    });

  }

  async ngOnInit() {
    this.paises = await lastValueFrom(this.genServ.get_paises());
  }

  async onSubmit() {
    const form = new FormData();
    form.append("rfc", this.empleadoForm.value.rfc);
    form.set("nombre", this.empleadoForm.value.nombre);
    form.set("app", this.empleadoForm.value.app);
    form.set("apm", this.empleadoForm.value.apm);
    form.set("fech_nac", this.empleadoForm.value.fech_nac);
    form.set("sex", this.empleadoForm.value.sexo);
    form.set("id_colonia", this.empleadoForm.value.colonia);
    form.set("rol", this.empleadoForm.value.rol);
    form.set("tel", this.empleadoForm.value.telefono);
    form.set("email", this.empleadoForm.value.correo);

    let form_mail = new FormData();

    try {
      console.log(form);
      let res = await lastValueFrom(this.adminServ.create_user(form));
      console.log(res);
      form_mail.set("username", res.user);
      form_mail.set("password", res.pass);
      Swal.fire("¡Usuario creado con éxito!", "Revisa tu correo electronico, te hemos enviado tus datos", "success");

      this.email = this.empleadoForm.value.correo;

      this.empleadoForm.reset();
      this.empleadoForm.controls['sexo'].setValue("");
      this.empleadoForm.controls['rol'].setValue("");
      this.empleadoForm.controls['pais'].setValue("");
      this.empleadoForm.controls['estado'].setValue("");
      this.empleadoForm.controls['municipio'].setValue("");
      this.empleadoForm.controls['colonia'].setValue("");

    } catch (error: any) {
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
    try {
      await lastValueFrom(this.genServ.sendEmail(this.email, form_mail));
    } catch (error: any) {
      console.log(error);
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
