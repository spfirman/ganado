import SwiftUI

struct CattleFormView: View {
    @Environment(\.dismiss) var dismiss
    @StateObject private var cattleService = CattleService()

    @State private var number = ""
    @State private var gender: CattleGender = .male
    @State private var color: CattleColor = .brown
    @State private var eartagLeft = ""
    @State private var eartagRight = ""
    @State private var weight = ""
    @State private var castrated = false
    @State private var hasHorn = false
    @State private var comments = ""
    @State private var isSubmitting = false
    @State private var errorMessage: String?

    var body: some View {
        NavigationStack {
            Form {
                Section("Identification") {
                    TextField("Number", text: $number)
                    Picker("Gender", selection: $gender) {
                        ForEach(CattleGender.allCases, id: \.self) { g in
                            Text(g.rawValue.capitalized).tag(g)
                        }
                    }
                    Picker("Color", selection: $color) {
                        ForEach(CattleColor.allCases, id: \.self) { c in
                            Text(c.rawValue.capitalized).tag(c)
                        }
                    }
                }

                Section("Tags") {
                    TextField("Left Ear Tag", text: $eartagLeft)
                    TextField("Right Ear Tag", text: $eartagRight)
                }

                Section("Physical") {
                    TextField("Weight (kg)", text: $weight)
                    Toggle("Castrated", isOn: $castrated)
                    Toggle("Has Horn", isOn: $hasHorn)
                }

                Section("Notes") {
                    TextField("Comments", text: $comments, axis: .vertical)
                        .lineLimit(3...6)
                }

                if let error = errorMessage {
                    Section {
                        Text(error)
                            .foregroundStyle(.red)
                    }
                }
            }
            .navigationTitle("Add Cattle")
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Save") { Task { await save() } }
                        .disabled(isSubmitting)
                }
            }
        }
    }

    private func save() async {
        isSubmitting = true
        errorMessage = nil

        var body: [String: Any] = [
            "gender": gender.rawValue,
            "color": color.rawValue,
            "status": "active",
            "castrated": castrated,
            "hasHorn": hasHorn,
        ]
        if !number.isEmpty { body["number"] = number }
        if !eartagLeft.isEmpty { body["eartagLeft"] = eartagLeft }
        if !eartagRight.isEmpty { body["eartagRight"] = eartagRight }
        if let w = Double(weight) { body["receivedWeight"] = w }
        if !comments.isEmpty { body["comments"] = comments }

        do {
            _ = try await cattleService.createCattle(body)
            dismiss()
        } catch {
            errorMessage = error.localizedDescription
        }
        isSubmitting = false
    }
}
