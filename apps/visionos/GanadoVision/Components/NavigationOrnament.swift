import SwiftUI

struct NavigationOrnament: View {
    @EnvironmentObject var appState: AppState

    var body: some View {
        VStack(spacing: 4) {
            ForEach(AppState.Tab.allCases, id: \.self) { tab in
                Button {
                    appState.selectedTab = tab
                } label: {
                    Image(systemName: tab.icon)
                        .font(.title3)
                        .frame(width: 44, height: 44)
                }
                .buttonStyle(.plain)
                .background(
                    appState.selectedTab == tab
                        ? AnyShapeStyle(.tint.opacity(0.3))
                        : AnyShapeStyle(.clear),
                    in: RoundedRectangle(cornerRadius: 10)
                )
                .help(tab.rawValue)
            }
        }
        .padding(8)
        .glassBackgroundEffect()
    }
}
