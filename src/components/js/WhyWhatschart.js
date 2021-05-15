import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserSecret, faFastForward } from "@fortawesome/free-solid-svg-icons";
import { faOsi } from "@fortawesome/free-brands-svg-icons";

import "../css/WhyWhatschart.css";

const WhyWhatschart = (props) => (
  <div id="whyWhatschart" className="page">
    <ul id="whyWhatschartList">
      <li className="whyWhatschartBox">
        <div>
          <FontAwesomeIcon icon={faUserSecret} fixedWidth />
        </div>
        <section>
          <h2>Maximum privacy</h2>
          <p>
            WhatsChart works locally, which means NO data, including the chat
            you select, is ever sent to ANY server! Additionally, WhatsChart
            does NOT collect any analytics or other data.
          </p>
        </section>
      </li>
      <li className="whyWhatschartBox">
        <div>
          <FontAwesomeIcon icon={faOsi} fixedWidth />
        </div>
        <section>
          <h2>Completely open-source and free</h2>
          <p>
            WhatsChart does not charge you anything! Also, anyone, including
            you, can read the source code anytime!
          </p>
        </section>
      </li>
      <li className="whyWhatschartBox">
        <div>
          <FontAwesomeIcon icon={faFastForward} fixedWidth />
        </div>
        <section>
          <h2>Instant and customizable</h2>
          <p>
            WhatsChart is customizable and works instantly! One click and off
            you go!
          </p>
        </section>
      </li>
    </ul>

    <ul className="linksList">
      <li className="button">
        <a href="">Try it out!</a>
      </li>
      <li className="button">
        <a href="">Demo</a>
      </li>
    </ul>
  </div>
);

export default WhyWhatschart;
