import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:ganado_app/core/network/api_client.dart';
import 'package:ganado_app/features/events/models/massive_event.dart';

final massiveEventListProvider = FutureProvider<List<MassiveEvent>>((ref) async {
  final api = ref.read(apiClientProvider);
  final response = await api.get('/massive-events');
  return (response.data as List)
      .map((e) => MassiveEvent.fromJson(e as Map<String, dynamic>))
      .toList();
});

final massiveEventDetailProvider =
    FutureProvider.family<MassiveEvent, String>((ref, id) async {
  final api = ref.read(apiClientProvider);
  final response = await api.get('/massive-events/$id');
  return MassiveEvent.fromJson(response.data as Map<String, dynamic>);
});

final simpleEventsByMassiveProvider =
    FutureProvider.family<List<SimpleEvent>, String>((ref, massiveEventId) async {
  final api = ref.read(apiClientProvider);
  final response = await api.get('/simple-events', queryParameters: {'id_massive_event': massiveEventId});
  return (response.data as List)
      .map((e) => SimpleEvent.fromJson(e as Map<String, dynamic>))
      .toList();
});

final appliedCattleProvider =
    FutureProvider.family<List<dynamic>, String>((ref, massiveEventId) async {
  final api = ref.read(apiClientProvider);
  final response = await api.get('/massive-events/$massiveEventId/applied-cattle');
  return response.data as List;
});
