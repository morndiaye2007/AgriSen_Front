import { Component, Input, Output, EventEmitter } from '@angular/core';
import {Culture} from "../../../../core/models/Culture";

@Component({
  selector: 'app-culture-card',
  templateUrl: './culture-card.component.html',
  styleUrls: ['./culture-card.component.scss']
})
export class CultureCardComponent {
  @Input() culture!: Culture;
  @Output() edit = new EventEmitter<Culture>();
  @Output() delete = new EventEmitter<Culture>();
  @Output() viewDetails = new EventEmitter<Culture>();

  getCategorieColor(): string {
    const colors: { [key: string]: string } = {
      'Céréales': '#FFA726',
      'Légumineuses': '#66BB6A',
      'Tubercules': '#8D6E63',
      'Légumes': '#26A69A',
      'Fruits': '#EF5350',
      'Cultures industrielles': '#5C6BC0',
      'Fourragères': '#9CCC65'
    };
    return colors[this.culture.categorie || ''] || '#9E9E9E';
  }

  getCategorieIcon(): string {
    const icons: { [key: string]: string } = {
      'Céréales': 'fa-wheat-awn',
      'Légumineuses': 'fa-seedling',
      'Tubercules': 'fa-carrot',
      'Légumes': 'fa-leaf',
      'Fruits': 'fa-apple-whole',
      'Cultures industrielles': 'fa-industry',
      'Fourragères': 'fa-cow'
    };
    return icons[this.culture.categorie || ''] || 'fa-plant-wilt';
  }

  onImageError(event: any): void {
    event.target.src = 'assets/images/default-culture.jpg';
  }

  onEdit(event: Event): void {
    event.stopPropagation();
    this.edit.emit(this.culture);
  }

  onDelete(event: Event): void {
    event.stopPropagation();
    if (confirm(`Êtes-vous sûr de vouloir supprimer "${this.culture.nom}" ?`)) {
      this.delete.emit(this.culture);
    }
  }

  onViewDetails(): void {
    this.viewDetails.emit(this.culture);
  }
}
