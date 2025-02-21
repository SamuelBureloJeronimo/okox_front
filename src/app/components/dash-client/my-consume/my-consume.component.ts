import { Component } from '@angular/core';
import { Chart, registerables } from 'chart.js';

import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-my-consume',
  imports: [MatCardModule],
  providers: [],
  templateUrl: './my-consume.component.html',
  styleUrl: './my-consume.component.css'
})
export class MyConsumeComponent {
  idCliente: any;
  public chart: any;

  constructor(){

  }

  ngAfterViewInit(): void {
    // Registrar todos los componentes de Chart.js (esto incluye las escalas)
    Chart.register(...registerables);
    this.createChart();
  }

  createChart() {
    this.chart = new Chart('canvas', {
      type: 'bar',
      data: {
        labels: ['Último mes', 'Última semana', 'Hoy'],
        datasets: [{
          label: 'Promedio de presión',
          data: [430, 605, 402],  // Aquí van los datos de tu API
          backgroundColor: 'rgba(0, 15, 245, 0.6)',
        },
        {
          label: 'Total de agua consumida',
          data: [150, 750, 306],  // Aquí van los datos de tu API
          backgroundColor: 'rgba(200, 165, 245, 0.6)',
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }
}
