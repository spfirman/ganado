import SwiftUI

struct HealthEventFormView: View {
    let cattleId: String
    @Environment(\.dismiss) var dismiss
    @StateObject private var service = HealthService()

    @State private var name = ""
    @State private var type: HealthEventType = .CHECKUP
    @State private var medication = ""
    @State private var dosage = ""
    @State private var diagnosis = ""
    @State private var veterinarian = ""
    @State private var cost = ""
    @State private var eventDate = Date()
    @State private var notes = ""
    @State private var isSubmitting = false
    @State private var errorMessage: String?

    var body: some View {
        NavigationStack {
            Form {
                Section("Event Details") {
                    TextField("Name", text: $name)
                    Picker("Type", selection: $type) {
                        ForEach(HealthEventType.allCases, id: \.self) { t in
                            Label(t.label, systemImage: t.icon).tag(t)
                        }
                    }
                    DatePicker("Date", selection: $eventDate, displayedComponents: .date)
                }

                Section("Medical") {
                    TextField("Medication", text: $medication)
                    TextField("Dosage", text: $dosage)
                    TextField("Diagnosis", text: $diagnosis)
                    TextField("Veterinarian", text: $veterinarian)
                    TextField("Cost", text: $cost)
                }

                Section("Notes") {
                    TextField("Notes", text: $notes, axis: .vertical)
                        .lineLimit(3...6)
                }

                if let error = errorMessage {
                    Section {
                        Text(error).foregroundStyle(.red)
                    }
                }
            }
            .navigationTitle("New Health Event")
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Save") { Task { await save() } }
                        .disabled(name.isEmpty || isSubmitting)
                }
            }
        }
    }

    private func save() async {
        isSubmitting = true
        let formatter = ISO8601DateFormatter()
        let request = CreateHealthEventRequest(
            idCattle: cattleId,
            type: type.rawValue,
            name: name,
            description: nil,
            medication: medication.isEmpty ? nil : medication,
            dosage: dosage.isEmpty ? nil : dosage,
            diagnosis: diagnosis.isEmpty ? nil : diagnosis,
            veterinarian: veterinarian.isEmpty ? nil : veterinarian,
            cost: Double(cost),
            eventDate: formatter.string(from: eventDate),
            followUpDate: nil,
            notes: notes.isEmpty ? nil : notes
        )

        do {
            _ = try await service.createHealthEvent(request)
            dismiss()
        } catch {
            errorMessage = error.localizedDescription
        }
        isSubmitting = false
    }
}
