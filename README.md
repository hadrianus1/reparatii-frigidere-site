# Reparații frigidere București — Adrian Opriș PFA

Site-ul de prezentare [www.frigidere-reparatii.ro](https://www.frigidere-reparatii.ro): reparații frigidere, combine frigorifice și congelatoare la domiciliu, în București și împrejurimi. Site bilingv (RO/EN), cu blog, hartă interactivă a zonelor deservite și pagini dedicate pentru fiecare marcă și zonă.

## Stack tehnic

Este un site **React pentru web**, nu React Native. Tot codul e **JavaScript** (JSX), nu TypeScript.

| Parte | Tehnologie |
|---|---|
| Frontend | **React 18** + **Create React App** (`react-scripts` 5), iconițe `react-icons`, CSS scris de mână, fonturi găzduite local (`public/fonts/`) |
| Rutare | Fără `react-router`: History API nativ (`pushState` / `popstate`) pentru `/blog/:slug` și `/reparatii-frigidere-:slug` |
| Backend | **Node.js 24** + **Express 4** (`server.js`), cu `helmet`, `cors`, `express-rate-limit` |
| Autentificare admin | **JWT** (`jsonwebtoken`), o singură parolă (`ADMIN_PASSWORD`) |
| Bază de date | **PostgreSQL** (`pg`) când e setat `DATABASE_URL`. Altfel, o bază de date în memorie care se golește la fiecare repornire (implicit în dezvoltare) |
| Imagini încărcate | Salvate în baza de date (tabelul `images`), servite din `/api/images/:id` |
| Traduceri blog | **DeepL** (RO→EN automat la salvarea unui articol, dacă e setat `DEEPL_API_KEY`) |
| Găzduire | **Vercel** (`vercel.json`, funcție serverless) și **Render** (`render.yaml`) |

Toată interfața e într-un singur fișier, [src/App.jsx](src/App.jsx). Lista de mărci, zone și pagini vechi (slug-uri, titluri, descrieri) este în [src/seo-data.json](src/seo-data.json) și e folosită atât de frontend, cât și de server.

## Pornire locală

```bash
npm install
cp .env.example .env      # apoi completează valorile
npm run dev               # doar frontend-ul, pe portul 3003
```

`npm run dev` ajunge pentru orice modificare de text, aspect sau stil. Blogul apare gol fără API. Pentru date reale din API, pornește și serverul în paralel: `PORT=3001 npm run server`.

Ca să testezi tot site-ul împreună (frontend + API, pe portul 3003):

```bash
npm run build
NODE_ENV=production node server.js
```

### Variabile de mediu (`.env`)

| Variabilă | Rol |
|---|---|
| `DATABASE_URL` | Conexiunea PostgreSQL. Lipsă sau lăsată ca în exemplu → bază de date în memorie |
| `ADMIN_PASSWORD` | Parola pentru editorul de blog |
| `JWT_SECRET` | Secretul pentru tokenurile de admin (minim 32 de caractere) |
| `DEEPL_API_KEY` | Opțional: traducerea automată RO→EN a articolelor |
| `INDEXNOW_KEY` | Opțional: anunță imediat Bing/Yandex când publici sau modifici un articol |
| `PORT` | Portul (implicit 3003) |

## SEO

- **URL-uri reale** pentru fiecare articol, marcă (`/reparatii-frigidere-samsung`), zonă (`/reparatii-frigidere-militari`) și pentru adresele vechi de pe site-ul Drupal (`/reparatii-frigidere-preturi`, `/contact` etc.), ca linkurile din articolele plătite să funcționeze în continuare.
- **Tag-uri în HTML de la server**: `server.js` scrie `<title>`, descrierea, canonical-ul și tag-urile Open Graph direct în HTML-ul trimis, pentru crawlerele care nu rulează JavaScript.
- **Date structurate (JSON-LD)**: `LocalBusiness` pe toate paginile, plus `Service` pe paginile de marcă/zonă, `BlogPosting` pe articole și `BreadcrumbList` pe toate subpaginile.
- **Sitemap dinamic** la `/sitemap.xml`, cu `lastmod` (data build-ului pentru pagini, data ultimei modificări pentru articole). E declarat în `robots.txt`.
- **404 reale**: adresele care nu există primesc status 404 și `noindex` (nu mai sunt copii ale paginii principale). Adresele cu `/` la final se redirecționează 301 spre varianta fără `/`.
- **IndexNow**: cu `INDEXNOW_KEY` setat, serverul anunță Bing/Yandex la fiecare publicare sau modificare de articol. `npm run indexnow` trimite dintr-o dată toate adresele din sitemap-ul live.

### După un deploy cu multe schimbări

1. **Google**: în [Search Console](https://search.google.com/search-console) → *Sitemaps*, retrimite `https://www.frigidere-reparatii.ro/sitemap.xml`. Pentru paginile importante, folosește *Inspectare URL* → *Solicită indexarea*. Google nu mai acceptă „ping” automat pentru sitemap.
2. **Bing / Yandex**: `npm run indexnow` (cu același `INDEXNOW_KEY` în `.env` local și pe server). Opțional, adaugă sitemap-ul și în [Bing Webmaster Tools](https://www.bing.com/webmasters).
3. Verifică datele structurate cu [Rich Results Test](https://search.google.com/test/rich-results).
