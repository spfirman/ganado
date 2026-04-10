import SwiftUI

struct CattleDetailView: View {
    let cattleId: String
    @StateObject private var viewModel = CattleViewModel()
    @Environment(\.openWindow) var openWindow
    @State private var showWeightSheet = false
    @State private var newWeight = ""

    var body: some View {
        NavigationStack {
            Group {
                if let cattle = viewModel.selectedCattle {
                    ScrollView {
                        VStack(spacing: 24) {
                            headerCard(cattle)
                            identificationSection(cattle)
                            weightSection(cattle)
                            medicationSection(cattle)
                        }
                        .padding(24)
                    }
                    .navigationTitle("Cattle #\(cattle.displayNumber)")
                } else if viewModel.isLoading {
                    LoadingView(message: "Loading cattle details...")
                } else {
                    ContentUnavailableView("Not Found", systemImage: "exclamationmark.triangle", description: Text("Cattle record not found."))
                }
            }
            .task { await viewModel.loadCattleDetail(id: cattleId) }
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button {
                        openWindow(id: "event-form", value: cattleId)
                    } label: {
                        Label("Add Event", systemImage: "plus.circle")
                    }
                }
            }
            .sheet(isPresented: $showWeightSheet) {
                VStack(spacing: 16) {
                    Text("Record Weight")
                        .font(.headline)
                    TextField("Weight (kg)", text: $newWeight)
                        .textFieldStyle(.roundedBorder)
                        .keyboardType(.decimalPad)
                    HStack {
                        Button("Cancel") { showWeightSheet = false }
                        Button("Save") {
                            if let weight = Double(newWeight) {
                                Task { await viewModel.recordWeight(cattleId: cattleId, weight: weight) }
                                showWeightSheet = false
                                newWeight = ""
                            }
                        }
                        .buttonStyle(.borderedProminent)
                    }
                }
                .padding(24)
            }
        }
    }

    private func headerCard(_ cattle: Cattle) -> some View {
        HStack(spacing: 20) {
            Circle()
                .fill(cattle.gender == .male ? Color.indigo : Color.pink)
                .frame(width: 80, height: 80)
                .overlay {
                    VStack {
                        Image(systemName: "pawprint.fill")
                            .font(.title)
                        Text(cattle.gender?.rawValue.prefix(1).uppercased() ?? "?")
                            .font(.caption)
                    }
                    .foregroundStyle(.white)
                }

            VStack(alignment: .leading, spacing: 8) {
                Text("#\(cattle.displayNumber)")
                    .font(.largeTitle)
                    .fontWeight(.bold)
                HStack {
                    if let status = cattle.status {
                        Text(status.rawValue.capitalized)
                            .font(.subheadline)
                            .padding(.horizontal, 10)
                            .padding(.vertical, 4)
                            .background(.green.opacity(0.2), in: Capsule())
                    }
                    if let color = cattle.color {
                        Text(color.rawValue.capitalized)
                            .font(.subheadline)
                            .foregroundStyle(.secondary)
                    }
                }
            }

            Spacer()

            VStack(alignment: .trailing, spacing: 4) {
                if let weight = cattle.lastWeight {
                    Text("\(Int(weight)) kg")
                        .font(.title)
                        .fontWeight(.semibold)
                    Text("Last weight")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
                if let adg = cattle.averageDailyGain {
                    Text("+\(String(format: "%.2f", adg)) kg/day")
                        .font(.subheadline)
                        .foregroundStyle(.green)
                }
            }
        }
        .padding(20)
        .background(.regularMaterial, in: RoundedRectangle(cornerRadius: 20))
    }

    private func identificationSection(_ cattle: Cattle) -> some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Identification")
                .font(.headline)
            LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
                DetailField(label: "Ear Tag L", value: cattle.eartagLeft ?? "N/A")
                DetailField(label: "Ear Tag R", value: cattle.eartagRight ?? "N/A")
                DetailField(label: "Castrated", value: cattle.castrated == true ? "Yes" : "No")
                DetailField(label: "Has Horn", value: cattle.hasHorn == true ? "Yes" : "No")
                DetailField(label: "Birth Date", value: cattle.birthDateAprx?.prefix(10).description ?? "Unknown")
                DetailField(label: "Received", value: cattle.receivedAt?.prefix(10).description ?? "N/A")
            }
        }
        .padding(20)
        .background(.regularMaterial, in: RoundedRectangle(cornerRadius: 16))
    }

    private func weightSection(_ cattle: Cattle) -> some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Text("Weight History")
                    .font(.headline)
                Spacer()
                Button("Record Weight") { showWeightSheet = true }
                    .buttonStyle(.bordered)
            }

            if let history = cattle.weightHistory, !history.isEmpty {
                ForEach(history.prefix(10)) { entry in
                    HStack {
                        Text("\(Int(entry.weight)) kg")
                            .fontWeight(.medium)
                        Spacer()
                        Text(entry.weighedAt?.prefix(10) ?? "")
                            .font(.caption)
                            .foregroundStyle(.secondary)
                    }
                    .padding(.vertical, 4)
                }
            } else {
                Text("No weight records")
                    .foregroundStyle(.secondary)
            }
        }
        .padding(20)
        .background(.regularMaterial, in: RoundedRectangle(cornerRadius: 16))
    }

    private func medicationSection(_ cattle: Cattle) -> some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Medication History")
                .font(.headline)

            if let history = cattle.medicationHistory, !history.isEmpty {
                ForEach(history.prefix(10)) { entry in
                    HStack {
                        VStack(alignment: .leading) {
                            Text(entry.medication ?? "Unknown")
                                .fontWeight(.medium)
                            if let dosage = entry.dosage {
                                Text("Dose: \(dosage)")
                                    .font(.caption)
                                    .foregroundStyle(.secondary)
                            }
                        }
                        Spacer()
                        Text(entry.appliedAt?.prefix(10) ?? "")
                            .font(.caption)
                            .foregroundStyle(.secondary)
                    }
                    .padding(.vertical, 4)
                }
            } else {
                Text("No medication records")
                    .foregroundStyle(.secondary)
            }
        }
        .padding(20)
        .background(.regularMaterial, in: RoundedRectangle(cornerRadius: 16))
    }
}

struct DetailField: View {
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
