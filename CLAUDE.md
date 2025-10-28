# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Pocket Pantryは、ゲストファーストアプローチによる食材管理React Nativeアプリです。ユーザーは**登録なしで即座に利用開始**でき、必要に応じて段階的に認証・家族共有機能にアップグレードできます。

### 開発フェーズ

**Phase 1 (MVP - 現在注力中)**: ゲストモード（AsyncStorageローカル管理）

- 食材登録（手動入力）・食材管理・買い物リスト・賞味期限通知

**Phase 2**: 認証・家族共有

- Supabase Auth・ゲストデータ移行・リアルタイム同期・クラウドバックアップ

**Phase 3**: プレローンチ準備

- ストア審査対応・ベータテスト・マネタイズ基盤実装

**Phase 4**: 正式ローンチ

- iOS/Android同時公開・初期ユーザー獲得・KPI測定

**Phase 5**: 拡張機能

- OCR/バーコード・食材写真・AI献立提案・分析機能

詳細は[docs/00\_要件定義.md](docs/00_要件定義.md)を参照。

## Technology Stack

### Core

- **Framework**: React Native 0.81.4
- **React**: 19.1.0
- **Expo SDK**: 54.0.10
- **Language**: TypeScript 5.9.2 (strict mode enabled)
- **Package Manager**: pnpm

### Routing & Navigation

- **Expo Router**: 6.0.8 (file-based routing)

### UI & Styling

- **UI Components**: React Native Paper 5.14.5 (Material Design)
- **Styling**: NativeWind 4.2.1 (Tailwind CSS for React Native)
- **Icons**: Lucide React Native 0.546.0

### Forms & Input

- **Date Picker**: @react-native-community/datetimepicker 8.5.0
- **Dropdown**: react-native-element-dropdown 2.12.4

### Data & Storage

- **Local Storage**: @react-native-async-storage/async-storage 2.2.0 (Phase 1)
- **Backend**: Supabase 2.53.0 (Phase 2以降)
- **Notifications**: expo-notifications 0.32.12

### Development Tools

- **Linter**: ESLint 9.32.0
- **Formatter**: Prettier 3.6.2
- **Type Checker**: TypeScript 5.9.2

## Essential Commands

```bash
# Development server
pnpm start                  # Start Expo development server
pnpm android               # Start with Android simulator/device
pnpm ios                   # Start with iOS simulator/device
pnpm web                   # Start web version

# Code quality
pnpm lint                  # Run ESLint
pnpm lint:fix             # Run ESLint with auto-fix
pnpm format               # Format code with Prettier
pnpm format:check         # Check formatting without changes
pnpm type-check           # Run TypeScript compiler (no emit)
```

**IMPORTANT**: After completing any implementation, automatically run the following commands in this order:

1. `pnpm lint` - Run ESLint check
2. `pnpm format:check` - Check code formatting
3. `pnpm type-check` - Run TypeScript compiler

If any errors are found:

- Run `pnpm format` to auto-fix formatting issues
- Fix any remaining lint or type errors
- Re-run all three commands to verify

Only report implementation as complete after all checks pass successfully.

**Auto-approved commands** (no user confirmation required):

- `pnpm lint`
- `pnpm lint:fix`
- `pnpm format`
- `pnpm format:check`
- `pnpm type-check`

## Code Architecture

### 現在の状態 (2025-10-28時点)

Phase 1（ゲストモード）の基本実装が完了しています。以下の機能が実装済み:

#### 実装済み機能

- **タブナビゲーション**: 食材管理・買い物リスト・設定
- **食材管理**: 登録・編集・削除・カテゴリ別表示
- **買い物リスト**: アイテム追加・チェック機能
- **通知設定**: 賞味期限通知のON/OFF
- **ローカルストレージ**: AsyncStorageによるデータ永続化

#### 実装済みコンポーネント

- UI基本コンポーネント（Button、Input、Picker、FormField）
- フォーム（IngredientForm）
- リストアイテム（IngredientListItem、ShoppingListItem）

### 現在のディレクトリ構造

**Phase 1 実装済み**:

```
app/
  ├── (tabs)/                     # タブナビゲーション
  │   ├── _layout.tsx            # タブレイアウト
  │   ├── inventory/             # 食材管理画面
  │   │   ├── index.tsx
  │   │   └── _components/
  │   │       └── IngredientListItem.tsx
  │   ├── shopping_list/         # 買い物リスト画面
  │   │   ├── index.tsx
  │   │   └── _components/
  │   │       └── ShoppingListItem.tsx
  │   ├── settings/              # 設定画面
  │   │   └── index.tsx
  │   └── plus.tsx               # 食材追加ボタン
  ├── (modals)/                  # モーダル画面
  │   ├── add_ingredient.tsx
  │   ├── edit_ingredient.tsx
  │   └── settings.tsx
  ├── _layout.tsx                # ルートレイアウト
  └── index.tsx                  # エントリーポイント

src/
  ├── components/
  │   ├── ui/                    # 汎用UIコンポーネント
  │   │   ├── Button.tsx
  │   │   ├── Input.tsx
  │   │   ├── Picker.tsx
  │   │   └── FormField.tsx
  │   └── forms/                 # フォーム専用コンポーネント
  │       └── IngredientForm.tsx
  ├── services/
  │   ├── localStorage/          # AsyncStorage管理
  │   │   ├── ingredients.ts
  │   │   ├── shoppingList.ts
  │   │   └── notificationSettings.ts
  │   └── notifications/
  │       └── scheduler.ts
  ├── hooks/
  │   ├── useIngredients.ts
  │   ├── useShoppingList.ts
  │   └── useNotifications.ts
  ├── types/
  │   ├── ingredient.ts
  │   ├── shopping.ts
  │   └── ui/
  │       ├── button.ts
  │       ├── input.ts
  │       ├── form.ts
  │       ├── picker.ts
  │       └── index.ts
  ├── constants/
  │   ├── colors.ts
  │   ├── ingredient.ts
  │   ├── ui.ts
  │   └── index.ts
  ├── theme/
  │   └── paper.ts               # React Native Paperテーマ
  └── data/
      └── mockIngredients.ts     # 開発用モックデータ
```

**Phase 2以降追加予定**:

```
src/
  ├── contexts/
  │   └── AuthContext.tsx        # Supabase認証
  ├── services/
  │   ├── supabase/
  │   │   └── client.ts
  │   └── migration/             # ゲストデータ移行
  └── types/
      └── database.ts            # Supabase型定義
```

**Phase 5追加予定**:

```
src/
  ├── services/
  │   ├── ocr/                   # Google Cloud Vision API
  │   ├── barcode/               # JANコードAPI
  │   └── ai/                    # OpenAI GPT-4o API
  └── components/
      └── camera/                # 写真撮影・OCR UI
```

### データ層設計

**Phase 1: ローカルファースト**

- **AsyncStorage**によるデバイス内永続化
- Android 6MB制限に配慮した設計
- データ構造: items, shopping_lists, settings
- バックアップなし（Phase 2でクラウド移行）

**Phase 2以降: ハイブリッド同期**

- **Supabase Database**へのゲストデータ自動移行
- Realtime購読によるfamily_id単位の同期
- RLSポリシーによるセキュリティ確保
- テーブル設計は[docs/02\_テーブル定義書.md](docs/02_テーブル定義書.md)参照

**環境変数** (Phase 2以降で必要):

- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`

**Phase 5: 外部API統合**

- Google Cloud Vision API（OCR）
- JANコードAPI（バーコード）
- OpenAI GPT-4o API（AI献立提案）

## Development Guidelines

### Phase 1 (MVP) 開発原則

**ゲストファースト設計**:

- 初回起動時に登録画面を表示しない
- すべての機能をAsyncStorageベースで実装
- Phase 2への移行を考慮した型設計（family_id等の将来追加を想定）

**データ永続化**:

- AsyncStorageの6MB制限（Android）を意識
- JSON.stringify/parseでシリアライズ
- エラーハンドリングは必須（ストレージフル対策）
- キー命名: `@PocketPantry:items`, `@PocketPantry:shopping_lists`

**通知機能**:

- expo-notificationsによるローカル通知
- 賞味期限当日の朝8時にプッシュ
- ユーザー設定でON/OFF切替可能

### コーディング規約

**ファイル命名**:

- Reactコンポーネント: PascalCase（`Button.tsx`）
- Hooks: `use`プレフィックス（`useLocalStorage.ts`）
- Services: camelCase（`itemService.ts`）
- 型定義: PascalCase interface/type（`src/types/item.ts`）

**TypeScript**:

- strict mode必須（tsconfig.jsonで有効化済み）
- すべてのコンポーネントpropsに型定義
- `any`型の使用禁止（unknown使用を検討）
- エクスポートする型はすべて明示的に定義

**スタイリング**:

- **UIコンポーネント**: React Native Paperを優先使用
- **レイアウト・余白調整**: NativeWind（Tailwind CSS）を使用
- 既存のカスタムコンポーネント（Button, Input, Card等）は段階的にPaperコンポーネントに置き換え
- Paperのテーマカスタマイズは将来実装予定（現在はデフォルトテーマ使用）
- インラインスタイルは避ける

**コンポーネント設計**:

- 新規作成前に`src/components/ui/`の既存コンポーネント確認
- `ui/`: 汎用コンポーネント（Button, Input, Card等）
- `forms/`: フォーム専用コンポーネント（ItemForm等）
- Propsインターフェースは必須（例: `ButtonProps`）
- **【重要】1コンポーネント1returnの原則**: 各コンポーネントは1つのreturnステートメントのみを持つこと
  - 条件分岐で複数のreturnが必要な場合は、コンポーネントを分離する
  - 例: 編集モード/表示モードがある場合 → 別コンポーネントに分離し、親コンポーネントで三項演算子で切り替え
  - 参考実装: [ShoppingListItem.tsx](<app/(tabs)/shopping_list/_components/ShoppingListItem.tsx>)

**環境変数**:

- Expo環境変数は`EXPO_PUBLIC_`プレフィックス必須
- Phase 2以降でSupabase設定が必要: `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- Phase 5で外部API設定が必要: `EXPO_PUBLIC_GOOGLE_VISION_API_KEY`, `EXPO_PUBLIC_JANCODE_API_KEY`, `EXPO_PUBLIC_OPENAI_API_KEY`

### TypeScript Path Aliases

tsconfig.jsonで以下のエイリアス設定済み:

```typescript
import { Button } from '@/components/ui/Button';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import type { Item } from '@/types/item';
```

利用可能なエイリアス: `@/components/*`, `@/screens/*`, `@/hooks/*`, `@/utils/*`, `@/constants/*`, `@/types/*`, `@/assets/*`

## 重要なドキュメント

実装前に必ず確認:

- [docs/00\_要件定義.md](docs/00_要件定義.md): ゲストファーストアプローチの全体像
- [docs/01_API仕様書.md](docs/01_API仕様書.md): REST API定義（Phase 2以降）
- [docs/02\_テーブル定義書.md](docs/02_テーブル定義書.md): データベーススキーマ（Phase 2以降）
- [docs/20\_画面遷移図.md](docs/20_画面遷移図.md): 画面フロー
- [docs/30\_食材登録フロー図.md](docs/30_食材登録フロー図.md): 食材登録UX

## 既知の制約事項

- **AsyncStorage容量**: Android 6MB、iOS無制限（実質的には適度に制限）
- **Expo New Architecture**: 有効化済み（app.jsonで設定）
- **Phase 1スコープ**: 認証なし、Supabase未使用、ローカル通知のみ
- **Phase 2移行**: ゲストデータをSupabaseに自動移行する機能が必要
- **Phase 5外部API**: 無料枠・従量課金制のため、利用制限とコスト管理が必要
  - Google Cloud Vision: 月1000リクエストまで無料
  - OpenAI GPT-4o: 従量課金制
