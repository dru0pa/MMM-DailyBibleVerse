//dailybibleverse.js

Module.register("MMM-DailyBibleVerse", {
    // Default module config.
    result: [],
    defaults: {
        // Default Bible version is ESV.
        // Change it to a version that BibleGateway.com supports.
        // https://www.biblegateway.com/usage/linking/versionslist/
        version: "ESV",
        size: "medium",
        updateInterval: 3600000 // perform every hour (3600000 milliseconds)
    },

    start: function () {
        Log.info("Starting module: " + this.name);
        const configuredVersion = this.config.version;

        // Do this once first
        this.sendSocketNotification("START", configuredVersion);

        // Then periodically at the configured interval
        setInterval(() => {
            this.sendSocketNotification("START", configuredVersion);
        }, this.config.updateInterval);
    },

    getStyles: function () {
        return ["MMM-DailyBibleVerse.css"];
    },

    // Override dom generator.
    getDom: function () {
        Log.log("Updating MMM-DailyBibleVerse DOM.");

        let verse = "";
        let reference = "";

        if (this.verseOfTheDay != null && this.reference != null) {
            verse = this.verseOfTheDay;

            // split reference in book and chapter reference, ex. for
            // input "1 Corinthian 13:6,7" => "1 Corinthian", "13:6,7"
            reference = this.reference.trim();
            const lastSpace = reference.lastIndexOf(" ");
            if (lastSpace !== -1) {
                const book = reference.substring(0, lastSpace);
                const chapter = reference.substring(lastSpace + 1);

                // now we build the reference with translated book title
                reference = " - " + this.translate(book) + " " + chapter;
            } else {
                reference = " - " + this.translate(reference);
            }
        }

        const wrapper = document.createElement("div");
        switch (this.config.size) {
            case "xsmall":
                wrapper.className = "bright xsmall";
                break;
            case "small":
                wrapper.className = "bright small";
                break;
            case "medium":
                wrapper.className = "bright medium";
                break;
            case "large":
                wrapper.className = "bright large";
                break;
            default:
                wrapper.className = "bright medium";
        }
        wrapper.innerHTML = verse + reference;
        return wrapper;
    },

    getTranslations: function () {
        return {
            de: "translations/de.json",
            en: "translations/en.json",
            es: "translations/es.json",
            nl: "translations/nl.json"
        };
    },

    socketNotificationReceived: function (notification, payload) {
        Log.log("socket received from Node Helper");
        if (notification === "BIBLE_GATEWAY_RESULT" && payload && payload.votd) {
            Log.log(payload);
            this.verseOfTheDay = payload.votd.text;
            this.reference = payload.votd.reference;

            this.updateDom();
        }
    }
});

