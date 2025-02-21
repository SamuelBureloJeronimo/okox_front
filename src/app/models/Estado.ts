import { PaisModel } from "./Pais";

export class EstadoModel {
  id: number = -1;
  nombre: string = '';
  pais: PaisModel = new PaisModel();
}
