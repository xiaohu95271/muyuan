import { promptAction } from '@kit.ArkUI';

/**
 * Toast 提示工具类
 */
export class ToastUtil {
  static show(message: string): void {
    try {
      promptAction.showToast({ message: message, duration: 2000 });
    } catch (e) {
      console.error('Show toast error:', JSON.stringify(e));
    }
  }
}
