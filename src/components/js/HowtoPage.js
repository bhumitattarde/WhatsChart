import React from "react";

import "../css/HowtoPage.css";

const HowtoPage = (props) => (
  <div id="howtoPage" className="page">
    <h2>How to use WhatsChart?</h2>
    <ol className="paraWrapper">
      <li>
        <div>
          <h3>Export your WhatsApp chats</h3>
          <ol className="howtoSubListWrapper">
            <li>Open the chat.</li>
            <li>Tap More options &gt; More &gt; Export chat. </li>
            <li>
              Choose to export with media. If you decide to leave media out, you
              won't get statistics about media like pictures, videos etc.
            </li>
            <li>
              File with name like `chat.txt` or `WhatsApp chat with John.txt` is
              the file you'll need. WhatsApp unfortunately doesn't follow a
              consistent pattern while naming the chat file. If a `zip` file was
              exported, unzip it to find the `.txt` chat file. Feel free to
              discard the exported media.
            </li>
            <li>
              If you're still having trouble exporting your chats, refer to the
              following links from WhatsApp FAQ:
              <ul className="howtoSubListWrapper">
                <li>
                  <a href="https://faq.whatsapp.com/android/chats/how-to-save-your-chat-history/?lang=en">
                    Android
                  </a>
                </li>
                <li>
                  <a href="https://faq.whatsapp.com/iphone/chats/how-to-back-up-to-icloud/?lang=en">
                    iPhone
                  </a>
                </li>
              </ul>
            </li>
          </ol>
        </div>
      </li>
      <li>
        <div>
          <h3>
            Go to <a href="">generate page</a>, select the exported chat file,
            configuration and click on Generate.
          </h3>
          <p className="howtoSubListWrapper">
            You can then see/download the generated visualization. It is HIGHLY
            recommended that you use desktop or a device with wide screen to
            download the visualization.
          </p>
        </div>
      </li>
    </ol>
  </div>
);

export default HowtoPage;
