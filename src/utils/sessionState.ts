interface StoredEnvelope<T> {
  value: T;
  savedAt: number;
  expiresAt: number;
}

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isStoredEnvelope = <T>(value: unknown): value is StoredEnvelope<T> => {
  if (!isObject(value)) {
    return false;
  }

  return (
    'value' in value &&
    typeof value.savedAt === 'number' &&
    typeof value.expiresAt === 'number'
  );
};

const parseJson = (raw: string): unknown => {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const safeGetItem = (key: string): string | null => {
  try {
    return window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
};

const safeSetItem = (key: string, value: string): void => {
  try {
    window.sessionStorage.setItem(key, value);
  } catch {
    // Ignore storage write failures and keep app state in memory.
  }
};

const safeRemoveItem = (key: string): void => {
  try {
    window.sessionStorage.removeItem(key);
  } catch {
    // Ignore storage remove failures.
  }
};

export const saveSessionState = <T>(key: string, value: T, ttlMs: number): void => {
  const now = Date.now();
  const envelope: StoredEnvelope<T> = {
    value,
    savedAt: now,
    expiresAt: now + Math.max(0, ttlMs),
  };

  safeSetItem(key, JSON.stringify(envelope));
};

export const loadSessionState = <T>(
  key: string,
  isValueValid: (value: unknown) => value is T
): T | null => {
  const raw = safeGetItem(key);
  if (!raw) {
    return null;
  }

  const parsed = parseJson(raw);
  if (!isStoredEnvelope<T>(parsed)) {
    safeRemoveItem(key);
    return null;
  }

  if (Date.now() > parsed.expiresAt || !isValueValid(parsed.value)) {
    safeRemoveItem(key);
    return null;
  }

  return parsed.value;
};

export const cleanupExpiredSessionState = (keyPrefix: string): void => {
  const keysToDelete: string[] = [];
  const now = Date.now();

  try {
    for (let i = 0; i < window.sessionStorage.length; i += 1) {
      const key = window.sessionStorage.key(i);
      if (!key || !key.startsWith(keyPrefix)) {
        continue;
      }

      const raw = safeGetItem(key);
      if (!raw) {
        continue;
      }

      const parsed = parseJson(raw);
      if (!isStoredEnvelope(parsed) || now > parsed.expiresAt) {
        keysToDelete.push(key);
      }
    }
  } catch {
    return;
  }

  keysToDelete.forEach((key) => {
    safeRemoveItem(key);
  });
};
