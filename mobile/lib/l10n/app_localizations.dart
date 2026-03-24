import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:intl/intl.dart' as intl;

import 'app_localizations_ar.dart';
import 'app_localizations_de.dart';
import 'app_localizations_en.dart';
import 'app_localizations_es.dart';
import 'app_localizations_fr.dart';
import 'app_localizations_hi.dart';
import 'app_localizations_ja.dart';
import 'app_localizations_pt.dart';
import 'app_localizations_ru.dart';
import 'app_localizations_zh.dart';

// ignore_for_file: type=lint

/// Callers can lookup localized strings with an instance of AppLocalizations
/// returned by `AppLocalizations.of(context)`.
///
/// Applications need to include `AppLocalizations.delegate()` in their app's
/// `localizationDelegates` list, and the locales they support in the app's
/// `supportedLocales` list. For example:
///
/// ```dart
/// import 'l10n/app_localizations.dart';
///
/// return MaterialApp(
///   localizationsDelegates: AppLocalizations.localizationsDelegates,
///   supportedLocales: AppLocalizations.supportedLocales,
///   home: MyApplicationHome(),
/// );
/// ```
///
/// ## Update pubspec.yaml
///
/// Please make sure to update your pubspec.yaml to include the following
/// packages:
///
/// ```yaml
/// dependencies:
///   # Internationalization support.
///   flutter_localizations:
///     sdk: flutter
///   intl: any # Use the pinned version from flutter_localizations
///
///   # Rest of dependencies
/// ```
///
/// ## iOS Applications
///
/// iOS applications define key application metadata, including supported
/// locales, in an Info.plist file that is built into the application bundle.
/// To configure the locales supported by your app, you’ll need to edit this
/// file.
///
/// First, open your project’s ios/Runner.xcworkspace Xcode workspace file.
/// Then, in the Project Navigator, open the Info.plist file under the Runner
/// project’s Runner folder.
///
/// Next, select the Information Property List item, select Add Item from the
/// Editor menu, then select Localizations from the pop-up menu.
///
/// Select and expand the newly-created Localizations item then, for each
/// locale your application supports, add a new item and select the locale
/// you wish to add from the pop-up menu in the Value field. This list should
/// be consistent with the languages listed in the AppLocalizations.supportedLocales
/// property.
abstract class AppLocalizations {
  AppLocalizations(String locale)
      : localeName = intl.Intl.canonicalizedLocale(locale.toString());

  final String localeName;

  static AppLocalizations? of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations);
  }

  static const LocalizationsDelegate<AppLocalizations> delegate =
      _AppLocalizationsDelegate();

  /// A list of this localizations delegate along with the default localizations
  /// delegates.
  ///
  /// Returns a list of localizations delegates containing this delegate along with
  /// GlobalMaterialLocalizations.delegate, GlobalCupertinoLocalizations.delegate,
  /// and GlobalWidgetsLocalizations.delegate.
  ///
  /// Additional delegates can be added by appending to this list in
  /// MaterialApp. This list does not have to be used at all if a custom list
  /// of delegates is preferred or required.
  static const List<LocalizationsDelegate<dynamic>> localizationsDelegates =
      <LocalizationsDelegate<dynamic>>[
    delegate,
    GlobalMaterialLocalizations.delegate,
    GlobalCupertinoLocalizations.delegate,
    GlobalWidgetsLocalizations.delegate,
  ];

  /// A list of this localizations delegate's supported locales.
  static const List<Locale> supportedLocales = <Locale>[
    Locale('es'),
    Locale('en'),
    Locale('pt'),
    Locale('fr'),
    Locale('de'),
    Locale('zh'),
    Locale('hi'),
    Locale('ar'),
    Locale('ru'),
    Locale('ja')
  ];

  /// No description provided for @appTitle.
  ///
  /// In es, this message translates to:
  /// **'Ganado'**
  String get appTitle;

  /// No description provided for @login.
  ///
  /// In es, this message translates to:
  /// **'Iniciar Sesión'**
  String get login;

  /// No description provided for @username.
  ///
  /// In es, this message translates to:
  /// **'Usuario'**
  String get username;

  /// No description provided for @password.
  ///
  /// In es, this message translates to:
  /// **'Contraseña'**
  String get password;

  /// No description provided for @loginButton.
  ///
  /// In es, this message translates to:
  /// **'Ingresar'**
  String get loginButton;

  /// No description provided for @logout.
  ///
  /// In es, this message translates to:
  /// **'Cerrar Sesión'**
  String get logout;

  /// No description provided for @dashboard.
  ///
  /// In es, this message translates to:
  /// **'Tablero'**
  String get dashboard;

  /// No description provided for @cattle.
  ///
  /// In es, this message translates to:
  /// **'Ganado'**
  String get cattle;

  /// No description provided for @brands.
  ///
  /// In es, this message translates to:
  /// **'Marcas'**
  String get brands;

  /// No description provided for @locations.
  ///
  /// In es, this message translates to:
  /// **'Ubicaciones'**
  String get locations;

  /// No description provided for @purchases.
  ///
  /// In es, this message translates to:
  /// **'Compras'**
  String get purchases;

  /// No description provided for @sales.
  ///
  /// In es, this message translates to:
  /// **'Ventas'**
  String get sales;

  /// No description provided for @providers.
  ///
  /// In es, this message translates to:
  /// **'Proveedores'**
  String get providers;

  /// No description provided for @events.
  ///
  /// In es, this message translates to:
  /// **'Eventos'**
  String get events;

  /// No description provided for @massiveEvents.
  ///
  /// In es, this message translates to:
  /// **'Eventos Masivos'**
  String get massiveEvents;

  /// No description provided for @simpleEvents.
  ///
  /// In es, this message translates to:
  /// **'Eventos Simples'**
  String get simpleEvents;

  /// No description provided for @receptions.
  ///
  /// In es, this message translates to:
  /// **'Recepciones'**
  String get receptions;

  /// No description provided for @devices.
  ///
  /// In es, this message translates to:
  /// **'Dispositivos'**
  String get devices;

  /// No description provided for @deviceProfiles.
  ///
  /// In es, this message translates to:
  /// **'Perfiles de Dispositivos'**
  String get deviceProfiles;

  /// No description provided for @employees.
  ///
  /// In es, this message translates to:
  /// **'Empleados'**
  String get employees;

  /// No description provided for @users.
  ///
  /// In es, this message translates to:
  /// **'Usuarios'**
  String get users;

  /// No description provided for @roles.
  ///
  /// In es, this message translates to:
  /// **'Roles'**
  String get roles;

  /// No description provided for @settings.
  ///
  /// In es, this message translates to:
  /// **'Configuración'**
  String get settings;

  /// No description provided for @search.
  ///
  /// In es, this message translates to:
  /// **'Buscar'**
  String get search;

  /// No description provided for @save.
  ///
  /// In es, this message translates to:
  /// **'Guardar'**
  String get save;

  /// No description provided for @cancel.
  ///
  /// In es, this message translates to:
  /// **'Cancelar'**
  String get cancel;

  /// No description provided for @delete.
  ///
  /// In es, this message translates to:
  /// **'Eliminar'**
  String get delete;

  /// No description provided for @edit.
  ///
  /// In es, this message translates to:
  /// **'Editar'**
  String get edit;

  /// No description provided for @create.
  ///
  /// In es, this message translates to:
  /// **'Crear'**
  String get create;

  /// No description provided for @confirm.
  ///
  /// In es, this message translates to:
  /// **'Confirmar'**
  String get confirm;

  /// No description provided for @loading.
  ///
  /// In es, this message translates to:
  /// **'Cargando...'**
  String get loading;

  /// No description provided for @error.
  ///
  /// In es, this message translates to:
  /// **'Error'**
  String get error;

  /// No description provided for @retry.
  ///
  /// In es, this message translates to:
  /// **'Reintentar'**
  String get retry;

  /// No description provided for @noData.
  ///
  /// In es, this message translates to:
  /// **'Sin datos'**
  String get noData;

  /// No description provided for @offline.
  ///
  /// In es, this message translates to:
  /// **'Sin conexión'**
  String get offline;

  /// No description provided for @syncing.
  ///
  /// In es, this message translates to:
  /// **'Sincronizando...'**
  String get syncing;

  /// No description provided for @syncComplete.
  ///
  /// In es, this message translates to:
  /// **'Sincronización completa'**
  String get syncComplete;

  /// No description provided for @pendingSync.
  ///
  /// In es, this message translates to:
  /// **'{count} cambios pendientes'**
  String pendingSync(int count);

  /// No description provided for @cattleNumber.
  ///
  /// In es, this message translates to:
  /// **'Número'**
  String get cattleNumber;

  /// No description provided for @weight.
  ///
  /// In es, this message translates to:
  /// **'Peso'**
  String get weight;

  /// No description provided for @recordWeight.
  ///
  /// In es, this message translates to:
  /// **'Registrar Peso'**
  String get recordWeight;

  /// No description provided for @medication.
  ///
  /// In es, this message translates to:
  /// **'Medicamento'**
  String get medication;

  /// No description provided for @addMedication.
  ///
  /// In es, this message translates to:
  /// **'Agregar Medicamento'**
  String get addMedication;

  /// No description provided for @brand.
  ///
  /// In es, this message translates to:
  /// **'Marca'**
  String get brand;

  /// No description provided for @color.
  ///
  /// In es, this message translates to:
  /// **'Color'**
  String get color;

  /// No description provided for @gender.
  ///
  /// In es, this message translates to:
  /// **'Género'**
  String get gender;

  /// No description provided for @male.
  ///
  /// In es, this message translates to:
  /// **'Macho'**
  String get male;

  /// No description provided for @female.
  ///
  /// In es, this message translates to:
  /// **'Hembra'**
  String get female;

  /// No description provided for @status.
  ///
  /// In es, this message translates to:
  /// **'Estado'**
  String get status;

  /// No description provided for @lot.
  ///
  /// In es, this message translates to:
  /// **'Lote'**
  String get lot;

  /// No description provided for @eartag.
  ///
  /// In es, this message translates to:
  /// **'Caravana'**
  String get eartag;

  /// No description provided for @castrated.
  ///
  /// In es, this message translates to:
  /// **'Castrado'**
  String get castrated;

  /// No description provided for @comments.
  ///
  /// In es, this message translates to:
  /// **'Comentarios'**
  String get comments;

  /// No description provided for @importExcel.
  ///
  /// In es, this message translates to:
  /// **'Importar Excel'**
  String get importExcel;

  /// No description provided for @totalCattle.
  ///
  /// In es, this message translates to:
  /// **'Total Ganado'**
  String get totalCattle;

  /// No description provided for @activeEvents.
  ///
  /// In es, this message translates to:
  /// **'Eventos Activos'**
  String get activeEvents;

  /// No description provided for @pendingReceptions.
  ///
  /// In es, this message translates to:
  /// **'Recepciones Pendientes'**
  String get pendingReceptions;

  /// No description provided for @loginFailed.
  ///
  /// In es, this message translates to:
  /// **'Credenciales inválidas'**
  String get loginFailed;

  /// No description provided for @sessionExpired.
  ///
  /// In es, this message translates to:
  /// **'Sesión expirada. Inicie sesión nuevamente.'**
  String get sessionExpired;

  /// No description provided for @provider.
  ///
  /// In es, this message translates to:
  /// **'Proveedor'**
  String get provider;

  /// No description provided for @nit.
  ///
  /// In es, this message translates to:
  /// **'NIT'**
  String get nit;

  /// No description provided for @contact.
  ///
  /// In es, this message translates to:
  /// **'Contacto'**
  String get contact;

  /// No description provided for @price.
  ///
  /// In es, this message translates to:
  /// **'Precio'**
  String get price;

  /// No description provided for @pricePerKg.
  ///
  /// In es, this message translates to:
  /// **'Precio por Kg'**
  String get pricePerKg;

  /// No description provided for @date.
  ///
  /// In es, this message translates to:
  /// **'Fecha'**
  String get date;

  /// No description provided for @total.
  ///
  /// In es, this message translates to:
  /// **'Total'**
  String get total;

  /// No description provided for @closeEvent.
  ///
  /// In es, this message translates to:
  /// **'Cerrar Evento'**
  String get closeEvent;

  /// No description provided for @applyEvent.
  ///
  /// In es, this message translates to:
  /// **'Aplicar Evento'**
  String get applyEvent;

  /// No description provided for @receiveAnimals.
  ///
  /// In es, this message translates to:
  /// **'Recibir Animales'**
  String get receiveAnimals;

  /// No description provided for @assignLot.
  ///
  /// In es, this message translates to:
  /// **'Asignar Lote'**
  String get assignLot;
}

class _AppLocalizationsDelegate
    extends LocalizationsDelegate<AppLocalizations> {
  const _AppLocalizationsDelegate();

  @override
  Future<AppLocalizations> load(Locale locale) {
    return SynchronousFuture<AppLocalizations>(lookupAppLocalizations(locale));
  }

  @override
  bool isSupported(Locale locale) => <String>[
        'ar',
        'de',
        'en',
        'es',
        'fr',
        'hi',
        'ja',
        'pt',
        'ru',
        'zh'
      ].contains(locale.languageCode);

  @override
  bool shouldReload(_AppLocalizationsDelegate old) => false;
}

AppLocalizations lookupAppLocalizations(Locale locale) {
  // Lookup logic when only language code is specified.
  switch (locale.languageCode) {
    case 'ar':
      return AppLocalizationsAr();
    case 'de':
      return AppLocalizationsDe();
    case 'en':
      return AppLocalizationsEn();
    case 'es':
      return AppLocalizationsEs();
    case 'fr':
      return AppLocalizationsFr();
    case 'hi':
      return AppLocalizationsHi();
    case 'ja':
      return AppLocalizationsJa();
    case 'pt':
      return AppLocalizationsPt();
    case 'ru':
      return AppLocalizationsRu();
    case 'zh':
      return AppLocalizationsZh();
  }

  throw FlutterError(
      'AppLocalizations.delegate failed to load unsupported locale "$locale". This is likely '
      'an issue with the localizations generation tool. Please file an issue '
      'on GitHub with a reproducible sample app and the gen-l10n configuration '
      'that was used.');
}
