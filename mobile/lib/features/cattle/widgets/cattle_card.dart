import 'package:flutter/material.dart';
import 'package:ganado_app/features/cattle/models/cattle.dart';

class CattleCard extends StatelessWidget {
  final Cattle cattle;
  final VoidCallback? onTap;

  const CattleCard({super.key, required this.cattle, this.onTap});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: ListTile(
        onTap: onTap,
        leading: CircleAvatar(
          backgroundColor: _statusColor(cattle.status),
          child: Text(
            cattle.number.length > 2
                ? cattle.number.substring(cattle.number.length - 2)
                : cattle.number,
            style: const TextStyle(
                color: Colors.white, fontWeight: FontWeight.bold),
          ),
        ),
        title: Text('#${cattle.number}'),
        subtitle: Text(
          '${cattle.lastWeight} kg  |  ${cattle.gender?.name ?? '-'}  |  ${cattle.color?.name ?? '-'}',
        ),
        trailing: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [
            Chip(
              label: Text(
                cattle.status.name,
                style: const TextStyle(fontSize: 10),
              ),
              visualDensity: VisualDensity.compact,
              padding: EdgeInsets.zero,
            ),
          ],
        ),
      ),
    );
  }

  Color _statusColor(CattleStatus status) {
    switch (status) {
      case CattleStatus.active:
        return Colors.green;
      case CattleStatus.sold:
        return Colors.blue;
      case CattleStatus.dead:
        return Colors.red;
      case CattleStatus.transferred:
        return Colors.orange;
    }
  }
}
