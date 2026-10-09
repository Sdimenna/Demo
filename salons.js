/* Un link per ogni prospect:  ?s=<chiave>
   kind: "estetica" | "parrucchiere".  city può restare vuota. */
window.SALONS = {
  // Centri estetici
  barbara:  { name: "Salone Barbara",       kind: "estetica",     city: "Caldogno",     owner: "Barbara" },
  arte:     { name: "Estetica Artè",        kind: "estetica",     city: "Caldogno" },
  gemma:    { name: "Estetica La Gemma",    kind: "estetica",     city: "Dueville",     owner: "Moira" },
  cynthia:  { name: "Cynthia Estetica",     kind: "estetica",     city: "Casalserugo",  owner: "Cynthia" },
  susycinzia: { name: "Susy e Cinzia",      kind: "estetica",     city: "Padova" },

  // Parrucchieri
  floriana: { name: "Floriana Parrucchieri", kind: "parrucchiere", city: "Bassano del Grappa", owner: "Floriana" },
  zoe:      { name: "Zoe Acconciature",      kind: "parrucchiere", city: "Padova" },
  niko:     { name: "Salone Niko",           kind: "parrucchiere", city: "Malo",       owner: "Niko" },
  trecento: { name: "Trecentosessantagradi", kind: "parrucchiere", city: "Malo" },
  claudio:  { name: "Salone Claudio",        kind: "parrucchiere", city: "Cassola",    owner: "Claudio" },
  sergio:   { name: "Beauty Fashion Gallery", kind: "parrucchiere", city: "Padova",    owner: "Sergio" },
  errelook: { name: "Errelook",              kind: "parrucchiere", city: "San Pietro in Gu", owner: "Raffaella" },
  leielui:  { name: "Centro Lei e Lui",      kind: "parrucchiere", city: "Vicenza",    owner: "Mirco" },
  soins:    { name: "Soins",                 kind: "parrucchiere", city: "" },

  // Demo generiche (senza nome di un salone reale)
  estetica:     { name: "Il tuo centro estetico", kind: "estetica",     city: "", generic: true },
  parrucchiere: { name: "Il tuo salone",          kind: "parrucchiere", city: "", generic: true }
};
