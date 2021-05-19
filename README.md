# researchmap-api

Web ページに researchmap で公開されている研究者情報から作成した業績リストを自動で追加する javascript です．
Web ページが表示される時点の最新の情報が取得されるので，手動で html ファイルを更新する手間がありません．

以下で  permalink とは研究者個別の識別子を指します．
（例）参照したい研究者の researchmap の URL が `https://researchmap.jp/7000xxx/` の場合，`permalink = 7000xxx`


ブラウザの URL 欄に `https://api.researchmap.jp/{permalink}` を張り付けると researchmap で公開されているその研究者のすべての情報が json 形式で確認できます．


## Usage
業績リストを載せたい HTML ファイルに id を指定した `<ul>` 要素を書き込んでおく．  
```html
<ul id = 'publist'> <!-- list generated here -->  </ul>
```
javascript の関数 publist または publistMulti を呼ぶ．
リポジトリの `index.html` ファイルと `researchmap-api.js` ファイルを同じディレクトリに置いて，
`index.html` の中の下記の `{permalink}` の部分を参照したい研究者の識別子に書き換えます．
```html
<script>
 publist({permalink}, ulid='publist', limit=200)
</script>
```

## Parameters
```js
publist(permalink, ulid, limit, from_date, to_date)
/**
* @param permalink {string} - 研究者の識別子
* @param ulid {string} - リストが書き込まれる <ul> タグの id
* @param limit {int} - 取得する最大件数
* @param from_date {string} - 指定期間の開始年月日（年）
* @param to_date {string} - 指定期間の終了年月日（年）
*/
```

## Example
* 単一の研究者の研究論文リストを最大 20 件取得する（リストの順番は researchmap のデフォルト：新しい順）．
```html
<script> publist(permalink, ulid='publist', limit=20) </script>
```
* 単一の研究者の 1980 年から最新までの研究論文リストを最大 1000 件取得する（仕様上 limit <= 1000）．
```html
<script> publist(permalink, ulid='publist', limit=1000, from_date='1980', to_date='') </script>
```
* 単一の研究者の2010年から2012年までの研究論文リストを取得する．
```html
<script> publist(permalink, ulid='publist', limit=100, from_date='2010', to_date='2012') </script>
```

#### 複数の研究者の論文をまとめたリスト
publistMulti 関数は，研究室メンバーの業績をまとめたリストを作ることを想定して permalink の配列を引数にとり，doi をキーとして重複を省いた業績リストを作ります．
* 複数の研究者（permalinks = ['aaa', 'bbb', 'ccc']）の研究論文リストを取得する（1人の研究者のレコードは最大 limit 件）．
```html
<script> publistMulti(['aaa', 'bbb', 'ccc'], ulid='publistMulti') </script>
```
publist と同様にパラメータ limit='', from_date='', to_date='' も指定可能です．

#### 結果の表示形式
id を指定した `<ul>` 要素に下記の形式のリストが追加される
<ul id='publist'>
 <li>
  <strong>Paper title1 </strong><i>, Journal name1 (year1) </i><a href="https://doi.org/doi1">doi1</a>
 </li>
  <li>
  <strong>Paper title2 </strong><i>, Journal name2 (year2) </i><a href="https://doi.org/doi2">doi2</a>
 </li>
</ul>

Chrome や Microsoft Edge などの Chromium ベースブラウザでは， Windows の場合 F12 キー（Macの場合 Command + Option + "I"）を押すことで，
開発者ツールの Network タブを使って HTML リクエストやレスポンスを簡単に調査できます 🔎．

## 取得する業績の種類
この関数では researchmap に登録された業績の中で「業績種別」（achievement_type）が 「論文」（published_papers）であって，doi および英語タイトルが登録されている，かつ「掲載種別」（published_paper_type）が 「研究論文（学術雑誌）」（scientific_journal）であるものをリストとして表示します． 研究論文でも掲載種別の項目が登録されていない場合や別の種別：「研究論文（国際会
議プロシーディングス）」などは表示されませんので，区別なく表示したい場合は javascript ソースコードの中を見て (item["published_paper_type"] == 'scientific_journal') という条件を消してください．

- - -

## researchmap WebAPI（参考）
researchmap.V2 WebAPI については，[仕様書](https://researchmap.jp/public/organ/WebAPI)を参照してください．

### 業績種別
```
https://api.researchmap.jp/{permalink}/{achievement_type}
```
業績種別が論文の場合，`{achievement_type}=published_papers` になります．

その他の業績種別については，仕様書の「業績リスト取得」の項（p.58）と末尾の注v（p.173）を参照してください．
|{achievement_type}| 説明 |
| ---- | ---- |
|research_interests | 研究キーワード|
|research_areas | 研究分野 |
|research_experience | 経歴|
|education |学歴|
|committee_memberships| 委員歴|
|awards |受賞|
|published_papers |論文|
|misc |MISC|
|books_etc |書籍等出版物|
|presentations |講演・口頭発表等|
|teaching_experience |担当経験のある科目(授業)|
|association_memberships |所属学協会|
|works |Works（作品等）|
|research_projects|共同研究・競争的資金等の研究課題|
|industrial_property_rights |産業財産権|
|social_contribution| 社会貢献活動|
|media_coverage |メディア報道|
|academic_contribution| 学術貢献活動|
|others |その他|

### GET リクエストパラメータ
GET リクエストのパラメータとして，次のものが指定できます．
このスクリプトでは，この中の limit, from_date, to_date を関数の引数として指定できるようにしています．
URL の末尾にクエリ文字として追加されます．
```
https://api.researchmap.jp/{permalink}/{achievement_type}?limit=100&from_date=2016&format=json&start=1
```
実際にどのような URL でリクエストされたかは，取得した json データの `"@id"` の値として確認できます．

| パラメータ名 | 意味 | 説明 |
| ---- | ---- | ---- |
| sort | ソート順 | default：新しい順 ※ 出版年月、受賞年月等、業績毎で利用する項目が変わる．研究キーワード，研究分野は更新日時の降順になる．modified：更新日の昇順 ※昇順を降順にする場合，先頭に「-」をつける．例：更新日の降順「&sort=-modified」|
| modified | 更新日時 |指定された更新日時以降のデータを出力する．2016 or 2016-08 or 2016-08-18 or 2016-08-18-090000 等で指定．以下のように指定することもできる．"-n week"：n 週間以内．"-n month"：n ヶ月以内．|
|from_date | 出力期間(From) | 出力期間(From)-(To)を指定できる（"2016" or "2016-08-18" 等で指定）．※業績種別ごとに対応する項目が異なり，論文，MISC，書籍等出版物の場合は出版年月(日)が対応．|
|to_date | 出力期間(To) | （同上）|
|start | 取得する業績リストの開始番号 | default=1 |
|limit | ページあたりの業績件数 | default=100．最大: 1000|

<!--
### 業績情報
```
https://api.researchmap.jp/{permalink}/{achievement_type}/{achievement_id}
```
個別の業績についての情報を取得します．{achievement_id} は，例えば
```
https://api.researchmap.jp/{permalink}/published_papers
```
で GET リクエストしたときに得られる下記の情報の中の `"rm:id": xxxxxxxx` の部分です．
```json
{
 "items": [
    {
    "@id": "https://api.researchmap.jp/{permalink}/published_papers/xxxxxxxx",
    "@type": "published_papers",
    "@reverse": "https://api.researchmap.jp/{permalink}/published_papers",
    "rm:id": "xxxxxxxx",
    "..." : ""
    }]
}
```
-->
