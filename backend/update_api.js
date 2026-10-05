const fs = require('fs');
const file = 'src/controllers/hoardings.js';
let content = fs.readFileSync(file, 'utf8');

// Add all_images to getAll
let regex = /\(SELECT image_path FROM hoarding_images WHERE hoarding_id = h\.id ORDER BY sort_order ASC LIMIT 1\) as primary_image/g;
let replacement = `(SELECT image_path FROM hoarding_images WHERE hoarding_id = h.id ORDER BY sort_order ASC LIMIT 1) as primary_image,
      (SELECT GROUP_CONCAT(image_path ORDER BY sort_order ASC SEPARATOR ',') FROM hoarding_images WHERE hoarding_id = h.id) as all_images`;
content = content.replace(regex, replacement);

fs.writeFileSync(file, content);
console.log("Updated hoardings API to include all_images.");
