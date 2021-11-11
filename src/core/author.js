export default class Author {
	constructor() {
		this.name = "";
		this.totalMessages = 0;
		this.textMessages = 0;
		this.totalWords = 0;
		this.totalEmojis = 0;
		this.totalMedia = 0;
		this.pictures = 0;
		this.videos = 0;
		this.audios = 0;
		this.links = 0;

		this.words = new Map();
		this.emojis = new Map();

		this.messagesByHour = new Map();
		this.messagesByDaysOfWeek = new Map();
		this.messagesByDate = new Map();

		this.wordsPerMessage = 0;
		this.mostUsedWord = "";
		this.mostUsedEmoji = "";
	}
}
