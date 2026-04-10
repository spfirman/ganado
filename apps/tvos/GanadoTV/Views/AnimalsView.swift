import SwiftUI

struct AnimalsView: View {
    @StateObject private var viewModel = HerdViewModel()
    @State private var selectedAnimal: Cattle?

    var body: some View {
        NavigationSplitView {
            animalList
                .navigationTitle("Animals")
        } detail: {
            if let animal = selectedAnimal {
                AnimalDetailView(animal: animal)
            } else {
                Text("Select an animal")
                    .foregroundStyle(.secondary)
            }
        }
        .task {
            await viewModel.loadCattle(reset: true)
        }
        .searchable(text: $viewModel.searchText)
        .onSubmit(of: .search) {
            Task { await viewModel.loadCattle(reset: true) }
        }
    }

    private var animalList: some View {
        ScrollView {
            LazyVGrid(columns: [
                GridItem(.adaptive(minimum: 300), spacing: 20)
            ], spacing: 20) {
                ForEach(viewModel.cattle) { animal in
                    CattleCard(animal: animal)
                        .onTapGesture {
                            selectedAnimal = animal
                        }
                }

                if viewModel.hasMore && !viewModel.isLoading {
                    ProgressView()
                        .task {
                            await viewModel.loadCattle()
                        }
                }
            }
            .padding(40)
        }
    }
}

struct CattleCard: View {
    let animal: Cattle

    var body: some View {
        Button { } label: {
            HStack(spacing: 20) {
                cattleImage

                VStack(alignment: .leading, spacing: 8) {
                    Text("#\(animal.displayNumber)")
                        .font(.title3)
                        .fontWeight(.bold)

                    HStack(spacing: 12) {
                        Label(animal.gender?.rawValue.capitalized ?? "Unknown", systemImage: animal.gender == .male ? "bolt.fill" : "heart.fill")
                            .font(.caption)
                            .foregroundStyle(animal.gender == .male ? .blue : .pink)

                        if let color = animal.color {
                            Text(color.rawValue.capitalized)
                                .font(.caption)
                                .foregroundStyle(.secondary)
                        }
                    }

                    Text(animal.displayWeight)
                        .font(.headline)

                    statusBadge
                }

                Spacer()
            }
            .padding()
            .frame(height: 160)
        }
        .buttonStyle(.card)
    }

    private var cattleImage: some View {
        ZStack {
            RoundedRectangle(cornerRadius: 12)
                .fill(Color(animal.statusColor).opacity(0.15))
                .frame(width: 100, height: 120)

            Image(systemName: "pawprint.fill")
                .font(.system(size: 40))
                .foregroundStyle(Color(animal.statusColor).opacity(0.6))
        }
    }

    private var statusBadge: some View {
        Text(animal.status?.rawValue.capitalized ?? "Unknown")
            .font(.caption2)
            .fontWeight(.medium)
            .padding(.horizontal, 10)
            .padding(.vertical, 4)
            .background(Color(animal.statusColor).opacity(0.2))
            .clipShape(Capsule())
    }
}

struct AnimalDetailView: View {
    let animal: Cattle

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 30) {
                headerSection
                detailsGrid
                weightHistorySection
                medicationHistorySection
            }
            .padding(60)
        }
        .navigationTitle("Animal #\(animal.displayNumber)")
    }

    private var headerSection: some View {
        HStack(spacing: 30) {
            ZStack {
                RoundedRectangle(cornerRadius: 20)
                    .fill(Color(animal.statusColor).opacity(0.15))
                    .frame(width: 200, height: 200)

                Image(systemName: "pawprint.fill")
                    .font(.system(size: 80))
                    .foregroundStyle(Color(animal.statusColor).opacity(0.6))
            }

            VStack(alignment: .leading, spacing: 12) {
                Text("#\(animal.displayNumber)")
                    .font(.largeTitle)
                    .fontWeight(.bold)

                HStack(spacing: 20) {
                    Label(animal.gender?.rawValue.capitalized ?? "Unknown",
                          systemImage: animal.gender == .male ? "bolt.fill" : "heart.fill")
                        .foregroundStyle(animal.gender == .male ? .blue : .pink)

                    Text(animal.status?.rawValue.capitalized ?? "Unknown")
                        .padding(.horizontal, 12)
                        .padding(.vertical, 6)
                        .background(Color(animal.statusColor).opacity(0.2))
                        .clipShape(Capsule())
                }

                Text(animal.displayWeight)
                    .font(.title2)
                    .fontWeight(.semibold)
            }
        }
    }

    private var detailsGrid: some View {
        LazyVGrid(columns: [
            GridItem(.flexible()),
            GridItem(.flexible()),
            GridItem(.flexible())
        ], spacing: 20) {
            DetailItem(label: "Color", value: animal.color?.rawValue.capitalized ?? "N/A")
            DetailItem(label: "Ear Tag L", value: animal.eartagLeft ?? "N/A")
            DetailItem(label: "Ear Tag R", value: animal.eartagRight ?? "N/A")
            DetailItem(label: "Castrated", value: animal.castrated == true ? "Yes" : "No")
            DetailItem(label: "Has Horns", value: animal.hasHorn == true ? "Yes" : "No")
            DetailItem(label: "Purchase Weight", value: animal.purchaseWeight.map { String(format: "%.0f kg", $0) } ?? "N/A")
            DetailItem(label: "Purchase Price", value: animal.purchasePrice.map { String(format: "$%.0f", $0) } ?? "N/A")
            DetailItem(label: "ADG", value: animal.averageDailyGain.map { String(format: "%.2f kg/day", $0) } ?? "N/A")
            DetailItem(label: "Birth Date", value: animal.birthDateAprx ?? "N/A")
        }
    }

    private var weightHistorySection: some View {
        Group {
            if let history = animal.weightHistory, !history.isEmpty {
                VStack(alignment: .leading, spacing: 16) {
                    Text("Weight History")
                        .font(.title3)
                        .fontWeight(.bold)

                    ForEach(history) { record in
                        HStack {
                            Text(String(format: "%.0f kg", record.weight))
                                .fontWeight(.semibold)
                            Spacer()
                            Text(record.weighedAt ?? "")
                                .foregroundStyle(.secondary)
                        }
                        .padding(.vertical, 4)
                        Divider()
                    }
                }
            }
        }
    }

    private var medicationHistorySection: some View {
        Group {
            if let history = animal.medicationHistory, !history.isEmpty {
                VStack(alignment: .leading, spacing: 16) {
                    Text("Medication History")
                        .font(.title3)
                        .fontWeight(.bold)

                    ForEach(history) { record in
                        HStack {
                            VStack(alignment: .leading) {
                                Text(record.medication ?? "Unknown")
                                    .fontWeight(.semibold)
                                if let dosage = record.dosage {
                                    Text(dosage)
                                        .font(.caption)
                                        .foregroundStyle(.secondary)
                                }
                            }
                            Spacer()
                            Text(record.appliedAt ?? "")
                                .foregroundStyle(.secondary)
                        }
                        .padding(.vertical, 4)
                        Divider()
                    }
                }
            }
        }
    }
}

struct DetailItem: View {
    let label: String
    let value: String

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(label)
                .font(.caption)
                .foregroundStyle(.secondary)
            Text(value)
                .fontWeight(.medium)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }
}
