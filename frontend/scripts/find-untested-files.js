#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
// SECURITY FIX: Import safe path utilities to prevent path traversal
const { safeResolve } = require("./safe-path");

// SECURITY FIX: Use safe path resolution
const srcDir = safeResolve(process.cwd(), "src");
const untestedFiles = [];

const ALLOWED_EXCEPTIONS = [
  /\.d\.ts$/,
  /^index\.ts$/,
  /types\.ts$/,
  /__tests__\//,
  /__mocks__\//,
  /\.test\./,
  /\.spec\./,
];

// COMPLEXITY FIX: Split into smaller, focused functions
function isSimpleIndexFile(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n").filter((line) => line.trim());

  return lines.every(isSimpleLine);
}

function isSimpleLine(line) {
  return (
    line.startsWith("export") ||
    line.startsWith("//") ||
    line.startsWith("/*") ||
    line === ""
  );
}

function isSimpleTypeFile(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const hasLogic = /function |class |const .*=.*=>|if \(|switch \(/.test(content);
  return !hasLogic;
}

function matchesAllowedException(filePath) {
  return ALLOWED_EXCEPTIONS.some((pattern) => pattern.test(filePath));
}

function isComplexIndexFile(filePath, fileName) {
  return fileName === "index.ts" && !isSimpleIndexFile(filePath);
}

function isComplexTypeFile(filePath, fileName) {
  return fileName.endsWith("types.ts") && !isSimpleTypeFile(filePath);
}

// COMPLEXITY FIX: Simplified shouldHaveTests with early returns
function shouldHaveTests(filePath) {
  const fileName = path.basename(filePath);

  // If not in exceptions list, it needs tests
  if (!matchesAllowedException(filePath)) {
    return true;
  }

  // Handle complex index files
  if (isComplexIndexFile(filePath, fileName)) {
    return true;
  }

  // Handle complex type files
  if (isComplexTypeFile(filePath, fileName)) {
    return true;
  }

  // Simple exception files don't need tests
  return false;
}

function hasTestFile(sourceFile) {
  const dir = path.dirname(sourceFile);
  const baseName = path.basename(sourceFile, path.extname(sourceFile));

  // SECURITY FIX: Use safe path resolution for all test patterns
  const testPatterns = [
    `${baseName}.test.ts`,
    `${baseName}.test.tsx`,
    `${baseName}.spec.ts`,
    `${baseName}.spec.tsx`,
  ];

  const testDirs = [
    dir,
    path.join(dir, "__tests__"),
  ];

  const possibleTestPatterns = [];

  for (const testDir of testDirs) {
    for (const pattern of testPatterns) {
      try {
        const testPath = safeResolve(srcDir, path.relative(srcDir, path.join(testDir, pattern)));
        possibleTestPatterns.push(testPath);
      } catch (error) {
        // Skip invalid paths
        continue;
      }
    }
  }

  return possibleTestPatterns.some((pattern) => fs.existsSync(pattern));
}

function scanDirectory(dir) {
  const items = fs.readdirSync(dir);

  for (const item of items) {
    // SECURITY FIX: Use safe path resolution for subdirectories and files
    let fullPath;
    try {
      fullPath = safeResolve(srcDir, path.relative(srcDir, path.join(dir, item)));
    } catch (error) {
      console.warn(`Skipping invalid path: ${item}`);
      continue;
    }

    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      scanDirectory(fullPath);
    } else if (item.endsWith(".ts") || item.endsWith(".tsx")) {
      if (shouldHaveTests(fullPath) && !hasTestFile(fullPath)) {
        const relativePath = path.relative(srcDir, fullPath);
        untestedFiles.push({
          path: relativePath,
          size: stat.size,
          reason: "No corresponding test file found",
        });
      }
    }
  }
}

console.log("\n🔎 Scanning for untested TypeScript files...\n");
console.log(`📂 Source directory: ${srcDir}\n`);

scanDirectory(srcDir);

if (untestedFiles.length > 0) {
  console.error("❌ ENFORCEMENT FAILED: Found files without tests\n");
  console.error(`🚨 ${untestedFiles.length} file(s) require tests:\n`);

  untestedFiles
    .sort((a, b) => b.size - a.size)
    .forEach(({ path, size, reason }) => {
      console.error(`   ❌ ${path}`);
      console.error(`      Size: ${(size / 1024).toFixed(2)} KB`);
      console.error(`      Reason: ${reason}\n`);
    });

  console.error("=".repeat(80));
  console.error("\n📋 REQUIRED ACTIONS:");
  console.error("1. Create test files for ALL listed files above");
  console.error(
    "2. Follow naming convention: <filename>.test.ts or <filename>.spec.ts"
  );
  console.error("3. Or place in __tests__/ directory");
  console.error(
    "4. Ensure each test file covers all functions/classes/exports"
  );
  console.error("\n⛔ This is MANDATORY - no exceptions allowed.\n");

  process.exit(1);
}

console.log("✅ SUCCESS: All TypeScript files have corresponding tests");
console.log("🎉 No untested files found\n");

process.exit(0);
