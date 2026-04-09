import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:ganado_app/core/sync/sync_engine.dart';
import 'package:ganado_app/shared/widgets/sync_status_banner.dart';
import 'package:ganado_app/l10n/app_localizations.dart';

class DashboardScreen extends ConsumerWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = AppLocalizations.of(context)!;
    final pendingSync = ref.watch(pendingSyncCountProvider);

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SyncStatusBanner(),
          const SizedBox(height: 16),
          Text(
            l10n.dashboard,
            style: Theme.of(context).textTheme.headlineSmall,
          ),
          const SizedBox(height: 16),
          _buildStatsGrid(context, l10n),
          const SizedBox(height: 24),
          _buildQuickActions(context, l10n),
        ],
      ),
    );
  }

  Widget _buildStatsGrid(BuildContext context, AppLocalizations l10n) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final crossAxisCount = constraints.maxWidth > 600 ? 4 : 2;
        return GridView.count(
          crossAxisCount: crossAxisCount,
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          mainAxisSpacing: 12,
          crossAxisSpacing: 12,
          childAspectRatio: 1.5,
          children: [
            _StatCard(
              icon: Icons.pets,
              label: l10n.totalCattle,
              value: '--',
              color: Colors.green,
            ),
            _StatCard(
              icon: Icons.event,
              label: l10n.activeEvents,
              value: '--',
              color: Colors.orange,
            ),
            _StatCard(
              icon: Icons.move_down,
              label: l10n.pendingReceptions,
              value: '--',
              color: Colors.blue,
            ),
            _StatCard(
              icon: Icons.shopping_cart,
              label: l10n.purchases,
              value: '--',
              color: Colors.purple,
            ),
          ],
        );
      },
    );
  }

  Widget _buildQuickActions(BuildContext context, AppLocalizations l10n) {
    return Wrap(
      spacing: 12,
      runSpacing: 12,
      children: [
        _QuickAction(
          icon: Icons.add,
          label: '${l10n.create} ${l10n.cattle}',
          onTap: () => context.go('/cattle/new'),
        ),
        _QuickAction(
          icon: Icons.scale,
          label: l10n.recordWeight,
          onTap: () => context.go('/cattle'),
        ),
        _QuickAction(
          icon: Icons.event_available,
          label: l10n.applyEvent,
          onTap: () => context.go('/events'),
        ),
        _QuickAction(
          icon: Icons.move_down,
          label: l10n.receiveAnimals,
          onTap: () => context.go('/purchases'),
        ),
        _QuickAction(
          icon: Icons.medical_services,
          label: 'Health Events',
          onTap: () => context.go('/health-events'),
        ),
        _QuickAction(
          icon: Icons.child_care,
          label: 'Breeding',
          onTap: () => context.go('/breeding'),
        ),
        _QuickAction(
          icon: Icons.assignment,
          label: 'Work Orders',
          onTap: () => context.go('/work-orders'),
        ),
        _QuickAction(
          icon: Icons.grass,
          label: 'Pastures',
          onTap: () => context.go('/pastures'),
        ),
        _QuickAction(
          icon: Icons.restaurant,
          label: 'Feed Log',
          onTap: () => context.go('/feeding-log'),
        ),
      ],
    );
  }
}

class _StatCard extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;
  final Color color;

  const _StatCard({
    required this.icon,
    required this.label,
    required this.value,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, color: color, size: 28),
            const SizedBox(height: 8),
            Text(
              value,
              style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
            ),
            Text(
              label,
              style: Theme.of(context).textTheme.bodySmall,
              textAlign: TextAlign.center,
              overflow: TextOverflow.ellipsis,
            ),
          ],
        ),
      ),
    );
  }
}

class _QuickAction extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;

  const _QuickAction({
    required this.icon,
    required this.label,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return ActionChip(
      avatar: Icon(icon, size: 18),
      label: Text(label),
      onPressed: onTap,
    );
  }
}
