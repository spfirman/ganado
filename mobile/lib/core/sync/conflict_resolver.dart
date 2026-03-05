/// Server-wins conflict resolution strategy.
///
/// When syncing data, if a conflict is detected (e.g. the server has a
/// newer version), the server's data takes precedence and the local
/// copy is overwritten.
class ConflictResolver {
  /// Compares local and server timestamps to determine which wins.
  /// Returns true if the server version should overwrite local.
  static bool serverWins({
    required DateTime? localUpdatedAt,
    required DateTime? serverUpdatedAt,
  }) {
    if (serverUpdatedAt == null) return false;
    if (localUpdatedAt == null) return true;
    return serverUpdatedAt.isAfter(localUpdatedAt);
  }

  /// Merges server data into local, preferring server values for conflicts.
  static Map<String, dynamic> mergeServerWins({
    required Map<String, dynamic> local,
    required Map<String, dynamic> server,
  }) {
    final merged = Map<String, dynamic>.from(local);
    for (final entry in server.entries) {
      if (entry.value != null) {
        merged[entry.key] = entry.value;
      }
    }
    return merged;
  }
}
