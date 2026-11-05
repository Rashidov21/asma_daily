# ASMA DAILY — Test Results

**Sana:** 2026-11-05 (Asia/Tashkent)  
**Muhit:** Node `v22.23.4`, npm `10.9.9`  
**Repo:** `asma_daily` (local) + deploy `https://asma-daily-wallpaper.netlify.app`

## Umumiy xulosa

| # | Tekshiruv | Natija |
|---|-----------|--------|
| 1 | Vitest (unit + wallpaper PNG) | ✅ PASS — 17/17 |
| 2 | TypeScript (`tsc --noEmit`) | ✅ PASS |
| 3 | ESLint (`src`, `__tests__`, `scripts`) | ✅ PASS |
| 4 | Production build (`next build`) | ✅ PASS — 108 sahifa |
| 5 | Lokal prod server API (`localhost:3010`) | ✅ PASS |
| 6 | Shaxsiy `start=` sikli (lokal) | ✅ PASS — day0=ism1, day2=ism3 |
| 7 | Deploy wallpaper PNG / sahifalar | ✅ PASS (PNG + pages) |
| 8 | Deploy `start=` shaxsiy sikl | ❌ FAIL — hali eski deploy |
| 9 | Noto‘g‘ri host `asma-daily.netlify.app` | ⚠️ kutilgan FAIL (HTML) |

**Asosiy xulosa:** Kod bazasi lokalda to‘liq ishlaydi (test, typecheck, lint, build, API, `start=`). Deploy qilingan Netlify hali `start` parametrini e’tiborsiz qoldiradi — **yangilab deploy qilish kerak**. Shortcut uchun to‘g‘ri host: `asma-daily-wallpaper.netlify.app` (`asma-daily.netlify.app` emas).

---

## 1. Vitest

```
✓ __tests__/islamic-holidays.test.ts (4)
✓ __tests__/daily-name.test.ts (11)   ← global + personal start
✓ __tests__/wallpaper.test.ts (2)     ← dark + light 1179×2556 PNG

Test Files  3 passed
Tests       17 passed
```

Raw: `test-results/vitest.txt`

---

## 2. TypeScript

`npx tsc --noEmit` → exit `0` (xato yo‘q).

---

## 3. ESLint

`npx eslint src __tests__ scripts --max-warnings 0` → exit `0`.

---

## 4. Production build

`npm run build` muvaffaqiyatli.

| Route | Tur |
|-------|-----|
| `/` | dynamic |
| `/api/daily`, `/api/wallpaper`, `/api/names`, `/api/names/[id]`, `/api/shortcut` | dynamic |
| `/setup`, `/wallpaper` | dynamic |
| `/names/[slug]` | SSG (99) |
| `/about`, `/names` | static |

Raw: `test-results/build.txt`

---

## 5. Lokal production server (`http://127.0.0.1:3010`)

| Endpoint | HTTP | Natija |
|----------|------|--------|
| `GET /api/daily` | 200 | global: id **80** (2026-11-05) |
| `GET /api/daily?start=2026-11-05&date=2026-11-05` | 200 | id **1**, progress 1 |
| `GET /api/daily?start=2026-11-05&date=2026-11-07` | 200 | id **3**, progress 3 |
| `GET /api/daily?start=bad` | 400 | `Invalid start…` |
| `GET /api/wallpaper?start=…&date=2026-11-05` | 200 | `image/png` 1179×2556 |
| `GET /api/wallpaper?…&theme=light` | 200 | `image/png` 1179×2556 |
| `GET /api/wallpaper?date=not-a-date` | 400 | invalid date |
| `GET /api/wallpaper?start=bad` | 400 | invalid start |
| `GET /api/names` | 200 | JSON, 99 ism |
| `GET /api/names/1` | 200 | Ar-Rahman |
| `GET /`, `/setup`, `/wallpaper`, `/names`, `/about` | 200 | HTML |
| `GET /api/shortcut` | 302 | redirect |

### Shaxsiy start assert (lokal)

```
start day0 id 1 progress 1
start day2 id 3 progress 3
global same date id 80 progress 80
RESULT: PASS
```

Raw: `test-results/local-api.txt`, `test-results/local-start-logic.txt`

---

## 6. Deployed Netlify (`asma-daily-wallpaper.netlify.app`)

### Wallpaper / pages — OK

| URL | HTTP | Content-Type | Izoh |
|-----|------|--------------|------|
| `/api/wallpaper` | 200 | `image/png` | 1179×2556, ~345KB, dark≈96% |
| `/api/wallpaper?date=2026-11-07` | 200 | `image/png` | valid PNG |
| `/api/wallpaper?theme=light&date=2026-11-07` | 200 | `image/png` | *(deploy eski theme bo‘lishi mumkin)* |
| `/api/wallpaper?date=not-a-date` | 400 | JSON | valid |
| `/api/daily` | 200 | JSON | id 80 |
| `/api/names`, `/api/names/1` | 200 | JSON | OK |
| `/`, `/setup`, `/wallpaper`, `/names`, `/about` | 200 | HTML | OK |

`npm run verify:wallpaper` → wallpaper host **OK**.

### Shaxsiy `start=` — FAIL (deploy eski)

| URL | Kutilgan | Haqiqiy |
|-----|----------|---------|
| `/api/daily?start=2026-11-05&date=2026-11-05` | id **1** | id **80** (global) |
| `/api/daily?start=2026-11-05&date=2026-11-07` | id **3** | id **82** (global) |
| `/api/wallpaper?start=bad` | 400 | 200 PNG (param e’tiborsiz) |

**Sabab:** live saytda hali `start` qo‘llab-quvvatlanmagan build. Lokal kodda PASS.

### Noto‘g‘ri host

| URL | Natija |
|-----|--------|
| `https://asma-daily.netlify.app/api/wallpaper` | 200 `text/html` (Vite SPA) → Quick Look oq ekran |

Raw: `test-results/deployed-api.txt`, `test-results/verify-wallpaper.txt`, `test-results/start-logic.txt`

---

## 7. Shortcut / o‘rnatish oqimi (kod darajasi)

| Band | Holat |
|------|--------|
| `getPersonalWallpaperApiUrl()` → `?start=bugun` | lokal kodda bor |
| Install tugmasi clipboard ga shaxsiy URL | lokal kodda bor |
| `/setup` da `start=` tushuntirish | lokal kodda bor |
| iCloud Shortcut JSON defaultida `?start=` | yangilangan (repoda) |
| Live deployda `start` ishlashi | ❌ redeploy kerak |

---

## Keyingi qadam

1. **Netlify ga push/redeploy** — shundan keyin `start=` live da ham ishlaydi.
2. Shortcut URL:  
   `https://asma-daily-wallpaper.netlify.app/api/wallpaper?start=YYYY-MM-DD`  
   (`asma-daily.netlify.app` ishlatilmasin).
3. Redeploydan keyin tekshirish:

```bash
npm test
npm run verify:wallpaper
curl -s 'https://asma-daily-wallpaper.netlify.app/api/daily?start=2026-11-05&date=2026-11-05' | jq .progress
# kutiladi: {"current":1,"total":99,"percent":1}
```

---

## Xom loglar

| Fayl | Mazmun |
|------|--------|
| `test-results/vitest.txt` | Unit testlar |
| `test-results/tsc.txt` | Typecheck |
| `test-results/eslint.txt` | Lint |
| `test-results/build.txt` | Next build |
| `test-results/local-api.txt` | Lokal API matrix |
| `test-results/local-start-logic.txt` | Lokal start assert |
| `test-results/deployed-api.txt` | Live curl matrix |
| `test-results/verify-wallpaper.txt` | PNG verify script |
| `test-results/start-logic.txt` | Live start assert (FAIL) |
