---
name: Kudo Financial System
colors:
  surface: '#faf9f5'
  surface-dim: '#dbdad6'
  surface-bright: '#faf9f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f4f0'
  surface-container: '#efeeea'
  surface-container-high: '#e9e8e4'
  surface-container-highest: '#e3e2df'
  on-surface: '#1b1c1a'
  on-surface-variant: '#43474c'
  inverse-surface: '#2f312e'
  inverse-on-surface: '#f2f1ed'
  outline: '#74777d'
  outline-variant: '#c3c7cc'
  surface-tint: '#4e6072'
  primary: '#021525'
  on-primary: '#ffffff'
  primary-container: '#172a3a'
  on-primary-container: '#7e91a5'
  inverse-primary: '#b5c9de'
  secondary: '#5f4dba'
  on-secondary: '#ffffff'
  secondary-container: '#9f8eff'
  on-secondary-container: '#341d8e'
  tertiary: '#320002'
  on-tertiary: '#ffffff'
  tertiary-container: '#590005'
  on-tertiary-container: '#e7685f'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d1e5fa'
  primary-fixed-dim: '#b5c9de'
  on-primary-fixed: '#091d2d'
  on-primary-fixed-variant: '#36495a'
  secondary-fixed: '#e5deff'
  secondary-fixed-dim: '#c9bfff'
  on-secondary-fixed: '#1a0063'
  on-secondary-fixed-variant: '#4733a1'
  tertiary-fixed: '#ffdad6'
  tertiary-fixed-dim: '#ffb3ac'
  on-tertiary-fixed: '#410003'
  on-tertiary-fixed-variant: '#86211e'
  background: '#faf9f5'
  on-background: '#1b1c1a'
  surface-variant: '#e3e2df'
  mint-success: '#62d2a2'
  yellow-warning: '#f4c95d'
  dark-bg: '#0f1720'
  dark-surface: '#172a3a'
  text-primary: '#172a3a'
  text-secondary: '#667085'
  text-muted: '#98a2b3'
  text-disabled: '#d0d5dd'
  border-light: '#eaecf0'
  surface-white: '#ffffff'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-lg-medium:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-md-medium:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.01em
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  caption-caps:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.06em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-mobile: 0.75rem
  margin: 1.5rem
  margin-mobile: 1rem
  space-2xs: 0.25rem
  space-xs: 0.5rem
  space-sm: 0.75rem
  space-md: 1rem
  space-lg: 1.25rem
  space-xl: 1.5rem
  space-2xl: 2rem
  space-3xl: 3rem
---

## Brand & Style

This design system delivers a personal finance experience designed specifically for young adults who need clarity, agency, and steady motivation over spreadsheets and clinical banking jargon. The interface synthesizes the clean utility of Notion, the dark fluid energy of Spotify, the polished restraint of premium fintech, and the approachable intelligence of a conversational AI companion.

The aesthetic blends **Modern Corporate Clarity** with **Curated Editorial Minimalism**. Rather than feeling like a rigid legacy bank or a fluorescent crypto casino, the interface exudes warmth, calm authority, and frictionless delight.

### Key Experiential Pillars
- **Radical Legibility:** Every balance, metric, and percentage is paired with human context (e.g., "You have Q2,850 left for this month" instead of raw arithmetic).
- **Intelligent Spark:** AI is embedded as an ambient layer via subtle lavender gradients and luminous spark icons (`✦`), functioning as a supportive partner rather than an intrusive chatbot.
- **Empowering Positivity:** Affirmations, soft micro-rewards, and progress markers validate good financial habits without passing judgment on spending spikes.

## Colors

The color architecture is built around intentional semantic functionalism, avoiding typical saturated banking greens in favor of an authoritative **Deep Navy** (`#172A3A`) anchored against an inviting **Warm White** (`#F8F7F3`).

### Color Allocation Roles
- **Deep Navy (`#172A3A`):** The primary brand backbone. Governs active headers, high-emphasis text, key surface backdrops in dark mode, and primary call-to-action fills.
- **Lavender (`#9B8AFB`):** The intelligent catalyst. Dedicated to AI interactions, proactive financial insights, interactive triggers, and conversational prompts.
- **Coral (`#FF7A70`):** The tertiary alert. Applied strictly to expenses, budget thresholds, attention badges, and destructive confirmations. Never used for decorative backgrounds.
- **Mint (`#62D2A2`):** Semantic positive. Represents income, accrued savings, completed milestones, and streaks.
- **Soft Yellow (`#F4C95D`):** Semantic cautionary. Highlights near-limit budgets, transaction anomalies, and actionable reminders.
- **Warm White (`#F8F7F3`):** Canvas background. Prevents sterile screen glare, introducing an editorial paper warmth.
- **Pure White (`#FFFFFF`):** Base surface for elevated cards, dialog sheets, and bottom sheets in light mode.

### Dark Mode Principles
When transitioning to dark mode:
- Canvas shifts to deep charcoal navy (`#0F1720`), while card containers take on `#172A3A`.
- High-contrast text transitions to `#F8F7F3`, and secondary copy rests at `#98A2B3`.
- Brand Lavender (`#9B8AFB`), Mint (`#62D2A2`), and Coral (`#FF7A70`) maintain optical parity to ensure charts and metrics remain instantly distinguishable.

## Typography

The typographic pairing provides deliberate structural tension: **Plus Jakarta Sans** delivers friendly, geometric confidence across numerical quantities, account balances, and key headers, while **Inter** ensures crystal-clear utility across dense financial statements, tabular data, and microcopy.

### Usage Guidance
- **Financial Figures & Metrics:** Always set primary values (e.g., account balances, large totals) in `Plus Jakarta Sans` with bold weights and tight negative tracking (`-0.02em`) to communicate precision and impact.
- **Editorial Headlines:** Use `headline-lg` and `headline-md` for personal greetings and dashboard segment labels.
- **Body & Insights:** All body narratives, explanatory copy, and conversational AI responses use `Inter` at `16px` or `14px` with a generous line-height (`1.5`) for maximum comfort during extended reading.
- **Overline Metadata:** Categorical tags, tracking badges, and micro-labels use `caption-caps` transformed to uppercase with elevated letter-spacing.

## Layout & Spacing

The layout adopts a flexible 4-column structure on mobile devices, transitioning to an 8-column layout on tablet, and a disciplined 12-column max-width container (`1180px`) on desktop viewports.

### Spacing Scale & Rhythm
- Base spacing operates on a continuous 4px/8px modular rhythm.
- **Screen Margins:** Standard mobile canvas maintains `16px` (`margin-mobile`), expanding to `24px` on desktop layouts.
- **Card Padding:** Primary interactive cards enforce internal padding of `20px` (`1.25rem`), balancing breathing room with information density.
- **Vertical Hierarchy:**
  - Grouped balance items: `space-xs` (8px).
  - List items inside an individual category: `space-sm` (12px).
  - Major dashboard sections: `space-2xl` (32px).

## Elevation & Depth

This system avoids muddy, heavy drop shadows in favor of **Tonal Layering**, **Crisp Hairline Boundaries**, and **Ambient Luminous Glows**.

### Depth Layers
1. **Level 0 (Base Canvas):** Flat Warm White (`#F8F7F3`) in light mode; Deep Charcoal Navy (`#0F1720`) in dark mode.
2. **Level 1 (Default Containers & Cards):** Surface White (`#FFFFFF`) framed by a hairline border: `1px solid #EAECF0`. Supported by an ultra-soft ambient shadow: `0px 2px 8px rgba(23, 42, 58, 0.04)`.
3. **Level 2 (Dropdowns, Active Modals, & Bottom Sheets):** Elevated surface with `0px 12px 32px rgba(23, 42, 58, 0.08)`.
4. **Level 3 (AI Intelligence Glow):** AI insights cards and active interaction nodes avoid dark drop-shadows altogether, utilizing a diffused tinted glow: `0px 8px 24px rgba(155, 138, 251, 0.20)` over an ethereal gradient border or backdrop fill.

## Shapes

The shape system employs an organic, human-friendly curvature that eliminates harsh digital corners while maintaining professional structural rigor.

### Scale Mapping
- **Corner Curvature Standard:** `roundedness: 2` (equivalent to base radius of 8px to 12px for micro elements, scaling upward systematically).
- **Standard Cards & Modals:** Defined strictly at `18px` (`rounded-lg` contextual treatment) to achieve the signature Finova surface appearance.
- **Primary Buttons & Form Inputs:** Set at `12px` (`space-sm` curve) for a tactile, responsive feel.
- **Avatars, Category Icons, & Badges:** Rounded to `999px` (full pill), creating harmonious contrast against large 18px rectangular enclosures.

## Components

### 1. Cards
- **Base Card:** Built with `#FFFFFF` (light mode) or `#172A3A` (dark mode), `18px` border radius, `20px` internal padding, bordered by `1px solid #EAECF0` (`#1F3447` dark).
- **Finova AI Card:** Employs a soft background tint using Lavender at 8% opacity with a subtle linear gradient border (`linear-gradient(135deg, #9B8AFB, #7C6FE8)`), displaying a `✦ Finova AI` badge in deep lavender.

### 2. Buttons
- **Primary Button:** Deep Navy (`#172A3A`) fill, text `#FFFFFF`, `12px` border radius, `14px 20px` padding, typography `body-md-medium`. Hover state: `#263F54`.
- **Secondary / Ghost Button:** Transparent background, `1px solid #EAECF0`, text `#172A3A`. Hover: background `#F8F7F3`.
- **AI Action Button:** Soft Lavender wash (`rgba(155, 138, 251, 0.15)`), text `#172A3A` (or `#F8F7F3` in dark mode), subtle `1px` lavender border.
- **Floating Action Button (FAB):** Central mobile circular or rounded-pill action (`#172A3A`), elevated with `0px 8px 20px rgba(23, 42, 58, 0.25)`.

### 3. Form Inputs & Selectors
- Background `#FFFFFF` with `1px solid #EAECF0`, `12px` radius, `12px 16px` padding.
- **Focus State:** `1px solid #172A3A` with a subtle focus ring `0 0 0 3px rgba(23, 42, 58, 0.10)`.
- **Financial Amount Input:** Clean text display with Plus Jakarta Sans `28px` bold, auto-resizing with active currency symbol affix (`Q`).

### 4. Progress Bars & Savings Widgets
- **Track:** 8px height, `999px` radius, background `#EAECF0`.
- **Fill:** Mint gradient (`linear-gradient(135deg, #62D2A2, #45B889)`) for positive savings and goals; Coral (`#FF7A70`) when reaching 90%+ of spend limits.
- **Indicator:** Numerical progress displayed alongside an encouraging contextual label (e.g., "71% — Only Q1,750 left!").

### 5. Transaction Rows
- Compact layout: Category icon enclosed in a `40px` circular pastel container, followed by title and category/timestamp stack on the left, and signed amount on the right (`-Q85.00` in `#172A3A` or `+Q2,500.00` in `#62D2A2`).

### 6. Mobile Bottom Navigation Bar
- Fixed at screen bottom: Frosted translucent surface (`backdrop-filter: blur(16px)`, background `rgba(255, 255, 255, 0.90)` light / `rgba(15, 23, 32, 0.90)` dark).
- 5 key destinations:
  1. **Inicio** (Dashboard overview)
  2. **Finanzas** (Deep analytics & ledger)
  3. **Añadir** (Central floating registration trigger)
  4. **Metas** (Targeted savings goals & streaks)
  5. **IA** (Finova AI assistant & advisory feed)
- Active state indicated via primary fill icon accompanied by a minimal 4px dot in Lavender (`#9B8AFB`).