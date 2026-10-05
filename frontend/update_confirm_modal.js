const fs = require('fs');

// Update TS
let tsFile = 'src/app/components/admin-dashboard/admin-dashboard.component.ts';
let tsContent = fs.readFileSync(tsFile, 'utf8');

let tsRegex = /openConfirmBookingModal\(client: any\) \{\s*this\.confirmBookingData = \{\s*clientId: client\.id,\s*hoardingName: client\.hoarding_name,\s*action: 'confirm',\s*occupied_till: ''\s*\};\s*this\.isConfirmBookingModalOpen = true;\s*\}/g;
let tsReplacement = `openConfirmBookingModal(client: any) {
    this.confirmBookingData = {
      clientId: client.id,
      hoardingName: client.hoarding_name,
      action: 'confirm',
      occupied_till: '',
      isOccupied: client.hoarding_availability_status === 'OCCUPIED',
      hoardingOccupiedTill: client.hoarding_occupied_till
    };
    this.isConfirmBookingModalOpen = true;
  }`;

tsContent = tsContent.replace(tsRegex, tsReplacement);
fs.writeFileSync(tsFile, tsContent);

// Update HTML
let htmlFile = 'src/app/components/admin-dashboard/admin-dashboard.component.html';
let htmlContent = fs.readFileSync(htmlFile, 'utf8');

let htmlRegex = /Update booking status for <strong>\{\{ confirmBookingData\.hoardingName \|\| 'Lead' \}\}<\/strong>\.\s*<\/p>\s*<form \(ngSubmit\)="submitConfirmBooking\(\)">/g;
let htmlReplacement = `Update booking status for <strong>{{ confirmBookingData.hoardingName || 'Lead' }}</strong>.
            </p>
            <div *ngIf="confirmBookingData.isOccupied" style="background: #fef2f2; border: 1px solid #fecaca; color: #b91c1c; padding: 10px; border-radius: 4px; margin-bottom: 15px; font-size: 13px;">
              <i class='bx bx-error-circle' style="vertical-align: middle; margin-right: 5px; font-size: 16px;"></i>
              <strong>Warning:</strong> This hoarding is already occupied until <strong>{{ confirmBookingData.hoardingOccupiedTill | date:'dd MMM yyyy' }}</strong>. Confirming a new booking will replace it.
            </div>
            <form (ngSubmit)="submitConfirmBooking()">`;

htmlContent = htmlContent.replace(htmlRegex, htmlReplacement);
fs.writeFileSync(htmlFile, htmlContent);

console.log("Updated TS and HTML for confirm booking modal.");
