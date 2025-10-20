# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Pocket Pantryは、ゲストファーストアプローチによる食材管理React Nativeアプリです。ユーザーは**登録なしで即座に利用開始**でき、必要に応じて段階的に認証・家族共有機能にアップグレードできます。

### 開発フェーズ

**Phase 1 (MVP - 現在注力中)**: ゲストモード（AsyncStorageローカル管理）

- 食材登録（手動入力）・食材管理・買い物リスト・賞味期限通知

**Phase 2 (次期)**: 認証・家族共有

- Supabase Auth・ゲストデータ移行・リアルタイム同期・OCR/バーコード機能

**Phase 3 (将来)**: 高度機能

- 食材写真・AI献立提案・分析機能

詳細は[docs/00\_要件定義.md](docs/00_要件定義.md)を参照。

## Technology Stack

- **Framework**: React Native 0.81.4 with Expo SDK 54.0.10
- **Language**: TypeScript 5.9.2 (strict mode enabled)
- **Routing**: Expo Router 6.x (file-based routing)
- **UI Components**: React Native Paper 5.14.5 (Material Design)
- **Styling**: NativeWind 4.2.1 (Tailwind CSS for React Native)
- **Icons**: Lucide React Native 0.546.0
- **Backend**: Supabase 2.53.0 (Phase 2以降で利用)
- **Local Storage**: @react-native-async-storage/async-storage 2.2.0
- **Package Manager**: pnpm
- **State Management**: React Context (将来実装予定)
- **Development**: ESLint 9 + Prettier 3 + TypeScript compiler

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

### 現在の状態 (2025-10-16時点)

プロジェクトは**クリーンスレート状態**です。2025年10月上旬に大規模なリセットが実行され、以下が削除されました:

- 認証フロー（AuthContext、login/registerスクリーン）
- コンポーネントライブラリ（Button、Input等）
- サービス層（Supabase client、LocalStorage manager）
- 型定義（database.ts等）

現在実装されているのは:

- [app/\_layout.tsx](app/_layout.tsx): 最小限のExpo Router Stack設定のみ
- [app/(\_tabs)/](<app/(_tabs)/>): 空のディレクトリ（タブナビゲーション予定地）
- [src/](src/): 空のディレクトリ（実装待ち）

### 計画されているディレクトリ構造

**Phase 1 (ゲストモード)**:

```
app/
  ├── (_tabs)/                    # タブナビゲーション
  │   ├── _layout.tsx            # タブレイアウト
  │   ├── inventory/             # 食材管理画面
  │   ├── shopping/              # 買い物リスト画面
  │   └── settings/              # 設定画面
  └── _layout.tsx                # ルートレイアウト

src/
  ├── components/
  │   ├── ui/                    # 汎用UIコンポーネント
  │   │   ├── Button.tsx
  │   │   ├── Input.tsx
  │   │   └── Card.tsx
  │   └── forms/                 # フォーム専用コンポーネント
  │       └── ItemForm.tsx
  ├── services/
  │   └── localStorage/          # AsyncStorage管理
  │       ├── manager.ts         # 6MB制限対応
  │       ├── items.ts
  │       └── shopping.ts
  ├── hooks/
  │   ├── useLocalStorage.ts
  │   └── useNotifications.ts
  └── types/
      └── item.ts                # 食材型定義
```

**Phase 2追加予定**:

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

### データ層設計

**Phase 1: ローカルファースト**

- **AsyncStorage**によるデバイス内永続化
- Android 6MB制限に配慮した設計
- データ構造: items, shopping_lists, settings
- バックアップなし（Phase 2でクラウド移行）

**Phase 2: ハイブリッド同期**

- **Supabase Database**へのゲストデータ自動移行
- Realtime購読によるfamily_id単位の同期
- RLSポリシーによるセキュリティ確保
- テーブル設計は[docs/02\_テーブル定義書.md](docs/02_テーブル定義書.md)参照

**環境変数** (Phase 2で必要):

- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`

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

**環境変数**:

- Expo環境変数は`EXPO_PUBLIC_`プレフィックス必須
- Phase 2でSupabase設定が必要: `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`

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
