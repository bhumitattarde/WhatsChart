import React from "react";

import "../css/FeedbackPage.css";

const FeedbackPage = (props) => (
  <div className="page">
    <h3>Feedback</h3>
    <a
      className="button"
      href="https://github.com/bhumitattarde/WhatsChart/issues/new?labels=bug&title=BUG: "
    >
      Report bugs
    </a>
    <a
      className="button"
      href="https://github.com/bhumitattarde/WhatsChart/issues/new?labels=improvement&title=SUGGESTION: "
    >
      Suggest improvements
    </a>
    <a className="GitHub" href="https://github.com/bhumitattarde/WhatsChart">
      Report bugs
    </a>
  </div>
);

export default FeedbackPage;
