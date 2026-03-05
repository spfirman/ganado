import 'package:json_annotation/json_annotation.dart';

part 'vendor.g.dart';

@JsonSerializable()
class Vendor {
  final String id;
  final String name;
  final String? nit;
  final String? type;
  final String? phone;
  final String? email;
  final String? address;
  @JsonKey(name: 'created_at')
  final DateTime? createdAt;

  Vendor({
    required this.id,
    required this.name,
    this.nit,
    this.type,
    this.phone,
    this.email,
    this.address,
    this.createdAt,
  });

  factory Vendor.fromJson(Map<String, dynamic> json) => _$VendorFromJson(json);
  Map<String, dynamic> toJson() => _$VendorToJson(this);
}
