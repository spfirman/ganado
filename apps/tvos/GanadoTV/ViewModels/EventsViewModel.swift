import Foundation
import SwiftUI

struct TimelineEvent: Identifiable {
    let id: String
    let title: String
    let subtitle: String
    let icon: String
    let date: String?
    let category: EventCategory

    enum EventCategory: String {
        case health, breeding, workOrder
    }
}

@MainActor
class EventsViewModel: ObservableObject {
    @Published var healthEvents: [HealthEvent] = []
    @Published var breedingEvents: [BreedingEvent] = []
    @Published var timelineEvents: [TimelineEvent] = []
    @Published var isLoading = false
    @Published var errorMessage: String?

    private let healthService = HealthService()
    private let breedingService = BreedingService()

    func loadEvents() async {
        isLoading = true
        errorMessage = nil

        do {
            async let healthResponse = healthService.listHealthEvents(limit: 50)
            async let breedingResponse = breedingService.listBreedingEvents(limit: 50)

            let (healthResult, breedingResult) = try await (healthResponse, breedingResponse)

            healthEvents = healthResult.items
            breedingEvents = breedingResult.items

            var timeline: [TimelineEvent] = []

            for event in healthResult.items {
                timeline.append(TimelineEvent(
                    id: event.id,
                    title: event.displayName,
                    subtitle: "Animal #\(event.cattleNumber ?? "N/A") - \(event.type?.label ?? "Event")",
                    icon: event.type?.icon ?? "heart.fill",
                    date: event.eventDate,
                    category: .health
                ))
            }

            for event in breedingResult.items {
                timeline.append(TimelineEvent(
                    id: event.id,
                    title: event.type?.label ?? "Breeding Event",
                    subtitle: "Animal #\(event.cattleNumber ?? "N/A") - \(event.pregnancyStatus?.label ?? "")",
                    icon: event.type?.icon ?? "heart.fill",
                    date: event.eventDate,
                    category: .breeding
                ))
            }

            timelineEvents = timeline.sorted { ($0.date ?? "") > ($1.date ?? "") }
        } catch {
            errorMessage = error.localizedDescription
        }

        isLoading = false
    }
}
