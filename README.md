<p align="center">
  <img src="assets/images/logo.png" width="96" height="96" alt="NutriTrack logo: two green leaves" />
</p>

# NutriTrack

**Small steps. Every day.** A food-tracking app for recording meals, reviewing daily intake, and managing personal targets.

This is a **frontend-only MVP** built with React Native and Expo Dev Client. There is no login, Supabase, or backend. Your name, targets, foods, favorites, and diary are stored on the device with AsyncStorage. The interface is in English and uses a light theme.

[Figma design](https://www.figma.com/design/ypPFuD7Ldwf1VYIZo0DuED) · [Engineering contract](docs/MOBILE_ENGINEERING.md) · [Implementation status](docs/IMPLEMENTATION_STATUS.md)

## Features

| Area | Implemented behavior |
| --- | --- |
| Welcome | Start without an account; onboarding completion is saved locally |
| Today | Empty first-use diary, date navigation, calories and macros derived from entries |
| Search | Search example foods and your own foods by name |
| Food creation | Save a name, an explicit serving description, and nutrition per serving |
| Food library | Favorites, My foods, and All foods filters |
| Favorites | Add or remove a food from favorites in its details screen |
| Logging | Set a serving quantity and choose Breakfast, Lunch, Dinner, or Snack |
| Confirmation | Show success only after storage confirms the write |
| Meal editing | Change quantity and meal type using the stored nutrition snapshot |
| Deletion and undo | Confirm deletion; restore the most recently deleted entry, including after reopening |
| History | Week/month selection, period navigation, energy chart, exact daily values, and averages |
| Settings | Optional local name and editable calorie/macro targets |
| States | Loading, empty results, read/write errors, retry, and duplicate-submission protection |

**Main flow:** Welcome → Today → Log food → Food details → Meal added → updated diary.

Create a food from Search or Foods. Once saved, its details open so it can be logged or added to favorites. The serving description is the nutrition basis: for example, values for “100 g” are multiplied by the selected number of servings. There is no implicit conversion between grams, milliliters, cups, or bowls.

The example catalog contains Oatmeal with berries, Grilled chicken salad, and Rolled oats. These foods are labeled as examples and are not a validated nutrition database. Custom foods are labeled separately and use the values you enter. No fictional meals are inserted into the diary. Initial targets are editable examples, not nutritional recommendations.

Undo retains **one most recent deletion**. Deleting another meal replaces the previous undo slot. Restoring clears the slot and does not duplicate the entry. Meal editing preserves the record ID, selected diary date, creation time, and food snapshot.

Barcode scanning, recipes, cloud synchronization, remote backup, notifications, and authentication are outside this MVP. Editing/deleting custom catalog foods is not implemented.

## Design and reference screens

The visual direction consists of **13 mobile frames at 390 × 844**, imported into Figma with editable text and vector shapes. Page: `0:1`; board: `2:11`.

**The images below are local references used for the Figma design, not screenshots of the running app.** They represent direction 01 from September 22, 2026. Native visual comparison remains pending.

The Figma file is an initial design pass, not a complete component library or connected prototype. Some Auto Layout work and full visual QA remain unfinished. Remote access during implementation was blocked by the Starter MCP limit. The Today progress arc was corrected in Figma and may differ from the older SVG. See [FIGMA-STATUS.md](design/FIGMA-STATUS.md).

### Welcome and diary

| Welcome · `5:3` | Today · `3:2` | Log food · `5:40` |
| :---: | :---: | :---: |
| <img src="design/screens/01-welcome.svg" width="230" alt="Welcome reference with logo and Start tracking button" /> | <img src="design/screens/02-today.svg" width="230" alt="Today reference with intake, macros, and meals" /> | <img src="design/screens/03-search.svg" width="230" alt="Food search reference" /> |

### Details and history

| Food details · `5:105` | Meal details · `5:152` | History · `5:192` |
| :---: | :---: | :---: |
| <img src="design/screens/04-food-detail.svg" width="230" alt="Food details and serving selection reference" /> | <img src="design/screens/05-meal-detail.svg" width="230" alt="Logged meal details reference" /> | <img src="design/screens/06-history.svg" width="230" alt="Weekly energy chart reference" /> |

### Library and preferences

| Foods · `5:254` | Settings · `5:320` | Daily targets · `5:386` |
| :---: | :---: | :---: |
| <img src="design/screens/07-foods.svg" width="230" alt="Personal food library reference" /> | <img src="design/screens/08-settings.svg" width="230" alt="Settings reference" /> | <img src="design/screens/09-targets.svg" width="230" alt="Daily targets reference" /> |

### Interface states

| Loading · `5:426` | Empty day · `5:469` | Connection error · `5:514` |
| :---: | :---: | :---: |
| <img src="design/screens/10-loading.svg" width="230" alt="Loading skeleton reference" /> | <img src="design/screens/11-empty.svg" width="230" alt="Empty diary reference" /> | <img src="design/screens/12-error.svg" width="230" alt="Recoverable error reference" /> |

<img src="design/screens/13-success.svg" width="230" alt="Meal added confirmation reference" />

**Meal added · `5:540`.** Loading, empty, error, and success are flow states rather than four independent public routes. The MVP handles local storage failures, not a simulated backend connection error.

The create-food form has no dedicated local Figma frame. It reuses the existing field, button, typography, and spacing foundations. Custom foods use the existing food icon rather than an invented illustration. Native visual review of this extension is pending.

### Visual identity

| Element | Reference |
| --- | --- |
| Font | Inter Regular 400, Medium 500, SemiBold 600, and Bold 700 |
| Canvas | `#F7F8F3` |
| Primary text / dark surface | `#20292D` |
| Secondary text | `#667078` |
| Primary action / progress | `#DEFA64` |
| Subtle surface | `#EEF5D8` |
| Dividers | `#E3E7DF` |
| Cards | `#FFFFFF` |
| Spacing | 4, 8, 12, 16, 20, 24, and 32 |
| Corner radii | Controls 12, cards 20, hero 24; primary button 17 |
| Primary button | Minimum height 54 |
| Layout | Flexbox, scrolling, real safe areas; the reference frame is not a fixed app size |

Base tokens live in [design/tokens.json](design/tokens.json), with runtime mappings in [src/design-system/tokens/index.ts](src/design-system/tokens/index.ts). Inverse colors `#BCC5CB` and `#455054` match the local Today SVG and await remote confirmation.

To view the local review board:

```bash
node design/serve.cjs
```

Open **http://127.0.0.1:4173**. This server displays the design references only; it does not run the app.

## Technology stack

Versions below are declared in [package.json](package.json). [package-lock.json](package-lock.json) records the resolved dependency tree.

| Layer | Technology | Purpose |
| --- | --- | --- |
| Platform | Expo `~57.0.24` | SDK, configuration, and builds |
| Native app | React Native `0.86.3` | Android and iOS |
| UI | React `19.2.3` | Components, hooks, and Context |
| Language | TypeScript `~6.0.3` | Strict types, noUncheckedIndexedAccess, and `@/` alias |
| Navigation | Expo Router `~57.0.22` | File-based routes, stack, and tabs |
| Development | expo-dev-client `~57.0.19` | Development Build runtime |
| Styling | StyleSheet and shared tokens | Project components; no NativeWind or product UI kit |
| Persistence | AsyncStorage `2.2.0` | Versioned local document |
| Vectors | react-native-svg `15.15.4` | Icons, illustrations, progress, and history chart |
| Typography | expo-font and @expo-google-fonts/inter | Four real font-weight files |
| Native layout | safe-area-context and screens | Insets and native navigation |
| Expo integration | constants, linking, crypto | Configuration, links, and record IDs |
| Appearance | splash-screen, status-bar, system-ui | Splash, system bars, and light theme |
| Router ecosystem | React DOM, Reanimated, Worklets | Dependencies aligned with the SDK |
| Testing | Jest 29, jest-expo, Testing Library | Domain, repository, hooks, and flows |
| Quality | ESLint, eslint-config-expo, Prettier, Expo Doctor | Static analysis and compatibility |
| Asset tooling | Sharp `0.35.4` | Development-only SVG-to-PNG conversion |
| Automation | GitHub Actions and EAS | CI and build profiles |

React DOM does not mean a web product has been validated. The target is the native app with Dev Client. Reanimated and Worklets do not add product animations in this version.

## Running the app

### Prerequisites

- **Node.js 24** and npm.
- A device or emulator with a compatible Development Build.
- For local Android builds: Android Studio, Android SDK, and a compatible JDK. The recorded build used Android Studio's **JBR 21**.
- For local iOS builds: macOS and Xcode. On Windows, use EAS with the applicable Apple account/signing requirements.

No `.env`, Supabase credentials, or backend setup is required. An EAS account is for development and is not an app-user login.

### Install dependencies

From the project directory:

```bash
npm ci
```

### Build and install Android locally

Start an emulator or connect a device with USB debugging authorized:

```bash
npm run android
```

To select a device:

```bash
npm run android -- --device
```

If the default Java installation is incompatible, use Android Studio's JBR in PowerShell, adjusting the path if necessary:

```powershell
$env:JAVA_HOME = 'C:\Program Files\Android\Android Studio\jbr'
npm.cmd run android
```

The script runs `expo run:android`, generates the native project when needed, compiles it, and installs the client.

### Start Metro

With the client already installed:

```bash
npm start
```

This runs `expo start --dev-client`. Open NutriTrack and connect to the server shown in the terminal. For a LAN connection, the device and computer must be on the same network and able to reach the server.

If PowerShell blocks `npm.ps1` or `npx.ps1`, use `npm.cmd` and `npx.cmd`.

### Run iOS locally

On a configured Mac:

```bash
npm run ios
```

iOS validation remains pending. **Expo Go is not this project's validation target.**

### Existing local APK

The initial implementation generated `artifacts/nutritrack-development-arm64.apk`. It may exist in the original workspace, but it is not included in a clone because binaries and `artifacts/` are ignored.

This is an **Android arm64 Development Build** and needs Metro. It is not a standalone preview APK. The current feature changes are JavaScript/TypeScript changes and introduce no new native dependencies; use Metro to load the updated code into the compatible client.

## EAS builds

The development profile exists in [eas.json](eas.json). To build Android in the cloud:

```bash
npx eas-cli@latest login
npx eas-cli@latest build --platform android --profile development
```

After installing the build:

```bash
npm start
```

For iOS:

```bash
npx eas-cli@latest build --platform ios --profile development
```

The current profile does not set `ios.simulator: true`; do not assume it creates a simulator build.

| Profile | Configuration | Purpose |
| --- | --- | --- |
| development | developmentClient, internal distribution | Development with Metro |
| preview | Internal distribution | Review build; not yet validated |
| production | autoIncrement | Production build; does not automatically publish to stores |

To request a standalone Android review build using the existing preview profile:

```bash
npx eas-cli@latest build --platform android --profile preview
```

Local configuration in [app.config.ts](app.config.ts) and [eas.json](eas.json):

| Setting | Value |
| --- | --- |
| Project | `@igorvtermions/nutritrack` |
| EAS project ID | `325a6cb0-11e9-4349-a7fa-94d25a6c2d5e` |
| Android package / iOS bundle identifier | `com.nutritrack.prototype` |
| Scheme | `nutritrack` |
| Build numbering | `cli.appVersionSource: remote` |

You need access to the configured EAS project. These are prototype identifiers, not approved final publishing identifiers.

Because the Expo configuration is dynamic, the link is declared in `extra.eas.projectId` inside the object exported by `app.config.ts`. Do not wrap that object in another `expo` key.

### When to rebuild

JavaScript/TypeScript changes normally use Metro. Native dependencies, config plugins, and native configuration changes require a new client build. To explicitly regenerate Android:

```bash
npx expo prebuild --platform android --no-install
npm run android
```

The project uses **Expo Continuous Native Generation**. `android/` and `ios/` are generated and ignored. Keep configuration in `app.config.ts`/plugins, preserve existing manual changes, and do not use `prebuild --clean` as an automatic troubleshooting step.

### Troubleshooting

| Symptom | Check |
| --- | --- |
| EAS cannot write dynamic configuration | Check extra.eas.projectId and owner in app.config.ts |
| No device found | Start an AVD or connect a device with USB debugging authorized |
| Java/Gradle error | Check JAVA_HOME and JDK compatibility |
| App cannot reach Metro | Run npm start and check the address/network |
| Missing native module after installing a package | Build and install a new Dev Client |
| Saved data cannot be loaded | Use retry; invalid data is not silently overwritten |
| Missing splash logo | Check assets/images/logo.png and the splash plugin configuration |

## Scripts and quality

| Command | Action |
| --- | --- |
| `npm start` | Metro in Dev Client mode |
| `npm run android` | Compile and run Android |
| `npm run ios` | Compile and run iOS |
| `npm run typecheck` | TypeScript without emission |
| `npm run lint` | ESLint, hooks, and import restrictions |
| `npm run format:check` | Check formatting |
| `npm run format` | Apply Prettier |
| `npm test -- --ci` | Run tests serially |
| `npm run doctor` | Expo configuration and dependency checks |

[CI](.github/workflows/quality.yml) runs on pushes and pull requests: it installs from the lockfile and checks types, lint, formatting, and tests. Expo Doctor is separate and may require network access.

Tests cover nutrition calculations, local dates, migration, serialized storage, failed writes, search, duplicate prevention, food creation, favorites, meal editing, undo, and history periods. Storage adapters are simulated in tests; this does not replace reopening the app on a device with real AsyncStorage.

## Project structure

```text
.github/workflows/quality.yml   Quality CI
assets/images/logo.png         Splash and README logo
design/
  screens/                     13 SVG references
  icons/                       Original icons
  tokens.json                  Base design tokens
  00-foundations.svg           Visual foundations
  screen-map.json              Flow notes
  FIGMA-STATUS.md               Figma status
  index.html                   Local review board
  serve.cjs                    Review server
  build.cjs                    Design artifact generator
docs/
  MOBILE_ENGINEERING.md        Engineering contract
  IMPLEMENTATION_STATUS.md     Evidence and pending work
  decisions/                   Local storage and schema decisions
scripts/
  extract-design-assets.cjs    Extract vectors and generate the logo PNG
src/
  app/                         Expo Router routes and layouts
  bootstrap/                   Providers, hydration, dependency composition
  data/
    fixtures/                  Example food catalog
    repositories/              Local persistence and migration
  design-system/
    components/                Text, buttons, fields, screens, choices, errors
    icons/                     Extracted assets and SVG wrapper
    tokens/                    Colors, typography, spacing, radii
  domain/nutrition/             Pure types and calculations
  features/
    onboarding/                Welcome
    diary/                     Diary, editing, deletion, undo, repository contract
    food-catalog/              Search, custom foods, favorites, logging
    history/                   Week/month summaries and energy chart
    settings/                  Name and targets
  shared/
    date/                      Local calendar dates
    hooks/                     Submission control
AGENTS.md                      Repository working rules
app.config.ts                  Expo configuration and EAS link
eas.json                       Build profiles
eslint.config.js               Static analysis
jest.config.js                 Test configuration
tsconfig.json                  TypeScript and path alias
package.json                   Dependencies and scripts
package-lock.json              Resolved dependency versions
.gitignore                     Version-control exclusions
.prettierignore                 Formatting exclusions
.prettierrc.json                Formatting preferences
```

Tests live next to the code in `.test.ts`/`.test.tsx` files. Generated native projects, `.expo/`, builds, logs, caches, local environment files, and signing credentials are ignored. Source code, assets, design references, documentation, and the lockfile remain versioned.

### Routes and architecture

| Route file | Responsibility |
| --- | --- |
| src/app/_layout.tsx | Fonts, splash, provider, root stack |
| src/app/index.tsx | Welcome or redirect after hydration |
| src/app/(tabs)/_layout.tsx | Today, History, Foods, Settings |
| src/app/food/search.tsx | Search while preserving the selected diary date |
| src/app/food/create.tsx | Create a food, then open its details |
| src/app/food/[foodId].tsx | Food details and logging |
| src/app/meal/[entryId].tsx | Meal details, inline editor, deletion, undo |
| src/app/targets.tsx | Target editing |

Routes are thin adapters. Screens use hooks/context, pure domain rules, and repository contracts. Visual components do not access AsyncStorage, SQL, or HTTP directly. Bootstrap connects the concrete repository to the app.

## Local data and domain rules

[LocalDiaryRepository](src/data/repositories/LocalDiaryRepository.ts) stores JSON under **`nutritrack:diary:v1`**. The key stays unchanged for existing installations; the document schema is now **version 2**.

| Field | Content |
| --- | --- |
| version | Document schema version, currently 2 |
| onboarded | Whether Welcome has been completed |
| name | Optional local name |
| targets | Calories, protein, carbs, and fat |
| entries | Logged meals |
| customFoods | User-created foods with nutrition per explicit serving |
| favoriteIds | IDs of favorite foods |
| deletedEntry | Most recently deleted meal, or null |

A valid version-1 document is migrated in memory by adding empty custom-food/favorite collections and a null undo slot. The migrated document is written on the next successful mutation. Reads never erase or rewrite stored data. Unknown versions and malformed documents produce a recoverable error.

Each meal stores an ID, food reference, description, serving, quantity, meal type, local diary date, creation timestamp, illustration, and **consumed nutrition snapshot**. Editing quantity derives the new amount from that snapshot rather than the current catalog.

- Mutations are serialized to avoid lost concurrent updates.
- Success is shown only after persistence succeeds.
- Failed writes preserve confirmed state and allow retry.
- Quantities must be finite, positive, and at most 1,000 servings.
- Custom food nutrients must be finite and between 0 and 100,000 per serving.
- Nutrients and targets cannot be negative.
- Scaling and totals do not round intermediate values.
- Only the visual progress arc is clamped; text reports intake above target.
- Diary dates are local calendar dates, separate from creation timestamps.
- Weeks start on Monday; months use their actual calendar length.
- Averages include past days with entries, including explicitly logged zero, and exclude today, future days, and missing days.

AsyncStorage provides local persistence without its own encryption. No remote backup or sync is implemented. Uninstalling the app or clearing its data may remove the diary. Do not store credentials in this document.

## Assets and engineering conventions

Before changing code, read [AGENTS.md](AGENTS.md) and [MOBILE_ENGINEERING.md](docs/MOBILE_ENGINEERING.md). For UI, also consult [FIGMA-STATUS.md](design/FIGMA-STATUS.md), tokens, and the relevant SVG.

- Preserve visual identity, icons, and illustrations; never render an entire screen as an image.
- Reuse tokens/components and separate presentation, domain, and persistence.
- Keep strict TypeScript; do not hide failures with any or suppression comments.
- Handle keyboard, safe areas, scrolling, larger text, and accessibility.
- Implement real actions, recoverable errors, and duplicate protection.
- Do not introduce backend services or authentication without a new scope decision.
- Keep this README in English. Engineering decision documents may remain in Portuguese.

To regenerate assets:

```bash
node scripts/extract-design-assets.cjs
npx prettier --write src/design-system/icons/assets.ts
```

The script extracts local vectors into [assets.ts](src/design-system/icons/assets.ts) and generates [logo.png](assets/images/logo.png) using Sharp. It does not redraw illustrations. The PNG is already included; conversion is not required to run the app.

Inter uses OFL, Sharp uses Apache-2.0, and Expo, React Native, and the main libraries use MIT. Check package licenses for complete terms. The npm package is private; no project LICENSE file currently defines distribution terms.

Technical references: [Development Builds](https://docs.expo.dev/develop/development-builds/introduction/), [storage](https://docs.expo.dev/develop/user-interface/store-data/), and [EAS versioning](https://docs.expo.dev/build-reference/app-versions/).

## Validation and remaining work

See [IMPLEMENTATION_STATUS.md](docs/IMPLEMENTATION_STATUS.md) for dated results and limitations.

The initial implementation passed TypeScript, ESLint, Prettier, 20 tests, and all 21 Expo Doctor checks, and produced an Android arm64 Development Build. The current iteration extends those checks for migration, editing, undo, custom foods, favorites, and history. Native execution and visual fidelity must still be verified on a device.

The recorded npm audit reported 14 moderate transitive findings and no high/critical findings. Suggested automatic fixes involved incompatible/older SDK versions; audit fix --force was not applied.

Remaining work:

1. Run the updated flows on Android and verify persistence after closing/reopening the app.
2. Compare native screenshots with Figma, including compact screens, larger text, keyboard, and screen-reader behavior.
3. Refine visual differences, loading skeletons, selectors, and chart styling against the reference.
4. Validate iOS and a standalone preview build.
5. Consider custom-food editing/deletion only as an additional product iteration.

The presence of 13 design references does not mean all visual details have been validated in the native app.
