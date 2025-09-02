import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AgentService {
code: any;
symbole: any;

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
      if(req?.notesGt){
        parametres = parametres.append("notesGt", req.notesGt);
      }
      if(req?.notesLt){
        parametres = parametres.append("notesLt", req.notesLt);
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
      if(req?.ageGt){
        parametres = parametres.append("ageGt", req.ageGt);
      }
      if(req?.ageLt){
        parametres = parametres.append("ageLt", req.ageLt);
      }
      if(req?.dateMin){
        parametres = parametres.append("dateMin", req.dateMin);
      }
      if(req?.dateMax){
        parametres = parametres.append("dateMax", req.dateMax);
      }
      // Mapper égalité de date (UI -> API)
      if(req?.dateNaissanceEqual){
        parametres = parametres.append("dateNaissance", req.dateNaissanceEqual);
      }
      // Opérateurs stricts sur la date
      if(req?.dateGt){
        parametres = parametres.append("dateGt", req.dateGt);
      }
      if(req?.dateLt){
        parametres = parametres.append("dateLt", req.dateLt);
      }
      // Heure >= / <= / = / > / <
      if(req?.heureMin){
        parametres = parametres.append("heureMin", req.heureMin);
      }
      if(req?.heureMax){
        parametres = parametres.append("heureMax", req.heureMax);
      }
      if(req?.heureEqual){
        parametres = parametres.append("heure", req.heureEqual);
      }
      if(req?.heureGt){
        parametres = parametres.append("heureGt", req.heureGt);
      }
      if(req?.heureLt){
        parametres = parametres.append("heureLt", req.heureLt);
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

  // Vérifier si un matricule existe déjà
  checkMatriculeExists(matricule: string): Observable<boolean> {
    return this.http.get<any>(`${environment.baseUrl}agents/check-matricule/${matricule}`);
  }

 
  // 🔹 FILIERES (liste simple)
  // getAllFilere(): Observable<any[]> {
  //   return this.http.get<any>(`${environment.baseUrl}filieres-suivi/all`)
  //     .pipe(map(res => res.payload));
  // }

  //  getAllPays(): Observable<any[]> {
  //   return this.http.get<any>(`${environment.baseUrl}pays/all`)
  //     .pipe(map(res => res.payload));
  // }

  // Nouvelle méthode paginée
  getAllPaysPaginated(req?: any): Observable<any> {
    let params: HttpParams = new HttpParams();
    
    if (req) {
      if (req?.code) {
        params = params.append('code', req.code);
      }
      if (req?.libelle) {
        params = params.append('libelle', req.libelle);
      }
      // Ajouter la pagination
      params = params.append('page', req.page || 0);
      params = params.append('size', req.size || 10);
    }
    
    return this.http.get<any>(`${environment.baseUrl}pays/all`, { params });
  }
  

  // 🔹 FILIERES (paginé + filtres)
  // getAllFilerePaginated(req?: any): Observable<any> {
  //   let params: HttpParams = new HttpParams();
  //   if (req) {
  //     if (req?.code) {
  //       params = params.append('code', req.code);
  //     }
  //     if (req?.libelle) {
  //       params = params.append('libelle', req.libelle);
  //     }
  //     return this.http.get<any>(
  //       `${environment.baseUrl}filieres-suivi/all?page=${req?.page}&size=${req?.size}`,
  //       { params }
  //     );
  //   } else {
  //     return this.http.get<any>(
  //       `${environment.baseUrl}filieres-suivi/all?page=0&size=100000`,
  //       { params }
  //     );
  //   }
  // }
   getAllFilerePaginated(req?: any): Observable<any> {
    let params: HttpParams = new HttpParams();
    
    if (req) {
      if (req?.code) {
        params = params.append('code', req.code);
      }
      if (req?.libelle) {
        params = params.append('libelle', req.libelle);
      }
      // Ajouter la pagination
      params = params.append('page', req.page || 0);
      params = params.append('size', req.size || 10);
    }
    
    return this.http.get<any>(`${environment.baseUrl}filieres-suivi/all`, { params });
  }

  getPaysById(id: number): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}pays/${id}`);
  }

  // Dans agent.service.ts

// 🔹 FILIERES (liste simple)
// getAllFilere(): Observable<any[]> {
//   return this.http.get<any>(`${environment.baseUrl}filieres-suivi/all`)
//     .pipe(map(res => res.payload));
// }

getFiliereById(id: number): Observable<any> {
  return this.http.get<any>(`${environment.baseUrl}filieres-suivi/${id}`);
}


  // getAllFilere(req?: any): Observable<any> {
  //   console.log('🔍 Service getAllFilere appelé avec:', req);
  //   let parametres: HttpParams = new HttpParams()
  //   if(req){
  //     if(req?.libelle){
  //       parametres = parametres.append("libelle", req.libelle);
  //     }
  //     if(req?.code){
  //       parametres = parametres.append("matricule", req.code);
  //     }
    
  //     const url = `${environment.baseUrl}filieres-suivi/all?page=${req?.page}&size=${req?.size}`;
  //     console.log('🔍 URL de requête:', url);
  //     console.log('🔍 Paramètres HTTP:', parametres.toString());
      
  //     return this.http.get<any>(url, { params: parametres });
  //   } else {
  //     return this.http.get<any>(
  //       `${environment.baseUrl}filieres-suivi/all?page=0&size=100000`,
  //       { params: parametres }
  //     );
  //   }
  // }

  getAllFilere(req?: any): Observable<any> {
    console.log('🔍 Service getAllFilere appelé avec:', req);
    let parametres: HttpParams = new HttpParams()
    if(req){
      if(req?.libelle){
        parametres = parametres.append("libelle", req.libelle);
      }
      if(req?.code){
        parametres = parametres.append("code", req.code);
      }
      const url = `${environment.baseUrl}filieres-suivi/all?page=${req?.page}&size=${req?.size}`;
      console.log('🔍 URL de requête:', url);
      console.log('🔍 Paramètres HTTP:', parametres.toString());
      
      return this.http.get<any>(url, { params: parametres });
    } else {
      return this.http.get<any>(
        `${environment.baseUrl}filieres-suivi/all?page=0&size=100000`,
        { params: parametres }
      );
    }
  }

  
  getAllPays(req?: any): Observable<any> {
    console.log('🔍 Service getAllPays appelé avec:', req);
    let parametres: HttpParams = new HttpParams()
    if(req){
      if(req?.libelle){
        parametres = parametres.append("libelle", req.libelle);
      }
      if(req?.code){
        parametres = parametres.append("code", req.code);
      }
      const url = `${environment.baseUrl}pays/all?page=${req?.page}&size=${req?.size}`;
      console.log('🔍 URL de requête:', url);
      console.log('🔍 Paramètres HTTP:', parametres.toString());
      
      return this.http.get<any>(url, { params: parametres });
    } else {
      return this.http.get<any>(
        `${environment.baseUrl}pays/all?page=0&size=100000`,
        { params: parametres }
      );
    }
  }
getOperateursComparaison(): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}agents/all`);
  }

}
