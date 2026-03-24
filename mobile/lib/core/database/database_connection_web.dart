import 'package:drift/drift.dart';

/// On web, we provide a LazyDatabase that defers initialization.
/// If no feature actually queries the local DB, the database never opens.
/// Web users interact via API repositories, not local SQLite.
QueryExecutor openConnection() {
  return LazyDatabase(() async {
    throw UnsupportedError(
      'Local database is not available on web. Use API repositories.',
    );
  });
}
