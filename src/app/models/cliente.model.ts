export class ClienteModel{
    ids: string;
    nomcli: string;	
    domcli?: string;
    domven?: string;
    dirip?: string;	
    dbnam?: string;	
    dbuse?: string;	
    dbpas?: string;	
    ftpuse?: string;	
    ftppas?: string;	
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