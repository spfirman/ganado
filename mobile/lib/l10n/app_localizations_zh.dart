// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for Chinese (`zh`).
class AppLocalizationsZh extends AppLocalizations {
  AppLocalizationsZh([String locale = 'zh']) : super(locale);

  @override
  String get appTitle => 'Ganado';

  @override
  String get login => '登录';

  @override
  String get username => '用户名';

  @override
  String get password => '密码';

  @override
  String get loginButton => '登录';

  @override
  String get logout => '退出登录';

  @override
  String get dashboard => '仪表盘';

  @override
  String get cattle => '牲畜';

  @override
  String get brands => '品牌';

  @override
  String get locations => '位置';

  @override
  String get purchases => '采购';

  @override
  String get sales => '销售';

  @override
  String get providers => '供应商';

  @override
  String get events => '事件';

  @override
  String get massiveEvents => '批量事件';

  @override
  String get simpleEvents => '简单事件';

  @override
  String get receptions => '接收';

  @override
  String get devices => '设备';

  @override
  String get deviceProfiles => '设备配置';

  @override
  String get employees => '员工';

  @override
  String get users => '用户';

  @override
  String get roles => '角色';

  @override
  String get settings => '设置';

  @override
  String get search => '搜索';

  @override
  String get save => '保存';

  @override
  String get cancel => '取消';

  @override
  String get delete => '删除';

  @override
  String get edit => '编辑';

  @override
  String get create => '创建';

  @override
  String get confirm => '确认';

  @override
  String get loading => '加载中...';

  @override
  String get error => '错误';

  @override
  String get retry => '重试';

  @override
  String get noData => '暂无数据';

  @override
  String get offline => '离线';

  @override
  String get syncing => '同步中...';

  @override
  String get syncComplete => '同步完成';

  @override
  String pendingSync(int count) {
    return '$count 个待同步更改';
  }

  @override
  String get cattleNumber => '编号';

  @override
  String get weight => '体重';

  @override
  String get recordWeight => '记录体重';

  @override
  String get medication => '药物';

  @override
  String get addMedication => '添加药物';

  @override
  String get brand => '品牌';

  @override
  String get color => '颜色';

  @override
  String get gender => '性别';

  @override
  String get male => '公';

  @override
  String get female => '母';

  @override
  String get status => '状态';

  @override
  String get lot => '批次';

  @override
  String get eartag => '耳标';

  @override
  String get castrated => '已阉割';

  @override
  String get comments => '备注';

  @override
  String get importExcel => '导入Excel';

  @override
  String get totalCattle => '牲畜总数';

  @override
  String get activeEvents => '活跃事件';

  @override
  String get pendingReceptions => '待接收';

  @override
  String get loginFailed => '凭据无效';

  @override
  String get sessionExpired => '会话已过期，请重新登录。';

  @override
  String get provider => '供应商';

  @override
  String get nit => '税号';

  @override
  String get contact => '联系方式';

  @override
  String get price => '价格';

  @override
  String get pricePerKg => '每公斤价格';

  @override
  String get date => '日期';

  @override
  String get total => '合计';

  @override
  String get closeEvent => '关闭事件';

  @override
  String get applyEvent => '应用事件';

  @override
  String get receiveAnimals => '接收动物';

  @override
  String get assignLot => '分配批次';
}
