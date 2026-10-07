import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const dbPath = path.join(__dirname, 'data', 'availability.db');
const db = new DatabaseSync(dbPath);

// Initialize SQLite tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    initials TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'Team Member',
    department TEXT NOT NULL DEFAULT 'Engineering',
    timezone TEXT NOT NULL DEFAULT 'UTC+05:30',
    status_message TEXT DEFAULT '',
    status_emoji TEXT DEFAULT '',
    avatar_color TEXT DEFAULT '#6366f1',
    is_available INTEGER NOT NULL DEFAULT 0 CHECK (is_available IN (0, 1)),
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS activity_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    user_name TEXT NOT NULL,
    action TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Helper to seed initial sample data
function seedData() {
  db.exec('DELETE FROM users');
  db.exec('DELETE FROM activity_log');

  const insertUser = db.prepare(`
    INSERT INTO users (name, email, initials, role, department, timezone, status_message, status_emoji, avatar_color, is_available, last_updated)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
  `);

  const initialUsers = [
    ['Aarav Sharma', 'aarav.sharma@acme.corp', 'AS', 'Principal Architect', 'Engineering', 'IST (UTC+5:30)', 'Reviewing PRs & System Design 🚀', '🚀', '#6366f1', 1],
    ['Maya Patel', 'maya.patel@acme.corp', 'MP', 'Lead UI/UX Designer', 'Design', 'IST (UTC+5:30)', 'Design sprint workshop until 4 PM 🎨', '🎨', '#ec4899', 0],
    ['Rohan Gupta', 'rohan.gupta@acme.corp', 'RG', 'Senior Full Stack Dev', 'Engineering', 'PST (UTC-8:00)', 'Pair programming on payment gateway 💻', '💻', '#10b981', 1],
    ['Sara Khan', 'sara.khan@acme.corp', 'SK', 'Senior Product Manager', 'Product', 'GMT (UTC+0:00)', 'Client roadmap sync 📞', '📞', '#f59e0b', 0],
    ['Alex Chen', 'alex.chen@acme.corp', 'AC', 'DevOps & Cloud Lead', 'Infrastructure', 'EST (UTC-5:00)', 'Kubernetes cluster maintenance ⚡', '⚡', '#8b5cf6', 1],
    ['Elena Rostova', 'elena.rostova@acme.corp', 'ER', 'Growth & Marketing Lead', 'Marketing', 'CET (UTC+1:00)', 'Campaign launch optimization 📈', '📈', '#06b6d4', 1],
    ['David Kim', 'david.kim@acme.corp', 'DK', 'QA Automation Engineer', 'Quality', 'KST (UTC+9:00)', 'Running regression test suites 🧪', '🧪', '#14b8a6', 0],
    ['Priya Nair', 'priya.nair@acme.corp', 'PN', 'AI/ML Research Scientist', 'AI & Data', 'IST (UTC+5:30)', 'Fine-tuning LLM agent models 🧠', '🧠', '#f43f5e', 1],
  ];

  for (const user of initialUsers) {
    insertUser.run(...user);
  }

  const insertActivity = db.prepare(`
    INSERT INTO activity_log (user_id, user_name, action, timestamp)
    VALUES (?, ?, ?, datetime('now', ?))
  `);

  insertActivity.run(1, 'Aarav Sharma', 'switched status to Available', '-5 minutes');
  insertActivity.run(3, 'Rohan Gupta', 'switched status to Available', '-18 minutes');
  insertActivity.run(2, 'Maya Patel', 'set status to "Design sprint workshop until 4 PM 🎨"', '-45 minutes');
  insertActivity.run(5, 'Alex Chen', 'switched status to Available', '-1 hour');
}

const userCount = db.prepare('SELECT COUNT(*) AS count FROM users').get().count;
if (userCount === 0) {
  seedData();
}

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Format user record for API JSON output
function formatUser(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    initials: row.initials,
    role: row.role || 'Team Member',
    department: row.department || 'Engineering',
    timezone: row.timezone || 'UTC+05:30',
    statusMessage: row.status_message || '',
    statusEmoji: row.status_emoji || '',
    avatarColor: row.avatar_color || '#6366f1',
    isAvailable: Boolean(row.is_available),
    lastUpdated: row.last_updated
  };
}

// GET all users
app.get('/api/users', (_req, res) => {
  try {
    const rows = db.prepare(`
      SELECT id, name, email, initials, role, department, timezone, 
             status_message, status_emoji, avatar_color, is_available, last_updated 
      FROM users 
      ORDER BY is_available DESC, name ASC
    `).all();
    res.json(rows.map(formatUser));
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Failed to retrieve team members.' });
  }
});

// GET single user
app.get('/api/users/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: 'Valid integer ID required.' });
  }
  const user = db.prepare(`
    SELECT id, name, email, initials, role, department, timezone, 
           status_message, status_emoji, avatar_color, is_available, last_updated 
    FROM users WHERE id = ?
  `).get(id);

  if (!user) return res.status(404).json({ message: 'User not found.' });
  res.json(formatUser(user));
});

// PATCH toggle availability & optional status
app.patch('/api/users/:id/availability', (req, res) => {
  const id = Number(req.params.id);
  const { isAvailable, statusMessage, statusEmoji } = req.body;

  if (!Number.isInteger(id) || typeof isAvailable !== 'boolean') {
    return res.status(400).json({ message: 'id and boolean isAvailable are required.' });
  }

  const existing = db.prepare('SELECT name FROM users WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ message: 'User not found.' });

  if (statusMessage !== undefined || statusEmoji !== undefined) {
    db.prepare(`
      UPDATE users 
      SET is_available = ?, 
          status_message = COALESCE(?, status_message),
          status_emoji = COALESCE(?, status_emoji),
          last_updated = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).run(isAvailable ? 1 : 0, statusMessage ?? null, statusEmoji ?? null, id);
  } else {
    db.prepare(`
      UPDATE users 
      SET is_available = ?, 
          last_updated = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).run(isAvailable ? 1 : 0, id);
  }

  // Log activity
  const actionText = isAvailable ? 'switched status to Available' : 'switched status to Away';
  db.prepare(`
    INSERT INTO activity_log (user_id, user_name, action, timestamp)
    VALUES (?, ?, ?, CURRENT_TIMESTAMP)
  `).run(id, existing.name, actionText);

  const updatedUser = db.prepare(`
    SELECT id, name, email, initials, role, department, timezone, 
           status_message, status_emoji, avatar_color, is_available, last_updated 
    FROM users WHERE id = ?
  `).get(id);

  res.json(formatUser(updatedUser));
});

// POST create new user
app.post('/api/users', (req, res) => {
  const { name, email, role, department, timezone, statusMessage, statusEmoji, avatarColor, isAvailable } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required.' });
  }

  // Calculate initials from name
  const nameParts = name.trim().split(/\s+/);
  const initials = nameParts.length > 1
    ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
    : name.substring(0, 2).toUpperCase();

  const colors = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#14b8a6', '#f43f5e', '#3b82f6'];
  const assignedColor = avatarColor || colors[Math.floor(Math.random() * colors.length)];

  try {
    const result = db.prepare(`
      INSERT INTO users (name, email, initials, role, department, timezone, status_message, status_emoji, avatar_color, is_available, last_updated)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `).run(
      name.trim(),
      email.trim().toLowerCase(),
      initials,
      role || 'Team Member',
      department || 'Engineering',
      timezone || 'IST (UTC+5:30)',
      statusMessage || '',
      statusEmoji || '',
      assignedColor,
      isAvailable ? 1 : 0
    );

    const newId = Number(result.lastInsertRowid);
    db.prepare(`
      INSERT INTO activity_log (user_id, user_name, action, timestamp)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP)
    `).run(newId, name.trim(), 'joined the team tracker');

    const createdUser = db.prepare(`
      SELECT id, name, email, initials, role, department, timezone, 
             status_message, status_emoji, avatar_color, is_available, last_updated 
      FROM users WHERE id = ?
    `).get(newId);

    res.status(201).json(formatUser(createdUser));
  } catch (err) {
    if (err.message && err.message.includes('UNIQUE constraint failed')) {
      return res.status(409).json({ message: 'A team member with this email already exists.' });
    }
    console.error('Error creating user:', err);
    res.status(500).json({ message: 'Failed to add team member.' });
  }
});

// PUT update user
app.put('/api/users/:id', (req, res) => {
  const id = Number(req.params.id);
  const { name, email, role, department, timezone, statusMessage, statusEmoji, avatarColor, isAvailable } = req.body;

  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: 'Valid integer ID required.' });
  }

  const existing = db.prepare('SELECT id FROM users WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ message: 'User not found.' });

  const nameParts = (name || '').trim().split(/\s+/);
  const initials = nameParts.length > 1
    ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
    : (name || 'TM').substring(0, 2).toUpperCase();

  try {
    db.prepare(`
      UPDATE users 
      SET name = COALESCE(?, name),
          email = COALESCE(?, email),
          initials = COALESCE(?, initials),
          role = COALESCE(?, role),
          department = COALESCE(?, department),
          timezone = COALESCE(?, timezone),
          status_message = COALESCE(?, status_message),
          status_emoji = COALESCE(?, status_emoji),
          avatar_color = COALESCE(?, avatar_color),
          is_available = COALESCE(?, is_available),
          last_updated = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      name ? name.trim() : null,
      email ? email.trim().toLowerCase() : null,
      name ? initials : null,
      role || null,
      department || null,
      timezone || null,
      statusMessage ?? null,
      statusEmoji ?? null,
      avatarColor || null,
      typeof isAvailable === 'boolean' ? (isAvailable ? 1 : 0) : null,
      id
    );

    const updatedUser = db.prepare(`
      SELECT id, name, email, initials, role, department, timezone, 
             status_message, status_emoji, avatar_color, is_available, last_updated 
      FROM users WHERE id = ?
    `).get(id);

    res.json(formatUser(updatedUser));
  } catch (err) {
    if (err.message && err.message.includes('UNIQUE constraint failed')) {
      return res.status(409).json({ message: 'A team member with this email already exists.' });
    }
    console.error('Error updating user:', err);
    res.status(500).json({ message: 'Failed to update member.' });
  }
});

// DELETE user
app.delete('/api/users/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: 'Valid integer ID required.' });
  }

  const existing = db.prepare('SELECT name FROM users WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ message: 'User not found.' });

  db.prepare('DELETE FROM users WHERE id = ?').run(id);
  db.prepare(`
    INSERT INTO activity_log (user_id, user_name, action, timestamp)
    VALUES (?, ?, ?, CURRENT_TIMESTAMP)
  `).run(id, existing.name, 'was removed from team tracker');

  res.json({ success: true, message: `Removed ${existing.name}` });
});

// POST bulk availability update
app.post('/api/users/bulk-availability', (req, res) => {
  const { isAvailable } = req.body;
  if (typeof isAvailable !== 'boolean') {
    return res.status(400).json({ message: 'Boolean isAvailable is required.' });
  }

  db.prepare(`
    UPDATE users 
    SET is_available = ?, 
        last_updated = CURRENT_TIMESTAMP
  `).run(isAvailable ? 1 : 0);

  db.prepare(`
    INSERT INTO activity_log (user_id, user_name, action, timestamp)
    VALUES (NULL, 'System Admin', ?, CURRENT_TIMESTAMP)
  `).run(isAvailable ? 'marked entire team as Available' : 'marked entire team as Away');

  const rows = db.prepare(`
    SELECT id, name, email, initials, role, department, timezone, 
           status_message, status_emoji, avatar_color, is_available, last_updated 
    FROM users 
    ORDER BY is_available DESC, name ASC
  `).all();

  res.json(rows.map(formatUser));
});

// GET activity feed
app.get('/api/activity', (_req, res) => {
  try {
    const logs = db.prepare(`
      SELECT id, user_id AS userId, user_name AS userName, action, timestamp 
      FROM activity_log 
      ORDER BY id DESC 
      LIMIT 25
    `).all();
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch activity.' });
  }
});

// POST reset demo data
app.post('/api/reset-demo', (_req, res) => {
  try {
    seedData();
    const rows = db.prepare(`
      SELECT id, name, email, initials, role, department, timezone, 
             status_message, status_emoji, avatar_color, is_available, last_updated 
      FROM users 
      ORDER BY is_available DESC, name ASC
    `).all();
    res.json({ message: 'Demo data reset successfully', users: rows.map(formatUser) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reset demo data.' });
  }
});

// GET summary stats
app.get('/api/stats', (_req, res) => {
  try {
    const users = db.prepare('SELECT department, is_available FROM users').all();
    const total = users.length;
    const available = users.filter(u => Boolean(u.is_available)).length;
    const away = total - available;
    const rate = total > 0 ? Math.round((available / total) * 100) : 0;

    const deptMap = {};
    for (const u of users) {
      deptMap[u.department] = deptMap[u.department] || { total: 0, available: 0 };
      deptMap[u.department].total += 1;
      if (u.is_available) deptMap[u.department].available += 1;
    }

    res.json({
      total,
      available,
      away,
      rate,
      departments: deptMap
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to calculate stats.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Availability tracker running at: http://localhost:${PORT}`);
});
