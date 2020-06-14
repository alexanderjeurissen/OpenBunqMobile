const forge = require("node-forge");

// NOTE: taken from BunqJSClient to ensure compatibility with BunqClient#setup
// https://github.com/bunqCommunity/bunqJSClient/blob/master/src/Crypto/Pbkdf2.ts
export default async (
    password: string,
    iv: boolean | string = false,
    iterations: number = 10000
) => {
    if (iv === false) {
        // no iv given, create a new random one
        iv = forge.random.getBytesSync(128);
    } else {
        // get bytes from the hex iv
        iv = forge.util.hexToBytes(iv);
    }

    // asynchronously derive a key from the password
    const derivedKey = await new Promise((resolve, reject) => {
        // derive a 32-byte key from the password
        forge.pkcs5.pbkdf2(password, iv, iterations, 16, (errorMessage: string, derivedKey: string) => {
            /* istanbul ignore if - can't manually trigger an error with this lib */
            if (errorMessage) {
                reject(errorMessage);
            } else {
                resolve(derivedKey);
            }
        });
    });

    // encode the bytes as hex
    const hexKey = forge.util.bytesToHex(derivedKey);
    const hexSalt = forge.util.bytesToHex(iv);

    return {
        key: hexKey,
        iv: hexSalt
    };
};
