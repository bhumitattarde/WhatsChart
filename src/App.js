import React from "react";
import "./App.css";
import statsCalculator from "./core/statscalculator.js";
import WhatsChart from "./components/whatschart.js";
import FileForm from "./components/form.js";
import * as htmlToImage from "html-to-image";
import { toPng } from "html-to-image";

//FIXME make a progress/error pane that'll display progress/errors that occur
//FIXME form should be a separate component that accepts a callback as a prop
//FIXME use either require or import

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showChart: false,
    };

    // `this` bindings
    this.handleFileSelect = this.handleFileSelect.bind(this);
    this.generate = this.generate.bind(this);
    this.formCallback = this.formCallback.bind(this);
    this.showChart = this.showChart.bind(this);

    // member variables
    this.author1 = {};
    this.author2 = {};
    this.combined = {};
    this.config = {};

    this.stats = {};
  }

  generate(data /*, rmStopwords*/) {
    return new Promise((resolve, reject) => {
      const sc = new statsCalculator();

      sc.run(data, true)
        .then((stats) => {
          if (stats === undefined) {
            reject(new Error("Received empty data from generator"));
          }

          console.log(stats);

          this.author1 = stats.author1;
          this.author2 = stats.author2;
          this.combined = stats.combined;
          this.setState((prevState) => {
            return { showChart: true };
          });

          resolve();
        })
        .catch((err) => {
          console.error(err);
          reject();
        });
    });
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

  handleFileSelect(event) {
    this.setState((prevState) => {
      return { showChart: false };
    });

    // don't referesh page when form is submitted
    event.preventDefault();

    let file = document.getElementById("fileSelector").files[0];

    if (file === undefined || !file.name.endsWith(".txt")) {
      //!update status
      console.error("Failed to access the selected file");
      return false;
    } else {
      this.readFile(file)
        .then((data) => {
          return this.generate(
            data /*FIXME, document.getElementById("rmStopwords")*/
          );
        })
        .then(() => {
          //
          //

          return true;
        })
        .catch((err) => {
          //!update progress bar
          return false;
        });
    }
  }

  formCallback(stats, config) {
    this.stats = stats;
    this.config = config;

    this.showChart(true);
  }

  showChart(show) {
    this.setState((prevState) => ({
      showChart: show,
    }));
  }

  render() {
    return (
      <div>
        <h1>WhatsChart!</h1>

        <FileForm
          submitCallback={this.formCallback}
          showChart={this.showChart}
        />

        {this.state.showChart && (
          <WhatsChart
            author1={this.stats.author1}
            author2={this.stats.author2}
            combined={this.stats.combined}
            config={this.config}
          />
        )}
      </div>
    );
  }
}

export default App;
