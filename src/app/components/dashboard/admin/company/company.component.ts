import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CompanyModel } from '../../../../models/Company';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-company',
  imports: [CommonModule, MatIconModule, MatCardModule, MatDividerModule, MatGridListModule],
  templateUrl: './company.component.html',
  styleUrl: './company.component.css'
})
export class CompanyComponent {

  company: CompanyModel = new CompanyModel();

  constructor(){
    this.company.nombre = "OKOX Company"
    this.company.rfc_user = "RFC"
    this.company.descripcion = "Okox es un sistema gestor inteligente de redes de agua potable"
    this.company.facebook = "RFC"
    this.company.linkedIn = "RFC"
    this.company.id_colonia = 1
    this.company.link_x = "RFC"
    this.company.logo = "http://localhost:5000/companies/be06ef35-bdde-48ec-80e1-6c25c4d34f88.jpeg"
    this.company.telefono = "854614616"
  }

}
