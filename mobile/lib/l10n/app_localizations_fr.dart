// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for French (`fr`).
class AppLocalizationsFr extends AppLocalizations {
  AppLocalizationsFr([String locale = 'fr']) : super(locale);

  @override
  String get appTitle => 'Ganado';

  @override
  String get login => 'Connexion';

  @override
  String get username => 'Nom d\'utilisateur';

  @override
  String get password => 'Mot de passe';

  @override
  String get loginButton => 'Se connecter';

  @override
  String get logout => 'Se déconnecter';

  @override
  String get dashboard => 'Tableau de bord';

  @override
  String get cattle => 'Bétail';

  @override
  String get brands => 'Marques';

  @override
  String get locations => 'Emplacements';

  @override
  String get purchases => 'Achats';

  @override
  String get sales => 'Ventes';

  @override
  String get providers => 'Fournisseurs';

  @override
  String get events => 'Événements';

  @override
  String get massiveEvents => 'Événements de masse';

  @override
  String get simpleEvents => 'Événements simples';

  @override
  String get receptions => 'Réceptions';

  @override
  String get devices => 'Appareils';

  @override
  String get deviceProfiles => 'Profils d\'appareils';

  @override
  String get employees => 'Employés';

  @override
  String get users => 'Utilisateurs';

  @override
  String get roles => 'Rôles';

  @override
  String get settings => 'Paramètres';

  @override
  String get search => 'Rechercher';

  @override
  String get save => 'Enregistrer';

  @override
  String get cancel => 'Annuler';

  @override
  String get delete => 'Supprimer';

  @override
  String get edit => 'Modifier';

  @override
  String get create => 'Créer';

  @override
  String get confirm => 'Confirmer';

  @override
  String get loading => 'Chargement...';

  @override
  String get error => 'Erreur';

  @override
  String get retry => 'Réessayer';

  @override
  String get noData => 'Aucune donnée';

  @override
  String get offline => 'Hors ligne';

  @override
  String get syncing => 'Synchronisation...';

  @override
  String get syncComplete => 'Synchronisation terminée';

  @override
  String pendingSync(int count) {
    return '$count modifications en attente';
  }

  @override
  String get cattleNumber => 'Numéro';

  @override
  String get weight => 'Poids';

  @override
  String get recordWeight => 'Enregistrer le poids';

  @override
  String get medication => 'Médicament';

  @override
  String get addMedication => 'Ajouter un médicament';

  @override
  String get brand => 'Marque';

  @override
  String get color => 'Couleur';

  @override
  String get gender => 'Genre';

  @override
  String get male => 'Mâle';

  @override
  String get female => 'Femelle';

  @override
  String get status => 'Statut';

  @override
  String get lot => 'Lot';

  @override
  String get eartag => 'Boucle d\'oreille';

  @override
  String get castrated => 'Castré';

  @override
  String get comments => 'Commentaires';

  @override
  String get importExcel => 'Importer Excel';

  @override
  String get totalCattle => 'Total du bétail';

  @override
  String get activeEvents => 'Événements actifs';

  @override
  String get pendingReceptions => 'Réceptions en attente';

  @override
  String get loginFailed => 'Identifiants invalides';

  @override
  String get sessionExpired => 'Session expirée. Veuillez vous reconnecter.';

  @override
  String get provider => 'Fournisseur';

  @override
  String get nit => 'NIF';

  @override
  String get contact => 'Contact';

  @override
  String get price => 'Prix';

  @override
  String get pricePerKg => 'Prix par Kg';

  @override
  String get date => 'Date';

  @override
  String get total => 'Total';

  @override
  String get closeEvent => 'Fermer l\'événement';

  @override
  String get applyEvent => 'Appliquer l\'événement';

  @override
  String get receiveAnimals => 'Recevoir les animaux';

  @override
  String get assignLot => 'Attribuer un lot';
}
