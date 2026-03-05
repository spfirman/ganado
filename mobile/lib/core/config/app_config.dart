import 'environment.dart';

class AppConfig {
  final Environment environment;
  final String apiBaseUrl;
  final String mqttBrokerHost;
  final int mqttBrokerPort;

  const AppConfig._({
    required this.environment,
    required this.apiBaseUrl,
    required this.mqttBrokerHost,
    required this.mqttBrokerPort,
  });

  static const production = AppConfig._(
    environment: Environment.production,
    apiBaseUrl: 'https://ganado.gpcb.com.co/api/v1',
    mqttBrokerHost: 'ganado.gpcb.com.co',
    mqttBrokerPort: 1884,
  );

  static const development = AppConfig._(
    environment: Environment.development,
    apiBaseUrl: 'https://dev.ganado.gpcb.com.co/api/v1',
    mqttBrokerHost: 'dev.ganado.gpcb.com.co',
    mqttBrokerPort: 1884,
  );

  static AppConfig current = production;

  static void initialize(Environment env) {
    switch (env) {
      case Environment.production:
        current = production;
        break;
      case Environment.development:
        current = development;
        break;
    }
  }
}
