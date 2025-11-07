#!/usr/bin/env node
/**
 * Verification Script for Redis and Sentry Setup
 * 
 * Checks if Redis and Sentry are properly configured
 */

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkmark() {
  return `${colors.green}✓${colors.reset}`;
}

function cross() {
  return `${colors.red}✗${colors.reset}`;
}

function warning() {
  return `${colors.yellow}⚠${colors.reset}`;
}

async function checkRedis() {
  log('\n📦 Checking Redis Configuration...', 'cyan');
  
  const hasRedisUrl = !!process.env.REDIS_URL;
  const hasRedisHost = !!process.env.REDIS_HOST;
  const hasRedisPort = !!process.env.REDIS_PORT;
  
  if (hasRedisUrl) {
    log(`  ${checkmark()} REDIS_URL is set`);
    try {
      const Redis = require('ioredis');
      const redis = new Redis(process.env.REDIS_URL);
      await redis.ping();
      log(`  ${checkmark()} Redis connection successful`, 'green');
      await redis.quit();
      return true;
    } catch (error) {
      log(`  ${cross()} Redis connection failed: ${error.message}`, 'red');
      return false;
    }
  } else if (hasRedisHost) {
    log(`  ${checkmark()} REDIS_HOST is set: ${process.env.REDIS_HOST}`);
    log(`  ${checkmark()} REDIS_PORT is set: ${process.env.REDIS_PORT || '6379'}`);
    if (process.env.REDIS_PASSWORD) {
      log(`  ${checkmark()} REDIS_PASSWORD is set`);
    } else {
      log(`  ${warning()} REDIS_PASSWORD is not set (optional)`, 'yellow');
    }
    
    try {
      const Redis = require('ioredis');
      const redis = new Redis({
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD,
      });
      await redis.ping();
      log(`  ${checkmark()} Redis connection successful`, 'green');
      await redis.quit();
      return true;
    } catch (error) {
      log(`  ${cross()} Redis connection failed: ${error.message}`, 'red');
      log(`  ${warning()} Note: Redis will fall back to memory cache if unavailable`, 'yellow');
      return false;
    }
  } else {
    log(`  ${warning()} Redis is not configured`, 'yellow');
    log(`  ${warning()} Set REDIS_URL or REDIS_HOST/REDIS_PORT in your .env file`, 'yellow');
    log(`  ${warning()} Caching will use memory-only fallback`, 'yellow');
    return false;
  }
}

async function checkSentry() {
  log('\n🔍 Checking Sentry Configuration...', 'cyan');
  
  const hasDsn = !!process.env.NEXT_PUBLIC_SENTRY_DSN;
  const hasOrg = !!process.env.SENTRY_ORG;
  const hasProject = !!process.env.SENTRY_PROJECT;
  const hasAuthToken = !!process.env.SENTRY_AUTH_TOKEN;
  
  if (hasDsn) {
    log(`  ${checkmark()} NEXT_PUBLIC_SENTRY_DSN is set`);
    
    // Validate DSN format
    const dsnPattern = /^https:\/\/[a-f0-9]+@[a-z0-9]+\.ingest\.sentry\.io\/[0-9]+$/;
    if (dsnPattern.test(process.env.NEXT_PUBLIC_SENTRY_DSN)) {
      log(`  ${checkmark()} DSN format is valid`, 'green');
    } else {
      log(`  ${warning()} DSN format may be invalid`, 'yellow');
    }
  } else {
    log(`  ${cross()} NEXT_PUBLIC_SENTRY_DSN is not set`, 'red');
    log(`  ${warning()} Get your DSN from: https://sentry.io/settings/`, 'yellow');
  }
  
  if (hasOrg) {
    log(`  ${checkmark()} SENTRY_ORG is set: ${process.env.SENTRY_ORG}`);
  } else {
    log(`  ${warning()} SENTRY_ORG is not set (required for source maps)`, 'yellow');
  }
  
  if (hasProject) {
    log(`  ${checkmark()} SENTRY_PROJECT is set: ${process.env.SENTRY_PROJECT}`);
  } else {
    log(`  ${warning()} SENTRY_PROJECT is not set (required for source maps)`, 'yellow');
  }
  
  if (hasAuthToken) {
    log(`  ${checkmark()} SENTRY_AUTH_TOKEN is set`);
  } else {
    log(`  ${warning()} SENTRY_AUTH_TOKEN is not set (required for source maps)`, 'yellow');
    log(`  ${warning()} Get your token from: https://sentry.io/settings/account/api/auth-tokens/`, 'yellow');
  }
  
  if (hasDsn && hasOrg && hasProject && hasAuthToken) {
    log(`  ${checkmark()} Sentry is fully configured!`, 'green');
    return true;
  } else if (hasDsn) {
    log(`  ${warning()} Sentry is partially configured (error tracking enabled, source maps disabled)`, 'yellow');
    return true;
  } else {
    log(`  ${cross()} Sentry is not configured`, 'red');
    return false;
  }
}

function checkEnvironmentFiles() {
  log('\n📄 Checking Environment Files...', 'cyan');
  
  const fs = require('fs');
  const path = require('path');
  
  const envFiles = [
    { name: 'Root .env', path: '.env' },
    { name: 'Frontend .env.local', path: 'frontend/.env.local' },
    { name: 'Backend .env', path: 'backend/.env' },
  ];
  
  envFiles.forEach(({ name, filePath }) => {
    const fullPath = path.join(process.cwd(), filePath);
    if (fs.existsSync(fullPath)) {
      log(`  ${checkmark()} ${name} exists`);
    } else {
      log(`  ${warning()} ${name} does not exist (create from .env.example)`, 'yellow');
    }
  });
}

async function main() {
  log('🔧 Redis and Sentry Setup Verification\n', 'blue');
  log('=' .repeat(50), 'blue');
  
  // Load environment variables
  require('dotenv').config({ path: '.env' });
  require('dotenv').config({ path: 'frontend/.env.local' });
  require('dotenv').config({ path: 'backend/.env' });
  
  checkEnvironmentFiles();
  
  const redisOk = await checkRedis();
  const sentryOk = await checkSentry();
  
  log('\n' + '='.repeat(50), 'blue');
  log('\n📊 Summary:', 'cyan');
  
  if (redisOk) {
    log(`  ${checkmark()} Redis: Configured and connected`, 'green');
  } else {
    log(`  ${warning()} Redis: Not configured or connection failed`, 'yellow');
    log(`     → Caching will use memory-only fallback`, 'yellow');
  }
  
  if (sentryOk) {
    log(`  ${checkmark()} Sentry: Configured`, 'green');
  } else {
    log(`  ${cross()} Sentry: Not configured`, 'red');
    log(`     → Error tracking is disabled`, 'red');
  }
  
  log('\n📚 Next Steps:', 'cyan');
  if (!redisOk) {
    log('  1. Set up Redis (see SETUP_REDIS_SENTRY.md)');
    log('  2. Add REDIS_URL or REDIS_HOST/REDIS_PORT to your .env file');
  }
  if (!sentryOk) {
    log('  1. Create a Sentry account at https://sentry.io');
    log('  2. Create a new Next.js project');
    log('  3. Add NEXT_PUBLIC_SENTRY_DSN to your .env file');
    log('  4. (Optional) Add SENTRY_ORG, SENTRY_PROJECT, SENTRY_AUTH_TOKEN for source maps');
  }
  if (redisOk && sentryOk) {
    log('  ✅ Everything is configured! You\'re ready to go.', 'green');
  }
  
  log('\n');
  
  process.exit(redisOk && sentryOk ? 0 : 1);
}

main().catch((error) => {
  log(`\n${cross()} Error: ${error.message}`, 'red');
  process.exit(1);
});
