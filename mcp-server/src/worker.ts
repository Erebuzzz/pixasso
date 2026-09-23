import { McpAgent } from 'agents/mcp';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { OAuthProvider } from '@cloudflare/workers-oauth-provider';
import { GitHubHandler, WorkerEnv } from './github-handler';
import { GitHubAuthProps } from './utils';
import { checkAndIncrementRateLimit } from './rateLimiter';

import { discoverIntentSchema, handleDiscoverIntent } from './tools/discoverIntent';
import { searchReferencesSchema, handleSearchReferences } from './tools/searchReferences';
import { fetchReferenceSchema, handleFetchReferenceWorker } from './tools/fetchReference.worker';
import { generateGenomeSchema, handleGenerateGenome } from './tools/generateGenome';
import { generateBrainSchema, handleGenerateBrain } from './tools/generateBrain';
import { auditDesignSchema, handleAuditDesign } from './tools/auditDesign';
import { generateTestPlanSchema, handleGenerateTestPlan } from './tools/generateTestPlan';
import { listAllResources, readResourceByUri } from './resources/index';
import { PIXASSO_PROMPTS, renderPrompt } from './prompts/index';

export class PixassoMcpAgent extends McpAgent<WorkerEnv, unknown, GitHubAuthProps> {
  server = new McpServer({
    name: 'pixasso-mcp',
    version: '1.1.1'
  });

  async init() {
    const checkRate = async () => {
      const userId = this.props?.login || 'anonymous';
      const result = await checkAndIncrementRateLimit(this.env.OAUTH_KV, userId, 200);
      if (!result.allowed) {
        throw new Error(
          `Daily rate limit exceeded for GitHub user @${userId}: You have used ${result.currentCount}/${result.maxAllowed} tool calls today. Resets at ${result.resetsAt}.`
        );
      }
    };

    const readOnlyHints = { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false };
    const openWorldHints = { readOnlyHint: true, destructiveHint: false, idempotentHint: false, openWorldHint: true };

    // 1. pixasso_discover_intent
    const t1 = this.server.tool(
      'pixasso_discover_intent',
      'Initiate adaptive intent discovery for a frontend project across the 16 pillars and generate tailored popup questions.',
      discoverIntentSchema.shape,
      async (args) => {
        await checkRate();
        const res = handleDiscoverIntent(args as any);
        return {
          content: [{ type: 'text', text: JSON.stringify(res, null, 2) }]
        };
      }
    );
    t1.annotations = readOnlyHints;

    // 2. pixasso_search_references
    const t2 = this.server.tool(
      'pixasso_search_references',
      'Search across all 20 Pixasso design reference catalogs, 11 templates, and the 16 frontend pillars.',
      searchReferencesSchema.shape,
      async (args) => {
        await checkRate();
        const res = handleSearchReferences(args as any);
        return {
          content: [{ type: 'text', text: JSON.stringify(res, null, 2) }]
        };
      }
    );
    t2.annotations = readOnlyHints;

    // 3. pixasso_fetch_reference (Worker streaming HTMLRewriter variant)
    const t3 = this.server.tool(
      'pixasso_fetch_reference',
      'Fetch and deconstruct a live reference site server-side using streaming HTMLRewriter. Inspects headings, visible links, readable text, and detects client-rendered SPA shells.',
      fetchReferenceSchema.shape,
      async (args) => {
        await checkRate();
        const res = await handleFetchReferenceWorker(args as any);
        return {
          content: [{ type: 'text', text: JSON.stringify(res, null, 2) }]
        };
      }
    );
    t3.annotations = openWorldHints;

    // 4. pixasso_generate_genome
    const t4 = this.server.tool(
      'pixasso_generate_genome',
      'Compile design tokens, typography system, color roles, and technical stack into a validated design-genome.yaml specification.',
      generateGenomeSchema.shape,
      async (args) => {
        await checkRate();
        const res = handleGenerateGenome(args as any);
        return {
          content: [{ type: 'text', text: JSON.stringify(res, null, 2) }]
        };
      }
    );
    t4.annotations = readOnlyHints;

    // 5. pixasso_generate_brain
    const t5 = this.server.tool(
      'pixasso_generate_brain',
      'Generate a visual Graphify-style Mermaid architectural decision graph and dependency-aware Task DAG.',
      generateBrainSchema.shape,
      async (args) => {
        await checkRate();
        const res = handleGenerateBrain(args as any);
        return {
          content: [{ type: 'text', text: JSON.stringify(res, null, 2) }]
        };
      }
    );
    t5.annotations = readOnlyHints;

    // 6. pixasso_audit_design
    const t6 = this.server.tool(
      'pixasso_audit_design',
      'Audit frontend code and design specifications against common AI anti-patterns and quality standards.',
      auditDesignSchema.shape,
      async (args) => {
        await checkRate();
        const res = handleAuditDesign(args as any);
        return {
          content: [{ type: 'text', text: JSON.stringify(res, null, 2) }]
        };
      }
    );
    t6.annotations = readOnlyHints;

    // 7. pixasso_generate_test_plan
    const t7 = this.server.tool(
      'pixasso_generate_test_plan',
      'Generate a comprehensive interface test plan and automated QA verification matrix across viewports and sensory feedback.',
      generateTestPlanSchema.shape,
      async (args) => {
        await checkRate();
        const res = handleGenerateTestPlan(args as any);
        return {
          content: [{ type: 'text', text: JSON.stringify(res, null, 2) }]
        };
      }
    );
    t7.annotations = readOnlyHints;

    // Dynamic resource templates for references and templates
    this.server.resource(
      'references',
      new ResourceTemplate('pixasso://references/{name}', { list: undefined }),
      async (uri, { name }) => {
        const item = readResourceByUri(`pixasso://references/${name}`);
        if (!item) {
          throw new Error(`Reference "${name}" not found`);
        }
        return {
          contents: [
            {
              uri: uri.href,
              mimeType: item.mimeType,
              text: item.text
            }
          ]
        };
      }
    );

    this.server.resource(
      'templates',
      new ResourceTemplate('pixasso://templates/{name}', { list: undefined }),
      async (uri, { name }) => {
        const item = readResourceByUri(`pixasso://templates/${name}`);
        if (!item) {
          throw new Error(`Template "${name}" not found`);
        }
        return {
          contents: [
            {
              uri: uri.href,
              mimeType: item.mimeType,
              text: item.text
            }
          ]
        };
      }
    );

    // Register Prompts
    for (const p of PIXASSO_PROMPTS) {
      this.server.prompt(p.name, p.description, async () => {
        const rendered = renderPrompt(p.name);
        if (!rendered) {
          throw new Error(`Prompt "${p.name}" failed to render`);
        }
        return {
          description: rendered.description,
          messages: [
            {
              role: 'user',
              content: {
                type: 'text',
                text: rendered.prompt
              }
            }
          ]
        };
      });
    }
  }
}

export default new OAuthProvider({
  apiRoute: '/mcp',
  apiHandler: PixassoMcpAgent.serve('/mcp'),
  defaultHandler: GitHubHandler,
  authorizeEndpoint: '/authorize',
  tokenEndpoint: '/token',
  clientRegistrationEndpoint: '/register'
});
