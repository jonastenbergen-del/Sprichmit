/* ============================================================
   LERNINHALTE: RECHTSCHREIBUNG
   -----------------------------------------------------------
   4 ÜBUNGSTYPEN:
   1. luecken  → "____" im Satz, Auswahl antworten
   2. woerter  → Wort tippen (Erlaubt: array von Varianten)
   3. fehler   → Satz mit EINEM Fehler, klick auf das Wort
   4. gross    → Wort groß oder klein? (2 Knöpfe)
   ============================================================ */

const RECHTSCHREIBUNG = {

  /* ---------- 1. LÜCKEN FÜLLEN ---------- */
  luecken: [
    {
      satz: '____ du, ____, ich morgen früh anreise?',
      luecken: ['Weißt', 'dass'],
      hinweis: '„Weißt du?“ – und das berühmte „dass“ mit zwei s!'
    },
    {
      satz: 'Ich weiß ____, dass du müde bist, deshalb ____ du jetzt schlafen.',
      luecken: ['doch', 'sollst'],
      hinweis: '„Doch" = widersprechen – „sollst" aus „sollen"'
    },
    {
      satz: 'Das ist schön ____, du es gemacht hast! Das ____ ich schon lange nicht mehr gehört.',
      luecken: ['dass', 'habe'],
      hinweis: '„dass" mit zwei s, wenn ein Satz folgt'
    },
    {
      satz: '____ du doch, ____, sie nicht geantwortet hat?',
      luecken: ['Weißt', 'dass'],
      hinweis: '„Weißt du doch?" + „dass" (Konjunktion, zwei s)'
    },
    {
      satz: 'Er ____ keine Zeit, ____, er arbeiten muss.',
      luecken: ['hat', 'weil'],
      hinweis: '„hat" + „weil" (Grund/Angabe)'
    }
  ],

  /* ---------- 2. WÖRTER TIPPEN ---------- */
  woerter: [
    {
      wort: 'Vertrauen',
      hinweis: 'Das Gefühl, dass jemand ehrlich zu dir ist',
      erlaubt: ['vertrauen']
    },
    {
      wort: 'Enttäuschung',
      hinweis: 'Wenn etwas nicht so wird wie erhofft',
      erlaubt: ['enttaeuschung', 'enttäuschung']
    },
    {
      wort: 'Versprechen',
      hinweis: 'Etwas ZUKÜNFTIGES, das man tun wird',
      erlaubt: ['versprechen']
    },
    {
      wort: 'Gefühl',
      hinweis: 'Was man innerlich empfindet',
      erlaubt: ['gefühle', 'gefuell', 'gefühl']
    },
    {
      wort: 'Respekt',
      hinweis: 'Jemanden in seinen Grenzen achten',
      erlaubt: ['respekt']
    },
    {
      wort: 'Verständnis',
      hinweis: 'Jemanden und seine Lage begreifen',
      erlaubt: ['verstaendnis', 'verständnis']
    },
    {
      wort: 'Kommunikation',
      hinweis: 'Austausch zwischen zwei Menschen',
      erlaubt: ['kommunikation']
    },
    {
      wort: 'Zukunftsplanung',
      hinweis: 'Über kommende Jahre nachdenken (2 Wörter ohne Bindestrich auch ok)',
      erlaubt: ['zukunftsplanung', 'zukunfts planung']
    }
  ],

  /* ---------- 3. FEHLER FINDEN ---------- */
  fehler: [
    {
      woerter: ['Ich', 'habe', 'mich', 'erinnert,', 'dass', 'du', 'gestern', 'geburtstag', 'gehabt', 'hast.'],
      falschIndex: 7,
      richtig: 'Geburtstag',
      erklaerung: 'Nomen (Dinge) werden IMMER groß geschrieben: der Geburtstag.'
    },
    {
      woerter: ['Das', 'war', 'ein', 'schöner', 'abend', 'mit', 'dir', 'gestern.', 'Ich', 'freue', 'mich', 'schon', 'auf', 'morgen.'],
      falschIndex: 4,
      richtig: 'Abend',
      erklaerung: '„ein schöner Abend" – Nomen groß, Adjektiv klein.'
    },
    {
      woerter: ['Ich', 'warte', 'auf', 'dich,', 'weil', 'ich', 'dich', 'vermissen', 'möchte.', 'Schnell', 'antworten!'],
      falschIndex: 8,
      richtig: 'möchte',
      erklaerung: 'Modalverben (wollen, können, mögen...) werden klein geschrieben.'
    },
    {
      woerter: ['Es', 'ist', 'wichtig,', 'mit', 'einander', 'zu', 'reden,', 'auch', 'wenn', 'es', 'schwierig', 'ist.'],
      falschIndex: 4,
      richtig: 'miteinander',
      erklaerung: '„miteinander" wird EINES Wort – es ist ein Pronomen mit Präposition.'
    },
    {
      woerter: ['Du', 'bist', 'mein', 'beste', 'freund', 'für', 'immer.'],
      falschIndex: 5,
      richtig: 'Freund',
      erklaerung: '„mein bester Freund" – Nomen groß! (Und „bester" braucht ein r)'
    }
  ],

  /* ---------- 4. GROSS / KLEIN ---------- */
  gross: [
    {
      satz: 'Am ____ Morgen habe ich an dich gedacht.',
      antwort: 'morgen',
      groess: false,
      erklaerung: '„am Morgen" – Zeitangabe, klein. Aber „der Morgen" (Nomen) wäre groß!'
    },
    {
      satz: 'Deutsch ist eine tolle ____ Sprache.',
      antwort: 'Sprache',
      groess: true,
      erklaerung: '„Sprache" ist ein Nomen → groß.'
    },
    {
      satz: 'Ich ____ dich sehr gerne schreiben.',
      antwort: 'liebe',
      groess: false,
      erklaerung: 'Verben werden klein geschrieben (nach Satzanfang).'
    },
    {
      satz: 'Die ____ Türkei ist wunderschön.',
      antwort: 'Türkei',
      groess: true,
      erklaerung: 'Ländernamen sind immer groß.'
    },
    {
      satz: 'Wir treffen uns an diesem ____ Wochenende.',
      antwort: 'Wochenende',
      groess: true,
      erklaerung: '„Wochenende" ist ein Nomen → groß.'
    },
    {
      satz: 'Sie hat ____ recht mit dem, was sie gesagt hat.',
      antwort: 'recht',
      groess: false,
      erklaerung: '„Recht haben" – hier ist „Recht" kein Nomen, sondern Teil der Wendung → klein.'
    }
  ]
};
