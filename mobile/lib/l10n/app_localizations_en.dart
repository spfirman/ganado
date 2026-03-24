// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for English (`en`).
class AppLocalizationsEn extends AppLocalizations {
  AppLocalizationsEn([String locale = 'en']) : super(locale);

  @override
  String get appTitle => 'Ganado';

  @override
  String get login => 'Login';

  @override
  String get username => 'Username';

  @override
  String get password => 'Password';

  @override
  String get loginButton => 'Sign In';

  @override
  String get logout => 'Sign Out';

  @override
  String get dashboard => 'Dashboard';

  @override
  String get cattle => 'Cattle';

  @override
  String get brands => 'Brands';

  @override
  String get locations => 'Locations';

  @override
  String get purchases => 'Purchases';

  @override
  String get sales => 'Sales';

  @override
  String get providers => 'Providers';

  @override
  String get events => 'Events';

  @override
  String get massiveEvents => 'Massive Events';

  @override
  String get simpleEvents => 'Simple Events';

  @override
  String get receptions => 'Receptions';

  @override
  String get devices => 'Devices';

  @override
  String get deviceProfiles => 'Device Profiles';

  @override
  String get employees => 'Employees';

  @override
  String get users => 'Users';

  @override
  String get roles => 'Roles';

  @override
  String get settings => 'Settings';

  @override
  String get search => 'Search';

  @override
  String get save => 'Save';

  @override
  String get cancel => 'Cancel';

  @override
  String get delete => 'Delete';

  @override
  String get edit => 'Edit';

  @override
  String get create => 'Create';

  @override
  String get confirm => 'Confirm';

  @override
  String get loading => 'Loading...';

  @override
  String get error => 'Error';

  @override
  String get retry => 'Retry';

  @override
  String get noData => 'No data';

  @override
  String get offline => 'Offline';

  @override
  String get syncing => 'Syncing...';

  @override
  String get syncComplete => 'Sync complete';

  @override
  String pendingSync(int count) {
    return '$count pending changes';
  }

  @override
  String get cattleNumber => 'Number';

  @override
  String get weight => 'Weight';

  @override
  String get recordWeight => 'Record Weight';

  @override
  String get medication => 'Medication';

  @override
  String get addMedication => 'Add Medication';

  @override
  String get brand => 'Brand';

  @override
  String get color => 'Color';

  @override
  String get gender => 'Gender';

  @override
  String get male => 'Male';

  @override
  String get female => 'Female';

  @override
  String get status => 'Status';

  @override
  String get lot => 'Lot';

  @override
  String get eartag => 'Eartag';

  @override
  String get castrated => 'Castrated';

  @override
  String get comments => 'Comments';

  @override
  String get importExcel => 'Import Excel';

  @override
  String get totalCattle => 'Total Cattle';

  @override
  String get activeEvents => 'Active Events';

  @override
  String get pendingReceptions => 'Pending Receptions';

  @override
  String get loginFailed => 'Invalid credentials';

  @override
  String get sessionExpired => 'Session expired. Please log in again.';

  @override
  String get provider => 'Provider';

  @override
  String get nit => 'NIT';

  @override
  String get contact => 'Contact';

  @override
  String get price => 'Price';

  @override
  String get pricePerKg => 'Price per Kg';

  @override
  String get date => 'Date';

  @override
  String get total => 'Total';

  @override
  String get closeEvent => 'Close Event';

  @override
  String get applyEvent => 'Apply Event';

  @override
  String get receiveAnimals => 'Receive Animals';

  @override
  String get assignLot => 'Assign Lot';
}
