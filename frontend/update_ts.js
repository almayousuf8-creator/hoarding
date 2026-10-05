const fs = require('fs');
const file = 'src/app/components/admin-dashboard/admin-dashboard.component.ts';
let content = fs.readFileSync(file, 'utf8');

// Add currentImageIndex
content = content.replace(/viewingHoarding: any = null;/, `viewingHoarding: any = null;\n  currentImageIndex: number = 0;`);

// Modify viewHoarding
let regex = /viewHoarding\(h: any\) \{\s*this\.viewingHoarding = h;\s*\}/;
let replacement = `viewHoarding(h: any) {
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
  }`;

content = content.replace(regex, replacement);

fs.writeFileSync(file, content);
console.log("Updated admin TS for image gallery.");
