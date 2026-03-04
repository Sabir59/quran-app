I have an existing Expo React Native app built with TypeScript, NativeWind, and reusable React Native UI components. 
I want to scaffold the first few screens in a **future-ready, enterprise-friendly way**, strictly following our existing setup.

Please do the following:

1. Create the following screens inside the /app folder:
   - /(auth)/login.tsx
   - /(auth)/signup.tsx
   - /(main)/home.tsx

2. Strict requirements for all screens:

   - **Use NativeWind exclusively** for all styling; do NOT add custom inline styles or other CSS frameworks.
   - **Use React Native Reusable UI components** wherever possible (buttons, inputs, cards, text, etc.).
   - **Keep the app layout consistent**:
     - Define **one main container component** (e.g., `<AppContainer>`) with **consistent padding/margin and background**.
     - Wrap every screen’s content inside this container to enforce consistent spacing and layout.
   - Minimal layout: placeholders for inputs, buttons, and text.
   - Keep **theme (light/dark) functional**.
   - Navigation placeholders (buttons or links) to other screens.
   - Use **TypeScript**, with proper typing for props if needed.
   - Screens should be **future-ready**: easy to plug in API hooks, state management, or additional features later.

3. Folder structure:
   - /app/(auth)/login.tsx and signup.tsx
   - /app/(main)/home.tsx
   - /components → optional minimal reusable components if needed
   - Keep screens clean, minimal, and scalable.

4. At the end, provide a **summary** of:
   - The screens scaffolded
   - The main container component
   - How layout consistency is enforced across all screens