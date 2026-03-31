// Netlify serverless function – replaces database.php
//
// Why this file exists:
//   The original database.php requires a PHP web server to execute.
//   MonsterASP.NET's free tier only provides a MySQL database; their .NET
//   (RunASP.NET) hosting cannot run PHP.  Deploying the React app to Netlify
//   (free tier) automatically makes this function available at:
//
//     /.netlify/functions/database       (production – same origin as the app)
//     http://localhost:8888/.netlify/functions/database  (netlify dev)
//
// No separate web-hosting account is needed.
// Set VITE_DATABASE_URL=/.netlify/functions/database in your .env file.
//
// DB credentials are read from environment variables set in the Netlify UI
// (Site settings → Environment variables).  The hardcoded fallbacks below
// match the values already present in database.php for local development
// convenience – replace them with real env vars before deploying to production.
//
// Required MySQL tables:
//
//   CREATE TABLE appointment_requests (
//     id VARCHAR(40) PRIMARY KEY,
//     date DATE NOT NULL,
//     time_of_day VARCHAR(20),
//     notes TEXT,
//     created_by_name VARCHAR(100),
//     created_at TIMESTAMP NOT NULL
//   );
//
//   CREATE TABLE messages (
//     id VARCHAR(40) PRIMARY KEY,
//     staff_id INT NOT NULL,
//     text TEXT NOT NULL,
//     sender VARCHAR(20) NOT NULL,
//     from_name VARCHAR(100),
//     sent_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
//   );

import mysql from 'mysql2/promise';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

export async function handler(event) {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS_HEADERS, body: '' };
  }

  let connection;
  try {
    connection = await mysql.createConnection({
      host: 'db46374.databaseasp.net',
      database: 'db46374',
      user: process.env.DB_USER ?? 'db46374',
      password: process.env.DB_PASS,
      charset: 'utf8mb4',
    });
  } catch (err) {
    console.error('DB connection error:', err);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Database connection failed.' }),
    };
  }

  try {
    const params = event.queryStringParameters ?? {};
    const resource = params.resource ?? 'appointments';

    // ── GET ──────────────────────────────────────────────────────────────────
    if (event.httpMethod === 'GET') {
      if (resource === 'messages') {
        const staffId = params.staff_id;
        if (!staffId) {
          return {
            statusCode: 400,
            headers: CORS_HEADERS,
            body: JSON.stringify({ error: 'Missing staff_id parameter.' }),
          };
        }
        const [rows] = await connection.query(
          'SELECT * FROM messages WHERE staff_id = ? ORDER BY sent_at ASC',
          [staffId]
        );
        return {
          statusCode: 200,
          headers: CORS_HEADERS,
          body: JSON.stringify(rows),
        };
      }

      // Default: return all appointments
      const [rows] = await connection.query(
        'SELECT * FROM appointment_requests ORDER BY date, time_of_day'
      );
      return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify(rows),
      };
    }

    // ── POST ─────────────────────────────────────────────────────────────────
    if (event.httpMethod === 'POST') {
      let data;
      try {
        data = JSON.parse(event.body ?? '{}');
      } catch {
        return {
          statusCode: 400,
          headers: CORS_HEADERS,
          body: JSON.stringify({ error: 'Invalid JSON body.' }),
        };
      }

      const postResource = data.resource ?? 'appointments';
      const { action } = data;

      // ── Messages ────────────────────────────────────────────────────────────
      if (postResource === 'messages') {
        if (action === 'send') {
          const { staff_id, text, sender, from_name } = data;
          if (!staff_id || !text || !sender) {
            return {
              statusCode: 400,
              headers: CORS_HEADERS,
              body: JSON.stringify({ error: 'Missing required fields.' }),
            };
          }
          const id =
            'msg_' + Date.now().toString(16) + '.' + Math.random().toString().slice(2, 9);
          const sent_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
          await connection.execute(
            'INSERT INTO messages (id, staff_id, text, sender, from_name, sent_at) VALUES (?, ?, ?, ?, ?, ?)',
            [id, staff_id, text, sender, from_name ?? null, sent_at]
          );
          return {
            statusCode: 200,
            headers: CORS_HEADERS,
            body: JSON.stringify({ success: true, id }),
          };
        }

        if (action === 'delete') {
          const { id } = data;
          if (!id) {
            return {
              statusCode: 400,
              headers: CORS_HEADERS,
              body: JSON.stringify({ error: 'Missing message id.' }),
            };
          }
          await connection.execute('DELETE FROM messages WHERE id = ?', [id]);
          return {
            statusCode: 200,
            headers: CORS_HEADERS,
            body: JSON.stringify({ success: true }),
          };
        }

        return {
          statusCode: 400,
          headers: CORS_HEADERS,
          body: JSON.stringify({ error: 'No valid action.' }),
        };
      }

      // ── Appointments ─────────────────────────────────────────────────────────
      if (action === 'create') {
        const { date, time_of_day, notes, created_by_name } = data;
        if (!date || !created_by_name) {
          return {
            statusCode: 400,
            headers: CORS_HEADERS,
            body: JSON.stringify({ error: 'Missing required fields.' }),
          };
        }
        // Generate a unique ID matching the PHP uniqid('apt_', true) format
        const id =
          'apt_' + Date.now().toString(16) + '.' + Math.random().toString().slice(2, 9);
        const created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
        await connection.execute(
          'INSERT INTO appointment_requests (id, date, time_of_day, notes, created_by_name, created_at) VALUES (?, ?, ?, ?, ?, ?)',
          [id, date, time_of_day ?? null, notes ?? null, created_by_name, created_at]
        );
        return {
          statusCode: 200,
          headers: CORS_HEADERS,
          body: JSON.stringify({ success: true, id }),
        };
      }

      if (action === 'delete') {
        const { id } = data;
        if (!id) {
          return {
            statusCode: 400,
            headers: CORS_HEADERS,
            body: JSON.stringify({ error: 'Missing appointment id.' }),
          };
        }
        await connection.execute(
          'DELETE FROM appointment_requests WHERE id = ?',
          [id]
        );
        return {
          statusCode: 200,
          headers: CORS_HEADERS,
          body: JSON.stringify({ success: true }),
        };
      }

      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'No valid action.' }),
      };
    }

    return {
      statusCode: 405,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Method not allowed.' }),
    };
  } catch (err) {
    console.error('Serverless function error:', err);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Server error.' }),
    };
  } finally {
    await connection.end();
  }
}
