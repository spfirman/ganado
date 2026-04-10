import SwiftUI

struct CommerceView: View {
    @State private var selectedSection = 0

    var body: some View {
        NavigationStack {
            VStack {
                Picker("Section", selection: $selectedSection) {
                    Text("Purchases").tag(0)
                    Text("Sales").tag(1)
                }
                .pickerStyle(.segmented)
                .padding(.horizontal)

                switch selectedSection {
                case 0: PurchaseListView()
                case 1: SaleListView()
                default: EmptyView()
                }
            }
            .navigationTitle("Commerce")
        }
    }
}

struct PurchaseListView: View {
    @StateObject private var viewModel = CommerceViewModel()

    var body: some View {
        List(viewModel.purchases) { purchase in
            HStack(spacing: 12) {
                Image(systemName: "cart.fill")
                    .font(.title3)
                    .foregroundStyle(.blue)
                    .frame(width: 36)

                VStack(alignment: .leading, spacing: 4) {
                    Text(purchase.providerName ?? "Unknown Provider")
                        .fontWeight(.medium)
                    Text("\(purchase.totalAnimals ?? 0) animals")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }

                Spacer()

                VStack(alignment: .trailing, spacing: 4) {
                    if let price = purchase.totalPrice {
                        Text("$\(String(format: "%.0f", price))")
                            .fontWeight(.semibold)
                    }
                    if let weight = purchase.totalWeight {
                        Text("\(String(format: "%.0f", weight)) kg")
                            .font(.caption)
                            .foregroundStyle(.secondary)
                    }
                    if let date = purchase.purchaseDate {
                        Text(String(date.prefix(10)))
                            .font(.caption2)
                            .foregroundStyle(.secondary)
                    }
                }
            }
            .padding(.vertical, 4)
        }
        .task { await viewModel.loadPurchases() }
        .refreshable { await viewModel.loadPurchases() }
        .overlay {
            if viewModel.isLoading && viewModel.purchases.isEmpty {
                LoadingView(message: "Loading purchases...")
            } else if viewModel.purchases.isEmpty && !viewModel.isLoading {
                ContentUnavailableView("No Purchases", systemImage: "cart", description: Text("Purchase records will appear here."))
            }
        }
    }
}

struct SaleListView: View {
    @StateObject private var viewModel = CommerceViewModel()

    var body: some View {
        List(viewModel.sales) { sale in
            HStack(spacing: 12) {
                Image(systemName: "banknote.fill")
                    .font(.title3)
                    .foregroundStyle(.green)
                    .frame(width: 36)

                VStack(alignment: .leading, spacing: 4) {
                    Text(sale.buyerName ?? "Unknown Buyer")
                        .fontWeight(.medium)
                    Text("\(sale.totalAnimals ?? 0) animals")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }

                Spacer()

                VStack(alignment: .trailing, spacing: 4) {
                    if let price = sale.totalPrice {
                        Text("$\(String(format: "%.0f", price))")
                            .fontWeight(.semibold)
                            .foregroundStyle(.green)
                    }
                    if let weight = sale.totalWeight {
                        Text("\(String(format: "%.0f", weight)) kg")
                            .font(.caption)
                            .foregroundStyle(.secondary)
                    }
                    if let date = sale.saleDate {
                        Text(String(date.prefix(10)))
                            .font(.caption2)
                            .foregroundStyle(.secondary)
                    }
                }
            }
            .padding(.vertical, 4)
        }
        .task { await viewModel.loadSales() }
        .refreshable { await viewModel.loadSales() }
        .overlay {
            if viewModel.isLoading && viewModel.sales.isEmpty {
                LoadingView(message: "Loading sales...")
            } else if viewModel.sales.isEmpty && !viewModel.isLoading {
                ContentUnavailableView("No Sales", systemImage: "banknote", description: Text("Sale records will appear here."))
            }
        }
    }
}
