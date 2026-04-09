import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:ganado_app/core/auth/auth_provider.dart';
import 'package:ganado_app/features/auth/screens/login_screen.dart';
import 'package:ganado_app/features/dashboard/screens/dashboard_screen.dart';
import 'package:ganado_app/features/cattle/screens/cattle_list_screen.dart';
import 'package:ganado_app/features/cattle/screens/cattle_detail_screen.dart';
import 'package:ganado_app/features/cattle/screens/cattle_form_screen.dart';
import 'package:ganado_app/features/brands/screens/brand_list_screen.dart';
import 'package:ganado_app/features/commerce/purchases/screens/purchase_list_screen.dart';
import 'package:ganado_app/features/commerce/purchases/screens/purchase_detail_screen.dart';
import 'package:ganado_app/features/commerce/purchases/screens/purchase_form_screen.dart';
import 'package:ganado_app/features/commerce/sales/screens/sale_list_screen.dart';
import 'package:ganado_app/features/commerce/sales/screens/sale_form_screen.dart';
import 'package:ganado_app/features/commerce/providers_vendors/screens/provider_list_screen.dart';
import 'package:ganado_app/features/commerce/providers_vendors/screens/provider_form_screen.dart';
import 'package:ganado_app/features/events/screens/massive_event_list_screen.dart';
import 'package:ganado_app/features/events/screens/massive_event_detail_screen.dart';
import 'package:ganado_app/features/events/screens/event_application_screen.dart';
import 'package:ganado_app/features/receptions/screens/reception_screen.dart';
import 'package:ganado_app/features/devices/screens/device_list_screen.dart';
import 'package:ganado_app/features/employees/users/screens/user_list_screen.dart';
import 'package:ganado_app/features/employees/roles/screens/role_list_screen.dart';
import 'package:ganado_app/features/health/screens/health_event_list_screen.dart';
import 'package:ganado_app/features/health/screens/health_event_detail_screen.dart';
import 'package:ganado_app/features/health/screens/health_event_form_screen.dart';
import 'package:ganado_app/features/breeding/screens/breeding_list_screen.dart';
import 'package:ganado_app/features/breeding/screens/breeding_detail_screen.dart';
import 'package:ganado_app/features/breeding/screens/breeding_form_screen.dart';
import 'package:ganado_app/features/work_orders/screens/work_order_list_screen.dart';
import 'package:ganado_app/features/work_orders/screens/work_order_form_screen.dart';
import 'package:ganado_app/features/grazing/screens/pasture_list_screen.dart';
import 'package:ganado_app/features/grazing/screens/pasture_detail_screen.dart';
import 'package:ganado_app/features/grazing/screens/pasture_form_screen.dart';
import 'package:ganado_app/features/feed/screens/feed_type_list_screen.dart';
import 'package:ganado_app/features/feed/screens/feeding_log_screen.dart';
import 'package:ganado_app/features/feed/screens/feed_record_form_screen.dart';
import 'package:ganado_app/features/reports/screens/reports_screen.dart';
import 'package:ganado_app/features/settings/screens/settings_screen.dart';
import 'package:ganado_app/shared/widgets/app_scaffold.dart';

final routerProvider = Provider<GoRouter>((ref) {
  final authState = ref.watch(authStateProvider);

  return GoRouter(
    initialLocation: '/login',
    redirect: (context, state) {
      final isAuthenticated = authState.status == AuthStatus.authenticated;
      final isLoginRoute = state.matchedLocation == '/login';

      if (!isAuthenticated && !isLoginRoute) return '/login';
      if (isAuthenticated && isLoginRoute) return '/dashboard';
      return null;
    },
    routes: [
      GoRoute(
        path: '/login',
        builder: (context, state) => const LoginScreen(),
      ),
      ShellRoute(
        builder: (context, state, child) => AppScaffold(child: child),
        routes: [
          GoRoute(
            path: '/dashboard',
            builder: (context, state) => const DashboardScreen(),
          ),

          // ─── Cattle ───
          GoRoute(
            path: '/cattle',
            builder: (context, state) => const CattleListScreen(),
          ),
          GoRoute(
            path: '/cattle/new',
            builder: (context, state) => const CattleFormScreen(),
          ),
          GoRoute(
            path: '/cattle/:id',
            builder: (context, state) => CattleDetailScreen(
              cattleId: state.pathParameters['id']!,
            ),
          ),
          GoRoute(
            path: '/cattle/:id/edit',
            builder: (context, state) => CattleFormScreen(
              cattleId: state.pathParameters['id'],
            ),
          ),

          // ─── Brands ───
          GoRoute(
            path: '/brands',
            builder: (context, state) => const BrandListScreen(),
          ),

          // ─── Purchases ───
          GoRoute(
            path: '/purchases',
            builder: (context, state) => const PurchaseListScreen(),
          ),
          GoRoute(
            path: '/purchases/new',
            builder: (context, state) => const PurchaseFormScreen(),
          ),
          GoRoute(
            path: '/purchases/:id',
            builder: (context, state) => PurchaseDetailScreen(
              purchaseId: state.pathParameters['id']!,
            ),
          ),
          GoRoute(
            path: '/purchases/:id/edit',
            builder: (context, state) => PurchaseFormScreen(
              purchaseId: state.pathParameters['id'],
            ),
          ),

          // ─── Sales ───
          GoRoute(
            path: '/sales',
            builder: (context, state) => const SaleListScreen(),
          ),
          GoRoute(
            path: '/sales/new',
            builder: (context, state) => const SaleFormScreen(),
          ),

          // ─── Providers ───
          GoRoute(
            path: '/providers',
            builder: (context, state) => const ProviderListScreen(),
          ),
          GoRoute(
            path: '/providers/new',
            builder: (context, state) => const ProviderFormScreen(),
          ),
          GoRoute(
            path: '/providers/:id/edit',
            builder: (context, state) => ProviderFormScreen(
              providerId: state.pathParameters['id'],
            ),
          ),

          // ─── Events ───
          GoRoute(
            path: '/events',
            builder: (context, state) => const MassiveEventListScreen(),
          ),
          GoRoute(
            path: '/events/:id',
            builder: (context, state) => MassiveEventDetailScreen(
              eventId: state.pathParameters['id']!,
            ),
          ),
          GoRoute(
            path: '/events/:id/apply',
            builder: (context, state) => EventApplicationScreen(
              eventId: state.pathParameters['id']!,
            ),
          ),

          // ─── Receptions ───
          GoRoute(
            path: '/receptions/:purchaseId',
            builder: (context, state) => ReceptionScreen(
              purchaseId: state.pathParameters['purchaseId']!,
            ),
          ),

          // ─── Health Events ───
          GoRoute(
            path: '/health-events',
            builder: (context, state) => const HealthEventListScreen(),
          ),
          GoRoute(
            path: '/health-events/new',
            builder: (context, state) => const HealthEventFormScreen(),
          ),
          GoRoute(
            path: '/health-events/:id',
            builder: (context, state) => HealthEventDetailScreen(
              eventId: state.pathParameters['id']!,
            ),
          ),
          GoRoute(
            path: '/health-events/:id/edit',
            builder: (context, state) => HealthEventFormScreen(
              eventId: state.pathParameters['id'],
            ),
          ),

          // ─── Breeding ───
          GoRoute(
            path: '/breeding',
            builder: (context, state) => const BreedingListScreen(),
          ),
          GoRoute(
            path: '/breeding/new',
            builder: (context, state) => const BreedingFormScreen(),
          ),
          GoRoute(
            path: '/breeding/:id',
            builder: (context, state) => BreedingDetailScreen(
              eventId: state.pathParameters['id']!,
            ),
          ),
          GoRoute(
            path: '/breeding/:id/edit',
            builder: (context, state) => BreedingFormScreen(
              eventId: state.pathParameters['id'],
            ),
          ),

          // ─── Work Orders ───
          GoRoute(
            path: '/work-orders',
            builder: (context, state) => const WorkOrderListScreen(),
          ),
          GoRoute(
            path: '/work-orders/new',
            builder: (context, state) => const WorkOrderFormScreen(),
          ),

          // ─── Grazing / Pastures ───
          GoRoute(
            path: '/pastures',
            builder: (context, state) => const PastureListScreen(),
          ),
          GoRoute(
            path: '/pastures/new',
            builder: (context, state) => const PastureFormScreen(),
          ),
          GoRoute(
            path: '/pastures/:id',
            builder: (context, state) => PastureDetailScreen(
              pastureId: state.pathParameters['id']!,
            ),
          ),

          // ─── Feed Management ───
          GoRoute(
            path: '/feed-types',
            builder: (context, state) => const FeedTypeListScreen(),
          ),
          GoRoute(
            path: '/feeding-log',
            builder: (context, state) => const FeedingLogScreen(),
          ),
          GoRoute(
            path: '/feeding-log/new',
            builder: (context, state) => const FeedRecordFormScreen(),
          ),

          // ─── Devices ───
          GoRoute(
            path: '/devices',
            builder: (context, state) => const DeviceListScreen(),
          ),

          // ─── Employees ───
          GoRoute(
            path: '/users',
            builder: (context, state) => const UserListScreen(),
          ),
          GoRoute(
            path: '/roles',
            builder: (context, state) => const RoleListScreen(),
          ),

          // ─── Reports ───
          GoRoute(
            path: '/reports',
            builder: (context, state) => const ReportsScreen(),
          ),

          // ─── Settings ───
          GoRoute(
            path: '/settings',
            builder: (context, state) => const SettingsScreen(),
          ),
        ],
      ),
    ],
  );
});
