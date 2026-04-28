# 專案結構說明

本文件說明各資料夾的責任邊界、適合放置的檔案類型，以及避免跨層依賴的方式。

## `app/`

- Expo Router 的頁面與路由入口。
- 適合放頁面、layout、route group 與 route 對應檔案。
- 不建議把大量商業邏輯直接寫在這裡。

## `components/`

- 可重用的 UI 元件與業務元件。
- 適合放多頁面會共用的卡片、表單欄位、選擇器、顯示元件。
- 若元件只屬於單一 feature，也可以優先放在 feature 相關區域。

## `constants/`

- 常數、共用文案、固定選項與輕量設定。
- 適合放不依賴 API 與頁面狀態的靜態資料。

## `features/`

- 各功能模組的核心區域。
- 適合放 API、types、mapper、validators、state machine、options 與 domain 邏輯。
- 如果某個功能有清楚的業務邊界，應優先放在這裡。

## `hooks/`

- 自訂 hooks。
- 適合放封裝過的重複邏輯、狀態處理或 UI 行為。
- 若 hook 明顯屬於某個 feature，也可考慮放回該 feature 內。

## `shared/`

- 共用基礎建設與跨功能資源。
- 適合放 store、theme、通用工具、共用設定與其他基礎能力。
- 這裡的內容通常應盡量穩定，不要塞進高度業務化的邏輯。

## `styles/`

- 樣式相關配置與視覺資源整理。
- 適合放設計系統延伸、共用樣式或與樣式有關的集中設定。

## `utils/`

- 通用工具函式與資料轉換工具。
- 適合放與單一 feature 無強綁定的純函式。

## 各資料夾的責任邊界

- `app/` 管頁面與路由。
- `components/` 管可重用介面。
- `features/` 管 domain 與資料流程。
- `shared/` 管共用底層與全域資源。
- `constants/` 管固定值。
- `hooks/` 管封裝邏輯。
- `styles/` 管樣式集中管理。
- `utils/` 管純工具。

## 什麼類型的檔案應該放在哪裡

- 頁面檔案放 `app/`
- 多處共用元件放 `components/`
- 功能 API 與資料模型放 `features/`
- 全域 store 與 theme 放 `shared/`
- 固定選項或文案放 `constants/`
- 複用邏輯放 `hooks/`
- 純函式工具放 `utils/`

## 避免跨層依賴的建議

- 頁面盡量只依賴 feature 與 shared，不要直接內嵌大量資料轉換。
- `components/` 不要反向依賴特定頁面的實作細節。
- `features/` 內的轉換與規則應盡量自行封裝，不要散落到多個頁面。
- `shared/` 的內容應避免被業務邏輯污染。
- 若某段邏輯開始被多個地方複製，應考慮提升到更適合的層級。
