import * as crypto from 'crypto';

export const encrypt = (text: string) => {
  const cipher = crypto.createCipheriv(
    process.env.CRYPTO_ALGORITHM,
    Buffer.from(process.env.CRYPTO_KEY, 'base64'),
    Buffer.from(process.env.CRYPTO_IV, 'base64'),
  );
  let encrypted = cipher.update(text, 'utf-8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};
export const decrypt = (text: string): string => {
  const decipher = crypto.createDecipheriv(
    process.env.CRYPTO_ALGORITHM,
    Buffer.from(process.env.CRYPTO_KEY, 'base64'),
    Buffer.from(process.env.CRYPTO_IV, 'base64'),
  );
  let decrypted = decipher.update(text, 'hex', 'utf-8');
  decrypted += decipher.final('utf-8');
  return decrypted;
};
