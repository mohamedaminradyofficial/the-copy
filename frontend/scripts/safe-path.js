/**
 * SECURITY: Safe path resolution utilities
 *
 * Prevents path traversal attacks by validating that resolved paths
 * remain within the project directory
 */

const path = require('path');
const fs = require('fs');

/**
 * Safely resolves a path relative to a base directory
 * Prevents path traversal attacks (../ escaping)
 *
 * @param {string} basePath - The base directory (must be absolute)
 * @param {string} userPath - The user-provided path (relative)
 * @returns {string} The safely resolved absolute path
 * @throws {Error} If the path attempts to escape the base directory
 */
function safeResolve(basePath, userPath) {
  // Ensure base path is absolute
  const absoluteBase = path.resolve(basePath);

  // Resolve the user path relative to base
  const resolvedPath = path.resolve(absoluteBase, userPath);

  // Normalize both paths for comparison
  const normalizedBase = path.normalize(absoluteBase + path.sep);
  const normalizedResolved = path.normalize(resolvedPath + path.sep);

  // Check if resolved path is within base directory
  if (!normalizedResolved.startsWith(normalizedBase)) {
    throw new Error(
      `SECURITY: Path traversal attempt detected. ` +
      `Path "${userPath}" would escape base directory "${basePath}"`
    );
  }

  return resolvedPath.slice(0, -1); // Remove trailing separator
}

/**
 * Safely joins paths and validates the result stays within base directory
 *
 * @param {string} basePath - The base directory
 * @param {...string} pathSegments - Path segments to join
 * @returns {string} The safely joined path
 * @throws {Error} If the resulting path escapes the base directory
 */
function safeJoin(basePath, ...pathSegments) {
  const joined = path.join(...pathSegments);
  return safeResolve(basePath, joined);
}

/**
 * Validates that a path exists and is within the base directory
 *
 * @param {string} basePath - The base directory
 * @param {string} targetPath - The path to validate
 * @returns {boolean} True if valid and exists, false otherwise
 */
function isPathSafe(basePath, targetPath) {
  try {
    const safe = safeResolve(basePath, targetPath);
    return fs.existsSync(safe);
  } catch {
    return false;
  }
}

module.exports = {
  safeResolve,
  safeJoin,
  isPathSafe
};
