const fs = require('fs');

const htmlFile = 'src/app/components/admin-dashboard/admin-dashboard.component.html';
let html = fs.readFileSync(htmlFile, 'utf8');

const regex = /<td style="display: flex; flex-direction: column; gap: 6px; justify-content: center;">\s*<span class="text-green"[^>]*>{{ c\.status \| titlecase }}<\/span>\s*<button \*ngIf="c\.hoarding_name" type="button" class="btn-sm" style="[^"]*" \(click\)="openConfirmBookingModal\(c\)">Update<\/button>\s*<\/td>/g;

const replacement = `<td style="display: flex; align-items: center; gap: 10px;">
                  <button *ngIf="c.hoarding_name" type="button" class="btn-sm" style="padding: 4px 10px; font-size: 11px; border-radius: 4px; border: 1px solid #d1d5db; background: #f3f4f6; color: #374151; font-weight: 500; cursor: pointer;" (click)="openConfirmBookingModal(c)">Update</button>
                  <span class="text-green" [style.color]="c.status === 'ACTIVE' ? '#10b981' : (c.status === 'UNDER REVIEW' ? '#f59e0b' : '#ef4444')" style="font-weight: 600;">{{ c.status | titlecase }}</span>
                </td>`;

html = html.replace(regex, replacement);
fs.writeFileSync(htmlFile, html);
console.log("Updated HTML layout");
