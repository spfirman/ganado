// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for Arabic (`ar`).
class AppLocalizationsAr extends AppLocalizations {
  AppLocalizationsAr([String locale = 'ar']) : super(locale);

  @override
  String get appTitle => 'Ganado';

  @override
  String get login => 'تسجيل الدخول';

  @override
  String get username => 'اسم المستخدم';

  @override
  String get password => 'كلمة المرور';

  @override
  String get loginButton => 'دخول';

  @override
  String get logout => 'تسجيل الخروج';

  @override
  String get dashboard => 'لوحة التحكم';

  @override
  String get cattle => 'الماشية';

  @override
  String get brands => 'العلامات التجارية';

  @override
  String get locations => 'المواقع';

  @override
  String get purchases => 'المشتريات';

  @override
  String get sales => 'المبيعات';

  @override
  String get providers => 'الموردون';

  @override
  String get events => 'الأحداث';

  @override
  String get massiveEvents => 'أحداث جماعية';

  @override
  String get simpleEvents => 'أحداث بسيطة';

  @override
  String get receptions => 'الاستقبالات';

  @override
  String get devices => 'الأجهزة';

  @override
  String get deviceProfiles => 'ملفات تعريف الأجهزة';

  @override
  String get employees => 'الموظفون';

  @override
  String get users => 'المستخدمون';

  @override
  String get roles => 'الأدوار';

  @override
  String get settings => 'الإعدادات';

  @override
  String get search => 'بحث';

  @override
  String get save => 'حفظ';

  @override
  String get cancel => 'إلغاء';

  @override
  String get delete => 'حذف';

  @override
  String get edit => 'تعديل';

  @override
  String get create => 'إنشاء';

  @override
  String get confirm => 'تأكيد';

  @override
  String get loading => 'جاري التحميل...';

  @override
  String get error => 'خطأ';

  @override
  String get retry => 'إعادة المحاولة';

  @override
  String get noData => 'لا توجد بيانات';

  @override
  String get offline => 'غير متصل';

  @override
  String get syncing => 'جاري المزامنة...';

  @override
  String get syncComplete => 'اكتملت المزامنة';

  @override
  String pendingSync(int count) {
    return '$count تغييرات معلقة';
  }

  @override
  String get cattleNumber => 'الرقم';

  @override
  String get weight => 'الوزن';

  @override
  String get recordWeight => 'تسجيل الوزن';

  @override
  String get medication => 'الدواء';

  @override
  String get addMedication => 'إضافة دواء';

  @override
  String get brand => 'العلامة التجارية';

  @override
  String get color => 'اللون';

  @override
  String get gender => 'الجنس';

  @override
  String get male => 'ذكر';

  @override
  String get female => 'أنثى';

  @override
  String get status => 'الحالة';

  @override
  String get lot => 'الدفعة';

  @override
  String get eartag => 'علامة الأذن';

  @override
  String get castrated => 'مخصي';

  @override
  String get comments => 'التعليقات';

  @override
  String get importExcel => 'استيراد Excel';

  @override
  String get totalCattle => 'إجمالي الماشية';

  @override
  String get activeEvents => 'الأحداث النشطة';

  @override
  String get pendingReceptions => 'الاستقبالات المعلقة';

  @override
  String get loginFailed => 'بيانات الاعتماد غير صالحة';

  @override
  String get sessionExpired => 'انتهت الجلسة. يرجى تسجيل الدخول مرة أخرى.';

  @override
  String get provider => 'المورد';

  @override
  String get nit => 'الرقم الضريبي';

  @override
  String get contact => 'جهة الاتصال';

  @override
  String get price => 'السعر';

  @override
  String get pricePerKg => 'السعر لكل كجم';

  @override
  String get date => 'التاريخ';

  @override
  String get total => 'الإجمالي';

  @override
  String get closeEvent => 'إغلاق الحدث';

  @override
  String get applyEvent => 'تطبيق الحدث';

  @override
  String get receiveAnimals => 'استلام الحيوانات';

  @override
  String get assignLot => 'تعيين الدفعة';
}
