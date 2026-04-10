import SwiftUI

struct MarketView: View {
    @StateObject private var viewModel = MarketViewModel()
    @State private var showingSales = true

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 40) {
                    marketSummary
                    segmentToggle
                    if showingSales {
                        salesSection
                    } else {
                        purchasesSection
                    }
                }
                .padding(60)
            }
            .navigationTitle("Market")
            .task {
                await viewModel.loadMarketData()
            }
        }
    }

    private var marketSummary: some View {
        HStack(spacing: 30) {
            StatCard(title: "Total Purchased", value: "\(viewModel.totalAnimalsPurchased)", icon: "arrow.down.circle.fill", color: .blue)
            StatCard(title: "Purchase Value", value: formatCurrency(viewModel.totalPurchaseValue), icon: "banknote.fill", color: .blue)
            StatCard(title: "Total Sold", value: "\(viewModel.totalAnimalsSold)", icon: "arrow.up.circle.fill", color: .green)
            StatCard(title: "Sale Value", value: formatCurrency(viewModel.totalSaleValue), icon: "banknote.fill", color: .green)
        }
    }

    private var segmentToggle: some View {
        HStack(spacing: 20) {
            FilterButton(label: "Sales (\(viewModel.sales.count))", isSelected: showingSales) {
                showingSales = true
            }
            FilterButton(label: "Purchases (\(viewModel.purchases.count))", isSelected: !showingSales) {
                showingSales = false
            }
        }
    }

    private var salesSection: some View {
        LazyVGrid(columns: [
            GridItem(.adaptive(minimum: 350), spacing: 20)
        ], spacing: 20) {
            ForEach(viewModel.sales) { sale in
                SaleCard(sale: sale)
            }
        }
    }

    private var purchasesSection: some View {
        LazyVGrid(columns: [
            GridItem(.adaptive(minimum: 350), spacing: 20)
        ], spacing: 20) {
            ForEach(viewModel.purchases) { purchase in
                PurchaseCard(purchase: purchase)
            }
        }
    }

    private func formatCurrency(_ value: Double) -> String {
        let formatter = NumberFormatter()
        formatter.numberStyle = .currency
        formatter.currencyCode = "COP"
        formatter.maximumFractionDigits = 0
        return formatter.string(from: NSNumber(value: value)) ?? "$0"
    }
}

struct SaleCard: View {
    let sale: Sale

    var body: some View {
        Button { } label: {
            VStack(alignment: .leading, spacing: 10) {
                HStack {
                    Image(systemName: "arrow.up.circle.fill")
                        .foregroundStyle(.green)
                    Text(sale.buyerName ?? "Unknown Buyer")
                        .fontWeight(.semibold)
                    Spacer()
                    Text(sale.status?.capitalized ?? "")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }

                HStack {
                    Label("\(sale.totalAnimals ?? 0) head", systemImage: "pawprint")
                    Spacer()
                    if let weight = sale.totalWeight {
                        Text(String(format: "%.0f kg", weight))
                            .foregroundStyle(.secondary)
                    }
                }
                .font(.subheadline)

                HStack {
                    if let price = sale.totalPrice {
                        Text(String(format: "$%.0f", price))
                            .font(.title3)
                            .fontWeight(.bold)
                            .foregroundStyle(.green)
                    }
                    Spacer()
                    if let date = sale.saleDate {
                        Text(date)
                            .font(.caption)
                            .foregroundStyle(.secondary)
                    }
                }
            }
            .padding()
            .frame(height: 160)
        }
        .buttonStyle(.card)
    }
}

struct PurchaseCard: View {
    let purchase: Purchase

    var body: some View {
        Button { } label: {
            VStack(alignment: .leading, spacing: 10) {
                HStack {
                    Image(systemName: "arrow.down.circle.fill")
                        .foregroundStyle(.blue)
                    Text(purchase.providerName ?? "Unknown Provider")
                        .fontWeight(.semibold)
                    Spacer()
                    Text(purchase.status?.capitalized ?? "")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }

                HStack {
                    Label("\(purchase.totalAnimals ?? 0) head", systemImage: "pawprint")
                    Spacer()
                    if let weight = purchase.totalWeight {
                        Text(String(format: "%.0f kg", weight))
                            .foregroundStyle(.secondary)
                    }
                }
                .font(.subheadline)

                HStack {
                    if let price = purchase.totalPrice {
                        Text(String(format: "$%.0f", price))
                            .font(.title3)
                            .fontWeight(.bold)
                            .foregroundStyle(.blue)
                    }
                    Spacer()
                    if let date = purchase.purchaseDate {
                        Text(date)
                            .font(.caption)
                            .foregroundStyle(.secondary)
                    }
                }
            }
            .padding()
            .frame(height: 160)
        }
        .buttonStyle(.card)
    }
}
