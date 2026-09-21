# Creative Coding, WebGL, and WebGPU Reference

Experimental rendering technologies allow interfaces to transcend traditional DOM constraints. However, Pixasso enforces a strict rule: experimental technology must improve the experience, not become the experience's only reason for existing.

---

## 1. Technology Landscape Overview

### 1. Canvas 2D API
- **Best For**: High-frequency 2D rendering, data charts with tens of thousands of data points, interactive drawing surfaces, node-and-edge graphs, generative patterns.
- **Advantages**: Universal hardware support, near-zero startup latency, simple coordinate math, zero WebGL shader compilation overhead.
- **Constraints**: CPU-bound for rasterization; lacks native 3D depth buffers or hardware-accelerated matrix transformations.
- **Libraries**: Native HTML5 Canvas, Konva.js, PixiJS (can fallback to 2D), Paper.js.

### 2. WebGL 2.0
- **Best For**: Complex 3D environments, custom GLSL fragment/vertex shaders, lighting simulations, particle systems, post-processing filters (bloom, blur, refraction).
- **Advantages**: Hardware-accelerated GPU pipeline, broad cross-platform compatibility across modern browsers and mobile devices.
- **Constraints**: Higher memory footprint, initial shader compilation pauses (jank), complex context loss handling (`webglcontextlost`).
- **Libraries**: Three.js, React Three Fiber (R3F), Babylon.js, OGL (ultra-lightweight WebGL library).

### 3. WebGPU
- **Best For**: Next-generation computational graphics, heavy compute shaders, high-density particle physics (100,000+ particles), complex procedural generation.
- **Advantages**: Dramatically reduced CPU driver overhead, modern multi-threaded GPU architecture, direct compute shader support.
- **Constraints**: Emerging browser support; requires graceful fallback to WebGL 2.0 or Canvas 2D on unsupported devices or older operating systems.
- **Libraries**: Three.js (WebGPURenderer), Babylon.js WebGPU engine, WGSL native pipelines.

### 4. Canvas UI (HTML-in-Canvas and Canvas Scene Graphs)
- **Reference**: https://canvasui.dev/
- **Best For**: High-performance interfaces requiring extreme frame rates where thousands of interactive UI elements would choke the DOM layout engine.
- **Implementation Strategy**: Build or utilize a retained-mode scene graph over a canvas. Map pointer events via bounding box hit tests or picking buffers.
- **Crucial Requirement**: You must maintain an off-screen accessible DOM mirror tree for screen readers and keyboard focus management.

### 5. Spline 3D & Agent Browser Automation
- **Reference**: https://spline.design/
- **Classification**: Collaborative 3D Web Design Tool, AI 3D Generation
- **Core Strengths**: Interactive web-first 3D design, real-time physics, game controls, camera animations, and native React runtime export (`@splinetool/react-spline` or vanilla web components).
- **Agent Browser Automation Workflow**:
  - When the user provides authorization or an active session, autonomous agents can use browser tools (such as `chrome-devtools-mcp` or browser-use) to navigate to Spline.
  - The agent can input tailored creative prompts into Spline AI, adjust materials, camera angles, and physics states, and retrieve the exported scene URL or embed code directly for the frontend.
- **When to Use**: Interactive hero centerpieces, 3D landing page interactions, and tactile web models where hand-coded Three.js would take significantly longer.
- **Implementation Note**: Set scene background to transparent, disable default mouse zoom if it conflicts with document scrolling, and lazy-load the Spline canvas.

### 6. ThreeUI
- **Reference**: https://threeui.com/browse
- **Classification**: 3D Animated Website Directory, WebGL Benchmarks
- **Core Strengths**: Curated collection of live 3D animated websites and spatial interface patterns built with Three.js and WebGL.
- **When to Use**: Benchmarking camera pacing, lighting setups, 3D scroll-scrubbing mechanics, and hybrid 2D/3D component layering.
- **Deconstruction Lens**: Analyze how 3D canvas backgrounds synchronize with foreground HTML typography and navigation.

### 7. Glass by Sam Asante
- **Reference**: https://glass.samasante.com/
- **Classification**: Optical Refraction Shader, Realistic Glass Generator
- **Core Strengths**: Physically accurate optical refraction, chromatic dispersion, adjustable surface roughness, thickness, and lighting highlights rendered via WebGL.
- **When to Use**: High-end tactile surfaces, futuristic lens interfaces, and creative portfolio backdrops where generic CSS `backdrop-filter: blur()` looks flat and unconvincing.
- **Implementation Note**: Extract the exact GLSL shader uniforms or use the generator to calibrate optical distortion parameters without introducing heavy runtime overhead.

---

## 2. Technical Evaluation Checklist

Before committing to WebGL, WebGPU, or Canvas for an interface, evaluate these eight parameters:

```
[ ] 1. Core Purpose: Does 3D/Canvas clarify the user mental model, or is it merely decorative?
[ ] 2. Device Footprint: Does the target audience use low-power laptops or older mobile devices?
[ ] 3. Battery & Thermal Budget: Will continuous rendering cause laptop fans to spin or drain mobile batteries?
[ ] 4. Bundle Overhead: Can the project afford the 150KB to 600KB payload of a 3D engine?
[ ] 5. Startup Latency: Can the scene initialize in under 400ms without blocking first paint?
[ ] 6. Accessibility & Semantics: Can every interactive object be reached and activated via keyboard?
[ ] 7. Viewport Visibility: Does the render loop pause automatically when the canvas scrolls out of view?
[ ] 8. Fallback Pathway: Is there a clean static SVG or CSS render if WebGL context creation fails?
```

---

## 3. Performance Optimization Strategies

### A. Render on Demand (Frameloop Control)
In Three.js and React Three Fiber, never run a continuous 60fps render loop if the scene is static between user interactions.

```tsx
// React Three Fiber: Set frameloop to 'demand'
<Canvas frameloop="demand">
  {/* Scene only re-renders when state or props change */}
</Canvas>
```

When continuous animation is required (such as rotating models or ambient particle flow), ensure the loop is paused when the tab is hidden or when the element leaves the viewport:

```javascript
// Pause loop when page is hidden
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    cancelAnimationFrame(animationFrameId);
  } else {
    requestAnimationFrame(renderLoop);
  }
});

// Pause loop with IntersectionObserver
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    isRenderingActive = entry.isIntersecting;
    if (isRenderingActive) requestAnimationFrame(renderLoop);
  });
}, { threshold: 0.1 });
observer.observe(canvasElement);
```

### B. Device Pixel Ratio (DPR) Clamping
Rendering at 3x DPR on high-density mobile screens causes 9x fill-rate calculations with zero perceptible quality improvement. Always clamp DPR to a maximum of 1.5 or 2.0:

```javascript
// Clamp DPR between 1 and 1.5 for performance-sensitive scenes
const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
renderer.setPixelRatio(dpr);
```

### C. Resource Disposal and Context Management
WebGL contexts are finite. When unmounting components, explicitly dispose of geometries, materials, and textures to avoid catastrophic memory leaks:

```javascript
function disposeScene(scene) {
  scene.traverse((object) => {
    if (object.geometry) object.geometry.dispose();
    if (object.material) {
      if (Array.isArray(object.material)) {
        object.material.forEach((mat) => mat.dispose());
      } else {
        object.material.dispose();
      }
    }
  });
}
```

### D. Shader Complexity and Precision
- Use `precision mediump float;` for mobile shaders instead of `highp` unless sub-millimeter precision is required.
- Pre-compute mathematical operations on the CPU and pass them as uniforms rather than recalculating them per fragment in GLSL.
- Avoid branch divergence (`if/else` conditions based on dynamic variables) inside fragment shaders. Use `step()`, `clamp()`, and `mix()` math primitives instead.

---

## 4. Progressive Degradation Pipeline

```
              [Target Platform / User Agent]
                             |
                             v
               Does browser support WebGPU?
                      /             \
                   YES               NO
                   /                   \
        [WebGPU Render Pipeline]   Does browser support WebGL 2.0?
                                       /             \
                                    YES               NO
                                    /                   \
                         [WebGL Pipeline]         [Canvas 2D or SVG Fallback]
```

Every experimental interface designed by Pixasso must degrade gracefully. If WebGL crashes or is blocked by enterprise browser policies, the core informational content and user actions must remain completely functional.
