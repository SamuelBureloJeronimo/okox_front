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
import { ViewUsersComponent } from './components/dashboard/admin/view-users/view-users.component';
import { MaintenanceComponent } from './components/dashboard/admin/maintenance/maintenance.component';
import { RegisterDeviceComponent } from './components/dashboard/technician/register-device/register-device.component';
import { IncidentsComponent } from './components/dashboard/technician/incidents/incidents.component';

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
          { path: 'company-info', component: CompanyComponent },
          { path: 'my-perfil', component: MyPerfilComponent },
        ]
      },
      { path: 'admin',
        canActivate: [AdminGuard],
        children: [
          { path: 'register-user', component: RegisterUserComponent, canActivate: [AdminGuard] },
          { path: 'view-users', component: ViewUsersComponent, canActivate: [AdminGuard] },
          { path: 'maintenances', component: MaintenanceComponent, canActivate: [AdminGuard] },
          { path: 'company', component: CompanyComponent, canActivate: [AdminGuard] },
          { path: 'perfil', component: MyPerfilComponent, canActivate: [AdminGuard] }
        ]
      },
      {
        path: 'technician',
        children: [
          { path: 'register-device', component: RegisterDeviceComponent },
          { path: 'view-devices', component: RegisterDeviceComponent },
          { path: 'incidents', component: IncidentsComponent }
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
