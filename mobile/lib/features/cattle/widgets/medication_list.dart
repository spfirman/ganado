import 'package:flutter/material.dart';
import 'package:ganado_app/features/cattle/models/cattle.dart';
import 'package:intl/intl.dart';

class MedicationList extends StatelessWidget {
  final List<CattleMedicationHistory> medications;

  const MedicationList({super.key, required this.medications});

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: medications.length,
      itemBuilder: (context, index) {
        final med = medications[index];
        return Card(
          margin: const EdgeInsets.only(bottom: 8),
          child: ListTile(
            leading: const CircleAvatar(
              child: Icon(Icons.medication, size: 20),
            ),
            title: Text(med.medication),
            subtitle: Text(
              '${med.dosage ?? '-'}  |  ${DateFormat('dd/MM/yyyy').format(med.appliedAt)}',
            ),
            trailing: med.appliedBy != null
                ? Text(med.appliedBy!,
                    style: Theme.of(context).textTheme.bodySmall)
                : null,
          ),
        );
      },
    );
  }
}
