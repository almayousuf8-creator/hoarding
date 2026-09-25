import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.fetchHoarding(Number(id));
    } else {
      this.error = 'Invalid hoarding ID';
      this.loading = false;
    }
  }

  fetchHoarding(id: number): void {
    this.apiService.getHoardingById(id).subscribe({
      next: (res) => {
        if (res.success) {
          this.hoarding = res.data;
        } else {
          this.error = res.message || 'Failed to fetch hoarding details';
        }
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'An error occurred while fetching details.';
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
}
