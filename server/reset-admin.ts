import { storage } from './storage';
import bcrypt from 'bcrypt';

async function resetAdmin() {
  try {
    // Delete existing admin user if exists
    await storage.deleteUserByUsername('admin');
    
    // Create new admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await storage.createUser({
      username: 'admin',
      password: hashedPassword,
      name: 'Admin',
      email: 'admin@example.com',
      isAdmin: true
    });
    
    console.log('Admin user has been reset successfully');
    console.log('Username: admin');
    console.log('Password: admin123');
  } catch (error) {
    console.error('Error resetting admin user:', error);
  } finally {
    process.exit();
  }
}

resetAdmin(); 