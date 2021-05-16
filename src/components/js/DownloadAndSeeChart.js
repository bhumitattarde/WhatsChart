import React from "react";
import PropTypes from "prop-types";

import "../css/DownloadAndSeeChart.css";

const DownloadAndSeeChart = (props) => (
  <div className="downloadAndSeeChart">
    <ul>
      <li>
        <a className="button altColorButton" href="#chart">
          See it
        </a>
      </li>
      <li>
        <button
          className="button altColorButton"
          type="button"
          onClick={props.handleDownload}
        >
          Download
        </button>
      </li>
    </ul>
  </div>
);

DownloadAndSeeChart.propTypes = {
  handleDownload: PropTypes.func.isRequired,
};

DownloadAndSeeChart.defaultProps = {
  handleDownload: () => {},
};

export default DownloadAndSeeChart;
