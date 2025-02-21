import { Component, ChangeDetectorRef, inject, AfterViewInit } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'

// - IMPORTS
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatDrawerMode, MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';


// - PROVIDERS
import { MediaMatcher } from '@angular/cdk/layout';
import { ClienteService } from '../../services/cliente.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-dash-client',
  imports: [MatIconModule, RouterModule, CommonModule, MatSidenavModule, MatListModule],
  providers: [MediaMatcher, ClienteService],
  templateUrl: './dash-client.component.html',
  styleUrl: './dash-client.component.css'
})
export class DashClientComponent implements AfterViewInit {
    modeSideBar: MatDrawerMode = "side"
   hasBack: string = "false";

   hidden = false;
   mobileQuery: MediaQueryList;

   fillerNav = [
    { name: 'Consumo', route: 'my-consume', icon: 'water_drop' },
    { name: 'Subir pago', route: 'payment-upload', icon: 'payments' },
    { name: 'Historial de pago', route: 'payments-history', icon: 'history' },
    { name: 'Reportar fuga', route: 'report-upload', icon: 'report' },
    { name: 'CONAGUA', route: 'company-info', icon: 'copyright' }
  ];

   loading: boolean = true;

   public logo: any;
   public img_user: any;
   public username: string;
   public correo: string;

   imageUrl: string | ArrayBuffer | null = null;
    selectedFile!: File;


   constructor(private _router:Router, private clientSer: ClienteService, private coockieServ:CookieService) {
     this.logo = "";
     this.img_user = "";
     this.username = "";
     this.correo = "";
     const changeDetectorRef = inject(ChangeDetectorRef);
     const media = inject(MediaMatcher);

     this.mobileQuery = media.matchMedia('(max-width: 600px)');
     this._mobileQueryListener = () => changeDetectorRef.detectChanges();
     this.mobileQuery.addListener(this._mobileQueryListener);
   }

   async ngOnInit() {
     let res = await lastValueFrom(this.clientSer.init_dashboard());
     this.logo = this.clientSer.url_server+"/image/companies/"+res.logo;
     this.img_user = this.clientSer.url_server+"/image/clients/"+res.img_user;
     console.log(this.logo, this.img_user);
     this.username = res.username;
     this.correo = res.email;
     this.loading = false;
   }
   ngAfterViewInit(): void {
     this.changeList("my-consume");
   }

   async onFileSelected(event: Event) {

    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.selectedFile = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.imageUrl = reader.result;
        this.img_user = this.imageUrl;
      };

      reader.readAsDataURL(file);
      let form = new FormData();
      form.set("email", this.correo);
      form.set("dest", "0");
      form.set("img", file);
      try {
        let res = await lastValueFrom(this.clientSer.changeImage(form));
        Swal.fire("Logotip actuializado", "El logo se actualizo correctamente.", "success");
        console.log(res);
      } catch (error:any) {
        console.log(error);

      }
    }
  }

   private _mobileQueryListener: () => void;

   toggleBadgeVisibility() {
     this.hidden = !this.hidden;
   }

   changeList(route:string){

     this.resetDef("my-consume");
     this.resetDef("payment-upload");
     this.resetDef("payments-history");
     this.resetDef("report-upload");
     this.resetDef("company-info");


     // Cambiar el color del elemento seleccionado
     const a_sv = document.getElementById("id_sb_"+route);
     if (a_sv) {
       a_sv.style.backgroundColor = '#F0F0F0'; // O cualquier color deseado
       a_sv.style.color = '#F59E0B';
     }
     const mat_ic = document.getElementById('side_tp_'+route);
     if (mat_ic) {
       mat_ic.style.color = '#F59E0B'; // Cambia el color del div dentro del <a>
     }
     const lb_sv_ = document.getElementById('lb_sv_'+route);
     if (lb_sv_) {
       lb_sv_.style.color = '#F59E0B'; // Cambia el color del div dentro del <a>
     }
   }

   resetDef(route:string) {
     // Cambiar el color del elemento seleccionado
     const a_sv = document.getElementById("id_sb_"+route);
     if (a_sv) {
       a_sv.style.backgroundColor = ''; // O cualquier color deseado
       a_sv.style.color = 'white';
     }
     const mat_ic = document.getElementById('side_tp_'+route);
     if (mat_ic) {
       mat_ic.style.color = 'white'; // Cambia el color del div dentro del <a>
     }
     const lb_sv_ = document.getElementById('lb_sv_'+route);
     if (lb_sv_) {
       lb_sv_.style.color = 'white'; // Cambia el color del div dentro del <a>
     }
   }

   changeView(ruta: string): void {
     if (ruta === 'salir') {
       this._router.navigateByUrl('/');
     }
     else if (ruta === 'cerrar-sesion') {
      this.coockieServ.delete('token');
      this.coockieServ.delete('email');
      this.coockieServ.delete('rol');
      this._router.navigate(['/']).then(() => {
        // Esto asegura que la página se recargue solo después de la navegación
        window.location.reload(); // Recarga la página después de la navegación
      });
     } else {
       this.changeList(ruta);
       this._router.navigateByUrl('/dash-client/' + ruta);
     }
   }
}
function provideAnimations(): import("@angular/core").Provider {
  throw new Error('Function not implemented.');
}

