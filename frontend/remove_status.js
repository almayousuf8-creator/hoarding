const fs = require('fs');

// 1. Update HTML
const htmlFile = 'src/app/components/admin-dashboard/admin-dashboard.component.html';
let html = fs.readFileSync(htmlFile, 'utf8');

// Remove the Status dropdown block
html = html.replace(
  /<div class="form-group">\s*<label>Status<\/label>\s*<select name="status" \[\(ngModel\)\]="newClient\.status"[^>]*>\s*<option value="ACTIVE">Active<\/option>\s*<option value="HIDDEN">Hidden<\/option>\s*<\/select>\s*<\/div>/g,
  ''
);

// Adjust the grid for Interested In so it spans full width or just removes the flex grid if needed
// Actually, it's inside `<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">`
html = html.replace(
  /<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">\s*<div class="form-group">\s*<label>Interested In \(Hoarding\)<\/label>/g,
  '<div style="display: grid; grid-template-columns: 1fr; gap: 15px; margin-bottom: 20px;">\n                <div class="form-group">\n                  <label>Interested In (Hoarding)</label>'
);

// Remove the `&& newClient.status !== 'HIDDEN'` from Occupied Till condition
html = html.replace(
  /<div \*ngIf="newClient\.hoarding_id && newClient\.status !== 'HIDDEN'" style="margin-bottom: 20px;">/g,
  '<div *ngIf="newClient.hoarding_id" style="margin-bottom: 20px;">'
);

fs.writeFileSync(htmlFile, html);


// 2. Update TS
const tsFile = 'src/app/components/admin-dashboard/admin-dashboard.component.ts';
let ts = fs.readFileSync(tsFile, 'utf8');

// Remove `status: 'ACTIVE'` from newClient initialization
ts = ts.replace(
  /newClient: any = { name: '', email: '', phone: '', address: '', status: 'ACTIVE', hoarding_id: null };/g,
  "newClient: any = { name: '', email: '', phone: '', address: '', hoarding_id: null };"
);
ts = ts.replace(
  /this\.newClient = { name: '', email: '', phone: '', address: '', status: 'ACTIVE', hoarding_id: null, payment: null, occupied_till: null };/g,
  "this.newClient = { name: '', email: '', phone: '', address: '', hoarding_id: null, payment: null, occupied_till: null };"
);
// Remove `status: client.status, ` from `openClientModal`
ts = ts.replace(
  /\s*status: client\.status,/g,
  ""
);

fs.writeFileSync(tsFile, ts);


// 3. Update Backend clients.js
const backendFile = '../../backend/src/controllers/clients.js';
let backend = fs.readFileSync(backendFile, 'utf8');

// In create
backend = backend.replace(
  /const { name, email, phone, address, status, hoarding_id, occupied_till } = req\.body;/g,
  "const { name, email, phone, address, hoarding_id, occupied_till } = req.body;"
);
backend = backend.replace(
  /const finalStatus = status \|\| 'ACTIVE';/g,
  ""
);
backend = backend.replace(
  /'INSERT INTO clients \(name, email, phone, address, status, hoarding_id\) VALUES \(\?, \?, \?, \?, \?, \?\)',\s*\[name, email \|\| null, phone \|\| null, address \|\| null, finalStatus, hoarding_id \|\| null\]/g,
  "'INSERT INTO clients (name, email, phone, address, hoarding_id) VALUES (?, ?, ?, ?, ?)',\n      [name, email || null, phone || null, address || null, hoarding_id || null]"
);

// In update
backend = backend.replace(
  /const { name, email, phone, address, status, hoarding_id, occupied_till } = req\.body;/g,
  "const { name, email, phone, address, hoarding_id, occupied_till } = req.body;"
);
backend = backend.replace(
  /'UPDATE clients SET name = \?, email = \?, phone = \?, address = \?, status = \?, hoarding_id = \? WHERE id = \?',\s*\[name, email \|\| null, phone \|\| null, address \|\| null, status \|\| 'ACTIVE', hoarding_id \|\| null, req\.params\.id\]/g,
  "'UPDATE clients SET name = ?, email = ?, phone = ?, address = ?, hoarding_id = ? WHERE id = ?',\n      [name, email || null, phone || null, address || null, hoarding_id || null, req.params.id]"
);

fs.writeFileSync(backendFile, backend);

console.log("Removed status from frontend and backend.");
