-- =====================================================
-- 欠けているRLSポリシーを追加
-- familiesとprofilesテーブルのINSERTポリシー
-- =====================================================

-- Profiles: ユーザーが自分のプロフィールを作成できる
CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Families: 認証済みユーザーが新しいファミリーを作成できる
CREATE POLICY "Authenticated users can create families"
  ON families FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Families: ユーザーが自分のファミリーを更新できる
CREATE POLICY "Users can update their family"
  ON families FOR UPDATE
  USING (id IN (
    SELECT family_id FROM profiles WHERE id = auth.uid()
  ))
  WITH CHECK (id IN (
    SELECT family_id FROM profiles WHERE id = auth.uid()
  ));
