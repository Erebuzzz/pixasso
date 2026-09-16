# UI and Component Libraries Reference

This document classifies and evaluates curated UI component libraries and effect systems. Pixasso uses these resources not to copy default components wholesale, but to analyze their composition, layout mechanics, DOM structure, and interaction patterns.

---

## 1. Evaluation Methodology

When evaluating any UI component library, Pixasso analyzes five distinct layers:

1. **Visual Inspiration**: What aesthetic qualities (typography scale, spacing density, border radiuses, surface treatment) define the visual impression?
2. **Component Structure**: How is the component partitioned into compound primitives (root, trigger, content, item, indicator)?
3. **Implementation Patterns**: Is the implementation headless, styled with utility classes (Tailwind), CSS modules, or CSS-in-JS?
4. **Animation Techniques**: Are transitions executed using CSS transforms, spring physics, layout projection, or Web Animations API?
5. **Reusable Source Code**: Which specific hooks, utility functions, or math calculations can be cleanly extracted without dragging unnecessary dependencies?

Never ship visually untouched generic component-library defaults. Always tailor typography, surface colors, border treatments, and motion timings to the project identity.

---

## 2. Curated UI Component Sources

### Componentry
- **URL**: https://componentry.dev/
- **Classification**: Component Library, Design System Primitive
- **Core Strengths**: Clean component abstraction, accessible foundations, consistent token integration.
- **When to Use**: When building design systems from strong semantic foundations where accessibility and clean API ergonomics are prioritized over flashy visual effects.
- **Implementation Note**: Study how props map to style variants and how accessibility attributes are bound to composite elements.

### Balsa UI
- **URL**: https://balsa-ui.com/
- **Classification**: UI / Component Library
- **Core Strengths**: Modern component patterns, polished minimal design, developer ergonomics.
- **When to Use**: High-utility web applications, SaaS dashboards, and workflow tools requiring clean, unobtrusive UI components.
- **Implementation Note**: Deconstruct their form controls, modals, and dropdown overlays for clean focus management and keyboard handling.

### Canvas UI
- **URL**: https://canvasui.dev/
- **Classification**: Canvas-based UI, Experimental Interface
- **Core Strengths**: Hybrid rendering, high-performance canvas interfaces, creative layout paradigms.
- **When to Use**: Interactive dashboards with thousands of dynamic elements, creative tools, nodes/graph editors, or interactive visualizers where DOM nodes would cause performance bottlenecks.
- **Implementation Note**: Inspect how events (pointerdown, hover, drag) are projected from window coordinates onto canvas scene graphs. Always verify fallback states for screen readers.

### Cult UI
- **URL**: https://cult-ui.com/
- **Classification**: Component Library, Visual Effect Components
- **Core Strengths**: High-craft aesthetic, expressive interactions, experimental micro-interactions.
- **When to Use**: Design agency sites, creative portfolios, modern product landing pages, and interactive showcase features.
- **Implementation Note**: Inspect how Cult UI pairs subtle physics with CSS transforms. Avoid combining too many animated components on a single screen to prevent visual clutter.

### 21st.dev
- **URL**: https://21st.dev/
- **Classification**: Community Component Registry, Creative Primitives
- **Core Strengths**: Vast collection of modern React/Tailwind components, interactive buttons, animated cards, background effects, and navigation patterns.
- **When to Use**: Rapid exploration of state-of-the-art interface patterns and finding specific interactive widgets.
- **Implementation Note**: Never paste full components without reviewing dependency overhead and accessibility. Adapt the Tailwind classes to match your project token system.

### Watermelon UI
- **URL**: https://ui.watermelon.sh/
- **Classification**: UI Component Library
- **Core Strengths**: Crisp aesthetics, smooth state transitions, modern layouts.
- **When to Use**: Product landing pages and interactive web applications requiring polished, contemporary components.
- **Implementation Note**: Check color tokens and transition timings. Ensure contrast ratios meet WCAG AA standards when adapting dark mode variants.

### Magic UI
- **URL**: https://magicui.design/
- **Classification**: Animated Component Library (React, Tailwind, Motion)
- **Core Strengths**: Striking hero sections, animated bento grids, marquee components, text effects, animated borders, and interactive particles.
- **When to Use**: Marketing websites, product launches, developer tools showcases, and high-impact hero headers.
- **Implementation Note**: Highly visible components like animated borders or particle backgrounds must be used sparingly. Use one hero moment per page rather than stacking multiple high-intensity effects.

### Skiper UI
- **URL**: https://skiper-ui.com/
- **Classification**: Component Library, Creative Interactions
- **Core Strengths**: Fresh interactive components, fluid transitions, expressive micro-interactions.
- **When to Use**: Creative marketing experiences, product reveals, and portfolio project cards.
- **Implementation Note**: Examine how touch interactions are handled on mobile devices. If a hover effect conveys essential context, provide an equivalent touch state.

### Vengence UI
- **URL**: https://vengenceui.com/
- **Classification**: Component Library, Dark Mode / Technical Aesthetics
- **Core Strengths**: High-contrast, sharp technical interfaces, developer-centric design patterns.
- **When to Use**: Developer tooling, terminal interfaces, crypto/web3 applications, cybersecurity dashboards, and hardware telemetry views.
- **Implementation Note**: Maintain readability across low-light environments. Ensure subtle borders and muted text remain distinguishable under varied display calibrations.

### Anim Master Lib
- **URL**: https://animmasterlib.dev/
- **Classification**: Animation Library, Component Motion Primitives
- **Core Strengths**: Choreographed animations, layout transitions, orchestrated entrance sequences.
- **When to Use**: Coordinating complex multi-element reveals, staggered lists, and stateful page transitions.
- **Implementation Note**: Review animation curves and durations. Avoid long intro delays that hinder user task completion.

### React Bits
- **URL**: https://github.com/DavidHDev/react-bits
- **Classification**: Reusable React Animations and Components
- **Core Strengths**: Self-contained React snippets for text animations, background animations, interactive cards, and animations without heavy external frameworks.
- **When to Use**: Adding focused, lightweight interactive moments to an existing React application without installing monolithic dependencies.
- **Implementation Note**: Review internal math calculations and cleanup functions in useEffect hooks to prevent memory leaks during rapid re-mounts.

---

## 3. Component Architecture Checklist

When adapting any reference component into a production codebase:

```
[ ] Semantic HTML element used (button, dialog, nav, aside, section)
[ ] ARIA attributes applied only when native HTML is insufficient
[ ] Full keyboard navigability (Tab, Enter, Space, Escape, Arrow keys where appropriate)
[ ] Focus indicator visible, custom-styled, and never removed with outline: none
[ ] Touch target sizes meet or exceed 44x44 CSS pixels on touch viewports
[ ] Color contrast satisfies minimum 4.5:1 for body text and 3:1 for large text / UI elements
[ ] CSS transitions utilize composite properties (transform, opacity) rather than layout triggers (width, height, top)
[ ] Prefers-reduced-motion media query respected for all non-essential movement
[ ] Responsive behavior verified across 375px, 768px, 1024px, and 1440px breakpoints
```
