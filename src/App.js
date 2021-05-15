import React from "react";

import NavBar from "./components/navbar.js";
import MainPage from "./components/mainpage.js";
import WhyWhatschart from "./components/whyWhatschart.js";
import HowtoPage from "./components/howtopage.js";
import WhatsChart from "./components/whatschart.js";
import FileForm from "./components/fileform.js";
import FeedbackPage from "./components/feedbackpage.js";
import Footer from "./components/Footer.js";

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
      <div className="appWrapper">
        <NavBar />
        <MainPage />
        <WhyWhatschart />
        <HowtoPage />

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

        <FeedbackPage />
        <Footer />
      </div>
    );
  }
}

export default App;
