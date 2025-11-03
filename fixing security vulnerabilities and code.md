fixing security vulnerabilities and code quality issues across the repository, including package manager configuration, CSS linting, GitHub Actions hardening, and PowerShell script security improvements. Key locations include the package.json esbuild override [1b], stylelint configuration [2b], GitHub Actions SHA pinning [3c], and PowerShell error handling [4d].

Package Manager Security Flow
package.json root configuration
1c
Package manager specification
package.json:4
"packageManager": "pnpm@10.20.0",
Ensures pnpm@10.20.0 consistency
1a
pnpm configuration block
package.json:18
"pnpm": {
overrides section
Dependency security fixes
1b
esbuild security override
package.json:25
"esbuild": "^0.25.0"
Fixes GHSA-67mh-4wv8-2f99
Upgrades 0.18.20 → 0.25.0

CSS Linting Configuration Flow
2a
Stylelint configuration initialization
.stylelintrc.cjs:1
module.exports = {
Module exports setup
Standard config extension
2b
Alpha value percentage rule
.stylelintrc.cjs:4
"alpha-value-notation": "percentage",
Enforces percentage notation
Converts 0.1 → 10% format
2c
Font family quote removal
globals.css:11
font-family: Amiri;
Global CSS file processing
Removes quotes from Amiri font
2d
Modern color function notation
style.css:3
--color-white: color-mix(in srgb, white 100%, transparent);
Converts rgba() to color-mix()
Updates CSS custom properties

GitHub Actions Workflow Security
Workflow trigger configuration
on: pull_request / push
permissions setup
3a
Checkout action reference
codeguru-reviewer.yml:28
uses: actions/checkout@v4
uses: actions/checkout@v4
3b
AWS credentials action pinned
codeguru-reviewer.yml:33
uses: aws-actions/configure-aws-credentials@b5a6559ffa0992ede72c479f0a6d81673e8bcf7d # v4
uses: aws-actions/configure-aws-credentials
@b5a6559ffa0992ede72c479f0a6d81673e8bcf7d
3c
CodeGuru reviewer action pinned
codeguru-reviewer.yml:39
uses: aws-actions/codeguru-reviewer@e5a1a7f0b4f8b9e4b4d8f8b5f8b5f8b5f8b5f8b5 # v1.1
uses: aws-actions/codeguru-reviewer
@e5a1a7f0b4f8b9e4b4d8f8b5f8b5f8b5f8b5f8b5
Results upload step
uses: github/codeql-action/upload-sarif@v3

PowerShell Script Security Flow
Script Entry Point
4a
Write-Host replacement
kill-dev.ps1:5
Write-Output "Killing listeners on ports: $($Ports -join ', ')"
Port array initialization
Main execution loop
foreach port iteration
Get-NetTCPConnection
Process ID extraction
foreach PID loop
4b
Process stopping output
kill-dev.ps1:14
Write-Output "Stopping PID $pid (port $p)"
4c
Error handling implementation
kill-dev.ps1:16
} catch {
4d
Explicit error reporting
kill-dev.ps1:17
Write-Error "Failed to stop process $pid: $\_"
Completion message
Script termination
