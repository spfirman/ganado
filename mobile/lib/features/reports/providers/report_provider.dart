import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:ganado_app/core/network/api_client.dart';

/// Model for report summary data
class ReportSummary {
  final String type;
  final String title;
  final String metric;
  final String value;
  final double trend; // percentage change
  final String unit;

  ReportSummary({
    required this.type,
    required this.title,
    required this.metric,
    required this.value,
    required this.trend,
    required this.unit,
  });

  factory ReportSummary.fromJson(Map<String, dynamic> json) {
    return ReportSummary(
      type: json['type'] as String,
      title: json['title'] as String,
      metric: json['metric'] as String,
      value: json['value'] as String,
      trend: (json['trend'] as num).toDouble(),
      unit: json['unit'] as String? ?? '',
    );
  }
}

/// Model for detailed report data
class ReportDetail {
  final String type;
  final String title;
  final String description;
  final Map<String, dynamic> data;
  final String generatedAt;

  ReportDetail({
    required this.type,
    required this.title,
    required this.description,
    required this.data,
    required this.generatedAt,
  });

  factory ReportDetail.fromJson(Map<String, dynamic> json) {
    return ReportDetail(
      type: json['type'] as String,
      title: json['title'] as String,
      description: json['description'] as String,
      data: json['data'] as Map<String, dynamic>,
      generatedAt: json['generatedAt'] as String,
    );
  }
}

/// Provider for report summary data with optional date range
/// Fetches from GET /reports/summary?from=...&to=...
final reportSummaryProvider =
    FutureProvider.family<List<ReportSummary>, ({String? from, String? to})>(
  (ref, dateRange) async {
    final api = ref.read(apiClientProvider);
    final params = <String, dynamic>{};

    if (dateRange.from != null) params['from'] = dateRange.from;
    if (dateRange.to != null) params['to'] = dateRange.to;

    final response = await api.get(
      '/reports/summary',
      queryParameters: params.isNotEmpty ? params : null,
    );

    final list = response.data as List<dynamic>;
    return list.map((item) => ReportSummary.fromJson(item as Map<String, dynamic>)).toList();
  },
);

/// Provider for detailed report data for a specific report type
/// Fetches from GET /reports/:type?from=...&to=...
final reportDetailProvider =
    FutureProvider.family<ReportDetail, ({String type, String? from, String? to})>(
  (ref, params) async {
    final api = ref.read(apiClientProvider);
    final queryParams = <String, dynamic>{};

    if (params.from != null) queryParams['from'] = params.from;
    if (params.to != null) queryParams['to'] = params.to;

    final response = await api.get(
      '/reports/${params.type}',
      queryParameters: queryParams.isNotEmpty ? queryParams : null,
    );

    return ReportDetail.fromJson(response.data as Map<String, dynamic>);
  },
);

/// Provider to invalidate all report caches (useful after refresh)
final reportCacheInvalidatorProvider = Provider((ref) {
  return () {
    ref.invalidate(reportSummaryProvider);
    ref.invalidate(reportDetailProvider);
  };
});
