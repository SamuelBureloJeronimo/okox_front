import { Routes, CanActivateFn, CanActivateChildFn } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { MyConsumeComponent } from './components/dashboard/client/my-consume/my-consume.component';
import { ClientGuard } from './guards/client.guard';
import { PaymentsHistoryComponent } from './components/dashboard/client/payments-history/payments-history.component';
import { PaymentUploadComponent } from './components/dashboard/client/payment-upload/payment-upload.component';
import { ReportUploadComponent } from './components/dashboard/client/report-upload/report-upload.component';
import { CompanyInfoComponent } from './components/dashboard/client/company-info/company-info.component';
import { MyPerfilComponent } from './components/dashboard/client/client-perfil/client-perfil.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegisterUserComponent } from './components/dashboard/admin/register-user/register-user.component';
import { CompanyComponent } from './components/dashboard/admin/company/company.component';
import { PerfilComponent } from './components/dashboard/admin/perfil/perfil.component';
import { AdminGuard } from './guards/admin.guard';
import { RegisterClientComponent } from './components/dashboard/capturist/register-client/register-client.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent,
    children: [
      { path: 'client',
        canActivateChild: [ClientGuard],
        children: [
          { path: 'my-consume', component: MyConsumeComponent },
          { path: 'payment-upload', component: PaymentUploadComponent },
          { path: 'payments-history', component: PaymentsHistoryComponent },
          { path: 'report-upload', component: ReportUploadComponent },
          { path: 'company-info', component: CompanyInfoComponent },
          { path: 'my-perfil', component: MyPerfilComponent },
        ]
      },
      { path: 'admin',
        canActivate: [AdminGuard],
        children: [
          { path: 'register-user', component: RegisterUserComponent },
          { path: 'company', component: CompanyComponent },
          { path: 'perfil', component: PerfilComponent }
        ]
      },
      {
        path: 'capturist',
        children: [
          { path: 'register-client', component: RegisterClientComponent }
        ]
      }
    ]
  }
];
