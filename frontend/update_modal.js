const fs = require('fs');
const file = 'src/app/components/admin-dashboard/admin-dashboard.component.html';
let content = fs.readFileSync(file, 'utf8');

// Replace image container with carousel
let regex = /<div class="view-image-container">\s*<img \*ngIf="viewingHoarding\.primary_image" \[src\]="backendUrl \+ viewingHoarding\.primary_image" class="view-main-image" \/>\s*<div \*ngIf="!viewingHoarding\.primary_image" class="view-no-image">No Image Available<\/div>\s*<\/div>/g;
let replacement = `<div class="view-image-container" style="position: relative;">
              <ng-container *ngIf="viewingHoarding.images_array?.length > 0; else noImage">
                <img [src]="backendUrl + viewingHoarding.images_array[currentImageIndex]" class="view-main-image" style="width: 100%; display: block;" />
                
                <button *ngIf="viewingHoarding.images_array.length > 1" (click)="prevImage()" style="position: absolute; left: 10px; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.5); color: white; border: none; border-radius: 50%; width: 36px; height: 36px; cursor: pointer; display: flex; align-items: center; justify-content: center;">
                  <i class='bx bx-chevron-left' style="font-size: 24px;"></i>
                </button>
                <button *ngIf="viewingHoarding.images_array.length > 1" (click)="nextImage()" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.5); color: white; border: none; border-radius: 50%; width: 36px; height: 36px; cursor: pointer; display: flex; align-items: center; justify-content: center;">
                  <i class='bx bx-chevron-right' style="font-size: 24px;"></i>
                </button>
                <div *ngIf="viewingHoarding.images_array.length > 1" style="position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.5); color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px;">
                  {{ currentImageIndex + 1 }} / {{ viewingHoarding.images_array.length }}
                </div>
              </ng-container>
              <ng-template #noImage>
                <div class="view-no-image">No Image Available</div>
              </ng-template>
            </div>`;
content = content.replace(regex, replacement);

// Remove Visibility Status
regex = /<div class="detail-item">\s*<span class="label">Visibility Status<\/span>\s*<span class="val" style="font-weight: 500; color: #374151;">\{\{ \(viewingHoarding\.status \|\| 'ACTIVE'\) \| titlecase \}\}<\/span>\s*<\/div>/g;
content = content.replace(regex, '');

fs.writeFileSync(file, content);
console.log("Updated HTML for image gallery and removed visibility status.");
