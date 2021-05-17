import React from "react";

import "../css/NavBar.css";

const NavBar = (props) => (
  <nav className="navBar">
    <h1 id="navHeading">WhatsChart</h1>
    <ul>
      <li>
        <a href="#fileForm">Generate</a>
      </li>
      <li>
        <a href="#howtoPage">How to?</a>
      </li>
      <li>
        <a href="#whyWhatschart">Why WhatsChart?</a>
      </li>
      <li>
        <a href="/demo.png">Demo</a>
      </li>
      <li>
        <a href="#feedbackPage">Feedback</a>
      </li>
      <li>
        <a href="https://github.com/bhumitattarde/WhatsChart">GitHub</a>
      </li>
    </ul>
  </nav>
);

export default NavBar;
