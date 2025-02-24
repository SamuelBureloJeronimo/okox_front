import { Component, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GeneralService } from '../../../../services/general.service';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { ColoniaModel } from '../../../../models/Colonia';
import { lastValueFrom } from 'rxjs';
import { ClienteService } from '../../../../services/cliente.service';
import Swal from 'sweetalert2';
import { CookieService } from 'ngx-cookie-service';
import { ReporteFugaModel } from '../../../../models/ReporteFuga';

@Component({
  selector: 'app-report-upload',
  imports: [MatFormFieldModule, MatSelectModule, MatCardModule, MatDividerModule, MatButtonModule,
            ReactiveFormsModule, CommonModule, MatIconModule, MatExpansionModule],
  templateUrl: './report-upload.component.html',
  styleUrl: './report-upload.component.css'
})

export class ReportUploadComponent implements OnInit{
  imageUrl: string | ArrayBuffer | null = null;
  selectedFile!: File;
  razon = ['Fuga', 'Problema con el dispositivo']
  reportForm: FormGroup;
  hid: boolean = true;
  hColonia = true;
  colonias: ColoniaModel[] = []
  reportes: ReporteFugaModel[] =[]

  rutaServ: string;


  constructor(private cliServ: ClienteService, private _router:Router, private fb: FormBuilder, private cookie: CookieService){
    this.reportForm = this.fb.group({
      razon: ["Fuga de agua (tuberia rota)", Validators.required],
      razon2: [null],
      cp: [null, Validators.required],
      id_col: ["", Validators.required],
      image: [null, Validators.required]
    });
    this.rutaServ = cliServ.url_server;
  }
  async ngOnInit() {
    this.reportes = await lastValueFrom(this.cliServ.getAllReports());
  }
  async getColonias_by_CP(){
    this.hColonia = true;
    try {
      let cp = this.reportForm.value.cp;
      this.colonias = await lastValueFrom(this.cliServ.get_colonias_by_cp(cp));
      this.hColonia = false;
    } catch (error:any) {
      console.log(error);
    }
  }
  ngAfterViewInit(): void {
    this.panelOpenState.set(false);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.selectedFile = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.imageUrl = reader.result;
        console.log(this.imageUrl);
      };
      reader.readAsDataURL(file);
    }
  }

  selectRazon() {
    const raz = this.reportForm.value.razon;
    if(raz === "7")
      this.hid = false;
    else
      this.hid = true;
  }


  isSendReport = false;
  idCliente: any;
  mensaje = "";

  async enviarReporte() {
    let formData = new FormData();
    if(this.hid)
      formData.set("razon", this.reportForm.value.razon);
    else
      formData.set("razon", this.reportForm.value.razon2);

    formData.set("image", this.selectedFile);
    formData.set("id_col", this.reportForm.value.id_col);
    console.log(formData.get("razon"), formData.get("image"), formData.get("id_col"));
    try {
      let res = await lastValueFrom(this.cliServ.sendReport(formData));
      console.log(res);
      Swal.fire("¡Reporte enviado!", "Muchas gracias por tu aporte, pronto lo solucionaremos", "success");
      this.reportes = await lastValueFrom(this.cliServ.getAllReports());
      this.reportForm.reset();
      this.reportForm.controls['razon'].setValue("Fuga de agua (tuberia rota)");
      this.reportForm.controls['id_col'].setValue("");
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
    /*try {
      let formData = new FormData();
      formData.set("mensaje", this.mensaje);
      let res = await this.clienteServ.sendReport(this.idCliente, formData).toPromise();
      Swal.fire("Reporte enviado", "El reporte fue registrado exitosamente", 'success');
    } catch (error) {
      Swal.fire("Ya haz realizado un reporte", "Solo puedes subir un reporte al día", 'error');
      this.isSendReport = true;
    }*/
  }

  readonly panelOpenState = signal(false);
}
