import {TypeActivite} from "./TypeActivite";

export interface JournalEntry {
  id?: number;
  parcelleId: number;
  typeActivite: TypeActivite;
  dateActivite: Date;
  description?: string;
  quantite?: number;
  unite?: string;
  cout?: number;
  photos?: string;
  documents?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
