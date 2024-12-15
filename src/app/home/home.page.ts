import { Component } from '@angular/core';
import * as L from 'leaflet';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  map!: L.Map;
  selectedLocation!: string;
  activeMarker!: L.Marker; // Menyimpan marker yang aktif
  markers: L.Marker[] = []; // Menyimpan semua marker pada peta

  // Lokasi-lokasi dengan label dan gambar
  locations: { coords: [number, number]; label: string; imageUrl?: string }[] = [
    { coords: [-7.796853597267914, 110.38358168970846], label: 'Lapangan Parkir Stadion Mandala Krida', imageUrl: 'assets/icon/mandala_krida.png' },
    { coords: [-7.787665675876384, 110.37416389325318], label: 'Stadion Kridosono', imageUrl: 'assets/icon/kridosono.jpg' },
    { coords: [-7.799987166978024, 110.36763643901223], label: 'Taman Budaya Yogyakarta (TBY)', imageUrl: 'assets/icon/tby.jpg' },
    { coords: [-7.753732145444133, 110.49109188744116], label: 'Candi Prambanan', imageUrl: 'assets/icon/prambanan.jpg' },
    { coords: [-7.843863653792203, 110.36231136136207], label: 'Pyramid Cafe, Jl. Parangtritis KM 5.5', imageUrl: 'assets/icon/pyramid.jpg' },
    { coords: [-7.798032759114464, 110.38770776202496], label: 'Lapangan Panahan Kenari', imageUrl: 'assets/icon/kenari.jpg' },
    { coords: [-7.808425716102209, 110.36310751202505], label: 'Bale Raos, Keraton Yogyakarta', imageUrl: 'assets/icon/raos.jpg' },
    { coords: [-7.79935777810306, 110.40443972024039], label: 'Jogja Expo Center (JEC)', imageUrl: 'assets/icon/jec.jpg' },
    { coords: [-7.750556792293714, 110.418875045112], label: 'Lapangan Parkir Barat Stadion Maguwoharjo', imageUrl: 'assets/icon/maguwo.jpg' },
    { coords: [-7.719614173573038, 110.35909122480773], label: 'Lapangan Denggung Sleman', imageUrl: 'assets/icon/denggung.jpg' },
  ];

  // Tambahkan semua basemap
  baseMaps = {
    'Street Map': L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }),
    'Topographic Map': L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://opentopomap.org/">OpenTopoMap</a> contributors',
    }),
    'Positron Map': L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/attributions">CartoDB</a> contributors',
    }),
    'Dark Matter Map': L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/attributions">CartoDB</a> contributors',
    }),
  };

  constructor(private navController: NavController) {}

  ionViewDidEnter() {
    // Initialize the map
    this.map = L.map('mapId', { layers: [this.baseMaps['Street Map']] }).setView(
      [-7.770939335714962, 110.37761533840921],      11
    );

    // Add layer control for base maps
    L.control.layers(this.baseMaps).addTo(this.map);

    // Add markers for locations
    this.locations.forEach((location) => this.addMarker(location));
  }

  private addMarker(location: { coords: [number, number]; label: string; imageUrl?: string }) {
    const marker = L.marker(location.coords, {
      icon: L.icon({
        iconUrl: 'assets/icon/icon_map.png',
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        popupAnchor: [0, -28],
      }),
    });

    // Handle click event to zoom and show popup
    marker.on('click', () => {
      if (this.activeMarker) {
        // Reset size of the previous active marker
        this.activeMarker.setIcon(
          L.icon({
            iconUrl: 'assets/icon/icon_map.png',
            iconSize: [28, 28],
            iconAnchor: [14, 28],
            popupAnchor: [0, -28],
          })
        );
      }

      // Highlight current marker by enlarging it
      marker.setIcon(
        L.icon({
          iconUrl: 'assets/icon/icon_map.png',
          iconSize: [36, 36],
          iconAnchor: [18, 36],
          popupAnchor: [0, -36],
        })
      );
      this.activeMarker = marker;
    });

    const popupContent = `
      <div style="text-align: center; width: 200px; max-width: 200px;">
        <h7 style="font-size: 12px; font-weight: bold;">${location.label}</h7>
        ${location.imageUrl ? `<img src="${location.imageUrl}" style="width: 100%; margin-top: 6px; border-radius: 4px;" />` : ''}
      </div>`;

    marker.bindPopup(popupContent).addTo(this.map);
    this.markers.push(marker); // Simpan marker dalam array
  }

  onLocationSelect() {
    const selected = this.locations.find((location) => location.label === this.selectedLocation);
    if (selected) {
      this.map.setView(selected.coords, 14);

      const popupContent = `
        <div style="text-align: center; width: 200px; max-width: 200px;">
          <h7 style="font-size: 12px; font-weight: bold;">${selected.label}</h7>
          ${selected.imageUrl ? `<img src="${selected.imageUrl}" style="width: 100%; margin-top: 6px; border-radius: 4px;" />` : ''}
        </div>`;

      L.popup({
        maxWidth: 200,
        minWidth: 200,
      })
        .setLatLng(selected.coords)
        .setContent(popupContent)
        .openOn(this.map);
    }
  }

  resetMap() {
    // Reset dropdown selection
    this.selectedLocation = '';

    // Close any active popup
    this.map.closePopup();

    // Remove all existing markers from the map
    this.markers.forEach((marker) => this.map.removeLayer(marker));

    // Add all markers back to the map
    this.markers = [];
    this.locations.forEach((location) => this.addMarker(location));

    // Reset the view to the initial position and zoom level
    this.map.setView([-7.770939335714962, 110.37761533840921], 11);
  }
}
