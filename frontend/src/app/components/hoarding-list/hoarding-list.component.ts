import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';

import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';


@Component({
  selector: 'app-hoarding-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent, FooterComponent],

  templateUrl: './hoarding-list.component.html',
  styleUrls: ['./hoarding-list.component.css']
})
export class HoardingListComponent implements OnInit {
  locations: any[] = [];
  hoardings: any[] = [];

  selectedState: string | null = null;
  selectedDistrict: string | null = null;
  selectedLocationId: number | null = null;

  openDropdown: 'state' | 'district' | 'location' | null = null;

  isLoading: boolean = false;
  backendUrl = environment.apiUrl;

  newLead: any = { name: '', email: '', subject: '', message: '' };
  isSubmitting: boolean = false;
  leadSuccessMessage: string = '';
  leadErrorMessage: string = '';

  constructor(private apiService: ApiService, public authService: AuthService) {}

  ngOnInit() {
    this.loadLocations();
    this.loadHoardings();
  }

  scrollTo(id: string) {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  loadLocations() {
    this.apiService.getLocations().subscribe({
      next: (res) => {
        if (res.success) {
          this.locations = res.data.filter((l: any) => l.status === 'ACTIVE');
        }
      }
    });
  }

  get uniqueStates(): string[] {
    const stateMap = new Map<string, string>();
    const addState = (s: string) => {
      if (!s || s.trim() === '') return;
      const lower = s.trim().toLowerCase();
      if (!stateMap.has(lower)) stateMap.set(lower, s.trim().charAt(0).toUpperCase() + s.trim().slice(1).toLowerCase());
    };
    this.locations.forEach(l => addState(l.state));
    return Array.from(stateMap.values()).sort();
  }

  get uniqueDistricts(): string[] {
    const distMap = new Map<string, string>();
    const addDist = (s: string, d: string) => {
      if (!d || d.trim() === '') return;
      if (!this.selectedState || (s && s.trim().toLowerCase() === this.selectedState.toLowerCase())) {
        const lower = d.trim().toLowerCase();
        if (!distMap.has(lower)) distMap.set(lower, d.trim().charAt(0).toUpperCase() + d.trim().slice(1).toLowerCase());
      }
    };
    this.locations.forEach(l => addDist(l.state, l.district));
    return Array.from(distMap.values()).sort();
  }

  get filteredLocations(): any[] {
    return this.locations.filter(l => {
      // Find all hoardings linked to this location
      const linkedHoardings = this.hoardings.filter(h => h.location_id === l.id);
      
      const hasMatchingState = () => {
        if (!this.selectedState) return true;
        const target = this.selectedState.toLowerCase();
        if (l.state && l.state.trim().toLowerCase() === target) return true;
        return linkedHoardings.some(h => h.state && h.state.trim().toLowerCase() === target);
      };

      const hasMatchingDistrict = () => {
        if (!this.selectedDistrict) return true;
        const target = this.selectedDistrict.toLowerCase();
        if (l.district && l.district.trim().toLowerCase() === target) return true;
        return linkedHoardings.some(h => h.district && h.district.trim().toLowerCase() === target);
      };

      return l.status === 'ACTIVE' && hasMatchingState() && hasMatchingDistrict();
    });
  }

  selectState(state: string | null, event: Event) {
    event.stopPropagation();
    this.selectedState = state;
    this.selectedDistrict = null;
    this.selectedLocationId = null;
    this.openDropdown = null;
  }

  selectDistrict(district: string | null, event: Event) {
    event.stopPropagation();
    this.selectedDistrict = district;
    this.selectedLocationId = null;
    this.openDropdown = null;
  }

  selectLocation(locId: number | null, event: Event) {
    event.stopPropagation();
    this.selectedLocationId = locId;
    this.openDropdown = null;
  }

  getSelectedStateName() {
    return this.selectedState || 'All States';
  }

  getSelectedDistrictName() {
    return this.selectedDistrict || 'All Districts';
  }

  getSelectedLocationName() {
    if (!this.selectedLocationId) return 'All Locations';
    const loc = this.locations.find(l => l.id === this.selectedLocationId);
    return loc ? loc.name : 'All Locations';
  }

  toggleDropdown(dropdown: 'state' | 'district' | 'location', event: Event) {
    event.stopPropagation();
    if (this.openDropdown === dropdown) {
      this.openDropdown = null;
    } else {
      if (dropdown === 'district' && !this.selectedState) return;
      if (dropdown === 'location' && !this.selectedDistrict) return;
      this.openDropdown = dropdown;
    }
  }

  @HostListener('document:click')
  closeDropdowns() {
    this.openDropdown = null;
  }

  resetFilters() {
    this.selectedState = null;
    this.selectedDistrict = null;
    this.selectedLocationId = null;
    this.loadHoardings(true);
  }

  
  getLocationHeading() {
    if (this.selectedLocationId) {
      return this.getSelectedLocationName();
    } else if (this.selectedDistrict) {
      return this.selectedDistrict;
    } else if (this.selectedState) {
      return this.selectedState;
    }
    return 'All Locations';
  }

  onSearch() {
    this.loadHoardings(true);
  }

  loadHoardings(scrollToResults: boolean = false) {
    this.isLoading = true;
    this.apiService.getHoardings().subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success) {
          let filtered = res.data.filter((h: any) => h.loc_status !== 'HIDDEN');

          if (this.selectedLocationId) {
            filtered = filtered.filter((h: any) => h.location_id == this.selectedLocationId);
          } else if (this.selectedDistrict) {
            filtered = filtered.filter((h: any) => {
              const loc = this.locations.find(l => l.id == h.location_id);
              return (h.district && h.district.trim().toLowerCase() === this.selectedDistrict!.toLowerCase()) ||
                     (loc && loc.district && loc.district.trim().toLowerCase() === this.selectedDistrict!.toLowerCase());
            });
          } else if (this.selectedState) {
            filtered = filtered.filter((h: any) => {
              const loc = this.locations.find(l => l.id == h.location_id);
              return (h.state && h.state.trim().toLowerCase() === this.selectedState!.toLowerCase()) ||
                     (loc && loc.state && loc.state.trim().toLowerCase() === this.selectedState!.toLowerCase());
            });
          }

          this.hoardings = filtered;

          if (scrollToResults) {
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
      next: (res: any) => {
        this.isSubmitting = false;
        if (res.success) {
          this.leadSuccessMessage = 'Your query has been sent successfully. We will get back to you soon!';
          this.newLead = { name: '', email: '', subject: '', message: '' };
          setTimeout(() => { this.leadSuccessMessage = ''; }, 5000);
        } else {
          this.leadErrorMessage = res.message || 'Failed to submit query.';
        }
      },
      error: (e: any) => {
        this.isSubmitting = false;
        console.error(e);
        this.leadErrorMessage = e.error?.message || 'An error occurred. Please try again.';
      }
    });
  }
}
