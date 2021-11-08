import React from "react";

import "../css/Footer.css";

const Footer = props => (
	<div id="footer">
		<hr />
		<ul>
			<li id="donate">
				<a href="">Buy me a coffee!</a>
			</li>
			<li>
				Made with &hearts; by{" "}
				<a href="https://www.bhumit.net">Bhumit Attarde</a>
			</li>
			<li>
				&copy; 2021 <a href="https://www.bhumit.net">Bhumit Attarde</a>
			</li>
			<li>
				WhatsApp is a registered trademark of WhatsApp Inc. This site and
				service are not related to WhatsApp Inc. in any way.
			</li>
		</ul>
	</div>
);

export default Footer;
