#!/bin/bash

###############################################################################
# Script: 03-restructure-config.sh
# Purpose: Create centralized config directory and files
# Author: The Copy Team
# Date: 2025-11-07
###############################################################################

set -e  # Exit on error

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

FRONTEND_DIR="frontend"
CONFIG_DIR="$FRONTEND_DIR/src/lib/config"

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║      The Copy - Project Restructure: Config            ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

###############################################################################
# Step 1: Create config directory
###############################################################################

echo -e "${YELLOW}[1/5] Creating config directory...${NC}"

mkdir -p "$CONFIG_DIR"
echo -e "${GREEN}✅ Created: $CONFIG_DIR${NC}"
echo ""

###############################################################################
# Step 2: Create constants.ts
###############################################################################

echo -e "${YELLOW}[2/5] Creating constants.ts...${NC}"

cat > "$CONFIG_DIR/constants.ts" << 'EOF'
/**
 * Application-wide constants
 * Centralized configuration values
 */

export const APP_CONFIG = {
  name: 'The Copy',
  version: '1.2.0',
  description: 'Drama Analysis Platform',
} as const;

export const API_CONFIG = {
  timeout: 30000, // 30 seconds
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
} as const;

export const CACHE_CONFIG = {
  defaultTTL: 3600, // 1 hour in seconds
  maxSize: 100, // MB
} as const;

export const PAGINATION_CONFIG = {
  defaultPageSize: 20,
  maxPageSize: 100,
} as const;

export const FILE_UPLOAD_CONFIG = {
  maxSize: 10 * 1024 * 1024, // 10 MB
  allowedTypes: [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
  ],
} as const;
EOF

echo -e "${GREEN}✅ Created: constants.ts${NC}"
echo ""

###############################################################################
# Step 3: Create sentry.config.ts
###############################################################################

echo -e "${YELLOW}[3/5] Creating unified sentry.config.ts...${NC}"

cat > "$CONFIG_DIR/sentry.config.ts" << 'EOF'
/**
 * Unified Sentry Configuration
 * Shared config for client, server, and edge runtimes
 */

import type { BrowserOptions, NodeOptions, EdgeOptions } from '@sentry/nextjs';

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN;

/**
 * Base configuration shared across all Sentry instances
 */
const baseConfig = {
  dsn: SENTRY_DSN,

  // Performance Monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  // Environment
  environment: process.env.NODE_ENV || 'development',

  // Release tracking
  release: process.env.NEXT_PUBLIC_SENTRY_RELEASE,

  // Debug
  debug: process.env.NODE_ENV === 'development',

  // Integrations
  integrations: [],
} as const;

/**
 * Client-side specific configuration
 */
export const clientConfig: BrowserOptions = {
  ...baseConfig,

  // Replay integration for browser
  integrations: [
    // Add client-specific integrations here
  ],

  // Ignore specific errors
  ignoreErrors: [
    // Browser extensions
    'ResizeObserver loop limit exceeded',
    'Non-Error promise rejection captured',
  ],
};

/**
 * Server-side specific configuration
 */
export const serverConfig: NodeOptions = {
  ...baseConfig,

  // Server-specific integrations
  integrations: [
    // Add server-specific integrations here
  ],
};

/**
 * Edge runtime specific configuration
 */
export const edgeConfig: EdgeOptions = {
  ...baseConfig,

  // Edge-specific integrations
  integrations: [
    // Add edge-specific integrations here
  ],
};

export default baseConfig;
EOF

echo -e "${GREEN}✅ Created: sentry.config.ts${NC}"
echo ""

###############################################################################
# Step 4: Create redis.config.ts
###############################################################################

echo -e "${YELLOW}[4/5] Creating redis.config.ts...${NC}"

cat > "$CONFIG_DIR/redis.config.ts" << 'EOF'
/**
 * Redis Configuration
 * Centralized Redis client configuration
 */

import type { RedisOptions } from 'ioredis';

export const REDIS_CONFIG: RedisOptions = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB || '0', 10),

  // Connection options
  connectTimeout: 10000,
  retryStrategy(times: number) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },

  // Performance options
  enableReadyCheck: true,
  maxRetriesPerRequest: 3,

  // TLS (for production)
  ...(process.env.REDIS_TLS === 'true' && {
    tls: {
      rejectUnauthorized: false,
    },
  }),
};

export const REDIS_KEY_PREFIX = {
  cache: 'cache:',
  session: 'session:',
  queue: 'queue:',
  lock: 'lock:',
} as const;

export const REDIS_TTL = {
  short: 300,      // 5 minutes
  medium: 3600,    // 1 hour
  long: 86400,     // 1 day
  week: 604800,    // 1 week
} as const;
EOF

echo -e "${GREEN}✅ Created: redis.config.ts${NC}"
echo ""

###############################################################################
# Step 5: Create index.ts
###############################################################################

echo -e "${YELLOW}[5/5] Creating index.ts...${NC}"

cat > "$CONFIG_DIR/index.ts" << 'EOF'
/**
 * Configuration Module
 * Centralized exports for all configuration
 */

export * from './constants';
export * from './sentry.config';
export * from './redis.config';

// Re-export commonly used configs
export { APP_CONFIG, API_CONFIG, CACHE_CONFIG } from './constants';
export { clientConfig, serverConfig, edgeConfig } from './sentry.config';
export { REDIS_CONFIG, REDIS_KEY_PREFIX, REDIS_TTL } from './redis.config';
EOF

echo -e "${GREEN}✅ Created: index.ts${NC}"
echo ""

###############################################################################
# Step 6: Update existing Sentry configs
###############################################################################

echo -e "${YELLOW}[Bonus] Updating existing Sentry config files...${NC}"

# Update sentry.client.config.ts
if [ -f "$FRONTEND_DIR/sentry.client.config.ts" ]; then
    cat > "$FRONTEND_DIR/sentry.client.config.ts" << 'EOF'
// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';
import { clientConfig } from './src/lib/config/sentry.config';

Sentry.init(clientConfig);
EOF
    echo -e "${GREEN}✅ Updated: sentry.client.config.ts${NC}"
fi

# Update sentry.server.config.ts
if [ -f "$FRONTEND_DIR/sentry.server.config.ts" ]; then
    cat > "$FRONTEND_DIR/sentry.server.config.ts" << 'EOF'
// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';
import { serverConfig } from './src/lib/config/sentry.config';

Sentry.init(serverConfig);
EOF
    echo -e "${GREEN}✅ Updated: sentry.server.config.ts${NC}"
fi

# Update sentry.edge.config.ts
if [ -f "$FRONTEND_DIR/sentry.edge.config.ts" ]; then
    cat > "$FRONTEND_DIR/sentry.edge.config.ts" << 'EOF'
// This file configures the initialization of Sentry for edge features.
// The config you add here will be used whenever one of the edge features is loaded.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';
import { edgeConfig } from './src/lib/config/sentry.config';

Sentry.init(edgeConfig);
EOF
    echo -e "${GREEN}✅ Updated: sentry.edge.config.ts${NC}"
fi

echo ""

###############################################################################
# Summary
###############################################################################

echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║            Config Restructure Complete!                ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${BLUE}Created files:${NC}"
echo "  📄 $CONFIG_DIR/constants.ts"
echo "  📄 $CONFIG_DIR/sentry.config.ts"
echo "  📄 $CONFIG_DIR/redis.config.ts"
echo "  📄 $CONFIG_DIR/index.ts"
echo ""

echo -e "${YELLOW}Next steps:${NC}"
echo "  1. Review the generated config files"
echo "  2. Update imports in your codebase to use new config"
echo "  3. Run tests: pnpm run test"
echo "  4. Run typecheck: pnpm run typecheck"
echo ""

echo -e "${YELLOW}Example import:${NC}"
echo "  import { APP_CONFIG, REDIS_CONFIG } from '@/lib/config';"
echo ""
