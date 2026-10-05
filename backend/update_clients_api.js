const fs = require('fs');
const file = 'src/controllers/clients.js';
let content = fs.readFileSync(file, 'utf8');

// 1. Add availability_status to getAll and getById
content = content.replace(/SELECT c\.\*, h\.name as hoarding_name, h\.occupied_till as hoarding_occupied_till/g, "SELECT c.*, h.name as hoarding_name, h.occupied_till as hoarding_occupied_till, h.availability_status as hoarding_availability_status");

// 2. Add client status update to confirmBooking
let confirmRegex = /await pool\.query\('UPDATE hoardings SET availability_status = "OCCUPIED", occupied_till = \? WHERE id = \?', \[occupied_till \|\| null, hoardingId\]\);/g;
let confirmReplacement = `await pool.query('UPDATE hoardings SET availability_status = "OCCUPIED", occupied_till = ? WHERE id = ?', [occupied_till || null, hoardingId]);
    await pool.query('UPDATE clients SET status = "ACTIVE" WHERE id = ?', [req.params.id]);`;
content = content.replace(confirmRegex, confirmReplacement);

fs.writeFileSync(file, content);
console.log("Updated clients.js");
