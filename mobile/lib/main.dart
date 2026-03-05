import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:ganado_app/app.dart';
import 'package:ganado_app/core/auth/auth_provider.dart';
import 'package:ganado_app/core/config/app_config.dart';
import 'package:ganado_app/core/config/environment.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Configure environment
  const env = String.fromEnvironment('ENV', defaultValue: 'production');
  AppConfig.initialize(
    env == 'development' ? Environment.development : Environment.production,
  );

  final container = ProviderContainer();

  // Check stored auth tokens
  await container.read(authStateProvider.notifier).checkAuthStatus();

  runApp(
    UncontrolledProviderScope(
      container: container,
      child: const GanadoApp(),
    ),
  );
}
