import crypto from "crypto";

const ALGO = "aes-256-gcm";

function getKey() {
  const hex = process.env.ENCRYPTION_KEY;
  if (!hex || hex.length !== 64) {
    throw new Error("ENCRYPTION_KEY missing ya galat hai (64 hex chars chahiye)");
  }
  return Buffer.from(hex, "hex");
}

// Format: iv:tag:data (sab hex mein)
export function encrypt(text) {
  const iv = crypto.randomBytes(12); // har baar naya IV
  const cipher = crypto.createCipheriv(ALGO, getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [iv.toString("hex"), tag.toString("hex"), encrypted.toString("hex")].join(":");
}

// Check karta hai ki value already encrypted format mein hai ya purana plaintext
export function isEncrypted(value) {
  if (typeof value !== "string") return false;
  const parts = value.split(":");
  return (
    parts.length === 3 &&
    parts[0].length === 24 && // 12 bytes IV
    parts[1].length === 32 && // 16 bytes tag
    parts.every((p) => /^[0-9a-f]+$/i.test(p))
  );
}

export function decrypt(payload) {
  // Purana plaintext secret hai toh jaisa hai waisa return (migration tak app na toote)
  if (!isEncrypted(payload)) return payload;

  const [ivHex, tagHex, dataHex] = payload.split(":");
  const decipher = crypto.createDecipheriv(ALGO, getKey(), Buffer.from(ivHex, "hex"));
  decipher.setAuthTag(Buffer.from(tagHex, "hex"));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(dataHex, "hex")),
    decipher.final(), // tag mismatch pe yahan error aayega
  ]);
  return decrypted.toString("utf8");
}