import { z } from 'zod';

export const auditDesignSchema = z.object({
  componentMarkup: z.string().describe('HTML, JSX, or CSS to audit.'),
  contextDescription: z.string().optional().describe('Context or design intent.')
});

export type AuditDesignInput = z.infer<typeof auditDesignSchema>;

export function handleAuditDesign(input: AuditDesignInput) {
  try {
    const validated = auditDesignSchema.parse(input);
    const { componentMarkup } = validated;
    const issues: Array<{ severity: 'critical' | 'warning' | 'suggestion'; rule: string; explanation: string; remedy: string }> = [];

    // Check generic AI clichés
    if (/bg-gradient-to-(r|br|tr|b|l).*from-purple.*to-blue/i.test(componentMarkup) || /linear-gradient.*(#6366f1|#8b5cf6|#a855f7)/i.test(componentMarkup)) {
      issues.push({
        severity: 'critical',
        rule: 'Anti-Pattern: Generic Purple/Blue AI Gradient',
        explanation: 'Unmotivated indigo-purple gradient detected. This is the hallmark of automated boilerplate.',
        remedy: 'Replace with an intentional ground tone: Ivory Paper (#fbfaf7), Dark Slate (#0a0f12), or True Black (#000000) paired with architectural hairlines.'
      });
    }

    if (/<div[^>]*onClick/i.test(componentMarkup) && !/role="button"/i.test(componentMarkup)) {
      issues.push({
        severity: 'critical',
        rule: 'Accessibility: Non-semantic Clickable Div',
        explanation: 'Detected <div onClick> without semantic role or keyboard handler.',
        remedy: 'Use a native <button type="button"> or attach role="button" and tabIndex={0} with onKeyDown handler.'
      });
    }

    if (/<svg(?![^>]*(aria-hidden|role="img"|aria-label))/i.test(componentMarkup)) {
      issues.push({
        severity: 'warning',
        rule: 'Accessibility: SVG Missing ARIA Contract',
        explanation: 'SVGs without aria-hidden="true" or role="img" confuse screen readers.',
        remedy: 'Add aria-hidden="true" and focusable="false" for decorative icons, or role="img" with title for informational icons.'
      });
    }

    if (/backdrop-blur/i.test(componentMarkup) && !/border/i.test(componentMarkup)) {
      issues.push({
        severity: 'warning',
        rule: 'Visual Craft: Ungrounded Glassmorphism',
        explanation: 'Blanket glassmorphism without structured border boundaries creates muddy visual contrast.',
        remedy: 'Ground translucent surfaces with crisp 1px structural borders: rgba(255,255,255,0.12) or rgba(0,0,0,0.08).'
      });
    }

    if (/overflow-x-hidden/i.test(componentMarkup)) {
      issues.push({
        severity: 'warning',
        rule: 'Responsive QA: Overflow Band-aid Detected',
        explanation: 'Applying overflow-x-hidden on body or root often conceals uncalibrated width geometry on mobile devices.',
        remedy: 'Inspect inner elements for fixed pixel widths or missing max-w-full constraints.'
      });
    }

    if (/radial-gradient/i.test(componentMarkup) && /from-purple|from-indigo|from-blue|rgba\(139,\s*92,\s*246/i.test(componentMarkup)) {
      issues.push({
        severity: 'warning',
        rule: 'Anti-Pattern: Radial Halo Spotlight',
        explanation: 'Atmospheric blurry radial gradient blob behind headings is a tired AI landing page cliché.',
        remedy: 'Use crisp surface contrast, subtle 1px border keylines, or disciplined typography without artificial halos.'
      });
    }

    if (/<p[^>]*class="[^"]*tracking-(tighter|tight)[^"]*(text-xs|text-sm|text-base)/i.test(componentMarkup)) {
      issues.push({
        severity: 'warning',
        rule: 'Typography: Crushed Tracking on Body Text',
        explanation: 'Applying negative tracking to body copy causes optical character collisions and impairs legibility.',
        remedy: 'Negative tracking belongs exclusively on display headings (32px+). Keep body copy tracking neutral or slightly open.'
      });
    }

    if (/[✨]/i.test(componentMarkup) || /sparkles?/i.test(componentMarkup) && /badge|pill|hero/i.test(componentMarkup)) {
      issues.push({
        severity: 'suggestion',
        rule: 'Anti-Pattern: Sparkle Emoji Cliché',
        explanation: 'Sprinkling sparkle emojis or icons on feature badges creates visual clutter without communicating functional value.',
        remedy: 'Use clear, domain-specific terminology (e.g. "Automated", "Preview", "Real-time") rather than decorative sparkle crutches.'
      });
    }

    if (/(text-blue-600|#0000ff)\b/i.test(componentMarkup) && /(bg-black|#000000)\b/i.test(componentMarkup)) {
      issues.push({
        severity: 'warning',
        rule: 'Visual Craft: Chromatic Halation (Blue on Black)',
        explanation: 'Saturated pure blue on black backgrounds causes optical lens refraction and severe visual vibration.',
        remedy: 'Desaturate blue to cornflower or periwinkle (#60a5fa, #818cf8) or lift background ground to dark slate (#0f172a).'
      });
    }

    if (/<button[^>]*>\s*(Click here|Submit|Get Started)\s*<\/button>/i.test(componentMarkup)) {
      issues.push({
        severity: 'suggestion',
        rule: 'Micro-Copy: Generic CTA Label',
        explanation: 'Generic button labels like "Click here" or "Get Started" lack clear action verbs.',
        remedy: 'Replace with descriptive action verbs indicating the exact outcome, such as "Create Workspace", "Deploy Project", or "View Pricing".'
      });
    }

    if (/\b(supercharge|unleash your|delve into|seamlessly integrate|game-changer|testament to)\b/i.test(componentMarkup)) {
      issues.push({
        severity: 'suggestion',
        rule: 'Copy Craft: AI Buzzword Inflation',
        explanation: 'Robotic marketing buzzwords detected. These dilute authority and signal automated generation.',
        remedy: 'Use direct, specific action language describing concrete outcomes rather than generic hyperbolic hype.'
      });
    }

    if (/linear-gradient\(.*to-(b|r|l|t).*transparent\)/i.test(componentMarkup) && !/hsl|rgba/i.test(componentMarkup)) {
      issues.push({
        severity: 'suggestion',
        rule: 'Visual Craft: Linear Gradient Banding',
        explanation: 'Fading directly to transparent in standard linear gradients produces harsh optical banding seams.',
        remedy: 'Use multi-stop eased gradients (e.g. via larsenwork.com/easing-gradients) to ensure logarithmic optical smoothing.'
      });
    }

    const score = Math.max(20, 100 - (issues.filter(i => i.severity === 'critical').length * 25) - (issues.filter(i => i.severity === 'warning').length * 10));

    return {
      score: `${score}/100`,
      status: score >= 80 ? 'passed' : 'remediation_required',
      totalIssues: issues.length,
      issues,
      pillarsEvaluated: [
        '1. UX & Information Architecture',
        '2. Visual Craft & Aesthetics',
        '3. Interaction & Affordances',
        '4. Motion Choreography',
        '5. Technical Feasibility & A11y'
      ]
    };
  } catch (error: any) {
    throw new Error('Failed to audit design: ' + error.message);
  }
}

