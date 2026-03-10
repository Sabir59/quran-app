We are building Phase 1 of an AI Quran learning app.

For this phase, ONLY implement the “Strong Quran Reading Base”.
Do NOT build memorization AI, voice recording, tajweed correction, or advanced features yet.

--------------------------------------

OBJECTIVE
--------------------------------------

Build a complete Quran reading experience with:

- Multiple Mushaf styles (Indo-Pak and Uthmani)
- Translation support
- Ayah click-to-play audio
- Reciter selection
- Light / Dark mode
- Font size adjustment
- Bookmark system

--------------------------------------

TECH STACK (STRICT)
--------------------------------------

- Expo (TypeScript)
- Expo Router
- NativeWind for styling only
- TanStack Query for API fetching
- Existing reusable UI components
- Proper separation of layouts

--------------------------------------

FOLDER STRUCTURE
--------------------------------------

Screens must be inside:

/app
  /(main)
    quran.tsx          → Main Quran reading screen
    surah.tsx          → Surah view (list of ayahs)
    bookmarks.tsx      → Saved ayahs

Layouts:

- Use MainLayout for all Quran screens
- Wrap screen content in AppContainer (consistent padding/layout)

--------------------------------------

DATA SOURCE
--------------------------------------

Use one of the following:

Option 1 (Preferred):
AlQuran Cloud API
<https://alquran.cloud/api>

Must support:

- Uthmani edition
- IndoPak edition
- At least 1 translation
- Audio per ayah

OR structure it in a way that it can later switch to a self-hosted dataset.

--------------------------------------

WHAT TO BUILD
--------------------------------------

1. Surah List Screen

- List all 114 surahs
- Navigate to surah detail page

1. Surah Detail Screen

- Display ayahs
- Show Arabic text
- Show translation below
- Click ayah → play audio
- Long press → bookmark

1. Settings Panel (Basic)

- Toggle Mushaf style
- Select reciter
- Toggle translation on/off
- Adjust font size
- Light / Dark mode

1. Bookmark Screen

- Show saved ayahs
- Navigate back to original surah

--------------------------------------

ARCHITECTURE REQUIREMENTS
--------------------------------------

- Use TanStack Query for fetching Quran data
- Create proper API layer inside /src/api/quran
- Create hooks inside /src/hooks/api
- Do NOT put API calls directly in screens
- Use reusable components for:
  - AyahItem
  - SurahListItem
  - ReciterSelector
- Keep screens clean and future-ready

--------------------------------------

IMPORTANT
--------------------------------------

- No AI speech-to-text
- No memorization logic
- No tajweed correction
- No gamification
- No over-design

Keep UI minimal but scalable.
Focus on strong foundation.
