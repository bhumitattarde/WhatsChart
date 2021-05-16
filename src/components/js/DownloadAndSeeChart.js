import React from "react";
import PropTypes from "prop-types";

import "../css/DownloadAndSeeChart.css";

const DownloadAndSeeChart = (props) => (
  <div className="downloadAndSeeChart">
    <ul>
      <li>
        <a className="button" href="#chart">
          See
        </a>
      </li>
      <li>
        <button className="button" type="button" onClick={props.handleDownload}>
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
