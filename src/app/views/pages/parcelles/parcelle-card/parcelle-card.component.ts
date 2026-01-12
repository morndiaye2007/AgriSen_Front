import { Component, Input, Output, EventEmitter } from '@angular/core';
import {Parcelle} from "../../../../core/models/Parcelle";

@Component({
  selector: 'app-parcelle-card',
  templateUrl: './parcelle-card.component.html',
  styleUrls: ['./parcelle-card.component.scss']
})
export class ParcelleCardComponent {
  @Input() parcelle!: Parcelle;
  @Output() edit = new EventEmitter<Parcelle>();
  @Output() delete = new EventEmitter<Parcelle>();
  @Output() toggleStatus = new EventEmitter<Parcelle>();
  @Output() viewDetails = new EventEmitter<Parcelle>();
  @Output() viewMap = new EventEmitter<Parcelle>();

  getCultureName(): string {
    // TODO: Récupérer le nom de la culture depuis le service
    return 'Culture #' + this.parcelle.cultureId;
  }

  onEdit(event: Event): void {
    event.stopPropagation();
    this.edit.emit(this.parcelle);
  }

  onDelete(event: Event): void {
    event.stopPropagation();
    if (confirm(`Êtes-vous sûr de vouloir supprimer la parcelle "${this.parcelle.nom}" ?`)) {
      this.delete.emit(this.parcelle);
    }
  }

  onToggleStatus(event: Event): void {
    event.stopPropagation();
    const action = this.parcelle.active ? 'désactiver' : 'activer';
    if (confirm(`Êtes-vous sûr de vouloir ${action} cette parcelle ?`)) {
      this.toggleStatus.emit(this.parcelle);
    }
  }

  onViewDetails(): void {
    this.viewDetails.emit(this.parcelle);
  }

  onViewMap(event: Event): void {
    event.stopPropagation();
    this.viewMap.emit(this.parcelle);
  }
}
