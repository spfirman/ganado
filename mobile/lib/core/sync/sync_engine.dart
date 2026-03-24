import 'dart:async';
import 'dart:convert';

import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:ganado_app/core/network/api_client.dart';
import 'package:ganado_app/core/network/connectivity_service.dart';
import 'package:ganado_app/core/sync/sync_queue.dart';
import 'package:logger/logger.dart';

final syncEngineProvider = Provider<SyncEngine>((ref) {
  return SyncEngine(ref);
});

final pendingSyncCountProvider = StreamProvider<int>((ref) {
  // On web, there's no local database for offline sync — always return 0
  if (kIsWeb) return Stream.value(0);
  return ref.read(syncQueueServiceProvider).watchPendingCount();
});

class SyncEngine {
  final Ref _ref;
  final _logger = Logger();
  Timer? _retryTimer;
  bool _isSyncing = false;

  SyncEngine(this._ref) {
    // On web, there's no local database — sync is a no-op
    if (kIsWeb) return;

    // Listen for connectivity changes and trigger sync
    _ref.listen<bool>(isOnlineProvider, (prev, isOnline) {
      if (isOnline && !(prev ?? false)) {
        syncAll();
      }
    });
  }

  Future<void> syncAll() async {
    if (kIsWeb || _isSyncing) return;
    _isSyncing = true;

    try {
      final queueService = _ref.read(syncQueueServiceProvider);
      final apiClient = _ref.read(apiClientProvider);
      final items = await queueService.getPendingItems();

      for (final item in items) {
        if (item.retryCount >= 5) {
          _logger.w('Max retries for sync item ${item.id}, skipping');
          continue;
        }

        try {
          await queueService.markProcessing(item.id);
          await _processItem(apiClient, item);
          await queueService.remove(item.id);
        } catch (e) {
          _logger.e('Sync failed for item ${item.id}: $e');
          await queueService.markFailed(item.id, item.retryCount);

          // Exponential backoff: schedule retry
          final delay = Duration(seconds: (1 << item.retryCount).clamp(1, 60));
          _retryTimer?.cancel();
          _retryTimer = Timer(delay, syncAll);
          break;
        }
      }
    } finally {
      _isSyncing = false;
    }
  }

  Future<void> _processItem(ApiClient apiClient, dynamic item) async {
    final payload = jsonDecode(item.payloadJson as String);
    final entityType = item.entityType as String;
    final operation = item.operation as String;

    final endpoints = _getEndpoint(entityType, item.entityId as String);

    switch (operation) {
      case 'CREATE':
        await apiClient.post(endpoints['create']!, data: payload);
        break;
      case 'UPDATE':
        await apiClient.patch(endpoints['update']!, data: payload);
        break;
      case 'DELETE':
        await apiClient.delete(endpoints['delete']!);
        break;
    }
  }

  Map<String, String> _getEndpoint(String entityType, String entityId) {
    switch (entityType) {
      case 'cattle':
        return {
          'create': '/cattle',
          'update': '/cattle/$entityId',
          'delete': '/cattle/$entityId',
        };
      case 'brand':
        return {
          'create': '/brands',
          'update': '/brands/$entityId',
          'delete': '/brands/$entityId',
        };
      case 'purchase':
        return {
          'create': '/purchases',
          'update': '/purchases/$entityId',
          'delete': '/purchases/$entityId',
        };
      case 'sale':
        return {
          'create': '/sales',
          'update': '/sales/$entityId',
          'delete': '/sales/$entityId',
        };
      case 'massive_event':
        return {
          'create': '/massive-events',
          'update': '/massive-events/$entityId',
          'delete': '/massive-events/$entityId',
        };
      case 'simple_event':
        return {
          'create': '/simple-events',
          'update': '/simple-events/$entityId',
          'delete': '/simple-events/$entityId',
        };
      default:
        throw ArgumentError('Unknown entity type: $entityType');
    }
  }

  void dispose() {
    _retryTimer?.cancel();
  }
}
