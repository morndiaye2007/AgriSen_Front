import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AgentService {

  constructor(protected http : HttpClient) { }

  createAgent(agent:any):Observable<any>{
    return this.http.post<any>(`${environment.baseUrl}agents`,agent)
  }

  updateAgent(agentId:any, agent:any):Observable<any>{
    return this.http.put<any>(`${environment.baseUrl}agents/${agentId}`,agent)
  }

  getAgentId(agentId:any):Observable<any>{
    return this.http.get<any>(`${environment.baseUrl}agents/${agentId}`)
  }

  getAllAgents(req?: any): Observable<any> {
    let parametres: HttpParams = new HttpParams()
    if(req){
      if(req?.nomComplet){
        parametres = parametres.append("nomComplet", req.nomComplet);
      }
      if(req?.matricule){
        parametres = parametres.append("matricule", req.matricule);
      }
      if(req?.description){
        parametres = parametres.append("description", req.description);
      }  
      if(req?.age){
        parametres = parametres.append("age", req.age);
      }  
      if(req?.dateNaissance){
        parametres = parametres.append("dateNaissance", req.dateNaissance);
      }  
      if(req?.email){
        parametres = parametres.append("email", req.email);
      }  
      if(req?.sexe){
        parametres = parametres.append("sexe", req.sexe);
      }  
      if(req?.preferences){
        parametres = parametres.append("preferences", req.preferences);
      }  
      if(req?.pays){
        parametres = parametres.append("pays", req.pays);
      }  
      if(req?.telephone){
        parametres = parametres.append("telephone", req.telephone);
      }  

      return this.http.get<any>(
        `${environment.baseUrl}agents/all?page=${req?.page}&size=${req?.size}`,
        { params: parametres }
      );
    } else {
      return this.http.get<any>(
        `${environment.baseUrl}agents/all?page=0&size=100000`,
        { params: parametres }
      );
    }
  }

  deleteAgent(agentId: any): Observable<any> {
    return this.http.delete<any>(`${environment.baseUrl}agents/${agentId}`, {
      observe: 'response',
    });
  }

  getAllFormation(): Observable<any[]> {
    return this.http.get<any>(`${environment.baseUrl}formations`)
      .pipe(map(res => res.payload)); // ⚡ on prend que payload
  }

  getAllPoste(): Observable<any[]> {
    return this.http.get<any>(`${environment.baseUrl}postes/all`)
      .pipe(map(res => res.payload)); // ⚡
  }

  getAllDepartement(): Observable<any[]> {
    return this.http.get<any>(`${environment.baseUrl}departements/all`)
      .pipe(map(res => res.payload)); // ⚡
  }

  getAllLangues(): Observable<any[]> {
    return this.http.get<any>(`${environment.baseUrl}langue/all`)
      .pipe(map(res => res.payload)); // ⚡
  }

}
