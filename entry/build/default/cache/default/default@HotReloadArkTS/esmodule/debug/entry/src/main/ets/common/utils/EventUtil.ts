import emitter from "@ohos:events.emitter";
interface EventData {
    data: object;
}
type EventCallback = (eventData: EventData) => void;
export class EventUtil {
    static readonly EVENT_WEIGHT_SAVED = '10001';
    static readonly EVENT_PASSWORD_SAVED = '10002';
    private static weightId = 0;
    private static passwordId = 0;
    private static weightMap: Map<number, EventCallback> = new Map();
    private static passwordMap: Map<number, EventCallback> = new Map();
    static emitWeightSaved(): void {
        try {
            emitter.emit(EventUtil.EVENT_WEIGHT_SAVED, { data: {} });
        }
        catch (e) {
            console.error('Emit weight saved error:', JSON.stringify(e));
        }
    }
    static onWeightSaved(callback: () => void): number {
        try {
            const id = ++EventUtil.weightId;
            const wrapper: EventCallback = (eventData: EventData) => callback();
            EventUtil.weightMap.set(id, wrapper);
            emitter.on(EventUtil.EVENT_WEIGHT_SAVED, wrapper);
            return id;
        }
        catch (e) {
            console.error('On weight saved error:', JSON.stringify(e));
            return -1;
        }
    }
    static offWeightSaved(id?: number): void {
        try {
            if (id !== undefined && id > 0) {
                const wrapper = EventUtil.weightMap.get(id);
                if (wrapper) {
                    emitter.off(EventUtil.EVENT_WEIGHT_SAVED, wrapper);
                    EventUtil.weightMap.delete(id);
                }
            }
            else {
                EventUtil.weightMap.forEach((wrapper) => {
                    emitter.off(EventUtil.EVENT_WEIGHT_SAVED, wrapper);
                });
                EventUtil.weightMap.clear();
            }
        }
        catch (e) {
            console.error('Off weight saved error:', JSON.stringify(e));
        }
    }
    static emitPasswordSaved(): void {
        try {
            emitter.emit(EventUtil.EVENT_PASSWORD_SAVED, { data: {} });
        }
        catch (e) {
            console.error('Emit password saved error:', JSON.stringify(e));
        }
    }
    static onPasswordSaved(callback: () => void): number {
        try {
            const id = ++EventUtil.passwordId;
            const wrapper: EventCallback = (eventData: EventData) => callback();
            EventUtil.passwordMap.set(id, wrapper);
            emitter.on(EventUtil.EVENT_PASSWORD_SAVED, wrapper);
            return id;
        }
        catch (e) {
            console.error('On password saved error:', JSON.stringify(e));
            return -1;
        }
    }
    static offPasswordSaved(id?: number): void {
        try {
            if (id !== undefined && id > 0) {
                const wrapper = EventUtil.passwordMap.get(id);
                if (wrapper) {
                    emitter.off(EventUtil.EVENT_PASSWORD_SAVED, wrapper);
                    EventUtil.passwordMap.delete(id);
                }
            }
            else {
                EventUtil.passwordMap.forEach((wrapper) => {
                    emitter.off(EventUtil.EVENT_PASSWORD_SAVED, wrapper);
                });
                EventUtil.passwordMap.clear();
            }
        }
        catch (e) {
            console.error('Off password saved error:', JSON.stringify(e));
        }
    }
}
