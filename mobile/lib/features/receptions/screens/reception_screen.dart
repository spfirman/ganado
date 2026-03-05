import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:ganado_app/core/network/api_client.dart';
import 'package:ganado_app/shared/utils/validators.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class ReceptionScreen extends ConsumerStatefulWidget {
  final String purchaseId;

  const ReceptionScreen({super.key, required this.purchaseId});

  @override
  ConsumerState<ReceptionScreen> createState() => _ReceptionScreenState();
}

class _ReceptionScreenState extends ConsumerState<ReceptionScreen> {
  final _numberController = TextEditingController();
  final _weightController = TextEditingController();
  final _eartagLeftController = TextEditingController();
  final _eartagRightController = TextEditingController();
  bool _isReceiving = false;
  String? _message;
  int _receivedCount = 0;

  @override
  void dispose() {
    _numberController.dispose();
    _weightController.dispose();
    _eartagLeftController.dispose();
    _eartagRightController.dispose();
    super.dispose();
  }

  Future<void> _receiveCattle() async {
    if (_numberController.text.isEmpty) return;
    setState(() {
      _isReceiving = true;
      _message = null;
    });

    try {
      final api = ref.read(apiClientProvider);
      await api.post('/receptions/receive', data: {
        'id_purchase': widget.purchaseId,
        'number': _numberController.text.trim(),
        'received_weight': double.tryParse(_weightController.text) ?? 0,
        'eartag_left': _eartagLeftController.text.trim().isEmpty
            ? null
            : _eartagLeftController.text.trim(),
        'eartag_right': _eartagRightController.text.trim().isEmpty
            ? null
            : _eartagRightController.text.trim(),
      });
      setState(() {
        _receivedCount++;
        _message = 'Animal #${_numberController.text} recibido';
        _numberController.clear();
        _weightController.clear();
        _eartagLeftController.clear();
        _eartagRightController.clear();
      });
    } catch (e) {
      setState(() => _message = 'Error: $e');
    } finally {
      setState(() => _isReceiving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Card(
            color: Theme.of(context).colorScheme.primaryContainer,
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  const Icon(Icons.check_circle, size: 32),
                  const SizedBox(width: 16),
                  Text(
                    'Recibidos: $_receivedCount',
                    style: Theme.of(context).textTheme.headlineSmall,
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          TextFormField(
            controller: _numberController,
            decoration: InputDecoration(labelText: l10n.cattleNumber),
            autofocus: true,
            validator: (v) => Validators.required(v),
          ),
          const SizedBox(height: 12),
          TextFormField(
            controller: _weightController,
            decoration: InputDecoration(labelText: '${l10n.weight} (kg)'),
            keyboardType: TextInputType.number,
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: TextFormField(
                  controller: _eartagLeftController,
                  decoration: InputDecoration(labelText: '${l10n.eartag} Izq.'),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: TextFormField(
                  controller: _eartagRightController,
                  decoration: InputDecoration(labelText: '${l10n.eartag} Der.'),
                ),
              ),
            ],
          ),
          if (_message != null) ...[
            const SizedBox(height: 12),
            Text(
              _message!,
              style: TextStyle(
                color: _message!.startsWith('Error')
                    ? Theme.of(context).colorScheme.error
                    : Colors.green,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
          const SizedBox(height: 24),
          SizedBox(
            height: 56,
            child: FilledButton.icon(
              onPressed: _isReceiving ? null : _receiveCattle,
              icon: const Icon(Icons.add_circle),
              label: Text(l10n.receiveAnimals,
                  style: const TextStyle(fontSize: 16)),
            ),
          ),
        ],
      ),
    );
  }
}
