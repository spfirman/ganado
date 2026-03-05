import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import 'package:ganado_app/features/cattle/models/cattle.dart';
import 'package:intl/intl.dart';

class WeightChart extends StatelessWidget {
  final List<CattleWeightHistory> weightHistory;

  const WeightChart({super.key, required this.weightHistory});

  @override
  Widget build(BuildContext context) {
    if (weightHistory.isEmpty) return const SizedBox.shrink();

    final sorted = [...weightHistory]
      ..sort((a, b) => a.weighedAt.compareTo(b.weighedAt));

    final spots = sorted
        .asMap()
        .entries
        .map((e) => FlSpot(e.key.toDouble(), e.value.weight))
        .toList();

    return LineChart(
      LineChartData(
        gridData: const FlGridData(show: true),
        titlesData: FlTitlesData(
          leftTitles: const AxisTitles(
            sideTitles: SideTitles(showTitles: true, reservedSize: 50),
          ),
          bottomTitles: AxisTitles(
            sideTitles: SideTitles(
              showTitles: true,
              reservedSize: 30,
              getTitlesWidget: (value, meta) {
                final idx = value.toInt();
                if (idx >= 0 && idx < sorted.length) {
                  return Padding(
                    padding: const EdgeInsets.only(top: 4),
                    child: Text(
                      DateFormat('dd/MM').format(sorted[idx].weighedAt),
                      style: const TextStyle(fontSize: 9),
                    ),
                  );
                }
                return const SizedBox.shrink();
              },
            ),
          ),
          topTitles:
              const AxisTitles(sideTitles: SideTitles(showTitles: false)),
          rightTitles:
              const AxisTitles(sideTitles: SideTitles(showTitles: false)),
        ),
        borderData: FlBorderData(show: false),
        lineBarsData: [
          LineChartBarData(
            spots: spots,
            isCurved: true,
            color: Theme.of(context).colorScheme.primary,
            barWidth: 3,
            dotData: const FlDotData(show: true),
            belowBarData: BarAreaData(
              show: true,
              color: Theme.of(context).colorScheme.primary.withOpacity(0.1),
            ),
          ),
        ],
      ),
    );
  }
}
