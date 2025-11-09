// Quick database connection test
const { drizzle } = require('drizzle-orm/better-sqlite3');
const Database = require('better-sqlite3');
const path = require('path');

async function testDatabase() {
  try {
    console.log('Testing SQLite database connection...');
    
    const dbPath = path.join(__dirname, 'dev.db');
    console.log('Database path:', dbPath);
    
    const sqlite = new Database(dbPath);
    const db = drizzle(sqlite);
    
    // Test basic query
    const result = sqlite.prepare('SELECT 1 as test').get();
    console.log('✅ Database connection successful:', result);
    
    sqlite.close();
    console.log('✅ Database test completed successfully');
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    process.exit(1);
  }
}

testDatabase();