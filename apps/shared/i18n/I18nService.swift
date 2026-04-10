import Foundation

class I18nService {
    static let shared = I18nService()

    private var currentLocale: Locale {
        didSet {
            saveLocalePreference()
        }
    }

    private var translations: [String: [String: String]] = [:]
    private let localeKey = "ganado.i18n.locale"

    private init() {
        // Load saved locale or use device locale
        let savedCode = UserDefaults.standard.string(forKey: localeKey)
        let deviceLocale = Locale.current

        // Try to use saved locale, fallback to device locale
        if let savedCode = savedCode {
            currentLocale = Locale(identifier: savedCode)
        } else {
            currentLocale = deviceLocale
        }

        // Load translations
        loadTranslations()
    }

    // MARK: - Load translations from bundle

    private func loadTranslations() {
        // Load Spanish
        if let esPath = Bundle.main.path(forResource: "es", ofType: "json", inDirectory: "locales"),
           let esData = try? Data(contentsOf: URL(fileURLWithPath: esPath)),
           let esDict = try? JSONSerialization.jsonObject(with: esData) as? [String: String] {
            translations["es"] = esDict
        }

        // Load English
        if let enPath = Bundle.main.path(forResource: "en", ofType: "json", inDirectory: "locales"),
           let enData = try? Data(contentsOf: URL(fileURLWithPath: enPath)),
           let enDict = try? JSONSerialization.jsonObject(with: enData) as? [String: String] {
            translations["en"] = enDict
        }
    }

    // MARK: - Translation lookup

    func t(_ key: String, params: [String: String]? = nil) -> String {
        let languageCode = currentLocale.language.languageCode?.identifier ?? "es"

        // Try current language
        if let value = translations[languageCode]?[key] {
            return substitute(value, with: params)
        }

        // Fallback to Spanish
        if languageCode != "es", let value = translations["es"]?[key] {
            return substitute(value, with: params)
        }

        // Fallback to key itself
        return key
    }

    private func substitute(_ value: String, with params: [String: String]?) -> String {
        guard let params = params else { return value }
        var result = value
        for (key, val) in params {
            result = result.replacingOccurrences(of: "{\(key)}", with: val)
        }
        return result
    }

    // MARK: - Locale management

    func setLocale(_ identifier: String) {
        currentLocale = Locale(identifier: identifier)
    }

    func getLocale() -> Locale {
        return currentLocale
    }

    func getLocaleCode() -> String {
        return currentLocale.language.languageCode?.identifier ?? "es"
    }

    private func saveLocalePreference() {
        UserDefaults.standard.setValue(
            currentLocale.identifier,
            forKey: localeKey
        )
    }
}
