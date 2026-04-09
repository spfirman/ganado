import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:ganado_app/core/router/app_router.dart';
import 'package:ganado_app/core/l10n/locale_provider.dart';
import 'package:ganado_app/core/sync/sync_engine.dart';
import 'package:ganado_app/l10n/app_localizations.dart';
import 'package:ganado_app/shared/widgets/desktop_menu_bar.dart';
import 'package:ganado_app/shared/widgets/desktop_shortcuts.dart';
import 'package:go_router/go_router.dart';

class GanadoApp extends ConsumerWidget {
  const GanadoApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(routerProvider);
    final locale = ref.watch(localeProvider);

    final app = MaterialApp.router(
      title: 'Ganado',
      debugShowCheckedModeBanner: false,
      theme: _buildTheme(),
      darkTheme: _buildDarkTheme(),
      themeMode: ThemeMode.light,
      localizationsDelegates: const [
        AppLocalizations.delegate,
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      supportedLocales: supportedLocales,
      locale: locale,
      routerConfig: router,
    );

    // Wrap with desktop features on macOS
    if (defaultTargetPlatform == TargetPlatform.macOS) {
      return DesktopMenuBar(
        config: DesktopMenuConfig(
          onNewCattle: () => _handleNewCattle(context),
          onExportCsv: () => _handleExportCsv(ref),
          onPrint: () => _handlePrint(context),
          onUndo: () => _handleUndo(context),
          onRedo: () => _handleRedo(context),
          onToggleSidebar: () => _handleToggleSidebar(context),
          onRefresh: () => _handleRefresh(ref),
          onSwitchHerd: () => _handleSwitchHerd(context),
          onSyncNow: () => _handleSyncNow(ref),
          onSettings: () => _handleSettings(context),
          onDatabaseStatus: () => _handleDatabaseStatus(context),
        ),
        child: DesktopShortcuts(
          config: DesktopShortcutConfig(
            onSearch: () => _handleSearch(context),
            onNew: () => _handleNewCattle(context),
            onGoBack: () => _handleGoBack(context),
            onSave: () => _handleSave(ref),
            onFocusLocation: () => _handleFocusLocation(context),
          ),
          child: app,
        ),
      );
    }

    // Non-macOS platforms use just the shortcuts
    if (defaultTargetPlatform == TargetPlatform.windows ||
        defaultTargetPlatform == TargetPlatform.linux) {
      return DesktopShortcuts(
        config: DesktopShortcutConfig(
          onSearch: () => _handleSearch(context),
          onNew: () => _handleNewCattle(context),
          onGoBack: () => _handleGoBack(context),
          onSave: () => _handleSave(ref),
          onFocusLocation: () => _handleFocusLocation(context),
        ),
        child: app,
      );
    }

    return app;
  }

  // Menu action handlers
  Future<void> _handleNewCattle(BuildContext context) async {
    if (context.mounted) {
      context.go('/cattle/new');
    }
  }

  Future<void> _handleExportCsv(WidgetRef ref) async {
    // Implementation: Export cattle data as CSV
  }

  Future<void> _handlePrint(BuildContext context) async {
    // Implementation: Print current view
  }

  Future<void> _handleUndo(BuildContext context) async {
    // Implementation: Undo last action
  }

  Future<void> _handleRedo(BuildContext context) async {
    // Implementation: Redo last action
  }

  Future<void> _handleToggleSidebar(BuildContext context) async {
    // Implementation: Toggle sidebar visibility
  }

  Future<void> _handleRefresh(WidgetRef ref) async {
    await ref.read(syncEngineProvider).syncAll();
  }

  Future<void> _handleSwitchHerd(BuildContext context) async {
    // Implementation: Show herd selection dialog
  }

  Future<void> _handleSyncNow(WidgetRef ref) async {
    await ref.read(syncEngineProvider).syncAll();
  }

  Future<void> _handleSettings(BuildContext context) async {
    if (context.mounted) {
      context.go('/settings');
    }
  }

  Future<void> _handleDatabaseStatus(BuildContext context) async {
    // Implementation: Show database status dialog
  }

  // Shortcut action handlers
  void _handleSearch(BuildContext context) {
    // Implementation: Open search/filter dialog
  }

  void _handleGoBack(BuildContext context) {
    if (context.mounted && Navigator.of(context).canPop()) {
      Navigator.of(context).pop();
    }
  }

  void _handleSave(WidgetRef ref) {
    // Implementation: Save current form
  }

  void _handleFocusLocation(BuildContext context) {
    // Implementation: Focus location/search field
  }

  ThemeData _buildTheme() {
    return ThemeData(
      useMaterial3: true,
      colorSchemeSeed: const Color(0xFF2E7D32), // Green - cattle/farm theme
      brightness: Brightness.light,
      appBarTheme: const AppBarTheme(
        centerTitle: true,
        elevation: 0,
      ),
      cardTheme: CardThemeData(
        elevation: 2,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
        ),
        filled: true,
      ),
    );
  }

  ThemeData _buildDarkTheme() {
    return ThemeData(
      useMaterial3: true,
      colorSchemeSeed: const Color(0xFF4CAF50),
      brightness: Brightness.dark,
      appBarTheme: const AppBarTheme(
        centerTitle: true,
        elevation: 0,
      ),
      cardTheme: CardThemeData(
        elevation: 2,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
        ),
        filled: true,
      ),
    );
  }
}
