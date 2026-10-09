# Demo prenotazioni online

Anteprima di un sito con prenotazione online per centri estetici e parrucchieri: sito pubblico, prenotazione in 3 passi e pannello del salone.

Sito statico (HTML, CSS e JavaScript puri), nessun build. Pubblicato con GitHub Pages.

## Link personalizzati

Ogni salone ha il suo link: `?s=<chiave>`, con le chiavi definite in `salons.js`.

- `?s=estetica`: demo generica per centro estetico
- `?s=parrucchiere`: demo generica per parrucchiere
- `?s=barbara`, `?s=niko`, ecc.

Per aggiungere un salone basta una riga in `salons.js`.

## Note

- Le prenotazioni di prova restano solo nel browser di chi le fa (`localStorage`): nessun dato viene inviato.
- Il listino e l'agenda sono di esempio.
- La pagina non viene indicizzata dai motori di ricerca (`noindex` e `robots.txt`).

Provarla in locale:

```bash
python -m http.server 8765
```
