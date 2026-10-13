# Creative 3D, Blender MCP, and Spatial Web Reference

A comprehensive architecture guide for rendering spatial interfaces, 3D WebGL/WebGPU canvases, generative shaders, and agentic 3D modeling workflows.

---

## 1. 3D Web Engine Selection Matrix

| Engine | Ideal Use Case | Bundle Footprint | Physics / Runtime | Shading & Materials |
| :--- | :--- | :--- | :--- | :--- |
| **Three.js / React Three Fiber** | Interactive product showcases, canvas backgrounds | ~150kB gzipped | Rapier / Cannon | Custom GLSL, PBR materials |
| **Babylon.js** | Full-scale 3D games, architectural CAD visualizers | ~400kB gzipped | Havok physics integration | Node Material Editor, PBR, WebGPU native |
| **COBE (Shu Ding)** | Lightweight interactive 3D globe | 5kB gzipped | Pure WebGL micro-engine | Dot-matrix terrain luminescence |
| **LiquidGL** | Tactile Apple-style liquid glass refraction | ~12kB gzipped | Custom fragment shaders | Real-time optical chromatic aberration |
| **Theatre.js** | Cinematic camera timelines & choreographed sequences | ~80kB studio (dev only) | Timeline sequencer | Visual keyframe editor for Three.js & DOM |
| **Spline 3D** | Fast interactive vector 3D models with web embed | External runtime | Embedded physics | Visual material graphs |

---

## 2. Agentic 3D Modeling via Blender MCP

The Blender Model Context Protocol server (`blender_mcp`, maintained at `projects.blender.org/lab/blender_mcp`) enables autonomous coding agents to control Blender directly through JSON-RPC.

### Capabilities and Architecture
1. **Scene Generation**: Agents can programmatically spawn primitive meshes, apply Subdivision Surface modifiers, and construct procedural geometry using Python geometry node graphs.
2. **Material and Lighting Setup**: Programmatic assignment of Principled BSDF nodes, HDR environment lighting, emission textures, and glass dispersion properties.
3. **Camera Choreography**: Positioning cameras with exact focal lengths (e.g., 50mm or 85mm portrait lenses) and rendering turntable sequences.
4. **GLTF / GLB Export**: Automating the conversion of high-poly modeling files into compressed Draco-encoded GLTF/GLB assets optimized for web browsers.

### Workflow with Pixasso
```
[Agent Intent / Prompt] 
          |
          v
[Blender MCP Gateway] ---> Executes Blender Python API (bpy)
          |
          v
[3D Asset (.glb / .gltf)] ---> Compressed with Draco or Meshopt
          |
          v
[React Three Fiber / Babylon.js] ---> Rendered in web application viewport
```

---

## 3. Specialized Spatial Components and Shaders

### COBE (Interactive 5kB Globe)
- **Repository**: `github.com/shuding/cobe`
- **Core Value**: Provides a mesmerizing, highly performant 3D globe using only a 5kB WebGL fragment shader.
- **Implementation Rules**:
  - Render with high device pixel ratio capped at 2.0.
  - Bind drag gestures to azimuthal rotation with friction decay.
  - Highlight key geographic pins with pulsing rings.

### LiquidGL (Tactile Apple-Style Glass)
- **Repository**: `github.com/naughtyduk/liquidGL`
- **Core Value**: Premium real-time optical refraction, chromatic aberration, and lens distortion that emulates Apple visionOS glass materials.
- **Implementation Rules**:
  - Render over dynamic background content (typography or imagery) so the optical refraction has content to bend.
  - Provide a fallback frosted CSS backdrop filter for low-tier mobile GPUs.

### Thinking Orbs
- **Repository**: `github.com/Jakubantalik/thinking-orbs`
- **Core Value**: Fluid procedural animated spheres representing background thinking, reasoning, and real-time agent synthesis states.
- **Implementation Rules**:
  - Modulate internal noise scale and rotation speed based on agent execution state: calm breathing when idle, accelerated turbulence when processing tasks.

### OpenShaders and Cables.gl / Nodes.io
- **OpenShaders**: Curated library of open-source GLSL shaders for glowing edges, noise displacement, and raymarching.
- **cables.gl & nodes.io**: Node-based visual programming environments that allow rapid prototyping of WebGL graphs without manual GLSL boilerplate.

---

## 4. Cinematic Motion and Timeline Choreography

### Theatre.js
- **Repository**: `github.com/theatre-js/theatre`
- **Core Value**: Visual motion design studio for Three.js and HTML/SVG.
- **Key Features**:
  - Provides a timeline GUI in development mode to scrub, tweak curves, and keyframe multiple 3D objects simultaneously.
  - Exports a compact JSON animation state that runs with zero runtime overhead in production.

### GSAP ScrollTrigger
- **Core Value**: Industry benchmark for pinning, scrubbing, and synchronizing 3D camera angles with viewport scroll.
- **Best Practice**:
  - Use `scrub: 1` or `scrub: 0.5` to smooth out erratic mousewheel inputs.
  - Interpolate 3D camera positions smoothly using three.js `Vector3.lerp()` inside the ScrollTrigger `onUpdate` callback.

---

## 5. Agent Skills for Motion and Spatial Tooling

Specialized agent skill packages available for integration:
- **Rive Skills** (`github.com/BowTiedSwan/rive-skills`): State machine choreography for interactive vector graphics.
- **GSAP Skills** (`github.com/greensock/gsap-skills`): Specialized timeline orchestration patterns for coding agents.
- **Wiggle Claude Skill** (`github.com/talknerdytome-labs/wiggle-claude-skill`): Subtle kinetic micro-interactions and tactile organic movements.
- **Claude Remotion Skill** (`github.com/haidrrrry/claude-remotion-skill`): Programmatic video generation with React.
- **Diffusion Studio Lottie** (`github.com/diffusionstudio/lottie`): High-speed vector animations.
- **Three.js Skills** (`github.com/CloudAI-X/threejs-skills`): Best practices for 3D web scene construction.
