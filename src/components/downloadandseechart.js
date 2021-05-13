import React from "react";
import PropTypes from "prop-types";

const DownloadAndSeeChart = (props) => (
  <div>
    <h4>To ensure correct download:</h4>
    <p>Maximize browser window</p>
    <p>If using phone, enable landscape mode</p>

    <a href="#chart">See visualization</a>
    <button type="button" onClick={props.handleDownload}>
      Download visualization
    </button>
  </div>
);

DownloadAndSeeChart.propTypes = {
  handleDownload: PropTypes.func.isRequired,
};

DownloadAndSeeChart.defaultProps = {
  handleDownload: () => {},
};

export default DownloadAndSeeChart;
