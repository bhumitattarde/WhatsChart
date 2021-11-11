import * as whatsapp from "whatsapp-chat-parser";
import sw from "stopword";
import { sortMap } from "../util";
import Author from "./author";

/**
 * Class responsible for generating metrics/statistics from the chat file
 */
class Statistics {
	constructor() {
		// init member vars
		this.removeStopwords = false;
		this.language = {};
		this.stats = {
			author1: new Author(),
			author2: new Author(),
			combined: {
				wordsSection: "",
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
				periodInDays: 0
			}
		};
		this.messages = [];
		// Matches emojis in a string
		this.regexEmojis = new RegExp(
			"(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])"
		);
		// Matches words (includes `'` but not `.`,`,` etc.)
		this.regexWords = new RegExp(/[^\W_]+(?:['’_-][^\W_]+)*/g);

		// Fill messagesByHour and messagesByDaysOfWeek for consistent plotting
		for (let i = 0; i <= 23; i += 1) {
			this.stats.author1.messagesByHour.set(i, 0);
			this.stats.author2.messagesByHour.set(i, 0);
		}
		for (let i = 0; i < 7; i += 1) {
			this.stats.author1.messagesByDaysOfWeek.set(i, 0);
			this.stats.author2.messagesByDaysOfWeek.set(i, 0);
		}
	}

	/**
	 * Increments count of a key in a map with key:count structure
	 * @param {Map} map Map that has the key
	 * @param {} key key whose count should be incremented
	 */
	static incrementKeyCount(map, key) {
		const freq = map.get(key);
		map.set(key, freq === undefined ? 1 : freq + 1);
	}

	/**
	 * Adds (read: combines) two Maps. If there are duplicate keys, their values are added.
	 * @param {Map} map1 first map
	 * @param {Map} map2 second map
	 * @returns {Map} combined map
	 */
	static addMaps(map1, map2) {
		const newMap = new Map();
		for (const [key, val] of map1) {
			newMap.set(key, val);
		}
		for (const [key, val] of map2) {
			let prevVal = newMap.get(key);
			if (prevVal === undefined) {
				prevVal = 0;
			}
			newMap.set(key, prevVal + val);
		}
		return newMap;
	}

	/**
	 * Get element with highest frequency for a map with key:count structure
	 * @param {Map} map Map whose mode you need
	 * @returns {} element with highest frequency
	 */
	static getModeOfAMap(map) {
		return [...map.entries()].reduce((a, e) => (e[1] > a[1] ? e : a));
	}

	/**
	 * Get element with highest frequency from maps with key:count structure.
	 * Note: This function 'combines' the maps using `addMaps` and then
	 * calculates mode.
	 * @param {Map} map1 Map 1
	 * @param {Map} map2 Map 2
	 * @returns {} mode of the maps provided
	 */
	static getModeOfTwoMaps(map1, map2) {
		return [...Statistics.addMaps(map1, map2).entries()].reduce((a, e) =>
			e[1] > a[1] ? e : a
		);
	}

	/**
	 * Generates statistics of an author
	 * @param {Author} author Auhtor whose stats you need to generate
	 */
	static generateAuthorStats(author) {
		author.words = sortMap(author.words);
		author.emojis = sortMap(author.emojis);
		author.wordsPerMessage = author.totalWords / author.textMessages;
		[author.mostUsedWord] = [...author.words];
		[author.mostUsedEmoji] = [...author.emojis];
	}

	/**
	 * Generates string required for the 'words' section of the chart
	 * @param {Author} author1 Author 1
	 * @param {Author} author2 Author 2
	 * @returns {String} string used in 'words' section
	 */
	static generateWordsSection(author1, author2) {
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

	/**
	 * Detects and sets names of the authors
	 * @param {Array} messages messages
	 */
	setAuthorNames(messages) {
		for (const msg of messages) {
			if (msg.author !== "" && msg.author !== "System") {
				if (!this.stats.author1.name) {
					this.stats.author1.name = msg.author;
					continue;
				}
				if (msg.author !== this.stats.author1.name) {
					this.stats.author2.name = msg.author;
					break;
				}
			}
		}
	}

	/**
	 * Generates combined statistics (combined section of `this.stats`)
	 */
	generateCombinedStats() {
		const { author1 } = this.stats;
		const { author2 } = this.stats;
		const { combined } = this.stats;

		combined.sectionWordsString = Statistics.generateWordsSection(
			author1,
			author2
		);

		combined.messagesByHour = Statistics.addMaps(
			author1.messagesByHour,
			author2.messagesByHour
		);
		combined.messagesByDaysOfWeek = Statistics.addMaps(
			author1.messagesByDaysOfWeek,
			author2.messagesByDaysOfWeek
		);
		combined.messagesByDate = Statistics.addMaps(
			author1.messagesByDate,
			author2.messagesByDate
		);

		combined.mostUsedWord = Statistics.getModeOfTwoMaps(
			author1.words,
			author2.words
		);
		combined.mostUsedEmoji = Statistics.getModeOfTwoMaps(
			author1.emojis,
			author2.emojis
		);
		combined.busiestHour = Statistics.getModeOfAMap(combined.messagesByHour);
		combined.busiestWeekOfDay = Statistics.getModeOfAMap(
			combined.messagesByDaysOfWeek
		);
		combined.busiestDay = Statistics.getModeOfAMap(combined.messagesByDate);

		[[combined.startDate]] = [...combined.messagesByDate];
		[combined.endDate] = [...combined.messagesByDate][
			combined.messagesByDate.size - 1
		];
		combined.periodInDays = combined.messagesByDate.size;
	}

	/**
	 * Genrates both author's as well as combined statistics
	 * @param {Array} messages messages
	 * @returns {Promise}
	 */
	generateAllStats(messages) {
		return new Promise(resolve => {
			this.setAuthorNames(messages);

			for (const message of messages) {
				// get author of the message
				let author = {};
				if (message.author === this.stats.author1.name) {
					author = this.stats.author1;
				} else if (message.author === this.stats.author2.name) {
					author = this.stats.author2;
				}

				// Sort message by time and increment counters
				Statistics.incrementKeyCount(
					author.messagesByHour,
					message.date.getHours()
				);
				Statistics.incrementKeyCount(
					author.messagesByDaysOfWeek,
					message.date.getDay()
				);
				Statistics.incrementKeyCount(
					author.messagesByDate,
					message.date.toLocaleDateString()
				);

				// Convert message to lower-case. We're making a decision that case doesn't matter for analysis.
				const msg = message.message.toLowerCase();

				// determine the type of message and increment counters
				// This can obviously fail if one includes these file extensions manually, but thanks to WhatsApp's
				// big brain decision to use differring formats for media messages, this seems to be the only way.
				author.totalMessages += 1;

				if (msg.includes(".jpg") || msg.includes(".webp")) {
					// is an image
					author.totalMedia += 1;
					author.pictures += 1;
				} else if (msg.includes(".opus")) {
					// is an audio
					author.totalMedia += 1;
					author.audios += 1;
				} else if (msg.includes(".mp4")) {
					// is a video
					author.totalMedia += 1;
					author.videos += 1;
				} else if (msg.includes("https://") || msg.includes("http://")) {
					// is a link
					author.totalMedia += 1;
					author.links += 1;
				} else {
					// text message
					author.textMessages += 1;

					// extract words
					let words = msg.match(this.regexWords);
					if (words) {
						if (this.removeStopwords) {
							words = sw.removeStopwords(words, this.language);
						}
						for (const word of words) {
							Statistics.incrementKeyCount(author.words, word);
						}
						author.totalWords += words.length;
					}

					// detect & process emojis
					const emojis = msg.match(this.regexEmojis);
					if (emojis) {
						for (const emoji of emojis) {
							Statistics.incrementKeyCount(author.emojis, emoji);
						}
						author.totalEmojis += emojis.length;
					}
				}
			}

			Statistics.generateAuthorStats(this.stats.author1);
			Statistics.generateAuthorStats(this.stats.author2);
			this.generateCombinedStats();
			resolve(this.stats);
		});
	}

	/**
	 * Generate statiscs/metrics of a chat
	 * @param {String} data chat file data
	 * @param {Boolean} rmStopwords `true` if stopwords should be removed from
	 * the chat messages
	 * @param {Object} language language of the conversation
	 * @returns {Promise} generated statistics
	 */
	generate(data, rmStopwords, language) {
		return new Promise((resolve, reject) => {
			this.removeStopwords = rmStopwords;
			this.language = language;
			whatsapp
				.parseString(data)
				.then(messages => this.generateAllStats(messages))
				.then(stats => resolve(stats))
				.catch(err => reject(err));
		});
	}
}

export default Statistics;
