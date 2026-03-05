import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:ganado_app/features/cattle/models/cattle.dart';
import 'package:ganado_app/features/cattle/providers/cattle_provider.dart';
import 'package:ganado_app/shared/utils/validators.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class CattleFormScreen extends ConsumerStatefulWidget {
  final String? cattleId;

  const CattleFormScreen({super.key, this.cattleId});

  @override
  ConsumerState<CattleFormScreen> createState() => _CattleFormScreenState();
}

class _CattleFormScreenState extends ConsumerState<CattleFormScreen> {
  final _formKey = GlobalKey<FormState>();
  final _numberController = TextEditingController();
  final _weightController = TextEditingController();
  final _eartagLeftController = TextEditingController();
  final _eartagRightController = TextEditingController();
  final _commentsController = TextEditingController();

  CattleGender? _gender;
  CattleColor? _color;
  bool _castrated = false;
  bool _hasHorn = false;
  bool _isSubmitting = false;

  bool get isEditing => widget.cattleId != null;

  @override
  void initState() {
    super.initState();
    if (isEditing) {
      _loadCattle();
    }
  }

  Future<void> _loadCattle() async {
    final cattle =
        await ref.read(cattleDetailProvider(widget.cattleId!).future);
    _numberController.text = cattle.number;
    _weightController.text = cattle.lastWeight.toString();
    _eartagLeftController.text = cattle.eartagLeft ?? '';
    _eartagRightController.text = cattle.eartagRight ?? '';
    _commentsController.text = cattle.comments ?? '';
    setState(() {
      _gender = cattle.gender;
      _color = cattle.color;
      _castrated = cattle.castrated;
      _hasHorn = cattle.hasHorn;
    });
  }

  @override
  void dispose() {
    _numberController.dispose();
    _weightController.dispose();
    _eartagLeftController.dispose();
    _eartagRightController.dispose();
    _commentsController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isSubmitting = true);

    final data = {
      'number': _numberController.text.trim(),
      'received_weight': double.tryParse(_weightController.text) ?? 0,
      'eartag_left': _eartagLeftController.text.trim().isEmpty
          ? null
          : _eartagLeftController.text.trim(),
      'eartag_right': _eartagRightController.text.trim().isEmpty
          ? null
          : _eartagRightController.text.trim(),
      'gender': _gender?.name,
      'color': _color?.name,
      'castrated': _castrated,
      'has_horn': _hasHorn,
      'comments': _commentsController.text.trim().isEmpty
          ? null
          : _commentsController.text.trim(),
    };

    try {
      if (isEditing) {
        await ref
            .read(cattleApiRepositoryProvider)
            .update(widget.cattleId!, data);
      } else {
        await ref.read(createCattleProvider(data).future);
      }
      ref.invalidate(cattleListProvider);
      if (mounted) context.go('/cattle');
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

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Form(
        key: _formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            TextFormField(
              controller: _numberController,
              decoration: InputDecoration(labelText: l10n.cattleNumber),
              validator: (v) =>
                  Validators.required(v, fieldName: l10n.cattleNumber),
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _weightController,
              decoration: InputDecoration(
                labelText: '${l10n.weight} (kg)',
              ),
              keyboardType: TextInputType.number,
              validator: (v) => Validators.positiveNumber(v),
            ),
            const SizedBox(height: 16),
            DropdownButtonFormField<CattleGender>(
              value: _gender,
              decoration: InputDecoration(labelText: l10n.gender),
              items: CattleGender.values
                  .map((g) => DropdownMenuItem(
                        value: g,
                        child: Text(g == CattleGender.male
                            ? l10n.male
                            : l10n.female),
                      ))
                  .toList(),
              onChanged: (v) => setState(() => _gender = v),
            ),
            const SizedBox(height: 16),
            DropdownButtonFormField<CattleColor>(
              value: _color,
              decoration: InputDecoration(labelText: l10n.color),
              items: CattleColor.values
                  .map((c) => DropdownMenuItem(
                        value: c,
                        child: Text(c.name),
                      ))
                  .toList(),
              onChanged: (v) => setState(() => _color = v),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: TextFormField(
                    controller: _eartagLeftController,
                    decoration:
                        InputDecoration(labelText: '${l10n.eartag} Izq.'),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: TextFormField(
                    controller: _eartagRightController,
                    decoration:
                        InputDecoration(labelText: '${l10n.eartag} Der.'),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            SwitchListTile(
              title: Text(l10n.castrated),
              value: _castrated,
              onChanged: (v) => setState(() => _castrated = v),
            ),
            SwitchListTile(
              title: const Text('Tiene cuernos'),
              value: _hasHorn,
              onChanged: (v) => setState(() => _hasHorn = v),
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _commentsController,
              decoration: InputDecoration(labelText: l10n.comments),
              maxLines: 3,
            ),
            const SizedBox(height: 24),
            FilledButton(
              onPressed: _isSubmitting ? null : _submit,
              child: _isSubmitting
                  ? const CircularProgressIndicator()
                  : Text(l10n.save),
            ),
          ],
        ),
      ),
    );
  }
}
