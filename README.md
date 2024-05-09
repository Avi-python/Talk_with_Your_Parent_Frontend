# frontend

## 基本建置

### 1. Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```


1. npm install
2. 下載 axios、vuex
3. 建立 store、utils
    
### 2. 設定 navigation guard
- 要使用 isNavigating，不然我沒有辦法解決無限 Navigate 的問題，router.afterEach 將 isNavigating 設定為 false

### 3. login / logout

### Error
1. `vite' is not recognized as an internal or external command`
    這個是因為權限的問題，所以要執行 `Set-ExecutionPolicy Unrestricted -Scope Process` 才可以成功執行，但是因為 Scope 限制在 Process 的關係，下一次打開 power shell 的時候還是要執行一次，雖然實際上我測，下一次打開 powershell 不用執行這個，但要記得可能會跑掉，也許是底層還是同個 process 的關係。

## 串接 openai 

### stream
1. 沒辦法使用 axios，我改使用 fetch 就可以有動態的輸出!
2. 會導致另一個問題就是沒有辦法使用 useAxios 的 intercepter，所以就多寫了一個 fetch 方法的 intercepter

## 串接 VITS-fast-finetune
- 使用 mark 來向後端 api 要求第幾筆語音資料
1. 做了一個 Queue，使用 `waitForDequeue` 來等待資料進入
2. Queue 裡面每個資料都是一個 Promise 等待某段文字對應的語音資料傳送過來
3. 因為 Promise 是在文字傳送到後馬上建立的，而由於文字是按照順序接收，所以 Queue 的順序也不會亂掉。
4. 透過 Blob 處理語音資料，並建立 url，播放 (這邊的原理我不清楚)
5. 使用 Promise 讓我可以等待語音撥放完之後再進行下一個 job。
- 我是用 audio_file === null 來判斷 loading 結束

### 遇到的 error
1. postman 可以接收到語音資料並播放，但我的網頁不行，後來 axios.get 裡面一定要家`responseType: 'arraybuffer'` 就可以了。

## STT
- 使用 Web Speech API : SpeechRecognition
- [參考資料](https://ithelp.ithome.com.tw/m/articles/10329418)

## Late Fetch
- 要記得使用 onMounted，在 onMounted 裡面做 fetch，並在前後調整 isLoaded
- 搭配使用 v-if。

## Spinner
- `npm install vue-spinner`
- 在要使用的 .vue file 裡面 import 指定 spinner => `import BounceLoader from 'vue-spinner/src/BounceLoader.vue'`
- 最後使用 tag <bounce-loader ...> </bounce-loader> 引入

## conversation reset
如果在對話的過程中遇到
1. maximum conversation tokens
2. axios.get 文字出錯時
就會出現 reset 按鈕，並且網頁沒有辦法對話，所以是強制使用者重新載入頁面並清除 memory。