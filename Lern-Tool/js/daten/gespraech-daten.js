/* ============================================================
   LERNINHALTE: GESPRÄCHE
   -----------------------------------------------------------
   NEUES THEMA HINZUFÜGEN?
   → Einen neuen Eintrag in das THEMEN-Array kopieren
   → Muster kopieren, Texte anpassen, fertig!
   → Details: DOKUMENTATION/03-ANLEITUNG-THEMEN-ERWEITERN.md
   WICHTIG: In Texten NIE normale Anführungszeichen " verwenden,
   immer die deutschen »…« oder „…" (so wie hier)!
   ============================================================ */

const THEMEN = [

  /* ============ NIVEAU 2: GEFÜHLE ============ */

  {
    id: 'n2-gefühle-benennen',
    niveau: 2,
    niveauName: 'Gefühle',
    titel: 'Gefühle benennen',
    beschreibung: 'Wie du sprichst, wenn es emotional wird.',
    inhalt: [
      {
        typ: 'info',
        titel: 'Warum das für euch SO wichtig ist',
        text: 'Ihr habt beide offen über euer größtes Gefühlsthema gesprochen: Dilara hat dir gesagt, dass sie Trauer anders empfindet als andere. Das macht euch besonders – aber es bedeutet auch: Sprecht GEWISSENHAFT über Gefühle, sonst entstehen Missverständnisse.',
        tipps: [
          'Nenne DAS GEFÜHL, nicht die Person: „Das macht mich traurig" statt „Du machst mich traurig"',
          'Frag nach IHREM Gefühl: „Wie fühlst du dich dabei?"',
          'Akzeptiere: Wenn sie „All good" sagt, akzeptiere es – nicht sofort widersprechen'
        ]
      },
      {
        typ: 'ja',
        titel: 'So gerne',
        beispiele: [
          'Ich merke gerade, dass ich etwas enttäuscht bin. Darf ich dir sagen warum?',
          'Wie fühlst du dich gerade? Ich will es verstehen.',
          'Danke, dass du mir das erzählst. Das weiß ich zu schätzen.'
        ]
      },
      {
        typ: 'nein',
        titel: 'Eher nicht so',
        beispiele: [
          '„Dein Blick und deine Nachricht sagen verschiedene Dinge" – das klingt wie eine Anklage',
          '„Du bist doch gar nicht wütend, oder?" – sie darf ihre Gefühle selbst benennen',
          'Über ihr Gefühl diskutieren, wenn sie gerade Abstand braucht'
        ]
      },
      {
        typ: 'tuerkisch',
        saetze: [
          { tur: 'Nasılsın hissediyorsun?', aussprache: 'na-schil-schin his-se-di-jou-ruun', de: 'Wie fühlst du dich?' },
          { tur: 'Üzgünüm.', aussprache: 'ütsgü-nüm', de: 'Es tut mir leid.' },
          { tur: 'Seni anlıyorum.', aussprache: 'se-ni an-li-jou-ruum', de: 'Ich verstehe dich.' }
        ]
      }
    ],
    quiz: [
      {
        frage: 'Du bist gerade enttäuscht. Was sagst du am besten?',
        optionen: [
          'Du machst mich immer traurig!',
          'Ich merke, dass ich gerade enttäuscht bin. Magst du mir zuhören, warum?',
          'Ich hab gerade keine Gefühle, es ist egal.'
        ],
        richtig: 1,
        erklaerung: 'Option 2 nennt das Gefühl (ICH-Botschaft) UND gibt ihr die Wahl zuzuhören. Das ist respektvoll.'
      },
      {
        frage: 'Dilara sagt „All good" – aber du spürst, dass sie nicht wirklich gut drauf ist. Was tust du?',
        optionen: [
          '„Nein, das stimmt nicht! Dein Blick sagt was anderes!"',
          'Sag nichts. Gib ihr Raum – und zeig später, dass du da bist („Ich bin hier, wann immer du reden willst")',
          'Verlasse das Gespräch sofort, weil es unangenehm ist'
        ],
        richtig: 1,
        erklaerung: 'Ihre Grenze akzeptieren (Raum geben) ist wichtiger als ihr sofort die Gefühle abnehmen zu wollen. Präsenz zeigen ohne Druck ist der Mittelweg.'
      }
    ]
  },

  {
    id: 'n2-trost',
    niveau: 2,
    niveauName: 'Gefühle',
    titel: 'Trost spenden',
    beschreibung: 'Wenn sie einen schlechten Tag hat – was wirklich hilft.',
    inhalt: [
      {
        typ: 'info',
        titel: 'Trost ist keine Lösung',
        text: 'Wenn Dilara von einem schlechten Tag erzählt (Streit mit der Familie, Stress bei der Arbeit, Alzheimer ihrer Großmutter...), will sie in 9 von 10 Fällen keine Lösung. Sie will, dass du DA bist.',
        tipps: [
          'Erste Regel: Erst zuhören, dann trösten, LÖSUNGEN erst wenn sie sie explizit fragt',
          'Benenne das, was sie durchmacht: „Das mit deiner Großmutter ist wirklich schwer für dich"',
          'Zeig, dass du dich ERINNERST: „Ich hatte mir gemerkt, dass heute dein Schichttag war – wie ging es dir?"'
        ]
      },
      {
        typ: 'ja',
        titel: 'So gerne',
        beispiele: [
          'Das klingt wirklich anstrengend. Ich bin froh, dass du mir erzählst.',
          'Du musst das nicht alleine tragen. Ich bin da.',
          'Möchtest du, dass wir einfach reden, oder brauchst du gerade Raum?'
        ]
      },
      {
        typ: 'nein',
        titel: 'Eher nicht so',
        beispiele: [
          '„Das ist nicht so schlimm, schau mich an, ich hab auch Probleme..."',
          'Sofort raten: „Du solltest einfach...", „Warum machst du das nicht einfach...?"',
          'Ihr Problem mit einem Witz klein reden, wenn sie traurig ist'
        ]
      },
      {
        typ: 'tuerkisch',
        saetze: [
          { tur: 'Buradayım, her zaman.', aussprache: 'bu-ra-da-jım, her za-man', de: 'Ich bin hier, immer.' },
          { tur: 'Yanındayım.', aussprache: 'ja-nın-da-jım', de: 'Ich bin an deiner Seite.' }
        ]
      }
    ],
    quiz: [
      {
        frage: 'Dilara erzählt: „Heute war alles so stressig, meine Familie hat wieder gestritten." Was antwortest du am besten?',
        optionen: [
          '„Hm, das ist bei euch immer so. Ignorier die einfach."',
          '„Oh weh. Ich hatte heute auch einen doofen Tag, das war... (erzählt 20 Minuten über sich)"',
          '„Das klingt wirklich schwer für dich. Danke, dass du mir erzählst. Ich bin da."'
        ],
        richtig: 2,
        erklaerung: 'Option 3 validiert ihr Gefühl UND versichert Präsenz – genau das braucht man nach einem schweren Tag. Option 2 macht das Gespräch zu einer Selbst-Darstellung.'
      }
    ]
  },


  /* ============ NIVEAU 1: ALLTAG & SMALLTALK ============ */

  {
    id: 'n1-alltag',
    niveau: 1,
    niveauName: 'Alltag & Smalltalk',
    titel: 'Über den Tag reden',
    beschreibung: 'Wie du ein nettes Gespräch über den Alltag startest.',
    inhalt: [
      {
        typ: 'info',
        titel: 'Warum das wichtig ist',
        text: 'Jeden Tag dieselben Nachrichten („Hi", „Wie bist du?") werden langweilig. Wenn du über ihren echten Tag sprichst, fühlt sich Dilara gesehen und interessiert.',
        tipps: [
          'Stell eine KONKRETE Frage, nicht nur „Wie geht’s?"',
          'Erinnere dich an Sachen, die sie dir erzählt hat (z. B. „Wie war dein Deutschkurs?")',
          'Erzähl ihr auch etwas von DEINEM Tag – ein Gespräch ist ein Ping-Pong, kein Verhör'
        ]
      },
      {
        typ: 'ja',
        titel: 'So gerne',
        beispiele: [
          'Wie lief dein Tag heute? Hat irgendwas Tolles oder Ärgerliches vorgefallen?',
          'Ich hab mich heute daran erinnert, dass du letzte Woche mit deiner Tante geredet hast – wie geht es ihr jetzt?',
          'Ich hatte heute so einen verrückten Tag... ich erzähl dir später alles. Erstmal: Wie war dein Tag?'
        ]
      },
      {
        typ: 'nein',
        titel: 'Eher nicht so',
        beispiele: [
          'Mhm. / Jaa. / K. – klingt desinteressiert, obwohl das nicht deine Absicht ist',
          '„Wie geht’s?" und dann nichts mehr dazu – das ist keine richtige Frage',
          '„Ich hab heute nichts interessantes gemacht." – Geschichts-Killer, erzähl Etwas!'
        ]
      },
      {
        typ: 'tuerkisch',
        saetze: [
          { tur: 'Nasılsın?', aussprache: 'na-schil-schin', de: 'Wie geht es dir?' },
          { tur: 'Günün nasıl geçti?', aussprache: 'gü-nün na-schıl dje-tschti', de: 'Wie war dein Tag?' },
          { tur: 'Bugün ne yaptın?', aussprache: 'bugün ne yap-tın', de: 'Was hast du heute gemacht?' }
        ]
      }
    ],
    quiz: [
      {
        frage: 'Dilara erzählt dir, dass sie heute einen wichtigen Termin hatte. Was antwortest du am besten?',
        optionen: [
          'Mhm, ok.',
          'Ach so. Ich hatte heute auch was zu tun.',
          'Erzähl mal – wie lief der Termin? War alles in Ordnung?'
        ],
        richtig: 2,
        erklaerung: 'Die dritte Antwort zeigt echtes Interesse an IHREM Thema. Die anderen würden das Gespräch totmachen.'
      },
      {
        frage: 'Was bedeutet „Nasılsın?" auf Türkisch?',
        optionen: [
          'Gute Nacht',
          'Wie geht es dir?',
          'Ich liebe dich'
        ],
        richtig: 1,
        erklaerung: '„Nasılsın?" = „Wie geht es dir?" – die wichtigste Frage für jeden Tag!'
      }
    ]
  },

  {
    id: 'n1-gutenacht',
    niveau: 1,
    niveauName: 'Alltag & Smalltalk',
    titel: 'Gute-Nacht-Ritual',
    beschreibung: 'Euer „Good night, sweet dreams" – richtig und mit Abwechslung.',
    inhalt: [
      {
        typ: 'info',
        titel: 'Das Ritual, das euch verbindet',
        text: 'Jeden Abend wünscht ihr euch „gute Nacht / süße Träume". Das Ritual macht euch ein Team. Aber: Wenn es JEDEN Tag exakt gleich ist, wird es automatisch. Kleine Abwechslung hält es lebendig.',
        tipps: [
          'Zitiere etwas vom HEUTIGEN Tag: „Schlaf gut – und träum von unserem Trip nach Nevşehir 😘"',
          'Lobe sie am Ende des Tages: „Du bist die Beste, mit der ich heute geredet habe"',
          'Nicht zu spät: Wenn sie müde ist, lieber kurz und süß als eine lange Nachricht'
        ]
      },
      {
        typ: 'ja',
        titel: 'So gerne',
        beispiele: [
          'Gute Nacht mein Schatz – heute hat mir unser Gespräch so gut getan 😘',
          'Süße Träume! Träum von mir, ich träume von dir 😘',
          'Ich muss los. Es war schön, heute mit dir geredet zu haben. Schlaf gut 💙'
        ]
      },
      {
        typ: 'nein',
        titel: 'Eher nicht so',
        beispiele: [
          '„Nacht." – zu kurz, kalt',
          '„Ich gehe jetzt." / „Muss PC ausmachen." – ohne Abschieds-Wärme',
          'Den Namen verwechseln: „gute Nacht Dilara" an die MUTTER schreiben 😅 (Stichwort: Namen!)'
        ]
      },
      {
        typ: 'tuerkisch',
        saetze: [
          { tur: 'İyi geceler, tatlı rüyalar.', aussprache: 'it-schi dje-tse-lar, ta-tli rü-je-lar', de: 'Gute Nacht, süße Träume.' },
          { tur: 'Seni seviyorum.', aussprache: 'se-ni se-wi-jou-ruum', de: 'Ich liebe dich.' }
        ]
      }
    ],
    quiz: [
      {
        frage: 'Was ist das BESTE an eurem Gute-Nacht-Ritual?',
        optionen: [
          'Dass es exakt gleich bleibt, jeden Tag',
          'Dass ihr euch daran erinnert – kleine Abwechslung hält es frisch',
          'Dass du als letzter schreibst'
        ],
        richtig: 1,
        erklaerung: 'Rituale sind toll – aber kleine Abwechslungen („Träum von Nevşehir!") zeigen, dass du präsent bist.'
      },
      {
        frage: 'Was bedeutet „İyi geceler, tatlı rüyalar?"',
        optionen: [
          'Guten Morgen, schönen Tag',
          'Gute Nacht, süße Träume',
          'Bis später, mein Schatz'
        ],
        richtig: 1,
        erklaerung: 'Das ist eure gute Nacht – eines der schönsten Rituale eurer Beziehung!'
      }
    ]
  },

  /* ============ NIVEAU 3: BEZIEHUNG ============ */

  {
    id: 'n3-wertschaetzung',
    niveau: 3,
    niveauName: 'Beziehung',
    titel: 'Wertschätzung zeigen',
    beschreibung: '„I love you" ist schön – aber es gibt noch mehr.',
    inhalt: [
      {
        typ: 'info',
        titel: 'Die 5 Sprachen der Liebe (kurz)',
        text: 'Jeder Mensch wird auf eine andere Weise geliebt: 1) Wertschätzende Worte, 2) Zeit, 3) Geschenke, 4) Hilfe, 5) Berührung. Ihr habt per Chat vor allem 1, 2 und 4. Dilara liebt es, wenn du dir ZEIT nimmst und dich an Details ERINNERST.',
        tipps: [
          'Wertschätzung mit NAME: nicht „du bist toll", sondern „dass du für mich den ganzen Weg nach Nevşehir organisierst, ist unglaublich"',
          'Erinnere dich an Details: Ihre Schicht, ihren Kurs, ihre Familie – das ist die stärkste Wertschätzung überhaupt',
          'Sag, WAS genau du an ihr schätzt: „Mir gefällt, wie stark du deine Mutter unterstützt"'
        ]
      },
      {
        typ: 'ja',
        titel: 'So gerne',
        beispiele: [
          'Ich schätze, wie du für deine Familie da bist – das ist nicht selbstverständlich.',
          'Danke, dass du mir heute beim Türkisch geholfen hast. Das war so sweet.',
          'Mit dir zu reden macht meinen Tag besser. Wirklich.'
        ]
      },
      {
        typ: 'nein',
        titel: 'Eher nicht so',
        beispiele: [
          'Wertschätzung nur in guten Momenten – in schlechten verschwindet sie',
          'Nur „I love you" sagen, aber nie konkret was',
          'Vergleiche: „Meine Ex-Freundin hat auch..." – NEIN. Nie.'
        ]
      },
      {
        typ: 'tuerkisch',
        saetze: [
          { tur: 'Sen benim için çok özelsin.', aussprache: 'se-nin be-nim itchün çok ö-ze-lsein', de: 'Du bist für mich etwas ganz Besonderes.' },
          { tur: 'Seninle gurur duyuyorum.', aussprache: 'se-nin-le gu-ruw du-jou-jou-ruum', de: 'Ich bin stolz auf dich.' }
        ]
      }
    ],
    quiz: [
      {
        frage: 'Dilara erzählt, dass sie ihre Mutter zu einem Arzttermin begleitet hat. Die stärkste Wertschätzung wäre:',
        optionen: [
          '„Cool."',
          '„Schade, dass du so lange gebraucht hast."',
          '„Das für deine Mutter da zu sein ist wirklich stark von dir. Danke, dass du mir davon erzählst."'
        ],
        richtig: 2,
        erklaerung: 'Konkrete Wertschätzung (WAS genau ist stark) + Erinnern zeigt, dass du wirklich zuhörst.'
      }
    ]
  },

  {
    id: 'n3-vertrauen',
    niveau: 3,
    niveauName: 'Beziehung',
    titel: 'Vertrauen & Ehrlichkeit',
    beschreibung: 'Wie ihr euch die Wahrheit sagt, ohne zu verletzen.',
    inhalt: [
      {
        typ: 'info',
        titel: 'Vertrauen ist euer Fundament',
        text: 'Ihr habt beide schwierige Sachen geteilt: deine Gefühlswelt, ihre Familie, der Druck durch den Oheim. Vertrauenskonto: Jeder ehrliche Satz ist eine Einzahlung. Aber: Ehrlichkeit muss SANFT verpackt sein, sonst wird sie zur Verletzung.',
        tipps: [
          'Sag es ehrlich, ABER im richtigen Moment – nie mitten in einem Streit',
          'Fakten + Gefühl, keine Vorwürfe: „Ich habe mir Sorgen gemacht, weil du nicht geantwortet hast" statt „Du antwortest nie!"',
          'Wenn du etwas falsch gemacht hast: kurz, konkret, ohne ein „Aber..." dahinter'
        ]
      },
      {
        typ: 'ja',
        titel: 'So gerne',
        beispiele: [
          'Ich muss dir etwas sagen, und ich hoffe du nimmst es gut an... (und dann: das Gefühl + der Grund)',
          'Ich habe mich geärgert und wollte es nicht so ausdrücken. Sorry.',
          'Mir ist wichtig, dass du weißt: Wenn ich etwas nicht weiß, sage ich es ehrlich.'
        ]
      },
      {
        typ: 'nein',
        titel: 'Eher nicht so',
        beispiele: [
          'Ehrlichkeit als Waffe: „Ich sag dir mal, wie ich das sehe..." (wird meistens böse)',
          'Nach einer Entschuldigung sofort „Aber du hast doch auch..." – macht die Entschuldigung wertlos',
          'Vergessene Versprechen (z. B. zurückrufen, Nachrichten) – kleines Leck im Vertrauenskonto'
        ]
      },
      {
        typ: 'tuerkisch',
        saetze: [
          { tur: 'Sana inanıyorum.', aussprache: 'sa-na i-na-nou-jou-ruum', de: 'Ich glaube dir.' },
          { tur: 'Sana söz veriyorum.', aussprache: 'sa-na söz ve-ri-jou-ruum', de: 'Ich verspreche es dir.' }
        ]
      }
    ],
    quiz: [
      {
        frage: 'Du hast versprochen, um 21:00 anzurufen, und es wurde 22:00. Was ist die BESTE ehrliche Reaktion?',
        optionen: [
          'Nichts sagen und so tun, als wäre nichts',
          '„Sorry, es ist spät geworden – ich musste noch etwas machen." (tatsächlich warst du nur abgelenkt)',
          '„Hey, sorry – ich bin abgelenkt gewesen und die Zeit vergangen. Das sollte nicht passieren. Morgen rufe ich pünktlich an."'
        ],
        richtig: 2,
        erklaerung: 'Kurze ehrliche Entschuldigung + konkrete Zusage. Option 2 (Lügchen) sieht klein aus, frisst aber langfristig Vertrauen auf.'
      }
    ]
  },

  /* ============ NIVEAU 4: KONFLIKTE ============ */

  {
    id: 'n4-missverstaendnis',
    niveau: 4,
    niveauName: 'Konflikte',
    titel: 'Missverständnisse klären',
    beschreibung: 'Wenn Sprache, Übersetzer oder Emotionen dazwischenfunktionieren.',
    inhalt: [
      {
        typ: 'info',
        titel: 'Euer größter Risiko-Punkt: die Sprachbarriere',
        text: 'Ihr schreibt auf Deutsch UND Türkisch, teils mit Übersetzungs-Apps. Das bedeutet: Ein Satz kann anders ankommen, als du es meinst. (Echte Situation vom 09.09.: Du meintest „ich kläre das Thema" – sie hörte „ich dränge dich".) Lösung: WICHTIGE Sachen immer auf EINER Sprache sagen, am besten so, dass sie es selbst versteht.',
        tipps: [
          'Wichtige Gespräche: keine Übersetzungs-App, sondern klare einfache Worte – oder ein ANRUF (Stimme nimmt 50% der Missverständnisse)',
          'Überprüfe: „Meinst du das? Sag es mir nochmal mit deinen Worten" – das ist keine Kontrolle, das ist Achtsamkeit',
          'Kleine Differenzen (1-2 Tage) normalisieren: Es IST passiert, jetzt wird es gelöst – nicht „das hat nie stattgefunden"'
        ]
      },
      {
        typ: 'ja',
        titel: 'So gerne',
        beispiele: [
          'Ich habe das Gefühl, dass wir uns da missverstanden haben. Magst du mir sagen, was du verstanden hast?',
          'Das war nicht meine Absicht. Ich meinte das so: ...',
          'Lass uns das später besprechen, wenn wir beide ruhig sind.'
        ]
      },
      {
        typ: 'nein',
        titel: 'Eher nicht so',
        beispiele: [
          '„Wenn du es nicht ansprichst, spreche ICH es an!" – klingt wie eine Drohung',
          '„Dein Blick und deine Nachricht sagen verschiedene Dinge" – klingt wie eine Anklage',
          '„Ich nutze jetzt einen anderen Übersetzer, um zu verstehen was du meinst" – klingt kalt und misstrauisch'
        ]
      },
      {
        typ: 'tuerkisch',
        saetze: [
          { tur: 'Bir yanlış anlama oldu.', aussprache: 'bir ja-nisch an-la-ma ol-du', de: 'Es gab ein Missverständnis.' },
          { tur: 'Bir daha konuşalım.', aussprache: 'bir da-ha ko-nu-sha-lım', de: 'Lass uns nochmal reden.' }
        ]
      }
    ],
    quiz: [
      {
        frage: 'Dilara antwortet „All good", aber ihr seid euch sicher, dass etwas nicht passt. Was ist der beste NÄCHSTE Schritt?',
        optionen: [
          'Sofort: „Nein, das stimmt nicht, du bist enttäuscht von mir!"',
          'Nichts sagen, Raum geben. Später (nach 1-2 Tagen) freundlich und offen nachfragen, ohne Vorwurf.',
          'Das Thema nie wieder ansprechen und so tun als wäre alles perfekt'
        ],
        richtig: 1,
        erklaerung: 'Ihre Grenze respektieren (Raum geben) + später sanft klären. Option 1 ist konfrontativ, Option 3 lässt Wunden offen.'
      },
      {
        frage: 'Welcher Satz ist am WENIGER konfrontativ?',
        optionen: [
          '„Wenn du es nicht ansprichst, spreche ICH es an."',
          '„Du musst jetzt mit mir darüber reden."',
          '„Wann passt es dir, dass wir das Thema besprechen? Ich bin bereit, wann immer du es bist."'
        ],
        richtig: 2,
        erklaerung: 'Option 3 gibt ihr die Kontrolle über den Zeitpunkt – genau das hilft, wenn jemand gerade noch nicht bereit ist.'
      }
    ]
  },

  {
    id: 'n4-entschuldigung',
    niveau: 4,
    niveauName: 'Konflikte',
    titel: 'Richtig entschuldigen',
    beschreibung: 'Eine Entschuldigung, die wirklich wirkt.',
    inhalt: [
      {
        typ: 'info',
        titel: 'Die 4 Bausteine einer guten Entschuldigung',
        text: '1) Konkret benennen WAS du falsch gemacht hast. 2) Nennen WAS es bei ihr ausgelöst hat. 3) Sagen WAS du anders machen wirst. 4) Ihr die Zeit geben, die sie braucht. Alles andere (Rechtfertigung, „Aber...", „Aber du hast doch...") macht die Entschuldigung wertlos.',
        tipps: [
          'Kein „Sorry WENN du dich verletzt gefühlt hast" – das schiebt die Verantwortung auf sie. Sagen: „Sorry, DASS ich das gesagt habe."',
          'Nicht 10 Mal entschuldigen – eine gute Entschuldigung reicht. Wiederholung wird zu Druck',
          'Danach: TUN. Wenn du sagst „Ich dränge dich nicht mehr" – dann passiert es auch so'
        ]
      },
      {
        typ: 'ja',
        titel: 'So gerne',
        beispiele: [
          'Ich entschuldige mich dafür, dass ich das Thema gedrängt habe, obwohl du gesagt hast, dass du nicht nochmal darüber reden willst. Das respektiere ich jetzt.',
          'Ich habe dich enttäuscht, als ich gesagt habe, dass ich erst heirate wenn ich alt bin. Das war nicht mein Ernst – ich will das klarstellen: DU bist mein Plan.',
          'Du musst dir keine Zeit nehmen, um zu verzeihen – sag mir nur, wenn du reden willst. Ich bin da.'
        ]
      },
      {
        typ: 'nein',
        titel: 'Eher nicht so',
        beispiele: [
          '„Sorry, aber du hast mich falsch verstanden." (Fehler bei ihr?)',
          '„Es war ein Witz!" (nach einer Verletzung)',
          '„Okay okay, sorry." (ohne Inhalt)'
        ]
      }
    ],
    quiz: [
      {
        frage: 'Welche Entschuldigung ist die STÄRKSTE?',
        optionen: [
          '„Sorry, aber du hast das überinterpretiert."',
          '„Sorry, dass ich gesagt habe, ich will erst heiraten wenn ich alt bin. Das war falsch formuliert – ich will mit DIR zusammen. Es tut mir leid, dass ich dich enttäuscht habe."',
          '„Mhm, sorry okay."'
        ],
        richtig: 1,
        erklaerung: 'Sie benennt konkret das Falsche, klärt die eigentliche Botschaft (mit DIR zusammen!) und validiert ihr Gefühl.'
      }
    ]
  },

  /* ============ NIVEAU 5: ZUKUNFT ============ */

  {
    id: 'n5-zukunftsplaene',
    niveau: 5,
    niveauName: 'Zukunft',
    titel: 'Über die Zukunft sprechen',
    beschreibung: 'Heirat, Zeitpläne, gemeinsame Pläne – der heiligste Bereich.',
    inhalt: [
      {
        typ: 'info',
        titel: 'Warum dieses Thema die größte Wirkung hat',
        text: 'Dilara (19) rechnet damit, dass ihr in ca. 5 Jahren ein gemeinsames Leben aufbaut (du bist 17, ihr wächst zusammen). Wenn ein Satz wie „erst heiraten, wenn ich alt bin / graue Haare" fällt, hört sie: „Es gibt keinen Plan für uns" – auch wenn du es nur als Unsicherheit meintest. (Echte Situation vom 09.09.: genau dieser Satz hat ihre Enttäuschung ausgelöst.)',
        tipps: [
          'Zeitpläne konkret benennen: „In ein paar Jahren, wenn wir beide bereit sind, will ich ein Leben mit dir aufbauen" – das gibt ihr Ankerpunkte',
          'Scherze über „grau", „alt", „nie heiraten" – NIE. Bei ihr kommen sie als Wahrheit an',
          'Deine Unsicherheiten sind erlaubt – aber SIE mit einbeziehen: „Ich weiß nicht genau wann, aber mit dir will ich das"'
        ]
      },
      {
        typ: 'ja',
        titel: 'So gerne',
        beispiele: [
          'Ich weiß nicht, wie alles genau aussieht – aber ich weiß, dass ich es mit dir aufbauen will.',
          'Mir ist wichtig, dass du weißt: Du bist mein Plan. Ich will nicht „irgendwann", ich will MIT DIR.',
          'Lass uns nicht über „wenn du 40 bist" reden. Lass uns reden, was in 1-2 Jahren passieren kann: Besuch, Familie, Sprache.'
        ]
      },
      {
        typ: 'nein',
        titel: 'Eher nicht so',
        beispiele: [
          '„Ich heirate erst, wenn meine Haare grau sind." – klingt wie „niemals mit dir"',
          '„Mach es einfach so wie du es möchtest." als Antwort auf ihre Enttäuschung – klingt wie Gleichgültigkeit',
          'Über Heirat reden, ohne ihren KULTUR-Kontext zu kennen (Familie, Oheim-Druck, Tradition)'
        ]
      },
      {
        typ: 'tuerkisch',
        saetze: [
          { tur: 'Seninle geleceğim var.', aussprache: 'se-nin-le dje-le-tschje-je-im far', de: 'Mit dir habe ich eine Zukunft.' },
          { tur: 'Sana söz: birlikte olacağız.', aussprache: 'sa-na söz: bi-lik-te ol-dja-tschıj', de: 'Ich verspreche dir: Wir werden zusammen sein.' }
        ]
      }
    ],
    quiz: [
      {
        frage: 'Dilara ist enttäuscht, weil sie das Gefühl hat, du willst erst heiraten wenn du alt bist. Was ist die beste Antwort?',
        optionen: [
          '„Na ja, mit 17 kann man das noch nicht wissen."',
          '„Das war schlecht formuliert von mir. Ich will ein Leben MIT DIR aufbauen – nicht „irgendwann, wenn ich alt bin". Sorry, dass du das anders verstanden hast."',
          '„Mach es einfach so wie du es möchtest."'
        ],
        richtig: 1,
        erklaerung: 'Option 2 nimmt der Enttäuschung den Boden: Das Wort wird als falsch anerkannt UND die eigentliche Botschaft (mit DIR!) wird klar ausgesprochen.'
      }
    ]
  },

  {
    id: 'n5-familie',
    niveau: 5,
    niveauName: 'Zukunft',
    titel: 'Ihre Familie respektieren',
    beschreibung: 'Mutter, Oheim, Großmutter – das Ökosystem um Dilara.',
    inhalt: [
      {
        typ: 'info',
        titel: 'Die Familie ist NICHT getrennt von Dilara',
        text: 'Bei Dilara: Die Mutter (Fadile) will dich gerne sehen und bewirten, die Großmutter hat dein Foto am Kühlschrank hängen. Gleichzeitig: Der Oheim übt Druck auf die Mutter aus, die Tante redet schlecht über die Mutter. Wenn die Familie positiv über dich denkt, hilft das der Beziehung. Wenn nicht, lastet das auf Dilara.',
        tipps: [
          'NIE über die Familie schlecht reden – auch nicht, wenn sie „unfair" ist. Sagen: „Ich will verstehen, was passiert ist"',
          'Mutter-Bezug aktiv pflegen: Wie geht es ihr? Braucht sie etwas? Das ist die stärkste Loyalitäts-Demo',
          'Wenn die Mutter dich sieht: Höflich, respektvoll, Interesse an IHR – nicht nur an Dilara'
        ]
      },
      {
        typ: 'ja',
        titel: 'So gerne',
        beispiele: [
          'Deine Mutter ist ein Schatz, dass sie so offen ist. Ich freue mich riesig, sie kennenzulernen.',
          'Wie geht es deiner Großmutter? Ich weiß, dass das mit dem Alzheimer für dich schwer ist.',
          'Ich will nicht, dass deine Familie sich wegen mir gestört fühlt.'
        ]
      },
      {
        typ: 'nein',
        titel: 'Eher nicht so',
        beispiele: [
          '„Dein Oheim ist doch nur ein..." – auch wenn er unrecht hat',
          'Die Mutter „Dilara" nennen 😅 (Name-Check vor jeder Nachricht!)',
          'Familienangelegenheiten kommentieren, wenn sie nicht nach deiner Meinung gefragt hat'
        ]
      }
    ],
    quiz: [
      {
        frage: 'Dilara klagt über ihren Oheim, der die Mutter unter Druck setzt. Was sagst du am besten?',
        optionen: [
          '„Der ist doch komplett durchgeknallt, den solltest du einfach blocken."',
          '„Das klingt wirklich belastend für deine Mutter und dich. Ich bin froh, dass sie so stark ist – und dass du für sie da bist."',
          '„Na ja, so ist die Türkei halt."'
        ],
        richtig: 1,
        erklaerung: 'Option 2 validiert ihr Gefühl, macht den Oheim nicht zum Feind (den sie liebt), und stärkt die Mutter – genau die richtige Balance.'
      }
    ]
  },

  /* ============ NIVEAU 6: TÜRKISCH-BASICS ============ */

  {
    id: 'n6-tuerkisch',
    niveau: 6,
    niveauName: 'Türkisch-Grundlagen',
    titel: 'Türkisch für eure Beziehung',
    beschreibung: 'Die wichtigsten Sätze mit Aussprache-Hilfe.',
    inhalt: [
      {
        typ: 'info',
        titel: 'Warum Türkisch lernen eure Geheimwaffe ist',
        text: 'Wenn du auch nur 20-30 Sätze auf Türkisch kannst, zeigst du: „Ich lerne für DICH." Das ist Wertschätzung, die sie (und ihre Mutter!) extrem stark fühlen werden. Du musst kein Türkisch-Genie werden – die wichtigsten Sätze reichen völlig.',
        tipps: [
          'Lerne die Sätze aus diesem Modul – und nutze sie im Chat (ein Satz pro Tag)',
          'Aussprache laut üben (am Telefon klingen die Laute anders als auf dem Papier)',
          'Fehler sind OK – sie wird dich korrigieren, und das ist ein Gesprächs-Anlass'
        ]
      },
      {
        typ: 'tuerkisch',
        saetze: [
          { tur: 'Merhaba.', aussprache: 'mer-ha-ba', de: 'Hallo.' },
          { tur: 'Seni seviyorum.', aussprache: 'se-ni se-wi-jou-ruum', de: 'Ich liebe dich.' },
          { tur: 'Seni çok seviyorum.', aussprache: 'se-ni tschok se-wi-jou-ruum', de: 'Ich liebe dich sehr.' },
          { tur: 'Nasılsın?', aussprache: 'na-schil-schin', de: 'Wie geht es dir?' },
          { tur: 'Çok iyiyim, sen?', aussprache: 'tschok it-jı-jım, sen', de: 'Mir geht es sehr gut, und dir?' },
          { tur: 'İyi geceler, tatlı rüyalar.', aussprache: 'it-schi dje-tse-lar, ta-tli rü-je-lar', de: 'Gute Nacht, süße Träume.' },
          { tur: 'Günaydın.', aussprache: 'gü-naj-dın', de: 'Guten Morgen.' },
          { tur: 'Seni düşünüyorum.', aussprache: 'se-ni dü-schü-nou-jou-ruum', de: 'Ich denke an dich.' },
          { tur: 'Hayatım.', aussprache: 'ha-jat-ım', de: 'Mein Leben (Liebes-Kosename).' },
          { tur: 'Canım.', aussprache: 'dja-nım', de: 'Meine Seele (Liebes-Kosename).' },
          { tur: 'Gözlerimin nuru.', aussprache: 'gös-le-ri-min nu-ru', de: 'Das Licht meiner Augen (sehr zärtlich).' },
          { tur: 'Öpücük.', aussprache: 'ö-pütsch-ük', de: 'Küsschen (für „😘").' }
        ]
      },
      {
        typ: 'info',
        titel: 'Aussprache-Hacks für Deutsche',
        text: 'Ein paar kurze Regeln, damit du die Laute richtig triffst:',
        tipps: [
          'c = t (çalışmak = ta-la-schmak), ç = tsch',
          'ş = sch (sev = sew, sen = sen)',
          'ü wie im deutschen „Mühle", ö wie im deutschen „Öl"',
          'ğ = weicher Laut, fast ein Juchzen (göz = gös)',
          'i = kurzes i, ı = offener ahh-Laut (sınav = sa-nawf)'
        ]
      }
    ],
    quiz: [
      {
        frage: 'Was bedeutet „Seni düşünüyorum?"',
        optionen: [
          'Ich sehe dich morgen',
          'Ich denke an dich',
          'Ich warte auf dich'
        ],
        richtig: 1,
        erklaerung: '„Ich denke an dich" – ein wunderschöner Satz für den Tages-Anfang oder -Ende!'
      },
      {
        frage: 'Was ist der zärtlichste Kosename in dieser Liste?',
        optionen: [
          'Hayatım (Mein Leben)',
          'Gözlerimin nuru (Das Licht meiner Augen)',
          'Merhaba (Hallo)'
        ],
        richtig: 1,
        erklaerung: '„Gözlerimin nuru" ist der poetischste der drei – für besondere Momente! (Und „Merhaba" ist einfach nur Hallo 😄)'
      }
    ]
  }
];



