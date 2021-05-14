import React from "react";

import WhatsChart from "./components/whatschart.js";
import WhyWhatschart from "./components/whyWhatschart.js";
import MainPage from "./components/mainpage.js";
import NavBar from "./components/navbar.js";
import FileForm from "./components/form.js";

import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showChart: false,
    };

    // member variables
    this.config = {};
    this.stats = {};

    // `this` bindings
    this.formSubmitCallback = this.formSubmitCallback.bind(this);
    this.showChart = this.showChart.bind(this);
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
        <NavBar />
        <MainPage />
        <WhyWhatschart />

        <FileForm
          submitCallback={this.formSubmitCallback}
          showChart={this.showChart}
          chartVisible={this.state.showChart}
        />

        {/* {this.state.showChart && (
          <WhatsChart
            author1={this.stats.author1}
            author2={this.stats.author2}
            combined={this.stats.combined}
            config={this.config}
          />
        )} */}
      </div>
    );
  }
}

export default App;
