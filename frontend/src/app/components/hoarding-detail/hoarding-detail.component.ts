import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-hoarding-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hoarding-detail.component.html',
  styleUrl: './hoarding-detail.component.css'
})
export class HoardingDetailComponent implements OnInit {
  hoarding: any = null;
  loading: boolean = true;
  error: string | null = null;
  backendUrl = 'http://localhost:5000';
  isBookingModalOpen: boolean = false;
  bookingForm = { name: '', email: '', phone: '' };
  bookingSuccess: boolean = false;
  isHighlighting: boolean = false;

  mapUrl: SafeResourceUrl | null = null;
  mapLoaded: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const stateHoarding = history.state?.hoarding;

    if (stateHoarding && (!id || stateHoarding.id == id)) {
      this.hoarding = stateHoarding;
      this.loading = false;
      this.initMap();
    }

    if (id) {
      this.fetchHoarding(Number(id));
    } else if (!this.hoarding) {
      this.error = 'Invalid hoarding ID';
      this.loading = false;
    }
  }

  initMap(): void {
    if (this.hoarding?.latitude && this.hoarding?.longitude) {
      const lat = parseFloat(this.hoarding.latitude);
      const lng = parseFloat(this.hoarding.longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        // Fast, reliable Google Maps embed with precise pin & no rate limiting
        const url = `https://maps.google.com/maps?q=${lat},${lng}&hl=en&z=15&output=embed`;
        this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      }
    }
  }

  onMapLoad(): void {
    this.mapLoaded = true;
  }

  getGoogleMapsLink(): string | null {
    if (this.hoarding?.google_maps_url) {
      return this.hoarding.google_maps_url;
    }
    if (this.hoarding?.latitude && this.hoarding?.longitude) {
      return `https://www.google.com/maps?q=${this.hoarding.latitude},${this.hoarding.longitude}`;
    }
    return null;
  }

  fetchHoarding(id: number): void {
    this.apiService.getHoardingById(id).subscribe({
      next: (res) => {
        if (res.success) {
          this.hoarding = res.data;
          if (!this.mapUrl) {
            this.initMap();
          }
        } else if (!this.hoarding) {
          this.error = res.message || 'Failed to fetch hoarding details';
        }
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        if (!this.hoarding) {
          this.error = 'An error occurred while fetching details.';
        }
        this.loading = false;
      }
    });
  }

  bookHoarding(): void {
    if (this.hoarding) {
      this.isBookingModalOpen = true;
    }
  }

  closeBookingModal(): void {
    this.isBookingModalOpen = false;
    this.bookingSuccess = false;
  }

  submitBooking(): void {
    const payload = {
      name: this.bookingForm.name,
      email: this.bookingForm.email,
      phone: this.bookingForm.phone,
      hoarding_id: this.hoarding.id,
      status: 'ACTIVE'
    };

    this.apiService.createClient(payload).subscribe({
      next: (res) => {
        this.bookingSuccess = true;
        this.bookingForm = { name: '', email: '', phone: '' };
      },
      error: (e) => {
        console.error(e);
        alert('Failed to submit booking inquiry.');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/public']);
  }

  copied: boolean = false;
  copyLink(): void {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      this.copied = true;
      setTimeout(() => this.copied = false, 2000);
    }
  }

  highlightDetails(): void {
    this.isHighlighting = true;
    setTimeout(() => {
      this.isHighlighting = false;
    }, 1500);
  }
}
