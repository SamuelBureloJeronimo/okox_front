import { Routes, CanActivateFn, CanActivateChildFn } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { DashClientComponent } from './components/dash-client/dash-client.component';
import { MyConsumeComponent } from './components/dash-client/my-consume/my-consume.component';
import { ClientGuard } from './guards/client.guard';
import { PaymentsHistoryComponent } from './components/dash-client/payments-history/payments-history.component';
import { PaymentUploadComponent } from './components/dash-client/payment-upload/payment-upload.component';
import { ReportUploadComponent } from './components/dash-client/report-upload/report-upload.component';
import { CompanyInfoComponent } from './components/dash-client/company-info/company-info.component';
import { MyPerfilComponent } from './components/dash-client/my-perfil/my-perfil.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dash-client', component: DashClientComponent,
    canActivateChild: [ClientGuard],
    children: [
      { path: 'my-consume', component: MyConsumeComponent },
      { path: 'payment-upload', component: PaymentUploadComponent },
      { path: 'payments-history', component: PaymentsHistoryComponent },
      { path: 'report-upload', component: ReportUploadComponent },
      { path: 'company-info', component: CompanyInfoComponent },
      { path: 'my-perfil', component: MyPerfilComponent },
    ]
  }
];
