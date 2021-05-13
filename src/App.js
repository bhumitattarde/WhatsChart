import React from "react";

import WhatsChart from "./components/whatschart.js";
import FileForm from "./components/form.js";
import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showChart: false,
    };

    // `this` bindings
    this.formSubmitCallback = this.formSubmitCallback.bind(this);
    this.showChart = this.showChart.bind(this);

    // member variables
    this.config = {};
    this.stats = {};
  }

  formSubmitCallback(stats, config) {
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
          submitCallback={this.formSubmitCallback}
          showChart={this.showChart}
          chartVisible={this.state.showChart}
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
