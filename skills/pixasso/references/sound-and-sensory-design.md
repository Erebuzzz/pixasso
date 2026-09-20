# Sound and Sensory Design Reference

Sensory design extends interface feedback beyond the visual plane into auditory and tactile dimensions. Sound in Pixasso is communicative, confirmatory, and brand-defining. It should never be ambient noise or continuous distraction.

---

## 1. Curated Sound Design Resources

### UISFX
- **URL**: https://uisfx.com/
- **Classification**: Sound Effect Library, Sonic Micro-Interactions
- **Core Strengths**: Curated interface sound packs (subtle mechanical clicks, soft pops, spatial swooshes, success chimes, notification pulses, tactile toggles).
- **When to Use**: High-craft web experiences, creative tools, digital instruments, fintech confirmations, interactive storytelling, and tactile desktop web applications.
- **Implementation Approach**: Pair UI events (button press, drawer slide, item deletion, completed transaction) with crisp, short audio cues (typically 20ms to 120ms in duration).

---

## 2. Sonic Micro-Interaction Taxonomy

Pixasso classifies interface sounds into five functional categories:

1. **Confirmation & Affirmation**:
   - Short, bright frequency rise (e.g., subtle marimba or gentle bell tone).
   - Trigger: Completing a form, publishing a document, copying a code snippet to clipboard.
   - Purpose: Provides cognitive reassurance without requiring the user to scan the screen for toast alerts.

2. **Tactile Mechanical Clicks**:
   - Ultra-short acoustic impulse (under 30ms) simulating keyboard switches or mechanical levers.
   - Trigger: Segmented control toggles, radio buttons, dial rotations.
   - Purpose: Grounds digital interfaces in physical tangibility.

3. **Spatial Transitions**:
   - Soft, filtered white noise or gentle air rush (50ms to 150ms).
   - Trigger: Modal open, drawer slide, panel expansion.
   - Purpose: Reinforces the spatial movement of components entering or exiting the viewport.

4. **Alerts & Friction Feedback**:
   - Subdued double-click or muted low-frequency tap.
   - Trigger: Form validation error, boundary collision on drag, disabled button click.
   - Purpose: Communicates limits or errors constructively without alarming the user.

5. **Ambient Identity Marks**:
   - Bespoke sonic logos (two to three notes) played exclusively during intentional brand moments.
   - Trigger: Initial launch sequence or celebratory milestones.
   - Purpose: Establishes sonic branding memory.

---

## 3. Audio Engineering & Implementation Rules

### A. Web Audio API vs Audio Elements
For micro-interactions requiring zero latency, use the Web Audio API with pre-decoded `AudioBuffer` objects. Standard HTML `<audio>` elements suffer from 50ms to 200ms playback latency, destroying the illusion of physical responsiveness.

```javascript
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.buffers = new Map();
    this.isMuted = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
  }

  async load(name, url) {
    this.init();
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await this.ctx.decodeAudioData(arrayBuffer);
    this.buffers.set(name, audioBuffer);
  }

  play(name, volume = 0.5) {
    if (this.isMuted || !this.ctx || !this.buffers.has(name)) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    const source = this.ctx.createBufferSource();
    const gainNode = this.ctx.createGain();
    source.buffer = this.buffers.get(name);
    gainNode.gain.value = volume;
    source.connect(gainNode);
    gainNode.connect(this.ctx.destination);
    source.start(0);
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }
}

export const sound = new SoundEngine();
```

### B. Sensory Accessibility Standards
Every interface implementing sound must obey four strict accessibility laws:
1. **User Control**: Never play audio without an initial user gesture. Modern browsers automatically block unprompted autoplay.
2. **Persistent Global Mute**: Always provide an easily accessible mute toggle in the navigation header or persistent toolbar. Persist this preference in `localStorage`.
3. **Reduced-Sensory Preferences**: Check user audio preferences and provide visual equivalents (subtle toast or icon shift) for all sound notifications.
4. **Volume Calibration**: Keep UI micro-interaction sounds soft (-12dB to -18dB relative to standard system audio) to prevent ear fatigue.
