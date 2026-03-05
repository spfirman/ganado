import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:ganado_app/core/network/api_client.dart';
import 'package:ganado_app/features/commerce/purchases/providers/purchase_provider.dart';
import 'package:ganado_app/shared/utils/validators.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class PurchaseFormScreen extends ConsumerStatefulWidget {
  final String? purchaseId;

  const PurchaseFormScreen({super.key, this.purchaseId});

  @override
  ConsumerState<PurchaseFormScreen> createState() => _PurchaseFormScreenState();
}

class _PurchaseFormScreenState extends ConsumerState<PurchaseFormScreen> {
  final _formKey = GlobalKey<FormState>();
  final _providerNameController = TextEditingController();
  final _commentsController = TextEditingController();
  bool _isSubmitting = false;

  @override
  void dispose() {
    _providerNameController.dispose();
    _commentsController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _isSubmitting = true);

    final data = {
      'provider_name': _providerNameController.text.trim(),
      'comments': _commentsController.text.trim().isEmpty
          ? null
          : _commentsController.text.trim(),
    };

    try {
      final api = ref.read(apiClientProvider);
      if (widget.purchaseId != null) {
        await api.patch('/purchases/${widget.purchaseId}', data: data);
      } else {
        await api.post('/purchases', data: data);
      }
      ref.invalidate(purchaseListProvider);
      if (mounted) context.go('/purchases');
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
              controller: _providerNameController,
              decoration: InputDecoration(labelText: l10n.provider),
              validator: (v) =>
                  Validators.required(v, fieldName: l10n.provider),
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
