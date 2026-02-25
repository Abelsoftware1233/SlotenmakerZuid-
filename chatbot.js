/**
 * ECHO AI - SLOTENMAKER ZWOLLE-ZUID & ABELSOFTWARE123 EDITIE
 * Repository: SlotenmakerZwolleZuid
 * Status: VOLLEDIGE VERSIE - VCA GECERTIFICEERD
 */

class BasicBot {
    constructor(apiKey) {
        this.apiKey = apiKey; 
        this.name = "Echo";
        this.company = "Slotenmaker Zwolle-Zuid";
        this.language = "nl"; // Volledig in het Nederlands
        this.mood = "neutral";
        this.relationshipScore = 50;
        
        // --- GAME & LOCKDOWN STATUS ---
        this.gameState = { 
            active: false, 
            code: null, 
            timer: null,
            lockdown: false 
        };

        // --- DATA REPOSITORY (BEDRIJFSINFORMATIE) ---
        this.data = {
            keywords: {
                "hoe gaat het": {
                    nl: "Ik voel me erg 'verbonden' vandaag! 🧠 Mijn algoritmes bruisen. Werken voor Slotenmaker Zwolle-Zuid en Abelsoftware123 geeft me echt een doel. Hoe gaat het met jou?"
                },
                "prijzen": {
                    nl: "We houden het eerlijk: Games vanaf €4,99, websites en apps vanaf €200, en domeinnamen vanaf €50. Standaard chatbots voor €1000. AI Software (gezichtsherkenning of DJI drone) vanaf €150 licentie. Adverteren op games/apps begint tussen €50 en €300 per maand. Kwaliteit gemaakt met liefde! 💸"
                },
                "tarieven": "prijzen", "kosten": "prijzen",
                
                "spoed": {
                    nl: "🚨 SPOED: Wij zijn binnen 30 minuten ter plaatse in Zwolle-Zuid! Bel direct voor hulp zonder schade: 06-26170035."
                },
                "openen": "spoed", "buitengesloten": "spoed",

                "vca": {
                    nl: "Jazeker, wij zijn VCA Gecertificeerd bij de Kiwa! Dit garandeert dat ik uw deuren snel, vakkundig en 100% schadevrij open. ✅"
                },
                "veiligheid": "vca", "certificaat": "vca",

                "contact": {
                    nl: "Hulp nodig? Bel 06-26170035 of mail naar slotenmakerzuid@hotmail.com. Wij zijn 7 dagen per week bereikbaar tussen 17:30 en 00:00! 🕘"
                },
                "email": "contact", "mail": "contact", "telefoon": "contact",

                "software": {
                    nl: "Naast sloten bouwen we slimme software zoals Face Recognition en Drone Mapping. Bekijk al onze AI-oplossingen op: www.abelsoftware123.com/ai.html 🤖"
                },
                "ai": "software", "abelsoftware": "software",

                "games": {
                    nl: "Ik hou van spellen maken! 🎮 Van Mario tot arcade-titels. Koop een volledige licentie in onze shop voor de beste ervaring zonder reclame en met levenslange updates."
                },
                "spellen": "games", "download": "games",

                "betalen": {
                    nl: "Betaal eenvoudig contant of via tikkie!"
                },
                "contant": "betalen", "kopen": "betalen",

                "hackgame": {
                    nl: "SLOTENMAKER TRAINING... 📟 Kraak de beveiligingscode van het slot (1000-9999). Je hebt 15 seconden! Type: 'code [getal]'"
                }
            },
            default: {
                nl: "Hmm, daar heb ik het antwoord nog niet op... 🧠 Ik was net aan het nadenken over nieuwe AI-software. Vraag eens naar 'spoed', 'prijzen', 'vca' of 'contact'!"
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

        // Trefwoorden zoeken
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
        if (this.relationshipScore > 80) return response + " 😊 Ik vind het fijn om je te helpen!";
        return response;
    }

    // --- HACK GAME LOGICA ---
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
