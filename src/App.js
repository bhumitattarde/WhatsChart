import React from "react";
import "./App.css";
import statsCalculator from "./core/statscalculator.js";
import WhatsChart from "./components/whatschart";
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
      //FIXME setting for now. Later should be inputted by user. Is part of state so everything doesn't have to
      //to be calculated again just to change color
      config: {
        author1Color: "rgb(234,1,49)",
        author2Color: "rgb(1,190,149)",
        backgroundColor: "rgb(42, 43, 70)",
        textColor: "white",
        iconColor: "rgb(68, 76, 166)",
        chartColor: "rgb(242, 17, 112)",
      },
    };

    // method bindings
    this.handleFileSelect = this.handleFileSelect.bind(this);
    this.generate = this.generate.bind(this);

    // member variables
    this.author1 = {};
    this.author2 = {};
    this.combined = {};
  }

  //FIXME remove later
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
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

  componentDidMount() {}

  render() {
    return (
      <div>
        <h1>WhatsChart!</h1>
        <form id="form" action="" onSubmit={this.handleFileSelect}>
          <label htmlFor="fileSelector">Select your WhatsApp chat file</label>
          <input id="fileSelector" name="file" type="file" accept=".txt" />
          <input type="submit" value="SELECT" />
        </form>
        {this.state.showChart && (
          <WhatsChart
            author1={this.author1}
            author2={this.author2}
            combined={this.combined}
            config={this.state.config}
          />
        )}
      </div>
    );
  }
}

export default App;
