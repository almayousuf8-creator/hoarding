const fs = require('fs');
const path = require('path');

const entities = [
  { name: 'State', table: 'states', fields: ['name', 'status'] },
  { name: 'District', table: 'districts', fields: ['state_id', 'name', 'status'] },
  { name: 'Client', table: 'clients', fields: ['name', 'email', 'phone', 'address', 'status'] },
  { name: 'Location', table: 'locations', fields: ['district_id', 'client_id', 'name', 'description', 'latitude', 'longitude', 'google_maps_url', 'status'] },
  { name: 'Hoarding', table: 'hoardings', fields: ['location_id', 'name', 'description', 'availability_status', 'occupied_till', 'latitude', 'longitude', 'google_maps_url', 'status'] }
];

const controllersDir = path.join(__dirname, 'src', 'controllers');
const routesDir = path.join(__dirname, 'src', 'routes');

if (!fs.existsSync(controllersDir)) fs.mkdirSync(controllersDir, { recursive: true });
if (!fs.existsSync(routesDir)) fs.mkdirSync(routesDir, { recursive: true });

entities.forEach(entity => {
  const lowerName = entity.name.toLowerCase();
  const pluralName = entity.table;
  
  // Controller
  const controllerContent = `import { Request, Response } from 'express';
import pool from '../config/db';

export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const [rows] = await pool.query('SELECT * FROM ${pluralName}');
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const [rows]: any = await pool.query('SELECT * FROM ${pluralName} WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      res.status(404).json({ success: false, message: '${entity.name} not found' });
      return;
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body;
    const fields = Object.keys(body).filter(k => ${JSON.stringify(entity.fields)}.includes(k));
    const values = fields.map(k => body[k]);
    const placeholders = fields.map(() => '?').join(', ');
    
    if (fields.length === 0) {
      res.status(400).json({ success: false, message: 'No valid fields provided' });
      return;
    }

    const query = \`INSERT INTO ${pluralName} (\${fields.join(', ')}) VALUES (\${placeholders})\`;
    const [result]: any = await pool.query(query, values);
    
    res.json({ success: true, message: '${entity.name} created successfully', data: { id: result.insertId } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body;
    const fields = Object.keys(body).filter(k => ${JSON.stringify(entity.fields)}.includes(k));
    const values = fields.map(k => body[k]);
    
    if (fields.length === 0) {
      res.status(400).json({ success: false, message: 'No valid fields provided' });
      return;
    }

    const setClause = fields.map(k => \`\${k} = ?\`).join(', ');
    const query = \`UPDATE ${pluralName} SET \${setClause} WHERE id = ?\`;
    values.push(req.params.id);
    
    const [result]: any = await pool.query(query, values);
    if (result.affectedRows === 0) {
      res.status(404).json({ success: false, message: '${entity.name} not found' });
      return;
    }
    
    res.json({ success: true, message: '${entity.name} updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const updateStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.body;
    if (!['ACTIVE', 'HIDDEN'].includes(status)) {
      res.status(400).json({ success: false, message: 'Invalid status' });
      return;
    }
    
    const [result]: any = await pool.query('UPDATE ${pluralName} SET status = ? WHERE id = ?', [status, req.params.id]);
    if (result.affectedRows === 0) {
      res.status(404).json({ success: false, message: '${entity.name} not found' });
      return;
    }
    
    res.json({ success: true, message: '${entity.name} status updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
`;

  fs.writeFileSync(path.join(controllersDir, `${pluralName}.ts`), controllerContent);

  // Route
  const routeContent = `import { Router } from 'express';
import { getAll, getById, create, update, updateStatus } from '../controllers/${pluralName}';
import { authenticate, requireAdmin, requireClient } from '../middleware/auth';

const router = Router();

router.get('/', getAll); // Make public or protected based on needs
router.get('/:id', getById);
router.post('/', authenticate, create); // Refine roles later
router.put('/:id', authenticate, update);
router.patch('/:id/status', authenticate, updateStatus);

export default router;
`;

  fs.writeFileSync(path.join(routesDir, `${pluralName}.ts`), routeContent);
});

console.log('CRUD controllers and routes generated.');
