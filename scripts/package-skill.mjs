#!/usr/bin/env node
/**
 * Package the hackmd-cli skill into a .skill file (zip format)
 *
 * Usage: node scripts/package-skill.mjs
 */

import {execSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SKILL_DIR = path.join(__dirname, '..', 'hackmd-cli');
const SKILL_MD = path.join(SKILL_DIR, 'SKILL.md');
const OUTPUT_FILE = path.join(__dirname, '..', 'hackmd-cli.skill');

function validateSkill() {
  // Check SKILL.md exists
  if (!fs.existsSync(SKILL_MD)) {
    throw new Error('SKILL.md not found in hackmd-cli/');
  }

  const content = fs.readFileSync(SKILL_MD, 'utf8');

  // Check frontmatter exists
  if (!content.startsWith('---')) {
    throw new Error('No YAML frontmatter found');
  }

  // Extract frontmatter
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) {
    throw new Error('Invalid frontmatter format');
  }

  const frontmatter = match[1];

  // Simple YAML parsing for required fields
  const nameMatch = frontmatter.match(/^name:\s*(.+)$/m);
  const descMatch = frontmatter.match(/^description:\s*(.+)$/m);

  if (!nameMatch) {
    throw new Error("Missing 'name' in frontmatter");
  }

  if (!descMatch) {
    throw new Error("Missing 'description' in frontmatter");
  }

  const name = nameMatch[1].trim();
  const description = descMatch[1].trim();

  // Validate name format (hyphen-case)
  if (!/^[a-z0-9-]+$/.test(name)) {
    throw new Error(`Name '${name}' should be hyphen-case (lowercase letters, digits, and hyphens only)`);
  }

  if (name.startsWith('-') || name.endsWith('-') || name.includes('--')) {
    throw new Error(`Name '${name}' cannot start/end with hyphen or contain consecutive hyphens`);
  }

  if (name.length > 64) {
    throw new Error(`Name is too long (${name.length} characters). Maximum is 64 characters.`);
  }

  // Validate description
  if (description.includes('<') || description.includes('>')) {
    throw new Error('Description cannot contain angle brackets (< or >)');
  }

  if (description.length > 1024) {
    throw new Error(`Description is too long (${description.length} characters). Maximum is 1024 characters.`);
  }

  return {description, name};
}

function packageSkill() {
  console.log('📦 Packaging skill: hackmd-cli\n');

  // Validate
  console.log('🔍 Validating skill...');
  try {
    validateSkill();
    console.log('✅ Skill is valid!\n');
  } catch (error) {
    console.error(`❌ Validation failed: ${error.message}`);
    throw error;
  }

  // Remove existing .skill file
  if (fs.existsSync(OUTPUT_FILE)) {
    fs.unlinkSync(OUTPUT_FILE);
  }

  // Create zip file using system zip command
  try {
    // Get all files in skill directory
    const files = getAllFiles(SKILL_DIR);

    if (files.length === 0) {
      throw new Error('No files found in skill directory');
    }

    // Use zip command from parent directory to maintain folder structure
    const parentDir = path.dirname(SKILL_DIR);
    const skillDirName = path.basename(SKILL_DIR);

    execSync(`zip -r "${OUTPUT_FILE}" "${skillDirName}"`, {
      cwd: parentDir,
      stdio: 'pipe',
    });

    // List what was added
    for (const file of files) {
      const relative = path.relative(parentDir, file);
      console.log(`  Added: ${relative}`);
    }

    console.log(`\n✅ Successfully packaged skill to: ${OUTPUT_FILE}`);
  } catch (error) {
    console.error(`❌ Error creating .skill file: ${error.message}`);
    throw error;
  }
}

function getAllFiles(dir) {
  const files = [];
  const entries = fs.readdirSync(dir, {withFileTypes: true});

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getAllFiles(fullPath));
    } else {
      files.push(fullPath);
    }
  }

  return files;
}

try {
  packageSkill();
} catch {
  process.exitCode = 1;
}
