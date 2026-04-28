# Medi Check Frontend

Medi Check Frontend 是一個使用 Expo + React Native + Expo Router 開發的行動端前端專案，主要提供病人、藥品、提醒排程、服藥紀錄與照護邀請管理功能。

## Tech Stack

- Expo
- React Native
- Expo Router
- TypeScript
- Zustand

## 環境需求

- Node.js 18 以上
- npm
- Expo CLI 所需開發環境
- 可連線的後端 API

## 環境變數

請在專案根目錄建立 `.env`，至少包含：

```env
EXPO_PUBLIC_API_URL=http://localhost:8000
```

目前專案中的 API client 會直接讀取 `EXPO_PUBLIC_API_URL`：

- API base URL 設定在 libs/api/client.ts

## 安裝與啟動

1. 安裝套件

```bash
npm install
```

2. 啟動開發伺服器

```bash
npm run start
```

3. 依需求開啟對應平台

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
```

## 專案結構

```text
app/           Expo Router 頁面與路由
components/    UI 元件與業務元件
constants/     常數與文案對照表
hooks/         自訂 hooks
libs/          API 呼叫與外部整合
schemas/       表單 / request schema
stores/        Zustand 狀態管理
types/         型別定義
utils/         工具函式與資料轉換
```

## 路由概覽

### 公開頁面

- `sign-in`
- `sign-up`
- `forgot-password`
- `reset-password`

### 主要頁面

- `首頁`
- `服藥紀錄`
- `藥品一覽`
- `我的`

### Modal / 操作頁

- Medication 建立 / 編輯 / 檢視
- Schedule 建立 / 編輯 / 檢視
- History 檢視 / 編輯
- 個人資料與照護管理相關頁面

## 使用說明

### 1. 登入與註冊

- 使用者可透過註冊頁建立帳號
- 登入後會進入受保護頁面
- 前端會透過 access token 呼叫後端 API

### 2. 首頁

- 首頁會顯示當日或近期提醒事件
- 可用來快速確認接下來要服用的藥品與時段

### 3. 藥品管理

- 進入 `藥品一覽` 可查看藥品列表
- 支援搜尋、劑型篩選、排序與分頁
- 列表項目會顯示藥品名稱與對應病人

#### 新增藥品

新增藥品採 step flow：

1. 選擇病人
2. 填寫藥品資料

病人選擇頁支援：

- 搜尋病人
- 分頁切換
- 卡片式選擇

#### 編輯藥品

- 編輯模式與新增模式相同，會先確認病人，再編輯藥品資訊

### 4. 提醒排程管理

新增提醒採 step flow：

1. 選擇病人
2. 選擇藥品
3. 設定提醒內容

目前流程支援：

- 病人搜尋與分頁
- 藥品搜尋
- 劑量、頻率、結束條件設定

### 5. 服藥紀錄

- 可查看歷史紀錄
- 可編輯特定紀錄內容
- 可搭配病人、日期等條件檢視

### 6. 邀請與照護關係管理

在 `我的` 相關頁面中可進行：

- 發送邀請
- 查看收到的邀請
- 查看已發出的邀請
- 接受邀請
- 拒絕邀請
- 撤銷邀請

邀請卡片會顯示：

- 邀請對象或邀請者
- 邀請用途
- 權限
- 邀請日期
- 狀態

### 7. 病人切換與照護情境

系統支援病人本人與照護者兩種情境：

- 病人本人可管理自己的資料
- 照護者可切換不同病人查看相關藥品、提醒與紀錄

## 開發說明

### API 規格來源

- 後端 API 規格以 [後端專案](https://github.com/y0000ga/medi-check-backend) 為準
- 若後端欄位或 query 參數有更新，請同步調整：
  - `types/api/*`
  - `libs/api/*`
  - 對應的 store / 頁面

### 狀態管理

- 使用 Zustand 管理使用者、viewer、medication 等前端狀態

### 路由方式

- 使用 Expo Router 的 file-based routing
- `app/(public)` 放登入註冊相關頁面
- `app/(protected)` 放登入後頁面
