const fs = require('fs');
const file = 'src/app/components/hoarding-detail/hoarding-detail.component.html';
let content = fs.readFileSync(file, 'utf8');

// 1. Remove the old notice
const noticeRegex = /[\s]*<!-- Occupied Pre-booking Notice -->[\s]*<div \*ngIf="hoarding\.availability_status === 'OCCUPIED'" class="prebook-notice">[\s\S]*?<\/div>/g;
content = content.replace(noticeRegex, '');

// 2. Replace the badge
const badgeRegex = /<div class="status-badge right-status" \[class\.available\]="hoarding\.availability_status === 'AVAILABLE'" \[class\.booked\]="hoarding\.availability_status !== 'AVAILABLE'">[\s\S]*?<\/div>/;

let newBadgeAndNotice = `<div style="display: flex; align-items: center; gap: 15px; flex-wrap: wrap; margin-bottom: 20px;">
          <div class="status-badge right-status" [class.available]="hoarding.availability_status === 'AVAILABLE'" [class.booked]="hoarding.availability_status !== 'AVAILABLE'" style="margin-bottom: 0;">
            <span class="live-indicator"></span>
            <span>{{ hoarding.availability_status === 'AVAILABLE' ? 'Available' : 'Occupied' }}</span>
          </div>

          <!-- Occupied Notice -->
          <div *ngIf="hoarding.availability_status === 'OCCUPIED'" class="prebook-notice" style="margin-bottom: 0; padding: 6px 12px; display: flex; align-items: center;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span style="font-size: 0.85rem; line-height: 1.3;">
              This hoarding is currently occupied<strong *ngIf="hoarding.occupied_till"> till {{ hoarding.occupied_till | date:'dd MMM yyyy' }}</strong>.
            </span>
          </div>
        </div>`;

content = content.replace(badgeRegex, newBadgeAndNotice);

fs.writeFileSync(file, content);
console.log("Updated HTML.");
