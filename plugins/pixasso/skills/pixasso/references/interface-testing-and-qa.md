# Interface Testing and Design QA Reference

Testing in Pixasso is not an afterthought outsourced to end users. Pixasso harnesses installed MCP servers, browser automation tools, environment plugins, and testing skills to rigorously stress-test interfaces across visual fidelity, responsive behavior, accessibility, motion performance, and sensory feedback before code is considered complete.

---

## 1. Testing Capabilities and Harnesser Integration

Pixasso coordinates four testing layers using tools present in the active environment:

```
[Layer 1: Visual & Viewport QA]   --> chrome-devtools-mcp / browser-use (take_screenshot, resize_page)
[Layer 2: Interaction & Flow QA]   --> Browser automation (click, hover, press_key, evaluate_script)
[Layer 3: Automated A11y & Audit]  --> lighthouse_audit, console message & network request inspection
[Layer 4: Component & Unit QA]     --> Vitest / Playwright / RTL test runners & generative_ui previews
```

---

## 2. Browser Testing with `chrome-devtools-mcp`

When `chrome-devtools-mcp` or a browser automation tool is available, Pixasso executes a standardized 5-point verification run:

### A. Responsive Viewport Matrix
The agent resizes the browser window across four canonical viewport widths and captures screenshots to verify layout integrity:
1. **Mobile (375px or 390px)**: Verify one-column stacking, touch target sizes, and drawer navigation.
2. **Tablet (768px)**: Verify grid reorganization and medium-density spacing.
3. **Laptop (1024px or 1280px)**: Verify multi-column layouts and hover state activation.
4. **Widescreen Desktop (1440px+)**: Verify maximum container constraints (`max-w-7xl`, etc.) and prevent stretched typography.

Automated viewport check script executed via `evaluate_script`:
```javascript
(() => {
  const hasHorizontalScroll = document.documentElement.scrollWidth > window.innerWidth;
  const overflowingElements = Array.from(document.querySelectorAll('*')).filter(el => {
    return el.getBoundingClientRect().right > window.innerWidth;
  });
  return {
    hasHorizontalScroll,
    overflowCount: overflowingElements.length,
    overflowingTags: overflowingElements.slice(0, 5).map(el => el.tagName + (el.className ? '.' + el.className : ''))
  };
})()
```

### B. Interactive State Verification
Simulate real user gestures:
- Trigger hover states via `hover` to verify hover transforms, border highlights, and tooltip timing.
- Trigger focus-visible states via `press_key: "Tab"` to ensure high-contrast focus rings are visible.
- Open modals, drawers, and segmented controls via `click` to verify state transitions and dismiss them via `press_key: "Escape"`.

### C. Console and Network Health Check
- Inspect logs via `list_console_messages` to ensure zero unhandled JavaScript errors, React hydration mismatches, or missing key warnings.
- Inspect network requests via `list_network_requests` to ensure zero 404 assets (missing fonts, broken image URLs, or failed shader chunks).

### D. Automated Lighthouse and Accessibility Audit
Execute `lighthouse_audit` with category focus on:
- **Accessibility**: Verify contrast ratios, missing alt attributes, unlabelled form controls, and invalid ARIA landmarks.
- **Performance**: Track Cumulative Layout Shift (CLS under 0.1), Largest Contentful Paint (LCP under 2.5s), and Interaction to Next Paint (INP under 200ms).

---

## 3. Motion, Animation, and Performance Testing

### A. Framerate and Jank Profiling
- Start a performance profile using `performance_start_trace` before initiating heavy scroll or WebGL camera movements.
- Stop the trace using `performance_stop_trace` and verify that frame times do not exceed 16.6ms (60fps baseline).
- Confirm that animated CSS properties are strictly restricted to `transform` and `opacity`. If `top`, `left`, `width`, `height`, or `margin` are animated, flag them as performance defects.

### B. Reduced-Motion Media Query Verification
Verify that when `prefers-reduced-motion: reduce` is active:
1. All non-essential animations snap instantly (`duration: 0.01ms`).
2. Smooth scroll engines (Lenis, native smooth scroll) revert to instant jumping (`scroll-behavior: auto`).
3. Continuous particle loops or 3D background rotations pause.

Test script executed in browser:
```javascript
(() => {
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  return {
    prefersReducedMotionSupported: !!mediaQuery,
    isReducedActive: mediaQuery.matches
  };
})()
```

---

## 4. Sensory and Audio Testing (UISFX)

When sound micro-interactions are integrated:
1. **User Gesture Requirement**: Verify that no sound plays prior to an initial user click or keypress.
2. **Persistent Mute Verification**: Test the global mute toggle. Verify that when muted, `SoundEngine.play()` cleanly returns without triggering Web Audio API calls.
3. **Volume Calibration**: Verify that sound cues are balanced and unobtrusive (-12dB to -18dB relative volume).

---

## 5. Automated Component Testing Recipes

For codebases with test runners (Vitest, Jest, Playwright), Pixasso provides production test specifications:

### React Testing Library Keyboard & ARIA Test Pattern
```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CustomSegmentedControl } from './CustomSegmentedControl';

describe('CustomSegmentedControl Accessibility', () => {
  it('navigates options via arrow keys and manages focus', async () => {
    const user = userEvent.setup();
    render(<CustomSegmentedControl options={['Day', 'Week', 'Month']} defaultValue="Day" />);

    const firstTab = screen.getByRole('tab', { name: /day/i });
    expect(firstTab).toHaveAttribute('aria-selected', 'true');

    firstTab.focus();
    await user.keyboard('{ArrowRight}');
    const secondTab = screen.getByRole('tab', { name: /week/i });
    expect(secondTab).toHaveFocus();
    expect(secondTab).toHaveAttribute('aria-selected', 'true');
  });

  it('maintains visible focus ring without removing outline', () => {
    render(<CustomSegmentedControl options={['A', 'B']} defaultValue="A" />);
    const tab = screen.getByRole('tab', { name: /a/i });
    expect(window.getComputedStyle(tab).outlineStyle).not.toBe('none');
  });
});
```

---

## 6. Verification Gate Sign-Off Checklist

Before any design task or implementation is marked complete, sign off on every item:

```
[ ] 1. Responsive Viewports: Tested at 390px, 768px, 1024px, 1440px with zero horizontal scroll.
[ ] 2. Contrast & Legibility: Text satisfies 4.5:1 (body) and 3:1 (large type / interactive borders).
[ ] 3. Keyboard Navigation: Entire interface traversable via Tab, Enter, Space, Escape, and Arrows.
[ ] 4. Focus Visibility: High-contrast focus indicators clearly visible on every interactive control.
[ ] 5. Touch Targets: Minimum 44x44 CSS pixels on mobile viewports.
[ ] 6. Reduced Motion: Completely respects prefers-reduced-motion without breaking content.
[ ] 7. Console & Network: Zero unhandled errors, zero broken assets, zero hydration warnings.
[ ] 8. Anti-Pattern Scan: Zero uncontextual purple gradients, Lucide flooding, or default glassmorphism.
```
