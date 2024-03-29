## 簡單版及複雜版的差異

無論是依照字母長度排序或是依照使用頻率排序，`複雜版`的資料結構都可以符合這兩種情境，但`複雜版`也有一些維護上的問題，這邊整理一個表格分別描述兩者的差異

<table class="table">
    <thead>
        <tr>
            <th>比較項目</th>
            <th>簡單版</th>
            <th>複雜版</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>寫入</td>
            <td>寫入時的 value 除了每個關鍵字的 n-gram 之外，還要多加一個完整關鍵字加上分隔符號</td>
            <td>寫入時的 Redis key 會加上每個關鍵字的 n-gram，而 value 則是寫入完整的關鍵字</td>
        </tr>
        <tr>
            <td>讀取</td>
            <td>
                先使用
                <code>ZRANK</code>
                定位，再使用
                <code>ZRANGE</code>
                取得所需要的筆數，最後再用 regex 過濾不必要的 value，可以使用 lua 開發
            </td>
            <td>
                直接使用
                <code>ZRANGE</code>
                取得所需要的 value，不用另外使用 regex 過濾
            </td>
        </tr>
        <tr>
            <td>刪除</td>
            <td>
                可以直接使用
                <code>DEL</code>
                刪除所有資料
            </td>
            <td>
                必須使用
                <code>SCAN</code>
                將資料一批一批的刪除
            </td>
        </tr>
        <tr>
            <td>
                資料大小 (key prefix 用
                <code>autocomplete_index</code>
                ，及
                <code>東京鐵塔</code>
                、
                <code>東京巨蛋球場</code>
                為例)
            </td>
            <td>68 bytes</td>
            <td>242 bytes</td>
        </tr>
    </tbody>
</table>

### 總結

1. 為了節省空間：可以使用`簡單版`的方式開發，但在後端需要花比較多的程式碼做前處理 (pre-processing) 及後處理 (post-processing)
2. 使用頻率做排序：一定要用`複雜版`的方式開發，因為如果用`簡單版`開發的話，zset 會無法直接排序
3. `簡單版`無法保證取得結果的筆數，因為 `ZRANGE` 會包括其他不必要的內容，所以最後過濾完可能會沒有資料
4. 如果需要維護資料，必須要有至少一倍額外的儲存空間，在維護時先用不同的 key prefix 寫入，最後再用 `RENAME` 改 key prefix
    * 如果使用`複雜版`的話，在 `RENAME` 的過程中會花比較多時間
