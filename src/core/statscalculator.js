import * as whatsapp from "whatsapp-chat-parser";
import sw from "stopword";
import { sortMap } from "../util/util.js";
import { author } from "./author.js";

class statsCalculator {
  constructor() {
    // member vars
    this.removeStopwords = false;
    this.language = {};
    this.authors = {
      author1: new author(),
      author2: new author(),
      combined: {
        sectionsWordString: "",

        messagesByHour: new Map(),
        messagesByDaysOfWeek: new Map(),
        messagesByDate: new Map(),
        mostUsedWord: {},
        mostUsedEmoji: {},
        busiestHour: 0,
        busiestWeekOfDay: 0,
        busiestDay: {},
        startDate: "",
        endDate: "",
        periodInDays: 0,
      },
    };
    this.messages = [];
    // Matches emojis in a string
    this.regexEmojis = new RegExp(
      "(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])"
    );
    // Matches words (includes `'` but not `.`,`,` etc.)
    this.regexWords = new RegExp(/[^\W_]+(?:['’_-][^\W_]+)*/g);

    // Fill messagesByHour and messagesByDaysOfWeek for consistent plotting
    for (let i = 0; i <= 23; i++) {
      this.authors.author1.messagesByHour.set(i, 0);
      this.authors.author2.messagesByHour.set(i, 0);
    }
    for (let i = 0; i < 7; i++) {
      this.authors.author1.messagesByDaysOfWeek.set(i, 0);
      this.authors.author2.messagesByDaysOfWeek.set(i, 0);
    }
  }

  incrementCounter(map, key) {
    let freq = map.get(key);
    map.set(key, freq === undefined ? 1 : freq + 1);
  }

  addMaps(map1, map2) {
    // Adds two Maps. If there are duplicate keys, their values are added
    const newMap = new Map();

    for (let [key, val] of map1) {
      newMap.set(key, val);
    }
    for (let [key, val] of map2) {
      let prevVal = newMap.get(key);
      if (prevVal === undefined) {
        prevVal = 0;
      }

      newMap.set(key, prevVal + val);
    }

    return newMap;
  }

  generateWordsSectionString(author1, author2) {
    let wordsSectionString = "";
    if (author1.textMessages === author2.textMessages) {
      if (author1.wordsPerMessage === author2.wordsPerMessage) {
        wordsSectionString = `${author1.name} &amp; ${author2.name} have sent each other equal number of\
                texts! But that's not all, their messages, on average, have been of the same length as well!`;
      } else {
        wordsSectionString = `${author1.name} &amp; ${
          author2.name
        } have sent each other equal number of\
                texts! But ${
                  author1.wordsPerMessage > author2.wordsPerMessage
                    ? author1.name
                    : author2.name
                } 's texts were longer`;
      }
    } else if (author1.textMessages > author2.textMessages) {
      if (author1.wordsPerMessage === author2.wordsPerMessage) {
        wordsSectionString = `${author1.name} sends more texts, and their texts are of the same length\
                as ${author2.name}`;
      } else if (author1.wordsPerMessage > author2.wordsPerMessage) {
        wordsSectionString = `${author1.name} not only sends more texts, but their texts also tend to be longer!`;
      } else if (author2.wordsPerMessage > author1.wordsPerMessage) {
        wordsSectionString = `While ${author1.name} sends more texts, their texts tend to be shorter`;
      }
    } else if (author2.textMessages > author1.textMessages) {
      if (author1.wordsPerMessage === author2.wordsPerMessage) {
        wordsSectionString = `${author2.name} sends more texts, and their texts are of the same length\
                as ${author2.name}`;
      } else if (author2.wordsPerMessage > author1.wordsPerMessage) {
        wordsSectionString = `${author2.name} not only sends more texts, but their texts also tend to be longer!`;
      } else if (author1.wordsPerMessage > author2.wordsPerMessage) {
        wordsSectionString = `While ${author2.name} sends more texts, their texts tend to be shorter`;
      }
    }

    return wordsSectionString;
  }

  setAuthorNames(messages) {
    for (let msg of messages) {
      if (msg.author != "" && msg.author != "System") {
        if (!this.authors.author1.name) {
          this.authors.author1.name = msg.author;
          continue;
        }

        if (msg.author != this.authors.author1.name) {
          this.authors.author2.name = msg.author;
          break;
        }
      }
    }
  }

  generateCombinedStats() {
    const author1 = this.authors.author1;
    const author2 = this.authors.author2;
    const combined = this.authors.combined;

    combined.sectionWordsString = this.generateWordsSectionString(
      author1,
      author2
    );

    combined.messagesByHour = this.addMaps(
      author1.messagesByHour,
      author2.messagesByHour
    );
    combined.messagesByDaysOfWeek = this.addMaps(
      author1.messagesByDaysOfWeek,
      author2.messagesByDaysOfWeek
    );
    combined.messagesByDate = this.addMaps(
      author1.messagesByDate,
      author2.messagesByDate
    );

    combined.mostUsedWord = [
      ...this.addMaps(author1.words, author2.words).entries(),
    ].reduce((a, e) => (e[1] > a[1] ? e : a));
    combined.mostUsedEmoji = [
      ...this.addMaps(author1.emojis, author2.emojis).entries(),
    ].reduce((a, e) => (e[1] > a[1] ? e : a));
    combined.busiestHour = [...combined.messagesByHour.entries()].reduce(
      (a, e) => (e[1] > a[1] ? e : a)
    );
    combined.busiestWeekOfDay = [
      ...combined.messagesByDaysOfWeek.entries(),
    ].reduce((a, e) => (e[1] > a[1] ? e : a));
    combined.busiestDay = [...combined.messagesByDate.entries()].reduce(
      (a, e) => (e[1] > a[1] ? e : a)
    );

    combined.startDate = [...combined.messagesByDate][0][0];
    combined.endDate = [...combined.messagesByDate][
      combined.messagesByDate.size - 1
    ][0];
    combined.periodInDays = combined.messagesByDate.size;
  }

  generateFinalStats(auth) {
    // sort maps
    auth.words = sortMap(auth.words);
    auth.emojis = sortMap(auth.emojis);

    auth.wordsPerMessage = auth.totalWords / auth.textMessages;
    auth.mostUsedWord = [...auth.words][0];
    auth.mostUsedEmoji = [...auth.emojis][0];
  }

  generateStats(messages) {
    return new Promise((resolve, reject) => {
      this.setAuthorNames(messages);

      for (let msg of messages) {
        // get author of the message
        var auth = {};
        if (msg.author === this.authors.author1.name) {
          auth = this.authors.author1;
        } else if (msg.author === this.authors.author2.name) {
          auth = this.authors.author2;
        }

        // Sort message by time and increment counters
        this.incrementCounter(auth.messagesByHour, msg.date.getHours());
        this.incrementCounter(auth.messagesByDaysOfWeek, msg.date.getDay());
        this.incrementCounter(
          auth.messagesByDate,
          msg.date.toLocaleDateString()
        );

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
        } else if (
          message.includes("https://") ||
          message.includes("http://")
        ) {
          // is a link
          auth.totalMedia++;
          auth.links++;
        } else {
          // text message
          auth.textMessages++;

          // extract words
          let words = message.match(this.regexWords);
          if (words) {
            if (this.removeStopwords) {
              words = sw.removeStopwords(words, this.language);
            }

            for (let word of words) {
              this.incrementCounter(auth.words, word);
            }

            auth.totalWords += words.length;
          }

          // detect & process emojis
          let emojis = message.match(this.regexEmojis);
          if (emojis) {
            for (let emoji of emojis) {
              this.incrementCounter(auth.emojis, emoji);
            }
            auth.totalEmojis += emojis.length;
          }
        }
      }

      this.generateFinalStats(this.authors.author1);
      this.generateFinalStats(this.authors.author2);
      this.generateCombinedStats();

      resolve(this.authors);
    });
  }

  parseChats(data) {
    return new Promise((resolve, reject) => {
      whatsapp.parseString(data).then(
        (messages) => {
          this.generateStats(messages).then(
            (authors) => {
              resolve(authors);
            },
            (err) => {
              console.error(
                `Error while generating stats: (${err.name}: ${err.message})`
              );
              reject(
                new Error(
                  "An error occured while generating statistics. Please make sure that the file you have uploaded is correct."
                )
              );
            }
          );
        },
        (err) => {
          console.error(
            `Error while parsing chats: (${err.name}: ${err.message})`
          );
          reject(
            new Error(
              // eslint-disable-next-line no-multi-str
              "Coulnd't parse the file. Please make sure that you have selected correct file. If you're positive that the file is correct, chances\
              are the format of your file isn't supported yet."
            )
          );
        }
      );
    });
  }

  run(data, rmStopwords, lang) {
    this.removeStopwords = rmStopwords;
    this.language = lang;
    return this.parseChats(data);
  }
}

export default statsCalculator;
