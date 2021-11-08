import React from "react";
import PropTypes from "prop-types";

import "../css/ProgressIndicator.css";

const ProgressIndicator = props => (
	<div
		className={
			props.isError
				? "progressIndicator progressIndicatorBad"
				: "progressIndicator"
		}
	>
		<p>{props.progress}</p>
	</div>
);

ProgressIndicator.propTypes = {
	progress: PropTypes.string,
	isError: PropTypes.bool
};

ProgressIndicator.defaultProps = {
	progress: "",
	isError: false
};

export default ProgressIndicator;
