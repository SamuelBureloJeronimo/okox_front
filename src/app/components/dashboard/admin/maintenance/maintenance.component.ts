import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { AdminService } from '../../../../services/admin.service';
import { lastValueFrom } from 'rxjs';
import Swal from 'sweetalert2';
import { UsuarioModel } from '../../../../models/Usuario';
import { CookieService } from 'ngx-cookie-service';
import { MatButtonModule } from '@angular/material/button';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatChipEditedEvent, MatChipInputEvent, MatChipsModule} from '@angular/material/chips';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {COMMA, ENTER} from '@angular/cdk/keycodes';

export interface Fruit {
  id: number;
  name: string;
}

@Component({
  selector: 'app-maintenance',
  imports: [MatCardModule, MatIcon, MatFormFieldModule, ReactiveFormsModule,
            CommonModule, MatButtonModule, MatExpansionModule, MatChipsModule, MatIconModule],
  templateUrl: './maintenance.component.html',
  styleUrl: './maintenance.component.css'
})
export class MaintenanceComponent implements OnInit{
  numero: number = 0;
  mantenForm: FormGroup;
  findTechn: boolean = false;
  user: UsuarioModel = new UsuarioModel();
  nombreComp: string = "";
  btnSendData: boolean = true;
  readonly panelOpenState = signal(false);

  constructor(private fb: FormBuilder, private admServ: AdminService, private cookie: CookieService, private _router: Router) {
    this.mantenForm = this.fb.group({
      rfc_tec: [{ value: '', disabled: true }, [Validators.maxLength(13), Validators.minLength(13), Validators.required]],
      tipo: ["", Validators.required],
      fecha: [null, [Validators.required, this.fechaMayorAHoy]],
      descrip: [null, Validators.required],
      col_afec: ["",],
    });
      // Detectar cambios en el campo 'fecha'
    this.mantenForm.get('fecha')?.valueChanges.subscribe(value => {
    if (this.mantenForm.get('fecha')?.valid) {
      this.mantenForm.get('rfc_tec')?.enable(); // Habilita RFC si fecha es válida
    } else {
      this.mantenForm.get('rfc_tec')?.disable(); // Lo deshabilita si no es válido
    }
  });
  }
  ngOnInit(): void {

  }

  async onSubmit() {
    let val = "";
    const valores = this.fruits(); // Obtiene todos los valores del signal
    valores.forEach((element: any) => {
      val += element.id+";";
    })
    this.mantenForm.value.col_afec = val;
    const formData = new FormData();
    formData.append("rfc_tec", this.mantenForm.value.rfc_tec);
    formData.append("titulo", this.mantenForm.value.tipo);
    formData.append("descripcion", this.mantenForm.value.descrip);
    formData.append("fecha", this.mantenForm.value.fecha);
    formData.append("col_afec", this.mantenForm.value.col_afec);
    try {
      let res = await lastValueFrom(this.admServ.register_mant(formData));
      console.log(res);
      Swal.fire("¡Registrado con éxito!", res, "success");
      this.findTechn = false;
      this.mantenForm.reset();
      this.mantenForm.controls['tipo'].setValue("");
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


  fechaMayorAHoy(control: AbstractControl): ValidationErrors | null {
    const fechaIngresada = new Date(control.value);
    const hoy = new Date();

    // Ajustar la fecha mínima a mañana
    const manana = new Date();
    manana.setDate(hoy.getDate()-1); // Sumar 1 día
    manana.setHours(0, 0, 0, 0);
    fechaIngresada.setHours(0, 0, 0, 0);

    return fechaIngresada >= manana ? null : { fechaInvalida: 'Debe ser al menos mañana' };
  }



  readonly addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  readonly fruits = signal<Fruit[]>([]);
  readonly announcer = inject(LiveAnnouncer);

  remove(fruit: Fruit): void {
    this.fruits.update(fruits => {
      const index = fruits.indexOf(fruit);
      if (index < 0) {
        return fruits;
      }

      fruits.splice(index, 1);

      if (fruits.length === 0)
        this.btnSendData = true;

      this.announcer.announce(`Removed ${fruit.name}`);

      return [...fruits];
    });
  }

  edit(fruit: Fruit, event: MatChipEditedEvent) {
    const value = event.value.trim();

    // Remove fruit if it no longer has a name
    if (!value) {
      this.remove(fruit);
      return;
    }


    // Edit existing fruit
    this.fruits.update(fruits => {
      const index = fruits.indexOf(fruit);
      if (index >= 0) {
        fruits[index].name = value;
        return [...fruits];
      }
      return fruits;
    });
  }

  limpiar(){
    this.fruits.set([]);
    this.btnSendData = true;
  }

  obtenerNumero() {
    Swal.fire({
      title: 'Ingresa el Código Postal',
      input: 'number',
      inputPlaceholder: 'Código postal...',
      showCancelButton: true,
      confirmButtonText: 'Agregar',
      cancelButtonText: 'Cancelar',
      inputValidator: (value): string | null => {
        if (!value) {
          return 'Por favor, ingresa el código postal';
        } else if (isNaN(Number(value))) {
          return 'Debe ser un Código válido';
        }
        return null; // Retorna `null` si la validación es exitosa
      }
    }).then( async (result) => {
      if (result.isConfirmed) {
        this.numero = Number(result.value); // Convierte el valor a número y lo guarda
        let res = await lastValueFrom(this.admServ.get_colonias_by_cp(this.numero));
        let v = 0;
        res.forEach((element: any) => {
          this.fruits.update(fruits => [...fruits, {id: element.id, name: element.nombre}]);
          v++;
        });
        if(v > 0)
          this.btnSendData = false;
        else
          this.btnSendData = true;
      }
    });

  }

}
