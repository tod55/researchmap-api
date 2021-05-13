# scraping_researchmap

researchmap で公開されている研究者情報から業績リストを取得するスクリプトです．

researchmap.V2 WebAPI については，[仕様書](https://researchmap.jp/public/organ/WebAPI)を参照してください．

以下で  {permalink} とはリンク識別子を指します．
参照したい研究者の researchmap の URL が https://researchmap.jp/700xxx/ の場合，{permalink} = 700xxx

## Usage



## APIリクエスト

### 業績リスト
仕様書 「業績リスト取得」の項目（p.58）を参照してください．
```
GET https://api.researchmap.jp/{permalink}/{achievement_type}
```
業績種別が論文の場合，`{achievement_type}=published_papers` になります．
その他の業績種別については，仕様書の「業績リスト取得」の項と末尾の注v（p.173）を参照してください．

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


