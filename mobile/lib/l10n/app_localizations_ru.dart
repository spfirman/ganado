// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for Russian (`ru`).
class AppLocalizationsRu extends AppLocalizations {
  AppLocalizationsRu([String locale = 'ru']) : super(locale);

  @override
  String get appTitle => 'Ganado';

  @override
  String get login => 'Вход';

  @override
  String get username => 'Имя пользователя';

  @override
  String get password => 'Пароль';

  @override
  String get loginButton => 'Войти';

  @override
  String get logout => 'Выйти';

  @override
  String get dashboard => 'Панель управления';

  @override
  String get cattle => 'Скот';

  @override
  String get brands => 'Бренды';

  @override
  String get locations => 'Местоположения';

  @override
  String get purchases => 'Закупки';

  @override
  String get sales => 'Продажи';

  @override
  String get providers => 'Поставщики';

  @override
  String get events => 'События';

  @override
  String get massiveEvents => 'Массовые события';

  @override
  String get simpleEvents => 'Простые события';

  @override
  String get receptions => 'Приёмки';

  @override
  String get devices => 'Устройства';

  @override
  String get deviceProfiles => 'Профили устройств';

  @override
  String get employees => 'Сотрудники';

  @override
  String get users => 'Пользователи';

  @override
  String get roles => 'Роли';

  @override
  String get settings => 'Настройки';

  @override
  String get search => 'Поиск';

  @override
  String get save => 'Сохранить';

  @override
  String get cancel => 'Отмена';

  @override
  String get delete => 'Удалить';

  @override
  String get edit => 'Редактировать';

  @override
  String get create => 'Создать';

  @override
  String get confirm => 'Подтвердить';

  @override
  String get loading => 'Загрузка...';

  @override
  String get error => 'Ошибка';

  @override
  String get retry => 'Повторить';

  @override
  String get noData => 'Нет данных';

  @override
  String get offline => 'Нет сети';

  @override
  String get syncing => 'Синхронизация...';

  @override
  String get syncComplete => 'Синхронизация завершена';

  @override
  String pendingSync(int count) {
    return '$count ожидающих изменений';
  }

  @override
  String get cattleNumber => 'Номер';

  @override
  String get weight => 'Вес';

  @override
  String get recordWeight => 'Записать вес';

  @override
  String get medication => 'Лекарство';

  @override
  String get addMedication => 'Добавить лекарство';

  @override
  String get brand => 'Бренд';

  @override
  String get color => 'Цвет';

  @override
  String get gender => 'Пол';

  @override
  String get male => 'Самец';

  @override
  String get female => 'Самка';

  @override
  String get status => 'Статус';

  @override
  String get lot => 'Партия';

  @override
  String get eartag => 'Ушная бирка';

  @override
  String get castrated => 'Кастрированный';

  @override
  String get comments => 'Комментарии';

  @override
  String get importExcel => 'Импорт Excel';

  @override
  String get totalCattle => 'Всего скота';

  @override
  String get activeEvents => 'Активные события';

  @override
  String get pendingReceptions => 'Ожидающие приёмки';

  @override
  String get loginFailed => 'Неверные учётные данные';

  @override
  String get sessionExpired => 'Сеанс истёк. Пожалуйста, войдите снова.';

  @override
  String get provider => 'Поставщик';

  @override
  String get nit => 'ИНН';

  @override
  String get contact => 'Контакт';

  @override
  String get price => 'Цена';

  @override
  String get pricePerKg => 'Цена за кг';

  @override
  String get date => 'Дата';

  @override
  String get total => 'Итого';

  @override
  String get closeEvent => 'Закрыть событие';

  @override
  String get applyEvent => 'Применить событие';

  @override
  String get receiveAnimals => 'Принять животных';

  @override
  String get assignLot => 'Назначить партию';
}
