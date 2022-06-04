# otocomplete

指使用者在輸入一個字串的部分內容時，就提供下拉式選單自動推薦相關常用字串供使用者選擇以快速輸入的一項功能特性。

## Autocomplete 原理

* Read times >>>>> write times
* 時間複雜度

## 使用場景

### 依照字母排序

#### 寫入資料時

#### 讀取資料時

#### 進階使用

### 依照使用頻率排序

#### 寫入資料時

#### 讀取資料時

#### 進階使用

## UI 的呈現方式

## 相關文章

* http://oldblog.antirez.com/post/autocomplete-with-redis.html
* https://redis.com/ebook/part-2-core-concepts/chapter-6-application-components-in-redis/6-1-autocomplete/6-1-1-autocomplete-for-recent-contacts/
* https://redis.com/ebook/part-2-core-concepts/chapter-6-application-components-in-redis/6-1-autocomplete/6-1-2-address-book-autocomplete/
* https://www.prefixbox.com/blog/autocomplete-search/
* https://zh.wikipedia.org/wiki/%E8%87%AA%E5%8A%A8%E5%AE%8C%E6%88%90

## Autocomplete 與 search suggestion 的差異

## 實作套件

## Elasticsearch

使用 edge-ngram 開發，相關 setting 及 mapping 如下

```json
{
  "settings": {
    "analysis": {
      "tokenizer": {
        "autocomplete_tokenizer": {
          "type": "edge_ngram",
          "min_gram": 1,
          "max_gram": 20
        }
      },
      "analyzer": {
        "autocomplete_analyzer": {
          "tokenizer": "autocomplete_tokenizer"
        }
      }
    }
  }
}
```

```json
{
  "mappings": {
    "properties": {
      "name": {
        "type": "text",
        "analyzer": "autocomplete_analyzer",
        "search_analyzer": "keyword"
      }
    }
  }
}
```

寫入 index 時使用 edge-ngram 做切詞，並設定最小 gram 為 1，最大 gram 為 20，因為理論上使用者不會打超過 20 個字，所以為了減少儲存內容，所以設定最大 gram。

以「東京鐵塔」為例，使用一般中文切詞及 edge-ngram 會切成不同的 token

| 一般中文切詞 | edge-ngram |
| ------- | ---------- |
| <ul><li>東京</li><li>鐵塔</li><li>東京鐵塔</li></ul>| <ul><li>東</li><li>東京</li><li>東京鐵</li><li>東京鐵塔</li></ul> |

以「東京巨蛋球場」為例，使用一般中文切詞及 edge-ngram 會切成不同的 token

| 一般中文切詞 | edge-ngram |
| ------- | ---------- |
| <ul><li>東京</li><li>巨蛋</li><li>球場</li><li>東京巨蛋</li><li>巨蛋球場</li><li>東京巨蛋球場</li></ul>| <ul><li>東</li><li>東京</li><li>東京巨</li><li>東京巨蛋</li><li>東京巨蛋球</li><li>東京巨蛋球場</li></ul> |

在搜尋時使用 keyword analyzer，keyword analyzer 表示不會針對所輸入的關鍵字做切詞，所以搜尋時輸入「東京」的話，會找到「東京鐵塔」及「東京巨蛋球場」，而輸入「東京巨」的話，只會找到「東京巨蛋球場」

## Redis