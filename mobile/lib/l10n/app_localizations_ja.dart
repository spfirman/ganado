// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for Japanese (`ja`).
class AppLocalizationsJa extends AppLocalizations {
  AppLocalizationsJa([String locale = 'ja']) : super(locale);

  @override
  String get appTitle => 'Ganado';

  @override
  String get login => 'ログイン';

  @override
  String get username => 'ユーザー名';

  @override
  String get password => 'パスワード';

  @override
  String get loginButton => 'サインイン';

  @override
  String get logout => 'ログアウト';

  @override
  String get dashboard => 'ダッシュボード';

  @override
  String get cattle => '家畜';

  @override
  String get brands => 'ブランド';

  @override
  String get locations => '場所';

  @override
  String get purchases => '購入';

  @override
  String get sales => '販売';

  @override
  String get providers => '仕入先';

  @override
  String get events => 'イベント';

  @override
  String get massiveEvents => '一括イベント';

  @override
  String get simpleEvents => '単純イベント';

  @override
  String get receptions => '受入';

  @override
  String get devices => 'デバイス';

  @override
  String get deviceProfiles => 'デバイスプロファイル';

  @override
  String get employees => '従業員';

  @override
  String get users => 'ユーザー';

  @override
  String get roles => '役割';

  @override
  String get settings => '設定';

  @override
  String get search => '検索';

  @override
  String get save => '保存';

  @override
  String get cancel => 'キャンセル';

  @override
  String get delete => '削除';

  @override
  String get edit => '編集';

  @override
  String get create => '作成';

  @override
  String get confirm => '確認';

  @override
  String get loading => '読み込み中...';

  @override
  String get error => 'エラー';

  @override
  String get retry => '再試行';

  @override
  String get noData => 'データなし';

  @override
  String get offline => 'オフライン';

  @override
  String get syncing => '同期中...';

  @override
  String get syncComplete => '同期完了';

  @override
  String pendingSync(int count) {
    return '$count 件の未同期の変更';
  }

  @override
  String get cattleNumber => '番号';

  @override
  String get weight => '体重';

  @override
  String get recordWeight => '体重を記録';

  @override
  String get medication => '薬';

  @override
  String get addMedication => '薬を追加';

  @override
  String get brand => 'ブランド';

  @override
  String get color => '色';

  @override
  String get gender => '性別';

  @override
  String get male => 'オス';

  @override
  String get female => 'メス';

  @override
  String get status => 'ステータス';

  @override
  String get lot => 'ロット';

  @override
  String get eartag => '耳標';

  @override
  String get castrated => '去勢済み';

  @override
  String get comments => 'コメント';

  @override
  String get importExcel => 'Excelインポート';

  @override
  String get totalCattle => '家畜合計';

  @override
  String get activeEvents => 'アクティブなイベント';

  @override
  String get pendingReceptions => '保留中の受入';

  @override
  String get loginFailed => '認証情報が無効です';

  @override
  String get sessionExpired => 'セッションが期限切れです。再度ログインしてください。';

  @override
  String get provider => '仕入先';

  @override
  String get nit => '納税者番号';

  @override
  String get contact => '連絡先';

  @override
  String get price => '価格';

  @override
  String get pricePerKg => 'kg当たりの価格';

  @override
  String get date => '日付';

  @override
  String get total => '合計';

  @override
  String get closeEvent => 'イベントを閉じる';

  @override
  String get applyEvent => 'イベントを適用';

  @override
  String get receiveAnimals => '動物を受け入れる';

  @override
  String get assignLot => 'ロットを割り当てる';
}
