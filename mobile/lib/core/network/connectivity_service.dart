import 'dart:async';

import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter_riverpod/flutter_riverpod.dart';

final connectivityProvider = StreamProvider<bool>((ref) {
  // On web, assume always online — connectivity_plus can hang in some browsers
  if (kIsWeb) return Stream.value(true);
  return ConnectivityService().onConnectivityChanged;
});

final isOnlineProvider = Provider<bool>((ref) {
  final connectivity = ref.watch(connectivityProvider);
  return connectivity.when(
    data: (isOnline) => isOnline,
    loading: () => true,
    error: (_, __) => false,
  );
});

class ConnectivityService {
  final Connectivity _connectivity = Connectivity();

  Stream<bool> get onConnectivityChanged {
    return _connectivity.onConnectivityChanged.map((results) {
      return results.any((r) => r != ConnectivityResult.none);
    });
  }

  Future<bool> get isOnline async {
    final results = await _connectivity.checkConnectivity();
    return results.any((r) => r != ConnectivityResult.none);
  }
}
