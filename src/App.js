import React from "react";
import "./App.css";
import whatsChart from "./whatschart/whatschart.js";

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {}

    this.handleFileSelect = this.handleFileSelect.bind(this);
    this.generate = this.generate.bind(this);
  }

  readFile(file) {

    const reader = new FileReader();

    reader.onload = (event) => {
      const data = event.target.result;
      if (data && data !== "") {
        this.generate(data);
      }
    };

    reader.onerror = (event) => {
      //FIXME stop the operation here
      alert(`An error (${reader.error}) occurred while while trying to read the selected file`);
    };

    reader.readAsText(file);
  }

  generate(data) {

    const wc = new whatsChart();
    wc.parseChats(data);

  };

  handleFileSelect(event) {

    // don't referesh page when form is submitted
    event.preventDefault();

    let file = document.getElementById("fileSelector").files[0];
    if (file === undefined) {
      console.log("Failed to access the selected file");
      return false
    } else {
      try {
        this.readFile(file);
      } catch (e) {
        throw new Error(`Error occured ${e.message}`);
      }

      return true;
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
        </form>
      </div>

    );
  }
}

export default App;
