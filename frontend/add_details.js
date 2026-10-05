const fs = require('fs');
const file = 'src/app/components/admin-dashboard/admin-dashboard.component.html';
let content = fs.readFileSync(file, 'utf8');

const regex = /<div class="detail-grid">\s*<div class="detail-item">\s*<span class="label">Status<\/span>\s*<span class="badge" \[class\.available\]="viewingHoarding\.availability_status === 'AVAILABLE'" \[class\.occupied\]="viewingHoarding\.availability_status === 'OCCUPIED'">\s*\{\{ \(viewingHoarding\.availability_status \|\| 'AVAILABLE'\) \| titlecase \}\}\s*<\/span>\s*<\/div>\s*<div class="detail-item">\s*<span class="label">Occupied Till<\/span>\s*<span class="val">\{\{ \(viewingHoarding\.occupied_till \| date:'dd MMM yyyy'\) \|\| '-'\ \}\}<\/span>\s*<\/div>\s*<\/div>/g;

const replacement = `<div class="detail-grid">
                <div class="detail-item">
                  <span class="label">Status</span>
                  <span class="badge" [class.available]="viewingHoarding.availability_status === 'AVAILABLE'" [class.occupied]="viewingHoarding.availability_status === 'OCCUPIED'">
                    {{ (viewingHoarding.availability_status || 'AVAILABLE') | titlecase }}
                  </span>
                </div>
                <div class="detail-item">
                  <span class="label">Occupied Till</span>
                  <span class="val">{{ (viewingHoarding.occupied_till | date:'dd MMM yyyy') || '-' }}</span>
                </div>
              </div>
              <div class="detail-grid" style="margin-top: 15px;">
                <div class="detail-item">
                  <span class="label">Dimensions</span>
                  <span class="val" style="font-weight: 500; color: #374151;">{{ viewingHoarding.dimensions || 'N/A' }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">District & State</span>
                  <span class="val" style="font-weight: 500; color: #374151;">{{ (viewingHoarding.district || viewingHoarding.loc_district || 'N/A') | titlecase }}, {{ (viewingHoarding.state || viewingHoarding.loc_state || 'N/A') | titlecase }}</span>
                </div>
              </div>`;

content = content.replace(regex, replacement);

fs.writeFileSync(file, content);
console.log("Updated HTML for viewingHoarding details.");
