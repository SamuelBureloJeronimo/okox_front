import { Component } from '@angular/core';

// IMPORTACIÓN DE MODULOS
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

// IMPORTACIÓN DE SERVICIOS
import { ClienteService } from '../../services/cliente.service';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-home',
  imports: [MatIconModule, RouterModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  rol: any
  notifications: any[] = [];
  showNotifications = false;

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }

  constructor(private clienteServ: ClienteService, private _router:Router, private cookieServ: CookieService){

  }
  async ngOnInit() {
    this.rol = localStorage.getItem("rol");
  }
  salir(){
    this.cookieServ.deleteAll();
    this._router.navigate(['/home']).then(() => {
        // Esto asegura que la página se recargue solo después de la navegación
        window.location.reload();  // Recarga la página después de la navegación
    });
  }
}
