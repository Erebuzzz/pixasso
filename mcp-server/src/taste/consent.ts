import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

export interface ConsentConfig {
  swarmOptIn: boolean;
  decidedAt?: string;
}

const LOCAL_CONFIG_FILE = '.pixassorc.json';

export function getLocalConsent(): boolean {
  if (process.env.PIXASSO_SWARM_OPT_IN === 'true') {
    return true;
  }
  if (process.env.PIXASSO_SWARM_OPT_IN === 'false') {
    return false;
  }

  try {
    const cwdPath = path.join(process.cwd(), LOCAL_CONFIG_FILE);
    if (fs.existsSync(cwdPath)) {
      const data = JSON.parse(fs.readFileSync(cwdPath, 'utf8'));
      if (typeof data.swarmOptIn === 'boolean') {
        return data.swarmOptIn;
      }
    }
  } catch {
    // Graceful fallback to false
  }

  return false;
}

export function setLocalConsent(optIn: boolean): void {
  try {
    const cwdPath = path.join(process.cwd(), LOCAL_CONFIG_FILE);
    const config: ConsentConfig = {
      swarmOptIn: optIn,
      decidedAt: new Date().toISOString()
    };
    fs.writeFileSync(cwdPath, JSON.stringify(config, null, 2), 'utf8');
  } catch (err: any) {
    console.warn('[Consent] Could not write local consent file:', err.message);
  }
}

export function hashUserId(rawId: string): string {
  const salt = 'pixasso-swarm-v1-salt';
  return crypto.createHash('sha256').update(rawId + salt).digest('hex');
}

export function getConsentDiscoveryQuestion(): {
  question: string;
  options: string[];
  is_multi_select: boolean;
} {
  return {
    question: 'Would you like to anonymously contribute this project\'s design tokens to the decentralized Pixasso Taste Swarm?',
    options: [
      '(Recommended) Keep strictly private: Process all design tokens locally with zero external transmission',
      'Opt in to Taste Swarm: Anonymously seed sanitized design tokens (font pairings, color palette, layout geometry) to evolve the global design brain'
    ],
    is_multi_select: false
  };
}
