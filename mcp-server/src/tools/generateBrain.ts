import { z } from 'zod';

export const generateBrainSchema = z.object({
  projectName: z.string().describe('Name of the design project.'),
  decisions: z.array(z.object({
    category: z.string(),
    choice: z.string(),
    rationale: z.string()
  })).describe('List of key design decisions made.'),
  tasks: z.array(z.object({
    id: z.string(),
    title: z.string(),
    role: z.string(),
    status: z.enum(['pending', 'running', 'completed', 'blocked']),
    dependencies: z.array(z.string()).optional()
  })).optional().default([])
});

export type GenerateBrainInput = z.infer<typeof generateBrainSchema>;

export function handleGenerateBrain(input: GenerateBrainInput) {
  try {
    const validated = generateBrainSchema.parse(input);
    const { projectName, decisions, tasks = [] } = validated;

    let mermaid = `flowchart TD
    subgraph DecisionTree ["Design Decisions: ${projectName}"]\n`;

    decisions.forEach((d, idx) => {
      const safeCat = d.category.replace(/[^a-zA-Z0-9]/g, '_');
      const safeChoice = d.choice.replace(/["()]/g, "'");
      mermaid += `        D_${idx}["${d.category}: ${safeChoice}"]\n`;
    });

    mermaid += `    end\n\n`;

    if (tasks.length > 0) {
      mermaid += `    subgraph TaskDAG ["Task Execution Pipeline"]\n`;
      tasks.forEach(t => {
        const statusIcon = t.status === 'completed' ? '[DONE]' : t.status === 'running' ? '[WIP]' : '[TODO]';
        mermaid += `        T_${t.id}["${statusIcon} ${t.id}: ${t.title} (${t.role})"]\n`;
      });

      tasks.forEach(t => {
        if (t.dependencies && t.dependencies.length > 0) {
          t.dependencies.forEach(dep => {
            mermaid += `        T_${dep} --> T_${t.id}\n`;
          });
        }
      });

      mermaid += `    end\n\n    DecisionTree --> TaskDAG\n`;
    }

    const markdown = `# Design Brain: ${projectName}

## Decision Map & Pipeline

\`\`\`mermaid
${mermaid}
\`\`\`

### Decision Log
${decisions.map(d => `- **${d.category}**: ${d.choice} (Rationale: ${d.rationale})`).join('\n')}
`;

    return {
      projectName,
      mermaidDiagram: mermaid,
      fullMarkdown: markdown
    };
  } catch (error: any) {
    throw new Error('Failed to generate design brain: ' + error.message);
  }
}

