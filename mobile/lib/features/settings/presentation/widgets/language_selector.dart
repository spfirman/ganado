import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:ganado_app/core/l10n/locale_provider.dart';

/// A widget that displays a dropdown for selecting the application language.
///
/// It reads the current locale from [localeProvider] and writes the new
/// selection back through [LocaleNotifier.setLocale], which also persists
/// the preference to [SharedPreferences].
class LanguageSelector extends ConsumerWidget {
  const LanguageSelector({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final currentLocale = ref.watch(localeProvider);

    return Card(
      child: ListTile(
        leading: const Icon(Icons.language),
        title: const Text('Idioma / Language'),
        subtitle: Text(
          localeNativeNames[currentLocale.languageCode] ??
              currentLocale.languageCode,
        ),
        trailing: DropdownButton<Locale>(
          value: currentLocale,
          underline: const SizedBox.shrink(),
          onChanged: (Locale? newLocale) {
            if (newLocale != null) {
              ref.read(localeProvider.notifier).setLocale(newLocale);
            }
          },
          items: supportedLocales.map((locale) {
            return DropdownMenuItem<Locale>(
              value: locale,
              child: Text(
                localeNativeNames[locale.languageCode] ??
                    locale.languageCode,
              ),
            );
          }).toList(),
        ),
      ),
    );
  }
}
