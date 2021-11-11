import React from "react";

import NavBar from "./components/js/NavBar";
import MainPage from "./components/js/MainPage";
import WhyWhatschart from "./components/js/WhyWhatschart";
import HowtoPage from "./components/js/HowtoPage";
import WhatsChart from "./components/js/WhatsChart";
import FileForm from "./components/js/FileForm";
import FeedbackPage from "./components/js/FeedbackPage";
import Footer from "./components/js/Footer";

import "./App.css";

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showChart: false
		};

		// member variables
		this.config = {};
		this.stats = {};

		// `this` bindings
		this.formSubmitCallback = this.formSubmitCallback.bind(this);
		this.showChart = this.showChart.bind(this);
	}

	/**
	 * Callback for when user submits the form.
	 * Called by `FileForm`.
	 * @param {Statistics} stats calculated statustics
	 * @param {Object} config user configuration
	 */
	formSubmitCallback(stats, config) {
		this.stats = stats;
		this.config = config;
		this.showChart(true);
	}

	/**
	 * Toggle WhatsChart
	 * @param {Boolean} show shows the chart if `true`
	 */
	showChart(show) {
		this.setState(() => ({
			showChart: show
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
