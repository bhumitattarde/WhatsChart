import React from "react";

import "../css/FeedbackPage.css";

const FeedbackPage = (props) => (
  <div id="feedbackPage" className="page">
    <h2>Feedback</h2>
    <ul className="linksList">
      <li>
        <a
          className="button"
          href="https://github.com/bhumitattarde/WhatsChart/issues/new?labels=bug&title=BUG: "
        >
          Report bugs
        </a>
      </li>
      <li>
        <a
          className="button"
          href="https://github.com/bhumitattarde/WhatsChart/issues/new?labels=enhancement&title=SUGGESTION: "
        >
          Suggest improvements
        </a>
      </li>
      <li>
        <a
          className="button"
          href="https://github.com/bhumitattarde/WhatsChart"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
      </li>
    </ul>
  </div>
);

export default FeedbackPage;
