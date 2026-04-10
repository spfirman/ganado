import TVServices

class ContentProvider: TVTopShelfContentProvider {
    override func loadTopShelfContent() async -> TVTopShelfContent? {
        let items = [
            makeItem(id: "herd", title: "Herd Overview", imageName: "pawprint.circle.fill"),
            makeItem(id: "health", title: "Health Events", imageName: "heart.text.square.fill"),
            makeItem(id: "breeding", title: "Breeding", imageName: "leaf.fill"),
            makeItem(id: "market", title: "Market", imageName: "dollarsign.circle.fill")
        ]

        let section = TVTopShelfItemCollection(items: items)
        section.title = "Ganado - Herd Summary"

        return TVTopShelfSectionedContent(sections: [section])
    }

    private func makeItem(id: String, title: String, imageName: String) -> TVTopShelfSectionedItem {
        let item = TVTopShelfSectionedItem(identifier: id)
        item.title = title
        item.setImageURL(nil, for: .screenScale1x)
        return item
    }
}
