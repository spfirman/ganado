import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:ganado_app/core/network/api_client.dart';
import 'package:ganado_app/shared/utils/validators.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class SaleFormScreen extends ConsumerStatefulWidget {
  final String? saleId;

  const SaleFormScreen({super.key, this.saleId});

  @override
  ConsumerState<SaleFormScreen> createState() => _SaleFormScreenState();
}

class _SaleFormScreenState extends ConsumerState<SaleFormScreen> {
  final _formKey = GlobalKey<FormState>();
  final _buyerNameController = TextEditingController();
  final _buyerNitController = TextEditingController();
  final _commentsController = TextEditingController();
  bool _isSubmitting = false;

  @override
  void dispose() {
    _buyerNameController.dispose();
    _buyerNitController.dispose();
    _commentsController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _isSubmitting = true);

    try {
      final api = ref.read(apiClientProvider);
      await api.post('/sales', data: {
        'buyer_name': _buyerNameController.text.trim(),
        'buyer_nit': _buyerNitController.text.trim().isEmpty
            ? null
            : _buyerNitController.text.trim(),
        'comments': _commentsController.text.trim().isEmpty
            ? null
            : _commentsController.text.trim(),
      });
      if (mounted) context.go('/sales');
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context)
            .showSnackBar(SnackBar(content: Text('Error: $e')));
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
              controller: _buyerNameController,
              decoration: const InputDecoration(labelText: 'Comprador'),
              validator: (v) => Validators.required(v, fieldName: 'Comprador'),
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _buyerNitController,
              decoration: InputDecoration(labelText: l10n.nit),
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
