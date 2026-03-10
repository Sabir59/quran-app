You are a senior React Native + Expo + NativeWind engineer working inside an existing production codebase that already uses react-native-reusable-ui and has an established API architecture. I need you to build a pixel-faithful Register screen from the attached design screenshot.

IMPORTANT:
The attached screenshot is the visual source of truth. The final screen must match it as closely as possible in layout, proportions, spacing, colors, typography feel, icon placement, curvature, and overall visual balance. Do not redesign it. Do not “improve” the UI. Recreate it faithfully and production-ready.

==================================================
PROJECT / STACK CONTEXT
==================================================

Tech stack:
- Expo React Native
- NativeWind
- react-native-reusable-ui
- Existing shared components in `components/ui`
- Our custom app-level components should live in `components/lib-ui`
- Future backend auth will be NestJS-based
- All API calls must go through our existing API architecture and conventions that already exist in the project
- Avoid custom inline styles as much as possible
- Avoid editing existing files inside `components/ui` directly
- Any custom reusable component must be created in `components/lib-ui`

==================================================
CRITICAL ARCHITECTURE RULES
==================================================

1. DO NOT directly modify `components/ui/*`.
2. If you need a custom input, button, field wrapper, etc:
   - start from the relevant base reusable component from `components/ui`
   - create a custom version in `components/lib-ui`
   - example:
     - base source: `components/ui/input.tsx`
     - custom wrapper/adapted component: `components/lib-ui/form-input.tsx`
3. Keep the implementation future-flexible and scalable.
4. Separate screen composition from low-level reusable pieces.
5. The screen must be ready for future NestJS auth integration, but authentication does NOT need to be functional right now.
6. Do not bypass our existing API architecture with direct fetch/axios shortcuts.
7. Keep code production-grade, clean, typed, and maintainable.
8. Prefer composition over duplication.

==================================================
STYLING / LAYOUT RULES
==================================================

This is extremely important for our codebase:

- Avoid margins as much as possible.
- Avoid Tailwind `space-x-*` and `space-y-*` classes as much as possible.
- Prefer flex-based layout structure.
- Prefer padding, wrapper containers, justify/alignment, and controlled heights/widths.
- Use NativeWind classes as much as possible.
- Avoid custom styles unless absolutely necessary for something like the curved top shape or image overlay behavior.
- Any unavoidable style should be minimal and justified.
- Use our reusable UI components as the base for buttons/inputs.
- Keep the code React Native friendly, not web-first.
- Make sure the implementation works cleanly with Expo + NativeWind.

==================================================
DESIGN GOAL
==================================================

Build a Register screen that visually matches the screenshot 100%.

Screen structure from top to bottom:

1. A top hero/header area:
   - teal/turquoise background
   - curved bottom edge / large rounded wave-like bottom shape
   - Quran image positioned at the top-right area, partially cropped
   - white logo + app name text over the hero area:
     - “Alquran”
     - “Persis.co.id”
   - overall feel: calm, soft, rounded, Islamic app branding

2. Main content area below hero:
   - light background, almost white / very light gray
   - left-aligned title:
     - “Register”
   - subtitle below:
     - “Start your day by reading the holy Quran verses.”
   - subtitle is smaller and muted gray

3. Form area:
   - 4 stacked input fields:
     - Full Name
     - E-Mail
     - Enter Password
     - Confirm Password
   - each field has:
     - light border
     - rounded corners
     - clean white background
     - placeholder text in muted gray
     - right-side icon
   - icons:
     - Full Name => user/profile icon
     - E-Mail => mail icon
     - Password => eye icon
     - Confirm Password => eye icon
   - password fields should support secure text entry and visibility toggle structure

4. Primary CTA button:
   - large full-width rounded teal button
   - centered white text:
     - “Register”

5. Bottom auth text:
   - centered line:
     - “Don’t have an account Login”
   - NOTE: even if this copy feels logically odd for a register page, keep the text exactly like the design unless I later ask to change it
   - “Login” should be highlighted like a link

6. Footer:
   - centered copyright text in teal:
     - “© 2023 Persis Software Labs, All Rights Reserved.”
   - social icons row centered below:
     - LinkedIn
     - Facebook
     - Instagram
     - X
   - icons should be evenly spaced and visually light

==================================================
VISUAL DETAILS TO MATCH
==================================================

Please match these characteristics carefully:

- Mobile-first layout matching the screenshot proportions
- Soft rounded aesthetic
- Minimal clean Islamic app style
- Teal primary color close to the screenshot
- Dark heading text
- Muted gray body text
- Thin light gray borders on inputs
- Inputs and button should feel evenly sized and aligned
- Horizontal padding should feel consistent across the form
- Top hero section should have strong visual similarity to the screenshot
- The image crop and logo placement must feel extremely close to the screenshot
- The bottom content should feel centered and balanced vertically
- The register button height, corner radius, and width should match the screenshot feel
- Footer content should sit near the bottom but still be safe-area aware

==================================================
FUNCTIONAL REQUIREMENTS
==================================================

Auth does not need to be fully implemented, but the screen must be ready for real auth later.

Implement:
- controlled form state
- proper TypeScript types/interfaces
- validation-ready structure
- future submit integration point
- password visibility toggles
- confirm password matching validation structure
- keyboard-aware behavior
- safe-area support
- scroll-safe behavior for smaller devices
- clean loading state structure for submit button
- clean error message structure for future API response integration

Do NOT hardwire fake backend logic in a messy way.
Instead, create a clean placeholder integration boundary.

==================================================
FUTURE NESTJS AUTH READINESS
==================================================

The screen should be adaptable to a future NestJS auth API.

Prepare the architecture so later we can connect something like:
- name
- email
- password

Recommended approach:
- `confirmPassword` remains local validation only
- final payload builder can prepare a clean DTO shape for future backend usage
- add a clear integration point / TODO where submit would call our existing API layer
- do not directly call fetch inside the screen

If our project already has auth hooks/services/query architecture, follow that pattern.
If not yet wired, scaffold the submit handler cleanly so later it can plug into that architecture with minimal changes.

==================================================
COMPONENTIZATION REQUIREMENTS
==================================================

Create separate components. Do not make a huge monolithic screen file.

Suggested structure:

- `app/.../register.tsx` or the project’s correct route/screen entry
- `components/lib-ui/auth/auth-header.tsx`
- `components/lib-ui/auth/form-input.tsx`
- `components/lib-ui/auth/auth-submit-button.tsx`
- `components/lib-ui/auth/auth-footer.tsx`
- `components/lib-ui/auth/social-icon-button.tsx`
- `components/lib-ui/auth/register-form.tsx`
- optionally:
  - `hooks/use-register-form.ts`
  - `types/auth.ts`
  - `constants/auth-ui.ts`

Use these only as guidance; adapt to the project structure if needed.
But the main goal is:
- isolated
- reusable
- flexible
- easy to maintain

==================================================
INPUT COMPONENT RULES
==================================================

For custom form inputs:

- base them on our reusable UI input patterns
- do not edit `components/ui/input.tsx` directly
- if needed, wrap or extend it into `components/lib-ui/form-input.tsx`
- support:
  - label-less design for this screen
  - placeholder
  - right icon
  - secure entry toggle
  - error display area
  - disabled state
  - consistent height and padding
- keep styling centralized and reusable

==================================================
BUTTON COMPONENT RULES
==================================================

For the register button:

- base it on our reusable UI button pattern
- do not edit the original ui button directly
- create a custom auth-oriented button in `components/lib-ui`
- support:
  - normal state
  - loading state
  - disabled state
- match the screenshot visually

==================================================
IMPLEMENTATION QUALITY
==================================================

Production expectations:

- TypeScript only
- no dead code
- no duplicated styling logic
- no random magic numbers without meaning
- extract repeated values when appropriate
- maintain readable className usage
- preserve scalability for future auth flows like login / forgot password / reset password
- avoid fragile layout hacks
- do not rely on large margin stacks for spacing
- keep the screen accessible:
  - touchable hit targets
  - keyboard behavior
  - semantic naming
  - screen-reader friendly button/input props where practical

==================================================
ICONS / ASSETS
==================================================

- Use the project’s current icon system if one already exists
- If needed, use the standard icon package already present in the project
- Keep icon stroke weight and sizing visually close to screenshot
- For the hero image/logo:
  - if the exact assets already exist in the project, use them
  - if not, create a clear placeholder asset contract so they can be replaced easily
- Do not hardcode unmaintainable image logic

==================================================
DO NOT DO THESE
==================================================

- Do not redesign the screen
- Do not introduce a web-only solution
- Do not put everything in one file
- Do not edit `components/ui` directly
- Do not use lots of `mt-*`, `mb-*`, or `space-y-*`
- Do not bypass existing API architecture
- Do not make the code “demo quality”
- Do not use heavy custom styles if NativeWind/flex-based composition can handle it
- Do not leave the form impossible to integrate later
- Do not use poor naming like `Input2`, `NewButton`, etc.

==================================================
WHAT I WANT IN YOUR OUTPUT
==================================================

Please provide:

1. A brief implementation plan
2. The file structure you chose
3. Full code for every created/updated file
4. Any small notes for where future NestJS auth integration will plug in
5. Any assumptions clearly stated
6. Keep the code ready to paste into a real production codebase

If a base reusable component must be wrapped, show that clearly.
If you need to make small assumptions about route structure or imports, do so consistently and explain them.

Again: the screenshot is the source of truth. Match it as closely as possible.