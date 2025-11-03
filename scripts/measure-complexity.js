#!/usr/bin/env node
/**
 * Simple complexity and NLOC reporter for TypeScript/TSX modules.
 *
 * The script avoids external dependencies so it can run in constrained
 * environments. It implements a lightweight heuristic for cyclomatic
 * complexity that counts conventional decision keywords along with
 * conditional and logical operators. While not as feature-rich as
 * dedicated analyzers, it provides consistent before/after comparisons
 * for refactoring tasks.
 */

const fs = require("node:fs");
const path = require("node:path");

const filePath = process.argv[2];

if (!filePath) {
  console.error("Usage: measure-complexity <path-to-file>");
  process.exit(1);
}

const absolutePath = path.resolve(process.cwd(), filePath);

let source;
try {
  source = fs.readFileSync(absolutePath, "utf8");
} catch (error) {
  console.error(`Failed to read ${absolutePath}:`, error.message);
  process.exit(1);
}

// Remove block and line comments so they do not influence counts.
const withoutComments = source
  .replace(/\/\*[\s\S]*?\*\//g, "")
  .replace(/(^|\s+)(\/\/.*$)/gm, "");

const lineCount = withoutComments
  .split("\n")
  .filter((line) => line.trim().length > 0).length;

const decisionMatchers = [
  /\bif\b/g,
  /\bfor\b/g,
  /\bwhile\b/g,
  /\bcase\b/g,
  /\bcatch\b/g,
  /(?<!\?)\?(?![.?])/g, // conditional operators but not optional chaining/nullish coalescing
  /&&/g,
  /\|\|/g,
];

const decisionPoints = decisionMatchers.reduce(
  (total, matcher) => total + ((withoutComments.match(matcher) ?? []).length),
  0,
);

const complexity = decisionPoints + 1;

console.log(
  JSON.stringify(
    {
      file: filePath,
      nloc: lineCount,
      decisionPoints,
      cyclomaticComplexity: complexity,
    },
    null,
    2,
  ),
);
