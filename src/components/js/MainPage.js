import React from "react";

import "../css/MainPage.css";

const MainPage = (props) => (
  <header id="mainPage" className="page">
    <div className="mainHeading">
      {/* <h1>WhatsChart</h1> */}
      <h1>Instantly analyze and visualize your WhatsApp chats for free!</h1>
    </div>

    <ul className="linksList">
      <li className="button">
        <a href="">Why WhatsChart?</a>
      </li>
      <li className="button">
        <a href="">See a sample visualization</a>
      </li>
      <li className="button">
        <a href="">Generate a visualization!</a>
      </li>
    </ul>
  </header>
);

export default MainPage;
