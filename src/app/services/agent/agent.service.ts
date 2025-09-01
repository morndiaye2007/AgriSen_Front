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
    console.log('🔍 Service getAllAgents appelé avec:', req);
    let parametres: HttpParams = new HttpParams()
    if(req){
      if(req?.nomComplet){
        parametres = parametres.append("nomComplet", req.nomComplet);
      }
      if(req?.matricule){
        parametres = parametres.append("matricule", req.matricule);
      }
      if(req?.notes){
        parametres = parametres.append("notes", req.notes);
      }
      if(req?.notesMin){
        parametres = parametres.append("notesMin", req.notesMin);
      }
      if(req?.notesMax){
        parametres = parametres.append("notesMax", req.notesMax);
      }
      if(req?.notesEqual){
        parametres = parametres.append("notesEqual", req.notesEqual);
      }
      if(req?.ageMin){
        parametres = parametres.append("ageMin", req.ageMin);
      }
      if(req?.ageMax){
        parametres = parametres.append("ageMax", req.ageMax);
      }
      if(req?.ageEqual){
        parametres = parametres.append("ageEqual", req.ageEqual);
      }
      if(req?.dateMin){
        parametres = parametres.append("dateMin", req.dateMin);
      }
      if(req?.dateMax){
        parametres = parametres.append("dateMax", req.dateMax);
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

      const url = `${environment.baseUrl}agents/all?page=${req?.page}&size=${req?.size}`;
      console.log('🔍 URL de requête:', url);
      console.log('🔍 Paramètres HTTP:', parametres.toString());
      
      return this.http.get<any>(url, { params: parametres });
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

  downloadFichier(id: number): Observable<Blob> {
  return this.http.get(`${environment.baseUrl}/download/${id}`, { responseType: 'blob' });
}
 // 🔹 PAYS
  getAllPays(): Observable<any[]> {
    return this.http.get<any>(`${environment.baseUrl}pays/all`)
      .pipe(map(res => res.payload));
  }
  // 🔹 PAYS
  getAllFilere(): Observable<any[]> {
    return this.http.get<any>(`${environment.baseUrl}filieres-suivi/all`)
      .pipe(map(res => res.payload));
  }

  getPaysById(id: number): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}pays/${id}`);
  }



}
