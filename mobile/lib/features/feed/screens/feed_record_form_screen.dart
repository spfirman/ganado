import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:ganado_app/features/feed/models/feed.dart';
import 'package:ganado_app/features/feed/providers/feed_provider.dart';
import 'package:ganado_app/l10n/app_localizations.dart';

class FeedRecordFormScreen extends ConsumerStatefulWidget {
  const FeedRecordFormScreen({super.key});

  @override
  ConsumerState<FeedRecordFormScreen> createState() =>
      _FeedRecordFormScreenState();
}

class _FeedRecordFormScreenState extends ConsumerState<FeedRecordFormScreen> {
  late TextEditingController _quantityController;
  late TextEditingController _costController;
  late TextEditingController _targetIdController;
  late TextEditingController _notesController;
  late TextEditingController _fedByController;

  String? _selectedFeedTypeId;
  String? _selectedFeedTypeName;
  FeedingTargetGroup _selectedTargetGroup = FeedingTargetGroup.all;
  DateTime? _selectedFedDate;

  @override
  void initState() {
    super.initState();
    _quantityController = TextEditingController();
    _costController = TextEditingController();
    _targetIdController = TextEditingController();
    _notesController = TextEditingController();
    _fedByController = TextEditingController();
    _selectedFedDate = DateTime.now();
  }

  @override
  void dispose() {
    _quantityController.dispose();
    _costController.dispose();
    _targetIdController.dispose();
    _notesController.dispose();
    _fedByController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    final feedTypeList = ref.watch(feedTypeListProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Registrar Alimentación'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Feed type dropdown
            Text('Feed Type', style: Theme.of(context)
                .textTheme
                .bodyMedium
                ?.copyWith(fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            feedTypeList.when(
              data: (result) {
                return DropdownButtonFormField<String>(
                  value: _selectedFeedTypeId,
                  decoration: InputDecoration(
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                    prefixIcon: const Icon(Icons.local_dining),
                  ),
                  hint: const Text('Select Feed Type'),
                  items: result.items
                      .map((feedType) => DropdownMenuItem(
                            value: feedType.id,
                            child: Text(feedType.name),
                            onTap: () {
                              _selectedFeedTypeName = feedType.name;
                            },
                          ))
                      .toList(),
                  onChanged: (id) {
                    if (id != null) {
                      setState(() => _selectedFeedTypeId = id);
                    }
                  },
                );
              },
              loading: () => const Center(
                child: CircularProgressIndicator(),
              ),
              error: (_, __) => Text('Error loading feed types'),
            ),
            const SizedBox(height: 16),

            // Quantity field
            TextField(
              controller: _quantityController,
              keyboardType:
                  const TextInputType.numberWithOptions(decimal: true),
              decoration: InputDecoration(
                labelText: 'Quantity',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
                prefixIcon: const Icon(Icons.scale),
              ),
            ),
            const SizedBox(height: 16),

            // Target group dropdown
            Text('Target Group', style: Theme.of(context)
                .textTheme
                .bodyMedium
                ?.copyWith(fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            DropdownButtonFormField<FeedingTargetGroup>(
              value: _selectedTargetGroup,
              decoration: InputDecoration(
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
                prefixIcon: const Icon(Icons.pets),
              ),
              items: FeedingTargetGroup.values
                  .map((group) => DropdownMenuItem(
                        value: group,
                        child: Text(group.name.replaceFirst(
                          group.name[0],
                          group.name[0].toUpperCase(),
                        )),
                      ))
                  .toList(),
              onChanged: (group) {
                if (group != null) {
                  setState(() => _selectedTargetGroup = group);
                }
              },
            ),
            const SizedBox(height: 16),

            // Target ID (conditional)
            if (_selectedTargetGroup != FeedingTargetGroup.all)
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  TextField(
                    controller: _targetIdController,
                    decoration: InputDecoration(
                      labelText: _selectedTargetGroup ==
                              FeedingTargetGroup.lot
                          ? 'Lot ID'
                          : 'Cattle ID',
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                      prefixIcon: const Icon(Icons.tag),
                    ),
                  ),
                  const SizedBox(height: 16),
                ],
              ),

            // Fed date picker
            Text('Fed Date', style: Theme.of(context)
                .textTheme
                .bodyMedium
                ?.copyWith(fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            OutlinedButton.icon(
              onPressed: () => _selectFedDate(context),
              icon: const Icon(Icons.calendar_today),
              label: Text(
                _selectedFedDate == null
                    ? 'Select Date'
                    : '${_selectedFedDate!.month}/${_selectedFedDate!.day}/${_selectedFedDate!.year}',
              ),
              style: OutlinedButton.styleFrom(
                minimumSize: const Size(double.infinity, 48),
              ),
            ),
            const SizedBox(height: 16),

            // Cost field
            TextField(
              controller: _costController,
              keyboardType:
                  const TextInputType.numberWithOptions(decimal: true),
              decoration: InputDecoration(
                labelText: 'Cost',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
                prefixIcon: const Icon(Icons.attach_money),
              ),
            ),
            const SizedBox(height: 16),

            // Fed by field
            TextField(
              controller: _fedByController,
              decoration: InputDecoration(
                labelText: 'Fed By',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
                prefixIcon: const Icon(Icons.person),
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
                child: const Text('Registrar'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _selectFedDate(BuildContext context) async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _selectedFedDate ?? DateTime.now(),
      firstDate: DateTime(2020),
      lastDate: DateTime.now(),
    );

    if (picked != null) {
      setState(() => _selectedFedDate = picked);
    }
  }

  void _submitForm() {
    if (_selectedFeedTypeId == null || _selectedFeedTypeId!.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Feed type is required')),
      );
      return;
    }

    if (_quantityController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Quantity is required')),
      );
      return;
    }

    if (_costController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Cost is required')),
      );
      return;
    }

    final data = {
      'feed_type_id': _selectedFeedTypeId,
      'feed_type_name': _selectedFeedTypeName,
      'quantity': double.parse(_quantityController.text),
      'target_group': _selectedTargetGroup.name,
      'target_id':
          _selectedTargetGroup == FeedingTargetGroup.all ? null : _targetIdController.text,
      'fed_at': _selectedFedDate?.toIso8601String(),
      'fed_by': _fedByController.text,
      'cost': double.parse(_costController.text),
      'notes': _notesController.text,
    };

    ref.read(createFeedingRecordProvider(data)).when(
      data: (_) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Feeding record created successfully')),
        );
        context.go('/feeding-log');
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
