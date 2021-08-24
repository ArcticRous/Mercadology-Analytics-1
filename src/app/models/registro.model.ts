

export class RegistroModel{
    id: string;
    nombre: string; 
    apellido: string;
    puesto?: string;
    rol?: string;
    depto?: string;
    correo?: string; 
    password?: string;
    telefono?: string;
    celular?: string;
    urlPhoto?: string;
    habilitado?: Boolean;

    constructor(){
        this.habilitado = true;
    }
}

