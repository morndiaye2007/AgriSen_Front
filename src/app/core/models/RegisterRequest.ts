import {Role} from "./Role";

export interface RegisterRequest {
  email: string;
  mot_de_passe: string;
  nom: string;
  prenom: string;
  telephone?: string;
  role?: Role;
}
