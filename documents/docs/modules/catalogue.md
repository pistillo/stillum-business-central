---
id: modules-catalogue
title: Catalogo
sidebar_label: Catalogo
---

Il **Catalogo** è l’elemento chiave per la navigazione e la ricerca degli artefatti.

## Requisiti

- Dividere il catalogo per tipo di artefatto (Processi, Regole, Form, Request, Moduli UI, Componenti UI).
- Consentire filtri per area/modulo, stato, tag, proprietario, ambiente, data di creazione e tenant.
- Ricerca full-text su titolo, descrizione, metadati e contenuti (dove possibile).
- Pagine di dettaglio per ogni artefatto con anteprima del modello, versione corrente e cronologia.
- Funzione di clonazione/duplicazione di artefatti per creare rapidamente nuove varianti.

### Distinzione tra tipi di artefatti UI

- **Form (FORM):** interfacce StillumForms basate su JSON Schema. L'editor è dichiarativo e non richiede codice React.
- **Moduli UI (MODULE):** moduli complessi composti da pools, droplets e triggers definiti tramite codice React effettivo. Nel catalogo sono raggruppati con i propri componenti figli.
- **Componenti UI (COMPONENT):** singoli elementi UI (pool, droplet o trigger) con codice React. Ogni componente è collegato a un modulo padre tramite dipendenza; nel catalogo appare sia come elemento autonomo sia nella vista aggregata del modulo.

## Organizzazione

- Supporto per cartelle o “Soluzioni” per raggruppare artefatti correlati.
- Tagging e tassonomia personalizzabile per classificare i contenuti.
- Possibilità di esportare un set di artefatti come pacchetto.
- Vista aggregata per Moduli UI che mostra il modulo padre con l'elenco dei componenti collegati.