import { Observable } from 'rxjs/Observable';
import { User, Negocio, CatNegocio, SubCatNegocio } from './../../models/model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, tap } from 'rxjs/operators';

//Cadenas de conexión originales. (6 de Abril del 2019)
/*const baseurlRegistro: string = "https://localhost:8888/api/registro/usuario";
const baseurlActualizar: string = "https://localhost:8888/api/cuenta/actualizar";
const baseurlLogin: string = "http://localhost:8888/api/usuario/inicio";
const baseurlRecuperar: string = "https://localhost:8888/api/cuenta/recuperar";*/

//Cadenas de conexión módificadas. (6 de Abril del 2019)
const baseurlRegistro: string = "https://localhost:5001/api/registro/usuario";
const baseurlActualizar: string = "https://localhost:5001/api/cuenta/actualizar";
const baseurlLogin: string = "https://localhost:5001/api/usuario/inicio";
const baseurlRecuperar: string = "https://localhost:5001/api/cuenta/recuperar";

//Cadena de conexión original para funciones de los negocios. (6 de Abril del 2019)
/*const baseurlNegocio: string = "https://localhost:8888/api/negocio/agregar";
const baseurlNegocioObtener: string = "https://localhost:8888/api/negocio/obtener";
const baseurlCatNegocio: string = "https://localhost:8888/api/negocio/catnegocio";
const baseurlSubCatNegocio: string = "https://localhost:8888/api/negocio/subcatnegocio";*/

//Cadena de conexión modificadas para funciones de los negocios. (6 de Abril del 2019)
const baseurlNegocio: string = "https://localhost:5001/api/negocio/agregar";
const baseurlNegocioObtener: string = "https://localhost:5001/api/negocio/obtener";
const baseurlCatNegocio: string = "https://localhost:5001/api/negocio/catnegocio";
const baseurlSubCatNegocio: string = "https://localhost:5001/api/negocio/subcatnegocio";


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':'application/json'
  })
};

@Injectable()
export class ElstorapiProvider {


  constructor(public http: HttpClient) {

  }

  registrarUsuario(usr: User): Observable<User>
  {
    let userModel =  JSON.stringify(usr);
    return this.http.post<User>(baseurlRegistro, userModel, httpOptions)
    .pipe(
      tap((data: any) => {
        debugger;
      //console.log(data);
  }),
  catchError((err) => {
    debugger;
    throw 'Error in source. Details: ' + err; // Use console.log(err) for detail
        })
  );
  }


  actualizarCuenta(usr: User): Observable<User>
  {
    let userModel =  JSON.stringify(usr);
    return this.http.post<User>(baseurlActualizar, userModel, httpOptions)
    .pipe(
      tap((data: any) => {
        debugger;
        //console.log(data);
    }),
    catchError((err) => {
      debugger;
      throw 'Error in source. Details: ' + err; // Use console.log(err) for detail
          })
   );

  }
    recuperarCuenta(usr: User): Observable<User>
    {
      let userModel =  JSON.stringify(usr);
      return this.http.post<User>(baseurlRecuperar, userModel, httpOptions)
      .pipe(
        tap((data: any) => {
          debugger;
          //console.log(data);
      }),
      catchError((err) => {
        debugger;
        throw 'Error in source. Details: ' + err; // Use console.log(err) for detail
            })
          );
    }

    inicarSesion(usr: User): Observable<User>
    {
      let userModel =  JSON.stringify(usr);
      return this.http.post<User>(baseurlLogin, userModel, httpOptions)
      .pipe(
        tap((data: any) => {
          debugger;
          //console.log(data);
      }),
      catchError((err) => {
        debugger;
        throw 'Error in source. Details: ' + err; // Use console.log(err) for detail
            })
        );
    }

    agregarNegocio(biz: Negocio): Observable<Negocio>
    {
      let negocioModel =  JSON.stringify(biz);
      return this.http.post<Negocio>(baseurlNegocio, negocioModel, httpOptions)
      .pipe(
        tap((data: any) => {
          debugger;
          //console.log(data);
      }),
      catchError((err) => {
        debugger;
        throw 'Error in source. Details: ' + err; // Use console.log(err) for detail
            })
        );
    }

    obtenerNegocio(clientid: string): Observable<Negocio[]>
    {
      let id =  JSON.stringify(clientid);
      return this.http.post<Negocio[]>(baseurlNegocioObtener, id, httpOptions)
      .pipe(
        tap((data: any) => {
          debugger;
          //console.log(data);
      }),
      catchError((err) => {
        debugger;
        throw 'Error in source. Details: ' + err; // Use console.log(err) for detail
          })
        );
    }

    getCatNegocio(): Observable<CatNegocio[]>
    {
      return this.http.post<CatNegocio[]>(baseurlCatNegocio, httpOptions)
      .pipe(
        tap((data: any) => {
          debugger;
          //console.log(data);
      }),
      catchError((err) => {
        debugger;
        throw 'Error in source. Details: ' + err; // Use console.log(err) for detail
          })
        );
    }

    getSubCatNegocio(id: number) : Observable<SubCatNegocio[]>
    {
      return this.http.post<SubCatNegocio[]>(baseurlSubCatNegocio, id, httpOptions)
      .pipe(
        tap((data: any) => {
          debugger;
          //console.log(data);
      }),
      catchError((err) => {
        debugger;
        throw 'Error in source. Details: ' + err; // Use console.log(err) for detail
          })
        );
    }

}
