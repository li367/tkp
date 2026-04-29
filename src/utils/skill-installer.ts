import { execSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import os from 'node:os'
import { join } from 'node:path'
import process from 'node:process'

import ansis from 'ansis'
import { ensureI18nInitialized, i18n } from '../i18n'

const PLAYWRIGHT_REPO = 'https://github.com/lackeyjb/playwright-skill.git'
const HOME_DIR = os.homedir()
const MARKETPLACE_DIR = `${HOME_DIR}/.claude/plugins/marketplaces/playwright-skill`
const SKILL_DIR = `${HOME_DIR}/.claude/skills/playwright-skill`

/**
 * Install the Playwright browser automation skill
 * Clones the repo, copies the skill, installs dependencies and Chromium
 * Equivalent to:
 *   cd ~/.claude/plugins/marketplaces/playwright-skill/skills/playwright-skill
 *   npm run setup
 */
export async function installPlaywrightSkill(): Promise<boolean> {
  ensureI18nInitialized()

  try {
    console.log(ansis.cyan(`ℹ ${i18n.t('tools:installingPlaywrightSkill') || 'Installing Playwright browser automation skill...'}`))

    // Clone repo (or pull if already exists)
    execSync(`git clone ${PLAYWRIGHT_REPO} ${MARKETPLACE_DIR} 2>/dev/null || (cd ${MARKETPLACE_DIR} && git pull)`, { stdio: 'pipe' })

    // Create skills directory and copy skill files
    execSync(`mkdir -p ${HOME_DIR}/.claude/skills && cp -r ${MARKETPLACE_DIR}/skills/playwright-skill ${SKILL_DIR}`, { stdio: 'pipe' })

    // Run npm run setup: install dependencies + Chromium browser
    console.log(ansis.gray(`  ${i18n.t('tools:installingDependencies') || 'Installing dependencies...'}`))
    execSync(`cd ${SKILL_DIR} && npm run setup 2>&1`, { stdio: 'pipe' })

    console.log(ansis.green(`✔ ${i18n.t('tools:playwrightSkillInstalled') || 'Playwright browser automation skill installed'}`))
    console.log(ansis.gray(`  ${i18n.t('tools:skillLocated') || 'Skill located at'}: ${SKILL_DIR}`))
    return true
  }
  catch (error: any) {
    console.error(ansis.red(`${i18n.t('common:error')}: ${error.message}`))
    return false
  }
}

/**
 * Check if Playwright skill is already installed
 */
export function isPlaywrightSkillInstalled(): boolean {
  const runJsPath = join(os.homedir(), '.claude', 'skills', 'playwright-skill', 'run.js')
  return existsSync(runJsPath)
}

/**
 * Ensure prerequisites for claude-mem are installed:
 * - unzip (required by bun install script)
 * - bun runtime
 */
export function ensureClaudeMemPrerequisites(): void {
  const homeDir = os.homedir()
  // Check and install unzip
  try {
    execSync('which unzip', { stdio: 'pipe' })
  }
  catch {
    console.log(ansis.gray(`  ${i18n.t('tools:installingUnzip') || 'Installing unzip...'}`))
    execSync('apt-get update -qq && apt-get install -y -qq unzip 2>&1', { stdio: 'inherit' })
  }

  // Check and install bun
  try {
    execSync('which bun', { stdio: 'pipe' })
  }
  catch {
    console.log(ansis.gray(`  ${i18n.t('tools:installingBun') || 'Installing Bun runtime...'}`))
    execSync('curl -fsSL https://bun.sh/install | bash 2>&1', { stdio: 'inherit' })
    // Add bun to PATH for current process
    process.env.PATH = `${homeDir}/.bun/bin:${process.env.PATH || ''}`
  }
}

/**
 * Install Claude-Mem memory system
 * Ensures prerequisites are met, then runs the official installer
 */
export async function installClaudeMem(): Promise<void> {
  ensureI18nInitialized()
  console.log(ansis.cyan(`ℹ ${i18n.t('tools:installingClaudeMem') || 'Installing Claude-Mem memory system...'}`))

  ensureClaudeMemPrerequisites()
  execSync('npx claude-mem install 2>&1', { stdio: 'inherit' })
}
