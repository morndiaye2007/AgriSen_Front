import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import {Parcelle} from "../../../../core/models/Parcelle";

declare var L: any; // Leaflet

@Component({
  selector: 'app-parcelle-map',
  templateUrl: './parcelle-map.component.html',
  styleUrls: ['./parcelle-map.component.scss']
})
export class ParcelleMapComponent implements OnInit, AfterViewInit {
  @Input() parcelles: Parcelle[] = [];
  @Output() parcelleSelected = new EventEmitter<Parcelle>();

  map: any;
  markers: any[] = [];
  selectedParcelle: Parcelle | null = null;
  isFullscreen = false;
  loading = true;

  // Centre par défaut (Dakar, Sénégal)
  defaultCenter = { lat: 14.7167, lng: -17.4677 };
  defaultZoom = 10;

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initMap();
  }

  initMap(): void {
    try {
      // Initialiser la carte Leaflet
      this.map = L.map('parcelleMap').setView(
        [this.defaultCenter.lat, this.defaultCenter.lng],
        this.defaultZoom
      );

      // Ajouter la couche de tuiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18
      }).addTo(this.map);

      // Ajouter les marqueurs pour les parcelles
      this.addParcelleMarkers();

      this.loading = false;
    } catch (error) {
      console.error('Erreur initialisation carte:', error);
      this.loading = false;
    }
  }

  addParcelleMarkers(): void {
    // Supprimer les anciens marqueurs
    this.markers.forEach(marker => marker.remove());
    this.markers = [];

    // Ajouter un marqueur pour chaque parcelle
    this.parcelles.forEach(parcelle => {
      if (parcelle.latitude && parcelle.longitude) {
        const icon = this.getMarkerIcon(parcelle);

        const marker = L.marker([parcelle.latitude, parcelle.longitude], {
          icon: icon
        }).addTo(this.map);

        // Popup au clic
        marker.bindPopup(`
          <div class="marker-popup">
            <h4>${parcelle.nom}</h4>
            <p><strong>Superficie:</strong> ${parcelle.superficie} ha</p>
            <p><strong>Statut:</strong> ${parcelle.active ? 'Active' : 'Inactive'}</p>
          </div>
        `);

        // Sélectionner la parcelle au clic
        marker.on('click', () => {
          this.selectParcelle(parcelle);
        });

        this.markers.push(marker);
      }
    });

    // Ajuster la vue pour inclure tous les marqueurs
    if (this.markers.length > 0) {
      const group = L.featureGroup(this.markers);
      this.map.fitBounds(group.getBounds().pad(0.1));
    }
  }

  getMarkerIcon(parcelle: Parcelle): any {
    const color = parcelle.active ? '#4CAF50' : '#FF9800';

    return L.divIcon({
      html: `
        <div style="
          background-color: ${color};
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        "></div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
  }

  selectParcelle(parcelle: Parcelle): void {
    this.selectedParcelle = parcelle;
    this.parcelleSelected.emit(parcelle);

    // Centrer sur la parcelle
    if (parcelle.latitude && parcelle.longitude) {
      this.map.setView([parcelle.latitude, parcelle.longitude], 15);
    }
  }

  closeInfo(): void {
    this.selectedParcelle = null;
  }

  viewDetails(): void {
    if (this.selectedParcelle) {
      this.parcelleSelected.emit(this.selectedParcelle);
    }
  }

  centerMap(): void {
    if (this.markers.length > 0) {
      const group = L.featureGroup(this.markers);
      this.map.fitBounds(group.getBounds().pad(0.1));
    } else {
      this.map.setView([this.defaultCenter.lat, this.defaultCenter.lng], this.defaultZoom);
    }
  }

  toggleFullscreen(): void {
    this.isFullscreen = !this.isFullscreen;
    setTimeout(() => {
      this.map.invalidateSize();
    }, 100);
  }
}
