import React from "react";
import PropTypes from "prop-types";

const ProgressIndicator = (props) => (
  <div>
    <p>{props.progress}</p>
  </div>
);

ProgressIndicator.propTypes = {
  progress: PropTypes.string,
};

ProgressIndicator.defaultProps = {
  progress: "",
};

export default ProgressIndicator;
