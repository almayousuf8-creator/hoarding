const fs = require('fs');
const file = 'src/app/components/admin-dashboard/admin-dashboard.component.ts';
let content = fs.readFileSync(file, 'utf8');

const regex = /setActiveTab\(tab: string\) \{\s*this\.activeTab = tab;\s*if \(tab === 'management'\) \{\s*this\.resetForm\(\);\s*\}\s*\}/g;
const replacement = `setActiveTab(tab: string) {
    this.activeTab = tab;
    if (tab === 'management') {
      this.resetForm();
      this.resetFilters();
    }
  }`;

content = content.replace(regex, replacement);

fs.writeFileSync(file, content);
console.log("Updated setActiveTab in admin dashboard to reset filters.");
