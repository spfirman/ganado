import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:ganado_app/core/network/api_client.dart';
import 'package:ganado_app/features/events/providers/event_provider.dart';
import 'package:ganado_app/l10n/app_localizations.dart';

class EventApplicationScreen extends ConsumerStatefulWidget {
  final String eventId;

  const EventApplicationScreen({super.key, required this.eventId});

  @override
  ConsumerState<EventApplicationScreen> createState() =>
      _EventApplicationScreenState();
}

class _EventApplicationScreenState
    extends ConsumerState<EventApplicationScreen> {
  final _cattleNumberController = TextEditingController();
  bool _isApplying = false;
  String? _message;

  @override
  void dispose() {
    _cattleNumberController.dispose();
    super.dispose();
  }

  Future<void> _applyToSingle() async {
    if (_cattleNumberController.text.isEmpty) return;
    setState(() {
      _isApplying = true;
      _message = null;
    });

    try {
      final api = ref.read(apiClientProvider);
      await api.post(
        '/cattle/number/${_cattleNumberController.text.trim()}/events',
        data: {'id_massive_event': widget.eventId, 'events': []},
      );
      setState(() {
        _message = 'Evento aplicado exitosamente';
        _cattleNumberController.clear();
      });
      ref.invalidate(appliedCattleProvider(widget.eventId));
    } catch (e) {
      setState(() => _message = 'Error: $e');
    } finally {
      setState(() => _isApplying = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    final appliedCattle = ref.watch(appliedCattleProvider(widget.eventId));

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  TextField(
                    controller: _cattleNumberController,
                    decoration: InputDecoration(
                      labelText: l10n.cattleNumber,
                      suffixIcon: IconButton(
                        icon: const Icon(Icons.check),
                        onPressed: _isApplying ? null : _applyToSingle,
                      ),
                    ),
                    onSubmitted: (_) => _applyToSingle(),
                    autofocus: true,
                  ),
                  if (_message != null) ...[
                    const SizedBox(height: 12),
                    Text(
                      _message!,
                      style: TextStyle(
                        color: _message!.startsWith('Error')
                            ? Theme.of(context).colorScheme.error
                            : Colors.green,
                      ),
                    ),
                  ],
                ],
              ),
            ),
          ),
          const SizedBox(height: 24),
          Text('Animales aplicados',
              style: Theme.of(context).textTheme.titleMedium),
          const SizedBox(height: 8),
          appliedCattle.when(
            data: (list) {
              if (list.isEmpty) return Text(l10n.noData);
              return Column(
                children: list
                    .map((c) => Card(
                          margin: const EdgeInsets.only(bottom: 4),
                          child: ListTile(
                            dense: true,
                            title: Text('#${c['number'] ?? c['id']}'),
                            trailing:
                                Text('${c['last_weight'] ?? '-'} kg'),
                          ),
                        ))
                    .toList(),
              );
            },
            loading: () => const Center(child: CircularProgressIndicator()),
            error: (err, _) => Text('${l10n.error}: $err'),
          ),
        ],
      ),
    );
  }
}
