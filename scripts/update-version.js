#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const version = process.argv[2];

if (!version) {
  console.error('Error: Version argument required');
  console.error('Usage: node scripts/update-version.js <version>');
  console.error('Example: node scripts/update-version.js 1.2.3');
  process.exit(1);
}

// Validate semver format
const semverRegex = /^\d+\.\d+\.\d+(-[\w.]+)?$/;
if (!semverRegex.test(version)) {
  console.error(`Error: Invalid version format: ${version}`);
  console.error('Version must follow semver format: MAJOR.MINOR.PATCH or MAJOR.MINOR.PATCH-prerelease');
  console.error('Examples: 1.0.0, 1.2.3, 2.0.0-beta.1');
  process.exit(1);
}

try {
  // Update package.json
  const pkgPath = 'package.json';
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  pkg.version = version;
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
  console.log(`✓ Updated ${pkgPath} to ${version}`);

  // Update plugin.json
  const pluginPath = join('aissist-plugin', '.claude-plugin', 'plugin.json');
  const plugin = JSON.parse(readFileSync(pluginPath, 'utf8'));
  plugin.version = version;
  writeFileSync(pluginPath, JSON.stringify(plugin, null, 2) + '\n');
  console.log(`✓ Updated ${pluginPath} to ${version}`);

  // Update marketplace.json
  const marketplacePath = join('aissist-plugin', '.claude-plugin', 'marketplace.json');
  const marketplace = JSON.parse(readFileSync(marketplacePath, 'utf8'));
  marketplace.plugins[0].version = version;
  writeFileSync(marketplacePath, JSON.stringify(marketplace, null, 2) + '\n');
  console.log(`✓ Updated ${marketplacePath} to ${version}`);

  console.log(`\n✅ Successfully updated all version files to ${version}`);
} catch (error) {
  console.error('\n❌ Error updating version files:');
  console.error(error.message);
  process.exit(1);
}
