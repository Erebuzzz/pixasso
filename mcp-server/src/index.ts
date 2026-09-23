#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
  ErrorCode,
  McpError
} from '@modelcontextprotocol/sdk/types.js';

import { discoverIntentSchema, handleDiscoverIntent } from './tools/discoverIntent';
import { searchReferencesSchema, handleSearchReferences } from './tools/searchReferences';
import { fetchReferenceSchema, handleFetchReference } from './tools/fetchReference';
import { generateGenomeSchema, handleGenerateGenome } from './tools/generateGenome';
import { generateBrainSchema, handleGenerateBrain } from './tools/generateBrain';
import { auditDesignSchema, handleAuditDesign } from './tools/auditDesign';
import { generateTestPlanSchema, handleGenerateTestPlan } from './tools/generateTestPlan';
import { listAllResources, readResourceByUri } from './resources/index';
import { PIXASSO_PROMPTS, renderPrompt } from './prompts/index';

const server = new Server(
  {
    name: 'pixasso-mcp',
    version: '1.1.1'
  },
  {
    capabilities: {
      tools: {},
      resources: {},
      prompts: {}
    }
  }
);

// Register Tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'pixasso_discover_intent',
        description: 'Initiate adaptive intent discovery for a frontend project across the 16 pillars and generate tailored popup questions.',
        inputSchema: {
          type: 'object',
          properties: {
            projectArchetype: {
              type: 'string',
              enum: ['full_web_app', 'editorial_landing_page', 'creative_3d_canvas', 'design_system', 'general'],
              description: 'The primary archetype of the frontend project.'
            },
            description: {
              type: 'string',
              description: 'Initial brief or description of the project.'
            },
            targetAudience: {
              type: 'string',
              description: 'Target audience or user persona if known.'
            },
            hasBrandIdentity: {
              type: 'boolean',
              description: 'Whether an existing brand identity exists or needs to be synthesized from scratch.'
            },
            referenceUrls: {
              type: 'array',
              items: { type: 'string' },
              description: 'Optional list of reference URLs capturing the desired feel. If omitted or empty, an optional question is included in discovery.'
            }
          },
          required: ['projectArchetype', 'description']
        },
        annotations: {
          readOnlyHint: true,
          destructiveHint: false,
          idempotentHint: true,
          openWorldHint: false
        }
      },
      {
        name: 'pixasso_search_references',
        description: 'Search across all 20 Pixasso design reference catalogs, 11 templates, and the 16 frontend pillars.',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Keywords to search across design references and templates.'
            },
            category: {
              type: 'string',
              enum: ['all', 'reference', 'template'],
              description: 'Filter category.'
            },
            tag: {
              type: 'string',
              description: 'Filter by tag (e.g. typography, motion, a11y, 3d, components).'
            }
          },
          required: ['query']
        },
        annotations: {
          readOnlyHint: true,
          destructiveHint: false,
          idempotentHint: true,
          openWorldHint: false
        }
      },
      {
        name: 'pixasso_fetch_reference',
        description: 'Fetch and deconstruct a live reference website server-side. Extracts page title, meta description, heading structure (h1-h4), visible links, and readable text content. Detects client-rendered SPAs (Framer, Webflow, React shells) and flags unrendered content rather than hallucinating. NOTE: Does not extract computed CSS (colors, rendered fonts); use headless browser tools or user screenshots for visual styling.',
        inputSchema: {
          type: 'object',
          properties: {
            url: {
              type: 'string',
              description: 'Target HTTP or HTTPS URL to fetch and analyze.'
            },
            focus: {
              type: 'string',
              enum: ['full', 'layout', 'typography', 'color', 'motion'],
              description: 'Analytical focus area.'
            }
          },
          required: ['url']
        },
        annotations: {
          readOnlyHint: true,
          destructiveHint: false,
          idempotentHint: false,
          openWorldHint: true
        }
      },
      {
        name: 'pixasso_generate_genome',
        description: 'Validate design decisions and compile a machine-readable design-genome.yaml specification.',
        inputSchema: {
          type: 'object',
          properties: {
            projectName: { type: 'string', description: 'Name of the project or app.' },
            themeMode: {
              type: 'string',
              enum: ['paper', 'crt_mono', 'amoled_black', 'custom'],
              description: 'Visual theme mode.'
            },
            groundTone: { type: 'string', description: 'Hex ground tone (e.g. #fbfaf7, #0a0f0d, #000000).' },
            typography: {
              type: 'object',
              properties: {
                displayFont: { type: 'string', description: 'Display headline font.' },
                bodyFont: { type: 'string', description: 'Body reading font.' },
                monoFont: { type: 'string', description: 'Monospace font for data/code.' },
                scaleRatio: { type: 'string', description: 'Modular scale ratio.' }
              },
              required: ['displayFont', 'bodyFont', 'monoFont']
            },
            colorTokens: {
              type: 'object',
              properties: {
                primary: { type: 'string', description: 'Primary ink color.' },
                accent: { type: 'string', description: 'Highlight accent color.' },
                border: { type: 'string', description: 'Border divider color.' }
              },
              required: ['primary', 'accent', 'border']
            },
            dimensionality: {
              type: 'string',
              enum: ['2d_planar', '2.5d_parallax', '3d_webgl'],
              description: 'Visual dimensionality.'
            },
            motionFeel: { type: 'string', description: 'Motion pacing and easing description.' },
            references: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  url: { type: 'string' },
                  fetchedAt: { type: 'string' },
                  renderedContentDetected: { type: 'boolean' },
                  extractedPrinciples: { type: 'array', items: { type: 'string' } },
                  epistemicStatus: { type: 'string', enum: ['known', 'inferred', 'uncertain', 'unavailable'] }
                },
                required: ['url', 'fetchedAt', 'renderedContentDetected', 'extractedPrinciples', 'epistemicStatus']
              },
              description: 'Audited reference sites analyzed via pixasso_fetch_reference.'
            }
          },
          required: ['projectName', 'themeMode', 'groundTone', 'typography', 'colorTokens']
        },
        annotations: {
          readOnlyHint: true,
          destructiveHint: false,
          idempotentHint: true,
          openWorldHint: false
        }
      },
      {
        name: 'pixasso_generate_brain',
        description: 'Build a Graphify-style Mermaid visualization mapping design decisions and Task DAG execution state.',
        inputSchema: {
          type: 'object',
          properties: {
            projectName: { type: 'string', description: 'Name of the project.' },
            decisions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  category: { type: 'string' },
                  choice: { type: 'string' },
                  rationale: { type: 'string' }
                },
                required: ['category', 'choice', 'rationale']
              },
              description: 'List of key design decisions.'
            },
            tasks: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  title: { type: 'string' },
                  role: { type: 'string' },
                  status: { type: 'string', enum: ['pending', 'running', 'completed', 'blocked'] },
                  dependencies: { type: 'array', items: { type: 'string' } }
                },
                required: ['id', 'title', 'role', 'status']
              },
              description: 'Task DAG nodes.'
            }
          },
          required: ['projectName', 'decisions']
        },
        annotations: {
          readOnlyHint: true,
          destructiveHint: false,
          idempotentHint: true,
          openWorldHint: false
        }
      },
      {
        name: 'pixasso_audit_design',
        description: 'Audit HTML, JSX, or CSS against generic AI clichés, accessibility guidelines, and the 16-pillar rubric.',
        inputSchema: {
          type: 'object',
          properties: {
            componentMarkup: { type: 'string', description: 'HTML, JSX, or CSS to evaluate.' },
            contextDescription: { type: 'string', description: 'Contextual design intent.' }
          },
          required: ['componentMarkup']
        },
        annotations: {
          readOnlyHint: true,
          destructiveHint: false,
          idempotentHint: true,
          openWorldHint: false
        }
      },
      {
        name: 'pixasso_generate_test_plan',
        description: 'Generate an automated multi-viewport testing matrix (390px, 768px, 1024px, 1440px) and overflow detection script.',
        inputSchema: {
          type: 'object',
          properties: {
            projectName: { type: 'string', description: 'Application or website name.' },
            testUrl: { type: 'string', description: 'Target URL to test.' },
            testedViewports: {
              type: 'array',
              items: { type: 'number' },
              description: 'Viewport widths to test (defaults to 390, 768, 1024, 1440).'
            }
          },
          required: ['projectName']
        },
        annotations: {
          readOnlyHint: true,
          destructiveHint: false,
          idempotentHint: true,
          openWorldHint: false
        }
      }
    ]
  };
});

// Handle Tool Calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'pixasso_discover_intent': {
        const parsed = discoverIntentSchema.parse(args);
        const result = handleDiscoverIntent(parsed);
        return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
      }
      case 'pixasso_search_references': {
        const parsed = searchReferencesSchema.parse(args);
        const result = handleSearchReferences(parsed);
        return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
      }
      case 'pixasso_fetch_reference': {
        const parsed = fetchReferenceSchema.parse(args);
        const result = await handleFetchReference(parsed);
        return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
      }
      case 'pixasso_generate_genome': {
        const parsed = generateGenomeSchema.parse(args);
        const result = handleGenerateGenome(parsed);
        return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
      }
      case 'pixasso_generate_brain': {
        const parsed = generateBrainSchema.parse(args);
        const result = handleGenerateBrain(parsed);
        return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
      }
      case 'pixasso_audit_design': {
        const parsed = auditDesignSchema.parse(args);
        const result = handleAuditDesign(parsed);
        return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
      }
      case 'pixasso_generate_test_plan': {
        const parsed = generateTestPlanSchema.parse(args);
        const result = handleGenerateTestPlan(parsed);
        return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
      }
      default:
        throw new McpError(ErrorCode.MethodNotFound, `Tool not found: ${name}`);
    }
  } catch (error: any) {
    return {
      isError: true,
      content: [{ type: 'text', text: `Error executing ${name}: ${error.message || String(error)}` }]
    };
  }
});

// Register Resources
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return { resources: listAllResources() };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;
  const resource = readResourceByUri(uri);
  if (!resource) {
    throw new McpError(ErrorCode.InvalidRequest, `Resource not found: ${uri}`);
  }
  return {
    contents: [
      {
        uri: resource.uri,
        mimeType: resource.mimeType,
        text: resource.text
      }
    ]
  };
});

// Register Prompts
server.setRequestHandler(ListPromptsRequestSchema, async () => {
  return { prompts: PIXASSO_PROMPTS };
});

server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  const { name, arguments: args = {} } = request.params;
  const prompt = renderPrompt(name, args as Record<string, string>);
  if (!prompt) {
    throw new McpError(ErrorCode.InvalidRequest, `Prompt not found: ${name}`);
  }
  return prompt;
});

// Start Server Transport
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Pixasso MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error in Pixasso MCP server:', error);
  process.exit(1);
});
