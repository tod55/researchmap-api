# scraping_researchmap

researchmap で公開されている研究者情報から業績リストを取得するスクリプトです．

researchmap.V2 WebAPI については，[仕様書](https://researchmap.jp/public/organ/WebAPI)を参照してください．

以下で  {permalink} とはリンク識別子を指します．
参照したい研究者の researchmap の URL が https://researchmap.jp/700xxx/ の場合，{permalink} = 700xxx

## Usage



## APIリクエスト

### 業績リスト
```
GET https://api.researchmap.jp/{permalink}/{achievement_type}
```
業績種別が論文の場合，`{achievement_type}=published_papers` になります．
GET リクエストのパラメータとして，次のものが指定できる．
| パラメータ名 | 意味 | 説明 |
| ---- | ---- | ---- |
| sort | ソート順 | default：新しい順 ※ 出版年月、受賞年月等、業績毎で利用する項目が変わる．研究キーワード，研究分野は更新日時の降順になる．modified：更新日の昇順 ※昇順を降順にする場合，先頭に「-」をつける．例：更新日の降順「&sort=-modified」|
| modified | 更新日時 |指定された更新日時以降のデータを出力する．2016 or 2016-08 or 2016-08-18 or 2016-08-18-090000 等で指定．以下のように指定することもできる．"-n week"：n 週間以内．"-n month"：n ヶ月以内．|
|from_date | 出力期間(From) | 出力期間(From)-(To)を指定できる（"2016" or "2016-08-18" 等で指定）．※業績種別ごとに対応する項目が異なり，論文，MISC，書籍等出版物の場合は出版年月(日)が対応．|
|to_date | 出力期間(To) | （同上）|
|start | 取得する業績リストの開始番号 | default=1 |
|limit | ページあたりの業績件数 | default=100．最大: 1000|


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

### 業績情報
```
GET https://api.researchmap.jp/{permalink}/{achievement_type}/{achievement_id}
```
個別の業績についての情報を取得します．{achievement_id} は，例えば
```
GET https://api.researchmap.jp/{permalink}/published_papers
```
でリクエストしたときに得られる下記の情報の中の `xxxxxxxx` の部分です．
```
{....
 "items": [
    {
    "@id": "https://api.researchmap.jp/{permalink}/published_papers/xxxxxxxx",
    "@type": "published_papers",
    "@reverse": "https://api.researchmap.jp/{permalink}/published_papers",
    "rm:id": "xxxxxxxx",
```

### プロフィール情報
```
GET https://api.researchmap.jp/{permalink}/profile
```
単一の研究者のプロフィール情報を返します。


