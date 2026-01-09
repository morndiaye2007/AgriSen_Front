import {Role} from "./Role";

export interface Utilisateur {
  id?: number;
  email: string;
  mot_de_passe?: string;
  nom: string;
  prenom: string;
  telephone?: string;
  adresse?: string;
  ville?: string;
  codePostal?: string;
  profileImage?: string;
  role: Role;
  enabled?: boolean;
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
