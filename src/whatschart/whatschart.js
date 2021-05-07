const wsp = require("whatsapp-chat-parser");
const sw = require("stopword")

const util = require("../util/util.js")
const author = require("./author.js");

class whatsChart {

    constructor() {

        // member vars
        this.removeStopwords = false;
        this.authors = {
            author1: new author(),
            author2: new author()
        }
        this.messages = []
        // Matches emojis in a string
        this.regexEmojis = new RegExp("(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])");
        // Matches words (includes `'` but not `.`,`,` etc.)
        this.regexWords = new RegExp(/[^\W_]+(?:['_-][^\W_]+)*/g);

        // Fill messagesByHour and messagesByDaysOfWeek for consistent plotting
        for (let i = 0; i <= 23; i++) {
            this.authors.author1.messagesByHour.set(i, 0);
            this.authors.author2.messagesByHour.set(i, 0);
        };
        for (let i = 0; i < 7; i++) {
            this.authors.author1.messagesByDaysOfWeek.set(i, 0);
            this.authors.author2.messagesByDaysOfWeek.set(i, 0);
        };
    };

    incrementCounter(map, key) {

        let freq = map.get(key);
        map.set(key, (freq === undefined) ? 1 : freq + 1);
    };

    setAuthorNames(messages) {

        for (let msg of messages) {
            if (msg.author != "" && msg.author != "System") {
                if (!this.authors.author1.name) {
                    this.authors.author1.name = msg.author;
                    continue;
                };

                if (msg.author != this.authors.author1.name) {
                    this.authors.author2.name = msg.author;
                    break;
                };
            };
        };
    };

    calculateFinalStats(auth) {

        // sort maps
        auth.words = util.sortMap(auth.words);
        auth.emojis = util.sortMap(auth.emojis);

        auth.wordsPerMessage = auth.totalWords / auth.textMessages;
        auth.mostUsedWord = [...auth.words][0];
        auth.mostUsedEmoji = [...auth.emojis][0];
    }

    generateStats(messages) {

        return new Promise((resolve, reject) => {

            try {
                this.setAuthorNames(messages);

                for (let msg of messages) {

                    // get author of the message
                    var auth = {};
                    if (msg.author === this.authors.author1.name) {
                        auth = this.authors.author1;
                    } else if (msg.author === this.authors.author2.name) {
                        auth = this.authors.author2;
                    };

                    // Sort message by time and increment counters
                    this.incrementCounter(auth.messagesByHour, msg.date.getHours());
                    this.incrementCounter(auth.messagesByDaysOfWeek, msg.date.getDay());
                    this.incrementCounter(auth.messagesByDate, msg.date.toLocaleDateString());

                    // Convert message to lower-case. We're making a decision that case doesn't matter for analysis.
                    const message = msg.message.toLowerCase();

                    // determine the type of message and increment counters
                    // This can obviously fail if one includes these file extensions manually, but thanks to WhatsApp's
                    // big brain decision to use differring formats for media messages, this seems to be the only way.
                    auth.totalMessages++;

                    if (message.includes(".jpg") || message.includes(".webp")) {
                        // is an image
                        auth.totalMedia++;
                        auth.pictures++;
                    } else if (message.includes(".opus")) {
                        // is an audio
                        auth.totalMedia++;
                        auth.audios++;
                    } else if (message.includes(".mp4")) {
                        // is a video
                        auth.totalMedia++;
                        auth.videos++;
                    } else if (message.includes("https://") || message.includes("http://")) {
                        // is a link
                        auth.totalMedia++;
                        auth.links++;
                    } else {
                        // text message
                        auth.textMessages++;

                        // extract words
                        let words = message.match(this.regexWords);
                        if (words) {
                            if (this.removeStopwords === true) {
                                words = sw.removeStopwords(words, sw.en);
                            }

                            for (let word of words) {
                                this.incrementCounter(auth.words, word);
                            };

                            auth.totalWords += words.length;
                        };

                        // detect & process emojis
                        let emojis = message.match(this.regexEmojis);
                        if (emojis) {
                            for (let emoji of emojis) {
                                this.incrementCounter(auth.emojis, emoji);
                            };
                            auth.totalEmojis += emojis.length;
                        };
                    };
                };
            } catch (err) {
                reject(err);
            };

            // const author1 = this.authors.author1;
            // const author2 = this.authors.author2;

            // // sort maps
            // author1.words = util.sortMap(author1.words);
            // author1.emojis = util.sortMap(author1.emojis);
            // author2.words = util.sortMap(author2.words);
            // author2.emojis = util.sortMap(author2.emojis);

            // // calculate properties that require other properties
            // author1.wordsPerMessage = author1.totalWords / author1.textMessages;
            // author2.wordsPerMessage = author2.totalWords / author2.textMessages;

            this.calculateFinalStats(this.authors.author1);
            this.calculateFinalStats(this.authors.author2);

            resolve(this.authors);
        });

    };

    parseChats(data) {

        return new Promise((resolve, reject) => {

            wsp.parseString(data)
                .then(
                    messages => {
                        return this.generateStats(messages);
                    },
                    err => {

                        console.error(`Error while parsing chats: (${err.name}: ${err.message})`);
                        reject(new Error(`Error while parsing chats: (${err.name}: ${err.message})`));
                    }
                ).then(
                    authors => {
                        resolve(authors);
                    },
                    err => {

                        console.error(`Error while generating stats: (${err.name}: ${err.message})`);
                        reject(new Error(`Error while generating stats: (${err.name}: ${err.message})`));
                    }
                );
        });

    };

    run(data, rmStopwords = false) {

        this.removeStopwords = rmStopwords;
        return this.parseChats(data);
    };


}

export default whatsChart;

