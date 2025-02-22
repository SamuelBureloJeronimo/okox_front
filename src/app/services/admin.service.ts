import { Injectable } from '@angular/core';
import { GeneralService } from './general.service';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminService extends GeneralService{

  public create_user(form:any):Observable<any> {
    return this._http.post(this.url_server+"/admin/create-user", form, { headers: this.headerToken() });
  }
}
