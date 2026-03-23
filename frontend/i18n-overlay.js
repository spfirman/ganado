/**
 * Ganado i18n Overlay
 * -------------------
 * A JavaScript-based language overlay for the pre-compiled Flutter web app.
 * Adds a floating language selector and translates known UI text via DOM scanning.
 *
 * Supported locales: es (default), en, pt, fr, de, zh, hi, ar, ru, ja
 * Fun locales: es-CO-paisa (Paisa), es-MX-chido (Mexicano), x-piglatin (Pig Latin)
 */
(function () {
  'use strict';

  // ── Configuration ──────────────────────────────────────────────────────────
  const STORAGE_KEY = 'ganado_locale';
  const DEFAULT_LOCALE = 'es';
  const SCAN_INTERVAL_MS = 1500; // periodic fallback scan interval

  const SUPPORTED_LOCALES = [
    { code: 'es', flag: '\uD83C\uDDEA\uD83C\uDDF8', name: 'Espa\u00f1ol' },
    { code: 'en', flag: '\uD83C\uDDFA\uD83C\uDDF8', name: 'English' },
    { code: 'pt', flag: '\uD83C\uDDE7\uD83C\uDDF7', name: 'Portugu\u00eas' },
    { code: 'fr', flag: '\uD83C\uDDEB\uD83C\uDDF7', name: 'Fran\u00e7ais' },
    { code: 'de', flag: '\uD83C\uDDE9\uD83C\uDDEA', name: 'Deutsch' },
    { code: 'zh', flag: '\uD83C\uDDE8\uD83C\uDDF3', name: '\u4E2D\u6587' },
    { code: 'hi', flag: '\uD83C\uDDEE\uD83C\uDDF3', name: '\u0939\u093F\u0928\u094D\u0926\u0940' },
    { code: 'ar', flag: '\uD83C\uDDF8\uD83C\uDDE6', name: '\u0627\u0644\u0639\u0631\u0628\u064A\u0629' },
    { code: 'ru', flag: '\uD83C\uDDF7\uD83C\uDDFA', name: '\u0420\u0443\u0441\u0441\u043A\u0438\u0439' },
    { code: 'ja', flag: '\uD83C\uDDEF\uD83C\uDDF5', name: '\u65E5\u672C\u8A9E' },
    // ── Fun languages ──
    { code: 'es-CO-paisa', flag: '\uD83C\uDDE8\uD83C\uDDF4', name: '\uD83C\uDDE8\uD83C\uDDF4 Paisa', _separator: true },
    { code: 'es-MX-chido', flag: '\uD83C\uDDF2\uD83C\uDDFD', name: '\uD83C\uDDF2\uD83C\uDDFD Mexicano' },
    { code: 'x-piglatin', flag: '\uD83D\uDC37', name: '\uD83D\uDC37 Pig Latin' },
  ];

  // ── Translation dictionaries ───────────────────────────────────────────────
  // Keys are the Spanish (source) strings. Values are objects keyed by locale.
  // Spanish is omitted because it is the source language.
  const DICT = {
    // Navigation
    'Inicio': {
      en: 'Home', pt: 'In\u00edcio', fr: 'Accueil', de: 'Startseite',
      zh: '\u9996\u9875', hi: '\u0939\u094B\u092E', ar: '\u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629', ru: '\u0413\u043B\u0430\u0432\u043D\u0430\u044F', ja: '\u30DB\u30FC\u30E0',
      'es-CO-paisa': 'Inicio, pues', 'es-MX-chido': 'Inicio, g\u00fcey', 'x-piglatin': 'Omeihay',
    },
    'Lista Maestra de Ganado': {
      en: 'Master Cattle List', pt: 'Lista Mestra de Gado', fr: 'Liste Ma\u00eetre du B\u00e9tail', de: 'Stammliste Vieh',
      zh: '\u7267\u573A\u4E3B\u5217\u8868', hi: '\u092E\u0941\u0916\u094D\u092F \u092A\u0936\u0941 \u0938\u0942\u091A\u0940', ar: '\u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u0645\u0627\u0634\u064A\u0629 \u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629', ru: '\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0441\u043F\u0438\u0441\u043E\u043A \u0441\u043A\u043E\u0442\u0430', ja: '\u5BB6\u755C\u30DE\u30B9\u30BF\u30FC\u30EA\u30B9\u30C8',
      'es-CO-paisa': 'Lista Maestra de Ganado, pues parcero', 'es-MX-chido': 'Lista Maestra de Ganado, g\u00fcey', 'x-piglatin': 'Istlay Astermay ofay Attlecay',
    },
    'Compra': {
      en: 'Purchase', pt: 'Compra', fr: 'Achat', de: 'Kauf',
      zh: '\u8D2D\u4E70', hi: '\u0916\u0930\u0940\u0926', ar: '\u0634\u0631\u0627\u0621', ru: '\u041F\u043E\u043A\u0443\u043F\u043A\u0430', ja: '\u8CFC\u5165',
      'es-CO-paisa': 'Compra, pues', 'es-MX-chido': '\u00D3rale, Compra', 'x-piglatin': 'Ompracay',
    },
    'Venta': {
      en: 'Sale', pt: 'Venda', fr: 'Vente', de: 'Verkauf',
      zh: '\u9500\u552E', hi: '\u092C\u093F\u0915\u094D\u0930\u0940', ar: '\u0628\u064A\u0639', ru: '\u041F\u0440\u043E\u0434\u0430\u0436\u0430', ja: '\u8CA9\u58F2',
      'es-CO-paisa': 'Venta, pues', 'es-MX-chido': 'Venta, carnal', 'x-piglatin': 'Entavay',
    },
    'Usuarios': {
      en: 'Users', pt: 'Usu\u00e1rios', fr: 'Utilisateurs', de: 'Benutzer',
      zh: '\u7528\u6237', hi: '\u0909\u092A\u092F\u094B\u0917\u0915\u0930\u094D\u0924\u0627', ar: '\u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645\u0648\u0646', ru: '\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0438', ja: '\u30E6\u30FC\u30B6\u30FC',
      'es-CO-paisa': 'Parceros', 'es-MX-chido': 'G\u00fceyes', 'x-piglatin': 'Usersway',
    },
    'Evento masivo': {
      en: 'Mass Event', pt: 'Evento em massa', fr: '\u00C9v\u00e9nement massif', de: 'Massenereignis',
      zh: '\u6279\u91CF\u4E8B\u4EF6', hi: '\u0938\u093E\u092E\u0942\u0939\u093F\u0915 \u0918\u091F\u0928\u093E', ar: '\u062D\u062F\u062B \u062C\u0645\u0627\u0639\u064A', ru: '\u041C\u0430\u0441\u0441\u043E\u0432\u043E\u0435 \u0441\u043E\u0431\u044B\u0442\u0438\u0435', ja: '\u4E00\u62EC\u30A4\u30D9\u30F3\u30C8',
      'es-CO-paisa': 'Evento masivo, pues parcero', 'es-MX-chido': 'Evento masivo, güey', 'x-piglatin': 'Eventoway Asivomay',
    },

    // Common buttons / labels
    'Guardar': {
      en: 'Save', pt: 'Salvar', fr: 'Enregistrer', de: 'Speichern',
      zh: '\u4FDD\u5B58', hi: '\u0938\u0939\u0947\u091C\u0947\u0902', ar: '\u062D\u0641\u0638', ru: '\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C', ja: '\u4FDD\u5B58',
      'es-CO-paisa': 'Guardar, pues', 'es-MX-chido': 'Guardar, güey', 'x-piglatin': 'Uardargay',
    },
    'Cancelar': {
      en: 'Cancel', pt: 'Cancelar', fr: 'Annuler', de: 'Abbrechen',
      zh: '\u53D6\u6D88', hi: '\u0930\u0926\u094D\u0926 \u0915\u0930\u0947\u0902', ar: '\u0625\u0644\u063A\u0627\u0621', ru: '\u041E\u0442\u043C\u0435\u043D\u0430', ja: '\u30AD\u30E3\u30F3\u30BB\u30EB',
      'es-CO-paisa': 'Cancelar, pues', 'es-MX-chido': 'Cancelar, güey', 'x-piglatin': 'Ancelarcay',
    },
    'Crear': {
      en: 'Create', pt: 'Criar', fr: 'Cr\u00e9er', de: 'Erstellen',
      zh: '\u521B\u5EFA', hi: '\u092C\u0928\u093E\u090F\u0902', ar: '\u0625\u0646\u0634\u0627\u0621', ru: '\u0421\u043E\u0437\u0434\u0430\u0442\u044C', ja: '\u4F5C\u6210',
      'es-CO-paisa': 'Crear, pues', 'es-MX-chido': 'Crear, güey', 'x-piglatin': 'Earcray',
    },
    'Buscar': {
      en: 'Search', pt: 'Buscar', fr: 'Rechercher', de: 'Suchen',
      zh: '\u641C\u7D22', hi: '\u0916\u094B\u091C\u0947\u0902', ar: '\u0628\u062D\u062B', ru: '\u041F\u043E\u0438\u0441\u043A', ja: '\u691C\u7D22',
      'es-CO-paisa': 'Buscar, pues', 'es-MX-chido': 'Buscar, güey', 'x-piglatin': 'Uscarbay',
    },
    'Actualizar': {
      en: 'Update', pt: 'Atualizar', fr: 'Mettre \u00e0 jour', de: 'Aktualisieren',
      zh: '\u66F4\u65B0', hi: '\u0905\u092A\u0921\u0947\u091F \u0915\u0930\u0947\u0902', ar: '\u062A\u062D\u062F\u064A\u062B', ru: '\u041E\u0431\u043D\u043E\u0432\u0438\u0442\u044C', ja: '\u66F4\u65B0',
      'es-CO-paisa': 'Actualizar, pues', 'es-MX-chido': 'Actualizar, güey', 'x-piglatin': 'Actualizarway',
    },
    'Eliminar': {
      en: 'Delete', pt: 'Excluir', fr: 'Supprimer', de: 'L\u00f6schen',
      zh: '\u5220\u9664', hi: '\u0939\u091F\u093E\u090F\u0902', ar: '\u062D\u0630\u0641', ru: '\u0423\u0434\u0430\u043B\u0438\u0442\u044C', ja: '\u524A\u9664',
      'es-CO-paisa': 'Eliminar, pues', 'es-MX-chido': 'Eliminar, güey', 'x-piglatin': 'Eliminarway',
    },
    'Cerrar': {
      en: 'Close', pt: 'Fechar', fr: 'Fermer', de: 'Schlie\u00dfen',
      zh: '\u5173\u95ED', hi: '\u092C\u0902\u0926 \u0915\u0930\u0947\u0902', ar: '\u0625\u063A\u0644\u0627\u0642', ru: '\u0417\u0430\u043A\u0440\u044B\u0442\u044C', ja: '\u9589\u3058\u308B',
      'es-CO-paisa': 'Cerrar, pues', 'es-MX-chido': 'Cerrar, güey', 'x-piglatin': 'Errarcay',
    },
    'Aceptar': {
      en: 'Accept', pt: 'Aceitar', fr: 'Accepter', de: 'Akzeptieren',
      zh: '\u63A5\u53D7', hi: '\u0938\u094D\u0935\u0940\u0915\u093E\u0930 \u0915\u0930\u0947\u0902', ar: '\u0642\u0628\u0648\u0644', ru: '\u041F\u0440\u0438\u043D\u044F\u0442\u044C', ja: '\u627F\u8A8D',
      'es-CO-paisa': 'Aceptar, pues', 'es-MX-chido': 'Órale, Aceptar', 'x-piglatin': 'Aceptarway',
    },
    'Editar': {
      en: 'Edit', pt: 'Editar', fr: 'Modifier', de: 'Bearbeiten',
      zh: '\u7F16\u8F91', hi: '\u0938\u0902\u092A\u093E\u0926\u093F\u0924 \u0915\u0930\u0947\u0902', ar: '\u062A\u0639\u062F\u064A\u0644', ru: '\u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C', ja: '\u7DE8\u96C6',
      'es-CO-paisa': 'Editar, pues', 'es-MX-chido': 'Editar, güey', 'x-piglatin': 'Editarway',
    },
    'Agregar': {
      en: 'Add', pt: 'Adicionar', fr: 'Ajouter', de: 'Hinzuf\u00fcgen',
      zh: '\u6DFB\u52A0', hi: '\u091C\u094B\u0921\u093C\u0947\u0902', ar: '\u0625\u0636\u0627\u0641\u0629', ru: '\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C', ja: '\u8FFD\u52A0',
      'es-CO-paisa': 'Agregar, pues', 'es-MX-chido': 'Agregar, güey', 'x-piglatin': 'Agregarway',
    },
    'Confirmar': {
      en: 'Confirm', pt: 'Confirmar', fr: 'Confirmer', de: 'Best\u00e4tigen',
      zh: '\u786E\u8BA4', hi: '\u092A\u0941\u0937\u094D\u091F\u093F \u0915\u0930\u0947\u0902', ar: '\u062A\u0623\u0643\u064A\u062F', ru: '\u041F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u044C', ja: '\u78BA\u8A8D',
      'es-CO-paisa': 'Confirmar, pues', 'es-MX-chido': 'Confirmar, güey', 'x-piglatin': 'Onfirmarcay',
    },
    'S\u00ed': {
      en: 'Yes', pt: 'Sim', fr: 'Oui', de: 'Ja',
      zh: '\u662F', hi: '\u0939\u093E\u0901', ar: '\u0646\u0639\u0645', ru: '\u0414\u0430', ja: '\u306F\u3044',
      'es-CO-paisa': 'Sí, pues', 'es-MX-chido': 'Sí, güey', 'x-piglatin': 'Esyay',
    },
    'No': {
      en: 'No', pt: 'N\u00e3o', fr: 'Non', de: 'Nein',
      zh: '\u5426', hi: '\u0928\u0939\u0940\u0902', ar: '\u0644\u0627', ru: '\u041D\u0435\u0442', ja: '\u3044\u3044\u3048',
      'es-CO-paisa': 'No, pues', 'es-MX-chido': 'No, güey', 'x-piglatin': 'Onay',
    },

    // Error messages
    'Ocurri\u00f3 un error inesperado al leer': {
      en: 'An unexpected read error occurred', pt: 'Ocorreu um erro inesperado ao ler',
      fr: 'Une erreur de lecture inattendue s\'est produite', de: 'Ein unerwarteter Lesefehler ist aufgetreten',
      zh: '\u8BFB\u53D6\u65F6\u53D1\u751F\u610F\u5916\u9519\u8BEF', hi: '\u092A\u0922\u093C\u0928\u0947 \u092E\u0947\u0902 \u0905\u092A\u094D\u0930\u0924\u094D\u092F\u093E\u0936\u093F\u0924 \u0924\u094D\u0930\u0941\u091F\u093F',
      ar: '\u062D\u062F\u062B \u062E\u0637\u0623 \u063A\u064A\u0631 \u0645\u062A\u0648\u0642\u0639 \u0623\u062B\u0646\u0627\u0621 \u0627\u0644\u0642\u0631\u0627\u0621\u0629', ru: '\u041F\u0440\u043E\u0438\u0437\u043E\u0448\u043B\u0430 \u043D\u0435\u043E\u0436\u0438\u0434\u0430\u043D\u043D\u0430\u044F \u043E\u0448\u0438\u0431\u043A\u0430 \u0447\u0442\u0435\u043D\u0438\u044F',
      ja: '\u4E88\u671F\u3057\u306A\u3044\u8AAD\u307F\u53D6\u308A\u30A8\u30E9\u30FC\u304C\u767A\u751F\u3057\u307E\u3057\u305F',
      'es-CO-paisa': '\u00A1Ay, parcero! Ocurri\u00f3 un error inesperado al leer, pues', 'es-MX-chido': '\u00A1\u00D3rale! Ocurri\u00f3 un error inesperado al leer, g\u00fcey', 'x-piglatin': 'Anway Unexpectedway Eadray Errorway Occurredway',
    },
    'Reintentar': {
      en: 'Retry', pt: 'Tentar novamente', fr: 'R\u00e9essayer', de: 'Wiederholen',
      zh: '\u91CD\u8BD5', hi: '\u092A\u0941\u0928\u0903 \u092A\u094D\u0930\u092F\u093E\u0938 \u0915\u0930\u0947\u0902', ar: '\u0625\u0639\u0627\u062F\u0629 \u0627\u0644\u0645\u062D\u0627\u0648\u0644\u0629', ru: '\u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u044C', ja: '\u518D\u8A66\u884C',
      'es-CO-paisa': 'Reintentar, pues', 'es-MX-chido': 'Reintentar, güey', 'x-piglatin': 'Eintentarray',
    },

    // Status / filter labels
    'Todos': {
      en: 'All', pt: 'Todos', fr: 'Tous', de: 'Alle',
      zh: '\u5168\u90E8', hi: '\u0938\u092D\u0940', ar: '\u0627\u0644\u0643\u0644', ru: '\u0412\u0441\u0435', ja: '\u3059\u3079\u3066',
      'es-CO-paisa': 'Todos, pues', 'es-MX-chido': 'Todos, güey', 'x-piglatin': 'Allway',
    },
    'Activo': {
      en: 'Active', pt: 'Ativo', fr: 'Actif', de: 'Aktiv',
      zh: '\u6D3B\u8DC3', hi: '\u0938\u0915\u094D\u0930\u093F\u092F', ar: '\u0646\u0634\u0637', ru: '\u0410\u043A\u0442\u0438\u0432\u043D\u044B\u0439', ja: '\u30A2\u30AF\u30C6\u30A3\u30D6',
      'es-CO-paisa': 'Activo, pues', 'es-MX-chido': 'Activo, güey', 'x-piglatin': 'Activoway',
    },
    'Inactivo': {
      en: 'Inactive', pt: 'Inativo', fr: 'Inactif', de: 'Inaktiv',
      zh: '\u4E0D\u6D3B\u8DC3', hi: '\u0928\u093F\u0937\u094D\u0915\u094D\u0930\u093F\u092F', ar: '\u063A\u064A\u0631 \u0646\u0634\u0637', ru: '\u041D\u0435\u0430\u043A\u0442\u0438\u0432\u043D\u044B\u0439', ja: '\u975E\u30A2\u30AF\u30C6\u30A3\u30D6',
      'es-CO-paisa': 'Inactivo, pues', 'es-MX-chido': 'Inactivo, güey', 'x-piglatin': 'Inactivoway',
    },

    // Pagination / table
    'filas por p\u00e1gina': {
      en: 'rows per page', pt: 'linhas por p\u00e1gina', fr: 'lignes par page', de: 'Zeilen pro Seite',
      zh: '\u6BCF\u9875\u884C\u6570', hi: '\u092A\u094D\u0930\u0924\u093F \u092A\u0943\u0937\u094D\u0920 \u092A\u0902\u0915\u094D\u0924\u093F\u092F\u093E\u0901', ar: '\u0635\u0641\u0648\u0641 \u0644\u0643\u0644 \u0635\u0641\u062D\u0629', ru: '\u0441\u0442\u0440\u043E\u043A \u043D\u0430 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0443', ja: '\u30DA\u30FC\u30B8\u3042\u305F\u308A\u306E\u884C\u6570',
      'es-CO-paisa': 'filas por página, pues', 'es-MX-chido': 'filas por página, güey', 'x-piglatin': 'Owsray Erpay Agepay',
    },
    'resultados': {
      en: 'results', pt: 'resultados', fr: 'r\u00e9sultats', de: 'Ergebnisse',
      zh: '\u7ED3\u679C', hi: '\u092A\u0930\u093F\u0923\u093E\u092E', ar: '\u0646\u062A\u0627\u0626\u062C', ru: '\u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u043E\u0432', ja: '\u4EF6',
      'es-CO-paisa': 'resultados, pues', 'es-MX-chido': 'resultados, güey', 'x-piglatin': 'Esultsray',
    },

    // Form / data
    'Nombre': {
      en: 'Name', pt: 'Nome', fr: 'Nom', de: 'Name',
      zh: '\u540D\u79F0', hi: '\u0928\u093E\u092E', ar: '\u0627\u0644\u0627\u0633\u0645', ru: '\u0418\u043C\u044F', ja: '\u540D\u524D',
      'es-CO-paisa': 'Nombre, pues', 'es-MX-chido': 'Nombre, güey', 'x-piglatin': 'Omenay',
    },
    'Descripci\u00f3n': {
      en: 'Description', pt: 'Descri\u00e7\u00e3o', fr: 'Description', de: 'Beschreibung',
      zh: '\u63CF\u8FF0', hi: '\u0935\u093F\u0935\u0930\u0923', ar: '\u0627\u0644\u0648\u0635\u0641', ru: '\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435', ja: '\u8AAC\u660E',
      'es-CO-paisa': 'Descripción, pues', 'es-MX-chido': 'Descripción, güey', 'x-piglatin': 'Escriptionday',
    },
    'Fecha': {
      en: 'Date', pt: 'Data', fr: 'Date', de: 'Datum',
      zh: '\u65E5\u671F', hi: '\u0924\u093E\u0930\u0940\u0916', ar: '\u0627\u0644\u062A\u0627\u0631\u064A\u062E', ru: '\u0414\u0430\u0442\u0430', ja: '\u65E5\u4ED8',
      'es-CO-paisa': 'Fecha, pues', 'es-MX-chido': 'Fecha, güey', 'x-piglatin': 'Echadfay',
    },
    'Estado': {
      en: 'Status', pt: 'Estado', fr: '\u00C9tat', de: 'Status',
      zh: '\u72B6\u6001', hi: '\u0938\u094D\u0925\u093F\u0924\u093F', ar: '\u0627\u0644\u062D\u0627\u0644\u0629', ru: '\u0421\u0442\u0430\u0442\u0443\u0441', ja: '\u30B9\u30C6\u30FC\u30BF\u30B9',
      'es-CO-paisa': 'Estado, pues', 'es-MX-chido': 'Estado, güey', 'x-piglatin': 'Estadoway',
    },
    'Tipo': {
      en: 'Type', pt: 'Tipo', fr: 'Type', de: 'Typ',
      zh: '\u7C7B\u578B', hi: '\u092A\u094D\u0930\u0915\u093E\u0930', ar: '\u0627\u0644\u0646\u0648\u0639', ru: '\u0422\u0438\u043F', ja: '\u30BF\u30A4\u30D7',
      'es-CO-paisa': 'Tipo, pues', 'es-MX-chido': 'Tipo, güey', 'x-piglatin': 'Ipotay',
    },
    'Peso': {
      en: 'Weight', pt: 'Peso', fr: 'Poids', de: 'Gewicht',
      zh: '\u4F53\u91CD', hi: '\u0935\u091C\u0928', ar: '\u0627\u0644\u0648\u0632\u0646', ru: '\u0412\u0435\u0441', ja: '\u4F53\u91CD',
      'es-CO-paisa': 'Peso, pues', 'es-MX-chido': 'Peso, güey', 'x-piglatin': 'Esopay',
    },
    'Raza': {
      en: 'Breed', pt: 'Ra\u00e7a', fr: 'Race', de: 'Rasse',
      zh: '\u54C1\u79CD', hi: '\u0928\u0938\u094D\u0932', ar: '\u0627\u0644\u0633\u0644\u0627\u0644\u0629', ru: '\u041F\u043E\u0440\u043E\u0434\u0430', ja: '\u54C1\u7A2E',
      'es-CO-paisa': 'Raza, pues', 'es-MX-chido': 'Raza, güey', 'x-piglatin': 'Azaray',
    },
    'Sexo': {
      en: 'Sex', pt: 'Sexo', fr: 'Sexe', de: 'Geschlecht',
      zh: '\u6027\u522B', hi: '\u0932\u093F\u0902\u0917', ar: '\u0627\u0644\u062C\u0646\u0633', ru: '\u041F\u043E\u043B', ja: '\u6027\u5225',
      'es-CO-paisa': 'Sexo, pues', 'es-MX-chido': 'Sexo, güey', 'x-piglatin': 'Exosay',
    },
    'Macho': {
      en: 'Male', pt: 'Macho', fr: 'M\u00e2le', de: 'M\u00e4nnlich',
      zh: '\u516C', hi: '\u0928\u0930', ar: '\u0630\u0643\u0631', ru: '\u0421\u0430\u043C\u0435\u0446', ja: '\u30AA\u30B9',
      'es-CO-paisa': 'Macho, pues', 'es-MX-chido': 'Macho, güey', 'x-piglatin': 'Achomay',
    },
    'Hembra': {
      en: 'Female', pt: 'F\u00eamea', fr: 'Femelle', de: 'Weiblich',
      zh: '\u6BCD', hi: '\u092E\u093E\u0926\u093E', ar: '\u0623\u0646\u062B\u0649', ru: '\u0421\u0430\u043C\u043A\u0430', ja: '\u30E1\u30B9',
      'es-CO-paisa': 'Hembra, pues', 'es-MX-chido': 'Hembra, güey', 'x-piglatin': 'Embrahay',
    },
    'Cargando': {
      en: 'Loading', pt: 'Carregando', fr: 'Chargement', de: 'Laden',
      zh: '\u52A0\u8F7D\u4E2D', hi: '\u0932\u094B\u0921 \u0939\u094B \u0930\u0939\u093E \u0939\u0948', ar: '\u062C\u0627\u0631\u064D \u0627\u0644\u062A\u062D\u0645\u064A\u0644', ru: '\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430', ja: '\u8AAD\u307F\u8FBC\u307F\u4E2D',
      'es-CO-paisa': 'Cargando, pues', 'es-MX-chido': 'Cargando, güey', 'x-piglatin': 'Argandocay',
    },
    'Exportar': {
      en: 'Export', pt: 'Exportar', fr: 'Exporter', de: 'Exportieren',
      zh: '\u5BFC\u51FA', hi: '\u0928\u093F\u0930\u094D\u092F\u093E\u0924 \u0915\u0930\u0947\u0902', ar: '\u062A\u0635\u062F\u064A\u0631', ru: '\u042D\u043A\u0441\u043F\u043E\u0440\u0442', ja: '\u30A8\u30AF\u30B9\u30DD\u30FC\u30C8',
      'es-CO-paisa': 'Exportar, pues', 'es-MX-chido': 'Exportar, güey', 'x-piglatin': 'Exportarway',
    },
    'Importar': {
      en: 'Import', pt: 'Importar', fr: 'Importer', de: 'Importieren',
      zh: '\u5BFC\u5165', hi: '\u0906\u092F\u093E\u0924 \u0915\u0930\u0947\u0902', ar: '\u0627\u0633\u062A\u064A\u0631\u0627\u062F', ru: '\u0418\u043C\u043F\u043E\u0440\u0442', ja: '\u30A4\u30F3\u30DD\u30FC\u30C8',
      'es-CO-paisa': 'Importar, pues', 'es-MX-chido': 'Importar, güey', 'x-piglatin': 'Importarway',
    },
    'Filtrar': {
      en: 'Filter', pt: 'Filtrar', fr: 'Filtrer', de: 'Filtern',
      zh: '\u7B5B\u9009', hi: '\u0928\u093F\u0938\u094D\u092A\u0902\u0926\u0928', ar: '\u062A\u0635\u0641\u064A\u0629', ru: '\u0424\u0438\u043B\u044C\u0442\u0440', ja: '\u30D5\u30A3\u30EB\u30BF\u30FC',
      'es-CO-paisa': 'Filtrar, pues', 'es-MX-chido': 'Filtrar, güey', 'x-piglatin': 'Iltarfray',
    },
    'Anterior': {
      en: 'Previous', pt: 'Anterior', fr: 'Pr\u00e9c\u00e9dent', de: 'Zur\u00fcck',
      zh: '\u4E0A\u4E00\u9875', hi: '\u092A\u093F\u091B\u0932\u093E', ar: '\u0627\u0644\u0633\u0627\u0628\u0642', ru: '\u041D\u0430\u0437\u0430\u0434', ja: '\u524D\u3078',
      'es-CO-paisa': 'Anterior, pues', 'es-MX-chido': 'Anterior, güey', 'x-piglatin': 'Anteriorway',
    },
    'Siguiente': {
      en: 'Next', pt: 'Pr\u00f3ximo', fr: 'Suivant', de: 'Weiter',
      zh: '\u4E0B\u4E00\u9875', hi: '\u0905\u0917\u0932\u093E', ar: '\u0627\u0644\u062A\u0627\u0644\u064A', ru: '\u0412\u043F\u0435\u0440\u0451\u0434', ja: '\u6B21\u3078',
      'es-CO-paisa': 'Siguiente, pues', 'es-MX-chido': 'Siguiente, güey', 'x-piglatin': 'Iguientesay',
    },
    'Detalle': {
      en: 'Detail', pt: 'Detalhe', fr: 'D\u00e9tail', de: 'Detail',
      zh: '\u8BE6\u60C5', hi: '\u0935\u093F\u0935\u0930\u0923', ar: '\u0627\u0644\u062A\u0641\u0627\u0635\u064A\u0644', ru: '\u0414\u0435\u0442\u0430\u043B\u0438', ja: '\u8A73\u7D30',
      'es-CO-paisa': 'Detalle, pues', 'es-MX-chido': 'Detalle, güey', 'x-piglatin': 'Etalleday',
    },
    'Detalles': {
      en: 'Details', pt: 'Detalhes', fr: 'D\u00e9tails', de: 'Details',
      zh: '\u8BE6\u60C5', hi: '\u0935\u093F\u0935\u0930\u0923', ar: '\u0627\u0644\u062A\u0641\u0627\u0635\u064A\u0644', ru: '\u041F\u043E\u0434\u0440\u043E\u0431\u043D\u043E\u0441\u0442\u0438', ja: '\u8A73\u7D30',
      'es-CO-paisa': 'Detalles, pues', 'es-MX-chido': 'Detalles, güey', 'x-piglatin': 'Etallesday',
    },
    'Nuevo': {
      en: 'New', pt: 'Novo', fr: 'Nouveau', de: 'Neu',
      zh: '\u65B0\u5EFA', hi: '\u0928\u092F\u093E', ar: '\u062C\u062F\u064A\u062F', ru: '\u041D\u043E\u0432\u044B\u0439', ja: '\u65B0\u898F',
      'es-CO-paisa': 'Nuevo, pues', 'es-MX-chido': 'Nuevo, güey', 'x-piglatin': 'Ewnay',
    },
    'Nueva': {
      en: 'New', pt: 'Nova', fr: 'Nouvelle', de: 'Neu',
      zh: '\u65B0\u5EFA', hi: '\u0928\u092F\u0940', ar: '\u062C\u062F\u064A\u062F\u0629', ru: '\u041D\u043E\u0432\u0430\u044F', ja: '\u65B0\u898F',
      'es-CO-paisa': 'Nueva, pues', 'es-MX-chido': 'Nueva, güey', 'x-piglatin': 'Ewnay',
    },
    'Ganado': {
      en: 'Cattle', pt: 'Gado', fr: 'B\u00e9tail', de: 'Vieh',
      zh: '\u7267\u573A', hi: '\u092A\u0936\u0941', ar: '\u0627\u0644\u0645\u0627\u0634\u064A\u0629', ru: '\u0421\u043A\u043E\u0442', ja: '\u5BB6\u755C',
      'es-CO-paisa': 'Ganado, pues', 'es-MX-chido': 'Ganado, güey', 'x-piglatin': 'Anadogay',
    },
    'Finca': {
      en: 'Farm', pt: 'Fazenda', fr: 'Ferme', de: 'Bauernhof',
      zh: '\u519C\u573A', hi: '\u0916\u0947\u0924', ar: '\u0627\u0644\u0645\u0632\u0631\u0639\u0629', ru: '\u0424\u0435\u0440\u043C\u0430', ja: '\u8FB2\u5834',
      'es-CO-paisa': 'Finca, pues', 'es-MX-chido': 'Finca, güey', 'x-piglatin': 'Incafay',
    },
    'Lote': {
      en: 'Lot', pt: 'Lote', fr: 'Lot', de: 'Los',
      zh: '\u6279\u6B21', hi: '\u0932\u0949\u091F', ar: '\u062F\u0641\u0639\u0629', ru: '\u041F\u0430\u0440\u0442\u0438\u044F', ja: '\u30ED\u30C3\u30C8',
      'es-CO-paisa': 'Lote, pues', 'es-MX-chido': 'Lote, güey', 'x-piglatin': 'Otelay',
    },
    'Precio': {
      en: 'Price', pt: 'Pre\u00e7o', fr: 'Prix', de: 'Preis',
      zh: '\u4EF7\u683C', hi: '\u0915\u0940\u092E\u0924', ar: '\u0627\u0644\u0633\u0639\u0631', ru: '\u0426\u0435\u043D\u0430', ja: '\u4FA1\u683C',
      'es-CO-paisa': 'Precio, pues', 'es-MX-chido': 'Precio, güey', 'x-piglatin': 'Icepray',
    },
    'Total': {
      en: 'Total', pt: 'Total', fr: 'Total', de: 'Gesamt',
      zh: '\u5408\u8BA1', hi: '\u0915\u0941\u0932', ar: '\u0627\u0644\u0625\u062C\u0645\u0627\u0644\u064A', ru: '\u0418\u0442\u043E\u0433\u043E', ja: '\u5408\u8A08',
      'es-CO-paisa': 'Total, pues', 'es-MX-chido': 'Total, güey', 'x-piglatin': 'Otaltay',
    },
    'Cantidad': {
      en: 'Quantity', pt: 'Quantidade', fr: 'Quantit\u00e9', de: 'Menge',
      zh: '\u6570\u91CF', hi: '\u092E\u093E\u0924\u094D\u0930\u093E', ar: '\u0627\u0644\u0643\u0645\u064A\u0629', ru: '\u041A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u043E', ja: '\u6570\u91CF',
      'es-CO-paisa': 'Cantidad, pues', 'es-MX-chido': 'Cantidad, güey', 'x-piglatin': 'Antidadcay',
    },
    'Observaciones': {
      en: 'Observations', pt: 'Observa\u00e7\u00f5es', fr: 'Observations', de: 'Beobachtungen',
      zh: '\u5907\u6CE8', hi: '\u0905\u0935\u0932\u094B\u0915\u0928', ar: '\u0645\u0644\u0627\u062D\u0638\u0627\u062A', ru: '\u041D\u0430\u0431\u043B\u044E\u0434\u0435\u043D\u0438\u044F', ja: '\u5099\u8003',
      'es-CO-paisa': 'Observaciones, pues', 'es-MX-chido': 'Observaciones, güey', 'x-piglatin': 'Observacionesway',
    },
  };

  // Build a reverse map for restoring Spanish text when switching back to 'es'
  // Map: translated-text -> spanish-source, keyed by locale
  // Also build sorted keys for efficient matching (longest first to avoid partial matches)
  const _sortedSpanishKeys = Object.keys(DICT).sort((a, b) => b.length - a.length);

  // ── Locale detection ───────────────────────────────────────────────────────
  function detectLocale() {
    // 1. localStorage
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED_LOCALES.find(l => l.code === stored)) return stored;

    // 2. navigator.language
    if (navigator.language) {
      const nav = navigator.language.slice(0, 2).toLowerCase();
      if (SUPPORTED_LOCALES.find(l => l.code === nav)) return nav;
    }

    // 3. default
    return DEFAULT_LOCALE;
  }

  let currentLocale = detectLocale();

  // ── DOM text translation engine ────────────────────────────────────────────
  // We maintain a WeakMap to remember the original (Spanish) text of each node
  // so we can re-translate when the user switches languages.
  const originalTextMap = new WeakMap();

  function translateTextNode(node) {
    if (!node || node.nodeType !== Node.TEXT_NODE) return;
    const text = node.textContent;
    if (!text || !text.trim()) return;
    if (currentLocale === DEFAULT_LOCALE) {
      // Restore original if we have it
      if (originalTextMap.has(node)) {
        node.textContent = originalTextMap.get(node);
      }
      return;
    }

    const trimmed = text.trim();

    // Try exact match first
    if (DICT[trimmed] && DICT[trimmed][currentLocale]) {
      if (!originalTextMap.has(node)) originalTextMap.set(node, text);
      // Preserve surrounding whitespace
      node.textContent = text.replace(trimmed, DICT[trimmed][currentLocale]);
      return;
    }

    // Try substring matches for longer text containing known phrases
    let modified = text;
    let changed = false;
    for (const key of _sortedSpanishKeys) {
      if (modified.includes(key) && DICT[key][currentLocale]) {
        if (!changed) {
          if (!originalTextMap.has(node)) originalTextMap.set(node, text);
          changed = true;
        }
        modified = modified.split(key).join(DICT[key][currentLocale]);
      }
    }
    if (changed) {
      node.textContent = modified;
    }
  }

  function walkAndTranslate(root) {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        // Skip our own overlay
        if (node.parentElement && node.parentElement.closest('#ganado-i18n-overlay')) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    while (walker.nextNode()) {
      translateTextNode(walker.currentNode);
    }
  }

  function translatePage() {
    walkAndTranslate(document.body);

    // Also try to reach into shadow DOMs (Flutter may use them)
    try {
      document.querySelectorAll('*').forEach(function (el) {
        if (el.shadowRoot) {
          walkAndTranslate(el.shadowRoot);
        }
      });
    } catch (e) {
      // Shadow DOM access may fail — that's OK
    }
  }

  // ── MutationObserver ───────────────────────────────────────────────────────
  let observer = null;
  let scanTimer = null;

  function startObserving() {
    if (observer) observer.disconnect();

    observer = new MutationObserver(function (mutations) {
      for (const mutation of mutations) {
        // Translate added nodes
        for (const node of mutation.addedNodes) {
          if (node.nodeType === Node.TEXT_NODE) {
            translateTextNode(node);
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            // Skip our own overlay
            if (node.id === 'ganado-i18n-overlay' || node.closest && node.closest('#ganado-i18n-overlay')) continue;
            walkAndTranslate(node);
            // Check shadow root
            if (node.shadowRoot) walkAndTranslate(node.shadowRoot);
          }
        }
        // Also handle characterData changes
        if (mutation.type === 'characterData' && mutation.target.nodeType === Node.TEXT_NODE) {
          // Reset original since the source text changed
          originalTextMap.delete(mutation.target);
          translateTextNode(mutation.target);
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    // Periodic fallback scan (handles Shadow DOM content that MutationObserver misses)
    if (scanTimer) clearInterval(scanTimer);
    scanTimer = setInterval(function () {
      if (currentLocale !== DEFAULT_LOCALE) {
        translatePage();
      }
    }, SCAN_INTERVAL_MS);
  }

  // ── Language selector UI ───────────────────────────────────────────────────
  function buildUI() {
    // Container
    var container = document.createElement('div');
    container.id = 'ganado-i18n-overlay';

    // Inject styles
    var style = document.createElement('style');
    style.textContent = [
      '#ganado-i18n-overlay {',
      '  position: fixed;',
      '  bottom: 16px;',
      '  left: 16px;',
      '  z-index: 99999;',
      '  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;',
      '  font-size: 14px;',
      '}',
      '#ganado-i18n-btn {',
      '  display: flex;',
      '  align-items: center;',
      '  gap: 6px;',
      '  background: #4CAF50;',
      '  color: #fff;',
      '  border: none;',
      '  border-radius: 24px;',
      '  padding: 8px 14px;',
      '  cursor: pointer;',
      '  box-shadow: 0 2px 8px rgba(0,0,0,0.25);',
      '  font-size: 13px;',
      '  font-weight: 500;',
      '  transition: background 0.2s, box-shadow 0.2s;',
      '  line-height: 1;',
      '}',
      '#ganado-i18n-btn:hover {',
      '  background: #43A047;',
      '  box-shadow: 0 4px 12px rgba(0,0,0,0.3);',
      '}',
      '#ganado-i18n-btn .btn-icon {',
      '  font-size: 16px;',
      '}',
      '#ganado-i18n-dropdown {',
      '  display: none;',
      '  position: absolute;',
      '  bottom: 44px;',
      '  left: 0;',
      '  background: #fff;',
      '  border-radius: 10px;',
      '  box-shadow: 0 4px 20px rgba(0,0,0,0.2);',
      '  overflow: hidden;',
      '  min-width: 180px;',
      '  border: 1px solid #e0e0e0;',
      '}',
      '#ganado-i18n-dropdown.open {',
      '  display: block;',
      '}',
      '#ganado-i18n-dropdown .i18n-header {',
      '  padding: 10px 14px 6px;',
      '  font-size: 11px;',
      '  font-weight: 600;',
      '  color: #888;',
      '  text-transform: uppercase;',
      '  letter-spacing: 0.5px;',
      '  border-bottom: 1px solid #f0f0f0;',
      '}',
      '.i18n-option {',
      '  display: flex;',
      '  align-items: center;',
      '  gap: 8px;',
      '  padding: 9px 14px;',
      '  cursor: pointer;',
      '  color: #333;',
      '  transition: background 0.15s;',
      '  font-size: 13px;',
      '  border: none;',
      '  background: none;',
      '  width: 100%;',
      '  text-align: left;',
      '}',
      '.i18n-option:hover {',
      '  background: #f5f5f5;',
      '}',
      '.i18n-option.active {',
      '  background: #E8F5E9;',
      '  font-weight: 600;',
      '  color: #2E7D32;',
      '}',
      '.i18n-option .opt-flag {',
      '  font-size: 16px;',
      '  width: 22px;',
      '  text-align: center;',
      '}',
      '.i18n-option .opt-name {',
      '  flex: 1;',
      '}',
      '.i18n-option .opt-check {',
      '  font-size: 14px;',
      '  color: #4CAF50;',
      '}',
      '.i18n-separator {',
      '  height: 1px;',
      '  background: #e0e0e0;',
      '  margin: 4px 14px;',
      '}',
      '.i18n-separator-label {',
      '  padding: 6px 14px 2px;',
      '  font-size: 10px;',
      '  font-weight: 600;',
      '  color: #aaa;',
      '  text-transform: uppercase;',
      '  letter-spacing: 0.5px;',
      '}',
    ].join('\n');

    container.appendChild(style);

    // Dropdown
    var dropdown = document.createElement('div');
    dropdown.id = 'ganado-i18n-dropdown';

    var header = document.createElement('div');
    header.className = 'i18n-header';
    header.textContent = 'Language / Idioma';
    dropdown.appendChild(header);

    SUPPORTED_LOCALES.forEach(function (loc) {
      // Insert separator before fun languages
      if (loc._separator) {
        var sep = document.createElement('div');
        sep.className = 'i18n-separator';
        dropdown.appendChild(sep);
        var sepLabel = document.createElement('div');
        sepLabel.className = 'i18n-separator-label';
        sepLabel.textContent = 'Fun / Divertido';
        dropdown.appendChild(sepLabel);
      }
      var opt = document.createElement('button');
      opt.className = 'i18n-option' + (loc.code === currentLocale ? ' active' : '');
      opt.setAttribute('data-locale', loc.code);
      opt.innerHTML =
        '<span class="opt-flag">' + loc.flag + '</span>' +
        '<span class="opt-name">' + loc.name + '</span>' +
        (loc.code === currentLocale ? '<span class="opt-check">\u2713</span>' : '');
      opt.addEventListener('click', function () {
        selectLocale(loc.code);
      });
      dropdown.appendChild(opt);
    });

    container.appendChild(dropdown);

    // Button
    var currentInfo = SUPPORTED_LOCALES.find(function (l) { return l.code === currentLocale; });
    var btn = document.createElement('button');
    btn.id = 'ganado-i18n-btn';
    btn.innerHTML = '<span class="btn-icon">\uD83C\uDF10</span><span id="ganado-i18n-label">' +
      (currentInfo ? currentInfo.flag + ' ' + currentInfo.name : currentLocale) + '</span>';
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      dropdown.classList.toggle('open');
    });

    container.appendChild(btn);

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!container.contains(e.target)) {
        dropdown.classList.remove('open');
      }
    });

    document.body.appendChild(container);
  }

  function selectLocale(code) {
    currentLocale = code;
    localStorage.setItem(STORAGE_KEY, code);

    // Update button label
    var info = SUPPORTED_LOCALES.find(function (l) { return l.code === code; });
    var label = document.getElementById('ganado-i18n-label');
    if (label && info) {
      label.textContent = info.flag + ' ' + info.name;
    }

    // Update dropdown active state
    var dropdown = document.getElementById('ganado-i18n-dropdown');
    if (dropdown) {
      dropdown.querySelectorAll('.i18n-option').forEach(function (opt) {
        var isActive = opt.getAttribute('data-locale') === code;
        opt.className = 'i18n-option' + (isActive ? ' active' : '');
        // Update check mark
        var check = opt.querySelector('.opt-check');
        if (isActive && !check) {
          var span = document.createElement('span');
          span.className = 'opt-check';
          span.textContent = '\u2713';
          opt.appendChild(span);
        } else if (!isActive && check) {
          check.remove();
        }
      });
      dropdown.classList.remove('open');
    }

    // If switching back to Spanish, restore all original texts first
    if (code === DEFAULT_LOCALE) {
      restoreOriginalTexts(document.body);
      try {
        document.querySelectorAll('*').forEach(function (el) {
          if (el.shadowRoot) restoreOriginalTexts(el.shadowRoot);
        });
      } catch (e) { /* ignore */ }
    } else {
      translatePage();
    }
  }

  function restoreOriginalTexts(root) {
    if (!root) return;
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        if (node.parentElement && node.parentElement.closest('#ganado-i18n-overlay')) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    while (walker.nextNode()) {
      var node = walker.currentNode;
      if (originalTextMap.has(node)) {
        node.textContent = originalTextMap.get(node);
      }
    }
  }

  // ── Initialization ─────────────────────────────────────────────────────────
  function init() {
    buildUI();

    // Initial translation pass (if not Spanish)
    if (currentLocale !== DEFAULT_LOCALE) {
      // Slight delay to let Flutter render first
      setTimeout(translatePage, 1000);
      setTimeout(translatePage, 3000);
    }

    startObserving();

    console.log('[Ganado i18n] Overlay loaded. Locale:', currentLocale);
  }

  // Wait for DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
