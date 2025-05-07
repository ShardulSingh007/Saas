import sqlite3 from 'sqlite3';
import bcrypt from 'bcrypt';
const db = new sqlite3.Database('./data.db');

async function resetAdmin() {
  try {
    // Delete existing admin user if exists
    await new Promise((resolve, reject) => {
      db.run("DELETE FROM users WHERE username = 'admin'", (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    
    // Create new admin user with hashed password
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO users (username, password, name, email, isAdmin) VALUES (?, ?, ?, ?, ?)',
        ['admin', hashedPassword, 'Admin', 'admin@example.com', 1],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
    
    console.log('Admin user has been reset successfully');
    console.log('Username: admin');
    console.log('Password: admin123');
  } catch (error) {
    console.error('Error resetting admin user:', error);
  } finally {
    db.close();
    process.exit();
  }
}

resetAdmin(); 