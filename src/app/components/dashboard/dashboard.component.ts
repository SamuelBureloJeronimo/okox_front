import { GeneralService } from './../../services/general.service';
import { CompanyModel } from './../../models/Company';
import { Component, OnInit } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'
import { jwtDecode } from "jwt-decode";

// - IMPORTS
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatDrawerMode, MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';


// - PROVIDERS
import { ClienteService } from '../../services/cliente.service';
import { CookieService } from 'ngx-cookie-service';
import { JwtPayloadUser } from '../../services/general.service';
import { UsuarioModel } from '../../models/Usuario';

@Component({
  selector: 'app-dashboard',
  imports: [MatIconModule, RouterModule, CommonModule, MatSidenavModule, MatListModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  modeSideBar: MatDrawerMode = "side"
  hasBack: string = "false";

  hidden = false;

  fillerNav: any = [];
  selectedRoute: string = "";

  loading: boolean = true;

  public user: UsuarioModel = new UsuarioModel();
  public company: CompanyModel = new CompanyModel();

  imageUrl: string | ArrayBuffer | null = null;
  selectedFile!: File;


  constructor(private _router: Router, private genServ: GeneralService, private clientSer: ClienteService,
              private coockieServ: CookieService) {

  }

  async ngOnInit() {
    let res = await lastValueFrom(this.genServ.init_dashboard());
    this.company.logo = this.genServ.url_server+res.logo;
    this.user.imagen = this.genServ.url_server+res.img_user;
    this.user.username = res.username;
    this.user.email = res.email;

    this.loading = false;

    let dec = jwtDecode<JwtPayloadUser>(this.coockieServ.get("token"));

    this.user.rol = Number(dec.sub);
    console.log(this.user);

    if (this.user.rol == 0) {
      this.fillerNav = [
        { name: 'Consumo', route: 'dashboard/client/my-consume', icon: 'water_drop' },
        { name: 'Subir pago', route: 'dashboard/client/payment-upload', icon: 'payments' },
        { name: 'Historial de pago', route: 'dashboard/client/payments-history', icon: 'history' },
        { name: 'Reportar fuga', route: 'dashboard/client/report-upload', icon: 'report' },
        { name: 'CONAGUA', route: 'dashboard/client/company-info', icon: 'copyright' }
      ];
    } else if (this.user.rol == 1){
      this.fillerNav = [
        { name: 'Registrar cliente', route: 'dashboard/capturist/register-client', icon: 'person_add' },
        { name: 'Ver clientes', route: 'dashboard/capturist/clients', icon: 'group' }
      ];
    } else if (this.user.rol == 3){
      this.fillerNav = [
        { name: 'Registrar usuario', route: 'dashboard/admin/register-user', icon: 'person_add' },
        { name: 'Ver usuarios', route: 'dashboard/admin/view-users', icon: 'group' },
        { name: 'Mantenimientos', route: 'dashboard/admin/maintenances', icon: 'engineering' },
        { name: 'Compañia', route: 'dashboard/admin/company', icon: 'store' }
      ];
    }

    this.selectedRoute = this.fillerNav[0].route
    this.selectedListLeft(this.selectedRoute);

  }

  async onFileSelected(event: Event) {

    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.selectedFile = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.imageUrl = reader.result;
        this.user.imagen = this.imageUrl;
      };

      reader.readAsDataURL(file);
      let form = new FormData();
      form.set("img", file);
      try {
        let res = await lastValueFrom(this.clientSer.changeImage(form));
        Swal.fire("Logotip actuializado", "El logo se actualizo correctamente.", "success");
        console.log(res);
      } catch (error: any) {
        console.log(error);

      }
    }
  }


  selectedListLeft(route: string): void {
    // Remueve la clase 'active' de todos los <a>
    document.querySelectorAll(".btn-datos").forEach(link => {
      link.classList.remove("active");
    });
    // Remueve la clase 'active' de todos los divs
    this.selectedRoute = route;
    this._router.navigate([route]);
  }

  closeSesion(){
    this.coockieServ.delete("token");
    this._router.navigate(["/"]);
  }

  my_perfil(event: Event) {
      // Remueve la clase 'active' de todos los <a>
      document.querySelectorAll(".colorCustom").forEach(link => {
        link.classList.remove("active");
      });

      // Agrega la clase 'active' solo al <a> clickeado
      const clickedElement = event.currentTarget as HTMLElement;
      clickedElement.classList.add("active");

    if(this.user.rol == 0){
      this._router.navigate(["/dashboard/client/my-perfil"]);
    } else if(this.user.rol == 1){
      //this._router.navigate(["/dashboard/capturist/my-perfil"]);
    } else if(this.user.rol == 3){
      this._router.navigate(["/dashboard/admin/perfil"]);
    }
  }
}
