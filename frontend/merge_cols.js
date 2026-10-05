const fs = require('fs');

const htmlFile = 'src/app/components/admin-dashboard/admin-dashboard.component.html';
let html = fs.readFileSync(htmlFile, 'utf8');

// Replace table headers
html = html.replace(
  /<th>Booking<\/th>\s*<th>Status<\/th>/g,
  '<th>Status</th>'
);

// Replace the two TDs in the table body
html = html.replace(
  /<td>\s*<button \*ngIf="c\.hoarding_name"[^>]+>Update<\/button>\s*<\/td>\s*<td><span class="text-green"[^>]+>{{ c\.status \| titlecase }}<\/span><\/td>/g,
  `<td style="display: flex; flex-direction: column; gap: 6px; justify-content: center;">
                  <span class="text-green" [style.color]="c.status === 'ACTIVE' ? '#10b981' : (c.status === 'UNDER REVIEW' ? '#f59e0b' : '#ef4444')" style="font-weight: 600;">{{ c.status | titlecase }}</span>
                  <button *ngIf="c.hoarding_name" type="button" class="btn-sm" style="padding: 4px 10px; font-size: 11px; border-radius: 4px; border: 1px solid #d1d5db; background: #f3f4f6; color: #374151; font-weight: 500; cursor: pointer; align-self: flex-start;" (click)="openConfirmBookingModal(c)">Update</button>
                </td>`
);

fs.writeFileSync(htmlFile, html);
console.log("Updated HTML");
