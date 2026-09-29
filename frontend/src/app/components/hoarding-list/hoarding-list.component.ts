import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
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

  openDropdown: 'state' | 'district' | 'location' | null = null;

  isLoading: boolean = false;
  backendUrl = 'http://localhost:5000';

  newLead: any = { name: '', email: '', subject: '', message: '' };
  isSubmitting: boolean = false;
  leadSuccessMessage: string = '';
  leadErrorMessage: string = '';

  constructor(private apiService: ApiService, public authService: AuthService) {}

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
          
          if (this.selectedStateId && this.selectedDistrictId && this.selectedLocationId) {
            setTimeout(() => {
              const resultsSection = document.getElementById('results');
              if (resultsSection) {
                resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }, 100);
          }
        }
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  submitLead() {
    this.isSubmitting = true;
    this.leadSuccessMessage = '';
    this.leadErrorMessage = '';
    
    this.apiService.submitLead(this.newLead).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        if (res.success) {
          this.leadSuccessMessage = 'Message sent successfully! We will get back to you soon.';
          this.newLead = { name: '', email: '', subject: '', message: '' };
          setTimeout(() => this.leadSuccessMessage = '', 5000);
        } else {
          this.leadErrorMessage = res.message || 'Failed to send message.';
        }
      },
      error: () => {
        this.isSubmitting = false;
        this.leadErrorMessage = 'An error occurred. Please try again.';
      }
    });
  }

  toggleDropdown(dropdown: 'state' | 'district' | 'location', event: MouseEvent) {
    event.stopPropagation();
    if (dropdown === 'district' && !this.selectedStateId) return;
    if (dropdown === 'location' && !this.selectedDistrictId) return;

    this.openDropdown = this.openDropdown === dropdown ? null : dropdown;
  }

  closeDropdowns() {
    this.openDropdown = null;
  }

  @HostListener('document:click')
  onDocumentClick() {
    this.closeDropdowns();
  }

  selectState(stateId: number | null, event: MouseEvent) {
    event.stopPropagation();
    if (this.selectedStateId === stateId) {
      this.openDropdown = null;
      return;
    }
    this.selectedStateId = stateId;
    this.openDropdown = null;
    this.onStateChange();
  }

  selectDistrict(districtId: number | null, event: MouseEvent) {
    event.stopPropagation();
    if (this.selectedDistrictId === districtId) {
      this.openDropdown = null;
      return;
    }
    this.selectedDistrictId = districtId;
    this.openDropdown = null;
    this.onDistrictChange();
  }

  selectLocation(locationId: number | null, event: MouseEvent) {
    event.stopPropagation();
    if (this.selectedLocationId === locationId) {
      this.openDropdown = null;
      return;
    }
    this.selectedLocationId = locationId;
    this.openDropdown = null;
    this.onLocationChange();
  }

  resetFilters() {
    this.selectedStateId = null;
    this.selectedDistrictId = null;
    this.selectedLocationId = null;
    this.districts = [];
    this.locations = [];
    this.openDropdown = null;
    this.loadHoardings();
  }

  getSelectedStateName(): string {
    if (!this.selectedStateId) return 'Select State';
    const s = this.states.find(st => st.id == this.selectedStateId);
    return s ? s.name : 'Select State';
  }

  getSelectedDistrictName(): string {
    if (!this.selectedDistrictId) return 'Select District';
    const d = this.districts.find(dt => dt.id == this.selectedDistrictId);
    return d ? d.name : 'Select District';
  }

  getSelectedLocationName(): string {
    if (!this.selectedLocationId) return 'Select Location';
    const l = this.locations.find(lc => lc.id == this.selectedLocationId);
    return l ? l.name : 'Select Location';
  }

  getLocationHeading(): string {
    if (this.selectedLocationId) {
      const loc = this.locations.find(l => l.id == this.selectedLocationId);
      if (loc) return loc.name;
    }
    if (this.selectedDistrictId) {
      const dist = this.districts.find(d => d.id == this.selectedDistrictId);
      if (dist) return dist.name;
    }
    if (this.selectedStateId) {
      const st = this.states.find(s => s.id == this.selectedStateId);
      if (st) return st.name;
    }
    return 'Ernakulam';
  }
}
