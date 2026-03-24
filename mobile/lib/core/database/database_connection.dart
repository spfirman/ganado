// Conditional import: picks native or web implementation at compile time.
// This avoids importing dart:ffi on web.
export 'database_connection_stub.dart'
    if (dart.library.ffi) 'database_connection_native.dart'
    if (dart.library.js_interop) 'database_connection_web.dart';
