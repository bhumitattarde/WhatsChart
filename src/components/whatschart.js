import React from "react";
import PropTypes from "prop-types";

import { Bar, Pie, Doughnut } from "react-chartjs-2";
import { defaults } from "react-chartjs-2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faIcons,
  faImages,
  faFilm,
  faMicrophoneAlt,
  faLink,
} from "@fortawesome/free-solid-svg-icons";
import { faCommentDots } from "@fortawesome/free-regular-svg-icons";

import "./whatschart.css";

class WhatsChart extends React.Component {
  constructor(props) {
    super(props);

    // member variables
    this.days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    this.sectionsWordString = "";

    this.messagesByHour = new Map();
    this.messagesByDaysOfWeek = new Map();
    this.messagesByDate = new Map();

    this.mostUsedWord = {};
    this.mostUsedEmoji = {};
    this.busiestHour = 0;
    this.busiestWeekOfDay = 0;
    this.busiestDay = "";

    this.startDate = "";
    this.endDate = "";
    this.periodInDays = 0;

    // Graph configs
    // graph options. If some graph needs customized options, set them separately
    this.defaultVerticalBarChartOpts = () => {};
    this.defaultHorizontalBarChartOpts = () => {};
    this.defaultPieChartOpts = () => {};

    // data and individual options
    this.dataInDepthSummaryAll = {};
    this.dataInDepthSummaryMedia = {};
    this.dataWordsPerMessage = {};
    this.dataMostUsedWords = () => {};
    this.dataMostUsedEmojis = () => {};
    this.optsMostUsedEmojis = {};
    this.dataMessagesByHour = {};
    this.dataMessagesByDayOfWeek = {};
    this.dataMessagesByDate = {};

    // `this` bindings
    this.getSectionWordsString = this.getWordsSectionString.bind(this);
    this.addMaps = this.addMaps.bind(this);
    this.getWeekDayName = this.getWeekDayName.bind(this);

    //chartjs global config
    defaults.animation.duration = 0;
    defaults.font.family =
      // eslint-disable-next-line no-multi-str
      "'Ubuntu', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto',\
    'Oxygen', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue'";
    defaults.font.weight = "400";
  }

  // methods

  shadeColor(percentage, color) {
    // `percentage` range is -1 to 1 & color is in rgb format eg., ("0.1", "rgb(0,0,255)")
    var i = parseInt,
      r = Math.round,
      [a, b, color, d] = color.split(","),
      P = percentage < 0,
      t = P ? 0 : 255 * percentage,
      P = P ? 1 + percentage : 1 - percentage;
    return (
      "rgb" +
      (d ? "a(" : "(") +
      r(i(a[3] === "a" ? a.slice(5) : a.slice(4)) * P + t) +
      "," +
      r(i(b) * P + t) +
      "," +
      r(i(color) * P + t) +
      (d ? "," + d : ")")
    );
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

  getWeekDayName(day) {
    return this.days[day];
  }

  getWordsSectionString(author1, author2) {
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

  // hooks
  componentWillMount() {
    const author1 = this.props.author1;
    const author2 = this.props.author2;
    const config = this.props.config;

    defaults.color = config.textColor;

    this.sectionWordsString = this.getWordsSectionString(author1, author2);

    this.messagesByHour = this.addMaps(
      author1.messagesByHour,
      author2.messagesByHour
    );
    this.messagesByDaysOfWeek = this.addMaps(
      author1.messagesByDaysOfWeek,
      author2.messagesByDaysOfWeek
    );
    this.messagesByDate = this.addMaps(
      author1.messagesByDate,
      author2.messagesByDate
    );

    this.mostUsedWord = [
      ...this.addMaps(author1.words, author2.words).entries(),
    ].reduce((a, e) => (e[1] > a[1] ? e : a));
    this.mostUsedEmoji = [
      ...this.addMaps(author1.emojis, author2.emojis).entries(),
    ].reduce((a, e) => (e[1] > a[1] ? e : a));
    this.busiestHour = [...this.messagesByHour.entries()].reduce((a, e) =>
      e[1] > a[1] ? e : a
    );
    this.busiestWeekOfDay = [...this.messagesByDaysOfWeek.entries()].reduce(
      (a, e) => (e[1] > a[1] ? e : a)
    );
    this.busiestDay = [...this.messagesByDate.entries()].reduce((a, e) =>
      e[1] > a[1] ? e : a
    );

    this.startDate = [...this.messagesByDate][0][0];
    this.endDate = [...this.messagesByDate][this.messagesByDate.size - 1][0];
    this.periodInDays = this.messagesByDate.size;

    // Graph configs

    // graph options. If some graph needs customized options, set them separately
    this.defaultVerticalBarChartOpts = (title = "") => {
      return {
        scales: {
          x: {
            grid: {
              display: false,
              drawOnChartArea: false,
              drawTicks: false,
              drawBorder: false,
            },
          },
          y: {
            grid: {
              display: false,
              drawOnChartArea: false,
              drawTicks: false,
              drawBorder: false,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            position: "bottom",
            text: title,
          },
        },
      };
    };

    this.defaultHorizontalBarChartOpts = (title = "") => {
      return {
        indexAxis: "y",
        scales: {
          x: {
            grid: {
              display: false,
              drawOnChartArea: false,
              drawTicks: false,
              drawBorder: false,
            },
          },
          y: {
            grid: {
              display: false,
              drawOnChartArea: false,
              drawTicks: false,
              drawBorder: false,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            position: "bottom",
            text: title,
          },
        },
      };
    };

    this.defaultPieChartOpts = (title = "") => {
      return {
        scales: {
          x: {
            display: false,
          },
          y: {
            display: false,
          },
        },
        plugins: {
          title: {
            display: true,
            position: "bottom",
            text: title,
          },
        },
      };
    };

    // data and individual options
    this.dataInDepthSummaryAll = {
      labels: [author1.name, author2.name],
      datasets: [
        {
          label: "Total messages",
          labels: [author1.name, author2.name],
          data: [author1.totalMessages, author2.totalMessages],
          backgroundColor: [
            this.shadeColor("0", config.author1Color),
            this.shadeColor("0", config.author2Color),
          ],
          // "borderWidth": 2,
          borderColor: config.backgroundColor,
        },
        {
          label: "Text messages",
          labels: [author1.name, author2.name],
          data: [author1.textMessages, author2.textMessages],
          backgroundColor: [
            this.shadeColor("0.3", config.author1Color),
            this.shadeColor("0.3", config.author2Color),
          ],
          // "borderWidth": 2,
          borderColor: config.backgroundColor,
        },
        {
          label: "Media",
          labels: [author1.name, author2.name],
          data: [author1.totalMedia, author2.totalMedia],
          backgroundColor: [
            this.shadeColor("0.6", config.author1Color),
            this.shadeColor("0.6", config.author2Color),
          ],
          borderColor: config.backgroundColor,
          // "borderWidth": 2,
        },
      ],
    };

    this.dataInDepthSummaryMedia = {
      labels: [author1.name, author2.name],
      datasets: [
        {
          label: "Pictures",
          data: [author1.pictures, author2.pictures],
          backgroundColor: [
            this.shadeColor("0", config.author1Color),
            this.shadeColor("0", config.author2Color),
          ],
          // borderWidth: 0,
          borderColor: config.backgroundColor,
        },
        {
          label: "Videos",
          data: [author1.videos, author2.videos],
          backgroundColor: [
            this.shadeColor("0.2", config.author1Color),
            this.shadeColor("0.2", config.author2Color),
          ],
          // borderWidth: 0,
          borderColor: config.backgroundColor,
        },
        {
          label: "Audios",
          data: [author1.audios, author2.audios],
          backgroundColor: [
            this.shadeColor("0.4", config.author1Color),
            this.shadeColor("0.4", config.author2Color),
          ],
          // borderWidth: 0,
          borderColor: config.backgroundColor,
        },
        {
          label: "Links",
          data: [author1.links, author2.links],
          backgroundColor: [
            this.shadeColor("0.6", config.author1Color),
            this.shadeColor("0.6", config.author2Color),
          ],
          // borderWidth: 0,
          borderColor: config.backgroundColor,
        },
      ],
    };

    this.dataWordsPerMessage = {
      labels: [author1.name, author2.name],
      datasets: [
        {
          data: [author1.wordsPerMessage, author2.wordsPerMessage],
          backgroundColor: [config.author1Color, config.author2Color],
          borderWidth: 0,
        },
      ],
    };

    this.dataMostUsedWords = (authorNum) => {
      //authorNum is number (either 1 or 2)
      const author = authorNum === 1 ? author1 : author2;

      return {
        labels: Array.from(author.words.keys()).slice(0, 11),
        datasets: [
          {
            label: author.name,
            data: Array.from(author.words.values()).slice(0, 11),
            borderWidth: 0,
            backgroundColor:
              authorNum === 1 ? config.author1Color : config.author2Color,
          },
        ],
      };
    };

    this.dataTotalEmojis = {
      labels: [author1.name, author2.name],
      datasets: [
        {
          data: [author1.totalEmojis, author2.totalEmojis],
          backgroundColor: [config.author1Color, config.author2Color],
          borderWidth: 0,
        },
      ],
    };

    this.dataMostUsedEmojis = (authorNum) => {
      //authorNum is number (either 1 or 2)
      const author = authorNum === 1 ? author1 : author2;

      return {
        labels: Array.from(author.emojis.keys()).slice(0, 6),
        datasets: [
          {
            label: author.name,
            data: Array.from(author.emojis.values()).slice(0, 6),
            borderWidth: 0,
            backgroundColor:
              authorNum === 1 ? config.author1Color : config.author2Color,
          },
        ],
      };
    };

    this.optsMostUsedEmojis = {
      indexAxis: "y",
      scales: {
        x: {
          grid: {
            display: false,
            drawOnChartArea: false,
            drawTicks: false,
            drawBorder: false,
          },
        },
        y: {
          grid: {
            display: false,
            drawOnChartArea: false,
            drawTicks: false,
            drawBorder: false,
          },
          ticks: {
            font: {
              size: 20,
            },
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          position: "bottom",
          text: "",
        },
      },
    };

    this.dataMessagesByHour = {
      labels: [...this.messagesByHour.keys()],
      datasets: [
        {
          label: "Messages",
          data: [...this.messagesByHour.values()],
          borderWidth: 0,
          backgroundColor: config.chartColor,
        },
      ],
    };

    this.dataMessagesByDayOfWeek = {
      labels: [...this.messagesByDaysOfWeek.keys()].map((val) =>
        this.getWeekDayName(val)
      ),
      datasets: [
        // {
        //   type: "line",
        //   label: author1.name,
        //   data: [...author1.messagesByDaysOfWeek.values()],
        //   borderWidth: 1.5,
        //   pointRadius: 0,
        //   borderColor: config.author1Color,
        // },
        // {
        //   type: "line",
        //   label: author2.name,
        //   data: [...author2.messagesByDaysOfWeek.values()],
        //   borderWidth: 1.5,
        //   pointRadius: 0,
        //   borderColor: config.author2Color,
        // },
        {
          label: "Messages",
          data: [...this.messagesByDaysOfWeek.values()],
          borderWidth: 0,
          backgroundColor: config.chartColor,
        },
      ],
    };

    this.dataMessagesByDate = {
      labels: [...this.messagesByDate.keys()],
      datasets: [
        // {
        //   type: "line",
        //   label: author1.name,
        //   data: [...author1.messagesByDate.values()],
        //   borderWidth: 1,
        //   pointRadius: 0,
        //   borderColor: config.author1Color,
        // },
        // {
        //   type: "line",
        //   label: author2.name,
        //   data: [...author2.messagesByDate.values()],
        //   borderWidth: 1,
        //   pointRadius: 0,
        //   borderColor: config.author2Color,
        // },
        {
          label: "Messages",
          data: [...this.messagesByDate.values()],
          borderWidth: 0,
          backgroundColor: config.chartColor,
        },
      ],
    };
  }

  componentDidMount() {
    const config = this.props.config;

    document
      .getElementById("chart")
      .style.setProperty("--backgroundColor", config.backgroundColor);
    document
      .getElementById("chart")
      .style.setProperty("--textColor", config.textColor);
    document
      .getElementById("chart")
      .style.setProperty("--iconColor", config.iconColor);
  }

  render() {
    // frequently used vars
    const author1 = this.props.author1;
    const author2 = this.props.author2;
    const author1Name = this.props.author1.name;
    const author2Name = this.props.author2.name;

    return (
      <div id="chart">
        <p id="madeWithTag">Made using whatschart.bhumit.net</p>
        <header>
          <h1>{this.periodInDays} days of WhatsApp texting</h1>
          <h2>
            between {author1Name} &amp; {author2Name}
          </h2>
        </header>

        {/* summary section */}
        <section className="chartSection">
          <h3 className="sectionHeading">
            {author1Name} &amp; {author2Name} exchanged
          </h3>

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

          <h4 className="sectionDescription">
            which amounts to {author1.totalMessages + author2.totalMessages}{" "}
            messages in total!
          </h4>
        </section>

        {/* in depth summary section */}
        <section className="chartSection">
          <h3 className="sectionHeading">
            Of which, {author1.totalMessages} or{" "}
            {(
              (author1.totalMessages /
                (author1.totalMessages + author2.totalMessages)) *
              100
            ).toPrecision(4)}
            % were sent by {author1Name} &amp; {author2.totalMessages} or{" "}
            {(
              (author2.totalMessages /
                (author1.totalMessages + author2.totalMessages)) *
              100
            ).toPrecision(4)}
            % by {author2Name}.
          </h3>
          <div className="chartsHorizontal">
            <div>
              <Pie
                id="chartInDepthSummaryAll"
                data={this.dataInDepthSummaryAll}
                height={300}
                width={300}
                options={this.defaultPieChartOpts([
                  "Total messages (outer circle), texts",
                  "(middle circle) & media (inner circle)",
                ])}
              />
            </div>
            <div>
              <Bar
                id="chartInDepthSummaryMedia"
                data={this.dataInDepthSummaryMedia}
                height={300}
                width={300}
                options={this.defaultVerticalBarChartOpts([
                  "Distribution of media (Pictures -",
                  "Videos - Audios - Links)",
                ])}
              />
            </div>
          </div>
        </section>

        {/* words section */}
        <section className="chartSection">
          <h3 className="sectionHeading">{this.sectionWordsString}</h3>
          <div>
            <Bar
              id="chartWordsPerMessage"
              data={this.dataWordsPerMessage}
              height={120}
              options={this.defaultHorizontalBarChartOpts("Words per message")}
            />
          </div>
          <h4 className="sectionDescription">
            '{this.mostUsedWord[0]}' was the most used word, making appearance{" "}
            {this.mostUsedWord[1]} times!
          </h4>
          <h3 className="sectionHeadingII">
            {author1Name}'s favourite word was '{author1.mostUsedWord[0]}',
            while that of {author2Name} was '{author2.mostUsedWord[0]}'.
          </h3>
          <div className="chartsHorizontal">
            <div>
              <Bar
                id="chartMostUsedWordsAuthor1"
                data={this.dataMostUsedWords(1)}
                height={300}
                options={this.defaultHorizontalBarChartOpts()}
              />
            </div>
            <div>
              <Bar
                id="chartMostUsedWordsAuthor2"
                data={this.dataMostUsedWords(2)}
                height={300}
                options={this.defaultHorizontalBarChartOpts()}
              />
            </div>
          </div>
        </section>

        {/* emojis section */}
        {author1.totalEmojis + author2.totalEmojis > 0 ? (
          <section className="chartSection" id="sectionEmojis">
            <h3 className="sectionHeading">
              But words isn't the only way of expressing themselves for{" "}
              {author1Name} &amp; {author2Name}!
            </h3>
            <h4 className="sectionDescription">
              {author1Name} &amp; {author2Name} sent a total of{" "}
              {author1.totalEmojis + author2.totalEmojis} emojis with{" "}
              {author1Name} sending {author1.totalEmojis} &amp; {author2Name}{" "}
              sending {author2.totalEmojis}.
            </h4>
            <div>
              <Doughnut
                id="chartTotalEmojis"
                data={this.dataTotalEmojis}
                height={300}
                width={300}
                options={this.defaultPieChartOpts("Emojis sent")}
              />
            </div>
            <h4 className="sectionDescription">
              '{this.mostUsedEmoji[0]}' was overall the most used emoji
              appearing {this.mostUsedEmoji[1]} times!
            </h4>
            <h3 className="sectionHeadingII">
              {author1Name}'s favourite emoji was '{author1.mostUsedEmoji[0]}'
              while that of {author2Name} was '{author2.mostUsedEmoji[0]}'
            </h3>
            <div className="chartsHorizontal">
              <div>
                <Bar
                  id="chartMostUsedEmojisAuthor1"
                  data={this.dataMostUsedEmojis(1)}
                  height={300}
                  options={this.optsMostUsedEmojis}
                />
              </div>
              <div>
                <Bar
                  id="chartMostUsedEmojisAuthor2"
                  data={this.dataMostUsedEmojis(2)}
                  height={300}
                  options={this.optsMostUsedEmojis}
                />
              </div>
            </div>
          </section>
        ) : null}

        {/* Timing section */}
        <section className="chartSection" id="sectionTiming">
          <h3 className="sectionHeading">
            When do {author1Name} &amp; {author2Name} chat?
          </h3>
          <h4 className="sectionDescription">
            {this.busiestHour[0]}:00 is the busiest hour with about{" "}
            {this.busiestHour[1]} messages.
          </h4>
          <div>
            <Bar
              id="chartMessagesByHour"
              data={this.dataMessagesByHour}
              height={300}
              width={600}
              options={this.defaultVerticalBarChartOpts(
                "Messages by hour of the day"
              )}
            />
          </div>

          <h4 className="sectionDescription">
            {author1Name} &amp; {author2Name} send about{" "}
            {(
              (author1.totalMessages + author2.totalMessages) /
              this.periodInDays
            ).toPrecision(4)}{" "}
            messages every day &amp;{" "}
            {this.getWeekDayName(this.busiestWeekOfDay[0])}s are the busiest!
          </h4>
          <div>
            <Bar
              id="chartMessagesByDayOfWeek"
              data={this.dataMessagesByDayOfWeek}
              height={300}
              width={600}
              options={this.defaultVerticalBarChartOpts(
                "Messages by day of the week"
              )}
            />
          </div>

          <h4 className="sectionDescription">
            {this.busiestDay[0]} was the busiest day with {this.busiestDay[1]}{" "}
            messages! That's about {(this.busiestDay[1] / 24).toPrecision(4)}
            messages every hour.
          </h4>
          <div>
            <Bar
              id="chartMessagesByDate"
              data={this.dataMessagesByDate}
              height={300}
              width={600}
              options={this.defaultVerticalBarChartOpts("Messages by date")}
            />
          </div>
        </section>
      </div>
    );
  }
}

WhatsChart.propTypes = {
  author1: PropTypes.object.isRequired,
  author2: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
};

WhatsChart.defaultProps = {
  author1: {},
  author2: {},
  config: {},
};

export default WhatsChart;
