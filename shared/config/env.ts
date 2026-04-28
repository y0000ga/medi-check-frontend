export const env = {
  apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL,
};

if (!env.apiBaseUrl) {
  throw new Error("Missing EXPO_PUBLIC_API_BASE_URL");
}
