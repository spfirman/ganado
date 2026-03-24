import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:ganado_app/core/network/api_client.dart';
import 'package:ganado_app/shared/utils/validators.dart';
import 'package:ganado_app/l10n/app_localizations.dart';

class ProviderFormScreen extends ConsumerStatefulWidget {
  final String? providerId;

  const ProviderFormScreen({super.key, this.providerId});

  @override
  ConsumerState<ProviderFormScreen> createState() => _ProviderFormScreenState();
}

class _ProviderFormScreenState extends ConsumerState<ProviderFormScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _nitController = TextEditingController();
  final _phoneController = TextEditingController();
  final _emailController = TextEditingController();
  final _addressController = TextEditingController();
  bool _isSubmitting = false;

  @override
  void dispose() {
    _nameController.dispose();
    _nitController.dispose();
    _phoneController.dispose();
    _emailController.dispose();
    _addressController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _isSubmitting = true);

    final data = {
      'name': _nameController.text.trim(),
      'nit': _nitController.text.trim().isEmpty ? null : _nitController.text.trim(),
      'phone': _phoneController.text.trim().isEmpty ? null : _phoneController.text.trim(),
      'email': _emailController.text.trim().isEmpty ? null : _emailController.text.trim(),
      'address': _addressController.text.trim().isEmpty ? null : _addressController.text.trim(),
    };

    try {
      final api = ref.read(apiClientProvider);
      if (widget.providerId != null) {
        await api.put('/providers/${widget.providerId}', data: data);
      } else {
        await api.post('/providers', data: data);
      }
      if (mounted) context.go('/providers');
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $e')));
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
              controller: _nameController,
              decoration: InputDecoration(labelText: l10n.provider),
              validator: (v) => Validators.required(v, fieldName: l10n.provider),
            ),
            const SizedBox(height: 16),
            TextFormField(controller: _nitController, decoration: InputDecoration(labelText: l10n.nit)),
            const SizedBox(height: 16),
            TextFormField(controller: _phoneController, decoration: const InputDecoration(labelText: 'Telefono'), keyboardType: TextInputType.phone),
            const SizedBox(height: 16),
            TextFormField(controller: _emailController, decoration: const InputDecoration(labelText: 'Email'), keyboardType: TextInputType.emailAddress, validator: Validators.email),
            const SizedBox(height: 16),
            TextFormField(controller: _addressController, decoration: const InputDecoration(labelText: 'Direccion')),
            const SizedBox(height: 24),
            FilledButton(
              onPressed: _isSubmitting ? null : _submit,
              child: _isSubmitting ? const CircularProgressIndicator() : Text(l10n.save),
            ),
          ],
        ),
      ),
    );
  }
}
