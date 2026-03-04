IMPORTANT – READ FIRST

This project is already in progress.

Before creating or modifying anything:

1. Analyze the existing folder structure.
2. Check existing layouts, components, hooks, and API layers.
3. DO NOT introduce duplicate folders.
4. DO NOT create new root-level directories if similar ones already exist.
5. DO NOT replace existing architecture unless explicitly told.
6. If something already exists, extend it instead of recreating it.
7. If you are unsure whether something exists, ask first before generating code.

We are following a strict architecture:

- /app → Expo Router screens
- /src → business logic
- /src/api → API layer
- /src/hooks → TanStack Query hooks
- /src/components → reusable UI
- Layout separation per feature (AuthLayout, MainLayout)
- AppContainer enforces consistent padding/layout

If something conflicts with the existing structure, adapt to it instead of redefining it.

Now proceed with the requested feature.
