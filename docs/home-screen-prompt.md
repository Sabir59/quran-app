Build the Quran app Home screen exactly like the attached screenshot. The final result must be visually extremely close to the screenshot and functionally complete. Do not create a mock. Do not create a static demo. Build a real production-grade screen.

Goal:
Create a fully functional Home screen for the Alquran app using the existing project architecture and the already configured Alquran API integration. Every visible element on this screen must be functional. No fake data in the rendered UI. No static placeholder arrays in the screen component.

Primary objective:
- Match the screenshot as closely as possible
- Make all visible actions functional
- Use real API-driven or persisted data
- Keep code production-grade

Important:
The screenshot may show repeated/sample list entries visually, but the final implementation must render real data from the API and real user-driven state. Do not hardcode duplicate cards.

==================================================
SCREEN TO BUILD
==================================================

Build this Home screen with these sections, from top to bottom:

1. Hero / top section
- Teal/turquoise background
- Branded top area with:
  - left: app/logo area with Islamic badge icon and text “Alquran” and “Persis.co.id”
  - right: circular user/avatar button with initials “AY”
- Include the decorative Quran background image/overlay on the right side exactly like the screenshot feel
- Respect safe area top spacing
- Overall top section must visually match the screenshot closely

2. Production-grade search bar
- Large white rounded search input
- Placeholder text: “Pencarian surah dalam Alquran...”
- Purple search icon on the right
- Fully functional
- Search must be production-grade:
  - debounce input
  - trim whitespace
  - handle fast typing
  - support searching by surah number, Arabic name, transliteration, English/Indonesian title/translation if available in our data
  - support partial matches
  - support case-insensitive search
  - if the app already has backend search support, use it
  - if not, build efficient local search using cached metadata from API
  - show loading state during active search when needed
  - show empty state cleanly
  - clear results correctly when search is cleared
  - keyboard interaction must feel polished
  - tapping a result must navigate correctly
- The search field must not be a dummy filter slapped on top of static data

3. “Frequently Read” row
- White title text: “Frequently Read”
- Under it show rounded chips like the screenshot
- These chips must be functional, not static
- Use persisted user behavior to populate frequently read items when possible
- If no personal history exists yet, use a sensible fallback strategy that is still properly wired and can be replaced by user history after interaction
- Tapping a chip should navigate to the relevant content immediately
- Frequent items should update over time based on actual usage
- Keep visuals very close to screenshot

4. Mode/action button row
Create the row of action buttons exactly like the screenshot:
- “Surat” button (selected state by default)
- “Juz” button
- “Parah” button
- Right-most square outlined icon button

Behavior:
- These are not static pills; they must work
- Default selected mode: Surat
- Tapping Surat shows the Surah list
- Tapping Juz shows a Juz list view driven by actual data/API/config
- Tapping Parah shows a Parah/Para list view driven by actual data/API/config according to the project’s intended data model; do not change the visible label “Parah”
- The right-most icon button must open a real functional control, preferably a bottom sheet / modal / action sheet for sort/filter/view options, while keeping the icon/UI exactly as shown
- Suggested filter/sort actions:
  - sort by number ascending/descending
  - sort by title
  - filter by Makkiyah / Madaniyah if supported by available metadata
  - reset filters
- Keep this fully functional and production-grade

5. Main white content area
- Large rounded white sheet/container beginning below the hero area
- It should visually overlap the teal hero section like the screenshot
- Inside it render the active list based on the selected mode

6. Surah list cards
Each item card should visually match the screenshot:
- white card
- rounded corners
- soft shadow
- left starburst/badge with the surah number
- center text block:
  - primary title: transliterated surah name, bold
  - secondary inline subtitle in parentheses, lighter/italic/cyan-ish like screenshot
- metadata chips below:
  - revelation type chip, e.g. Makkiyah or Madaniyah
  - ayah count chip, e.g. “7 Ayat”
- right side: Arabic surah name
- Whole card tappable
- Navigate to the correct detail/reader screen on press

Data for Surah cards:
- Must come from the configured API/data layer
- Do not hardcode the list
- Properly map API fields into UI model
- Handle loading, failure, retry, and pull-to-refresh if suitable
- Use performant list rendering

7. Juz and Parah views
- These must be real, not placeholders
- When switched, the content area should render the correct list layout/data for that mode
- Keep the overall style language consistent with the screenshot
- If the project already has destination screens for Juz/Parah, wire navigation properly
- If missing, create the minimum production-grade list implementation needed so these modes are actually usable

8. Footer
- Teal footer area with the copyright text:
  “© 2023 Persis Software Labs, All Rights Reserved.”
- Social icons on the right like screenshot
- Icons must be functional:
  - open the correct social links if they already exist in config
  - if links are missing, define them in a proper config/constants location, not inline random strings in the JSX
- Footer must visually match screenshot closely

==================================================
VISUAL MATCH REQUIREMENTS
==================================================

Recreate the visual feel extremely closely:
- teal/turquoise main background
- purple accent color
- pale yellow selected tab/button state
- white cards and white search field
- rounded shapes
- soft shadows
- spacing and visual balance like the screenshot
- typography should closely match the screenshot’s feel
- Arabic text rendering must look clean and intentional
- use screenshot-informed color and spacing decisions, not generic defaults

Approximate palette guidance only if needed:
- teal/turquoise primary background near the screenshot tone
- purple accent near the screenshot search icon/button text tone
- pale yellow selected state near the screenshot selected “Surat” button
- light grey metadata chips
- white cards and white search input

But the screenshot itself is the main source of truth, so prioritize visual matching over these approximations.

==================================================
FUNCTIONAL REQUIREMENTS
==================================================

Everything visible must work:
- top avatar button
- search bar
- frequent read chips
- Surat / Juz / Parah buttons
- filter/sort icon button
- each list item card
- footer social icons

Search must be production-grade:
- debounced
- stable
- fast
- searchable across meaningful fields
- keyboard friendly
- error-safe
- empty-state aware

Frequent read must be real:
- update based on actual opens/reads
- persisted locally at minimum
- not fake static labels only

Lists must be real:
- API-backed or properly derived from API-backed cached data
- no hardcoded demo arrays in render

==================================================
ARCHITECTURE / CODE QUALITY REQUIREMENTS
==================================================

- Follow the existing project architecture exactly
- Reuse existing API client, hooks, navigation, theme, and components
- If new files are needed, place them in the correct structure
- If new hooks/selectors/services are needed, create them cleanly
- Keep logic out of presentational components where possible
- Use memoization where needed for long lists and filtered results
- Avoid unnecessary re-renders
- Handle stale requests / race conditions in search
- Handle offline/cache gracefully if the project already supports it
- Use strong types if the codebase uses TypeScript

==================================================
DELIVERABLE FORMAT
==================================================

I want implementation, not theory.

Please:
1. Inspect the existing app structure first
2. Implement the full screen
3. Add any missing API/service/helper files needed
4. Wire all interactions
5. Return the updated/created files in full
6. Briefly mention assumptions only if absolutely necessary

Do not give me pseudo-code.
Do not give me partial snippets unless a file truly did not need changes.
Do not simplify the UI.
Do not replace the requested design with your own interpretation.

Final acceptance criteria:
- The screen is visually very close to the screenshot
- No visible element is static-only
- Search is production-grade
- Frequent read is functional
- Surat/Juz/Parah switching is functional
- Card data is real
- Navigation works
- Footer links work
- Code is clean and production-ready