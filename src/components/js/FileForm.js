import React from "react";
import PropTypes from "prop-types";

import { toPng } from "html-to-image";
import download from "downloadjs";

import Statistics from "../../core/statistics";
import { supportedLangs, langExtensions } from "../../util";
import ProgressIndicator from "./ProgressIndicator";
import DownloadAndSeeChart from "./DownloadAndSeeChart";

import "../css/FileForm.css";

class FileForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			// represents progress status shown under generate button
			progress: "",
			err: false
		};

		// member vars
		this.defaultForm = {
			colors: {
				author1Color: "#00C9B1",
				author2Color: "#005D6C",
				backgroundColor: "#000839",
				textColor: "#FFFFFF",
				iconColor: "#FFA41B",
				graphColor: "#FFA41B"
			}
		};
		// `this` bindings
		this.generate = this.generate.bind(this);
		this.handleFormSubmission = this.handleFormSubmission.bind(this);
		this.updateProgress = this.updateProgress.bind(this);
	}

	/**
	 * Toggles language dropdown menu based on 'remove stopwords?' checkbox
	 */
	static toggleLangDropdown() {
		if (document.getElementById("rmStopwords").checked) {
			document.getElementById("langDropdown").disabled = false;
		} else {
			document.getElementById("langDropdown").disabled = true;
		}
	}

	/**
	 * Converts hex color code to RGB color code
	 * @param {String} hex Hex code of the color
	 * @returns {String} RGB color code of the color
	 */
	static convertToRGB(hex) {
		return `rgb(${hex
			.match(/[A-Za-z0-9]{2}/g)
			.map(v => parseInt(v, 16))
			.join(",")})`;
	}

	/**
	 * Read a file into a string
	 * @param {Object} file file
	 * @returns {Promise} contents of the file into a string
	 */
	static readFile(file) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();

			reader.onload = event => {
				const data = event.target.result;
				if (data && data !== "") {
					resolve(data);
				}
			};
			reader.onerror = () => {
				reject(
					new Error(
						`An error (${reader.error}) occurred while while trying to read the selected file. Make sure you have\
            selected the correct file.`
					)
				);
			};

			reader.readAsText(file);
		});
	}

	/**
	 * Gets user input values from the form
	 * @returns {Object} object with file, config, rmStopwords, language
	 * properties
	 */
	static getInputs() {
		const file = document.getElementById("fileSelector").files[0];
		const config = {
			author1Color: FileForm.convertToRGB(
				document.getElementById("author1ColorPicker").value
			),
			author2Color: FileForm.convertToRGB(
				document.getElementById("author2ColorPicker").value
			),
			backgroundColor: FileForm.convertToRGB(
				document.getElementById("bgColorPicker").value
			),
			textColor: FileForm.convertToRGB(
				document.getElementById("textColorPicker").value
			),
			iconColor: FileForm.convertToRGB(
				document.getElementById("iconColorPicker").value
			),
			graphColor: FileForm.convertToRGB(
				document.getElementById("graphColorPicker").value
			)
		};
		const rmStopwords = document.getElementById("rmStopwords").checked;
		const language = supportedLangs.get(
			document.getElementById("langDropdown").value
		);

		return { file, config, rmStopwords, language };
	}

	/**
	 * Downloads the chart to user's local machine
	 */
	static handleDownload() {
		toPng(document.getElementById("chart")).then(dataURL => {
			download(dataURL, "whatschart.png");
		});
	}

	/**
	 * Updates progress bar
	 * @param {String} progress progres/update to show
	 * @param {Boolean} err error status
	 */
	updateProgress(progress, err = false) {
		this.setState(() => ({
			progress,
			err
		}));
	}

	/**
	 * Generate WhatsChart
	 * @param {String} data chat file data
	 * @param {Boolean} rmStopwords `true` if stopwords should be removed
	 * @param {Object} lang stopword language object (if rmStopwords `true`)
	 * @param {Object} config configuration chosen by the user
	 * @returns
	 */
	generate(data, rmStopwords, lang, config) {
		return new Promise((resolve, reject) => {
			new Statistics()
				.generate(data, rmStopwords, lang)
				.then(stats => {
					if (stats === undefined) {
						reject(new Error("Received empty data from generator"));
					}
					this.props.submitCallback(stats, config);
					resolve();
				})
				.catch(err => reject(err));
		});
	}

	/**
	 * Callback to handle form submission.
	 * Called when user clicks on the 'generate' button
	 * @param {Object} event click/other page event
	 * @returns {Boolean} success status
	 */
	async handleFormSubmission(event) {
		let success = false;
		this.props.showChart(false);
		this.updateProgress("Trying to access the file..");
		// don't referesh page when form is submitted
		event.preventDefault();

		// get inputs
		const { file, config, rmStopwords, language } = FileForm.getInputs();
		if (file === undefined || !file.name.endsWith(".txt")) {
			this.updateProgress("Please select a valid file.", true);
			success = false;
		} else {
			// read and process the file
			this.updateProgress("Trying to read the file..");
			try {
				const data = await FileForm.readFile(file);
				this.updateProgress("Generating the visualization..");
				await this.generate(data, rmStopwords, language, config);
				this.updateProgress("Your visualization is ready!");
				success = true;
			} catch (err) {
				console.error(err.message);
				this.updateProgress(
					"An error occured..\nPlease check the console for more details and consider reporting the issue.",
					true
				);
				success = false;
			}
		}

		return success;
	}

	render() {
		return (
			<form
				id="fileForm"
				className="page"
				action=""
				onSubmit={this.handleFormSubmission}>
				<h2>Select your file &amp; configuration</h2>
				<div className="fileSelectorWrapper">
					<label htmlFor="fileSelector">Select the chat file</label>
					<input id="fileSelector" name="file" type="file" accept=".txt" />
				</div>

				<section className="fileFormOptions">
					<div className="rmStopwordsWrapper">
						<div>
							<label htmlFor="rmStopwords">
								Remove{" "}
								<a href="https://en.wikipedia.org/wiki/Stop_word">stopwords</a>?
							</label>
							<input
								id="rmStopwords"
								type="checkbox"
								name="rmStopwords"
								value="rmStopwords"
								onChange={FileForm.toggleLangDropdown}
								defaultChecked></input>
						</div>

						<div>
							<label htmlFor="langDropdown">
								Select the language of conversation
							</label>
							<select id="langDropdown" name="lang" defaultValue="en">
								{[...supportedLangs.keys()].map((key, idx) => (
									<option value={key} key={idx}>
										{langExtensions.get(key)}
									</option>
								))}
							</select>
						</div>
					</div>

					<div className="colorOptionsWrapper">
						<div>
							<input
								id="author1ColorPicker"
								type="color"
								defaultValue={this.defaultForm.colors.author1Color}></input>
							<label htmlFor="author1ColorPicker">First author color</label>
						</div>

						<div>
							<input
								id="author2ColorPicker"
								type="color"
								defaultValue={this.defaultForm.colors.author2Color}></input>
							<label htmlFor="author2ColorPicker">Second author color</label>
						</div>

						<div>
							<input
								id="bgColorPicker"
								type="color"
								defaultValue={this.defaultForm.colors.backgroundColor}></input>
							<label htmlFor="bgColorPicker">Background color</label>
						</div>

						<div>
							<input
								id="textColorPicker"
								type="color"
								defaultValue={this.defaultForm.colors.textColor}></input>
							<label htmlFor="textColorPicker">Text color</label>
						</div>

						<div>
							<input
								id="iconColorPicker"
								type="color"
								defaultValue={this.defaultForm.colors.iconColor}></input>
							<label htmlFor="iconColorPicker">Icons color</label>
						</div>

						<div>
							<input
								id="graphColorPicker"
								type="color"
								defaultValue={this.defaultForm.colors.graphColor}></input>
							<label htmlFor="graphColorPicker">Graphs color</label>
						</div>
					</div>
				</section>

				<input
					id="buttonGenerate"
					className="button altColorButton"
					type="submit"
					value="Generate"
				/>

				<ProgressIndicator
					progress={this.state.progress}
					isError={this.state.err}
				/>

				{this.props.chartVisible && (
					<DownloadAndSeeChart handleDownload={FileForm.handleDownload} />
				)}
			</form>
		);
	}
}

FileForm.propTypes = {
	submitCallback: PropTypes.func.isRequired,
	showChart: PropTypes.func.isRequired,
	chartVisible: PropTypes.bool.isRequired
};

FileForm.defaultProps = {
	submitCallback: () => {},
	showChart: () => {},
	chartVisible: false
};

export default FileForm;
