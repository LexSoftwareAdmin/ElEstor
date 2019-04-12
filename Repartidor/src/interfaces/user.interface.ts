export class user {
    id_repartidor:number;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    contrasena: string;
    fotografia: any;
    foto: string;
    estatus: number;
    datecreate: string;
    dateupdate: string;
    email: string;
    latitud: number;
    longitud: number;
    valoracion: number;

    constructor() { }

    clear() {
        this.nombre = "";
        this.apellidoPaterno = "";
        this.apellidoMaterno = "";
        this.contrasena = "";
        this.foto = "";
        this.estatus = 1;
        this.datecreate = "";
        this.dateupdate = "";
        this.email = "";
    }
}