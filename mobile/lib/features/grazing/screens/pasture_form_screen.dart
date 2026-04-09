import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:ganado_app/features/grazing/providers/grazing_provider.dart';
import 'package:ganado_app/l10n/app_localizations.dart';

class PastureFormScreen extends ConsumerStatefulWidget {
  const PastureFormScreen({super.key});

  @override
  ConsumerState<PastureFormScreen> createState() =>
      _PastureFormScreenState();
}

class _PastureFormScreenState extends ConsumerState<PastureFormScreen> {
  late TextEditingController _nameController;
  late TextEditingController _areaController;
  late TextEditingController _grassTypeController;
  late TextEditingController _capacityController;
  late TextEditingController _notesController;

  @override
  void initState() {
    super.initState();
    _nameController = TextEditingController();
    _areaController = TextEditingController();
    _grassTypeController = TextEditingController();
    _capacityController = TextEditingController();
    _notesController = TextEditingController();
  }

  @override
  void dispose() {
    _nameController.dispose();
    _areaController.dispose();
    _grassTypeController.dispose();
    _capacityController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Crear Pastura'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Name field
            TextField(
              controller: _nameController,
              decoration: InputDecoration(
                labelText: 'Name',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
                prefixIcon: const Icon(Icons.landscape),
              ),
            ),
            const SizedBox(height: 16),

            // Area field
            TextField(
              controller: _areaController,
              keyboardType:
                  const TextInputType.numberWithOptions(decimal: true),
              decoration: InputDecoration(
                labelText: 'Area (hectares)',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
                prefixIcon: const Icon(Icons.straighten),
              ),
            ),
            const SizedBox(height: 16),

            // Grass type field
            TextField(
              controller: _grassTypeController,
              decoration: InputDecoration(
                labelText: 'Grass Type',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
                prefixIcon: const Icon(Icons.spa),
              ),
            ),
            const SizedBox(height: 16),

            // Capacity field
            TextField(
              controller: _capacityController,
              keyboardType: TextInputType.number,
              decoration: InputDecoration(
                labelText: 'Capacity (cattle count)',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
                prefixIcon: const Icon(Icons.pets),
              ),
            ),
            const SizedBox(height: 16),

            // Notes field
            TextField(
              controller: _notesController,
              maxLines: 3,
              decoration: InputDecoration(
                labelText: 'Notes',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
                prefixIcon: const Icon(Icons.note),
              ),
            ),
            const SizedBox(height: 24),

            // Submit button
            SizedBox(
              width: double.infinity,
              height: 48,
              child: ElevatedButton(
                onPressed: _submitForm,
                child: const Text('Crear'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _submitForm() {
    if (_nameController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Name is required')),
      );
      return;
    }

    if (_areaController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Area is required')),
      );
      return;
    }

    if (_capacityController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Capacity is required')),
      );
      return;
    }

    final data = {
      'name': _nameController.text,
      'area_hectares': double.parse(_areaController.text),
      'grass_type': _grassTypeController.text,
      'capacity': int.parse(_capacityController.text),
      'status': 'active',
      'notes': _notesController.text,
    };

    ref.read(createPastureProvider(data)).when(
      data: (_) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Pasture created successfully')),
        );
        context.go('/pastures');
      },
      loading: () {},
      error: (error, _) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $error')),
        );
      },
    );
  }
}
