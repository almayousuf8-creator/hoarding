const fs = require('fs');
const tsFile = 'src/app/components/admin-dashboard/admin-dashboard.component.ts';
let ts = fs.readFileSync(tsFile, 'utf8');

// 1. In deleteClient
ts = ts.replace(
  `            this.notifications.unshift(res.message);\r\n            this.showNotifications = true;\r\n            setTimeout(() => { this.showNotifications = false; }, 5000); // Auto-hide after 5s`,
  `            this.notifications.unshift('A booked hoarding is now available!');\r\n            this.showNotifications = true;\r\n            setTimeout(() => { this.showNotifications = false; }, 5000);`
);

// 2. In submitConfirmBooking (both success paths)
ts = ts.replace(
  /this\.notifications\.unshift\(res\.message\);\s*this\.showNotifications = true;\s*setTimeout\(\(\) => \{ this\.showNotifications = false; \}, 5000\);/g,
  ""
);
ts = ts.replace(
  /this\.notifications\.unshift\('Booking marked as Under Review\.'\);\s*this\.showNotifications = true;\s*setTimeout\(\(\) => \{ this\.showNotifications = false; \}, 5000\);/g,
  ""
);

// 3. In submitStatusUpdate
ts = ts.replace(
  /this\.notifications\.push\('Hoarding status updated successfully!'\);\s*this\.showNotifications = true;\s*setTimeout\(\(\) => \{ this\.showNotifications = false; \}, 5000\);/g,
  `if (this.statusUpdateData.availability_status === 'AVAILABLE') {\n            this.notifications.push('A booked hoarding is now available!');\n            this.showNotifications = true;\n            setTimeout(() => { this.showNotifications = false; }, 5000);\n          }`
);

fs.writeFileSync(tsFile, ts);
console.log("Updated TS");
