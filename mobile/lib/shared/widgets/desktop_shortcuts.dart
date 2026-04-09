import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

/// Callback type for shortcut actions.
typedef ShortcutActionCallback = void Function();

/// Configuration for keyboard shortcuts.
class DesktopShortcutConfig {
  /// Callback for Cmd/Ctrl+F (search).
  final ShortcutActionCallback? onSearch;

  /// Callback for Cmd/Ctrl+N (new).
  final ShortcutActionCallback? onNew;

  /// Callback for Escape (go back).
  final ShortcutActionCallback? onGoBack;

  /// Callback for Cmd/Ctrl+S (save).
  final ShortcutActionCallback? onSave;

  /// Callback for Cmd/Ctrl+L (focus location/url).
  final ShortcutActionCallback? onFocusLocation;

  const DesktopShortcutConfig({
    this.onSearch,
    this.onNew,
    this.onGoBack,
    this.onSave,
    this.onFocusLocation,
  });
}

/// Intent class for search action.
class SearchIntent extends Intent {
  const SearchIntent();
}

/// Intent class for new action.
class NewIntent extends Intent {
  const NewIntent();
}

/// Intent class for go back action.
class GoBackIntent extends Intent {
  const GoBackIntent();
}

/// Intent class for save action.
class SaveIntent extends Intent {
  const SaveIntent();
}

/// Intent class for focus location action.
class FocusLocationIntent extends Intent {
  const FocusLocationIntent();
}

/// A widget that registers keyboard shortcuts for desktop applications.
///
/// Provides common keyboard shortcuts:
/// - Cmd/Ctrl+F: Search
/// - Cmd/Ctrl+N: New item
/// - Escape: Go back
/// - Cmd/Ctrl+S: Save
/// - Cmd/Ctrl+L: Focus location/search
class DesktopShortcuts extends StatefulWidget {
  /// The child widget to wrap.
  final Widget child;

  /// Shortcut configuration with action callbacks.
  final DesktopShortcutConfig config;

  const DesktopShortcuts({
    super.key,
    required this.child,
    required this.config,
  });

  @override
  State<DesktopShortcuts> createState() => _DesktopShortcutsState();
}

class _DesktopShortcutsState extends State<DesktopShortcuts> {
  late Map<ShortcutActivator, Intent> _shortcuts;
  late Map<Type, Action<Intent>> _actions;

  @override
  void initState() {
    super.initState();
    _initializeShortcuts();
  }

  void _initializeShortcuts() {
    _shortcuts = {
      // Cmd/Ctrl+F for search
      const SingleActivator(LogicalKeyboardKey.keyF, control: true):
          const SearchIntent(),
      const SingleActivator(LogicalKeyboardKey.keyF, meta: true):
          const SearchIntent(),

      // Cmd/Ctrl+N for new
      const SingleActivator(LogicalKeyboardKey.keyN, control: true):
          const NewIntent(),
      const SingleActivator(LogicalKeyboardKey.keyN, meta: true):
          const NewIntent(),

      // Escape for go back
      const SingleActivator(LogicalKeyboardKey.escape): const GoBackIntent(),

      // Cmd/Ctrl+S for save
      const SingleActivator(LogicalKeyboardKey.keyS, control: true):
          const SaveIntent(),
      const SingleActivator(LogicalKeyboardKey.keyS, meta: true):
          const SaveIntent(),

      // Cmd/Ctrl+L for focus location
      const SingleActivator(LogicalKeyboardKey.keyL, control: true):
          const FocusLocationIntent(),
      const SingleActivator(LogicalKeyboardKey.keyL, meta: true):
          const FocusLocationIntent(),
    };

    _actions = {
      SearchIntent: CallbackAction<SearchIntent>(
        onInvoke: (intent) {
          widget.config.onSearch?.call();
          return null;
        },
      ),
      NewIntent: CallbackAction<NewIntent>(
        onInvoke: (intent) {
          widget.config.onNew?.call();
          return null;
        },
      ),
      GoBackIntent: CallbackAction<GoBackIntent>(
        onInvoke: (intent) {
          widget.config.onGoBack?.call();
          return null;
        },
      ),
      SaveIntent: CallbackAction<SaveIntent>(
        onInvoke: (intent) {
          widget.config.onSave?.call();
          return null;
        },
      ),
      FocusLocationIntent: CallbackAction<FocusLocationIntent>(
        onInvoke: (intent) {
          widget.config.onFocusLocation?.call();
          return null;
        },
      ),
    };
  }

  @override
  Widget build(BuildContext context) {
    return Shortcuts(
      shortcuts: _shortcuts,
      child: Actions(
        actions: _actions,
        child: Focus(
          autofocus: true,
          child: widget.child,
        ),
      ),
    );
  }
}
