import React from "react";

import "../css/NavBar.css";

const NavBar = (props) => (
  <nav className="navBar">
    <h1>WhatsChart</h1>
    <ul>
      <li>
        <a href="">Generate</a>
      </li>
      <li>
        <a href="">How to?</a>
      </li>
      <li>
        <a href="">Why WhatsChart?</a>
      </li>
      <li>
        <a href="">Demo</a>
      </li>
      <li>
        <a href="">Feedback</a>
      </li>
      <li>
        <a href="">GitHub</a>
      </li>
    </ul>
  </nav>
);

export default NavBar;
