import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserSecret, faFastForward } from "@fortawesome/free-solid-svg-icons";
import { faOsi } from "@fortawesome/free-brands-svg-icons";

import "../css/WhyWhatschart.css";

const WhyWhatschart = (props) => (
  <div id="whyWhatschart" className="page">
    <h2>Why WhatsChart?</h2>

    <ul id="whyWhatschartList">
      <li className="whyWhatschartBox">
        <div>
          <FontAwesomeIcon icon={faUserSecret} fixedWidth />
        </div>
        <section>
          <h3>Maximum privacy</h3>
          <p>
            WhatsChart works locally, which means NO data, including the chat
            you select, is ever sent to ANY server! WhatsChart does NOT collect
            any analytics or other data either.
          </p>
        </section>
      </li>
      <li className="whyWhatschartBox">
        <div>
          <FontAwesomeIcon icon={faOsi} fixedWidth />
        </div>
        <section>
          <h3>Completely open-source and free</h3>
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
          <h3>Instant and customizable</h3>
          <p>
            WhatsChart works instantly! One click and off you go! Additionally,
            WhatsChart is highly customizable and new customization options are
            still being added.
          </p>
        </section>
      </li>
    </ul>

    <ul className="linksList">
      <li className="button altColorButton">
        <a href="">Try it out!</a>
      </li>
      <li className="button altColorButton">
        <a href="">Demo</a>
      </li>
    </ul>
  </div>
);

export default WhyWhatschart;
