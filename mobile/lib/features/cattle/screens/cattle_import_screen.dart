import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:ganado_app/features/cattle/repositories/cattle_api_repository.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class CattleImportScreen extends ConsumerStatefulWidget {
  const CattleImportScreen({super.key});

  @override
  ConsumerState<CattleImportScreen> createState() =>
      _CattleImportScreenState();
}

class _CattleImportScreenState extends ConsumerState<CattleImportScreen> {
  String? _fileName;
  String? _filePath;
  bool _isImporting = false;
  List<dynamic>? _results;
  String? _error;

  Future<void> _pickFile() async {
    final result = await FilePicker.platform.pickFiles(
      type: FileType.custom,
      allowedExtensions: ['xlsx', 'xls'],
    );

    if (result != null && result.files.single.path != null) {
      setState(() {
        _fileName = result.files.single.name;
        _filePath = result.files.single.path;
        _results = null;
        _error = null;
      });
    }
  }

  Future<void> _import() async {
    if (_filePath == null) return;

    setState(() {
      _isImporting = true;
      _error = null;
    });

    try {
      final results =
          await ref.read(cattleApiRepositoryProvider).importExcel(_filePath!);
      setState(() {
        _results = results;
        _isImporting = false;
      });
    } catch (e) {
      setState(() {
        _error = e.toString();
        _isImporting = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;

    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Card(
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                children: [
                  const Icon(Icons.upload_file, size: 48),
                  const SizedBox(height: 16),
                  Text(l10n.importExcel,
                      style: Theme.of(context).textTheme.titleMedium),
                  const SizedBox(height: 16),
                  OutlinedButton.icon(
                    onPressed: _pickFile,
                    icon: const Icon(Icons.file_open),
                    label: Text(_fileName ?? 'Seleccionar archivo'),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          FilledButton(
            onPressed: _filePath != null && !_isImporting ? _import : null,
            child: _isImporting
                ? const CircularProgressIndicator()
                : Text(l10n.importExcel),
          ),
          if (_error != null) ...[
            const SizedBox(height: 16),
            Text(_error!, style: TextStyle(color: Theme.of(context).colorScheme.error)),
          ],
          if (_results != null) ...[
            const SizedBox(height: 16),
            Text('Importados: ${_results!.length} registros',
                style: const TextStyle(color: Colors.green)),
          ],
        ],
      ),
    );
  }
}
