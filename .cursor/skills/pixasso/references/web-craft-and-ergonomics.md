# Web Craft, Ergonomics, and Mathematical Utilities Reference

A technical reference for mathematical layout rules, concentric corner radii, eased color gradients, tactile audio engines, and perceptual color spaces.

---

## 1. Concentric Corner Radius Mathematics

When a card contains a child element (e.g., an image, button, or nested badge) surrounded by internal padding, nesting identical or arbitrary border-radii creates an optically warped, awkward corner.

### The Concentric Radius Formula
To maintain perfectly parallel, harmonious concentric curves between an outer container and an inner child:

```
R_inner = max(0, R_outer - padding)
```

### Examples
- **Card**: Outer radius `16px` (`rounded-2xl`), internal padding `8px` (`p-2`).
  - Correct Inner Radius: `16px - 8px = 8px` (`rounded-lg`).
- **Button Container**: Outer radius `24px`, internal padding `12px`.
  - Correct Inner Radius: `24px - 12px = 12px`.
- **Badge in Card**: Outer radius `12px`, internal padding `16px`.
  - Since `padding >= R_outer`, `R_inner = 0px` (square corners or pill treatment).

### Anti-Pattern to Avoid
Never assign an inner element a radius equal to or greater than its parent (`R_inner >= R_outer`), as the inner corner will bulge against the outer border, destroying optical alignment. Reference calculator: `corner-radii.xyz`.

---

## 2. Eased CSS Gradients (Eliminating Hard Band Lines)

Standard CSS linear gradients interpolate colors linearly across space:
```css
/* Harsh linear gradient - creates noticeable banding lines */
background: linear-gradient(to bottom, rgba(0,0,0,0.8), transparent);
```

Because human perception of light is logarithmic, standard linear gradients produce harsh optical seams where the color transition begins and ends.

### The Solution: Non-Linear Eased Gradients
Using smooth cubic-bezier easing functions (via `larsenwork.com/easing-gradients`), interpolate gradients across multiple mathematical stops:

```css
/* Smooth eased gradient with cubic deceleration */
background: linear-gradient(
  to bottom,
  hsl(0, 0%, 0%) 0%,
  hsla(0, 0%, 0%, 0.738) 19%,
  hsla(0, 0%, 0%, 0.541) 34%,
  hsla(0, 0%, 0%, 0.382) 47%,
  hsla(0, 0%, 0%, 0.278) 56.5%,
  hsla(0, 0%, 0%, 0.194) 65%,
  hsla(0, 0%, 0%, 0.126) 73%,
  hsla(0, 0%, 0%, 0.075) 80.2%,
  hsla(0, 0%, 0%, 0.042) 86.1%,
  hsla(0, 0%, 0%, 0.021) 91%,
  hsla(0, 0%, 0%, 0.008) 95%,
  hsla(0, 0%, 0%, 0.002) 98.2%,
  transparent 100%
);
```

This ensures zero visible banding lines when fading hero images into solid ground surfaces.

---

## 3. Perceptual Color Spaces (OKLCH)

Traditional sRGB and HSL color models suffer from non-uniform perceived lightness: pure yellow has a perceived lightness of ~97 percent, while pure blue has a perceived lightness of ~30 percent, even with identical saturation and lightness values.

### Why OKLCH Outperforms HSL
- **Perceptual Uniformity**: In OKLCH (`oklch(L C H)`), lightness (`L`) is perceptually uniform across all hues (`H`). Lightness 0.7 feels equally bright whether blue, green, or amber.
- **Predictable Accessible Palettes**: Designing WCAG 4.5:1 contrast scales is deterministic because colors sharing the same `L` value guarantee identical optical contrast against black or white.
- **Tooling**: Reference the Evil Martians OKLCH Color Picker (`github.com/evilmartians/oklch-picker`) when calibrating color tokens.

---

## 4. Tactile Audio Feedback (@web-kits/audio)

Auditory feedback provides instant tactile confirmation for high-stakes interactions without cluttering the screen with toasts.

### Implementation with `@web-kits/audio` / Web Audio API
- **URL**: https://audio.raphaelsalaja.com/
- **Sound Archetypes**:
  - **Click**: Short 1200Hz triangle wave pulse (15ms duration) for tab switches and toggles.
  - **Pop**: Upward frequency sweep (400Hz to 800Hz, 30ms) for modal reveals.
  - **Success Chime**: Pure harmonic sine chord (523Hz + 659Hz + 784Hz, 120ms decay) for form completions.
  - **Error Thud**: Downward square/sawtooth pulse (150Hz to 80Hz, 80ms) for validation failures.
- **Rules**:
  - Always keep gain low (`0.03` to `0.05`) to prevent startling users.
  - Provide a global audio toggle in user preferences and respect system silence.

---

## 5. Frontend Engineering Cheat Sheet (Interfaces.dev)

Core rules from `interfaces.dev/cheat-sheet`:
1. **Focus Rings**: Never set `outline: none` without providing an accessible alternative. Use `focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2`.
2. **Scroll Lock**: When opening full-screen modals, lock the body scroll while preserving scrollbar width to prevent annoying page layout shifts:
   ```css
   html { scrollbar-gutter: stable; }
   ```
3. **Tap Highlight**: Remove mobile browser default tap highlights: `-webkit-tap-highlight-color: transparent`.
4. **Touch Action**: For drag-to-scroll sliders or canvas surfaces, set `touch-action: pan-y` to allow vertical page scroll while capturing horizontal swipe gestures cleanly.
