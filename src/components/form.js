import React from "react";
import PropTypes from "prop-types";

import { toPng } from "html-to-image";
import download from "downloadjs";

import statsCalculator from "../core/statscalculator";
import { supportedLangs } from "../util/util.js";
import ProgressIndicator from "./progressindicator.js";
import DownloadAndSeeChart from "./downloadandseechart.js";

import "./form.css";

class FileForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: "",
    };

    // member vars
    this.defaultForm = {
      colors: {
        author1Color: "#ea0131",
        author2Color: "#01be95",
        backgroundColor: "#2a2b46",
        textColor: "#FFFFFF",
        iconColor: "#444ca6",
        graphColor: "#f21170",
      },
    };
    this.langExtensions = new Map([
      ["af", "Afrikaans"],
      ["ar", "Arabic, Modern Standard"],
      ["hy", "Armenian"],
      ["eu", "Basque"],
      ["bn", "Bengali"],
      ["br", "Breton"],
      ["bg", "Bulgarian"],
      ["ca", "Catalan"],
      ["zh", "Chinese Simplified"],
      ["hr", "Croatian"],
      ["cs", "Czech"],
      ["da", "Danish"],
      ["nl", "Dutch"],
      ["en", "English"],
      ["eo", "Esperanto"],
      ["et", "Estonian"],
      ["fa", "Farsi"],
      ["fi", "Finnish"],
      ["fr", "French"],
      ["gl", "Galician"],
      ["de", "German"],
      ["el", "Greek"],
      ["ha", "Hausa"],
      ["he", "Hebrew"],
      ["hi", "Hindi"],
      ["hu", "Hungarian"],
      ["id", "Indonesian"],
      ["ga", "Irish"],
      ["it", "Italian"],
      ["ja", "Japanese"],
      ["ko", "Korean"],
      ["la", "Latin"],
      ["lv", "Latvian"],
      ["lgg", "Lugbara (without diacrit]ics)"],
      ["lggo", "Lugbara official (with d]iacritics)"],
      ["mr", "Marathi"],
      ["no", "Norwegian"],
      ["pl", "Polish"],
      ["pt", "Portuguese"],
      ["ptbr", "Portuguese (Brazilian)"],
      ["pa", "Punjabi Gurmukhi"],
      ["ro", "Romanian"],
      ["ru", "Russian"],
      ["sk", "Slovak"],
      ["sl", "Slovenian"],
      ["so", "Somali"],
      ["st", "Sotho"],
      ["es", "Spanish"],
      ["sw", "Swahili"],
      ["sv", "Swedish"],
      ["th", "Thai"],
      ["tr", "Turkish"],
      ["vi", "Vietnamese"],
      ["yo", "Yoruba"],
      ["zu", "Zulu"],
    ]);

    // `this` bindings
    this.generate = this.generate.bind(this);
    this.readFile = this.readFile.bind(this);
    this.handleFormSubmission = this.handleFormSubmission.bind(this);
    this.toggleLangDropdown = this.toggleLangDropdown.bind(this);
    this.convertToRGB = this.convertToRGB.bind(this);
    this.updateProgress = this.updateProgress.bind(this);
    this.handleDownload = this.handleDownload.bind(this);
  }

  generate(data, rmStopwords, lang, config) {
    return new Promise((resolve, reject) => {
      const sc = new statsCalculator();

      sc.run(data, rmStopwords, lang)
        .then((stats) => {
          if (stats === undefined) {
            reject(new Error("Received empty data from generator"));
          }

          this.props.submitCallback(stats, config);
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  readFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        const data = event.target.result;
        if (data && data !== "") {
          resolve(data);
        }
      };

      reader.onerror = (event) => {
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

  handleFormSubmission(event) {
    this.props.showChart(false);

    this.updateProgress("Trying to access the file..");

    // don't referesh page when form is submitted
    event.preventDefault();

    const file = document.getElementById("fileSelector").files[0];
    const config = {
      author1Color: this.convertToRGB(
        document.getElementById("author1ColorPicker").value
      ),
      author2Color: this.convertToRGB(
        document.getElementById("author2ColorPicker").value
      ),
      backgroundColor: this.convertToRGB(
        document.getElementById("bgColorPicker").value
      ),
      textColor: this.convertToRGB(
        document.getElementById("textColorPicker").value
      ),
      iconColor: this.convertToRGB(
        document.getElementById("iconColorPicker").value
      ),
      graphColor: this.convertToRGB(
        document.getElementById("graphColorPicker").value
      ),
    };

    if (file === undefined || !file.name.endsWith(".txt")) {
      this.updateProgress("Please select a valid file!");
      return false;
    } else {
      this.updateProgress("Trying to read the file..");

      this.readFile(file)
        .then((data) => {
          this.updateProgress("Generating the visualization..");

          return this.generate(
            data,
            document.getElementById("rmStopwords").checked,
            supportedLangs.get(document.getElementById("langDropdown").value),
            config
          );
        })
        .then(() => {
          this.updateProgress("Your visualization is ready!");
          return true;
        })
        .catch((err) => {
          this.updateProgress(err.message);
          return false;
        });
    }
  }

  handleDownload() {
    toPng(
      document.getElementById("chart") /*, {
      width: 900 
    }*/
    ).then(function (dataURL) {
      download(dataURL, "whatschart.png");
    });
  }

  toggleLangDropdown() {
    if (document.getElementById("rmStopwords").checked) {
      document.getElementById("langDropdown").disabled = false;
    } else {
      document.getElementById("langDropdown").disabled = true;
    }
  }

  convertToRGB(hex) {
    return (
      "rgb(" +
      hex
        .match(/[A-Za-z0-9]{2}/g)
        .map(function (v) {
          return parseInt(v, 16);
        })
        .join(",") +
      ")"
    );
  }

  updateProgress(progress) {
    this.setState((prevState) => {
      return { progress: progress };
    });
  }

  render() {
    return (
      <form id="form" action="" onSubmit={this.handleFormSubmission}>
        <label htmlFor="fileSelector">Select your WhatsApp chat file</label>
        <input id="fileSelector" name="file" type="file" accept=".txt" />

        <label htmlFor="rmStopwords">
          Remove <a href="https://en.wikipedia.org/wiki/Stop_word">stopwords</a>
          ?
        </label>
        <input
          id="rmStopwords"
          type="checkbox"
          name="rmStopwords"
          value="rmStopwords"
          onChange={this.toggleLangDropdown}
          defaultChecked
        ></input>

        <label htmlFor="langDropdown">
          Select the language of conversation
        </label>
        <select id="langDropdown" name="lang" defaultValue="en">
          {[...supportedLangs.keys()].map((key, idx) => (
            <option value={key} key={idx}>
              {this.langExtensions.get(key)}
            </option>
          ))}
        </select>

        <label htmlFor="author1ColorPicker">First author color</label>
        <input
          id="author1ColorPicker"
          type="color"
          defaultValue={this.defaultForm.colors.author1Color}
        ></input>

        <label htmlFor="author2ColorPicker">Second author color</label>
        <input
          id="author2ColorPicker"
          type="color"
          defaultValue={this.defaultForm.colors.author2Color}
        ></input>

        <label htmlFor="bgColorPicker">Background color</label>
        <input
          id="bgColorPicker"
          type="color"
          defaultValue={this.defaultForm.colors.backgroundColor}
        ></input>

        <label htmlFor="textColorPicker">Text color</label>
        <input
          id="textColorPicker"
          type="color"
          defaultValue={this.defaultForm.colors.textColor}
        ></input>

        <label htmlFor="iconColorPicker">Icons color</label>
        <input
          id="iconColorPicker"
          type="color"
          defaultValue={this.defaultForm.colors.iconColor}
        ></input>

        <label htmlFor="graphColorPicker">Graphs color</label>
        <input
          id="graphColorPicker"
          type="color"
          defaultValue={this.defaultForm.colors.graphColor}
        ></input>

        <ProgressIndicator progress={this.state.progress} />

        {this.props.chartVisible && (
          <DownloadAndSeeChart handleDownload={this.handleDownload} />
        )}

        <input type="submit" value="Generate" />
      </form>
    );
  }
}

FileForm.propTypes = {
  submitCallback: PropTypes.func.isRequired,
  showChart: PropTypes.func.isRequired,
  chartVisible: PropTypes.bool.isRequired,
};

FileForm.defaultProps = {
  submitCallback: () => {},
  showChart: () => {},
  chartVisible: false,
};

export default FileForm;
