import cryptoFramework from "@ohos:security.cryptoFramework";
import buffer from "@ohos:buffer";
/**
 * AES-GCM 加密工具类
 * 用于密码字段的加密/解密
 */
export class CryptoUtil {
    // 固定密钥（实际应用中应考虑更安全的密钥管理方式）
    private static readonly KEY_STRING: string = 'PrivacyTools2024SecureKeyVault!';
    private static readonly IV_LENGTH: number = 12; // GCM 推荐 IV 长度
    private static readonly TAG_LENGTH: number = 128; // GCM 认证标签长度
    /**
     * 降级 XOR 加密（当 cryptoFramework 不可用时）
     */
    private static xorEncrypt(plainText: string): string {
        const keyBuf = buffer.from(CryptoUtil.KEY_STRING, 'utf-8');
        const textBuf = buffer.from(plainText, 'utf-8');
        for (let i = 0; i < textBuf.length; i++) {
            textBuf[i] = textBuf[i] ^ keyBuf[i % keyBuf.length];
        }
        return textBuf.toString('base64');
    }
    /**
     * 降级 XOR 解密
     */
    private static xorDecrypt(cipherText: string): string {
        const keyBuf = buffer.from(CryptoUtil.KEY_STRING, 'utf-8');
        const textBuf = buffer.from(cipherText, 'base64');
        for (let i = 0; i < textBuf.length; i++) {
            textBuf[i] = textBuf[i] ^ keyBuf[i % keyBuf.length];
        }
        return textBuf.toString('utf-8');
    }
    /**
     * 生成 AES-GCM 密钥
     */
    private static async generateKey(): Promise<cryptoFramework.SymKey> {
        try {
            const aesGenerator = cryptoFramework.createSymKeyGenerator('AES256');
            const keyBuf = buffer.from(CryptoUtil.KEY_STRING, 'utf-8');
            const keyBytes = new Uint8Array(32);
            for (let i = 0; i < 32; i++) {
                keyBytes[i] = keyBuf[i % keyBuf.length];
            }
            return await aesGenerator.convertKey({ data: keyBytes });
        }
        catch (e) {
            console.error('Generate key error:', JSON.stringify(e));
            throw new Error(String(e));
        }
    }
    /**
     * 生成随机 IV
     */
    private static generateIv(): Uint8Array {
        const iv = new Uint8Array(CryptoUtil.IV_LENGTH);
        for (let i = 0; i < CryptoUtil.IV_LENGTH; i++) {
            iv[i] = Math.floor(Math.random() * 256);
        }
        return iv;
    }
    /**
     * 加密文本
     * @param plainText 明文
     * @returns 加密后的 Base64 字符串（IV + ciphertext + tag）
     */
    static async encrypt(plainText: string): Promise<string> {
        if (!plainText) {
            return '';
        }
        try {
            const key = await CryptoUtil.generateKey();
            const iv = CryptoUtil.generateIv();
            const cipher = cryptoFramework.createCipher('AES256|GCM|NoPadding');
            const gcmParams: cryptoFramework.GcmParamsSpec = {
                iv: { data: iv },
                aad: { data: new Uint8Array(0) },
                authTag: { data: new Uint8Array(16) },
                algName: 'AES256|GCM|NoPadding'
            };
            await cipher.init(cryptoFramework.CryptoMode.ENCRYPT_MODE, key, gcmParams);
            const plainBuf = buffer.from(plainText, 'utf-8');
            const plainArray = new Uint8Array(plainBuf.length);
            for (let i = 0; i < plainBuf.length; i++) {
                plainArray[i] = plainBuf[i];
            }
            const input: cryptoFramework.DataBlob = { data: plainArray };
            const encrypted = await cipher.doFinal(input);
            const combined = new Uint8Array(iv.length + encrypted.data.length + gcmParams.authTag.data.length);
            combined.set(iv, 0);
            combined.set(encrypted.data, iv.length);
            combined.set(gcmParams.authTag.data, iv.length + encrypted.data.length);
            const outBuf = buffer.alloc(combined.length);
            for (let i = 0; i < combined.length; i++) {
                outBuf[i] = combined[i];
            }
            return outBuf.toString('base64');
        }
        catch (err) {
            console.error('AES encrypt error, fallback to XOR:', JSON.stringify(err));
            return CryptoUtil.xorEncrypt(plainText);
        }
    }
    /**
     * 解密文本
     * @param cipherText Base64 加密字符串
     * @returns 明文
     */
    static async decrypt(cipherText: string): Promise<string> {
        if (!cipherText) {
            return '';
        }
        try {
            const key = await CryptoUtil.generateKey();
            const combinedBuf = buffer.from(cipherText, 'base64');
            const combined = new Uint8Array(combinedBuf.length);
            for (let i = 0; i < combinedBuf.length; i++) {
                combined[i] = combinedBuf[i];
            }
            const iv = combined.slice(0, CryptoUtil.IV_LENGTH);
            const tagLength = CryptoUtil.TAG_LENGTH / 8;
            const cipherData = combined.slice(CryptoUtil.IV_LENGTH, combined.length - tagLength);
            const authTag = combined.slice(combined.length - tagLength);
            const decipher = cryptoFramework.createCipher('AES256|GCM|NoPadding');
            const gcmParams: cryptoFramework.GcmParamsSpec = {
                iv: { data: iv },
                aad: { data: new Uint8Array(0) },
                authTag: { data: authTag },
                algName: 'AES256|GCM|NoPadding'
            };
            await decipher.init(cryptoFramework.CryptoMode.DECRYPT_MODE, key, gcmParams);
            const decrypted = await decipher.doFinal({ data: cipherData });
            const outBuf = buffer.alloc(decrypted.data.length);
            for (let i = 0; i < decrypted.data.length; i++) {
                outBuf[i] = decrypted.data[i];
            }
            return outBuf.toString('utf-8');
        }
        catch (err) {
            console.error('AES decrypt error, fallback to XOR:', JSON.stringify(err));
            return CryptoUtil.xorDecrypt(cipherText);
        }
    }
    /**
     * 生成随机密码
     */
    static generateRandomPassword(length: number = 16, includeNumbers: boolean = true, includeLowercase: boolean = true, includeUppercase: boolean = true, includeSpecial: boolean = true, excludeAmbiguous: boolean = false): string {
        let chars = '';
        if (includeLowercase) {
            chars += 'abcdefghjkmnpqrstuvwxyz';
        }
        if (includeUppercase) {
            chars += 'ABCDEFGHJKMNPQRSTUVWXYZ';
        }
        if (includeNumbers) {
            chars += '23456789';
        }
        if (includeSpecial) {
            chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
        }
        if (!excludeAmbiguous) {
            if (includeLowercase)
                chars += 'ilo';
            if (includeUppercase)
                chars += 'ILO';
            if (includeNumbers)
                chars += '01';
        }
        if (chars.length === 0) {
            chars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789';
        }
        let password = '';
        const array = new Uint8Array(length);
        for (let i = 0; i < length; i++) {
            array[i] = Math.floor(Math.random() * 256);
        }
        for (let i = 0; i < length; i++) {
            password += chars[array[i] % chars.length];
        }
        return password;
    }
}
