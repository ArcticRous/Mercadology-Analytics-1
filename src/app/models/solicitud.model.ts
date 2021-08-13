export class SolicitudModel{
    id?:string;
    cuenta: string;
    fecha: string;
    email: string;
    material: string;
    disenos: number;
    desDisenos: string;
    infDisenos: string;
    imagenes: any;
    urgencia: string;
    existeMaterial: string;
    numDisenos: string;
    fileMaterial?: any;
    fechaEntrega?: string;
}