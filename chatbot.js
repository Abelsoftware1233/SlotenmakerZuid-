/**
 * ECHO AI - SLOTENMAKER ZWOLLE-ZUID
 * Repository: SlotenmakerZwolleZuid
 * Status: VOLLEDIGE VERSIE (NLP, EMOTIE & CONTEXT GEÏMPLEMENTEERD)
 * 
 * Gebaseerd op informatie van www.slotenmakerzwollezuid.nl
 */

class BasicBot {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.name = "Lisa";
        this.company = "Slotenmaker Zwolle-Zuid";
        this.language = "nl";

        // Emotie en relatiebeheer
        this.mood = "professioneel"; // professioneel, empathisch, vriendelijk
        this.interactionCount = 0;
        this.relationshipScore = 50; // 0-100
        this.lastUserEmotion = null;
        this.conversationHistory = [];

        // Game state
        this.gameState = {
            active: false,
            code: null,
            timer: null,
            lockdown: false,
            attempts: 0
        };

        // Context voor gespreksgeheugen
        this.context = {
            lastIntent: null,
            lastTopic: null,
            userName: null,
            userLocation: null,
            urgency: false
        };

        // Synoniemen mapping voor NLP
        this.synonyms = {
            "hallo": ["hoi", "hey", "goedendag", "goedemorgen", "goedemiddag", "goedenavond", "dag", "hey daar"],
            "prijzen": ["tarief", "tarieven", "kosten", "wat kost", "prijs", "hoeveel", "kost", "betaling", "rekening"],
            "spoed": ["nood", "dringend", "snel", "haast", "urgent", "meteen", "direct", "paniek", "help"],
            "buitengesloten": ["deur dicht", "sleutel vergeten", "sleutel kwijt", "buiten gesloten", "buiten de deur", "niet naar binnen", "afgesloten", "deur op slot"],
            "openen": ["openmaken", "openen", "open krijgen", "deur open", "slot open"],
            "slot kapot": ["slot defect", "slot stuk", "slot werkt niet", "slot vastgelopen", "cilinder kapot", "slot vervangen"],
            "vca": ["certificaat", "certificering", "gecertificeerd", "kiwa", "kwaliteit", "betrouwbaar", "veilig", "vakkundig"],
            "openingstijden": ["open", "beschikbaar", "tijden", "wanneer", "tot hoe laat", "geopend", "uren"],
            "contact": ["bellen", "telefoon", "email", "mail", "contact opnemen", "nummer", "bereiken", "whatsapp"],
            "betalen": ["betaalmogelijkheden", "tikkie", "contant", "pin", "creditcard", "betaling"],
            "dank": ["bedankt", "dank je", "dank u", "thanks", "top", "geweldig", "super", "fijn"],
            "app": ["applicatie", "download", "gratis app", "telefoon app", "android", "apk"],
            "werkgebied": ["regio", "omgeving", "waar", "locatie", "plaats", "stad", "dorp", "zwolle", "omstreken"],
            "garantie": ["no cure no pay", "garantie", "schadevrij", "verzekerd", "compensatie"],
            "hackgame": ["spel", "game", "hack", "kraak", "code", "training"]
        };

        // Intents met patronen en responses
        this.intents = this.buildIntents();
    }

    /**
     * Bouw de intent database op
     */
    buildIntents() {
        return [
            {
                name: "greeting",
                patterns: ["hallo", "hoi", "hey", "goedendag", "goedemorgen", "goedemiddag", "goedenavond", "dag", "hey daar"],
                response: () => {
                    const greetings = [
                        "Goedendag! Welkom bij Slotenmaker Zwolle-Zuid. Ik ben Lisa. Hoe kan ik u vandaag helpen? 🛠️",
                        "Hallo! Fijn dat u er bent. Waarmee kan ik u van dienst zijn? Ik help u graag met al uw slotenvragen. 🔑",
                        "Hoi! Welkom! Heeft u een slotprobleem of wilt u gewoon wat informatie? Ik sta voor u klaar. 😊"
                    ];
                    return this.pickRandom(greetings);
                }
            },
            {
                name: "howAreYou",
                patterns: ["hoe gaat het", "hoe is het", "alles goed", "hoe gaat het met je", "hoe gaat het met u"],
                response: () => {
                    const responses = [
                        "Ik ben in topconditie! 🧠 Altijd klaar om mensen te helpen met hun sloten. En met u? Hopelijk heeft u zichzelf niet buitengesloten?",
                        "Met mij gaat het uitstekend! Ik ben er klaar voor om u te helpen. Hoe gaat het met u? 😊",
                        "Prima, dank u! Ik sta 24/7 paraat voor al uw sloten. Vertel me, waarmee kan ik u helpen?"
                    ];
                    return this.pickRandom(responses);
                }
            },
            {
                name: "prices",
                patterns: ["prijzen", "tarief", "tarieven", "kosten", "wat kost", "prijs", "hoeveel", "kost", "betaling", "rekening", "factuur"],
                response: () => {
                    let base = "Ik begrijp dat duidelijkheid belangrijk is. Onze tarieven zijn eerlijk:<br>" +
                        "• Voordeur dicht (sleutel vergeten): <strong>€90,-</strong><br>" +
                        "• Voordeur dicht (sleutel aan binnenzijde): <strong>€100,-</strong><br>" +
                        "• Voorrijden in Zwolle: <strong>GRATIS</strong><br>" +
                        "• Voorrijden buiten Zwolle: €40,- (binnen 40km)<br><br>" +
                        "<strong>No Cure No Pay</strong>: Krijgen we de deur niet open? Dan betaalt u niets! Dat is onze garantie. 🤝";
                    
                    // Voeg context toe als de gebruiker al eerder prijzen heeft gevraagd
                    if (this.context.lastIntent === "prices") {
                        base += "<br><br>Heeft u nog specifieke vragen over de kosten? Ik help u graag verder!";
                    }
                    
                    return base;
                }
            },
            {
                name: "emergency",
                patterns: ["spoed", "nood", "dringend", "snel", "haast", "urgent", "meteen", "direct", "paniek", "help", "buitengesloten", "deur dicht", "sleutel vergeten", "sleutel kwijt", "buiten gesloten", "niet naar binnen", "afgesloten"],
                response: () => {
                    this.context.urgency = true;
                    this.lastUserEmotion = "paniek";
                    return "🚨 <strong>SPOED:</strong> Blijf rustig. Wij zijn binnen 30 minuten ter plaatse in Zwolle (buiten Zwolle 60 min). " +
                        "Bel direct voor hulp zonder schade: <strong>06-10667625</strong><br><br>" +
                        "<em>Tip: Probeer niet zelf de deur te forceren, dat kan schade veroorzaken.</em> Onze VCA-gecertificeerde slotenmaker opent uw deur vakkundig en schadevrij. 🔓";
                }
            },
            {
                name: "lockedOut",
                patterns: ["buitengesloten", "deur dicht", "sleutel vergeten", "sleutel kwijt", "buiten gesloten", "buiten de deur", "niet naar binnen", "afgesloten", "deur op slot"],
                response: () => {
                    this.context.urgency = true;
                    this.lastUserEmotion = "frustratie";
                    const responses = [
                        "Wat vervelend dat u buitengesloten bent! 😟 Geen zorgen, wij helpen u snel weer naar binnen. Bel direct: <strong>06-10667625</strong>. Wij zijn binnen 30 minuten ter plaatse in Zwolle.",
                        "Oei, dat is vervelend! 😟 Blijf rustig, wij zijn er voor u. Bel <strong>06-10667625</strong> en we komen zo snel mogelijk. Onze slotenmaker werkt schadevrij en vakkundig.",
                        "Buitengesloten? Dat overkomt de beste. 🚪 Bel ons direct op <strong>06-10667625</strong>. Wij openen uw deur zonder schade en zijn snel bij u."
                    ];
                    return this.pickRandom(responses);
                }
            },
            {
                name: "lockBroken",
                patterns: ["slot kapot", "slot defect", "slot stuk", "slot werkt niet", "slot vastgelopen", "cilinder kapot", "slot vervangen", "slot repareren"],
                response: () => {
                    this.context.urgency = true;
                    return "Een kapot slot is vervelend, maar wij kunnen het repareren of vervangen. 🔧 Bel ons op <strong>06-10667625</strong> voor een snelle service. " +
                        "Wij werken met hoogwaardige sloten en zijn VCA-gecertificeerd. Geen voorrijkosten binnen Zwolle!";
                }
            },
            {
                name: "vca",
                patterns: ["vca", "certificaat", "certificering", "gecertificeerd", "kiwa", "kwaliteit", "betrouwbaar", "veilig", "vakkundig"],
                response: () => {
                    const responses = [
                        "Kwaliteit staat voorop. Wij zijn VCA Gecertificeerd bij de Kiwa! Dat betekent: snel, vakkundig en 100% schadevrij werken. ✅",
                        "Wij zijn trots op onze VCA-certificering bij Kiwa. 🏅 Dit garandeert dat onze slotenmakers vakkundig en veilig te werk gaan. Uw deur is bij ons in goede handen!",
                        "Betrouwbaarheid is essentieel. Daarom zijn wij VCA-gecertificeerd. ✅ U kunt op ons rekenen voor professioneel en schadevrij werk."
                    ];
                    return this.pickRandom(responses);
                }
            },
            {
                name: "openingHours",
                patterns: ["openingstijden", "open", "beschikbaar", "tijden", "wanneer", "tot hoe laat", "geopend", "uren"],
                response: () => {
                    let base = "Wij staan voor u klaar:<br>" +
                        "Ma t/m Do: <strong>17:30 - 00:00</strong> 🕠<br>" +
                        "Vr t/m Zo: <strong>17:30 - 01:00</strong> 🕠";
                    
                    // Voeg context toe
                    if (this.context.lastIntent === "emergency") {
                        base += "<br><br>🚨 Voor spoedgevallen buiten deze tijden kunt u ons altijd bellen. Wij zijn 7 dagen per week bereikbaar!";
                    }
                    
                    return base;
                }
            },
            {
                name: "contact",
                patterns: ["contact", "bellen", "telefoon", "email", "mail", "contact opnemen", "nummer", "bereiken", "whatsapp"],
                response: () => {
                    let base = "Hulp nodig? Bel <strong>06-10667625</strong> of mail naar slotenmakerzuid@hotmail.com. We zijn er voor u op de vermelde tijden! 🕘";
                    
                    // Voeg spoednummer toe als context urgent is
                    if (this.context.urgency) {
                        base += "<br><br>🚨 <strong>Spoed?</strong> Bel direct <strong>06-26170035</strong> voor de snelste service.";
                    }
                    
                    return base;
                }
            },
            {
                name: "payment",
                patterns: ["betalen", "betaalmogelijkheden", "tikkie", "contant", "pin", "creditcard", "betaling", "hoe betaal"],
                response: () => {
                    const responses = [
                        "U kunt makkelijk betalen via een Tikkie of contant. Veilig en snel. 💰",
                        "Wij accepteren contant geld en Tikkie. 💰 Geen gedoe, gewoon betalen wat is afgesproken. No Cure No Pay!",
                        "Betalen kan eenvoudig via Tikkie of contant. 💰 U betaalt pas als we de deur hebben geopend. Dat is onze garantie!"
                    ];
                    return this.pickRandom(responses);
                }
            },
            {
                name: "thanks",
                patterns: ["dank", "bedankt", "dank je", "dank u", "thanks", "top", "geweldig", "super", "fijn"],
                response: () => {
                    const responses = [
                        "Graag gedaan! Blij dat ik kon helpen. 👷‍♂️",
                        "Geen dank! Dat is waar we voor staan. 😊",
                        "Fijn dat ik u kon helpen! Heeft u nog andere vragen? 🔑",
                        "Altijd fijn om te horen! Als er nog iets is, laat het me weten. 😊"
                    ];
                    return this.pickRandom(responses);
                }
            },
            {
                name: "app",
                patterns: ["app", "applicatie", "download", "gratis app", "telefoon app", "android", "apk"],
                response: () => {
                    return "Goed nieuws! U kunt onze gratis app downloaden via de link op onze website. 📱 " +
                        "Met de app heeft u alle informatie over onze diensten en contactgegevens altijd bij de hand. " +
                        "<a href='https://www.dropbox.com/scl/fi/0b10hrcz43jqqaramx9sx/11801_SlotenmakerZwolleZuid.apk?rlkey=lc9w21v5y89cgpj3ve5dyqkep&st=x2rn190t&dl=0' target='_blank'>Download de app hier</a>.";
                }
            },
            {
                name: "workArea",
                patterns: ["werkgebied", "regio", "omgeving", "waar", "locatie", "plaats", "stad", "dorp", "zwolle", "omstreken"],
                response: () => {
                    let base = "Wij zijn actief in Zwolle en omgeving. 🗺️ Geen voorrijkosten binnen Zwolle! " +
                        "Buiten Zwolle rekenen we €40,- voorrijkosten (binnen 40km).";
                    
                    // Vraag naar locatie als die nog niet bekend is
                    if (!this.context.userLocation) {
                        base += "<br><br>Waar woont u? Dan kan ik aangeven of wij bij u komen.";
                    }
                    
                    return base;
                }
            },
            {
                name: "guarantee",
                patterns: ["garantie", "no cure no pay", "schadevrij", "verzekerd", "compensatie", "veilig"],
                response: () => {
                    const responses = [
                        "Onze <strong>No Cure No Pay</strong> garantie betekent: krijgen we de deur niet open? Dan betaalt u niets! 🤝",
                        "Wij werken <strong>schadevrij</strong> en met <strong>No Cure No Pay</strong>. 🔓 Als wij uw deur niet kunnen openen, betaalt u geen cent. Dat is onze belofte!",
                        "Uw zekerheid staat voorop. Met onze <strong>No Cure No Pay</strong> garantie loopt u geen risico. 🔒 Wij openen uw deur vakkundig en schadevrij, anders betaalt u niets."
                    ];
                    return this.pickRandom(responses);
                }
            },
            {
                name: "aboutUs",
                patterns: ["over ons", "wie zijn jullie", "bedrijf", "slotenmaker zwolle", "sinds wanneer", "missie", "visie"],
                response: () => {
                    return "Sinds 2025 is Slotenmaker Zwolle-Zuid uw betrouwbare partner. 🔑 " +
                        "Wij zijn VCA Gecertificeerd bij de Kiwa en onze missie is uw zorgen wegnemen door deuren snel en zonder schade te openen. " +
                        "Wij zijn 7 dagen per week beschikbaar voor spoedgevallen in Zwolle en omgeving. 🏠";
                }
            },
            {
                name: "hackgame",
                patterns: ["hackgame", "spel", "game", "hack", "kraak", "code", "training"],
                response: () => this.startHackGame()
            },
            {
                name: "goodbye",
                patterns: ["doei", "tot ziens", "dag", "bye", "vaarwel", "later", "tot later"],
                response: () => {
                    const responses = [
                        "Tot ziens! Als u nog vragen heeft, weet u ons te vinden. 👋",
                        "Doei! Bedankt voor uw bezoek. Fijne dag verder! 😊",
                        "Tot later! Onthoud: bij slotenproblemen staan wij voor u klaar. 🔑"
                    ];
                    return this.pickRandom(responses);
                }
            }
        ];
    }

    /**
     * Kies een willekeurig element uit een array
     */
    pickRandom(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    /**
     * Hoofd chat functie met NLP
     */
    async chat(userInput) {
        this.interactionCount++;
        const input = userInput.toLowerCase().trim();

        if (!input) return "";

        // Verhoog relatie score bij elk gesprek
        if (this.interactionCount > 3) this.relationshipScore = 70;
        if (this.interactionCount > 6) this.relationshipScore = 90;
        if (this.interactionCount > 10) this.relationshipScore = 95;

        // Voeg toe aan gespreksgeschiedenis
        this.conversationHistory.push({ role: "user", text: userInput, time: Date.now() });

               // Check voor lockdown
        if (this.gameState.lockdown) {
            return "🚨 <strong>SYSTEEM LOCKDOWN!</strong> Beveiliging wordt hersteld... Wacht 10 seconden.";
        }

        // Check voor hack game
        if (this.gameState.active && input.startsWith("code")) {
            return this.handleHackGuess(input);
        }

        // Detecteer intent
        const intent = this.detectIntent(input);

        // Als er een intent is gevonden, retourneer de response
        if (intent) {
            this.context.lastIntent = intent.name;
            this.context.lastTopic = intent.name;

            // Speciale afhandeling voor werkgebied: vraag naar locatie
            if (intent.name === "workArea" && !this.context.userLocation) {
                // We retourneren de basis response; de bot kan later om locatie vragen
            }

            // Genereer response
            let response = intent.response();

            // Voeg empathie toe
            response = this.addEmpathy(response, input);

            // Voeg aan geschiedenis toe
            this.conversationHistory.push({ role: "bot", text: response, time: Date.now() });

            return response;
        }

        // Fallback als geen intent is gevonden
        return this.getFallbackResponse(input);
    }

    /**
     * Detecteer de intentie van de gebruiker
     */
    detectIntent(input) {
        // Eerst synoniemen normaliseren
        const normalizedInput = this.normalizeInput(input);

        // Doorzoek alle intents
        for (const intent of this.intents) {
            for (const pattern of intent.patterns) {
                // Check of het patroon in de input voorkomt (substring match)
                if (normalizedInput.includes(pattern.toLowerCase())) {
                    return intent;
                }
            }
        }

        // Als geen directe match, probeer fuzzy matching
        return this.fuzzyMatch(normalizedInput);
    }

    /**
     * Normaliseer input met synoniemen
     */
    normalizeInput(input) {
        let normalized = input.toLowerCase().trim();

        // Vervang synoniemen door canonieke termen
        for (const [canonical, synonyms] of Object.entries(this.synonyms)) {
            for (const synonym of synonyms) {
                // Gebruik word boundaries om onbedoelde vervanging te voorkomen
                const regex = new RegExp(`\\b${synonym}\\b`, 'gi');
                if (regex.test(normalized)) {
                    // We voegen de canonieke term toe aan de input, zodat beide matchen
                    normalized += ` ${canonical}`;
                }
            }
        }

        return normalized;
    }

    /**
     * Fuzzy matching voor als geen exacte match is gevonden
     */
    fuzzyMatch(input) {
        // Bereken similarity met alle intent patronen
        let bestMatch = null;
        let bestScore = 0;

        for (const intent of this.intents) {
            for (const pattern of intent.patterns) {
                const score = this.similarity(input, pattern);
                if (score > bestScore && score > 0.6) { // Drempelwaarde
                    bestScore = score;
                    bestMatch = intent;
                }
            }
        }

        return bestMatch;
    }

    /**
     * Eenvoudige similarity berekening (Jaccard similarity op woorden)
     */
    similarity(str1, str2) {
        const words1 = new Set(str1.split(/\s+/));
        const words2 = new Set(str2.split(/\s+/));
        
        const intersection = new Set([...words1].filter(x => words2.has(x)));
        const union = new Set([...words1, ...words2]);
        
        return intersection.size / union.size;
    }

    /**
     * Fallback response als geen intent wordt herkend
     */
    getFallbackResponse(input) {
        // Check of de vraag een vraagteken bevat of vraagwoorden
        const isQuestion = input.includes("?") || 
                          input.includes("wat") || 
                          input.includes("hoe") || 
                          input.includes("waar") || 
                          input.includes("wanneer") ||
                          input.includes("wie");

        if (isQuestion) {
            // Probeer een specifiek antwoord te geven op basis van keywords
            if (input.includes("slot") || input.includes("deur")) {
                return "Ik begrijp dat u een vraag heeft over sloten of deuren. 🔑 " +
                    "Kunt u iets specifieker zijn? Bijvoorbeeld: vraagt u naar prijzen, openingstijden of spoedservice? " +
                    "Of bel ons direct op <strong>06-10667625</strong> voor persoonlijke hulp.";
            }
            
            if (input.includes("zwolle") || input.includes("omgeving")) {
                return "Vragen over ons werkgebied? 🗺️ Wij zijn actief in Zwolle en omgeving. " +
                    "Geen voorrijkosten binnen Zwolle! Bel <strong>06-10667625</strong> voor meer informatie.";
            }
        }

        // Algemene fallback
        const fallbacks = [
            "Dat heb ik niet helemaal begrepen. 🧠 Vraag me gerust naar onze 'prijzen', 'spoed' service of 'openingstijden'.",
            "Hmm, dat snap ik niet helemaal. 🤔 Probeer het eens met 'prijzen', 'spoed', 'contact' of 'openingstijden'.",
            "Sorry, ik begrijp uw vraag niet helemaal. 😅 U kunt mij vragen naar onze tarieven, beschikbaarheid of VCA-certificering.",
            "Ik ben nog in training, dus ik begrijp niet alles. 🧠 Vraag me naar 'prijzen', 'spoed', 'contact' of 'openingstijden' en ik help u verder!"
        ];

        return this.pickRandom(fallbacks);
    }

    /**
     * Voeg empathie toe aan responses
     */
    addEmpathy(response, input) {
        // Empathie toevoegen als ze buitengesloten zijn
        if (input.includes("buitengesloten") || input.includes("sleutel kwijt") || input.includes("deur dicht")) {
            this.lastUserEmotion = "frustratie";
            // Als de response al een empathische opener heeft, voeg niet nog een toe
            if (!response.includes("vervelend") && !response.includes("Wat vervelend") && !response.includes("Oei")) {
                return "Wat vervelend dat u buitengesloten bent! 😟 " + response;
            }
        }

        // Vriendelijkheid verhogen op basis van relatie
        if (this.relationshipScore > 80) {
            // Voeg een persoonlijke touch toe
            if (!response.includes("😊") && !response.includes("😄")) {
                return response + " 😊";
            }
        }

        // Als de gebruiker eerder emotie toonde, toon begrip
        if (this.lastUserEmotion === "paniek" && !response.includes("rustig")) {
            return response + " Blijf rustig, wij helpen u zo snel mogelijk!";
        }

        return response;
    }

    /**
     * Start het hack spel
     */
    startHackGame() {
        this.gameState.active = true;
        this.gameState.code = Math.floor(1000 + Math.random() * 9000);
        this.gameState.attempts = 0;
        
        // Timer voor 15 seconden
        this.gameState.timer = setTimeout(() => {
            if (this.gameState.active) this.activateLockdown();
        }, 15000);

        return "TRAININGSDUUR... 📟 Kraak de beveiligingscode van het slot (1000-9999). Je hebt maar 15 seconden! Type: 'code [getal]'";
    }

    /**
     * Activeer lockdown als de tijd om is
     */
    activateLockdown() {
        this.gameState.active = false;
        this.gameState.lockdown = true;
        
        setTimeout(() => {
            this.gameState.lockdown = false;
        }, 10000);
    }

    /**
     * Verwerk een code gok in het hack spel
     */
    handleHackGuess(input) {
        this.gameState.attempts++;
        let guess = parseInt(input.replace("code", "").trim());

        if (isNaN(guess)) {
            return "Voer een geldig getal in tussen 1000 en 9999. 🔢";
        }

        if (guess === this.gameState.code) {
            clearTimeout(this.gameState.timer);
            this.gameState.active = false;
            return "SLOT GEOPEND! 🔓 Goed gedaan, je hebt de techniek onder de knie! " +
                "Je had " + this.gameState.attempts + " pogingen nodig. Wil je het nog eens proberen? Typ 'hackgame'.";
        }

        // Hint geven na een paar pogingen
        let hint = "";
        if (this.gameState.attempts >= 3) {
            if (guess < this.gameState.code) {
                hint = " De code is hoger dan " + guess + ".";
            } else {
                hint = " De code is lager dan " + guess + ".";
            }
        }

        return "FOUTIEVE CODE! ⚠️ Snel, probeer het nog eens voordat de tijd om is!" + hint;
    }
}

// Exporteer de class voor gebruik in de browser
window.BasicBot = BasicBot;
```
