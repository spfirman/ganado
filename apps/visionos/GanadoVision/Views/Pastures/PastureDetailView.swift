import SwiftUI

struct PastureDetailView: View {
    let pastureId: String
    @StateObject private var viewModel = PastureViewModel()

    var body: some View {
        ScrollView {
            if let pasture = viewModel.pastures.first(where: { $0.id == pastureId }) {
                VStack(spacing: 20) {
                    pastureHeader(pasture)
                    rotationsSection
                }
                .padding(24)
            } else {
                LoadingView(message: "Loading pasture...")
            }
        }
        .task {
            await viewModel.loadPastures(reset: true)
            await viewModel.loadRotations(pastureId: pastureId)
        }
    }

    private func pastureHeader(_ pasture: Pasture) -> some View {
        VStack(spacing: 16) {
            HStack {
                VStack(alignment: .leading, spacing: 8) {
                    Text(pasture.displayName)
                        .font(.largeTitle)
                        .fontWeight(.bold)
                    if let status = pasture.status {
                        Text(status.label)
                            .font(.subheadline)
                            .padding(.horizontal, 10)
                            .padding(.vertical, 4)
                            .background(statusColor(status).opacity(0.2), in: Capsule())
                    }
                }
                Spacer()
            }

            LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
                DetailField(label: "Area", value: pasture.areaHectares.map { "\(String(format: "%.1f", $0)) ha" } ?? "N/A")
                DetailField(label: "Grass Type", value: pasture.grassType ?? "N/A")
                DetailField(label: "Capacity", value: "\(pasture.currentCount ?? 0)/\(pasture.capacity ?? 0)")
                DetailField(label: "Utilization", value: "\(Int(pasture.utilizationPercentage))%")
                DetailField(label: "Last Rotation", value: pasture.lastRotationDate?.prefix(10).description ?? "N/A")
                DetailField(label: "Next Rotation", value: pasture.nextRotationDate?.prefix(10).description ?? "N/A")
            }
        }
        .padding(20)
        .background(.regularMaterial, in: RoundedRectangle(cornerRadius: 20))
    }

    private var rotationsSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Grazing Rotations")
                .font(.headline)

            if viewModel.rotations.isEmpty {
                Text("No rotation history")
                    .foregroundStyle(.secondary)
                    .frame(maxWidth: .infinity)
                    .padding()
            } else {
                ForEach(viewModel.rotations) { rotation in
                    HStack {
                        VStack(alignment: .leading, spacing: 4) {
                            Text("\(rotation.cattleCount ?? 0) cattle")
                                .fontWeight(.medium)
                            if let start = rotation.startDate {
                                Text("Started: \(String(start.prefix(10)))")
                                    .font(.caption)
                                    .foregroundStyle(.secondary)
                            }
                        }
                        Spacer()
                        if let end = rotation.endDate {
                            Text("Ended: \(String(end.prefix(10)))")
                                .font(.caption)
                                .foregroundStyle(.secondary)
                        } else {
                            Text("Active")
                                .font(.caption)
                                .fontWeight(.medium)
                                .foregroundStyle(.green)
                        }
                    }
                    .padding(12)
                    .background(.regularMaterial, in: RoundedRectangle(cornerRadius: 12))
                }
            }
        }
        .padding(20)
        .background(.regularMaterial, in: RoundedRectangle(cornerRadius: 20))
    }

    private func statusColor(_ status: PastureStatus) -> Color {
        switch status {
        case .ACTIVE: return .green
        case .RESTING: return .blue
        case .OVER_GRAZED: return .red
        }
    }
}
