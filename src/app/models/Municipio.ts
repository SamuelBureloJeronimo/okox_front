import { EstadoModel } from "./Estado";

export class MunicipioModel {
  id: number = -1;
  nombre: string = '';
  estado: EstadoModel = new EstadoModel();
}
