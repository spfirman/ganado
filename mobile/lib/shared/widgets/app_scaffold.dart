import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:ganado_app/core/auth/auth_provider.dart';
import 'package:ganado_app/core/sync/sync_engine.dart';
import 'package:ganado_app/shared/widgets/offline_indicator.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class AppScaffold extends ConsumerWidget {
  final Widget child;

  const AppScaffold({super.key, required this.child});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = AppLocalizations.of(context)!;
    final authState = ref.watch(authStateProvider);
    final isWide = MediaQuery.of(context).size.width >= 800;

    if (isWide) {
      return _buildWideLayout(context, ref, l10n, authState);
    }
    return _buildNarrowLayout(context, ref, l10n, authState);
  }

  Widget _buildWideLayout(
    BuildContext context,
    WidgetRef ref,
    AppLocalizations l10n,
    AuthState authState,
  ) {
    final currentPath = GoRouterState.of(context).matchedLocation;

    return Scaffold(
      body: Column(
        children: [
          const OfflineIndicator(),
          Expanded(
            child: Row(
              children: [
                NavigationRail(
                  selectedIndex: _getSelectedIndex(currentPath),
                  onDestinationSelected: (index) =>
                      _onNavSelected(context, index),
                  extended: MediaQuery.of(context).size.width >= 1200,
                  leading: Padding(
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    child: Text(
                      'Ganado',
                      style: Theme.of(context).textTheme.titleLarge?.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                    ),
                  ),
                  trailing: Expanded(
                    child: Align(
                      alignment: Alignment.bottomCenter,
                      child: Padding(
                        padding: const EdgeInsets.only(bottom: 16),
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text(authState.displayName,
                                style: Theme.of(context).textTheme.bodySmall),
                            IconButton(
                              icon: const Icon(Icons.logout),
                              onPressed: () =>
                                  ref.read(authStateProvider.notifier).logout(),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                  destinations: _navDestinations(l10n),
                ),
                const VerticalDivider(width: 1),
                Expanded(child: child),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildNarrowLayout(
    BuildContext context,
    WidgetRef ref,
    AppLocalizations l10n,
    AuthState authState,
  ) {
    final currentPath = GoRouterState.of(context).matchedLocation;
    final pendingSync = ref.watch(pendingSyncCountProvider);

    return Scaffold(
      drawer: _buildDrawer(context, ref, l10n, authState, pendingSync),
      appBar: AppBar(
        title: Text(_getTitle(currentPath, l10n)),
        actions: [
          pendingSync.when(
            data: (count) => count > 0
                ? Badge(
                    label: Text('$count'),
                    child: IconButton(
                      icon: const Icon(Icons.sync),
                      onPressed: () =>
                          ref.read(syncEngineProvider).syncAll(),
                    ),
                  )
                : const SizedBox.shrink(),
            loading: () => const SizedBox.shrink(),
            error: (_, __) => const SizedBox.shrink(),
          ),
        ],
      ),
      body: Column(
        children: [
          const OfflineIndicator(),
          Expanded(child: child),
        ],
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _getBottomNavIndex(currentPath),
        onDestinationSelected: (index) =>
            _onBottomNavSelected(context, index),
        destinations: [
          NavigationDestination(
            icon: const Icon(Icons.dashboard_outlined),
            selectedIcon: const Icon(Icons.dashboard),
            label: l10n.dashboard,
          ),
          NavigationDestination(
            icon: const Icon(Icons.pets_outlined),
            selectedIcon: const Icon(Icons.pets),
            label: l10n.cattle,
          ),
          NavigationDestination(
            icon: const Icon(Icons.shopping_cart_outlined),
            selectedIcon: const Icon(Icons.shopping_cart),
            label: l10n.purchases,
          ),
          NavigationDestination(
            icon: const Icon(Icons.event_outlined),
            selectedIcon: const Icon(Icons.event),
            label: l10n.events,
          ),
        ],
      ),
    );
  }

  Drawer _buildDrawer(
    BuildContext context,
    WidgetRef ref,
    AppLocalizations l10n,
    AuthState authState,
    AsyncValue<int> pendingSync,
  ) {
    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: [
          UserAccountsDrawerHeader(
            accountName: Text(authState.displayName),
            accountEmail: Text(authState.username),
            currentAccountPicture: CircleAvatar(
              child: Text(
                authState.displayName.isNotEmpty
                    ? authState.displayName[0].toUpperCase()
                    : '?',
              ),
            ),
            decoration: BoxDecoration(
              color: Theme.of(context).colorScheme.primary,
            ),
          ),
          _drawerItem(context, Icons.dashboard, l10n.dashboard, '/dashboard'),
          _drawerItem(context, Icons.pets, l10n.cattle, '/cattle'),
          _drawerItem(context, Icons.branding_watermark, l10n.brands, '/brands'),
          const Divider(),
          _drawerItem(
              context, Icons.shopping_cart, l10n.purchases, '/purchases'),
          _drawerItem(context, Icons.point_of_sale, l10n.sales, '/sales'),
          _drawerItem(context, Icons.business, l10n.providers, '/providers'),
          const Divider(),
          _drawerItem(context, Icons.event, l10n.massiveEvents, '/events'),
          _drawerItem(
              context, Icons.move_down, l10n.receptions, '/receptions/all'),
          const Divider(),
          _drawerItem(context, Icons.sensors, l10n.devices, '/devices'),
          _drawerItem(context, Icons.people, l10n.users, '/users'),
          _drawerItem(context, Icons.admin_panel_settings, l10n.roles, '/roles'),
          const Divider(),
          _drawerItem(context, Icons.settings, l10n.settings, '/settings'),
          ListTile(
            leading: const Icon(Icons.logout),
            title: Text(l10n.logout),
            onTap: () {
              Navigator.pop(context);
              ref.read(authStateProvider.notifier).logout();
            },
          ),
        ],
      ),
    );
  }

  Widget _drawerItem(
      BuildContext context, IconData icon, String label, String path) {
    final currentPath = GoRouterState.of(context).matchedLocation;
    final isSelected = currentPath == path;

    return ListTile(
      leading: Icon(icon, color: isSelected ? Theme.of(context).colorScheme.primary : null),
      title: Text(label),
      selected: isSelected,
      onTap: () {
        Navigator.pop(context);
        context.go(path);
      },
    );
  }

  List<NavigationRailDestination> _navDestinations(AppLocalizations l10n) {
    return [
      NavigationRailDestination(
        icon: const Icon(Icons.dashboard_outlined),
        selectedIcon: const Icon(Icons.dashboard),
        label: Text(l10n.dashboard),
      ),
      NavigationRailDestination(
        icon: const Icon(Icons.pets_outlined),
        selectedIcon: const Icon(Icons.pets),
        label: Text(l10n.cattle),
      ),
      NavigationRailDestination(
        icon: const Icon(Icons.branding_watermark_outlined),
        selectedIcon: const Icon(Icons.branding_watermark),
        label: Text(l10n.brands),
      ),
      NavigationRailDestination(
        icon: const Icon(Icons.shopping_cart_outlined),
        selectedIcon: const Icon(Icons.shopping_cart),
        label: Text(l10n.purchases),
      ),
      NavigationRailDestination(
        icon: const Icon(Icons.point_of_sale_outlined),
        selectedIcon: const Icon(Icons.point_of_sale),
        label: Text(l10n.sales),
      ),
      NavigationRailDestination(
        icon: const Icon(Icons.business_outlined),
        selectedIcon: const Icon(Icons.business),
        label: Text(l10n.providers),
      ),
      NavigationRailDestination(
        icon: const Icon(Icons.event_outlined),
        selectedIcon: const Icon(Icons.event),
        label: Text(l10n.events),
      ),
      NavigationRailDestination(
        icon: const Icon(Icons.sensors_outlined),
        selectedIcon: const Icon(Icons.sensors),
        label: Text(l10n.devices),
      ),
      NavigationRailDestination(
        icon: const Icon(Icons.people_outlined),
        selectedIcon: const Icon(Icons.people),
        label: Text(l10n.users),
      ),
      NavigationRailDestination(
        icon: const Icon(Icons.settings_outlined),
        selectedIcon: const Icon(Icons.settings),
        label: Text(l10n.settings),
      ),
    ];
  }

  int _getSelectedIndex(String path) {
    if (path.startsWith('/dashboard')) return 0;
    if (path.startsWith('/cattle')) return 1;
    if (path.startsWith('/brands')) return 2;
    if (path.startsWith('/purchases')) return 3;
    if (path.startsWith('/sales')) return 4;
    if (path.startsWith('/providers')) return 5;
    if (path.startsWith('/events')) return 6;
    if (path.startsWith('/devices')) return 7;
    if (path.startsWith('/users') || path.startsWith('/roles')) return 8;
    if (path.startsWith('/settings')) return 9;
    return 0;
  }

  int _getBottomNavIndex(String path) {
    if (path.startsWith('/dashboard')) return 0;
    if (path.startsWith('/cattle') || path.startsWith('/brands')) return 1;
    if (path.startsWith('/purchases') ||
        path.startsWith('/sales') ||
        path.startsWith('/providers')) return 2;
    if (path.startsWith('/events')) return 3;
    return 0;
  }

  void _onNavSelected(BuildContext context, int index) {
    const paths = [
      '/dashboard',
      '/cattle',
      '/brands',
      '/purchases',
      '/sales',
      '/providers',
      '/events',
      '/devices',
      '/users',
      '/settings',
    ];
    if (index < paths.length) context.go(paths[index]);
  }

  void _onBottomNavSelected(BuildContext context, int index) {
    const paths = ['/dashboard', '/cattle', '/purchases', '/events'];
    if (index < paths.length) context.go(paths[index]);
  }

  String _getTitle(String path, AppLocalizations l10n) {
    if (path.startsWith('/dashboard')) return l10n.dashboard;
    if (path.startsWith('/cattle')) return l10n.cattle;
    if (path.startsWith('/brands')) return l10n.brands;
    if (path.startsWith('/purchases')) return l10n.purchases;
    if (path.startsWith('/sales')) return l10n.sales;
    if (path.startsWith('/providers')) return l10n.providers;
    if (path.startsWith('/events')) return l10n.events;
    if (path.startsWith('/receptions')) return l10n.receptions;
    if (path.startsWith('/devices')) return l10n.devices;
    if (path.startsWith('/users')) return l10n.users;
    if (path.startsWith('/roles')) return l10n.roles;
    if (path.startsWith('/settings')) return l10n.settings;
    return 'Ganado';
  }
}
