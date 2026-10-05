const fs = require('fs');
const file = 'src/app/components/admin-dashboard/admin-dashboard.component.ts';
let content = fs.readFileSync(file, 'utf8');

const regex = /get filteredHoardings\(\) \{\s*return this\.hoardings\.filter\(h => \{\s*let match = true;\s*if \(this\.filterStatus && this\.filterStatus !== 'ALL' && h\.availability_status !== this\.filterStatus\) match = false;\s*const loc = this\.locations\.find\(l => l\.id === h\.location_id\);\s*if \(this\.filterLocationId && this\.filterLocationId !== -1 && loc\?\.id !== Number\(this\.filterLocationId\)\) match = false;\s*return match;\s*\}\);\s*\}/g;

const replacement = `get filteredHoardings() {
    return this.hoardings.filter(h => {
      let match = true;
      if (this.filterStatus && this.filterStatus !== 'ALL' && this.filterStatus !== 'null' && h.availability_status !== this.filterStatus) match = false;
      
      const loc = this.locations.find(l => l.id === h.location_id);
      
      if (this.filterState && this.filterState !== '') {
        if (!loc || loc.state.toLowerCase() !== this.filterState.toLowerCase()) match = false;
      }
      
      if (this.filterDistrict && this.filterDistrict !== '') {
        if (!loc || loc.district.toLowerCase() !== this.filterDistrict.toLowerCase()) match = false;
      }

      if (this.filterLocationId && this.filterLocationId !== -1 && String(this.filterLocationId) !== 'null' && loc?.id !== Number(this.filterLocationId)) match = false;
      
      return match;
    });
  }`;

content = content.replace(regex, replacement);

fs.writeFileSync(file, content);
console.log("Updated filteredHoardings logic.");
