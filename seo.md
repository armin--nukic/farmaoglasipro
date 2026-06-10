# FARMA OGLASI PRO - SEO plan i implementacija

## Sta je vec dodano

U `apps/frontend/index.html` dodano je:

- meta description
- meta keywords
- canonical URL
- hreflang za bosanski i engleski
- Open Graph title/description/url/image
- Twitter card
- JSON-LD `WebSite`
- JSON-LD `Organization`

U `apps/frontend/public` postoje:

- `robots.txt`
- `sitemap.xml`
- `manifest.webmanifest`
- `og-image.svg`

## Glavne SEO stranice

Prioritetne landing stranice:

```text
/listings
/equipment
/farms
/veterinarians
/stations
/auctions
/appointments
```

Kasnije treba dodati dinamicne SEO URL-ove:

```text
/oglasi/goveda
/oglasi/krave
/oglasi/bikovi
/oglasi/ovce
/oglasi/traktori
/farme/sarajevo
/veterinari/tuzla
/veterinarske-stanice/banja-luka
```

## SEO friendly listing URL

Backend vec ima `slug` u tabeli `listings`.

Primjer:

```text
/listings/simental-junica-travnik-1781000000000
```

Za produkciju preporuka:

```text
/oglas/simental-junica-travnik
/oglas/imt-539-bijeljina
/farma/eko-farma-travnik
/veterinar/dr-amina-hadzic
```

## Structured data

Za svaki oglas treba generisati JSON-LD:

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Simental junica",
  "description": "Opis oglasa",
  "offers": {
    "@type": "Offer",
    "price": "3200",
    "priceCurrency": "BAM",
    "availability": "https://schema.org/InStock"
  }
}
```

Za veterinarske stanice:

```json
{
  "@context": "https://schema.org",
  "@type": "VeterinaryCare",
  "name": "Vet Centar Sarajevo",
  "address": "Sarajevo",
  "telephone": "+387..."
}
```

## Lokalni SEO za BiH

Ključne fraze:

- farma oglasi
- stoka prodaja BiH
- krave prodaja
- bikovi prodaja
- telad prodaja
- ovce prodaja
- koze prodaja
- traktori prodaja BiH
- veterinar Sarajevo
- veterinarska stanica Tuzla
- farme na prodaju
- poljoprivredno zemljiste BiH

Gradovi:

```text
Sarajevo, Banja Luka, Tuzla, Mostar, Zenica, Bihac, Brcko, Travnik, Bijeljina, Livno
```

## Tehnicki SEO checklist

- Svaka stranica ima jedinstven title.
- Svaki listing ima canonical URL.
- Sitemap se generise iz baze.
- Robots dozvoljava indexing javnih stranica.
- Admin, login i privatne stranice ne treba gurati u sitemap.
- Slike imaju alt tekst.
- Open Graph image postoji.
- Stranica radi brzo na mobile.
- PWA manifest postoji.

## Sta jos dodati kasnije

1. Server-side rendering ili prerender za javne SEO stranice.
2. Dinamicki sitemap iz backend-a.
3. Blog/knowledge base:

```text
/vodič/kako-kupiti-kravu
/vodič/vakcinacija-goveda
/vodič/kako-prodati-traktor
```

4. Marketplace price index landing:

```text
/cijene/goveda
/cijene/traktori
```

5. FAQ schema za popularne stranice.

## SEO fazoni

- Napraviti stranice po kombinaciji kategorija + grad:

```text
Krave Sarajevo
Telad Travnik
Traktori Bijeljina
Veterinari Tuzla
Farme Mostar
```

- Dodati "najtrazenije rase":

```text
Simental, Busha, Holstein, Romanovska, Alpina
```

- Dodati "market report" jednom sedmicno:

```text
Prosjecna cijena teladi u BiH ove sedmice
Najtrazeniji traktori u Semberiji
```

