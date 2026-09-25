import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-hoarding-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './hoarding-list.component.html',
  styleUrls: ['./hoarding-list.component.css']
})
export class HoardingListComponent implements OnInit {
  states: any[] = [];
  districts: any[] = [];
  locations: any[] = [];
  hoardings: any[] = [];

  selectedStateId: number | null = null;
  selectedDistrictId: number | null = null;
  selectedLocationId: number | null = null;

  isLoading: boolean = false;
  backendUrl = 'http://localhost:5000';

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadStates();
    this.loadHoardings();
  }

  scrollTo(id: string) {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  loadStates() {
    this.apiService.getStates().subscribe({
      next: (res) => {
        if (res.success) this.states = res.data;
      }
    });
  }

  onStateChange() {
    this.selectedDistrictId = null;
    this.selectedLocationId = null;
    this.districts = [];
    this.locations = [];
    this.loadHoardings();

    if (this.selectedStateId) {
      this.apiService.getDistricts(this.selectedStateId).subscribe({
        next: (res) => {
          if (res.success) {
            // Filter on frontend if backend doesn't support query params yet
            this.districts = res.data.filter((d: any) => d.state_id == this.selectedStateId);
          }
        }
      });
    }
  }

  onDistrictChange() {
    this.selectedLocationId = null;
    this.locations = [];
    this.loadHoardings();

    if (this.selectedDistrictId) {
      this.apiService.getLocations(this.selectedDistrictId).subscribe({
        next: (res) => {
          if (res.success) {
            this.locations = res.data.filter((l: any) => l.district_id == this.selectedDistrictId);
          }
        }
      });
    }
  }

  onLocationChange() {
    this.loadHoardings();
  }

  loadHoardings() {
    this.isLoading = true;
    this.apiService.getHoardings(this.selectedLocationId || undefined).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success) {
          let filtered = res.data;
          // Apply frontend filtering to compensate for basic backend implementation
          if (this.selectedLocationId) {
            filtered = filtered.filter((h: any) => h.location_id == this.selectedLocationId);
          }
          this.hoardings = filtered;
        }
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}
