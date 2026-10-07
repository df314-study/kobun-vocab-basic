# 古文単語 Master v19

v18 からの変更点
- 重要度（基礎／標準／発展）を入試での出題されやすさを基準に再分類。意味ごとに重要度を設定（例：あやし①不思議＝基礎、②身分が低い＝標準）。
  一覧・出題モード・問題画面は「意味（問題）」単位の重要度で動作。内訳は levels_v19.csv / vocab_v19.csv。
  ※一般的な出題傾向の知識に基づく目安で、単語別の出題統計そのものではありません。
- scrape_weblio.py を改良：Weblio と登録意味の数が食い違う語を examples_v19_check.csv に出力
- 学習履歴・設定は v18 からそのまま引き継ぎ

例文データ（全語）の作り方
1. scrape_weblio.py と vocab_v19.csv を同じフォルダに置き、お手元のPCで `python3 scrape_weblio.py`
2. 出力された examples_v19.csv を［設定］→［例文データ(CSV)を取り込む］で読み込む
3. examples_v19_check.csv に出た語は、意味の番号の対応を確認
