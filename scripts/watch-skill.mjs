#!/usr/bin/env node
/**
 * Watch for changes in hackmd-cli/ and auto-rebuild the .skill file
 *
 * Usage: node scripts/watch-skill.mjs
 */

import {watch} from 'node:fs';
import {execSync} from 'node:child_process';

const SKILL_DIR = './hackmd-cli';

console.log(`👀 Watching ${SKILL_DIR} for changes...`);
console.log('Press Ctrl+C to stop\n');

watch(SKILL_DIR, {recursive: true}, (eventType, filename) => {
  console.log(`Change detected: ${filename}`);
  try {
    execSync('npm run skill:package', {stdio: 'inherit'});
  } catch (error) {
    console.error('Error packaging skill:', error.message);
  }
});
