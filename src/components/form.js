import React from "react";
import PropTypes from "prop-types";

import statsCalculator from "../core/statscalculator";

import "./form.css";

class FileForm extends React.Component {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
    // this.state = {};

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

    // `this` bindings
    this.generate = this.generate.bind(this);
    this.readFile = this.readFile.bind(this);
    this.handleFormSubmission = this.handleFormSubmission.bind(this);
    this.toggleLangDropdown = this.toggleLangDropdown.bind(this);
    this.convertToRGB = this.convertToRGB.bind(this);
  }

  generate(data /*, rmStopwords*/, config) {
    return new Promise((resolve, reject) => {
      const sc = new statsCalculator();

      sc.run(data, true)
        .then((stats) => {
          if (stats === undefined) {
            reject(new Error("Received empty data from generator"));
          }

          console.log(stats);

          this.props.callback(stats, config);

          resolve();
        })
        .catch((err) => {
          console.error(err);
          reject();
        });
    });
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

  readFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        const data = event.target.result;
        if (data && data !== "") {
          // this.generate(data);
          resolve(data);
        }
      };

      reader.onerror = (event) => {
        reject(
          new Error(
            `An error (${reader.error}) occurred while while trying to read the selected file`
          )
        );
      };

      reader.readAsText(file);
    });
  }

  handleFormSubmission(event) {
    this.props.showChart(false);

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

    console.log(config.author1Color);

    if (file === undefined || !file.name.endsWith(".txt")) {
      //!update status
      console.error("Failed to access the selected file");
      return false;
    } else {
      this.readFile(file)
        .then((data) => {
          return this.generate(
            data /*, document.getElementById("rmStopwords")*/,
            config
          );
        })
        .then(() => {
          return true;
        })
        .catch((err) => {
          //!update progress bar
          return false;
        });
    }
  }

  toggleLangDropdown() {
    if (document.getElementById("rmStopwords").checked) {
      document.getElementById("langDropdown").disabled = false;
    } else {
      document.getElementById("langDropdown").disabled = true;
    }
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
          checked
        ></input>

        <label htmlFor="langDropdown">
          Select the language of conversation
        </label>
        <select id="langDropdown" name="lang">
          {/* <option value="" selected disabled hidden></option> */}
          <option value="en" selected>
            English
          </option>
        </select>

        <label for="author1ColorPicker">First author color</label>
        <input
          id="author1ColorPicker"
          type="color"
          value={this.defaultForm.colors.author1Color}
        ></input>

        <label for="author2ColorPicker">Second author color</label>
        <input
          id="author2ColorPicker"
          type="color"
          value={this.defaultForm.colors.author2Color}
        ></input>

        <label for="bgColorPicker">Background color</label>
        <input
          id="bgColorPicker"
          type="color"
          value={this.defaultForm.colors.backgroundColor}
        ></input>

        <label for="textColorPicker">Text color</label>
        <input
          id="textColorPicker"
          type="color"
          value={this.defaultForm.colors.textColor}
        ></input>

        <label for="iconColorPicker">Icons color</label>
        <input
          id="iconColorPicker"
          type="color"
          value={this.defaultForm.colors.iconColor}
        ></input>

        <label for="graphColorPicker">Graphs color</label>
        <input
          id="graphColorPicker"
          type="color"
          value={this.defaultForm.colors.graphColor}
        ></input>

        <input type="submit" value="GO" />
      </form>
    );
  }
}

FileForm.propTypes = {
  callback: PropTypes.func.isRequired,
  showChart: PropTypes.func.isRequired,
};

FileForm.defaultProps = {
  callback: () => {},
  showChart: () => {},
};

export default FileForm;
