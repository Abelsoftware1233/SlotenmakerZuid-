/**
 * ECHO AI - SLOTENMAKER ZWOLLE-ZUID
 * Repository: SlotenmakerZwolleZuid
 * Status: VOLLEDIGE VERSIE - SLOTENMAKER TARIEVEN GEÏMPLEMENTEERD
 */

class BasicBot {
    constructor(apiKey) {
        this.apiKey = apiKey; 
        this.name = "Echo";
        this.company = "Slotenmaker Zwolle-Zuid";
        this.language = "nl";
        this.mood = "neutral";
        this.relationshipScore = 50;
        
        this.gameState = { 
            active: false, 
            code: null, 
            timer: null,
            lockdown: false 
        };

        this.data = {
            keywords: {
                "hoe gaat het": {
                    nl: "Ik voel me erg 'verbonden' vandaag! 🧠 Werken voor Slotenmaker Zwolle-Zuid geeft me echt een doel. Hoe gaat het met jou?"
                },
                "prijzen": {
                    nl: "Onze tarieven zijn eerlijk en transparant:<br>" +
                        "• Voordeur dicht (sleutel vergeten): <strong>€90,-</strong><br>" +
                        "• Voordeur dicht (sleutel aan binnenzijde): <strong>€100,-</strong><br>" +
                        "• Voorrijden Zwolle: <strong>GRATIS</strong><br>" +
                        "• Voorrijden buiten Zwolle: €40,- (binnen 40km)<br><br>" +
                        "Wij werken volgens <strong>No Cure No Pay</strong>: Krijgen we de deur niet open? Dan betaalt u niets!"
                },
                "tarieven": "prijzen", "kosten": "prijzen", "wat kost": "prijzen",
                
                "spoed": {
                    nl: "🚨 SPOED: Wij zijn binnen 30 minuten ter plaatse in Zwolle! & 60 minuten buiten Zwolle!Bel direct voor hulp zonder schade: 06-17867663"
                },
                "openen": "spoed", "buitengesloten": "spoed",

                "vca": {
                    nl: "Jazeker, wij zijn VCA Gecertificeerd bij de Kiwa! Dit garandeert dat we uw deuren snel, vakkundig en 100% schadevrij openen. ✅"
                },
                "veiligheid": "vca", "certificaat": "vca",

"openingstijden": {
                    nl: "Maandag tot en met Donderdag van 17:30 tot 00:00 🕠Vrijdag tot en met Zondag 17:30 tot 01:00 🕠"
                },
                "openingstijden": "beschikbaarheid", "opening": "uren",

                "contact": {
                    nl: "Hulp nodig? Bel 06-17867663 of mail naar slotenmakerzuid@hotmail.com. Wij zijn bereikbaar op de tijden vermeld op onze beschikbaarheidspagina! 🕘"
                },
                "email": "contact", "mail": "contact", "telefoon": "contact",

                "betalen": {
                    nl: "U kunt bij ons eenvoudig betalen via een Tikkie of contant. En vergeet niet: No Cure No Pay! 💰"
                },
                "contant": "betalen", "tikkie": "betalen",

                "hackgame": {
                    nl: "SLOTENMAKER TRAINING... 📟 Kraak de beveiligingscode van het slot (1000-9999). Je hebt 15 seconden! Type: 'code [getal]'"
                }
            },
            default: {
                nl: "Hmm, daar heb ik het antwoord nog niet op... 🧠 Vraag eens naar de 'prijzen', 'spoed' of 'vca'!"
            }
        };
    }

    // --- CORE LOGICA ---
    async chat(userInput) {
        const input = userInput.toLowerCase().trim();
        if (!input) return "";

        if (this.gameState.lockdown) {
            return "🚨 SYSTEEM IN LOCKDOWN! Beveiliging wordt hersteld... Wacht 10 seconden.";
        }

        if (this.gameState.active && input.startsWith("code")) {
            return this.handleHackGuess(input);
        }

        for (let key in this.data.keywords) {
            if (input.includes(key)) {
                let match = this.data.keywords[key];
                if (typeof match === "string") match = this.data.keywords[match];
                if (key === "hackgame") return this.startHackGame();
                return this.addHumanTouch(match[this.language]);
            }
        }
        return this.data.default[this.language];
    }

    addHumanTouch(response) {
        if (this.relationshipScore > 80) return response + " 😊";
        return response;
    }

    startHackGame() {
        this.gameState.active = true;
        this.gameState.code = Math.floor(1000 + Math.random() * 9000); 
        this.gameState.timer = setTimeout(() => { if (this.gameState.active) this.activateLockdown(); }, 15000);
        return this.data.keywords["hackgame"][this.language];
    }

    activateLockdown() {
        this.gameState.active = false;
        this.gameState.lockdown = true;
        setTimeout(() => { this.gameState.lockdown = false; }, 10000);
    }

    handleHackGuess(input) {
        let guess = parseInt(input.replace("code ", ""));
        if (guess === this.gameState.code) {
            clearTimeout(this.gameState.timer);
            this.gameState.active = false;
            return "SLOT GEOPEND! 🔓 Je bent een echte vakman!";
        }
        return "FOUTIEVE CODE! Probeer het snel nog eens...";
    }
}

window.BasicBot = BasicBot;
