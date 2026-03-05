import 'package:json_annotation/json_annotation.dart';

part 'purchase.g.dart';

@JsonSerializable()
class Purchase {
  final String id;
  @JsonKey(name: 'id_tenant')
  final String? idTenant;
  @JsonKey(name: 'id_provider')
  final String? idProvider;
  @JsonKey(name: 'provider_name')
  final String? providerName;
  final String? status;
  @JsonKey(name: 'total_weight')
  final double? totalWeight;
  @JsonKey(name: 'total_price')
  final double? totalPrice;
  @JsonKey(name: 'total_animals')
  final int? totalAnimals;
  @JsonKey(name: 'purchase_date')
  final DateTime? purchaseDate;
  final String? comments;
  @JsonKey(name: 'created_at')
  final DateTime? createdAt;
  @JsonKey(name: 'updated_at')
  final DateTime? updatedAt;

  Purchase({
    required this.id,
    this.idTenant,
    this.idProvider,
    this.providerName,
    this.status,
    this.totalWeight,
    this.totalPrice,
    this.totalAnimals,
    this.purchaseDate,
    this.comments,
    this.createdAt,
    this.updatedAt,
  });

  factory Purchase.fromJson(Map<String, dynamic> json) =>
      _$PurchaseFromJson(json);
  Map<String, dynamic> toJson() => _$PurchaseToJson(this);
}
