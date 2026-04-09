import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:ganado_app/core/sync/sync_engine.dart';

/// Callback types for menu actions.
typedef MenuActionCallback = Future<void> Function();

/// Configuration for desktop menu bar actions.
class DesktopMenuConfig {
  /// Callback for "New Cattle" action (Cmd+N).
  final MenuActionCallback? onNewCattle;

  /// Callback for "Export CSV" action (Cmd+E).
  final MenuActionCallback? onExportCsv;

  /// Callback for "Print" action (Cmd+P).
  final MenuActionCallback? onPrint;

  /// Callback for "Undo" action.
  final MenuActionCallback? onUndo;

  /// Callback for "Redo" action.
  final MenuActionCallback? onRedo;

  /// Callback for "Cut" action.
  final MenuActionCallback? onCut;

  /// Callback for "Copy" action.
  final MenuActionCallback? onCopy;

  /// Callback for "Paste" action.
  final MenuActionCallback? onPaste;

  /// Callback for "Toggle Sidebar" action (Cmd+\).
  final MenuActionCallback? onToggleSidebar;

  /// Callback for "Refresh" action (Cmd+R).
  final MenuActionCallback? onRefresh;

  /// Callback for "Switch Herd" action.
  final MenuActionCallback? onSwitchHerd;

  /// Callback for "Sync Now" action (Cmd+Shift+S).
  final MenuActionCallback? onSyncNow;

  /// Callback for "Settings" action.
  final MenuActionCallback? onSettings;

  /// Callback for "Database Status" action.
  final MenuActionCallback? onDatabaseStatus;

  const DesktopMenuConfig({
    this.onNewCattle,
    this.onExportCsv,
    this.onPrint,
    this.onUndo,
    this.onRedo,
    this.onCut,
    this.onCopy,
    this.onPaste,
    this.onToggleSidebar,
    this.onRefresh,
    this.onSwitchHerd,
    this.onSyncNow,
    this.onSettings,
    this.onDatabaseStatus,
  });
}

/// A widget that wraps the app with a platform-specific menu bar on macOS/desktop.
///
/// Provides native menu bar with:
/// - File: New Cattle (Cmd+N), Export CSV (Cmd+E), Print (Cmd+P)
/// - Edit: Undo, Redo, Cut, Copy, Paste
/// - View: Toggle Sidebar (Cmd+\), Refresh (Cmd+R)
/// - Herd: Switch Herd, Sync Now (Cmd+Shift+S)
/// - Tools: Settings, Database Status
class DesktopMenuBar extends ConsumerWidget {
  /// The child widget to wrap.
  final Widget child;

  /// Menu configuration with action callbacks.
  final DesktopMenuConfig config;

  const DesktopMenuBar({
    super.key,
    required this.child,
    required this.config,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Only show menu bar on desktop platforms (macOS, Windows, Linux)
    final isDesktop =
        defaultTargetPlatform == TargetPlatform.macOS ||
        defaultTargetPlatform == TargetPlatform.windows ||
        defaultTargetPlatform == TargetPlatform.linux;

    if (!isDesktop) {
      return child;
    }

    // macOS menu bar
    if (defaultTargetPlatform == TargetPlatform.macOS) {
      return _buildMacOSMenuBar(context, ref);
    }

    // Windows/Linux menu bar (future enhancement)
    return child;
  }

  /// Builds the macOS platform menu bar.
  Widget _buildMacOSMenuBar(BuildContext context, WidgetRef ref) {
    return PlatformMenuBar(
      menus: [
        PlatformMenu(
          label: 'File',
          menus: [
            PlatformMenuItem(
              label: 'New Cattle',
              shortcut: const SingleActivator(LogicalKeyboardKey.keyN,
                  meta: true),
              onSelected: config.onNewCattle,
            ),
            PlatformMenuItem(
              label: 'Export CSV',
              shortcut: const SingleActivator(LogicalKeyboardKey.keyE,
                  meta: true),
              onSelected: config.onExportCsv,
            ),
            PlatformMenuItem(
              label: 'Print',
              shortcut: const SingleActivator(LogicalKeyboardKey.keyP,
                  meta: true),
              onSelected: config.onPrint,
            ),
            const PlatformMenuItemGroup(members: []),
          ],
        ),
        PlatformMenu(
          label: 'Edit',
          menus: [
            PlatformMenuItem(
              label: 'Undo',
              shortcut: const SingleActivator(LogicalKeyboardKey.keyZ,
                  meta: true),
              onSelected: config.onUndo,
            ),
            PlatformMenuItem(
              label: 'Redo',
              shortcut: const SingleActivator(LogicalKeyboardKey.keyZ,
                  meta: true,
                  shift: true),
              onSelected: config.onRedo,
            ),
            const PlatformMenuItemGroup(members: []),
            PlatformMenuItem(
              label: 'Cut',
              shortcut: const SingleActivator(LogicalKeyboardKey.keyX,
                  meta: true),
              onSelected: config.onCut,
            ),
            PlatformMenuItem(
              label: 'Copy',
              shortcut: const SingleActivator(LogicalKeyboardKey.keyC,
                  meta: true),
              onSelected: config.onCopy,
            ),
            PlatformMenuItem(
              label: 'Paste',
              shortcut: const SingleActivator(LogicalKeyboardKey.keyV,
                  meta: true),
              onSelected: config.onPaste,
            ),
          ],
        ),
        PlatformMenu(
          label: 'View',
          menus: [
            PlatformMenuItem(
              label: 'Toggle Sidebar',
              shortcut: const SingleActivator(LogicalKeyboardKey.backslash,
                  meta: true),
              onSelected: config.onToggleSidebar,
            ),
            PlatformMenuItem(
              label: 'Refresh',
              shortcut: const SingleActivator(LogicalKeyboardKey.keyR,
                  meta: true),
              onSelected: config.onRefresh,
            ),
          ],
        ),
        PlatformMenu(
          label: 'Herd',
          menus: [
            PlatformMenuItem(
              label: 'Switch Herd',
              onSelected: config.onSwitchHerd,
            ),
            PlatformMenuItem(
              label: 'Sync Now',
              shortcut: const SingleActivator(LogicalKeyboardKey.keyS,
                  meta: true,
                  shift: true),
              onSelected: config.onSyncNow,
            ),
          ],
        ),
        PlatformMenu(
          label: 'Tools',
          menus: [
            PlatformMenuItem(
              label: 'Settings',
              onSelected: config.onSettings,
            ),
            PlatformMenuItem(
              label: 'Database Status',
              onSelected: config.onDatabaseStatus,
            ),
          ],
        ),
      ],
      child: child,
    );
  }
}
