// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for German (`de`).
class AppLocalizationsDe extends AppLocalizations {
  AppLocalizationsDe([String locale = 'de']) : super(locale);

  @override
  String get appTitle => 'Ganado';

  @override
  String get login => 'Anmelden';

  @override
  String get username => 'Benutzername';

  @override
  String get password => 'Passwort';

  @override
  String get loginButton => 'Einloggen';

  @override
  String get logout => 'Abmelden';

  @override
  String get dashboard => 'Dashboard';

  @override
  String get cattle => 'Vieh';

  @override
  String get brands => 'Marken';

  @override
  String get locations => 'Standorte';

  @override
  String get purchases => 'Einkäufe';

  @override
  String get sales => 'Verkäufe';

  @override
  String get providers => 'Lieferanten';

  @override
  String get events => 'Ereignisse';

  @override
  String get massiveEvents => 'Massenereignisse';

  @override
  String get simpleEvents => 'Einfache Ereignisse';

  @override
  String get receptions => 'Empfänge';

  @override
  String get devices => 'Geräte';

  @override
  String get deviceProfiles => 'Geräteprofile';

  @override
  String get employees => 'Mitarbeiter';

  @override
  String get users => 'Benutzer';

  @override
  String get roles => 'Rollen';

  @override
  String get settings => 'Einstellungen';

  @override
  String get search => 'Suchen';

  @override
  String get save => 'Speichern';

  @override
  String get cancel => 'Abbrechen';

  @override
  String get delete => 'Löschen';

  @override
  String get edit => 'Bearbeiten';

  @override
  String get create => 'Erstellen';

  @override
  String get confirm => 'Bestätigen';

  @override
  String get loading => 'Laden...';

  @override
  String get error => 'Fehler';

  @override
  String get retry => 'Erneut versuchen';

  @override
  String get noData => 'Keine Daten';

  @override
  String get offline => 'Offline';

  @override
  String get syncing => 'Synchronisierung...';

  @override
  String get syncComplete => 'Synchronisierung abgeschlossen';

  @override
  String pendingSync(int count) {
    return '$count ausstehende Änderungen';
  }

  @override
  String get cattleNumber => 'Nummer';

  @override
  String get weight => 'Gewicht';

  @override
  String get recordWeight => 'Gewicht erfassen';

  @override
  String get medication => 'Medikament';

  @override
  String get addMedication => 'Medikament hinzufügen';

  @override
  String get brand => 'Marke';

  @override
  String get color => 'Farbe';

  @override
  String get gender => 'Geschlecht';

  @override
  String get male => 'Männlich';

  @override
  String get female => 'Weiblich';

  @override
  String get status => 'Status';

  @override
  String get lot => 'Los';

  @override
  String get eartag => 'Ohrmarke';

  @override
  String get castrated => 'Kastriert';

  @override
  String get comments => 'Kommentare';

  @override
  String get importExcel => 'Excel importieren';

  @override
  String get totalCattle => 'Gesamtvieh';

  @override
  String get activeEvents => 'Aktive Ereignisse';

  @override
  String get pendingReceptions => 'Ausstehende Empfänge';

  @override
  String get loginFailed => 'Ungültige Anmeldedaten';

  @override
  String get sessionExpired =>
      'Sitzung abgelaufen. Bitte melden Sie sich erneut an.';

  @override
  String get provider => 'Lieferant';

  @override
  String get nit => 'Steuernummer';

  @override
  String get contact => 'Kontakt';

  @override
  String get price => 'Preis';

  @override
  String get pricePerKg => 'Preis pro Kg';

  @override
  String get date => 'Datum';

  @override
  String get total => 'Gesamt';

  @override
  String get closeEvent => 'Ereignis schließen';

  @override
  String get applyEvent => 'Ereignis anwenden';

  @override
  String get receiveAnimals => 'Tiere empfangen';

  @override
  String get assignLot => 'Los zuweisen';
}
