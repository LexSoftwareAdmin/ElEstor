
export class User
{
  clientid:string = "";
  nombre: string = "";
  apellidoPaterno: string = "";
  apellidoMaterno: string = "";
  nombreUsuario:string = "";
  password: string = "";
  confirmPassword: string = "";
  email : string = "";
  numeroTelefonico:string = "";
  negocio: Negocio[];

  constructor()
  {

  }
}

export class Negocio
{
    clientid: string = "";
    nombre:string = "";
    callenumero:string = "";
    colonia:string = "";
    ciudad:string = "";
    estado:string = "";
    codigopostal:string = "";
    horaapertura:string = "";
    horacierre:string = "";
    categoria:string = "";
    FK_subcategoria:string = "";
    descripcion:string = "";
    latitud:string = "";
    longitud:string = "";

    constructor()
  {

  }
}

export class CatNegocio
{
   descripcion:string = "";
   id_catNegocio:number = -1;
   nombre:string = "";

   constructor()
  {

  }
}

export class SubCatNegocio
{
   nombre:string = "";
   descripcion: string = "";
   FK_CATNEGOCIO:number = -1;

   constructor()
  {

  }
}

