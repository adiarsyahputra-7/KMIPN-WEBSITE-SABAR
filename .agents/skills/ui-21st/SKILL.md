---
name: ui-21st
description: >-
  Use this skill whenever the user asks to build, style, redesign, or enhance UI components,
  landing pages, dashboards, cards, modals, or front-end elements with modern 21st.dev-inspired
  aesthetics, Tailwind CSS, micro-interactions, sleek dark/light styling, and polished UX.
---

# 21st.dev Modern UI & Component Design Skill

This skill enforces award-winning, state-of-the-art visual design standards inspired by 21st.dev, modern design systems (shadcn/ui, Aceternity, Radix, Tailwind), and top SaaS products.

---

## 1. Visual Aesthetics & Polish
- **Color Palette & Contrast**:
  - Avoid flat, harsh, or default saturated colors (no raw `red-500` or generic `blue-600` buttons).
  - Use curated neutral palettes: Zinc/Slate (`bg-zinc-950`, `bg-zinc-900`, `bg-zinc-900/50` for dark mode; `bg-zinc-50`, `bg-white` for light mode).
  - Use rich accent highlights: vibrant gradients or glows with tailored hues (e.g. Indigo `from-indigo-500 to-purple-600`, Emerald, Cyan, or Amber).
- **Subtle Borders & Glassmorphism**:
  - Use translucent borders: `border border-white/10` or `border-zinc-800` (dark mode) / `border-zinc-200/80` (light mode).
  - Frosted glass effects: `backdrop-blur-md bg-white/[0.03]` or `backdrop-blur-xl bg-zinc-900/60`.
  - Rounded corners: Modern, pill-like or generously rounded cards (`rounded-2xl` or `rounded-3xl`).
- **Depth, Shadows & Lighting**:
  - Layer depth using soft shadows and colored ambient glows (e.g. `shadow-2xl shadow-indigo-500/10` or inner highlights `shadow-inner`).
  - Subtle radial gradient background spots/blobs to give life to cards and headers.

---

## 2. Dynamic Interactivity & Micro-Animations
- **Hover & Active States**:
  - Every interactive element (buttons, cards, badges, list rows, tabs) must respond smoothly to user cursor movements.
  - Examples:
    - `transition-all duration-300 ease-out`
    - `hover:border-white/20 hover:bg-white/[0.06]`
    - `hover:-translate-y-1 hover:shadow-xl`
    - `active:scale-[0.98]`
- **Interactive Details**:
  - Subtle shine or shimmer effects on call-to-action buttons.
  - Smooth expansion/transitions for accordions and menus.
  - If Framer Motion or CSS keyframe animations are available, add graceful entrance transitions (`opacity`, `translateY`).

---

## 3. Typography & Spacing Hierarchy
- **Typography**:
  - Crisp hierarchy:
    - Eyebrow / Badges: `text-xs uppercase tracking-widest font-semibold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20`
    - Main Headings: `text-3xl sm:text-4xl font-extrabold tracking-tight text-white`
    - Body / Subtitles: `text-zinc-400 text-sm sm:text-base leading-relaxed`
- **Generous Spacing**:
  - Avoid cramped layouts. Give cards ample breathing space (`p-6 sm:p-8`).
  - Consistent gap layouts (`gap-4`, `gap-6`, `gap-8`).

---

## 4. Modern Icons & Component Anatomy
- **Icon Treatment**:
  - Prefer modern iconography (`lucide-react` or similar sleek SVGs).
  - Wrap icons in stylish containers: e.g., `p-2.5 rounded-xl bg-white/5 border border-white/10 text-indigo-400 shadow-sm`.
- **Badges & Tags**:
  - Pill badges with glowing dots:
    ```jsx
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
      Active
    </span>
    ```

---

## 5. Output Standards & Best Practices
- **Production-Ready**: Provide complete, fully-styled components without leaving empty placeholders.
- **Responsive**: Mobile-first design that seamlessly scales to tablets and large desktop screens.
- **Accessible**: Proper contrast ratios, semantic HTML, and intuitive focus rings (`focus:ring-2 focus:ring-indigo-500/40 focus:outline-none`).
