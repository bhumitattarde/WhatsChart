import React from "react";

import "../css/MainPage.css";

const MainPage = (props) => (
  <header id="mainPage" className="page">
    <h1>Instantly analyze and visualize your WhatsApp chats for free!</h1>

    <ul className="linksList">
      <li className="button">
        <a href="#whyWhatschart">Why WhatsChart?</a>
      </li>
      <li className="button">
        <a href="/demo.png">See a sample visualization</a>
      </li>
      <li className="button">
        <a href="#fileForm">Generate a visualization!</a>
      </li>
    </ul>
  </header>
);

export default MainPage;
