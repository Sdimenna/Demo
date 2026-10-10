/* Un link per ogni prospect:  ?s=<chiave>
   kind: "estetica" | "parrucchiere" (colori e stile)
   menu (facoltativo): "barbiere" | "unghie" (listino su misura)
   city può restare vuota. */
window.SALONS = {
  // ---- Primo giro (email 8-9 ottobre) ----
  // Centri estetici
  barbara:  { name: "Salone Barbara",       kind: "estetica",     city: "Caldogno",     owner: "Barbara" },
  arte:     { name: "Estetica Artè",        kind: "estetica",     city: "Caldogno" },
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
  leielui:  { name: "Centro Lei e Lui",      kind: "parrucchiere", city: "Rubano",     owner: "Mirco" },
  soins:    { name: "Soins",                 kind: "parrucchiere", city: "" },

  // ---- Secondo giro (WhatsApp 13-15 ottobre) ----
  // Centri estetici e unghie
  grazia:        { name: "ArteEstetica by Grazia",        kind: "estetica", city: "" },
  renaissance:   { name: "Estetica Renaissance",          kind: "estetica", city: "Bovolenta" },
  starbien:      { name: "Star Bien",                     kind: "estetica", city: "Bovolenta" },
  bottegaunghia: { name: "La Bottega dell'Unghia",        kind: "estetica", menu: "unghie", city: "Costabissara" },
  emysem:        { name: "Emysem Nails",                  kind: "estetica", menu: "unghie", city: "Vigonza" },
  esteticabarbara: { name: "Estetica Barbara",            kind: "estetica", city: "Vicenza" },
  essenza:       { name: "L'Essenza Estetica e Benessere", kind: "estetica", city: "" },
  lnnail:        { name: "L.N Nail",                      kind: "estetica", menu: "unghie", city: "" },
  solarium:      { name: "Centro Estetico Solarium",      kind: "estetica", city: "Pontelongo" },
  crystal:       { name: "Crystal Beauty",                kind: "estetica", city: "Rubano" },
  eternity:      { name: "Eternity Estetica e Benessere", kind: "estetica", city: "Rubano" },

  // Parrucchieri e barbieri
  barberia24:    { name: "Barberia 24",                   kind: "parrucchiere", menu: "barbiere", city: "" },
  sforbiciamo:   { name: "Sforbiciamo",                   kind: "parrucchiere", city: "" },
  artecapello:   { name: "L'Arte del Capello",            kind: "parrucchiere", city: "Bovolenta" },
  retual:        { name: "Retual",                        kind: "parrucchiere", city: "Bovolenta" },
  katia:         { name: "Katia Barberia",                kind: "parrucchiere", menu: "barbiere", city: "Casalserugo" },
  ded:           { name: "D&D Parrucchieri",              kind: "parrucchiere", city: "Maserà di Padova" },
  salonesara:    { name: "Salone Sara",                   kind: "parrucchiere", city: "Treschè Conca" },
  dacciuntaglio: { name: "Dacci un Taglio",               kind: "parrucchiere", menu: "barbiere", city: "" },
  bellicapelli:  { name: "BelliCapelli",                  kind: "parrucchiere", city: "" },
  bottega22:     { name: "Bottega 22",                    kind: "parrucchiere", city: "" },
  fan:           { name: "Fan Parrucchiere",              kind: "parrucchiere", city: "" },
  immagineline:  { name: "Immagine Line",                 kind: "parrucchiere", city: "" },
  cristina:      { name: "Salone Cristina",               kind: "parrucchiere", city: "" },
  angela:        { name: "Angela Hair Stylist",           kind: "parrucchiere", city: "Bertipaglia" },
  anila:         { name: "Anila · La Boutique del Capello", kind: "parrucchiere", city: "Casalserugo" },
  gianni:        { name: "Ambrosini Gianni",              kind: "parrucchiere", city: "Cesuna" },
  max:           { name: "Salone MAX",                    kind: "parrucchiere", menu: "barbiere", city: "Padova" },
  sografi:       { name: "Salone Sografi",                kind: "parrucchiere", city: "Padova" },
  bigodino:      { name: "Bigodino y Bigote",             kind: "parrucchiere", city: "Sandrigo" },
  oldbarbieri:   { name: "The Old Barbieri",              kind: "parrucchiere", menu: "barbiere", city: "Schio" },
  maurizio:      { name: "Salone Maurizio",               kind: "parrucchiere", city: "Vicenza" },

  // Demo generiche (senza nome di un salone reale)
  estetica:     { name: "Il tuo centro estetico", kind: "estetica",     city: "", generic: true },
  parrucchiere: { name: "Il tuo salone",          kind: "parrucchiere", city: "", generic: true },
  barbiere:     { name: "La tua barberia",        kind: "parrucchiere", menu: "barbiere", city: "", generic: true },
  unghie:       { name: "Il tuo centro unghie",   kind: "estetica",     menu: "unghie",   city: "", generic: true }
};
