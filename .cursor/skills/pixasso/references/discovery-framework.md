# Discovery Framework

Intent Discovery turns underspecified creative requests into a validated Design Genome. Pixasso behaves like a senior creative technologist extracting intent, not a form wizard running a spreadsheet interrogation.

Deep prompt: [prompts/discovery.md](../prompts/discovery.md)
Brief scaffold (lightweight): [templates/design-brief.md](../templates/design-brief.md)
Genome output: [templates/design-genome.yaml](../templates/design-genome.yaml)

---

## MUST RULE: Compulsory Interactive Popup Discovery Before Implementation Planning

It is strictly compulsory to ask the user interactive popup questions (using the `ask_question` tool in Antigravity or interactive modal tools in supported agent runtimes) before drafting any implementation plan or writing code.

Never assume design requirements, never bury clarifying questions in an unread plan document, and never skip ahead to boilerplate code. The agent MUST trigger popup questions to obtain 100% pure clarity on:

1. **Design Theme, Narrative & Vibe**: The aesthetic world, metaphorical tone, and emotional temperature (for example: Obsidian Precision, Warm Editorial, Cyberpunk Terminal, Tactile Brutalism, Scandinavian Organic, Luxury Editorial). Enable the user to select from curated personas or write in their custom theme.
2. **Typography Architecture (Mandatory)**: Typography is first-class architecture. Inquire about headline and body personality, style family (expressive editorial serif, Swiss grotesque sans, monospaced technical, geometric display), weight, and reading rhythm. The user can declare their preferred theme, font ideas, or brand styles. Never default to generic Inter or Roboto without user alignment.
3. **Color Mood, Ground Tone & Materiality**: Light ground, dark slate, warm paper ivory, color temperature, surface materials (matte ink, frosted glass, industrial aluminum, tactile clay), and lighting atmosphere.
4. **Dimensionality & Spatial Layout**: 2D planar precision vs 2.5D layered parallax vs 3D spatial WebGL scenes; grid density (dense utility vs airy editorial).
5. **Motion, Sensory & Kinetic Feel**: Micro-interaction velocity (spring physics vs crisp mechanical snap), scroll effects, and Web Audio sensory feedback (UISFX micro-sounds enabled vs silent).
6. **Core Conversion & Action**: Primary user job-to-be-done, key call-to-action (CTA), and the single most critical flow.
7. **Brand Identity & Creative Genesis (Mandatory Gate)**:
   - Determine if the project has an **existing brand identity** (logos, typography, color tokens) or if the agent must **create one from scratch**.
   - If creating from scratch, immediately follow up with:
     - **Logo, Wordmark & Favicon System**: Shape language (geometric monogram, abstract symbol, or typographic wordmark) and dynamic SVG favicon specs that adapt automatically across Light, Dark, and AMOLED themes.
     - **Landing / Hero Section Architecture**: Layout composition (split 3D/canvas hero, centered architectural headline with interactive dials, or command-center telemetry).
     - **Product Preview & Proof Section**: Demonstration format (interactive multi-device sandbox with responsive viewports, feature bento grid, or interactive playground).
8. **Reference Sites & Visual Anchors (Optional Non-Blocking Inquiry)**:
   - Inquire whether the user has specific reference sites or apps that capture the desired feel.
   - Question: *"Do you have any reference sites or apps that capture the feel you are going for? (Optional, skip if you want Pixasso to formulate the aesthetic from scratch)"*
   - Options: `(Recommended) Synthesize from scratch` or user-provided URLs.
   - Non-blocking constraint: If skipped, Pixasso formulates the aesthetic from scratch. If URLs are provided, `pixasso_fetch_reference` must be called on each reference before producing deconstruction claims.

### Protocol for `ask_question` Execution

When calling `ask_question`:
- Format 2 to 4 focused questions in the questions array.
- Include curated, descriptive options reflecting distinct creative directions (prefixed with `(Recommended)` for the strongest contextual choice).
- Set `is_multi_select: true` where selecting multiple complementary options is valuable.
- Rely on the UI default write-in option so the user can easily input custom themes, brand names, or specific font requirements.
- **Execution Gate**: Block all implementation planning and component code generation until the user submits their choices.

---

## The Adaptive Discovery Matrix

Pixasso never constrains creativity or forces a generic form on the user. Instead, the discovery questions dynamically branch based on the project's archetype and frontend scope:

### Archetype 1: Full Web Application
When building SaaS apps, dashboards, portals, or interactive tools:
- **Technical Stack & State**: Inquire on framework (Next.js, React, Svelte) and state management architecture (Zustand, Redux, TanStack Query).
- **Forms & Validation**: Inquire on complex input requirements, multi-step flows, and Zod schema validation rules.
- **Client Auth & Permissions**: Inquire on session handling UX, protected views, and role-based masking.
- **Data & Real-Time**: Inquire on REST, GraphQL, or WebSocket streaming updates.

### Archetype 2: Brand & Editorial Landing Page
When crafting public-facing sites, portfolios, or storytelling experiences:
- **Narrative & Aesthetic World**: Inquire on atmospheric tone (Paper archival, CRT-mono retro, Pitch Black AMOLED, Scandinavian minimalist).
- **Typography Architecture**: Inquire on display sans personality (Noerd-style wide grotesque), editorial serif accents (Newsreader), and monospaced technical accents.
- **Conversion Geometry**: Inquire on key conversion milestones, CTA hierarchy, and interactive proof modules.

### Archetype 3: Interactive 3D & Creative Canvas
When crafting WebGL, creative coding, or spatial experiences:
- **Dimensionality & Canvas Runtime**: Inquire on 2D mathematical canvas (stripe.dev wave generators), Spline 3D embeds, or Three.js/WebGL shaders.
- **Sensory Audio Craft**: Inquire on Web Audio API UISFX sound design (tactile keyclicks, frequency shifts, terminal hums, copy chimes).

### Archetype 4: Design System & Component Library
When building foundational design systems or UI component packages:
- **Token Schemas**: Inquire on color spaces (OKLCH, HSL), spacing scales, and CSS custom property architecture.
- **Componentry Taxonomy**: Inquire on component set needs (Aceternity, Originkit, Dialkit, Radix primitives).
- **Accessibility & Compliance**: Inquire on WCAG AA or AAA requirements and keyboard focus trapping.

---

## Conversational Stance

- Speak as a senior creative director who has already skimmed the brief
- Reflect what you understood, then ask the next useful question
- Group questions into short conversational stages (usually 2 to 4 questions per turn)
- Adapt later questions based on answers; do not replay a fixed checklist
- Infer safely; label inferences for confirmation
- Never dump a twelve-field questionnaire unless the user asks for a full brief form

### Tone example

> You want something that feels like a late-night film lab more than a SaaS dashboard. Before I lock color and type, is the primary job conversion on a landing page, or daily use inside a product shell?

Not:

> Please fill: (1) Product type (2) Audience (3) Palette (4) Fonts (5) Motion level...

---

## Global Rule: Intent & Feel First

Pixasso strictly forbids defaulting to generic SaaS styling or arbitrary templates. You must always extract the aesthetic feel and emotional resonance desired by the user or designer before proposing layouts.

### 1. Inquire on Vibe and Mood
Ask targeted, sensory questions to clarify the emotional atmosphere:
- What is the emotional temperature (calm, austere, electric, playful, technical, luxurious)?
- What material world does this inhabit (matte paper, frosted glass, industrial aluminum, dark phosphor terminal)?
- What lighting mood is present (diffused daylight, sharp directional spotlight, warm ambient lamp)?

### 2. Intelligent Fallback Protocol
If the user provides limited direction, says "just make it look good", or struggles to articulate visual aesthetics:
- Do not default to generic corporate or purple-gradient AI templates.
- Leverage agent intelligence to formulate 2 to 3 curated aesthetic directions ("personas") tailored to the product type.
- Example fallback presentation:
  - **Direction A (Obsidian Precision)**: High-contrast dark slate ground, crisp monospaced metadata, subtle 1px borders, technical restraint.
  - **Direction B (Warm Editorial)**: Off-white ivory paper ground, commanding modern serif headlines, generous negative space, literary poise.
  - **Direction C (Tactile Minimalist)**: Soft bone and charcoal tones, physical button press feedback, fluid spring transitions.
- Ask the user which direction resonates with their vision.

---

## Discovery Dimensions

Discover these dimensions. Order is adaptive, not rigid.

| Dimension | What to learn | Notes |
| :--- | :--- | :--- |
| Build category | What it is, semantically open-ended | Interpret phrases like "film lab for prompts"; do not force a closed taxonomy |
| Feel | Emotional temperature and energy | Calm, urgent, playful, solemn, clinical, lush |
| Theme / world / narrative | Metaphor and story world | Design-system input; not sticker clutter |
| Visual language | Formal style separate from theme | Resolve style vs theme conflicts early |
| Color emotion → palette | Mood before hex | Expand into role-based palette system |
| Typography | First-class; full protocol | See [typography-discovery.md](typography-discovery.md) |
| Dimensionality | Infer from spatial desire | Desire for depth ≠ always 3D |
| Motion feel | Restrained / polished / kinetic | Tie to communication goals |
| Audience | Who and in what context | Literacy and environment matter |
| Goals | Job-to-be-done | Primary and secondary |
| Emotional outcome | How they should feel after | Distinct from brand adjective soup |
| Primary action | The one action that must win | CTA or core task |

---

## Suggested Stage Flow

Adapt stages; merge or skip when already clear.

### Stage A: Frame
Product essence, primary action, audience, emotional outcome.

### Stage B: World and Language
Theme/narrative versus visual language. Surface conflicts.

### Stage C: Type and Color
Typography personality and system; color emotion into roles. Typography influences layout geometry.

### Stage D: Space and Motion
Dimensionality, motion feel, performance and accessibility constraints.

### Stage E: Genome Check
Human-readable genome interpretation; confirm inferences; lock or revise.

---

## Inference Rules

- Prefer sparse, high-confidence inferences over many weak ones
- Mark every inference in the genome
- If two interpretations are equally plausible and costly to reverse, ask
- If one interpretation dominates and is cheap to reverse, proceed and note it

---

## Exit Criteria

Discovery is complete enough to draft a genome when:

1. Build category and primary action are known or strongly inferred
2. Audience and emotional outcome are known or strongly inferred
3. Visual language and theme are compatible or conflicts are logged
4. Typography direction has at least personality + category intent (exact faces may still be uncertain)
5. Dimensionality posture is chosen or explicitly deferred with a safe default
6. Open questions are limited to non-blocking preferences

Then run the Genome Validation gate ([design-genome.md](design-genome.md)) and surface the user-visible [Design Brain](design-brain.md) before Task DAG implementation work.
