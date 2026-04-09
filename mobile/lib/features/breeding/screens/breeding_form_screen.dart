import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:ganado_app/core/network/api_client.dart';
import 'package:ganado_app/features/breeding/models/breeding_event.dart';
import 'package:ganado_app/features/breeding/providers/breeding_provider.dart';
import 'package:ganado_app/shared/utils/validators.dart';
import 'package:ganado_app/l10n/app_localizations.dart';

class BreedingFormScreen extends ConsumerStatefulWidget {
  final String? eventId;

  const BreedingFormScreen({super.key, this.eventId});

  @override
  ConsumerState<BreedingFormScreen> createState() => _BreedingFormScreenState();
}

class _BreedingFormScreenState extends ConsumerState<BreedingFormScreen> {
  final _formKey = GlobalKey<FormState>();

  late TextEditingController _cattleIdController;
  late TextEditingController _cattleNumberController;
  late TextEditingController _sireIdController;
  late TextEditingController _sireNumberController;
  late TextEditingController _technicianuserController;
  late TextEditingController _notesController;
  late TextEditingController _calfIdController;
  late TextEditingController _calfBirthWeightController;

  BreedingEventType _selectedType = BreedingEventType.insemination;
  PregnancyStatus _selectedPregnancyStatus = PregnancyStatus.open;
  String _selectedInseminationType = 'ai';
  String _selectedCalvingDifficulty = 'easy';
  String _selectedCalfGender = 'male';

  DateTime? _selectedEventDate;
  DateTime? _selectedExpectedCalvingDate;
  DateTime? _selectedActualCalvingDate;
  int _calvesCount = 1;

  bool _isSubmitting = false;

  @override
  void initState() {
    super.initState();
    _cattleIdController = TextEditingController();
    _cattleNumberController = TextEditingController();
    _sireIdController = TextEditingController();
    _sireNumberController = TextEditingController();
    _technicianuserController = TextEditingController();
    _notesController = TextEditingController();
    _calfIdController = TextEditingController();
    _calfBirthWeightController = TextEditingController();
    _selectedEventDate = DateTime.now();
  }

  @override
  void dispose() {
    _cattleIdController.dispose();
    _cattleNumberController.dispose();
    _sireIdController.dispose();
    _sireNumberController.dispose();
    _technicianuserController.dispose();
    _notesController.dispose();
    _calfIdController.dispose();
    _calfBirthWeightController.dispose();
    super.dispose();
  }

  Future<void> _selectDate(
    BuildContext context,
    DateTime? initialDate,
    Function(DateTime) onDateSelected,
  ) async {
    final pickedDate = await showDatePicker(
      context: context,
      initialDate: initialDate ?? DateTime.now(),
      firstDate: DateTime(2020),
      lastDate: DateTime.now().add(const Duration(days: 365)),
    );

    if (pickedDate != null) {
      onDateSelected(pickedDate);
    }
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _isSubmitting = true);

    final data = {
      'id_cattle': _cattleIdController.text.trim(),
      'cattle_number': _cattleNumberController.text.trim(),
      'sire_id': _sireIdController.text.isEmpty ? null : _sireIdController.text.trim(),
      'sire_number': _sireNumberController.text.isEmpty
          ? null
          : _sireNumberController.text.trim(),
      'type': _eventTypeToString(_selectedType),
      'pregnancy_status': _pregnancyStatusToString(_selectedPregnancyStatus),
      'event_date': _selectedEventDate?.toIso8601String(),
      'expected_calving_date': _selectedExpectedCalvingDate?.toIso8601String(),
      'actual_calving_date': _selectedActualCalvingDate?.toIso8601String(),
      'calving_difficulty': _selectedType == BreedingEventType.calving
          ? _selectedCalvingDifficulty
          : null,
      'calves_count': _selectedType == BreedingEventType.calving
          ? _calvesCount
          : null,
      'calf_id': _calfIdController.text.isEmpty ? null : _calfIdController.text.trim(),
      'calf_birth_weight': _calfBirthWeightController.text.isEmpty
          ? null
          : double.tryParse(_calfBirthWeightController.text),
      'calf_gender': _calfBirthWeightController.text.isEmpty
          ? null
          : _selectedCalfGender,
      'insemination_type': _selectedType == BreedingEventType.insemination
          ? _selectedInseminationType
          : null,
      'technician': _technicianuserController.text.isEmpty
          ? null
          : _technicianuserController.text.trim(),
      'notes': _notesController.text.isEmpty ? null : _notesController.text.trim(),
    };

    try {
      final api = ref.read(apiClientProvider);
      if (widget.eventId != null) {
        await api.patch('/breeding-events/${widget.eventId}', data: data);
      } else {
        await api.post('/breeding-events', data: data);
      }
      ref.invalidate(breedingEventListProvider);
      if (mounted) context.go('/breeding');
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e')),
        );
      }
    } finally {
      if (mounted) setState(() => _isSubmitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;

    return Scaffold(
      appBar: AppBar(
        title: Text(widget.eventId != null ? 'Edit Event' : 'New Breeding Event'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Event Type
              Text(
                'Event Type',
                style: Theme.of(context).textTheme.labelLarge,
              ),
              const SizedBox(height: 8),
              DropdownButtonFormField<BreedingEventType>(
                value: _selectedType,
                decoration: const InputDecoration(labelText: 'Type'),
                items: BreedingEventType.values
                    .map((type) => DropdownMenuItem(
                          value: type,
                          child: Text(_eventTypeLabel(type)),
                        ))
                    .toList(),
                onChanged: (value) {
                  if (value != null) {
                    setState(() => _selectedType = value);
                  }
                },
              ),
              const SizedBox(height: 16),

              // Cattle selection
              Text(
                'Dam Information',
                style: Theme.of(context).textTheme.labelLarge,
              ),
              const SizedBox(height: 8),
              TextFormField(
                controller: _cattleIdController,
                decoration: const InputDecoration(labelText: 'Cattle ID'),
                validator: (v) =>
                    Validators.required(v, fieldName: 'Cattle ID'),
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _cattleNumberController,
                decoration: const InputDecoration(labelText: 'Cattle Number'),
                validator: (v) =>
                    Validators.required(v, fieldName: 'Cattle Number'),
              ),
              const SizedBox(height: 16),

              // Sire information
              Text(
                'Sire Information',
                style: Theme.of(context).textTheme.labelLarge,
              ),
              const SizedBox(height: 8),
              TextFormField(
                controller: _sireIdController,
                decoration: const InputDecoration(labelText: 'Sire ID (Optional)'),
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _sireNumberController,
                decoration: const InputDecoration(labelText: 'Sire Number (Optional)'),
              ),
              const SizedBox(height: 16),

              // Event Date
              Text(
                'Event Date',
                style: Theme.of(context).textTheme.labelLarge,
              ),
              const SizedBox(height: 8),
              InkWell(
                onTap: () => _selectDate(context, _selectedEventDate, (date) {
                  setState(() => _selectedEventDate = date);
                }),
                child: Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    border: Border.all(color: Colors.grey[300]!),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    _selectedEventDate != null
                        ? _selectedEventDate.toString().split(' ')[0]
                        : 'Select date',
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // Conditional insemination details
              if (_selectedType == BreedingEventType.insemination) ...[
                Text(
                  'Insemination Details',
                  style: Theme.of(context).textTheme.labelLarge,
                ),
                const SizedBox(height: 8),
                DropdownButtonFormField<String>(
                  value: _selectedInseminationType,
                  decoration: const InputDecoration(labelText: 'Insemination Type'),
                  items: ['ai', 'natural']
                      .map((type) => DropdownMenuItem(
                            value: type,
                            child: Text(type == 'ai' ? 'Artificial' : 'Natural'),
                          ))
                      .toList(),
                  onChanged: (value) {
                    if (value != null) {
                      setState(() => _selectedInseminationType = value);
                    }
                  },
                ),
                const SizedBox(height: 12),
                TextFormField(
                  controller: _technicianuserController,
                  decoration: const InputDecoration(labelText: 'Technician (Optional)'),
                ),
                const SizedBox(height: 16),
              ],

              // Expected calving date
              if (_selectedType == BreedingEventType.insemination ||
                  _selectedType == BreedingEventType.naturalBreeding) ...[
                Text(
                  'Expected Calving',
                  style: Theme.of(context).textTheme.labelLarge,
                ),
                const SizedBox(height: 8),
                InkWell(
                  onTap: () => _selectDate(context, _selectedExpectedCalvingDate,
                      (date) {
                    setState(() => _selectedExpectedCalvingDate = date);
                  }),
                  child: Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      border: Border.all(color: Colors.grey[300]!),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      _selectedExpectedCalvingDate != null
                          ? _selectedExpectedCalvingDate.toString().split(' ')[0]
                          : 'Select expected calving date',
                    ),
                  ),
                ),
                const SizedBox(height: 16),
              ],

              // Conditional calving details
              if (_selectedType == BreedingEventType.calving) ...[
                Text(
                  'Calving Details',
                  style: Theme.of(context).textTheme.labelLarge,
                ),
                const SizedBox(height: 8),
                InkWell(
                  onTap: () => _selectDate(context, _selectedActualCalvingDate,
                      (date) {
                    setState(() => _selectedActualCalvingDate = date);
                  }),
                  child: Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      border: Border.all(color: Colors.grey[300]!),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      _selectedActualCalvingDate != null
                          ? _selectedActualCalvingDate.toString().split(' ')[0]
                          : 'Select actual calving date',
                    ),
                  ),
                ),
                const SizedBox(height: 12),
                DropdownButtonFormField<String>(
                  value: _selectedCalvingDifficulty,
                  decoration: const InputDecoration(labelText: 'Difficulty'),
                  items: ['easy', 'assisted', 'difficult', 'csection']
                      .map((difficulty) => DropdownMenuItem(
                            value: difficulty,
                            child: Text(difficulty.toUpperCase()),
                          ))
                      .toList(),
                  onChanged: (value) {
                    if (value != null) {
                      setState(() => _selectedCalvingDifficulty = value);
                    }
                  },
                ),
                const SizedBox(height: 12),
                TextFormField(
                  initialValue: _calvesCount.toString(),
                  decoration: const InputDecoration(labelText: 'Number of Calves'),
                  keyboardType: TextInputType.number,
                  onChanged: (value) {
                    setState(() => _calvesCount = int.tryParse(value) ?? 1);
                  },
                ),
                const SizedBox(height: 16),
              ],

              // Calf information
              Text(
                'Calf Information (Optional)',
                style: Theme.of(context).textTheme.labelLarge,
              ),
              const SizedBox(height: 8),
              TextFormField(
                controller: _calfIdController,
                decoration: const InputDecoration(labelText: 'Calf ID'),
              ),
              const SizedBox(height: 12),
              DropdownButtonFormField<String>(
                value: _selectedCalfGender,
                decoration: const InputDecoration(labelText: 'Calf Gender'),
                items: ['male', 'female']
                    .map((gender) => DropdownMenuItem(
                          value: gender,
                          child: Text(gender.toUpperCase()),
                        ))
                    .toList(),
                onChanged: (value) {
                  if (value != null) {
                    setState(() => _selectedCalfGender = value);
                  }
                },
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _calfBirthWeightController,
                decoration: const InputDecoration(
                  labelText: 'Birth Weight (kg)',
                  hintText: 'e.g., 45.5',
                ),
                keyboardType: TextInputType.numberWithOptions(decimal: true),
              ),
              const SizedBox(height: 16),

              // Pregnancy status
              Text(
                'Pregnancy Status',
                style: Theme.of(context).textTheme.labelLarge,
              ),
              const SizedBox(height: 8),
              DropdownButtonFormField<PregnancyStatus>(
                value: _selectedPregnancyStatus,
                decoration: const InputDecoration(labelText: 'Status'),
                items: PregnancyStatus.values
                    .map((status) => DropdownMenuItem(
                          value: status,
                          child: Text(_pregnancyStatusLabel(status)),
                        ))
                    .toList(),
                onChanged: (value) {
                  if (value != null) {
                    setState(() => _selectedPregnancyStatus = value);
                  }
                },
              ),
              const SizedBox(height: 16),

              // Notes
              TextFormField(
                controller: _notesController,
                decoration: const InputDecoration(labelText: 'Notes (Optional)'),
                maxLines: 4,
              ),
              const SizedBox(height: 24),

              // Submit button
              FilledButton(
                onPressed: _isSubmitting ? null : _submit,
                child: _isSubmitting
                    ? const CircularProgressIndicator()
                    : Text(l10n.save),
              ),
            ],
          ),
        ),
      ),
    );
  }

  String _eventTypeLabel(BreedingEventType type) {
    switch (type) {
      case BreedingEventType.heatDetection:
        return 'Heat Detection';
      case BreedingEventType.insemination:
        return 'Insemination';
      case BreedingEventType.naturalBreeding:
        return 'Natural Breeding';
      case BreedingEventType.pregnancyCheck:
        return 'Pregnancy Check';
      case BreedingEventType.calving:
        return 'Calving';
      case BreedingEventType.weaning:
        return 'Weaning';
      case BreedingEventType.abortion:
        return 'Abortion';
    }
  }

  String _eventTypeToString(BreedingEventType type) {
    return type.toString().split('.').last;
  }

  String _pregnancyStatusLabel(PregnancyStatus status) {
    switch (status) {
      case PregnancyStatus.open:
        return 'Open';
      case PregnancyStatus.bred:
        return 'Bred';
      case PregnancyStatus.confirmed:
        return 'Confirmed';
      case PregnancyStatus.late:
        return 'Late';
      case PregnancyStatus.calved:
        return 'Calved';
      case PregnancyStatus.aborted:
        return 'Aborted';
    }
  }

  String _pregnancyStatusToString(PregnancyStatus status) {
    return status.toString().split('.').last;
  }
}
