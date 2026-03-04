I have an existing Expo React Native app built with TypeScript and NativeWind. 
I want to restructure it to an enterprise-ready architecture for a Quran learning app with AI pronunciation and memorization features. 

Please do NOT write any code yet, just adjust the folder structure and move existing files to match this structure:

1. /app → all screens, use Expo Router layouts
   /(auth): login.tsx, signup.tsx
   /(main): home.tsx, recitation.tsx, memorization.tsx, share.tsx
   /(settings): profile.tsx, preferences.tsx
   _layout.tsx → layout for tabs or navigation

2. /components → all reusable UI components

3. /hooks
   /api → all TanStack Query hooks (e.g., useUser, useAyahs)
   other hooks like useTheme, useAudioPlayer

4. /api → API layer
   /config → createApiClient.ts, clients.ts (quranClient, usersClient, aiClient)
   /quran → ayahs.ts, reciters.ts
   /user → profile.ts
   /ai → feedback.ts

5. /services → business logic and helper functions

6. /types → TypeScript type definitions

7. /utils → constants, helpers, validation

8. /assets → fonts, images, audio

Also, update all import paths in the project so that they reflect the new folder structure. 
Ensure that TanStack Query hooks now import from the new /api clients.
Maintain TypeScript types and NativeWind styles.
Provide a summary of the new folder structure at the end.