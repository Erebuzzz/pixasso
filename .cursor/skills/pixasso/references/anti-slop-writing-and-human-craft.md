# Anti-Slop Writing, Visual Combinations, and Human Craft Reference

A guide to crafting authentic, human-written copy, eliminating AI filler words, executing high-concept visual pairings, and applying tactile frontend craft to digital products.

---

## 1. The Anti-AI Slop Writing Manifesto

AI writing models default to predictable clichés, excessive qualifiers, and meaningless buzzwords. True craft requires punchy, specific, and human-sounding language.

### Banned AI Filler Vocabulary
Never use the following words or phrases in UI copy, documentation, or commit messages:
- *Buzzwords*: "supercharge", "unleash", "delve", "tapestry", "seamlessly", "game-changer", "empower", "revolutionize", "cutting-edge", "next-gen", "holistic".
- *Filler Phrases*: "In today's fast-paced digital world...", "Dive deep into...", "Look no further than...", "Whether you are an X or a Y...".
- *Empty Promises*: "Effortlessly manage your data", "Transform your productivity with ease".

### The Human Copy Rules
1. **Be Painfully Specific**: Replace "Boost your speed 10x" with "Cut build times from 14 minutes to 38 seconds".
2. **Action Verbs First**: Replace "Submit form" or "Click here to proceed" with concrete action verbs: "Deploy Cluster", "Download Invoices", "Invite Collaborator".
3. **Conversational Clarity**: If you would not say the sentence out loud to a colleague at lunch, rewrite it. Use natural cadence, short sentences, and everyday phrasing.
4. **Clear Cause and Recovery**: Error messages must state what happened and how to fix it: "Database connection timed out. Check your VPN and retry."

---

## 2. High-Impact Visual Design Combinations

Curated aesthetic formulas that blend unexpected mediums to create distinct visual identities:

### Combination 1: Botanical Florals + Optical Glass Blur
- **Visual Feel**: Elevated luxury, ethereal warmth, and modern botanical sophistication.
- **Recipe**:
  - High-resolution photography of flowers or organic greenery in the background layer.
  - An overlaid frosted glass container or localized `backdrop-filter: blur(24px)` surface.
  - Crisp, sharp typographic hierarchy in warm charcoal (`#1C1917`) or stark white, creating maximum contrast between the organic softness below and the geometric typography above.
- **Best For**: Skincare, wellness, boutique lifestyle brands, and refined publishing.

### Combination 2: Portrait Photography + Swiss Editorial Grid
- **Visual Feel**: High-fashion magazine cover, authoritative monograph, and cultural poise.
- **Recipe**:
  - Close-up or full-body portrait photography anchored as the foundational background or side-column figure.
  - A rigid 12-column Swiss grid overlaid with visible 1px hairlines and bold display typography (e.g., Newsreader or Syne).
  - Editorial metadata: issue numbers, coordinates, timestamps, and section indexes tucked into grid corners.
- **Best For**: Creative portfolios, agency landing pages, architecture monographs, and fashion lookbooks.

### Combination 3: Anatomical Body Parts + Monospace ASCII Art
- **Visual Feel**: Cyberpunk avant-garde, technical net-art, and futuristic experimentalism.
- **Recipe**:
  - Anatomical reference (hands, eye, facial profile, or torso) transformed into dense ASCII character matrices using monospace fonts (JetBrains Mono, Courier, or Space Mono).
  - Dark basalt ground (`#0A0A0C`) with amber (`#F59E0B`) or phosphor green (`#22C55E`) character luminescence.
  - Interactive hover disturbance that disperses or recalculates ASCII density based on mouse coordinates.
- **Workflow Tip**: When executing this aesthetic, ask the user to provide their preferred reference image or specific anatomical subject (e.g., outstretched hand, eye profile) to generate the custom ASCII matrix.
- **Best For**: Developer APIs, security tools, generative AI interfaces, and underground creative studios.

---

## 3. Tactile Frontend Craft (Make Interfaces Feel Better)

Principles distilled from Jakub Krehel's tactile interface engineering:

### Instant Button Release Physics
- An interactive button must feel mechanical. On pointerdown, immediately scale down to `0.97` or `0.98` with a 50ms ease-out.
- On pointerup, return to `1.0` with a slight spring curve (`tension: 300, friction: 20`).
- Never add artificial delays or sluggish 400ms fade-outs to button clicks.

### Zero Cumulative Layout Shift (CLS)
- Skeletons must match the exact pixel height and aspect ratio of incoming content.
- Image containers must declare explicit aspect ratios (`aspect-video`, `aspect-square`) before image assets load.

### Subtle Auditory Feedback
- Tactile feedback is multi-sensory. When a primary action succeeds (e.g., project deployment, payment confirmation), synthesize a soft 800Hz sine chime (30ms to 50ms duration) via Web Audio API. Keep volume subtle (`gain: 0.04`).

### Meaningful Empty States
- An empty dashboard must not look like an error. Provide a clean illustration, explain why no data exists, and provide a single large primary button to create the first record.
