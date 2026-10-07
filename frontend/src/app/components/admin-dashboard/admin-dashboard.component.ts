import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { environment } from '../../../environments/environment';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  activeTab: string = 'overview';
  backendUrl = environment.apiUrl;
  
  hoardings: any[] = [];
  editingHoardingId: number | null = null;
  viewingHoarding: any = null;
  currentImageIndex: number = 0;
  selectedFile: File | null = null; // kept for legacy
  selectedFiles: File[] = [];
  filePreviews: string[] = [];
  existingImages: any[] = [];

  hoardingsCurrentPage: number = 1;
  hoardingsItemsPerPage: number = 5;

  get paginatedFilteredHoardings() {
    const startIndex = (this.hoardingsCurrentPage - 1) * this.hoardingsItemsPerPage;
    return this.filteredHoardings.slice(startIndex, startIndex + this.hoardingsItemsPerPage);
  }

  get totalHoardingPages() { return Math.ceil(this.filteredHoardings.length / this.hoardingsItemsPerPage) || 1; }
  get hoardingsPagesArray() {
    const pages = [];
    for (let i = 1; i <= this.totalHoardingPages; i++) pages.push(i);
    return pages;
  }
  goToHoardingsPage(page: number) { this.hoardingsCurrentPage = page; }
  nextHoardingsPage() { if (this.hoardingsCurrentPage < this.totalHoardingPages) this.hoardingsCurrentPage++; }
  prevHoardingsPage() { if (this.hoardingsCurrentPage > 1) this.hoardingsCurrentPage--; }


  clients: any[] = [];
  clientsCurrentPage: number = 1;
  clientsItemsPerPage: number = 5;
  totalClientsCount: number = 0;

  get totalClientPages() {
    return Math.ceil(this.totalClientsCount / this.clientsItemsPerPage) || 1;
  }

  get clientsPagesArray() {
    const pages = [];
    for (let i = 1; i <= this.totalClientPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  goToClientsPage(page: number) {
    this.clientsCurrentPage = page;
    this.fetchClients();
  }

  nextClientsPage() {
    if (this.clientsCurrentPage < this.totalClientPages) {
      this.clientsCurrentPage++;
      this.fetchClients();
    }
  }

  prevClientsPage() {
    if (this.clientsCurrentPage > 1) {
      this.clientsCurrentPage--;
      this.fetchClients();
    }
  }

  isClientModalOpen: boolean = false;
  editingClientId: number | null = null;
  newClient: any = { name: '', email: '', phone: '', address: '', hoarding_id: null };
  viewingClient: any = null;

  isConfirmBookingModalOpen: boolean = false;
  confirmBookingData: any = { clientId: null, hoardingName: '', action: 'confirm', occupied_till: '' };

  locations: any[] = [];
  locationsCurrentPage: number = 1;
  locationsItemsPerPage: number = 5;

  locationFilterSearch: string = '';
  locationFilterState: string = '';
  locationFilterDistrict: string = '';

  get locationsFilteredForTable() {
    return this.locations.filter(l => {
      const matchSearch = !this.locationFilterSearch || (l.name && l.name.toLowerCase().includes(this.locationFilterSearch.toLowerCase()));
      const matchState = !this.locationFilterState || (l.state && l.state.toLowerCase() === this.locationFilterState.toLowerCase());
      const matchDistrict = !this.locationFilterDistrict || (l.district && l.district.toLowerCase() === this.locationFilterDistrict.toLowerCase());
      return matchSearch && matchState && matchDistrict;
    });
  }

  get paginatedLocations() {
    const startIndex = (this.locationsCurrentPage - 1) * this.locationsItemsPerPage;
    return this.locationsFilteredForTable.slice(startIndex, startIndex + this.locationsItemsPerPage);
  }

  get totalLocationPages() { return Math.ceil(this.locationsFilteredForTable.length / this.locationsItemsPerPage) || 1; }
  get locationsPagesArray() {
    const pages = [];
    for (let i = 1; i <= this.totalLocationPages; i++) pages.push(i);
    return pages;
  }
  goToLocationsPage(page: number) { this.locationsCurrentPage = page; }
  nextLocationsPage() { if (this.locationsCurrentPage < this.totalLocationPages) this.locationsCurrentPage++; }
  prevLocationsPage() { if (this.locationsCurrentPage > 1) this.locationsCurrentPage--; }

  isLocationModalOpen: boolean = false;
  editingLocationId: number | null = null;
  newLocation: any = { name: '', state: '', district: '', status: 'ACTIVE' };

  leads: any[] = [];
  unreadLeadsCount: number = 0;
  viewingLead: any = null;

  notifications: string[] = [];
  showNotifications: boolean = false;

  filterState: string = '';
  filterDistrict: string = '';
  filterLocationId: number | null = null;
  filterStatus: string | null = null;

  showStatusModal: boolean = false;
  statusUpdateData: any = { id: null, availability_status: '', occupied_till: '' };

  newHoarding: any = {
    location_id: 1,
    name: '',
    description: '',
    availability_status: 'AVAILABLE',
    occupied_till: null,
    latitude: '',
    longitude: '',
    google_maps_url: '',
    state: '',
    district: ''
  };

  
  toastVisible = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

  showToast(message: string, type: 'success' | 'error' = 'success') {
    this.toastMessage = message;
    this.toastType = type;
    this.toastVisible = true;
    setTimeout(() => {
      this.toastVisible = false;
    }, 3500);
  }

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.fetchHoardings();
    this.fetchClients();
    this.fetchLocations();
    this.fetchLeads();
  }

  fetchLeads() {
    this.apiService.getLeads().subscribe({
      next: (res) => {
        if (res.success) {
          this.leads = res.data;
          this.unreadLeadsCount = this.leads.filter(l => l.status === 'NEW').length;
          
          if (this.unreadLeadsCount > 0) {
            this.notifications = [`You have ${this.unreadLeadsCount} new lead(s)!`];
          } else {
            this.notifications = [];
          }
          this.cdr.detectChanges();
        }
      },
      error: (e) => console.error(e)
    });
  }

  markLeadAsRead(id: number) {
    this.apiService.markLeadRead(id).subscribe({
      next: (res) => {
        if (res.success) {
          this.fetchLeads();
        }
      }
    });
  }

  viewLead(lead: any) {
    this.viewingLead = lead;
    if (lead.status === 'NEW') {
      this.apiService.markLeadRead(lead.id).subscribe({
        next: (res) => {
          if (res.success) {
            lead.status = 'READ';
            this.fetchLeads();
          }
        }
      });
    }
  }

  closeLeadModal() {
    this.viewingLead = null;
  }

  deleteLead(id: number) {
    if(confirm('Are you sure you want to delete this lead?')) {
      this.apiService.deleteLead(id).subscribe({
        next: (res) => {
          if (res.success) {
            this.fetchLeads();
          }
        }
      });
    }
  }

  fetchHoardings() {
    this.apiService.getHoardings().subscribe({
      next: (res) => { 
        if (res.success) {
          this.hoardings = res.data; 
          this.cdr.detectChanges();
        }
      },
      error: (e) => console.error(e)
    });
  }

      
  get filteredLocations(): any[] {
    return this.locations.filter(l => {
      // Find all hoardings linked to this location
      const linkedHoardings = this.hoardings.filter(h => h.location_id === l.id);
      
      const hasMatchingState = () => {
        if (!this.filterState) return true;
        const target = this.filterState.toLowerCase();
        if (l.state && l.state.trim().toLowerCase() === target) return true;
        return linkedHoardings.some(h => h.state && h.state.trim().toLowerCase() === target);
      };

      const hasMatchingDistrict = () => {
        if (!this.filterDistrict) return true;
        const target = this.filterDistrict.toLowerCase();
        if (l.district && l.district.trim().toLowerCase() === target) return true;
        return linkedHoardings.some(h => h.district && h.district.trim().toLowerCase() === target);
      };

      return hasMatchingState() && hasMatchingDistrict();
    });
  }

  get activeFilteredLocations(): any[] {
    return this.filteredLocations.filter(l => l.status === 'ACTIVE');
  }

  get activeLocations(): any[] {
    return this.locations.filter(l => l.status === 'ACTIVE');
  }

  get uniqueStates(): string[] {
    const stateMap = new Map<string, string>();
    const addState = (s: string) => {
      if (!s || s.trim() === '') return;
      const lower = s.trim().toLowerCase();
      if (!stateMap.has(lower)) stateMap.set(lower, s.trim().charAt(0).toUpperCase() + s.trim().slice(1).toLowerCase());
    };
    this.activeLocations.forEach(l => addState(l.state));
    return Array.from(stateMap.values()).sort();
  }

    get uniqueDistricts(): string[] {
    const distMap = new Map<string, string>();
    const addDist = (s: string, d: string) => {
      if (!d || d.trim() === '') return;
      if (!this.filterState || (s && s.trim().toLowerCase() === this.filterState.toLowerCase())) {
        const lower = d.trim().toLowerCase();
        if (!distMap.has(lower)) distMap.set(lower, d.trim().charAt(0).toUpperCase() + d.trim().slice(1).toLowerCase());
      }
    };
    this.activeLocations.forEach(l => addDist(l.state, l.district));
    return Array.from(distMap.values()).sort();
  }

  resetFilters() {
    this.filterState = '';
    this.filterDistrict = '';
    this.filterLocationId = null;
    this.filterStatus = null;
  }

  resetLocationFilters() {
    this.locationFilterSearch = '';
    this.locationFilterState = '';
    this.locationFilterDistrict = '';
  }

  get uniqueLocationDistricts(): string[] {
    const distMap = new Map<string, string>();
    const addDist = (s: string, d: string) => {
      if (!d || d.trim() === '') return;
      if (!this.locationFilterState || (s && s.trim().toLowerCase() === this.locationFilterState.toLowerCase())) {
        const lower = d.trim().toLowerCase();
        if (!distMap.has(lower)) distMap.set(lower, d.trim().charAt(0).toUpperCase() + d.trim().slice(1).toLowerCase());
      }
    };
    this.activeLocations.forEach(l => addDist(l.state, l.district));
    return Array.from(distMap.values()).sort();
  }

  onStateFilterChange() {
    this.filterDistrict = '';
  }

  onLocationStateFilterChange() {
    this.locationFilterDistrict = '';
  }

  get filteredHoardings() {
    return this.hoardings.filter(h => {
      let match = true;
      if (this.filterStatus && this.filterStatus !== 'ALL' && this.filterStatus !== 'null' && h.availability_status !== this.filterStatus) match = false;
      
      const loc = this.locations.find(l => l.id === h.location_id);
      
      if (this.filterState && this.filterState !== '') {
        if (!loc || loc.state.toLowerCase() !== this.filterState.toLowerCase()) match = false;
      }
      
      if (this.filterDistrict && this.filterDistrict !== '') {
        if (!loc || loc.district.toLowerCase() !== this.filterDistrict.toLowerCase()) match = false;
      }

      if (this.filterLocationId && this.filterLocationId !== -1 && String(this.filterLocationId) !== 'null' && loc?.id !== Number(this.filterLocationId)) match = false;
      
      return match;
    });
  }

  getAvailableHoardingsCount(): number {
    return this.hoardings.filter(h => h.availability_status === 'AVAILABLE').length;
  }

  getOccupiedHoardingsCount(): number {
    return this.hoardings.filter(h => h.availability_status === 'OCCUPIED').length;
  }


  // --- Clients Methods ---
  fetchClients() {
    this.apiService.getClients(this.clientsCurrentPage, this.clientsItemsPerPage).subscribe({
      next: (res) => { 
        if (res.success) {
          this.clients = res.data;
          this.totalClientsCount = res.total !== undefined ? res.total : res.data.length;
          this.cdr.detectChanges();
        }
      },
      error: (e) => console.error(e)
    });
  }

  viewClient(client: any) {
    this.viewingClient = client;
  }

  closeViewClientModal() {
    this.viewingClient = null;
  }

  openClientModal(client?: any) {
    if (client) {
      this.editingClientId = client.id;
      this.newClient = { 
        name: client.name, 
        email: client.email, 
        phone: client.phone, 
        address: client.address, 
        hoarding_id: client.hoarding_id || null,
        payment: client.hoarding_amount || null,
        occupied_till: client.hoarding_occupied_till ? new Date(client.hoarding_occupied_till).toISOString().split('T')[0] : null
      };
    } else {
      this.editingClientId = null;
      this.newClient = { name: '', email: '', phone: '', address: '', hoarding_id: null, payment: null, occupied_till: null };
    }
    this.isClientModalOpen = true;
  }

  closeClientModal() {
    this.isClientModalOpen = false;
  }

  saveClient() {
    if (this.editingClientId) {
      this.apiService.updateClient(this.editingClientId, this.newClient).subscribe({
        next: () => { 
          this.fetchClients(); 
          this.fetchHoardings();
          this.closeClientModal(); 
        },
        error: (e) => console.error(e)
      });
    } else {
      this.apiService.createClient(this.newClient).subscribe({
        next: () => { 
          this.fetchClients(); 
          this.fetchHoardings();
          this.closeClientModal(); 
        },
        error: (e) => console.error(e)
      });
    }
  }

  deleteClient(id: number, clientStatus?: string) {
    if (confirm('Are you sure you want to delete this lead?')) {
      this.apiService.deleteClient(id).subscribe({
        next: (res: any) => {
          this.fetchClients();
          const isUnderReview = clientStatus && clientStatus.toUpperCase() === 'UNDER REVIEW';
          if (res && res.hoardingFreed && !isUnderReview) {
            this.notifications.unshift('A booked hoarding is now available!');
            this.showNotifications = true;
            setTimeout(() => { this.showNotifications = false; }, 5000);
            this.fetchHoardings();
          } else if (res && res.hoardingFreed && isUnderReview) {
            this.fetchHoardings();
          }
        },
        error: (e) => {
          console.error(e);
          this.showToast(e.error?.message || 'Failed to delete lead.', 'error');
        }
      });
    }
  }

  openConfirmBookingModal(client: any) {
    this.confirmBookingData = {
      clientId: client.id,
      hoardingName: client.hoarding_name,
      action: 'confirm',
      occupied_till: '',
      isOccupied: client.hoarding_availability_status === 'OCCUPIED' && client.hoarding_is_deleted !== 1,
      isDeleted: client.hoarding_is_deleted === 1,
      isUnavailable: (client.hoarding_availability_status === 'OCCUPIED' && client.hoarding_is_deleted !== 1) || client.hoarding_is_deleted === 1,
      hoardingOccupiedTill: client.hoarding_occupied_till
    };
    this.isConfirmBookingModalOpen = true;
  }

  closeConfirmBookingModal() {
    this.isConfirmBookingModalOpen = false;
  }

  submitConfirmBooking() {
    if (this.confirmBookingData.action === 'confirm') {
      if (!this.confirmBookingData.occupied_till) {
        this.showToast("Please select an 'Occupied Till' date.", 'error');
        return;
      }
      this.apiService.confirmBooking(this.confirmBookingData.clientId, { occupied_till: this.confirmBookingData.occupied_till }).subscribe({
        next: (res: any) => {
          
          this.fetchHoardings();
          this.fetchClients();
          this.closeConfirmBookingModal();
        },
        error: (e) => {
          console.error(e);
          this.showToast(e.error?.message || 'Failed to confirm booking.', 'error');
        }
      });
    } else {
      this.apiService.updateClientStatus(this.confirmBookingData.clientId, 'UNDER REVIEW').subscribe({
        next: (res: any) => {
          
          this.fetchClients();
          this.closeConfirmBookingModal();
        },
        error: (e) => {
          console.error(e);
          this.showToast(e.error?.message || 'Failed to update status.', 'error');
        }
      });
    }
  }
  // --- End Clients Methods ---

  // --- Locations Methods ---
  fetchLocations() {
    this.apiService.getLocations().subscribe({
      next: (res) => { 
        if (res.success) {
          this.locations = res.data;
          this.cdr.detectChanges();
        }
      },
      error: (e) => console.error(e)
    });
  }

  openLocationModal(location?: any) {
    if (location) {
      this.editingLocationId = location.id;
      this.newLocation = { 
        name: location.name, 
        state: location.state, 
        district: location.district, 
        status: location.status 
      };
    } else {
      this.editingLocationId = null;
      this.newLocation = { 
        name: '', 
        state: '', 
        district: '', 
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

    if (this.editingLocationId) {
      this.apiService.updateLocation(this.editingLocationId, payload).subscribe({
        next: () => { this.fetchLocations(); this.closeLocationModal(); },
        error: (e) => {
          console.error(e);
          this.showToast(e.error?.message || 'Failed to update location. Check console for details.', 'error');
        }
      });
    } else {
      this.apiService.createLocation(payload).subscribe({
        next: () => { this.fetchLocations(); this.closeLocationModal(); },
        error: (e) => {
          console.error(e);
          this.showToast(e.error?.message || 'Failed to create location. Check console for details.', 'error');
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
          this.showToast(e.error?.message || 'Failed to delete location.', 'error');
        }
      });
    }
  }
  
  viewingLocation: any = null;

  viewLocation(location: any) {
    this.viewingLocation = location;
  }

  closeViewLocationModal() {
    this.viewingLocation = null;
  }

  // --- End Locations Methods ---

  setActiveTab(tab: string) {
    this.activeTab = tab;
    if (tab === 'management') {
      this.resetForm();
      this.resetFilters();
    }
  }

  editHoarding(h: any) {
    this.editingHoardingId = h.id;
    this.newHoarding = {
      location_id: h.location_id || 1,
      name: h.name,
      description: h.description || '',
      dimensions: h.dimensions || '',
      availability_status: h.availability_status || 'AVAILABLE',
      occupied_till: h.occupied_till ? new Date(h.occupied_till).toISOString().split('T')[0] : null,
      latitude: h.latitude || '',
      longitude: h.longitude || '',
      google_maps_url: h.google_maps_url || '',
      state: h.state || '',
      district: h.district || ''
    };
    this.selectedFiles = [];
    this.filePreviews = [];
    // Load existing images for this hoarding
    this.apiService.getHoardingImages(h.id).subscribe({
      next: (res: any) => { if (res.success) this.existingImages = res.data; },
      error: () => { this.existingImages = []; }
    });
    this.activeTab = 'add-hoarding';
  }

  viewHoarding(h: any) {
    this.viewingHoarding = h;
    this.currentImageIndex = 0;
    if (h.all_images) {
      this.viewingHoarding.images_array = h.all_images.split(',');
    } else if (h.primary_image) {
      this.viewingHoarding.images_array = [h.primary_image];
    } else {
      this.viewingHoarding.images_array = [];
    }
  }

  nextImage() {
    if (this.viewingHoarding?.images_array?.length) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.viewingHoarding.images_array.length;
    }
  }

  prevImage() {
    if (this.viewingHoarding?.images_array?.length) {
      this.currentImageIndex = (this.currentImageIndex - 1 + this.viewingHoarding.images_array.length) % this.viewingHoarding.images_array.length;
    }
  }

  closeViewModal() {
    this.viewingHoarding = null;
  }

  resetForm() {
    this.editingHoardingId = null;
    this.selectedFiles = [];
    this.filePreviews = [];
    this.existingImages = [];
    this.newHoarding = { location_id: this.locations.length > 0 ? this.locations[0].id : null, name: '', description: '', dimensions: '', availability_status: 'AVAILABLE', occupied_till: null, latitude: '', longitude: '', google_maps_url: '' };
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
    const files: FileList = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      this.selectedFiles.push(file);
      const reader = new FileReader();
      reader.onload = (e: any) => this.filePreviews.push(e.target.result);
      reader.readAsDataURL(file);
    }
    // Reset input so same files can be re-selected
    event.target.value = '';
  }

  removeSelectedFile(index: number) {
    this.selectedFiles.splice(index, 1);
    this.filePreviews.splice(index, 1);
  }

  deleteHoardingImage(imageId: number) {
    if (!confirm('Delete this image?')) return;
    this.apiService.deleteHoardingImage(imageId).subscribe({
      next: () => {
        this.existingImages = this.existingImages.filter((img: any) => img.id !== imageId);
      },
      error: (e) => console.error('Failed to delete image', e)
    });
  }

  saveHoarding() {
    const formData = new FormData();
    Object.keys(this.newHoarding).forEach(key => {
      const val = this.newHoarding[key];
      if (key !== 'primary_image' && val !== null && val !== undefined && val !== '') {
        formData.append(key, val);
      }
    });
    // Append all selected files under 'images'
    this.selectedFiles.forEach(file => formData.append('images', file));

    if (this.editingHoardingId) {
      this.apiService.updateHoarding(this.editingHoardingId, formData).subscribe({
        next: () => {
          this.showToast('Hoarding updated successfully!', 'success');
          this.fetchHoardings();
          this.resetForm();
          this.activeTab = 'management';
        },
        error: (e) => {
          console.error('Failed to update via SP', e);
          this.showToast('Failed to update hoarding. Check console for details.', 'error');
        }
      });
    } else {
      this.apiService.createHoarding(formData).subscribe({
        next: () => {
          this.showToast('Hoarding created successfully!', 'success');
          this.fetchHoardings();
          this.resetForm();
          this.activeTab = 'management';
        },
        error: (e) => {
          console.error('Failed to create via SP', e);
          this.showToast('Failed to create hoarding. Check console for details.', 'error');
        }
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
  


  openStatusModal(hoarding: any) {
    this.statusUpdateData = {
      id: hoarding.id,
      availability_status: hoarding.availability_status || 'AVAILABLE',
      occupied_till: hoarding.occupied_till ? new Date(hoarding.occupied_till).toISOString().split('T')[0] : ''
    };
    this.showStatusModal = true;
  }

  closeStatusModal() {
    this.showStatusModal = false;
  }

  submitStatusUpdate() {
    this.apiService.updateHoardingAvailability(this.statusUpdateData.id, this.statusUpdateData).subscribe({
      next: (res) => {
        if (res.success) {
          this.closeStatusModal();
          this.fetchHoardings();
          if (this.statusUpdateData.availability_status === 'AVAILABLE') {
            this.notifications.push('A booked hoarding is now available!');
            this.showNotifications = true;
            setTimeout(() => { this.showNotifications = false; }, 5000);
          }
        }
      },
      error: (e) => {
        console.error(e);
        this.showToast('Failed to update status', 'error');
      }
    });
  }
}
