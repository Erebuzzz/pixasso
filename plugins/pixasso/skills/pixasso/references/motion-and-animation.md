# Motion and Animation Systems Reference

Motion in Pixasso is communicative, structural, and orienting rather than purely decorative. Every motion must answer a functional question: What does this movement communicate, reveal, guide, or improve? If an animation answers none of these, it should be removed.

---

## 1. Curated Motion Libraries and Runtimes

Motion libraries are not interchangeable. Select the appropriate runtime based on interaction complexity, framework, rendering layer, and performance budget.

### Motion (formerly Framer Motion)
- **URL**: https://motion.dev/
- **Classification**: Animation Library, Gesture and Layout Primitives
- **Ecosystem**: React, Vue, Vanilla JavaScript
- **Core Strengths**: Layout projections (`layout`, `layoutId`), spring physics, gesture recognition (hover, tap, pan, drag), declarative variants.
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

### Vanta.js
- **URL**: https://github.com/tengbao/vanta
- **Classification**: Animated 3D Background Effects
- **Ecosystem**: Three.js, p5.js wrappers
- **Core Strengths**: Ready-to-use 3D backgrounds (waves, clouds, birds, halo, cells, net).
- **When to Use**: Fast visual exploration or lightweight animated background canvases for hero sections.
- **Guardrail**: Heavy GPU overhead if left running continuously. Always pause when scrolled out of viewport.

### Liquid Glass JS
- **URL**: https://github.com/dashersw/liquid-glass-js
- **Classification**: Glass Distortion and Refraction Shader
- **Ecosystem**: WebGL, Canvas
- **Core Strengths**: Real-time optical refraction, chromatic aberration, and tactile lens distortion over underlying DOM/canvas elements.
- **When to Use**: Futuristic, experimental, or tactile surface interfaces where glass refraction provides authentic optical depth.
- **Guardrail**: Provide a static frosted CSS backdrop-filter fallback for low-power mobile GPUs.

### ShaderGradient
- **URL**: https://github.com/ruucm/shadergradient
- **Classification**: Fluid 3D Shader Canvas
- **Ecosystem**: Three.js, React, Framer
- **Core Strengths**: Dynamic multi-color fluid meshes with customizable wireframe, lighting, and wave parameters.
- **When to Use**: Dynamic hero backgrounds, ambient atmospheric lighting, and interactive visual branding.
- **Guardrail**: Restrict pixel ratio scaling to maximum 1.5x on high-DPI displays to prevent mobile GPU thermal throttling.

### Liquid Logo
- **URL**: https://github.com/collidingScopes/liquid-logo
- **Classification**: Particle and Vector Distortion
- **Ecosystem**: Canvas, SVG
- **Core Strengths**: Interactive vector dispersion, magnetic cursor disturbance, fluid reconstitution.
- **When to Use**: Memorable brand hero marks, interactive identity headers, and creative agency homepages.

### OpenMotion
- **URL**: https://openmotion.design/
- **Classification**: Open Motion Design Standards and Easing Specs
- **Core Strengths**: Standardized motion tokens, easing curves, duration scales, and multi-platform specifications.
- **When to Use**: Defining cross-platform motion design tokens between design tools (Figma) and codebases.

### Transitions.dev
- **URL**: https://transitions.dev/
- **Classification**: Component Transition Playground & Motion Snippet Engine
- **Core Strengths**: Interactive catalog of component layout transitions (dialog morphs, list-to-detail expansions, tab slider pills, floating panel docks).
- **When to Use**: Sourcing tested layout transitions and extracting exact animation parameters (durations, spring tension/damping, clip-path formulas).
- **Agent Workflow**: Inspect the transition recipe or copy the conceptual prompt to guide component state machine animations.

### SceneAI.art
- **URL**: https://sceneai.art/
- **Classification**: Motion Design Prompt Engine & Kinetic Ideation
- **Core Strengths**: Curated kinetic scenes, video motion prompt formulas, camera choreography, dynamic lighting curves.
- **When to Use**: Generating prompts for video sequences (Google Flow, Runway, Luma), ideating kinetic logo treatments, or defining 3D scene camera choreography.
- **Agent Workflow**: Extract or adapt the prompt structure directly to generate coherent motion concepts without starting from a blank page.

---

## 2. Motion Selection Decision Matrix

| Requirement | Preferred Library | Secondary Alternative | Rendering Layer |
| :--- | :--- | :--- | :--- |
| Application UI / Gestures | Motion (`motion.dev`) | React Spring | DOM (CSS transform / opacity) |
| Complex Scroll Timelines | GSAP + ScrollTrigger | Motion (`useScroll`) | DOM / Canvas |
| Smooth Page Scrolling | Lenis | Native CSS scroll | Window Scroll Engine |
| Natural Physics & Interruptions | React Spring | Motion (spring curves) | DOM |
| 3D Product & Spatial Scenes | React Three Fiber | Vanilla Three.js | WebGL / WebGPU Canvas |
| Ambient Shader Fluid Meshes | ShaderGradient | Custom GLSL / Canvas 2D | WebGL Canvas |
| Micro-interactions & Quick Tweaks | React Bits / Pure CSS | Motion | CSS Transitions |

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
