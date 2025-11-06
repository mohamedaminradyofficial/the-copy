// File: scripts/find-empty-files.mjs
import { readdir, stat, readFile } from 'fs/promises';
import { join, extname, resolve } from 'path';
import { createHash } from 'crypto';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Recursively scans a directory for empty files
 * Empty = size is 0 bytes OR trimmed content is empty
 */
async function findEmptyFiles(dirPath, basePath = dirPath) {
  const emptyFiles = [];
  
  async function scan(currentPath) {
    try {
      const entries = await readdir(currentPath, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = join(currentPath, entry.name);
        
        if (entry.isDirectory()) {
          await scan(fullPath);
        } else if (entry.isFile()) {
          try {
            const stats = await stat(fullPath);
            const sizeBytes = stats.size;
            
            // Read file content to check if trimmed content is empty
            let content = '';
            let isTrimmedEmpty = false;
            
            if (sizeBytes > 0) {
              try {
                content = await readFile(fullPath, 'utf-8');
                isTrimmedEmpty = content.trim().length === 0;
              } catch (readError) {
                // If file can't be read as text (binary), skip trim check
                // Only consider it empty if size is 0
              }
            }
            
            // Check if file is empty: size = 0 OR trimmed content is empty
            if (sizeBytes === 0 || isTrimmedEmpty) {
              const absolutePath = resolve(fullPath);
              const extension = extname(entry.name);
              
              // Calculate line count
              const lineCount = content.split('\n').length;
              
              // Calculate SHA256 hash
              let sha256 = '';
              try {
                const fileBuffer = sizeBytes === 0 
                  ? Buffer.alloc(0) 
                  : await readFile(fullPath);
                sha256 = createHash('sha256').update(fileBuffer).digest('hex');
              } catch (hashError) {
                // If hash calculation fails, leave empty
                console.error(`Warning: Could not calculate hash for ${absolutePath}:`, hashError.message);
              }
              
              emptyFiles.push({
                absolutePath,
                sizeBytes,
                lineCount,
                extension: extension || '(no extension)',
                sha256
              });
            }
          } catch (fileError) {
            // Skip files that can't be accessed
            console.error(`Warning: Could not access ${fullPath}:`, fileError.message);
          }
        }
      }
    } catch (dirError) {
      // Skip directories that can't be accessed
      console.error(`Warning: Could not access directory ${currentPath}:`, dirError.message);
    }
  }
  
  await scan(dirPath);
  return emptyFiles;
}

/**
 * Main execution
 */
async function main() {
  const targetDir = resolve(process.cwd(), 'frontend/src');
  
  console.log(`Scanning directory: ${targetDir}`);
  console.log('Searching for empty files...\n');
  
  const emptyFiles = await findEmptyFiles(targetDir);
  
  // Generate JSON report
  const report = {
    scanDate: new Date().toISOString(),
    targetDirectory: targetDir,
    totalEmptyFiles: emptyFiles.length,
    files: emptyFiles
  };
  
  const reportPath = resolve(process.cwd(), 'empty-files-report.json');
  await import('fs/promises').then(fs => 
    fs.writeFile(reportPath, JSON.stringify(report, null, 2), 'utf-8')
  );
  
  // Print summary
  console.log('='.repeat(80));
  console.log('EMPTY FILES REPORT');
  console.log('='.repeat(80));
  console.log(`Total empty files found: ${emptyFiles.length}`);
  console.log(`Report saved to: ${reportPath}\n`);
  
  if (emptyFiles.length > 0) {
    console.log('Empty files:');
    console.log('-'.repeat(80));
    emptyFiles.forEach((file, index) => {
      console.log(`${index + 1}. ${file.absolutePath}`);
      console.log(`   Size: ${file.sizeBytes} bytes | Lines: ${file.lineCount} | Extension: ${file.extension}`);
      console.log(`   SHA256: ${file.sha256}`);
      console.log('');
    });
    console.log('='.repeat(80));
    process.exit(1);
  } else {
    console.log('No empty files found. All files contain content.');
    console.log('='.repeat(80));
    process.exit(0);
  }
}

// Run the script
main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});

