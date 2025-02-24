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
  public get_users():Observable<any>{
    return this._http.get(this.url_server+"/admin/get-users", { headers: this.headerToken() });
  }
  public search_tec(rfc: string):Observable<any>{
    return this._http.get(this.url_server+"/admin/search-tec/"+rfc, { headers: this.headerToken() });
  }
  public register_mant(form: any):Observable<any>{
    return this._http.post(this.url_server+"/admin/register-manten", form, { headers: this.headerToken() });
  }
}
