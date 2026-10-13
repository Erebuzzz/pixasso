# Component and Section Archetypes Reference

A field guide to structural section architecture, responsive page rhythm, flow patterns, and micro-interactions across modern web applications.

---

## 1. Landing Hero Architecture (Supahero.io Archetypes)

The hero section dictates the initial mental model of the product. Rather than defaulting to a generic centered headline with two buttons, choose from 5 distinct architectural compositions based on the product archetype:

### 1. Split Asymmetric Hero (Product-First)
- **Structure**: 50/50 or 45/55 desktop split. Left column hosts headline, value proposition, social proof avatars, and primary CTA. Right column hosts an interactive or framed product interface preview.
- **Ideal For**: SaaS products, developer tools, workflows, dashboards.
- **Key Rules**:
  - The right-hand preview must showcase actual product UI, not an abstract illustration or generic stock graphic.
  - On mobile (<768px), stack left column first, followed by a cropped or simplified preview container with horizontal scroll or tabbed preview.

### 2. Editorial Typography-Forward Hero
- **Structure**: High-impact display typeface spanning 80 to 100 percent of viewport width (72px to 120px font-size), paired with a compact 2-line subtitle and minimalist navigation.
- **Ideal For**: Design studios, luxury brands, creative agencies, publication launches.
- **Key Rules**:
  - Typography does the heavy lifting: letter-spacing must be optically tuned (e.g., `-0.03em` for bold headings).
  - Background remains pristine: flat matte ground (e.g., `#0A0A0B` or `#F7F7F8`) with zero distracting glow filters or artificial gradients.

### 3. Interactive Sandbox Hero
- **Structure**: The hero itself is an interactive playground where the user experiences the core utility before signing up (e.g., code editor, prompt runner, slider calculator, audio synth).
- **Ideal For**: Developer APIs, generative AI tools, design utilities, simulation engines.
- **Key Rules**:
  - The sandbox must be pre-populated with meaningful sample data so the user can interact with zero setup.
  - CTAs sit contextually adjacent to the sandbox: "Deploy this configuration" or "Export code".

### 4. Floating UI Island Hero
- **Structure**: Centered headline and CTA cluster surrounded by floating, calibrated UI widgets (metrics pills, activity cards, user avatars, status badges) positioned in 2.5D space.
- **Ideal For**: Collaboration software, community platforms, financial apps.
- **Key Rules**:
  - Floating cards must maintain subtle parallax on scroll or subtle ambient hover float.
  - On viewports below 1024px, collapse floating cards into a structured horizontal row beneath the headline to prevent overlapping text.

### 5. Ambient 3D / WebGL Canvas Hero
- **Structure**: Full-bleed background canvas hosting a responsive WebGL shader, interactive Spline 3D object, or particle field, overlaid with crisp typographic content.
- **Ideal For**: Web3, gaming, hardware showcases, high-end experiential marketing.
- **Key Rules**:
  - Text must sit on a calibrated scrim or contrast keyline to preserve WCAG AA legibility over moving canvas pixels.
  - Canvas framerate must throttle gracefully when idle or out of view to preserve battery life.

---

## 2. Bento Grid Geometry and Asymmetry (Bentogrids.com Patterns)

Bento grids organize multi-faceted product features into an engaging, cohesive mosaic.

### 12-Column Asymmetric Grid Layout
- Standardize on a 12-column CSS Grid (`grid-template-columns: repeat(12, 1fr)`) with consistent gutter gaps (16px to 24px).
- **Dominant Feature Card**: Allocate 7 or 8 columns (60 percent of grid width) to the primary capability card.
- **Secondary Cards**: Allocate remaining 4 or 5 columns to complementary capabilities.
- **Bottom Row**: Use three 4-column cards or two 6-column cards to establish grounded stability.

### Card Anatomy Rules
1. **Interactive Content Inside Cards**: Every bento card must contain a miniature UI component: live toggle, mini code snippet, animated graph, audio player, or keyboard shortcut simulator. Avoid cards that only contain an icon and text.
2. **Padding and Radius Consistency**: All cards within the grid must share identical border-radius (e.g., `rounded-2xl` or 16px) and internal padding (24px to 32px).
3. **Internal Hierarchy**:
   - Tag / Category micro-label (11px to 12px uppercase, tracking `+0.05em`).
   - Card headline (18px to 22px semibold).
   - Descriptive paragraph (14px, muted secondary color).
   - Live UI visualization (takes up 60 to 70 percent of card height).

### Responsive Collapsing Matrix
- **Desktop (>1024px)**: Full 12-column asymmetric bento mosaic.
- **Tablet (768px - 1023px)**: 2-column uniform layout (`grid-template-columns: repeat(2, 1fr)`), stretching dominant cards across both columns.
- **Mobile (<768px)**: Single column stack (`grid-template-columns: 1fr`), maintaining strict vertical reading order.

---

## 3. Navigation Systems (Navbar.gallery Archetypes)

Navigation must balance rapid wayfinding with minimal visual footprint:

### 1. The Floating Island Pill Navbar
- **Structure**: Centered floating capsule container (`border-radius: 9999px`) detached from the viewport edge with 16px to 24px top margin.
- **Styling**: Semi-translucent frosted glass (`backdrop-filter: blur(12px)`) with subtle 1px border keyline.
- **Content**: Logo on left, 3 to 4 core navigation links in center, single high-contrast CTA pill on right.

### 2. The Architectural Fixed Header
- **Structure**: Full-width header flush with viewport top (`top: 0; left: 0; width: 100%`).
- **Styling**: Solid background surface with 1px border bottom (`border-b border-border`). Transitions elevation shadow upon scroll.
- **Content**: Logo, mega-menu trigger links, global search bar (`Cmd + K`), user avatar / workspace switcher.

### 3. Split Navigation Bar
- **Structure**: Navigation links divided equally on the left and right sides of a centrally aligned brand wordmark.
- **Ideal For**: Fashion, editorial, and portfolio sites seeking classical symmetry.

### 4. Mobile Bottom Bar Dock
- **Structure**: Fixed bottom bar (`bottom: 0; left: 0; width: 100%`) elevated with safe-area-inset padding for mobile devices.
- **Content**: 4 to 5 ergonomic icon-plus-label tap targets positioned in the natural thumb zone.

---

## 4. Multi-Step Flow Patterns (Mobbin Reference Archetypes)

Complex user tasks require predictable, low-friction UX flow architecture:

### 1. Progressive Onboarding Flow
- **Pattern**: 3 to 4 sequential steps with persistent progress indicator at top.
- **Rules**:
  - Each step asks at most 1 to 2 questions.
  - Use large selectable card tiles (e.g., "What will you build?") rather than small dropdown menus.
  - Support instant keyboard navigation (press 1, 2, 3 or Enter to advance).
  - Allow users to skip optional steps with a clear secondary link.

### 2. Multi-Step Checkout / Verification Wizard
- **Pattern**: Left 65 percent column hosts current step form; right 35 percent column hosts sticky summary receipt (order details, total price, security badges).
- **Rules**:
  - Completed steps collapse into compact summary badges with an "Edit" button.
  - Step transitions slide smoothly horizontally (`transform: translateX()`) rather than triggering full page reloads.

### 3. Account Settings & Preferences Drawer
- **Pattern**: Master-detail layout. Left column hosts categorical tabs (Profile, Security, Billing, Notifications); right column displays active settings panel with inline save states.

---

## 5. Footer Systems (Footer.design Archetypes)

The footer serves as the safety net for navigation and the authoritative anchor of the domain:

### 1. The Multi-Column Architectural Directory
- **Structure**: 4 to 6 columns organized by domain category (Product, Resources, Company, Legal), anchored by a brand summary and status badge in column 1.
- **Bottom Row**: Copyright notice, system operational status pill (e.g., "All systems operational"), and theme toggle.

### 2. The Minimalist Stamp Footer
- **Structure**: Single horizontal row or 2-row compact layout featuring brand wordmark, social links, legal terms, and copyright.
- **Ideal For**: Portfolio sites, single-purpose utilities, focused landing pages.

### 3. The Newsletter / Conversion-Forward Footer
- **Structure**: Top half commands attention with an email newsletter subscription box or pre-footer CTA banner; bottom half provides essential navigation links.

### 4. High-Contrast Inverted Ground Footer
- **Structure**: If the main page uses a light ground (`#FFFFFF` or `#F9FAFB`), the footer transitions into deep dark slate (`#09090B`) with crisp light typography, creating a decisive visual period mark at the end of the scroll journey.

---

## 6. 404 Pages and Empty State Architecture (404s.design Archetypes)

Error and empty states are critical points of emotional recovery:

### 404 Not Found Page Anatomy
1. **Clear Statement**: State the error simply without technical jargon: "Page not found".
2. **Contextual Search**: Provide an inline search input with instant results to help the user locate what they were looking for.
3. **Direct Navigation Shortcuts**: Offer 3 to 4 primary escape routes (Go to Dashboard, View Documentation, Contact Support).
4. **Subtle Brand Personality**: An interactive micro-game, playful SVG illustration, or clever copy that diffuses frustration without obscuring navigation.

### Empty State (Zero-Data) Design
- When a table, inbox, or list contains zero items:
  - Never display a blank white rectangle.
  - Display an intentional empty illustration or icon.
  - Explain why it is empty: "No projects created yet".
  - Provide a single primary button to create the first item immediately.

---

## 7. Micro-Interactions and Delight (DesignSpells Patterns)

Subtle details that transform an interface from utilitarian to memorable:

### 1. Tactile Keypress and Button Physics
- Active button press: scale down to 0.98 with instantaneous transition (`transition: transform 50ms ease-out`), springing back to 1.0 on release.
- Copy-to-clipboard buttons: on click, transition icon from clipboard to checkmark, display a subtle "Copied!" tooltip, and trigger a soft 800Hz audio click via Web Audio API.

### 2. Contextual Focus Hints and Password Gauges
- As the user types into an input field, display real-time criteria chips (e.g., "8+ characters", "1 number", "1 symbol") that transition from muted gray to green as rules are satisfied.

### 3. Interactive Slider and Gauge Feedback
- Sliders that display an elevated floating numeric bubble following the thumb position during drag.
- Number inputs that support drag-to-scrub adjustments on their label (Figma and Blender style).

### 4. Whimsical Easter Eggs with Zero Utility Cost
- Confetti burst on checkout completion or project milestone achievement.
- Keyboard shortcut `?` that smoothly overlays an architectural shortcut cheat sheet.

---

## 8. Section Composition and Pacing (SectionMaster & Unsection Rules)

A landing page is a narrative composition. Pacing requires alternating tension and relief:

### Alternating Visual Density
- **Hero**: Moderate density, high visual impact, prominent focal CTA.
- **Social Proof / Logo Wall**: Low density, muted monochrome logos, calm rhythm.
- **Deep Feature Bento Grid**: High density, rich interactive micro-components, engaging scanning.
- **Editorial Quote / Testimonial**: Low density, large display quote, generous whitespace.
- **Pricing Matrix**: High density, structured comparative data, unambiguous selection.
- **Pre-Footer CTA**: Low density, focused single action, clean backdrop.
- **Footer**: High density, structured directory links.

### Seam Transitions Between Sections
- Avoid harsh horizontal divider lines across the entire page.
- Transition between sections using subtle surface color shifts (e.g., `#09090B` to `#121214`), angled polygon clips, or vertical spacing rhythm (80px to 120px padding gaps).
