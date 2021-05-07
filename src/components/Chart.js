import React from "react"
import PropTypes from "prop-types"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIcons, faImages, faFilm, faMicrophoneAlt, faLink, faPhotoVideo } from "@fortawesome/free-solid-svg-icons"
import { faCommentDots } from "@fortawesome/free-regular-svg-icons"

import "./Chart.css"
const util = require("../util/util.js");

//FIXME add support for when media isn't included. Can be detected by checking if values of images, videos etc are 0 for both authors

class Chart extends React.Component {

    // eslint-disable-next-line no-useless-constructor
    constructor(props) {
        super(props);

        // member variables
        this.sectionsWordString = "";
        this.totalWordsCombined = null;
        this.mostUsedWord = [];

        // `this` bindings
        this.getSectionWordsString = this.getSectionWordsString.bind(this);
        this.addMaps = this.addMaps.bind(this);
    }

    addMaps(map1, map2) {

        // Adds two Maps. If there are duplicate keys, their values are added
        const newMap = new Map();

        for (let [key, val] of map1) {
            newMap.set(key, val);
        };
        for (let [key, val] of map2) {
            let prevVal = newMap.get(key);
            if (prevVal === undefined) {
                prevVal = 0;
            };

            newMap.set(key, prevVal + val);
        };

        return newMap;
    };

    getSectionWordsString(author1, author2) {

        let wordsSectionString = "";
        if (author1.textMessages === author2.textMessages) {
            if (author1.wordsPerMessage === author2.wordsPerMessage) {
                wordsSectionString = `${author1.name} &amp; ${author2.name} have sent each other equal number of\
                texts! But that's not all, their messages, on average, have been of the same length as well!`
            } else {
                wordsSectionString = `${author1.name} &amp; ${author2.name} have sent each other equal number of\
                texts! But ${(author1.wordsPerMessage > author2.wordsPerMessage) ? author1.name : author2.name} 's texts were longer`
            };
        } else if (author1.textMessages > author2.textMessages) {
            if (author1.wordsPerMessage === author2.wordsPerMessage) {
                wordsSectionString = `${author1.name} sends more texts, and their texts are of the same length\
                as ${author2.name}`
            } else if (author1.wordsPerMessage > author2.wordsPerMessage) {
                wordsSectionString = `${author1.name} not only sends more texts, but their texts also tend to be longer!`;
            } else if (author2.wordsPerMessage > author1.wordsPerMessage) {
                wordsSectionString = `While ${author1.name} sends more texts, their texts tend to be shorter`;
            }
        } else if (author2.textMessages > author1.textMessages) {
            if (author1.wordsPerMessage === author2.wordsPerMessage) {
                wordsSectionString = `${author2.name} sends more texts, and their texts are of the same length\
                as ${author2.name}`
            } else if (author2.wordsPerMessage > author1.wordsPerMessage) {
                wordsSectionString = `${author2.name} not only sends more texts, but their texts also tend to be longer!`;
            } else if (author1.wordsPerMessage > author2.wordsPerMessage) {
                wordsSectionString = `While ${author2.name} sends more texts, their texts tend to be shorter`;
            }
        };

        return wordsSectionString;
    };

    componentWillMount() {

        this.sectionWordsString = this.getSectionWordsString(this.props.author1, this.props.author2);
        this.totalWordsCombined = util.sortMap(this.addMaps(this.props.author1.words, this.props.author2.words));
        this.mostUsedWord = [...this.totalWordsCombined][0];
    }

    render() {

        // frequently used vars
        const author1 = this.props.author1;
        const author2 = this.props.author2;
        const author1Name = this.props.author1.name;
        const author2Name = this.props.author2.name;

        // other vars that require calculation

        return (
            <div id="chart">

                <header>
                    <h1>{author1.periodInDays} days of WhatsApp texting</h1>
                    <h2>between {author1Name} &amp; {author2Name} in numbers</h2>
                </header>

                {/* summary section */}
                <section className="chartSection">
                    <h3>{author1Name} &amp; {author2Name} exchanged</h3>

                    <section id="summaries">
                        <div className="summaryBox">
                            <div className="iconWrapper">
                                <FontAwesomeIcon icon={faCommentDots} fixedWidth />
                            </div>
                            <p>{author1.textMessages + author2.textMessages}</p>
                            <p>text messages</p>
                        </div>

                        <div className="summaryBox">
                            <div className="iconWrapper">
                                <FontAwesomeIcon icon={faIcons} fixedWidth />
                            </div>
                            <p>{author1.totalEmojis + author2.totalEmojis}</p>
                            <p>emojis</p>
                        </div>

                        <div className="summaryBox">
                            <div className="iconWrapper">
                                <FontAwesomeIcon icon={faImages} fixedWidth />
                            </div>
                            <p>{author1.pictures + author2.pictures}</p>
                            <p>pictures</p>
                        </div>

                        <div className="summaryBox">
                            <div className="iconWrapper">
                                <FontAwesomeIcon icon={faFilm} fixedWidth />
                            </div>
                            <p>{author1.videos + author2.videos}</p>
                            <p>videos</p>
                        </div>

                        <div className="summaryBox">
                            <div className="iconWrapper">
                                <FontAwesomeIcon icon={faMicrophoneAlt} fixedWidth />
                            </div>
                            <p>{author1.audios + author2.audios}</p>
                            <p>audios</p>
                        </div>

                        <div className="summaryBox">
                            <div className="iconWrapper">
                                <FontAwesomeIcon icon={faLink} fixedWidth />
                            </div>
                            <p>{author1.links + author2.links}</p>
                            <p>links</p>
                        </div>
                    </section>

                    <h3>which amounts to {author1.totalMessages + author2.totalMessages} messages in total!</h3>
                </section>

                {/* in depth summary section */}
                <section className="chartSection">
                    <h3>of which, {author1.totalMessages} or {(author1.totalMessages / (author1.totalMessages + author2.totalMessages) * 100).toPrecision(4)}%
                    were sent by {author1Name} &amp; {author2.totalMessages} or {(author2.totalMessages / (author1.totalMessages + author2.totalMessages) * 100).toPrecision(4)}%
                    by {author2Name}</h3>
                    {/*TODO chart of number of messages, prolly multi series pie */}
                </section>

                {/* words section */}
                <section className="chartSection">
                    <h3>{this.sectionWordsString}</h3>
                    {/*TODO words per message graph */}
                    <h3>{this.mostUsedWord[0]} was the most used word, making appearance {this.mostUsedWord[1]} times!</h3>
                    {/*TODO wordcloud */}
                    <h3>{author1Name}'s favourite word was {author1.mostUsedWord[0]}, while that of {author2Name} was {author2.mostUsedWord[0]}</h3>
                    {/*TODO most used words chart  */}
                </section>

            </div>
        );
    }
}

Chart.propTypes = {

    author1: PropTypes.object.isRequired,
    author2: PropTypes.object.isRequired,
}

Chart.defaultProps = {
    author1: {},
    author2: {},
}

export default Chart;