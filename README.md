# Sito di Chiara Iermano

Sito statico (solo HTML/CSS/JS, nessun framework) per Chiara Iermano — Fashion & Event Producer.
Pensato per partire subito su GitHub Pages e poter passare in seguito a un dominio personalizzato.

## Struttura

```
chiara-iermano-site/
├── index.html        ← pagina unica con tutte le sezioni
├── css/style.css      ← tutto lo stile
├── js/main.js          ← piccole interazioni (menu mobile, animazioni, form)
├── images/favicon.svg  ← favicon segnaposto
├── .nojekyll            ← disabilita l'elaborazione Jekyll di GitHub Pages
└── README.md
```

Tutti i contenuti segnati come **[segnaposto]** nel codice vanno sostituiti con i
testi/foto definitivi di Chiara (bio, foto, portfolio reale, email di contatto).

## 1. Pubblicare su GitHub (repo tuo, Prometeo41)

Da terminale, nella cartella estratta dallo zip:

```bash
cd chiara-iermano-site
git init
git add .
git commit -m "Primo commit: sito Chiara Iermano"
```

Poi crea un nuovo repository vuoto su GitHub (es. `chiara-iermano-site`) dal tuo account
**Prometeo41** — senza README/licenza, per non avere conflitti — e collega il remote:

```bash
git branch -M main
git remote add origin https://github.com/Prometeo41/chiara-iermano-site.git
git push -u origin main
```

## 2. Attivare GitHub Pages

1. Vai su GitHub → repository → **Settings → Pages**.
2. In "Source" scegli **Deploy from a branch**, branch `main`, cartella `/ (root)`.
3. Salva: dopo un minuto il sito sarà online su
   `https://prometeo41.github.io/chiara-iermano-site/`.

## 3. Passare a un dominio personalizzato (in futuro)

Quando avrete un dominio (es. `chiaraiermano.com`):

1. Nel pannello DNS del dominio, crea un record **CNAME** che punta a
   `prometeo41.github.io` (per un sottodominio come `www`), oppure segui la guida
   GitHub per gli **A record** su un dominio "apex" (senza `www`).
2. In GitHub → Settings → Pages → "Custom domain", inserisci il dominio e salva:
   GitHub crea automaticamente un file `CNAME` nel repo.
3. Attendi la propagazione DNS e attiva "Enforce HTTPS" quando disponibile.

## 4. Continuare a gestirlo con Claude

Il sito è volutamente semplice (HTML/CSS/JS puri, senza build): basta aprire questa
cartella (o il repository clonato) in una prossima sessione e chiedere le modifiche
desiderate — testi, nuove sezioni, foto reali, form funzionante, ecc.
Cose utili da specificare quando riprenderete il lavoro:

- Bio definitiva e foto reali di Chiara (per sostituire i placeholder in `index.html`).
- Email di contatto reale (oggi è `info@chiaraiermano.com`, segnaposto).
- Se collegare il form di contatto a un servizio come Formspree, o a un indirizzo email.
- Il dominio scelto, quando sarà acquistato.

## Nota sul form di contatto

Il form nella sezione "Contatti" è **statico**: non invia ancora nulla, perché un sito
su GitHub Pages non ha un server. Le opzioni più semplici per renderlo funzionante:
- Un servizio gratuito come [Formspree](https://formspree.io) (bastano poche righe).
- Un semplice `mailto:` (già presente come alternativa, sempre disponibile).
