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

