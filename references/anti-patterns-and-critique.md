# Anti-Patterns and Design Critique Reference

One of Pixasso's primary responsibilities is to detect, call out, and eliminate generic AI-generated design clichés. When a proposed design looks generic, Pixasso explicitly states: "This looks generic," diagnoses the specific root cause, and provides a distinct, intentional alternative.

---

## 1. Catalog of Generic Design Anti-Patterns

### 1. Purple-to-Blue Gradient Syndrome
- **Symptom**: Applying radial or linear gradients spanning indigo, purple, and neon cyan across dark backgrounds as the default theme.
- **Why It Fails**: It has become the universal hallmark of uninspired AI generated landing pages and crypto templates from 2022. It conveys zero unique brand personality.
- **Better Alternative**: Ground the palette in authentic materials: warm ink on paper, tactile dark slate with a single sharp amber accent, olive and bone tones, or monochromatic high-contrast minimalism.

### 2. Gradient Hero Text Cliché
- **Symptom**: Wrapping the primary H1 headline in a multi-color gradient with `background-clip: text`.
- **Why It Fails**: It sacrifices text legibility across variable background tones and signals that the typography lacks intrinsic structural weight.
- **Better Alternative**: Use a disciplined, high-impact display typeface at a commanding scale with solid, authoritative color and calibrated tracking.

### 3. Default Glassmorphism Everything
- **Symptom**: Turning every card, modal, and navigation bar into a translucent blurred rectangle (`backdrop-filter: blur()`) with 1px semi-white borders.
- **Why It Fails**: Creates muddy readability, poor contrast on scroll, and significant GPU composition overhead on mobile hardware.
- **Better Alternative**: Use solid, opaque panels with clear elevation, crisp borders, and deliberate contrast separation.

### 4. The "Badge Above Headline" Reflex
- **Symptom**: Placing a rounded pill badge with a shimmering sparkle emoji or "New Feature v2.0" directly above every hero title.
- **Why It Fails**: A tired SaaS template formula that introduces visual clutter before the user even understands what the product is.
- **Better Alternative**: Integrate product status or metadata contextually into the navigation bar or within the primary copy itself.

### 5. The "Three Identical Icon Cards" Section
- **Symptom**: Splitting the features section into three equal-width cards, each featuring a pastel background circle, a generic outline icon, a 3-word title, and a two-sentence paragraph.
- **Why It Fails**: Treats all product capabilities as equally important, failing to establish visual hierarchy or demonstrate real product workflow.
- **Better Alternative**: Employ an asymmetric editorial layout or an interactive bento grid where the primary differentiator commands 60 percent of the viewport width.

### 6. Lucide Icon Flooding
- **Symptom**: Sprinkling generic outline icons next to every headline, button, tab, and card header without functional necessity.
- **Why It Fails**: Creates optical noise. If an icon does not aid visual recognition or wayfinding, it acts as visual litter.
- **Better Alternative**: Rely on clear typographic hierarchy. When icons are required, use bespoke iconography that matches the stroke weight and geometry of the typeface.

### 7. Cursor-Following Beams and Light Blobs
- **Symptom**: Attaching a glowing gradient circle that follows the cursor across the entire page.
- **Why It Fails**: Distracts the eye from reading text, adds useless CPU/GPU overhead, and provides zero user value.
- **Better Alternative**: Use subtle cursor state changes (pointer, text, custom drag pills) only when interacting directly with canvas surfaces or interactive media.

### 8. The Universal Scroll-Fade-In
- **Symptom**: Applying `opacity: 0; transform: translateY(30px)` with a fade-in animation to every section, paragraph, and image.
- **Why It Fails**: Forces users to wait for content to appear while fast-scrolling, turning casual browsing into a sluggish chore.
- **Better Alternative**: Render content statically above and near the fold. Reserve scroll motion strictly for narrative reveals and interactive data transformations.

### 9. Pointless Magnetic Interactions
- **Symptom**: Making buttons and cards pull toward the cursor from 100px away with frantic spring physics.
- **Why It Fails**: Frustrates precision clicking, shifts targets unexpectedly, and creates motion sickness for sensitive users.
- **Better Alternative**: Crisp, instantaneous hover state transitions (`scale: 1.02` max or subtle color/border shift) within the element's actual bounding box.

### 10. Low-Contrast Muted Dark Mode
- **Symptom**: Setting secondary text to `#4A5568` over `#121212` backgrounds, yielding contrast ratios below 2.5:1.
- **Why It Fails**: Unreadable on mobile devices in bright ambient lighting and fails WCAG AA standards.
- **Better Alternative**: Ensure secondary text maintains at least 4.5:1 contrast against dark surfaces (e.g., `#A1A1AA` over `#18181B`).

---

## 2. Pixasso Design Critique Framework

When evaluating an existing design, prototype, or code implementation, conduct an uncompromising review across five core pillars:

### Pillar 1: UX and Information Architecture
- **Clarity**: Is the core value proposition and purpose immediately obvious within 3 seconds?
- **Hierarchy**: Does the eye move naturally from primary focal point to secondary actions?
- **Cognitive Load**: Is the interface asking the user to parse too many competing signals at once?
- **Task Flow**: Can the user complete their primary objective with minimal friction and zero ambiguity?

### Pillar 2: Visual Design and Craft
- **Composition**: Is the layout balanced, whether symmetrical or dynamically asymmetrical?
- **Typography**: Are font weights, leading, and tracking harmonious? Does the display face match the brand personality?
- **Spacing System**: Are margins and padding governed by a consistent spacing token scale (4/8/16/24/32/48/64px)?
- **Color Discipline**: Is color used functionally to direct action, or applied randomly as decoration?

### Pillar 3: Interaction and Affordance
- **Discoverability**: Can users easily distinguish between interactive controls and static display containers?
- **State Completeness**: Are hover, active, focus, disabled, loading, and error states fully designed and visually distinct?
- **Touch Ergonomics**: Are tap targets on mobile viewports comfortably sized (minimum 44x44px)?

### Pillar 4: Motion and Choreography
- **Functional Value**: Does motion clarify layout changes, or does it merely delay interaction?
- **Pacing**: Are transitions crisp and snappy (under 300ms) or painfully sluggish?
- **Accessibility**: Is the entire motion suite neutralized when `prefers-reduced-motion` is enabled?

### Pillar 5: Technical and Performance Feasibility
- **DOM & Render Cost**: Are layout-triggering CSS properties being animated, or are transitions restricted to `transform` and `opacity`?
- **GPU Overhead**: Are WebGL scenes, backdrop filters, or particle systems throttled appropriately for mobile and low-power hardware?
- **Semantic Integrity**: Does the markup use correct semantic HTML elements, or is it a soup of nested unsemantic divs?

---

## 3. Constructive Critique Delivery Format

When providing critique, adhere to this direct, structured feedback format:

1. **Executive Verdict**: A 1-sentence verdict highlighting the central strength and central flaw.
2. **The Weakest Link**: Identify the single element that most severely degrades the experience.
3. **Anti-Pattern Diagnosis**: Explicitly name any clichés present and explain why they weaken credibility.
4. **Actionable Remediation**: Provide concrete typographic scales, token values, layout adjustments, or code diffs to elevate the interface.
