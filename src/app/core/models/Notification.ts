import {TypeNotification} from "./TypeNotification";

export interface Notification {
  id?: number;
  utilisateurId: number;
  titre: string;
  message?: string;
  type: TypeNotification;
  lu: boolean;
  dateLecture?: Date;
  createdAt?: Date;
}
