export class ClienteModel{
    ids: string;
    nomcli: string;	
    domcli?: string;
    domven?: string;
    dirip?: string;		
    hosnom?: string;
    hosven?: string;
    hosuse?: string;
    hospas?: string;
    domubi?: string;
    domuse?: string;
    dompas?: string;
    cuecor?: string; 
    cuepas?: string; 			
    venssl?: string;
    estado: Boolean;

    msj?: string;

    constructor(){
        this.estado= true;
    }
}