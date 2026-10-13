# Motion and Animation Systems Reference

Motion in Pixasso is communicative, structural, and orienting rather than purely decorative. Every motion must answer a functional question: What does this movement communicate, reveal, guide, or improve? If an animation answers none of these, it should be removed.

---

## 1. Curated Motion Libraries and Runtimes

Motion libraries are not interchangeable. Select the appropriate runtime based on interaction complexity, framework, rendering layer, and performance budget.

### Motion (formerly Framer Motion)
- **URL**: https://motion.dev/
- **Classification**: Animation Library, Gesture and Layout Primitives
- **Ecosystem**: React, Vue, Vanilla JavaScript
- **Core Strengths**: Layout projections (`layout`, `layoutId`), spring physics, gesture recognition (hover, tap, pan, drag), declarative variants, high-performance hybrid CSS/JS mini engine (`motion/mini`).
- **When to Use**: Primary animation driver for modern React and web application interfaces, fluid state transitions, and shared-element morphs.
- **Guardrail**: Keep layout animations restrained to avoid triggering expensive composite repaints on deeply nested DOM trees.

### GSAP (GreenSock Animation Platform)
- **URL**: https://greensock.com/gsap/
- **Classification**: Timeline Orchestration, SVG and Canvas Animation
- **Ecosystem**: Universal JavaScript (Framework-agnostic)
- **Core Strengths**: Unmatched timeline control, complex multi-step sequencing, ScrollTrigger precision, SVG morphing (`MorphSVGPlugin`), high-frequency ticker management.
- **When to Use**: Complex choreographed marketing narratives, interactive product showcases, pin-and-scrub experiences, and intricate SVG manipulations.
- **Guardrail**: Check commercial licensing terms for specific GSAP club plugins when deploying closed-source commercial projects.

### React Spring
- **URL**: https://www.react-spring.dev/
- **Classification**: Physics-based Animation Library
- **Ecosystem**: React
- **Core Strengths**: Fluid physics calculations (mass, tension, friction, velocity) without artificial durations, uninterrupted gesture interruptions.
- **When to Use**: Natural interactive interfaces where user velocity should dictate the decay and bounce of cards, sheets, or floating menus.
- **Guardrail**: Avoid configuring excessively low friction values that produce endless bouncing oscillations.

### Lenis
- **URL**: https://github.com/darkroomengineering/lenis
- **Classification**: Smooth Scroll Engine
- **Ecosystem**: Framework-agnostic
- **Core Strengths**: Lightweight, accessible smooth scrolling that preserves native keyboard navigation, anchor jumps, and touch physics.
- **When to Use**: Editorial sites, creative portfolios, and long-form narrative pages where continuous scroll momentum synchronizes with visual parallax.
- **Guardrail**: Never hijack scroll on touch devices if native momentum scrolling is degraded. Disable or configure lightweight settings for mobile viewports.

### React Three Fiber (R3F)
- **URL**: https://github.com/pmndrs/react-three-fiber
- **Classification**: 3D Scene Graph Engine (Three.js React reconciler)
- **Ecosystem**: React, WebGL, WebGPU
- **Core Strengths**: Declarative 3D scene management, shader material binding, post-processing pipelines, spatial object manipulation.
- **When to Use**: Interactive 3D product visualizers, spatial storytelling, canvas backgrounds, and WebGL experiences.
- **Guardrail**: Ensure canvas memory is released on component unmount and framerates are capped (or set to `demand` rendering mode) when idle.

### Motion-Primitives (ibelick)
- **URL**: https://motion-primitives.com/ | https://github.com/ibelick/motion-primitives
- **Classification**: Open Source UI Motion Primitives
- **Ecosystem**: React, Motion.dev, Tailwind CSS
- **Core Strengths**: Morphing dialogs, expanding toolbars, spring popovers, magnetic buttons, text loops, cursor trails, animated carousels.
- **When to Use**: High-craft micro-interactions and accessible interactive primitives that need immediate drop-in integration.

### Originkit
- **URL**: https://www.originkit.dev/
- **Classification**: Animated Component Library
- **Ecosystem**: React, Tailwind CSS, Motion
- **Core Strengths**: Clean, modern animated components and interactive blocks designed for production landing pages and applications.
- **When to Use**: Ready-to-use animated cards, headers, interactive menus, and feature sections.

### Aceternity UI
- **URL**: https://ui.aceternity.com/
- **Classification**: High-Impact Motion Component Kit
- **Ecosystem**: React, Next.js, Tailwind CSS, Motion.dev
- **Core Strengths**: Background beams, spotlight cards, text reveals, floating docks, infinite moving cards, 3D card perspectives, sparkline overlays.
- **When to Use**: Hero sections and interactive bento showcases requiring visual dynamism.
- **Guardrail**: Do not stack multiple complex canvas effects in a single viewport. Choose one hero effect and keep secondary sections calm.

### React Bits
- **URL**: https://www.reactbits.dev/
- **Classification**: Modular Animated UI Components & Micro-interactions
- **Ecosystem**: React, Tailwind CSS
- **Core Strengths**: Lightweight animated UI patterns, text scramble animations, subtle border gradients, and lightweight canvas effects.
- **When to Use**: Quick polish, button hover enhancements, and typographic delight.

### 21st.dev
- **URL**: https://21st.dev/
- **Classification**: Community Design Registry for Modern Components
- **Ecosystem**: React, Next.js, Tailwind CSS, Motion
- **Core Strengths**: Curated community components, novel interactive widgets, bento layouts, and experimental UI mechanics.
- **When to Use**: Discovering state-of-the-art component implementations and visual patterns.

### Libraries.dev Shader Effects
- **Classification**: High-Performance React Shader Effects
- **Ecosystem**: WebGL, Canvas, React
- **Core Strengths**:
  - **Beam**: Glowing animated laser paths along container borders.
  - **Orb**: Interactive 3D ambient sphere reacting to pointer movement.
  - **Gooey**: Fluid SVG filter merge animations for tabs and badges.
  - **Metal**: Metallic sheen and iridescent reflection surfaces.
  - **Image Distortion**: WebGL fragment shader ripples for photography.
- **When to Use**: Tactile 2.5D surfaces, ambient brand accents, and luxury visual presentation.

### Loading.dev
- **URL**: https://loading.dev/
- **Classification**: Procedural Loading & Spinner Architecture
- **Ecosystem**: SVG, CSS, Canvas
- **Core Strengths**: Lightweight procedural SVG loaders, animated progress bars, skeleton wave patterns, and micro-animations.
- **When to Use**: Designing deterministic, zero-layout-shift asynchronous loading states.

---

## 2. Motion Selection Decision Matrix

| Requirement | Preferred Library | Secondary Alternative | Rendering Layer |
| :--- | :--- | :--- | :--- |
| Application UI / Gestures | Motion (`motion.dev`) | React Spring | DOM (CSS transform / opacity) |
| Complex Scroll Timelines | GSAP + ScrollTrigger | Motion (`useScroll`) | DOM / Canvas |
| Accessible Motion Primitives | Motion-Primitives (ibelick) | Originkit | DOM (Motion / Tailwind) |
| High-Impact Motion Blocks | Aceternity UI | React Bits / 21st.dev | DOM / Canvas |
| Shader Effects (Beam, Orb) | Libraries.dev | ShaderGradient | WebGL Canvas |
| Smooth Page Scrolling | Lenis | Native CSS scroll | Window Scroll Engine |
| Natural Physics & Interruptions | React Spring | Motion (spring curves) | DOM |
| 3D Product & Spatial Scenes | React Three Fiber | Vanilla Three.js | WebGL / WebGPU Canvas |
| Procedural Loaders & Spinners | Loading.dev | Pure CSS Keyframes | SVG / DOM |

---

## 3. The Pixasso Motion Vocabulary

Pixasso reasons about interface motion using explicit, standardized interaction patterns:

1. **Parallax**: Layered depth displacement where foreground and background elements move at differentiated velocities during scroll.
2. **Scrub**: Direct, 1-to-1 binding between an input dimension (scroll progress, pointer coordinate, or slider) and animation playback.
3. **Pin + Transform**: Fixing a container in viewport while child elements sequentially translate, scale, or reveal content before scroll resumes.
4. **Fade + Light**: Coordinating opacity changes with ambient rim lighting or subtle contrast shifts to establish visual focus.
5. **Stagger**: Offsetting child element entrance times by a calibrated interval (typically 30ms to 60ms) to guide eye tracking down an informational hierarchy.
6. **Clip Reveal**: Unveiling imagery or typography using dynamic `clip-path` geometry (rectangles, polygons, circles) rather than blunt opacity fades.
7. **Magnetic CTA**: Subtle attraction of interactive buttons or tags toward the active pointer location within a bounded proximity threshold.
8. **Image Zoom**: Controlled dimensional scaling of photography on focus or container expansion, preserving image aspect ratio.
9. **Text Shift**: Splitting text into words, characters, or lines and translating them smoothly from an overflow mask to introduce editorial gravity.
10. **Press + Spring**: Immediate tactile scale reduction on pointerdown followed by an organic spring bounce on release.
11. **State Change**: Coordinated morphing between layout states (expanding cards into full modals, list-to-grid transitions) using shared-element anchors.
12. **Shared-Element Transitions**: Persistent visual continuity between view states where common elements smoothly translate and resize between pages.
13. **Fluid Motion**: Organic velocity curves and continuous wave equations simulating liquid, cloth, or soft-body dynamics.

---

## 4. Motion Design Principles and Performance Budgets

### Core Principles
- **Intentionality**: Motion must communicate hierarchy, reveal spatial relationships, or provide immediate action feedback.
- **Restraint**: Default transition durations should sit between 150ms and 350ms. Reserve durations longer than 600ms exclusively for narrative moments.
- **Consistent Easing**: Adopt a unified easing curve across the entire experience (for example, `cubic-bezier(0.16, 1, 0.3, 1)` for clean deceleration).
- **Spatial Continuity**: Elements entering or leaving must originate from and return to logical visual coordinates.

### Anti-Noise Rules
- Do not add scroll-triggered fade-ins to every paragraph and heading.
- Do not make every card or button wiggle on hover.
- Do not attach cursor-following dots or beams unless the core experience is an interactive art installation.
- Do not animate layout properties that trigger reflow (width, height, margin, padding, top, left). Always animate `transform` and `opacity`.

### Accessibility and Reduced Motion Standard
Every animated component must respect user preferences:

```css
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

In JavaScript engines (Motion, GSAP, Lenis), inspect `window.matchMedia('(prefers-reduced-motion: reduce)').matches` before initializing complex timelines or smooth scroll listeners.
