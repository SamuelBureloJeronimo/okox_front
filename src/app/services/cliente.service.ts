import { Injectable } from '@angular/core';
import { GeneralService } from './general.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ClienteService extends GeneralService {

  public changeImage(data:any): Observable<any> {
    return this._http.post(this.url_server+"/change-image-profile", data, { headers: this.headerToken() });
  }

  public sendReport(formData: any):Observable<any>{
    return this._http.post(this.url_server+'/clientes/upload-report', formData, { headers: this.headerToken() });
  }
  public getAllReports():Observable<any>{
    return this._http.get(this.url_server+'/clientes/get-all-reports', { headers: this.headerToken() });
  }
}
