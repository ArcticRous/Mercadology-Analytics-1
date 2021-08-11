export class SolicitudModel{
    id:string;
    cuenta: string;
    fecha: string;
    correo: string;
    material: string;
    disenos: number;
    desDisenos: string;
    infDisenos: string;
    urgencia: string;
    existeMaterial: boolean;
    fileMaterial?: any;

    constructor(){
        this.existeMaterial = false;
    }
}