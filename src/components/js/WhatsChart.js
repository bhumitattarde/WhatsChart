import React from "react";
import PropTypes from "prop-types";

import { Bar, Pie, Doughnut, defaults } from "react-chartjs-2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faIcons,
	faImages,
	faFilm,
	faMicrophoneAlt,
	faLink
} from "@fortawesome/free-solid-svg-icons";
import { faCommentDots } from "@fortawesome/free-regular-svg-icons";

import "../css/WhatsChart.css";

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
			"Saturday"
		];

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
		this.getWeekDayName = this.getWeekDayName.bind(this);

		// chartjs global config
		defaults.animation.duration = 0;
		defaults.font.family = "'Poppins', 'sans-serif'";
		defaults.font.weight = "400";
	}

	// methods
	static shadeColor(percentage, Color) {
		// `percentage` range is -1 to 1 & color is in rgb format eg., ("0.1", "rgb(0,0,255)")
		const i = parseInt;
		const r = Math.round;
		const [a, b, color, d] = Color.split(",");
		let P = percentage < 0;
		const t = P ? 0 : 255 * percentage;
		P = P ? 1 + percentage : 1 - percentage;
		return (
			// eslint-disable-next-line prefer-template
			"rgb" +
			(d ? "a(" : "(") +
			r(i(a[3] === "a" ? a.slice(5) : a.slice(4)) * P + t) +
			"," +
			r(i(b) * P + t) +
			"," +
			r(i(color) * P + t) +
			// eslint-disable-next-line prefer-template
			(d ? "," + d : ")")
		);
	}

	getWeekDayName(day) {
		return this.days[day];
	}

	// hooks
	componentWillMount() {
		const { author1, author2, combined, config } = this.props;

		defaults.color = config.textColor;
		if (document.body.clientWidth < 480) {
			defaults.font.size = 10;
		} else {
			defaults.font.size = 12;
		}

		// Graph configs
		// graph options. If some graph needs customized options, set them separately
		this.defaultVerticalBarChartOpts = (title = "") => ({
			maintainAspectRatio: false,
			scales: {
				x: {
					grid: {
						display: false,
						drawOnChartArea: false,
						drawTicks: false,
						drawBorder: false
					}
				},
				y: {
					grid: {
						display: false,
						drawOnChartArea: false,
						drawTicks: false,
						drawBorder: false
					}
				}
			},
			plugins: {
				legend: {
					display: false
				},
				title: {
					display: true,
					position: "bottom",
					text: title
				}
			}
		});

		this.defaultHorizontalBarChartOpts = (title = "") => ({
			maintainAspectRatio: false,
			indexAxis: "y",
			scales: {
				x: {
					grid: {
						display: false,
						drawOnChartArea: false,
						drawTicks: false,
						drawBorder: false
					}
				},
				y: {
					grid: {
						display: false,
						drawOnChartArea: false,
						drawTicks: false,
						drawBorder: false
					}
				}
			},
			plugins: {
				legend: {
					display: false
				},
				title: {
					display: true,
					position: "bottom",
					text: title
				}
			}
		});

		this.defaultPieChartOpts = (title = "") => ({
			scales: {
				x: {
					display: false
				},
				y: {
					display: false
				}
			},
			plugins: {
				title: {
					display: true,
					position: "bottom",
					text: title
				}
			}
		});

		// data and individual options
		this.dataInDepthSummaryAll = {
			labels: [author1.name, author2.name],
			datasets: [
				{
					label: "Total messages",
					labels: [author1.name, author2.name],
					data: [author1.totalMessages, author2.totalMessages],
					backgroundColor: [
						WhatsChart.shadeColor("0", config.author1Color),
						WhatsChart.shadeColor("0", config.author2Color)
					],
					borderColor: config.backgroundColor
				},
				{
					label: "Text messages",
					labels: [author1.name, author2.name],
					data: [author1.textMessages, author2.textMessages],
					backgroundColor: [
						WhatsChart.shadeColor("0.3", config.author1Color),
						WhatsChart.shadeColor("0.3", config.author2Color)
					],
					borderColor: config.backgroundColor
				},
				{
					label: "Media",
					labels: [author1.name, author2.name],
					data: [author1.totalMedia, author2.totalMedia],
					backgroundColor: [
						WhatsChart.shadeColor("0.6", config.author1Color),
						WhatsChart.shadeColor("0.6", config.author2Color)
					],
					borderColor: config.backgroundColor
				}
			]
		};

		this.dataInDepthSummaryMedia = {
			labels: [author1.name, author2.name],
			datasets: [
				{
					label: "Pictures",
					data: [author1.pictures, author2.pictures],
					backgroundColor: [
						WhatsChart.shadeColor("0", config.author1Color),
						WhatsChart.shadeColor("0", config.author2Color)
					],
					borderColor: config.backgroundColor
				},
				{
					label: "Videos",
					data: [author1.videos, author2.videos],
					backgroundColor: [
						WhatsChart.shadeColor("0.2", config.author1Color),
						WhatsChart.shadeColor("0.2", config.author2Color)
					],
					borderColor: config.backgroundColor
				},
				{
					label: "Audios",
					data: [author1.audios, author2.audios],
					backgroundColor: [
						WhatsChart.shadeColor("0.4", config.author1Color),
						WhatsChart.shadeColor("0.4", config.author2Color)
					],
					borderColor: config.backgroundColor
				},
				{
					label: "Links",
					data: [author1.links, author2.links],
					backgroundColor: [
						WhatsChart.shadeColor("0.6", config.author1Color),
						WhatsChart.shadeColor("0.6", config.author2Color)
					],
					borderColor: config.backgroundColor
				}
			]
		};

		this.dataWordsPerMessage = {
			labels: [author1.name, author2.name],
			datasets: [
				{
					data: [author1.wordsPerMessage, author2.wordsPerMessage],
					backgroundColor: [config.author1Color, config.author2Color],
					borderWidth: 0
				}
			]
		};

		this.dataMostUsedWords = authorNum => {
			// authorNum is number (either 1 or 2)
			const author = authorNum === 1 ? author1 : author2;

			return {
				labels: Array.from(author.words.keys()).slice(0, 11),
				datasets: [
					{
						label: author.name,
						data: Array.from(author.words.values()).slice(0, 11),
						borderWidth: 0,
						backgroundColor:
							authorNum === 1 ? config.author1Color : config.author2Color
					}
				]
			};
		};

		this.dataTotalEmojis = {
			labels: [author1.name, author2.name],
			datasets: [
				{
					data: [author1.totalEmojis, author2.totalEmojis],
					backgroundColor: [config.author1Color, config.author2Color],
					borderWidth: 0
				}
			]
		};

		this.dataMostUsedEmojis = authorNum => {
			// authorNum is number (either 1 or 2)
			const author = authorNum === 1 ? author1 : author2;

			return {
				labels: Array.from(author.emojis.keys()).slice(0, 6),
				datasets: [
					{
						label: author.name,
						data: Array.from(author.emojis.values()).slice(0, 6),
						borderWidth: 0,
						backgroundColor:
							authorNum === 1 ? config.author1Color : config.author2Color
					}
				]
			};
		};

		this.optsMostUsedEmojis = {
			maintainAspectRatio: false,
			indexAxis: "y",
			scales: {
				x: {
					grid: {
						display: false,
						drawOnChartArea: false,
						drawTicks: false,
						drawBorder: false
					}
				},
				y: {
					grid: {
						display: false,
						drawOnChartArea: false,
						drawTicks: false,
						drawBorder: false
					},
					ticks: {
						font: {
							size: 20
						}
					}
				}
			},
			plugins: {
				legend: {
					display: false
				},
				title: {
					display: true,
					position: "bottom",
					text: ""
				}
			}
		};

		this.dataMessagesByHour = {
			labels: [...combined.messagesByHour.keys()],
			datasets: [
				{
					label: "Messages",
					data: [...combined.messagesByHour.values()],
					borderWidth: 0,
					backgroundColor: config.graphColor
				}
			]
		};

		this.dataMessagesByDayOfWeek = {
			labels: [...combined.messagesByDaysOfWeek.keys()].map(val =>
				this.getWeekDayName(val)
			),
			datasets: [
				{
					label: "Messages",
					data: [...combined.messagesByDaysOfWeek.values()],
					borderWidth: 0,
					backgroundColor: config.graphColor
				}
			]
		};

		this.dataMessagesByDate = {
			labels: [...combined.messagesByDate.keys()],
			datasets: [
				{
					label: "Messages",
					data: [...combined.messagesByDate.values()],
					borderWidth: 0,
					backgroundColor: config.graphColor
				}
			]
		};
	}

	componentDidMount() {
		const { config } = this.props;
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
		const { author1, author2, combined } = this.props;
		const author1Name = this.props.author1.name;
		const author2Name = this.props.author2.name;

		return (
			<div id="chart" className="page">
				<p id="madeWithTag">Made using whatschart.bhumit.net</p>
				<header>
					<h1>{combined.periodInDays} days of WhatsApp texting</h1>
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
					<div id="chartInDepthSummary" className="chartsHorizontal">
						<div>
							<Pie
								id="chartInDepthSummaryAll"
								data={this.dataInDepthSummaryAll}
								height={300}
								width={300}
								options={this.defaultPieChartOpts([
									"Total messages (outer circle), texts",
									"(middle circle) & media (inner circle)"
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
									"Distribution of media",
									"(Pictures - Videos - Audios - Links)"
								])}
							/>
						</div>
					</div>
				</section>

				{/* words section */}
				<section className="chartSection">
					<h3 className="sectionHeading">{combined.sectionWordsString}</h3>
					<div>
						<Bar
							id="chartWordsPerMessage"
							data={this.dataWordsPerMessage}
							height={120}
							options={this.defaultHorizontalBarChartOpts("Words per message")}
						/>
					</div>
					<h4 className="sectionDescription">
						'{combined.mostUsedWord[0]}' was the most used word, making
						appearance {combined.mostUsedWord[1]} times!
					</h4>
					<h3 className="sectionHeadingII">
						{author1Name}'s favourite word was '{author1.mostUsedWord[0]}',
						while that of {author2Name} was '{author2.mostUsedWord[0]}'.
					</h3>
					<div className="chartsHorizontal">
						<div className="dividedHorizontalBarWrapper">
							<Bar
								id="chartMostUsedWordsAuthor1"
								data={this.dataMostUsedWords(1)}
								options={this.defaultHorizontalBarChartOpts()}
							/>
						</div>
						<div className="dividedHorizontalBarWrapper">
							<Bar
								id="chartMostUsedWordsAuthor2"
								data={this.dataMostUsedWords(2)}
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
							'{combined.mostUsedEmoji[0]}' was overall the most used emoji
							appearing {combined.mostUsedEmoji[1]} times!
						</h4>
						<h3 className="sectionHeadingII">
							{author1Name}'s favourite emoji was '{author1.mostUsedEmoji[0]}'
							while that of {author2Name} was '{author2.mostUsedEmoji[0]}'
						</h3>
						<div className="chartsHorizontal">
							<div className="dividedHorizontalBarWrapper">
								<Bar
									id="chartMostUsedEmojisAuthor1"
									data={this.dataMostUsedEmojis(1)}
									// height={300}
									// width={300}
									options={this.optsMostUsedEmojis}
								/>
							</div>
							<div className="dividedHorizontalBarWrapper">
								<Bar
									id="chartMostUsedEmojisAuthor2"
									data={this.dataMostUsedEmojis(2)}
									// height={300}
									// width={300}
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
						{combined.busiestHour[0]}:00 is the busiest hour with about{" "}
						{combined.busiestHour[1]} messages.
					</h4>
					<div className="verticalBarWrapper">
						<Bar
							id="chartMessagesByHour"
							data={this.dataMessagesByHour}
							options={this.defaultVerticalBarChartOpts(
								"Messages by hour of the day"
							)}
						/>
					</div>

					<h4 className="sectionDescription">
						{author1Name} &amp; {author2Name} send about{" "}
						{(
							(author1.totalMessages + author2.totalMessages) /
							combined.periodInDays
						).toPrecision(4)}{" "}
						messages every day &amp;{" "}
						{this.getWeekDayName(combined.busiestWeekOfDay[0])}s are the
						busiest!
					</h4>
					<div className="verticalBarWrapper">
						<Bar
							id="chartMessagesByDayOfWeek"
							data={this.dataMessagesByDayOfWeek}
							options={this.defaultVerticalBarChartOpts(
								"Messages by day of the week"
							)}
						/>
					</div>

					{/* prettier-ignore */}
					<h4 className="sectionDescription">
            {combined.busiestDay[0]} was the busiest day with{" "}
            {combined.busiestDay[1]} messages! That's about{" "}
            {(combined.busiestDay[1] / 24).toPrecision(4)} messages every hour.
          </h4>
					<div className="verticalBarWrapper">
						<Bar
							id="chartMessagesByDate"
							data={this.dataMessagesByDate}
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
	combined: PropTypes.object.isRequired,
	config: PropTypes.object.isRequired
};

WhatsChart.defaultProps = {
	author1: {},
	author2: {},
	combined: {},
	config: {}
};

export default WhatsChart;
