/**
 * ECHO AI - SLOTENMAKER ZWOLLE-ZUID
 * Repository: SlotenmakerZwolleZuid
 * Status: VERBETERDE VERSIE (NLP & EMOTIE GEÏMPLEMENTEERD)
 */

class BasicBot {
    constructor(apiKey) {
        this.apiKey = apiKey; 
        this.name = "Echo";
        this.company = "Slotenmaker Zwolle-Zuid";
        this.language = "nl";
        
        // Emotie en relatie beheer
        this.mood = "professioneel"; // professioneel, empathisch, vriendelijk
        this.interactionCount = 0;
        this.relationshipScore = 50; // 0-100
        
        this.gameState = { 
            active: false, 
            code: null, 
            timer: null,
            lockdown: false 
        };

        this.data = {
            keywords: {
                "hallo": {
                    nl: "Goedendag! Welkom bij Slotenmaker Zwolle-Zuid. Ik ben Echo. Hoe kan ik u vandaag helpen? 🛠️"
                },
                "hoi": "hallo",
                "hey": "hallo",

                "hoe gaat het": {
                    nl: "Ik ben in topconditie! 🧠 Altijd klaar om mensen te helpen met hun sloten. En met u? Hopelijk heeft u zichzelf niet buitengesloten?"
                },
                "prijzen": {
                    nl: "Ik begrijp dat duidelijkheid belangrijk is. Onze tarieven zijn eerlijk:<br>" +
                        "• Voordeur dicht (sleutel vergeten): <strong>€90,-</strong><br>" +
                        "• Voordeur dicht (sleutel aan binnenzijde): <strong>€100,-</strong><br>" +
                        "• Voorrijden in Zwolle: <strong>GRATIS</strong><br>" +
                        "• Voorrijden buiten Zwolle: €40,- (binnen 40km)<br><br>" +
                        "<strong>No Cure No Pay</strong>: Krijgen we de deur niet open? Dan betaalt u niets! Dat is onze garantie. 🤝"
                },
                "tarieven": "prijzen", "kosten": "prijzen", "wat kost": "prijzen",
                
                "spoed": {
                    nl: "🚨 <strong>SPOED:</strong> Blijf rustig. Wij zijn binnen 30 minuten ter plaatse in Zwolle (buiten Zwolle 60 min). Bel direct voor hulp zonder schade: <strong>06-17867663</strong>"
                },
                "openen": "spoed", "buitengesloten": "spoed", "sleutel kwijt": "spoed", "slot kapot": "spoed",

                "vca": {
                    nl: "Kwaliteit staat voorop. Wij zijn VCA Gecertificeerd bij de Kiwa! Dat betekent: snel, vakkundig en 100% schadevrij werken. ✅"
                },
                "veiligheid": "vca", "certificaat": "vca", "betrouwbaar": "vca",

                "openingstijden": {
                    nl: "Wij staan voor u klaar:<br>Ma t/m Do: <strong>17:30 - 00:00</strong> 🕠<br>Vr t/m Zo: <strong>17:30 - 01:00</strong> 🕠"
                },
                "beschikbaarheid": "openingstijden", "open": "openingstijden",

                "contact": {
                    nl: "Hulp nodig? Bel <strong>06-17867663</strong> of mail naar slotenmakerzuid@hotmail.com. We zijn er voor u op de vermelde tijden! 🕘"
                },
                "email": "contact", "mail": "contact", "telefoon": "contact",

                "betalen": {
                    nl: "U kunt makkelijk betalen via een Tikkie of contant. Veilig en snel. 💰"
                },
                "contant": "betalen", "tikkie": "betalen",

                "dank": {
                    nl: "Graag gedaan! Blij dat ik kon helpen. 👷‍♂️"
                },
                "bedankt": "dank",

                "hackgame": {
                    nl: "TRAININGSDUUR... 📟 Kraak de beveiligingscode van het slot (1000-9999). Je hebt maar 15 seconden! Type: 'code [getal]'"
                }
            },
            default: {
                nl: "Dat heb ik niet helemaal begrepen. 🧠 Vraag me gerust naar onze 'prijzen', 'spoed' service of 'openingstijden'."
            }
        };
    }

    // --- CORE LOGICA MET NLP TOUCH ---
    async chat(userInput) {
        this.interactionCount++;
        const input = userInput.toLowerCase().trim();
        
        if (!input) return "";

        // Verhoog relatie score bij elk gesprek
        if (this.interactionCount > 3) this.relationshipScore = 70;
        if (this.interactionCount > 6) this.relationshipScore = 90;

        if (this.gameState.lockdown) {
            return "🚨 <strong>SYSTEEM LOCKDOWN!</strong> Beveiliging wordt hersteld... Wacht 10 seconden.";
        }

        if (this.gameState.active && input.startsWith("code")) {
            return this.handleHackGuess(input);
        }

        // NLP Zoekfunctie
        for (let key in this.data.keywords) {
            if (input.includes(key)) {
                let match = this.data.keywords[key];
                
                // Doorverwijzing naar andere sleutel
                if (typeof match === "string") match = this.data.keywords[match];
                
                if (key === "hackgame") return this.startHackGame();
                
                return this.addEmpathy(match[this.language], input);
            }
        }
        
        return this.data.default[this.language];
    }

    // --- EMOTIE EN NLP FUNCTIES ---
    
    addEmpathy(response, input) {
        // Empathie toevoegen als ze buitengesloten zijn
        if (input.includes("buitengesloten") || input.includes("sleutel kwijt")) {
            return "Wat vervelend dat u buitengesloten bent! 😟 " + response;
        }
        
        // Vriendelijkheid verhogen op basis van relatie
        if (this.relationshipScore > 80) {
            return response + " 😊";
        }
        
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
            return "SLOT GEOPEND! 🔓 Goed gedaan, je hebt de techniek onder de knie!";
        }
        return "FOUTIEVE CODE! ⚠️ Snel, probeer het nog eens voordat de tijd om is!";
    }
}

window.BasicBot = BasicBot;
