import {Utilisateur} from "./Utilisateur";

export interface AuthResponse {
  token: string;
  utilisateur: Utilisateur;
}
