const fs = require('fs');
const file = 'src/app/components/admin-dashboard/admin-dashboard.component.html';
let content = fs.readFileSync(file, 'utf8');

// Replace Occupied Till to add *ngIf
let regex = /<div class="detail-item">\s*<span class="label">Occupied Till<\/span>\s*<span class="val">\{\{ \(viewingHoarding\.occupied_till \| date:'dd MMM yyyy'\) \|\| '-'\ \}\}<\/span>\s*<\/div>/g;
let replacement = `<div class="detail-item" *ngIf="viewingHoarding.availability_status === 'OCCUPIED'">
                  <span class="label">Occupied Till</span>
                  <span class="val">{{ (viewingHoarding.occupied_till | date:'dd MMM yyyy') || '-' }}</span>
                </div>`;
content = content.replace(regex, replacement);

// Add Lat/Lon, Status, and Link after District & State row
regex = /<div class="detail-item">\s*<span class="label">District & State<\/span>[\s\S]*?<\/div>\s*<\/div>/g;
replacement = `<div class="detail-item">
                  <span class="label">District & State</span>
                  <span class="val" style="font-weight: 500; color: #374151;">{{ (viewingHoarding.district || viewingHoarding.loc_district || 'N/A') | titlecase }}, {{ (viewingHoarding.state || viewingHoarding.loc_state || 'N/A') | titlecase }}</span>
                </div>
              </div>
              <div class="detail-grid" style="margin-top: 15px;">
                <div class="detail-item">
                  <span class="label">Coordinates (Lat, Lon)</span>
                  <span class="val" style="font-weight: 500; color: #374151;">
                    {{ viewingHoarding.latitude || 'N/A' }}{{ viewingHoarding.longitude ? ', ' + viewingHoarding.longitude : '' }}
                  </span>
                </div>
                <div class="detail-item">
                  <span class="label">Visibility Status</span>
                  <span class="val" style="font-weight: 500; color: #374151;">{{ (viewingHoarding.status || 'ACTIVE') | titlecase }}</span>
                </div>
              </div>
              <div class="detail-grid" style="margin-top: 15px;" *ngIf="viewingHoarding.google_maps_url">
                <div class="detail-item" style="grid-column: span 2;">
                  <span class="label">Google Maps Link</span>
                  <a [href]="viewingHoarding.google_maps_url" target="_blank" style="color: #3b82f6; text-decoration: none; word-break: break-all; font-weight: 500; font-size: 14px;">
                    {{ viewingHoarding.google_maps_url }}
                  </a>
                </div>
              </div>`;
content = content.replace(regex, replacement);

fs.writeFileSync(file, content);
console.log("Updated HTML for viewingHoarding details to hide occupied till and show lat/lon/link.");
