
import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

// - IMPORTS
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';

// - PROVIDERS
import { MatListModule } from '@angular/material/list';
import { NgModule } from '@angular/core';

export interface PeriodicElement {
  mes: string;
  estado: string;
  monto: number;
  recibo_agua: string;
  recibo_pago: string;
  fech_upload: Date;
  fech_confirm: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  { mes: "Enero", estado: "Validado", monto: 1200.0, recibo_agua: "H", recibo_pago: "cb", fech_upload: new Date("2025-01-05 08:30:15"), fech_confirm: "07-01-2025" },
  { mes: "Enero", estado: "Pendiente", monto: 800.5, recibo_agua: "M", recibo_pago: "efectivo", fech_upload: new Date("2025-01-10 14:12:30"), fech_confirm: "15-01-2025" },
  { mes: "Febrero", estado: "Validado", monto: 950.75, recibo_agua: "H", recibo_pago: "cb", fech_upload: new Date("2025-02-03 10:45:20"), fech_confirm: "05-02-2025" },
  { mes: "Febrero", estado: "Pendiente", monto: 1100.0, recibo_agua: "L", recibo_pago: "tarjeta", fech_upload: new Date("2025-02-14 17:25:40"), fech_confirm: "18-02-2025" },
  { mes: "Marzo", estado: "Validado", monto: 700.0, recibo_agua: "H", recibo_pago: "cb", fech_upload: new Date("2025-03-07 09:10:05"), fech_confirm: "10-03-2025" },
  { mes: "Marzo", estado: "Pendiente", monto: 1050.6, recibo_agua: "M", recibo_pago: "transferencia", fech_upload: new Date("2025-03-15 13:40:55"), fech_confirm: "20-03-2025" },
  { mes: "Abril", estado: "Validado", monto: 1300.4, recibo_agua: "L", recibo_pago: "cb", fech_upload: new Date("2025-04-05 07:30:00"), fech_confirm: "08-04-2025" },
  { mes: "Abril", estado: "Pendiente", monto: 600.2, recibo_agua: "H", recibo_pago: "efectivo", fech_upload: new Date("2025-04-20 15:50:35"), fech_confirm: "25-04-2025" },
  { mes: "Mayo", estado: "Validado", monto: 900.9, recibo_agua: "M", recibo_pago: "cb", fech_upload: new Date("2025-05-12 11:15:10"), fech_confirm: "15-05-2025" },
  { mes: "Mayo", estado: "Pendiente", monto: 1150.3, recibo_agua: "L", recibo_pago: "tarjeta", fech_upload: new Date("2025-05-18 16:20:45"), fech_confirm: "22-05-2025" },
  { mes: "Junio", estado: "Validado", monto: 980.5, recibo_agua: "H", recibo_pago: "transferencia", fech_upload: new Date("2025-06-07 10:05:25"), fech_confirm: "10-06-2025" },
  { mes: "Junio", estado: "Pendiente", monto: 1250.8, recibo_agua: "M", recibo_pago: "cb", fech_upload: new Date("2025-06-21 18:35:55"), fech_confirm: "26-06-2025" }
];

@Component({
  selector: 'app-payments-history',
  imports: [MatIconModule, RouterModule, MatPaginatorModule, MatTableModule,
            CommonModule, MatCardModule, MatFormField, MatLabel, MatSelect, MatOption],
  providers: [MatListModule, NgModule],
  templateUrl: './payments-history.component.html',
  styleUrl: './payments-history.component.css'
})
export class PaymentsHistoryComponent {
  displayedColumns: string[] = ['mes', 'estado', 'monto', 'recibo_agua', 'recibo_pago', 'fech_upload', 'fech_confirm'];
  dataSource = ELEMENT_DATA;
  lowValue: number = 0;
  highValue: number = 5;
  pageOptions = [this.highValue, 10];

  constructor(){
    ELEMENT_DATA.sort((a, b) =>  b.fech_upload.getTime() - a.fech_upload.getTime());
  }

  getPaginatorData(event:PageEvent): PageEvent{
    console.log(event);
    this.lowValue = event.pageIndex * event.pageSize;
    this.highValue = this.lowValue + event.pageSize;
    return event;
  }

  dwn_rec_agua(mes:string){
    console.log(mes);
  }
  dwn_rec_pago(mes:string){
    console.log(mes);
  }
}
