import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaysService {

  constructor(protected http : HttpClient) { }
  
    createPays(pays:any):Observable<any>{
      return this.http.post<any>(`${environment.baseUrl}pays`,pays)
  
    }
     updatePays(PaysId:any, pays:any):Observable<any>{
      return this.http.put<any>(`${environment.baseUrl}pays/${PaysId}`,pays)
     }
  
     getPaysId(PaysId:any):Observable<any>{
      return this.http.get<any>(`${environment.baseUrl}pays/${PaysId}`)
     }
     getAllPays(req?: any): Observable<any> {
      let parametres: HttpParams = new HttpParams()
      if(req){
        if(req?.code != undefined && req?.code){
          parametres = parametres.append("code", req?.code);
        }
        if(req?.libelle != undefined && req?.libelle){
          parametres = parametres.append("libelle", req?.libelle);
        }
        
           
        return this.http.get<any>(
          `${environment.baseUrl}pays/all?page=${req?.page}&size=${req?.size}`,{
            params: parametres
          }
        );
      }else{
        return this.http.get<any>(
          `${environment.baseUrl}pays/all?page=${0}&size=${100000}`,{
            params: parametres
          }
        );
      }
    }
  
    deletePays(PaysId: any): Observable<any> {
      return this.http.delete<any>(`${environment.baseUrl}pays/${PaysId}`, {
        observe: 'response',
      });
    }
}
