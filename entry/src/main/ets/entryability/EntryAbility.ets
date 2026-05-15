import { AbilityConstant, ConfigurationConstant, UIAbility, Want } from '@kit.AbilityKit';
import { hilog } from '@kit.PerformanceAnalysisKit';
import { window } from '@kit.ArkUI';
import { DatabaseManager } from '../common/database/DatabaseManager';
import { EventUtil } from '../common/utils/EventUtil';
import { preferences } from '@kit.ArkData';
import { AppConstants } from '../common/constants/AppConstants';

const DOMAIN = 0x0000;

export default class EntryAbility extends UIAbility {
  onCreate(want: Want, launchParam: AbilityConstant.LaunchParam): void {
    try {
      this.context.getApplicationContext().setColorMode(ConfigurationConstant.ColorMode.COLOR_MODE_NOT_SET);
    } catch (err) {
      hilog.error(DOMAIN, 'testTag', 'Failed to set colorMode. Cause: %{public}s', JSON.stringify(err));
    }
    hilog.info(DOMAIN, 'testTag', '%{public}s', 'Ability onCreate');

    // 初始化应用锁相关 AppStorage
    AppStorage.setOrCreate('need_lock_verify', false);
    AppStorage.setOrCreate('app_background_time', 0);

    // 检查是否需要应用锁验证
    try {
      const pref = preferences.getPreferencesSync(this.context, { name: 'app_prefs' });
      const lockEnabled = pref.getSync(AppConstants.PREF_APP_LOCK_ENABLED, false) as boolean;
      const pin = pref.getSync(AppConstants.PREF_APP_LOCK_PIN, '') as string;
      if (lockEnabled && pin) {
        AppStorage.setOrCreate('need_lock_verify', true);
      }
    } catch (err) {
      hilog.error(DOMAIN, 'testTag', 'Check app lock error: %{public}s', JSON.stringify(err));
    }
  }

  onDestroy(): void {
    DatabaseManager.getInstance().close().catch((err: Error) => {
      hilog.error(DOMAIN, 'testTag', 'Failed to close database. Cause: %{public}s', JSON.stringify(err));
    });
    hilog.info(DOMAIN, 'testTag', '%{public}s', 'Ability onDestroy');
  }

  onWindowStageCreate(windowStage: window.WindowStage): void {
    // Main window is created, set main page for this ability
    hilog.info(DOMAIN, 'testTag', '%{public}s', 'Ability onWindowStageCreate');

    DatabaseManager.getInstance().init(this.context).then(() => {
      hilog.info(DOMAIN, 'testTag', 'Database initialized successfully');
      windowStage.loadContent('pages/Index', (err) => {
        if (err.code) {
          hilog.error(DOMAIN, 'testTag', 'Failed to load the content. Cause: %{public}s', JSON.stringify(err));
          return;
        }
        hilog.info(DOMAIN, 'testTag', 'Succeeded in loading the content.');
      });
    }).catch((err: Error) => {
      hilog.error(DOMAIN, 'testTag', 'Database init failed: %{public}s', JSON.stringify(err));
      windowStage.loadContent('pages/Index', (err) => {
        if (err.code) {
          hilog.error(DOMAIN, 'testTag', 'Failed to load the content. Cause: %{public}s', JSON.stringify(err));
          return;
        }
        hilog.info(DOMAIN, 'testTag', 'Succeeded in loading the content.');
      });
    });
  }

  onWindowStageDestroy(): void {
    // Main window is destroyed, release UI related resources
    hilog.info(DOMAIN, 'testTag', '%{public}s', 'Ability onWindowStageDestroy');
  }

  onForeground(): void {
    // Ability has brought to foreground
    hilog.info(DOMAIN, 'testTag', '%{public}s', 'Ability onForeground');
    AppStorage.setOrCreate('home_refresh_trigger', Date.now());

    // 检查是否需要重新验证应用锁
    try {
      const pref = preferences.getPreferencesSync(this.context, { name: 'app_prefs' });
      const lockEnabled = pref.getSync(AppConstants.PREF_APP_LOCK_ENABLED, false) as boolean;
      const pin = pref.getSync(AppConstants.PREF_APP_LOCK_PIN, '') as string;
      if (lockEnabled && pin) {
        const bgTime = AppStorage.get<number>('app_background_time') || 0;
        if (bgTime > 0) {
          const timeout = pref.getSync(AppConstants.PREF_AUTO_LOCK_TIMEOUT, AppConstants.DEFAULT_AUTO_LOCK_MINUTES) as number;
          const elapsed = (Date.now() - bgTime) / 1000 / 60; // 分钟
          if (elapsed >= timeout) {
            AppStorage.setOrCreate('need_lock_verify', true);
          }
        }
      }
    } catch (err) {
      hilog.error(DOMAIN, 'testTag', 'Check app lock on foreground error: %{public}s', JSON.stringify(err));
    }
  }

  onBackground(): void {
    // Ability has back to background
    hilog.info(DOMAIN, 'testTag', '%{public}s', 'Ability onBackground');
    // 记录进入后台的时间
    AppStorage.setOrCreate('app_background_time', Date.now());
  }
}