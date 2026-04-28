# API 對接指南

本文件整理前端與後端 API 對接時的規則與維護方式。

## API base URL 來源

- API base URL 由環境變數 `EXPO_PUBLIC_API_URL` 提供。
- 專案根目錄的 `.env` 應至少定義此變數。
- API client 應統一讀取這個 base URL，避免在各處散寫網址。

## 環境變數使用方式

- 開發環境請在 `.env` 中設定對應 API 位址。
- 若有不同環境，請依實際需求切換變數值，不要直接改寫 UI 或頁面中的網址。
- 所有與 API 網址相關的設定，應集中管理。

## request / response 的資料轉換原則

- UI 不應直接依賴後端 response 的原始 shape。
- request 與 response 的資料轉換，建議集中在 mapper、feature API 或共用轉換層。
- 表單資料、顯示資料與後端 DTO 應分開看待。

## server DTO 與 frontend domain model 的邊界

- server DTO 用來描述後端傳輸格式。
- frontend domain model 用來描述前端實際使用的資料結構。
- 兩者不要混用，也不要在 UI component 內直接假設 server DTO 就是最終顯示資料。

## mapper 的維護規則

- 若後端欄位命名或型別改動，先檢查 mapper 是否需要同步調整。
- mapper 應維持單一責任，只負責資料對應與轉換。
- 若同一份資料會被多個頁面共用，優先讓 mapper 成為唯一轉換入口。

## token 與登入狀態處理原則

- 登入後的 API 呼叫應帶上目前有效的登入狀態或 token。
- token 與使用者登入狀態應集中處理，不要讓每個頁面各自實作。
- 若登入狀態失效，應由共用機制處理重新導向或錯誤回應。

## 後端欄位或 query 參數異動時，前端需要同步檢查的範圍

- `features/*` 內的 API 定義與 mapper
- 相關的 store 與狀態來源
- 對應頁面與元件的欄位顯示
- 表單驗證與提交資料結構
- 搜尋、分頁、排序與篩選條件

## 錯誤處理與 loading 狀態建議

- 每個主要資料請求都應有清楚的 loading 狀態。
- 錯誤顯示應盡量讓使用者知道是讀取失敗、驗證失敗或操作失敗。
- 同一頁面若同時有多個請求，建議分開管理 loading 與 error，避免整頁互相干擾。
- 若尚未建立統一錯誤處理機制，建議後續補上共用流程。
