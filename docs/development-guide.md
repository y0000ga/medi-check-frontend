# 開發與維護指南

本文件整理專案的開發習慣、維護原則與擴充建議。

## 開發前檢查

- 確認本機已安裝 Node.js 18 以上與 npm。
- 確認 `.env` 已建立且 `EXPO_PUBLIC_API_URL` 可正確連線到後端。
- 確認專案可正常啟動，再進行功能調整。
- 若需要對接後端新欄位，先確認 API 規格是否已更新。

## 新增功能的建議流程

1. 先確認功能歸屬的 domain 與畫面入口。
2. 建立或更新對應的 feature module。
3. 補齊 API、mapper、型別與表單資料結構。
4. 再串接頁面與元件。
5. 最後確認列表、詳情、編輯與空狀態是否一致。

## 新增頁面的注意事項

- 先確認是否應放在 `app/(public)` 或 `app/(protected)`。
- 頁面應盡量只負責組裝 UI 與觸發流程，不要塞入過多資料轉換邏輯。
- 若頁面需要共用表單或選擇器，優先放到 `components/` 或對應 feature 的元件中。

## 新增 feature module 的注意事項

- 新的 domain 邏輯應優先集中在 `features/`。
- 同一個 feature 內盡量維持 API、mapper、types、validators 與 machine 的一致性。
- 若功能會被多頁面共用，應優先抽成 feature module，而不是複製邏輯到各頁。

## 狀態管理原則

- 目前專案使用 Redux / Redux Toolkit 管理前端狀態。
- 適合放入 store 的內容應是跨頁共用或需要集中管理的狀態。
- 單一頁面內部狀態，若不需要跨頁共享，應盡量留在頁面或 local state。
- 不要把 server data、UI state 與 domain state 混在同一層而沒有邊界。

## 共用元件與樣式維護原則

- 共用元件應保持通用性，不要直接綁死特定頁面情境。
- 樣式共用設定應集中在 `shared/`、`styles/` 或既有設計系統位置。
- 若某元件只服務單一 feature，優先放在該 feature 對應的目錄下。

## lint / type check / 測試建議

- 目前已知可用的檢查指令是 `npm run lint`。
- 格式整理可使用 `npm run format`，格式檢查可使用 `npm run format:check`。
- 若專案尚未建立獨立 type check 或測試流程，建議後續補上。
- 新增或修改較多邏輯後，建議至少先執行 lint 與手動驗證主要流程。

## 寫作原則

- 不應該直接把 API response shape 寫死在 UI component 內。
- 不應該讓頁面直接處理過多資料轉換邏輯。
- 需要轉換時，優先放在 mapper、hook、feature 層或共用工具中。
- 頁面應優先專注在資料顯示、事件觸發與流程切換。
