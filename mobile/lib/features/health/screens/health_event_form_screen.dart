import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:ganado_app/features/health/models/health_event.dart';
import 'package:ganado_app/features/health/providers/health_provider.dart';
import 'package:ganado_app/shared/utils/validators.dart';
import 'package:ganado_app/l10n/app_localizations.dart';

class HealthEventFormScreen extends ConsumerStatefulWidget {
  final String? eventId;

  const HealthEventFormScreen({super.key, this.eventId});

  @override
  ConsumerState<HealthEventFormScreen> createState() =>
      _HealthEventFormScreenState();
}

class _HealthEventFormScreenState extends ConsumerState<HealthEventFormScreen> {
  final _formKey = GlobalKey<FormState>();
  final _cattleIdController = TextEditingController();
  final _nameController = TextEditingController();
  final _medicationController = TextEditingController();
  final _dosageController = TextEditingController();
  final _diagnosisController = TextEditingController();
  final _veterinarianController = TextEditingController();
  final _costController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _notesController = TextEditingController();

  HealthEventType? _type;
  String? _status;
  DateTime? _eventDate;
  DateTime? _followUpDate;
  bool _isSubmitting = false;

  bool get isEditing => widget.eventId != null;

  @override
  void initState() {
    super.initState();
    if (isEditing) {
      _loadEvent();
    }
  }

  Future<void> _loadEvent() async {
    final event =
        await ref.read(healthEventDetailProvider(widget.eventId!).future);
    _cattleIdController.text = event.idCattle;
    _nameController.text = event.name;
    _medicationController.text = event.medication ?? '';
    _dosageController.text = event.dosage ?? '';
    _diagnosisController.text = event.diagnosis ?? '';
    _veterinarianController.text = event.veterinarian ?? '';
    _costController.text = event.cost?.toString() ?? '';
    _descriptionController.text = event.description ?? '';
    _notesController.text = event.notes ?? '';
    setState(() {
      _type = event.type;
      _status = event.status;
      _eventDate = event.eventDate;
      _followUpDate = event.followUpDate;
    });
  }

  @override
  void dispose() {
    _cattleIdController.dispose();
    _nameController.dispose();
    _medicationController.dispose();
    _dosageController.dispose();
    _diagnosisController.dispose();
    _veterinarianController.dispose();
    _costController.dispose();
    _descriptionController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  Future<void> _selectDate(BuildContext context, bool isFollowUp) async {
    final picked = await showDatePicker(
      context: context,
      initialDate: isFollowUp ? _followUpDate ?? DateTime.now() : _eventDate ?? DateTime.now(),
      firstDate: DateTime(2020),
      lastDate: DateTime(2100),
    );
    if (picked != null) {
      setState(() {
        if (isFollowUp) {
          _followUpDate = picked;
        } else {
          _eventDate = picked;
        }
      });
    }
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    if (_type == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select an event type')),
      );
      return;
    }
    if (_eventDate == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select an event date')),
      );
      return;
    }

    setState(() => _isSubmitting = true);

    final data = {
      'id_cattle': _cattleIdController.text.trim(),
      'type': _type!.name,
      'name': _nameController.text.trim(),
      'description': _descriptionController.text.trim().isEmpty
          ? null
          : _descriptionController.text.trim(),
      'medication': _medicationController.text.trim().isEmpty
          ? null
          : _medicationController.text.trim(),
      'dosage': _dosageController.text.trim().isEmpty
          ? null
          : _dosageController.text.trim(),
      'diagnosis': _diagnosisController.text.trim().isEmpty
          ? null
          : _diagnosisController.text.trim(),
      'veterinarian': _veterinarianController.text.trim().isEmpty
          ? null
          : _veterinarianController.text.trim(),
      'cost': _costController.text.trim().isEmpty
          ? null
          : double.tryParse(_costController.text),
      'event_date': _eventDate!.toIso8601String(),
      'follow_up_date':
          _followUpDate != null ? _followUpDate!.toIso8601String() : null,
      'status': _status,
      'notes': _notesController.text.trim().isEmpty
          ? null
          : _notesController.text.trim(),
    };

    try {
      if (isEditing) {
        final result = ref
            .read(updateHealthEventProvider((id: widget.eventId!, data: data)));
        if (result is AsyncError) throw (result as AsyncError).error;
      } else {
        final result = ref.read(createHealthEventProvider(data));
        if (result is AsyncError) throw (result as AsyncError).error;
      }
      ref.invalidate(healthEventListProvider);
      if (mounted) context.go('/health-events');
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
        title: Text(isEditing ? 'Editar Evento de Salud' : 'Nuevo Evento de Salud'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Cattle ID field
              TextFormField(
                controller: _cattleIdController,
                decoration: const InputDecoration(
                  labelText: 'ID de Ganado',
                ),
                validator: (v) =>
                    Validators.required(v, fieldName: 'ID de Ganado'),
              ),
              const SizedBox(height: 16),

              // Type dropdown
              DropdownButtonFormField<HealthEventType>(
                value: _type,
                decoration: const InputDecoration(
                  labelText: 'Tipo de Evento',
                ),
                items: HealthEventType.values
                    .map((t) => DropdownMenuItem(
                          value: t,
                          child: Text(_getTypeLabel(t)),
                        ))
                    .toList(),
                onChanged: (v) => setState(() => _type = v),
                validator: (v) => v == null ? 'Please select a type' : null,
              ),
              const SizedBox(height: 16),

              // Event name field
              TextFormField(
                controller: _nameController,
                decoration: const InputDecoration(
                  labelText: 'Nombre del Evento',
                ),
                validator: (v) =>
                    Validators.required(v, fieldName: 'Nombre del Evento'),
              ),
              const SizedBox(height: 16),

              // Event date picker
              ListTile(
                contentPadding: EdgeInsets.zero,
                title: Text(
                  _eventDate == null
                      ? 'Seleccionar Fecha del Evento'
                      : 'Fecha del Evento: ${_formatDate(_eventDate!)}',
                ),
                trailing: const Icon(Icons.calendar_today),
                onTap: () => _selectDate(context, false),
              ),
              const SizedBox(height: 16),

              // Description field
              TextFormField(
                controller: _descriptionController,
                decoration: const InputDecoration(
                  labelText: 'Descripción',
                ),
                maxLines: 2,
              ),
              const SizedBox(height: 16),

              // Medication field
              TextFormField(
                controller: _medicationController,
                decoration: const InputDecoration(
                  labelText: 'Medicamento',
                ),
              ),
              const SizedBox(height: 16),

              // Dosage field
              TextFormField(
                controller: _dosageController,
                decoration: const InputDecoration(
                  labelText: 'Dosis',
                ),
              ),
              const SizedBox(height: 16),

              // Diagnosis field
              TextFormField(
                controller: _diagnosisController,
                decoration: const InputDecoration(
                  labelText: 'Diagnóstico',
                ),
              ),
              const SizedBox(height: 16),

              // Veterinarian field
              TextFormField(
                controller: _veterinarianController,
                decoration: const InputDecoration(
                  labelText: 'Veterinario',
                ),
              ),
              const SizedBox(height: 16),

              // Cost field
              TextFormField(
                controller: _costController,
                decoration: const InputDecoration(
                  labelText: 'Costo (\$)',
                ),
                keyboardType: TextInputType.number,
                validator: (v) {
                  if (v == null || v.isEmpty) return null;
                  return Validators.positiveNumber(v);
                },
              ),
              const SizedBox(height: 16),

              // Follow-up date picker
              ListTile(
                contentPadding: EdgeInsets.zero,
                title: Text(
                  _followUpDate == null
                      ? 'Seleccionar Fecha de Seguimiento (Opcional)'
                      : 'Fecha de Seguimiento: ${_formatDate(_followUpDate!)}',
                ),
                trailing: const Icon(Icons.calendar_today),
                onTap: () => _selectDate(context, true),
              ),
              const SizedBox(height: 16),

              // Status dropdown
              DropdownButtonFormField<String>(
                value: _status,
                decoration: const InputDecoration(
                  labelText: 'Estado',
                ),
                items: const [
                  DropdownMenuItem(value: 'scheduled', child: Text('Programado')),
                  DropdownMenuItem(value: 'completed', child: Text('Completado')),
                  DropdownMenuItem(
                      value: 'followup_required',
                      child: Text('Seguimiento Requerido')),
                ]
                    .toList(),
                onChanged: (v) => setState(() => _status = v),
              ),
              const SizedBox(height: 16),

              // Notes field
              TextFormField(
                controller: _notesController,
                decoration: const InputDecoration(
                  labelText: 'Notas',
                ),
                maxLines: 3,
              ),
              const SizedBox(height: 24),

              // Submit button
              FilledButton(
                onPressed: _isSubmitting ? null : _submit,
                child: Padding(
                  padding: const EdgeInsets.symmetric(vertical: 12),
                  child: _isSubmitting
                      ? const SizedBox(
                          height: 20,
                          width: 20,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                          ),
                        )
                      : Text(isEditing ? 'Actualizar Evento' : 'Crear Evento'),
                ),
              ),
              const SizedBox(height: 16),

              // Cancel button
              OutlinedButton(
                onPressed: _isSubmitting ? null : () => context.go('/health-events'),
                child: const Padding(
                  padding: EdgeInsets.symmetric(vertical: 12),
                  child: Text('Cancelar'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  String _getTypeLabel(HealthEventType type) {
    switch (type) {
      case HealthEventType.vaccination:
        return 'Vaccination';
      case HealthEventType.deworming:
        return 'Deworming';
      case HealthEventType.treatment:
        return 'Treatment';
      case HealthEventType.injury:
        return 'Injury';
      case HealthEventType.disease:
        return 'Disease';
      case HealthEventType.checkup:
        return 'Checkup';
      case HealthEventType.surgery:
        return 'Surgery';
      case HealthEventType.other:
        return 'Other';
    }
  }

  String _formatDate(DateTime date) {
    return '${date.day}/${date.month}/${date.year}';
  }
}
