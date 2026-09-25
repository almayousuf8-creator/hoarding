import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  activeTab: string = 'overview';
  
  hoardings: any[] = [];
  editingHoardingId: number | null = null;
  viewingHoarding: any = null;
  selectedFile: File | null = null;

  states: any[] = [];
  isStateModalOpen: boolean = false;
  editingStateId: number | null = null;
  newState: any = { name: '', status: 'ACTIVE' };

  districts: any[] = [];
  isDistrictModalOpen: boolean = false;
  editingDistrictId: number | null = null;
  newDistrict: any = { state_id: 1, name: '', status: 'ACTIVE' };

  clients: any[] = [];
  isClientModalOpen: boolean = false;
  editingClientId: number | null = null;
  newClient: any = { name: '', email: '', phone: '', address: '', status: 'ACTIVE', hoarding_id: null };

  isConfirmBookingModalOpen: boolean = false;
  confirmBookingData: any = { clientId: null, hoardingName: '', occupied_till: '' };

  locations: any[] = [];
  isLocationModalOpen: boolean = false;
  editingLocationId: number | null = null;
  newLocation: any = { district_id: 1, client_id: 1, name: '', description: '', latitude: '', longitude: '', google_maps_url: '', status: 'ACTIVE' };

  notifications: string[] = [];
  showNotifications: boolean = false;

  newHoarding: any = {
    location_id: 1,
    name: '',
    description: '',
    availability_status: 'AVAILABLE',
    occupied_till: null,
    amount: null,
    latitude: '',
    longitude: '',
    google_maps_url: ''
  };

  constructor(private authService: AuthService, private apiService: ApiService) {}

  ngOnInit() {
    this.fetchHoardings();
    this.fetchStates();
    this.fetchDistricts();
    this.fetchClients();
    this.fetchLocations();
  }

  fetchHoardings() {
    this.apiService.getHoardings().subscribe({
      next: (res) => { if (res.success) this.hoardings = res.data; },
      error: (e) => console.error(e)
    });
  }

  getAvailableHoardingsCount(): number {
    return this.hoardings.filter(h => h.availability_status === 'AVAILABLE').length;
  }

  getOccupiedHoardingsCount(): number {
    return this.hoardings.filter(h => h.availability_status === 'OCCUPIED').length;
  }

  // --- States Methods ---
  fetchStates() {
    this.apiService.getStates().subscribe({
      next: (res) => { if (res.success) this.states = res.data; },
      error: (e) => console.error(e)
    });
  }

  openStateModal(state?: any) {
    if (state) {
      this.editingStateId = state.id;
      this.newState = { name: state.name, status: state.status };
    } else {
      this.editingStateId = null;
      this.newState = { name: '', status: 'ACTIVE' };
    }
    this.isStateModalOpen = true;
  }

  closeStateModal() {
    this.isStateModalOpen = false;
  }

  saveState() {
    if (this.editingStateId) {
      this.apiService.updateState(this.editingStateId, this.newState).subscribe({
        next: () => { this.fetchStates(); this.closeStateModal(); },
        error: (e) => console.error(e)
      });
    } else {
      this.apiService.createState(this.newState).subscribe({
        next: () => { this.fetchStates(); this.closeStateModal(); },
        error: (e) => console.error(e)
      });
    }
  }

  deleteState(id: number) {
    if (confirm('Are you sure you want to delete this state?')) {
      this.apiService.deleteState(id).subscribe({
        next: () => this.fetchStates(),
        error: (e) => {
          console.error(e);
          alert(e.error?.message || 'Failed to delete state.');
        }
      });
    }
  }
  // --- End States Methods ---

  // --- Districts Methods ---
  fetchDistricts() {
    this.apiService.getDistricts().subscribe({
      next: (res) => { if (res.success) this.districts = res.data; },
      error: (e) => console.error(e)
    });
  }

  openDistrictModal(district?: any) {
    if (district) {
      this.editingDistrictId = district.id;
      this.newDistrict = { state_id: district.state_id, name: district.name, status: district.status };
    } else {
      this.editingDistrictId = null;
      this.newDistrict = { state_id: this.states.length > 0 ? this.states[0].id : 1, name: '', status: 'ACTIVE' };
    }
    this.isDistrictModalOpen = true;
  }

  closeDistrictModal() {
    this.isDistrictModalOpen = false;
  }

  saveDistrict() {
    if (this.editingDistrictId) {
      this.apiService.updateDistrict(this.editingDistrictId, this.newDistrict).subscribe({
        next: () => { this.fetchDistricts(); this.closeDistrictModal(); },
        error: (e) => console.error(e)
      });
    } else {
      this.apiService.createDistrict(this.newDistrict).subscribe({
        next: () => { this.fetchDistricts(); this.closeDistrictModal(); },
        error: (e) => console.error(e)
      });
    }
  }

  deleteDistrict(id: number) {
    if (confirm('Are you sure you want to delete this district?')) {
      this.apiService.deleteDistrict(id).subscribe({
        next: () => this.fetchDistricts(),
        error: (e) => {
          console.error(e);
          alert(e.error?.message || 'Failed to delete district.');
        }
      });
    }
  }
  // --- End Districts Methods ---

  // --- Clients Methods ---
  fetchClients() {
    this.apiService.getClients().subscribe({
      next: (res) => { if (res.success) this.clients = res.data; },
      error: (e) => console.error(e)
    });
  }

  openClientModal(client?: any) {
    if (client) {
      this.editingClientId = client.id;
      this.newClient = { name: client.name, email: client.email, phone: client.phone, address: client.address, status: client.status, hoarding_id: client.hoarding_id || null };
    } else {
      this.editingClientId = null;
      this.newClient = { name: '', email: '', phone: '', address: '', status: 'ACTIVE', hoarding_id: null };
    }
    this.isClientModalOpen = true;
  }

  closeClientModal() {
    this.isClientModalOpen = false;
  }

  saveClient() {
    if (this.editingClientId) {
      this.apiService.updateClient(this.editingClientId, this.newClient).subscribe({
        next: () => { this.fetchClients(); this.closeClientModal(); },
        error: (e) => console.error(e)
      });
    } else {
      this.apiService.createClient(this.newClient).subscribe({
        next: () => { this.fetchClients(); this.closeClientModal(); },
        error: (e) => console.error(e)
      });
    }
  }

  deleteClient(id: number) {
    if (confirm('Are you sure you want to delete this client?')) {
      this.apiService.deleteClient(id).subscribe({
        next: (res: any) => {
          this.fetchClients();
          if (res && res.hoardingFreed) {
            this.notifications.unshift(res.message);
            this.showNotifications = true;
            setTimeout(() => { this.showNotifications = false; }, 5000); // Auto-hide after 5s
            this.fetchHoardings();
          }
        },
        error: (e) => {
          console.error(e);
          alert(e.error?.message || 'Failed to delete client.');
        }
      });
    }
  }

  openConfirmBookingModal(client: any) {
    this.confirmBookingData = {
      clientId: client.id,
      hoardingName: client.hoarding_name,
      occupied_till: ''
    };
    this.isConfirmBookingModalOpen = true;
  }

  closeConfirmBookingModal() {
    this.isConfirmBookingModalOpen = false;
  }

  submitConfirmBooking() {
    if (!this.confirmBookingData.occupied_till) {
      alert("Please select an 'Occupied Till' date.");
      return;
    }
    this.apiService.confirmBooking(this.confirmBookingData.clientId, { occupied_till: this.confirmBookingData.occupied_till }).subscribe({
      next: (res: any) => {
        this.notifications.unshift(res.message);
        this.showNotifications = true;
        setTimeout(() => { this.showNotifications = false; }, 5000);
        this.fetchHoardings();
        this.closeConfirmBookingModal();
      },
      error: (e) => {
        console.error(e);
        alert(e.error?.message || 'Failed to confirm booking.');
      }
    });
  }
  // --- End Clients Methods ---

  // --- Locations Methods ---
  fetchLocations() {
    this.apiService.getLocations().subscribe({
      next: (res) => { if (res.success) this.locations = res.data; },
      error: (e) => console.error(e)
    });
  }

  openLocationModal(location?: any) {
    if (location) {
      this.editingLocationId = location.id;
      this.newLocation = { 
        district_id: location.district_id, 
        client_id: location.client_id, 
        name: location.name, 
        description: location.description,
        latitude: location.latitude,
        longitude: location.longitude,
        google_maps_url: location.google_maps_url,
        status: location.status 
      };
    } else {
      this.editingLocationId = null;
      this.newLocation = { 
        district_id: this.districts.length > 0 ? this.districts[0].id : 1, 
        client_id: this.clients.length > 0 ? this.clients[0].id : 1, 
        name: '', 
        description: '', 
        latitude: '', 
        longitude: '', 
        google_maps_url: '', 
        status: 'ACTIVE' 
      };
    }
    this.isLocationModalOpen = true;
  }

  closeLocationModal() {
    this.isLocationModalOpen = false;
  }

  saveLocation() {
    const payload = { ...this.newLocation };
    if (payload.latitude === '') payload.latitude = null;
    if (payload.longitude === '') payload.longitude = null;
    if (payload.google_maps_url === '') payload.google_maps_url = null;

    if (this.editingLocationId) {
      this.apiService.updateLocation(this.editingLocationId, payload).subscribe({
        next: () => { this.fetchLocations(); this.closeLocationModal(); },
        error: (e) => {
          console.error(e);
          alert(e.error?.message || 'Failed to update location. Check console for details.');
        }
      });
    } else {
      this.apiService.createLocation(payload).subscribe({
        next: () => { this.fetchLocations(); this.closeLocationModal(); },
        error: (e) => {
          console.error(e);
          alert(e.error?.message || 'Failed to create location. Check console for details.');
        }
      });
    }
  }

  deleteLocation(id: number) {
    if (confirm('Are you sure you want to delete this location?')) {
      this.apiService.deleteLocation(id).subscribe({
        next: () => this.fetchLocations(),
        error: (e) => {
          console.error(e);
          alert(e.error?.message || 'Failed to delete location.');
        }
      });
    }
  }
  // --- End Locations Methods ---

  setActiveTab(tab: string) {
    this.activeTab = tab;
    if (tab === 'management') {
      this.resetForm();
    }
  }

  editHoarding(h: any) {
    this.editingHoardingId = h.id;
    this.newHoarding = {
      location_id: h.location_id || 1,
      name: h.name,
      description: h.description,
      availability_status: h.availability_status || 'AVAILABLE',
      occupied_till: h.occupied_till ? new Date(h.occupied_till).toISOString().split('T')[0] : null,
      amount: h.amount,
      latitude: h.latitude,
      longitude: h.longitude,
      google_maps_url: h.google_maps_url
    };
    this.selectedFile = null;
    this.activeTab = 'add-hoarding';
  }

  viewHoarding(h: any) {
    this.viewingHoarding = h;
  }

  closeViewModal() {
    this.viewingHoarding = null;
  }

  resetForm() {
    this.editingHoardingId = null;
    this.selectedFile = null;
    this.newHoarding = { location_id: this.locations.length > 0 ? this.locations[0].id : null, name: '', description: '', availability_status: 'AVAILABLE', occupied_till: null, amount: null, latitude: '', longitude: '', google_maps_url: '' };
  }

  onLocationSelectForHoarding(locationId: number) {
    const loc = this.locations.find(l => l.id === locationId);
    if (loc && !this.editingHoardingId) {
      this.newHoarding.latitude = loc.latitude || '';
      this.newHoarding.longitude = loc.longitude || '';
      this.newHoarding.google_maps_url = loc.google_maps_url || '';
      if (!this.newHoarding.description) {
        this.newHoarding.description = loc.description || '';
      }
    }
  }

  onFileSelect(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  saveHoarding() {
    const formData = new FormData();
    Object.keys(this.newHoarding).forEach(key => {
      if (this.newHoarding[key] !== null) {
        formData.append(key, this.newHoarding[key]);
      }
    });
    
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    if (this.editingHoardingId) {
      this.apiService.updateHoarding(this.editingHoardingId, formData).subscribe({
        next: () => {
          this.fetchHoardings();
          this.resetForm();
          this.activeTab = 'management';
        },
        error: (e) => console.error('Failed to update via SP', e)
      });
    } else {
      this.apiService.createHoarding(formData).subscribe({
        next: () => {
          this.fetchHoardings();
          this.resetForm();
          this.activeTab = 'management';
        },
        error: (e) => console.error('Failed to create via SP', e)
      });
    }
  }

  deleteHoarding(id: number) {
    if (confirm('Are you sure you want to delete this hoarding?')) {
      this.apiService.deleteHoarding(id).subscribe({
        next: () => {
          this.fetchHoardings();
        },
        error: (e) => console.error('Failed to delete via SP', e)
      });
    }
  }

  logout() {
    this.authService.logout();
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }
  
  clearNotifications() {
    this.notifications = [];
    this.showNotifications = false;
  }
}
