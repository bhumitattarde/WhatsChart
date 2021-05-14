import React from "react";
import PropTypes from "prop-types";

import "./downloadandseechart.css";

const DownloadAndSeeChart = (props) => (
  <div class="downloadAndSeeChart">
    {/* <h4>To ensure correct download:</h4>
    <ul>
      <li>Maximize browser window</li>
      <li>If using phone, enable landscape mode</li>
    </ul> */}

    <ul>
      <li>
        <a className="button" href="#chart">
          See visualization
        </a>
      </li>
      <li>
        <button className="button" type="button" onClick={props.handleDownload}>
          Download visualization
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
