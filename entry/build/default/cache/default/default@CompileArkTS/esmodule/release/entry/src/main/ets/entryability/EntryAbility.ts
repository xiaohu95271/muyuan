import type AbilityConstant from "@ohos:app.ability.AbilityConstant";
import ConfigurationConstant from "@ohos:app.ability.ConfigurationConstant";
import UIAbility from "@ohos:app.ability.UIAbility";
import type Want from "@ohos:app.ability.Want";
import hilog from "@ohos:hilog";
import type window from "@ohos:window";
import { DatabaseManager } from "@normalized:N&&&entry/src/main/ets/common/database/DatabaseManager&";
const DOMAIN = 0x0000;
export default class EntryAbility extends UIAbility {
    onCreate(want: Want, launchParam: AbilityConstant.LaunchParam): void {
        try {
            this.context.getApplicationContext().setColorMode(ConfigurationConstant.ColorMode.COLOR_MODE_NOT_SET);
        }
        catch (err) {
            hilog.error(DOMAIN, 'testTag', 'Failed to set colorMode. Cause: %{public}s', JSON.stringify(err));
        }
        hilog.info(DOMAIN, 'testTag', '%{public}s', 'Ability onCreate');
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
    }
    onBackground(): void {
        // Ability has back to background
        hilog.info(DOMAIN, 'testTag', '%{public}s', 'Ability onBackground');
    }
}
