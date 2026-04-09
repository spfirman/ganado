import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:ganado_app/features/work_orders/models/work_order.dart';
import 'package:ganado_app/features/work_orders/providers/work_order_provider.dart';
import 'package:ganado_app/l10n/app_localizations.dart';

class WorkOrderFormScreen extends ConsumerStatefulWidget {
  const WorkOrderFormScreen({super.key});

  @override
  ConsumerState<WorkOrderFormScreen> createState() =>
      _WorkOrderFormScreenState();
}

class _WorkOrderFormScreenState extends ConsumerState<WorkOrderFormScreen> {
  late TextEditingController _titleController;
  late TextEditingController _descriptionController;
  late TextEditingController _notesController;
  late TextEditingController _assigneeController;

  WorkOrderType _selectedType = WorkOrderType.general;
  WorkOrderPriority _selectedPriority = WorkOrderPriority.medium;
  DateTime? _selectedDueDate;

  @override
  void initState() {
    super.initState();
    _titleController = TextEditingController();
    _descriptionController = TextEditingController();
    _notesController = TextEditingController();
    _assigneeController = TextEditingController();
  }

  @override
  void dispose() {
    _titleController.dispose();
    _descriptionController.dispose();
    _notesController.dispose();
    _assigneeController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Crear Orden de Trabajo'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Title
            TextField(
              controller: _titleController,
              decoration: InputDecoration(
                labelText: 'Título',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
                prefixIcon: const Icon(Icons.title),
              ),
            ),
            const SizedBox(height: 16),

            // Description
            TextField(
              controller: _descriptionController,
              maxLines: 3,
              decoration: InputDecoration(
                labelText: 'Descripción',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
                prefixIcon: const Icon(Icons.description),
              ),
            ),
            const SizedBox(height: 16),

            // Type dropdown
            Text('Type', style: theme.textTheme.bodyMedium?.copyWith(
              fontWeight: FontWeight.bold,
            )),
            const SizedBox(height: 8),
            DropdownButtonFormField<WorkOrderType>(
              value: _selectedType,
              decoration: InputDecoration(
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
                prefixIcon: const Icon(Icons.category),
              ),
              items: WorkOrderType.values
                  .map((type) => DropdownMenuItem(
                        value: type,
                        child: Text(type.name.replaceFirst(
                          type.name[0],
                          type.name[0].toUpperCase(),
                        )),
                      ))
                  .toList(),
              onChanged: (type) {
                if (type != null) {
                  setState(() => _selectedType = type);
                }
              },
            ),
            const SizedBox(height: 16),

            // Priority dropdown
            Text('Priority', style: theme.textTheme.bodyMedium?.copyWith(
              fontWeight: FontWeight.bold,
            )),
            const SizedBox(height: 8),
            DropdownButtonFormField<WorkOrderPriority>(
              value: _selectedPriority,
              decoration: InputDecoration(
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
                prefixIcon: const Icon(Icons.flag),
              ),
              items: WorkOrderPriority.values
                  .map((priority) => DropdownMenuItem(
                        value: priority,
                        child: Text(priority.name.replaceFirst(
                          priority.name[0],
                          priority.name[0].toUpperCase(),
                        )),
                      ))
                  .toList(),
              onChanged: (priority) {
                if (priority != null) {
                  setState(() => _selectedPriority = priority);
                }
              },
            ),
            const SizedBox(height: 16),

            // Assigned to
            TextField(
              controller: _assigneeController,
              decoration: InputDecoration(
                labelText: 'Assign to',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
                prefixIcon: const Icon(Icons.person),
              ),
            ),
            const SizedBox(height: 16),

            // Due date picker
            Text('Due Date', style: theme.textTheme.bodyMedium?.copyWith(
              fontWeight: FontWeight.bold,
            )),
            const SizedBox(height: 8),
            OutlinedButton.icon(
              onPressed: () => _selectDueDate(context),
              icon: const Icon(Icons.calendar_today),
              label: Text(
                _selectedDueDate == null
                    ? 'Select Due Date'
                    : '${_selectedDueDate!.month}/${_selectedDueDate!.day}/${_selectedDueDate!.year}',
              ),
              style: OutlinedButton.styleFrom(
                minimumSize: const Size(double.infinity, 48),
              ),
            ),
            const SizedBox(height: 16),

            // Notes
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

  Future<void> _selectDueDate(BuildContext context) async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _selectedDueDate ?? DateTime.now(),
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 365)),
    );

    if (picked != null) {
      setState(() => _selectedDueDate = picked);
    }
  }

  void _submitForm() {
    if (_titleController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Title is required')),
      );
      return;
    }

    final data = {
      'title': _titleController.text,
      'description': _descriptionController.text,
      'type': _selectedType.name,
      'priority': _selectedPriority.name,
      'assigned_to_name': _assigneeController.text,
      'due_date': _selectedDueDate?.toIso8601String(),
      'notes': _notesController.text,
    };

    ref.read(createWorkOrderProvider(data)).when(
      data: (_) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Work order created successfully')),
        );
        context.go('/work-orders');
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
