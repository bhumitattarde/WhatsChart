import React from "react";

import "../css/FeedbackPage.css";

const FeedbackPage = (props) => (
  <div id="feedbackPage" className="page">
    <h2>Feedback</h2>
    <ul>
      <li>
        <a
          className="button"
          href="https://github.com/bhumitattarde/WhatsChart/issues/new?labels=bug&title=BUG:
          "
        >
          Report bugs
        </a>
      </li>
      <li>
        <a
          className="button"
          href="https://github.com/bhumitattarde/WhatsChart/issues/new?labels=improvement&title=SUGGESTION:
          "
        >
          Suggest improvements
        </a>
      </li>
      <li>
        <a
          className="button"
          href="https://github.com/bhumitattarde/WhatsChart"
        >
          GitHub
        </a>
      </li>
    </ul>
  </div>
);

export default FeedbackPage;
