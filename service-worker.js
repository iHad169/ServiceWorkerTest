importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

// 檢查Workbox
if (workbox) {
  console.log("Yay! Workbox is loaded 🎉");
} else {
  console.log("Boo! Workbox didn't load 😬");
}

// Cache名 設置
workbox.core.setCacheNameDetails({
    prefix: "HKNBP",
    suffix: "v19",
    precache: "pre-cache",
    runtime: "runtime-cache"
});

// 要存進cache storage裡的檔案清單
var cacheFiles = [
  ".",
  "index.html",
  "main.js",
  'manifest.json'
];

// 使用precache功能，在offline下也可以執行
workbox.precaching.precacheAndRoute(cacheFiles, {
  // Ignore all URL parameters.
  ignoreURLParametersMatching: [/.*/]
});

self.addEventListener('activate', function(event) {
    event.waitUntil(
        // 揀選舊版本cache去刪除
        caches.keys().then(cacheNames => {
            console.log("正儲存嘅版本Cache有: " + cacheNames);
            return Promise.all(
                cacheNames.filter(cacheName => {
                    // return true為刪除冇使用緊嘅cache
                    return cacheName !== workbox.core.cacheNames.precache;
                }).map(cacheName => {
                    console.log("刪除" + cacheName + "版本Cache");
                    // 被filter判定為要刪除嘅cache去刪除
                    return caches.delete(cacheName);
                })
            );
        }).then(() => {
            return self.clients.claim();
        })
    );
});
