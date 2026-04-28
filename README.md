# Medi Check Frontend

Medi Check Frontend 是一個使用 Expo + React Native + Expo Router 開發的行動端前端專案，提供病人、藥品、提醒排程、服藥紀錄與照護邀請管理功能。

## Tech Stack

- Expo
- React Native
- Expo Router
- TypeScript
- Redux Toolkit
- React Redux
- XState
- Axios
- Day.js

## 環境需求

- Node.js 18 以上
- npm
- Expo 開發環境
- 可連線的後端 API

## 環境變數

請在專案根目錄建立 `.env`，至少包含：

```env
EXPO_PUBLIC_API_URL=http://localhost:8000
```

## 安裝與啟動

```bash
npm install
npm run start
```

依需求開啟對應平台：

```bash
npm run android
npm run ios
npm run web
```

## 常用指令

```bash
npm run start
npm run android
npm run ios
npm run web
npm run lint
npm run format
npm run format:check
npm run reset-project
```

## 文件索引
- [產品使用說明](https://github.com/y0000ga/medi-check-frontend/blob/main/docs/usage-guide.md)
- [開發與維護指南](https://github.com/y0000ga/medi-check-frontend/blob/main/docs/development-guide.md)
- [API 對接指南](https://github.com/y0000ga/medi-check-frontend/blob/main/docs/api-integration-guide.md)
- [專案結構說明](https://github.com/y0000ga/medi-check-frontend/blob/main/docs/project-structure.md)
