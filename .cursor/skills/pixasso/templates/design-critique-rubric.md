# Pixasso Design Critique Rubric

Apply this rubric to systematically audit, grade, and elevate user interfaces, prototypes, or production codebases. Each category is evaluated on a 1 to 5 scale, concluding with an uncompromising diagnosis of the weakest link and prioritized remediations.

---

## 1. Evaluation Scorecard

### A. UX and Information Architecture (Weight: 25%)
- **Score (1-5)**: [ ]
- **Clarity of Purpose**: Is the core message understood within 3 seconds?
- **Hierarchy & Visual Flow**: Does the reading path align with user task priority?
- **Cognitive Load**: Is unnecessary complexity eliminated? Are complex workflows broken into digestible steps?
- **State Coverage**: Are empty states, loading skeletons, and error conditions thoughtfully designed?

### B. Visual Craft and Aesthetics (Weight: 25%)
- **Score (1-5)**: [ ]
- **Typographic Discipline**: Are font pairings harmonious? Are leading, tracking, and scale ratios mathematically consistent?
- **Spatial Rhythm**: Is spacing governed by a strict token scale (4/8/16/24/32/48/64px) without arbitrary margins?
- **Color Architecture**: Does the palette employ purposeful semantic tokens? Is visual hierarchy supported by tonal contrast?
- **Materiality & Surface**: Are borders, backgrounds, and elevations coherent across every panel and container?

### C. Interaction and Affordance (Weight: 20%)
- **Score (1-5)**: [ ]
- **Discoverability**: Are interactive targets immediately recognizable from static information cards?
- **Feedback Loops**: Do hover, active, focus, and selected states provide immediate, reassuring confirmation?
- **Ergonomics**: Are mobile touch targets at least 44x44 CSS pixels? Is layout comfortable for one-handed thumb interaction?

### D. Motion and Choreography (Weight: 15%)
- **Score (1-5)**: [ ]
- **Functional Intent**: Does motion communicate spatial orientation, state changes, or hierarchy?
- **Pacing & Easing**: Are durations calibrated (150ms to 350ms)? Is easing natural and consistent across the experience?
- **Accessibility**: Is `prefers-reduced-motion` honored without breaking functional content access?

### E. Technical & Performance Engineering (Weight: 15%)
- **Score (1-5)**: [ ]
- **Semantic Integrity**: Does markup employ correct HTML5 semantic tags with valid ARIA attributes?
- **Render Efficiency**: Are CSS animations restricted to compositor layers (`transform`, `opacity`)?
- **Hardware Footprint**: Are WebGL scenes, particle loops, and backdrop filters optimized to prevent thermal throttling?

---

## 2. Audit Output Format

```markdown
### Pixasso Critique Summary

**Overall Craft Score**: [X.X / 5.0]

#### Executive Verdict
[A concise summary diagnosing the core identity and execution quality of the design.]

#### The Weakest Link
[Identify the single design decision, component, or layout section that most severely undermines user trust or usability.]

#### Anti-Pattern Diagnosis
- Detected Cliché: [Name of generic pattern, e.g., Purple Gradient Hero, Icon Flooding]
- Why it hurts the project: [Detailed impact on user perception or usability]
- Stronger alternative: [Exact visual or structural replacement]

#### Prioritized Remediation Plan
1. **Immediate (High Impact, Low Effort)**: [Specific CSS token, typography, or spacing correction]
2. **Structural (Medium Effort)**: [Layout recomposition, component hierarchy adjustment]
3. **Advanced (Refinement)**: [Custom micro-interactions, responsive refinements, accessibility enhancements]
```
