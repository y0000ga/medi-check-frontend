import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

type StorageAdapter = {
  setItem: (key: string, value: string) => Promise<void>;
  getItem: (key: string) => Promise<string | null>;
  deleteItem: (key: string) => Promise<void>;
};

const webStorage: StorageAdapter = {
  async setItem(key, value) {
    if (typeof window === "undefined") return;

    window.localStorage.setItem(key, value);
  },

  async getItem(key) {
    if (typeof window === "undefined") return null;

    return window.localStorage.getItem(key);
  },

  async deleteItem(key) {
    if (typeof window === "undefined") return;

    window.localStorage.removeItem(key);
  },
};

const secureStorage: StorageAdapter = {
  async setItem(key, value) {
    await SecureStore.setItemAsync(key, value);
  },

  async getItem(key) {
    return SecureStore.getItemAsync(key);
  },

  async deleteItem(key) {
    await SecureStore.deleteItemAsync(key);
  },
};

const getStorage = (): StorageAdapter => {
  if (Platform.OS === "web") {
    return webStorage;
  }

  return secureStorage;
};

export const tokenStorage = {
  async setAccessToken(token: string): Promise<void> {
    await getStorage().setItem(ACCESS_TOKEN_KEY, token);
  },

  async getAccessToken(): Promise<string | null> {
    return getStorage().getItem(ACCESS_TOKEN_KEY);
  },

  async deleteAccessToken(): Promise<void> {
    await getStorage().deleteItem(ACCESS_TOKEN_KEY);
  },

  async setRefreshToken(token: string): Promise<void> {
    await getStorage().setItem(REFRESH_TOKEN_KEY, token);
  },

  async getRefreshToken(): Promise<string | null> {
    return getStorage().getItem(REFRESH_TOKEN_KEY);
  },

  async deleteRefreshToken(): Promise<void> {
    await getStorage().deleteItem(REFRESH_TOKEN_KEY);
  },

  async clearTokens(): Promise<void> {
    await Promise.all([
      getStorage().deleteItem(ACCESS_TOKEN_KEY),
      getStorage().deleteItem(REFRESH_TOKEN_KEY),
    ]);
  },
};
