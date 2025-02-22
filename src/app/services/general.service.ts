import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {CookieService} from 'ngx-cookie-service';

export interface JwtPayloadUser {
  email: string;
  id_company: string;
  sub: string;
}

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  public url_server:string;
  /**
   * La función constructora inicializa el HttpClient y establece los valores de URL y token.
   * @param {HttpClient} _http - El parámetro `_http` es de tipo `HttpClient`,
   * que es un servicio proporcionado por Angular para realizar peticiones HTTP a un servidor. Permite
   * enviar peticiones GET, POST, PUT, DELETE, etc. a un servidor backend y manejar las respuestas.
   */
  constructor(public _http:HttpClient, private cookieService: CookieService) {
    this.url_server = "http://localhost:5000";
  }
  public init_dashboard():Observable<any> {
    return this._http.get(this.url_server+"/init-dashboard", { headers: this.headerToken() });
  }
  public isAuth():Observable<any> {
    return this._http.get(this.url_server+"/auth-token", { headers: this.headerToken() });
  }
  public login(fomData: any):Observable<any>{
    return this._http.post(this.url_server+'/login', fomData);
  }
  public sendEmail(mail: string, form: any):Observable<any>{
    return this._http.post(this.url_server+'/enviar_usuario/'+mail, form);
  }
  public get_paises():Observable<any>{
    return this._http.get(this.url_server+'/get-paises');
  }
  public get_estados(id_pais:number):Observable<any>{
    return this._http.get(this.url_server+'/get-estados/'+id_pais);
  }
  public get_municipios(id_estado:number):Observable<any>{
    return this._http.get(this.url_server+'/get-municipios/'+id_estado);
  }
  public get_colonias(id_colonias:number):Observable<any>{
    return this._http.get(this.url_server+'/get-colonias/'+id_colonias);
  }
  public getToken():string {
    return this.cookieService.get('token');
  }
  public headerToken():HttpHeaders{
    let token = this.cookieService.get('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }
}
