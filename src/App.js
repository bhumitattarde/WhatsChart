import React from "react";
import "./App.css";
import statsCalculator from "./core/statscalculator.js";
import WhatsChart from "./components/whatschart.js";
import FileForm from "./components/form.js";
import * as htmlToImage from "html-to-image";
import { toPng } from "html-to-image";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showChart: false,
    };

    // `this` bindings
    this.formCallback = this.formCallback.bind(this);
    this.showChart = this.showChart.bind(this);

    // member variables
    this.config = {};
    this.stats = {};
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
