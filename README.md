# scraping_researchmap

researchmap で公開されている研究者情報から業績リストを取得するスクリプトです．

researchmap.V2 WebAPI については，[仕様書](https://researchmap.jp/public/organ/WebAPI)を参照してください．

以下で  {permalink} とはリンク識別子を指します．
参照したい研究者の researchmap の URL が https://researchmap.jp/700xxx/ の場合，{permalink} = 700xxx

## Usage



## APIリクエスト

### 業績リスト
仕様書 「業績リスト取得」の項目を参照してください．
```
GET https://api.researchmap.jp/{permalink}/{achievement_type}
```
業績種別が論文の場合，`{achievement_type}=published_article` になります．

その他の業績種別については，仕様書の「業績リスト取得」の項と末尾の注v（）を参照してください．

### プロフィール情報
```
GET https://api.researchmap.jp/{permalink}/profile
```
単一の研究者のプロフィール情報を返します。


