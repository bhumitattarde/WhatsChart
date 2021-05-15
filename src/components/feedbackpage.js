import React from "react";

import "./feedbackpage.css";

const FeedbackPage = (props) => (
  <div className="page">
    <h3>Feedback</h3>
    <p>
      <a href="	https://github.com/bhumitattarde/WhatsChart/issues/new?labels=bug&title=BUG: ">
        Click here
      </a>{" "}
      to report bugs
    </p>
    <p>
      <a href="	https://github.com/bhumitattarde/WhatsChart/issues/new?labels=improvement&title=SUGGESTION: ">
        Click here
      </a>{" "}
      to suggest improvements
    </p>
  </div>
);

export default FeedbackPage;
