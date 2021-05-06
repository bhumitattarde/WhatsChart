import React from "react";
import "./App.css";
import whatsChart from "./whatschart/whatschart.js";
import Chart from "./components/chart"

//FIXME make a progress/error pane that'll display progress/errors that occur
//FIXME form should be a separate component that accepts a callback as a prop

class App extends React.Component {

  constructor(props) {

    super(props);
    this.state = {
      showChart: false,
    }

    // method bindings
    this.handleFileSelect = this.handleFileSelect.bind(this);
    this.generate = this.generate.bind(this);
    this.generateChart = this.generateChart.bind(this);

    // member variables
    this.author1 = {};
    this.author2 = {};
  }

  generate(data) {

    return new Promise((resolve, reject) => {

      const wc = new whatsChart();

      wc.run(data)
        .then(authors => {

          if (authors === undefined) {
            reject(new Error("Received empty data from generator"));
          };

          console.log(authors);

          this.author1 = authors.author1;
          this.author2 = authors.author2;
          this.setState(prevState => {
            return { showChart: true };
          });

          resolve();
        })
        .catch(err => {

          console.error(err);
          reject();
        });
    });
  };

  readFile(file) {

    return new Promise((resolve, reject) => {

      const reader = new FileReader();

      reader.onload = (event) => {

        const data = event.target.result;
        if (data && data !== "") {
          // this.generate(data);
          resolve(data);
        };
      };

      reader.onerror = (event) => {
        reject(new Error(`An error (${reader.error}) occurred while while trying to read the selected file`))
      };

      reader.readAsText(file);
    });
  };

  handleFileSelect(event) {

    this.setState(prevState => {
      return { showChart: false };
    });

    // don't referesh page when form is submitted
    event.preventDefault();

    let file = document.getElementById("fileSelector").files[0];

    if (file === undefined || !file.name.endsWith(".txt")) {
      //!update status
      console.error("Failed to access the selected file");
      return false
    } else {
      this.readFile(file)
        .then(data => {
          return this.generate(data);
        })
        .then(() => {
          return true;
        })
        .catch(err => {
          //!update progress bar
          return false;
        })
    }
  }

  componentDidMount() {
  }

  render() {
    return (
      <div>
        <h1>WhatsChart!</h1>
        <form id="form" action="" onSubmit={this.handleFileSelect}>
          <label htmlFor="fileSelector">Select your WhatsApp chat file</label>
          <input id="fileSelector" name="file" type="file" accept=".txt" />
          <input type="submit" value="SELECT" />
          {this.state.showChart && <Chart author1={this.author1} author2={this.author2} />}
        </form>
      </div>

    );
  }
}

export default App;
