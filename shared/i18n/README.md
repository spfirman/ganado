# Ganado i18n System Documentation

This document describes the internationalization (i18n) system implemented across all Ganado platforms: Web (Next.js), Mobile (Flutter), visionOS (SwiftUI), and tvOS (SwiftUI).

## Overview

The i18n system provides:
- **Centralized translations** in JSON format
- **Multi-platform support** (Web, Flutter, iOS/visionOS/tvOS)
- **Locale detection** (device language with fallback)
- **Persistent preferences** (user locale preference saved locally)
- **Fallback strategy** (user locale → Spanish → key itself)

## Shared Resources

### Locale Files
Located at: `/ganado/shared/i18n/locales/`

- **es.json** - Spanish translations
- **en.json** - English translations

Both files contain the same structure: key-value pairs for all UI strings.

#### Key Naming Convention
Keys use dot notation for organization:
```
app.*          - App-level strings (name, subtitle)
auth.*         - Authentication-related strings
auth.otp.*     - OTP/2FA strings
errors.*       - Error messages
common.*       - Common UI elements (Save, Cancel, etc.)
nav.*          - Navigation items
```

## Platform-Specific Implementations

### Web (Next.js)

**Location:** `/ganado/web/lib/i18n.ts`

**Usage:**
```tsx
"use client";
import { useI18n } from "@/lib/i18n";

export default function MyComponent() {
  const { t, locale, setLocale } = useI18n();

  return (
    <>
      <h1>{t("app.name")}</h1>
      <p>{t("auth.loginSubtitle")}</p>
      <p>Current locale: {locale}</p>
      <button onClick={() => setLocale("en")}>English</button>
      <button onClick={() => setLocale("es")}>Español</button>
    </>
  );
}
```

**Features:**
- Hook-based API (`useI18n()`)
- localStorage persistence under key `ganado.i18n.locale`
- Device locale detection on first load
- Parameter substitution: `t("key", { name: "John" })`
- Optional Context API support via `I18nProvider`

**Updated Files:**
- `/web/app/(auth)/login/page.tsx` - Login page now uses `t()` for all strings

---

### Flutter

**Location:** `/ganado/mobile/lib/core/i18n/`

Files:
1. **app_localizations.dart** - Main localization class
2. **locale_provider.dart** - Riverpod provider for locale state

**Usage:**
```dart
import 'package:ganado_app/core/i18n/app_localizations.dart';

@override
Widget build(BuildContext context) {
  final l10n = AppLocalizations.of(context)!;

  return Text(l10n.t("app.name"));
  // Or use convenience getters:
  return Text(l10n.appName);
}
```

**Features:**
- Extends `LocalizationsDelegate` for built-in Flutter i18n
- Riverpod `localeProvider` for reactive locale switching
- SharedPreferences persistence under key `ganado.i18n.locale`
- Device locale detection on app startup
- Convenience getters: `l10n.appName`, `l10n.username`, etc.

**Updated Files:**
- `/mobile/lib/features/auth/screens/login_screen.dart` - Login screen refactored to use `AppLocalizations`

**Material App Configuration:**
```dart
MaterialApp(
  localizationsDelegates: [
    AppLocalizations.delegate,
    GlobalMaterialLocalizations.delegate,
  ],
  supportedLocales: const [
    Locale('en'),
    Locale('es'),
  ],
  locale: ref.watch(localeProvider),
  // ...
)
```

---

### visionOS (SwiftUI)

**Location:** `/ganado/apps/shared/i18n/I18nService.swift`

**Usage:**
```swift
import SwiftUI

struct MyView: View {
  var body: some View {
    Text(I18nService.shared.t("app.name"))
    Text(I18nService.shared.t("auth.login"))
    
    // With parameters:
    // Text(I18nService.shared.t("some.key", params: ["name": "John"]))
  }
}
```

**Features:**
- Singleton pattern: `I18nService.shared`
- UserDefaults persistence under key `ganado.i18n.locale`
- Device locale detection on init
- Fallback: user locale → Spanish → key itself
- Parameter substitution via dictionary

**Updated Files:**
- `/apps/visionos/GanadoVision/Views/LoginView.swift` - All hardcoded Spanish strings replaced with `I18nService.shared.t()` calls

**Bundle Setup:**
Ensure locale JSON files are added to the visionOS target's bundle:
1. In Xcode: Select target
2. Build Phases → Copy Bundle Resources
3. Add `es.json` and `en.json` from `/shared/i18n/locales/`

---

### tvOS (SwiftUI)

**Location:** `/ganado/apps/shared/i18n/I18nService.swift` (shared with visionOS)

**Usage:** Identical to visionOS

**Updated Files:**
- `/apps/tvos/GanadoTV/Views/LoginView.swift` - All hardcoded Spanish strings replaced with `I18nService.shared.t()` calls

**Bundle Setup:**
Same as visionOS above.

---

## Migration Guide

### Adding New Strings

1. **Add to locale files:**
   ```json
   {
     "new.key": "New English String",
     ...
   }
   ```
   And the same in `es.json`

2. **Use in code:**
   - **Web:** `t("new.key")`
   - **Flutter:** `l10n.t("new.key")`
   - **Swift:** `I18nService.shared.t("new.key")`

### Removing Hardcoded Strings

**Web Example:**
```tsx
// Before
<h1>Ganado</h1>

// After
<h1>{t("app.name")}</h1>
```

**Flutter Example:**
```dart
// Before
Text("Usuario")

// After
Text(l10n.username)
```

**Swift Example:**
```swift
// Before
Text("Usuario")

// After
Text(I18nService.shared.t("auth.username"))
```

---

## Locale Fallback Logic

All platforms implement the same fallback strategy:

1. **Try current user locale**
   - Stored in UserDefaults (native) or localStorage (web)
   - Example: User selected "en" → use English

2. **Try Spanish (es)**
   - If string not found in user locale, fallback to Spanish
   - Spanish is the default/reference language

3. **Use key itself**
   - If string not found in any language, return the key
   - Useful for debugging missing translations

---

## Testing Translations

### Web
```typescript
const { t } = useI18n();

// Test parameter substitution
console.log(t("some.key", { name: "John" }));

// Switch locale
setLocale("en");  // Switch to English
setLocale("es");  // Switch to Spanish
```

### Flutter
```dart
final l10n = AppLocalizations.of(context)!;
print(l10n.t("some.key"));

// Switch locale dynamically
ref.read(localeProvider.notifier).setLocale("en");
```

### Swift
```swift
I18nService.shared.setLocale("en")  // Switch to English
I18nService.shared.t("auth.username")
```

---

## Current Translations

Both `es.json` and `en.json` include:

**Authentication:**
- `auth.username`, `auth.password`
- `auth.login`, `auth.signingIn`
- `auth.otp.title`, `auth.otp.subtitle`, `auth.otp.code`, `auth.otp.verify`, `auth.otp.back`
- `auth.forgotPassword`
- Placeholder texts and error messages

**Common UI:**
- `common.save`, `common.cancel`, `common.loading`, `common.error`

**Navigation:**
- `nav.dashboard`, `nav.herd`, `nav.health`, `nav.breeding`, `nav.pastures`, `nav.feed`, etc.

**Errors:**
- `errors.loginFailed`, `errors.invalidCredentials`, `errors.networkError`, `errors.otpInvalid`

---

## Future Enhancements

1. **Pluralization support** - Handle singular/plural forms
2. **Date/number formatting** - Locale-specific formatting
3. **RTL support** - Right-to-left languages
4. **Dynamic loading** - Load translations from server instead of embedding
5. **Translation management UI** - In-app locale switcher component

---

## File Structure

```
ganado/
├── shared/
│   └── i18n/
│       ├── locales/
│       │   ├── es.json
│       │   └── en.json
│       └── README.md (this file)
├── web/
│   └── lib/
│       ├── i18n.ts
│       └── locales/
│           ├── es.json (copy of shared)
│           └── en.json (copy of shared)
│       └── app/(auth)/login/page.tsx (updated)
├── mobile/
│   └── lib/
│       └── core/i18n/
│           ├── app_localizations.dart
│           └── locale_provider.dart
│       └── features/auth/screens/login_screen.dart (updated)
└── apps/
    ├── shared/i18n/
    │   └── I18nService.swift
    ├── visionos/GanadoVision/Views/LoginView.swift (updated)
    └── tvos/GanadoTV/Views/LoginView.swift (updated)
```

---

## Questions & Support

For issues or questions about the i18n system, refer to platform-specific implementation files above.
