# Diario di bordo PeerReplit

## 17 giugno 2025

### Modifica logo header
- **Obiettivo:** Sostituire il logo e la scritta in testa alla pagina dell'app con nuove immagini.
- **Azione:** Caricate due immagini in `client/src/assets`.
- **Modifica:** Aggiornato il componente `Layout.tsx` per mostrare il nuovo logo (immagine) al posto del vecchio logo grafico. La scritta "Peer" è rimasta come testo.

### Problema push su GitHub
- **Errore:**
  ```
  error: RPC failed; HTTP 400 curl 22 The requested URL returned error: 400
  send-pack: unexpected disconnect while reading sideband packet
  fatal: the remote end hung up unexpectedly
  ```
- **Ipotesi:** File troppo grande nel repository.
- **Verifica:**
  - Controllata la dimensione di `client/src/assets/PEER_PITTO.png` (32KB, quindi non causa problemi).
  - Analizzata la dimensione delle cartelle e dei file: nessun file pesante fuori da `node_modules`.
  - Nessun file >5MB fuori da `node_modules`.
- **Conclusione:** Probabile errore temporaneo di GitHub o problema lato provider.
- **Prossimi passi:** Attendere e riprovare il push più tardi.

---

_Questo file viene aggiornato man mano che si presentano nuovi problemi o si effettuano nuove modifiche._ 