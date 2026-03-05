import 'package:json_annotation/json_annotation.dart';

part 'sale.g.dart';

@JsonSerializable()
class Sale {
  final String id;
  @JsonKey(name: 'buyer_name')
  final String? buyerName;
  @JsonKey(name: 'buyer_nit')
  final String? buyerNit;
  final String? status;
  @JsonKey(name: 'total_weight')
  final double? totalWeight;
  @JsonKey(name: 'total_price')
  final double? totalPrice;
  @JsonKey(name: 'total_animals')
  final int? totalAnimals;
  @JsonKey(name: 'sale_date')
  final DateTime? saleDate;
  final String? comments;
  @JsonKey(name: 'created_at')
  final DateTime? createdAt;

  Sale({
    required this.id,
    this.buyerName,
    this.buyerNit,
    this.status,
    this.totalWeight,
    this.totalPrice,
    this.totalAnimals,
    this.saleDate,
    this.comments,
    this.createdAt,
  });

  factory Sale.fromJson(Map<String, dynamic> json) => _$SaleFromJson(json);
  Map<String, dynamic> toJson() => _$SaleToJson(this);
}
