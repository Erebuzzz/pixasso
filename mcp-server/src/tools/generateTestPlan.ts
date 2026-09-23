import { z } from 'zod';

export const generateTestPlanSchema = z.object({
  projectName: z.string().describe('Name of the application or website.'),
  testUrl: z.string().optional().default('http://localhost:3000'),
  testedViewports: z.array(z.number()).optional().default([390, 768, 1024, 1440])
});

export type GenerateTestPlanInput = z.infer<typeof generateTestPlanSchema>;

export function handleGenerateTestPlan(input: GenerateTestPlanInput) {
  try {
    const validated = generateTestPlanSchema.parse(input);
    const { projectName, testUrl = 'http://localhost:3000', testedViewports = [390, 768, 1024, 1440] } = validated;

    const overflowScript = `// Run in browser console or via Chrome DevTools MCP evaluate_script
const viewports = [${testedViewports.join(', ')}];
console.log('Testing document overflow on ' + window.location.href);

const elementsWithOverflow = [];
document.querySelectorAll('*').forEach(el => {
  if (el.scrollWidth > window.innerWidth) {
    elementsWithOverflow.push({
      tag: el.tagName,
      className: el.className,
      scrollWidth: el.scrollWidth,
      viewportWidth: window.innerWidth
    });
  }
});

if (elementsWithOverflow.length > 0) {
  console.warn('DOM Overflow detected:', elementsWithOverflow);
} else {
  console.log('Zero DOM overflow verified across document.');
}
`;

    const matrix = testedViewports.map(vp => ({
      viewportWidth: `${vp}px`,
      deviceCategory: vp <= 480 ? 'Mobile (iPhone 14/15)' : vp <= 800 ? 'Tablet Portrait (iPad Mini)' : vp <= 1100 ? 'Tablet Landscape' : 'Desktop (MacBook/FHD)',
      criticalChecks: [
        'Zero horizontal scroll (scrollWidth === innerWidth)',
        vp <= 480 ? 'Mobile drawer/menu toggles smoothly' : 'Header navigation visible with hotkey badges',
        vp <= 480 ? 'Touch targets >= 44x44px' : 'Hover states trigger micro-interaction',
        'Typography maintains readable line lengths (55-75 chars)'
      ]
    }));

    const markdown = `# Interface Test Plan: ${projectName}

## 1. Multi-Viewport Inspection Matrix
| Viewport | Category | Critical Checks |
| :--- | :--- | :--- |
${matrix.map(m => `| \`${m.viewportWidth}\` | ${m.deviceCategory} | ${m.criticalChecks.join('; ')} |`).join('\n')}

## 2. Automated DOM Overflow Test Script
\`\`\`javascript
${overflowScript}
\`\`\`

## 3. Lighthouse Targets
- Performance: >= 90
- Accessibility: >= 98
- Best Practices: 100
- SEO: >= 95
`;

    return {
      projectName,
      testUrl,
      matrix,
      overflowDetectionScript: overflowScript,
      fullMarkdown: markdown
    };
  } catch (error: any) {
    throw new Error('Failed to generate test plan: ' + error.message);
  }
}

