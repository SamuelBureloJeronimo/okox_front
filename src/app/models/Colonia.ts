import { MunicipioModel } from "./Municipio";

export class ColoniaModel {
  id: number = -1;
  nombre: string = '';
  ciudad: string = '';
  municipio: MunicipioModel = new MunicipioModel;
  asentamiento: string = '';
  codigo_postal: number = -1;
}
