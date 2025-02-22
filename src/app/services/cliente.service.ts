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

  public sendReport(id_cliente:string, formData: any):Observable<any>{
    return this._http.post(this.url_server+'/crear-reporte/'+id_cliente, formData);
  }

  public get_Notifi(id_cliente:string):Observable<any>{
    return this._http.get(this.url_server+'/obtener-notificaciones/'+id_cliente);
  }

  public get_Client(id_cliente:string):Observable<any>{
    return this._http.get(this.url_server+'/obtener-data-cliente/'+id_cliente);
  }
  public get_Presion(id_cliente:string):Observable<any>{
    return this._http.get(this.url_server+'/obtener-presion/'+id_cliente);
  }
  public update_Client(id_cliente:string, formatData: any):Observable<any>{
    return this._http.put(this.url_server+'/actualizar-datos-personales/'+id_cliente, formatData);
  }
}
