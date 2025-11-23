// api/panels.js

const { fetchGithubUser } = require("../src/github");
const { renderPanels } = require("../src/render");

module.exports = async (req, res) => {
  try {
    const { username, theme, column, row, "margin-w": marginW, "margin-h": marginH, "no-bg": noBg, "no-frame": noFrame } = req.query;

    if (!username) {
      res.status(400).send("Missing 'username' query parameter, e.g. ?username=varchasvakhare2022");
      return;
    }

    const user = await fetchGithubUser(username);
    const svg = renderPanels(user, theme, {
      column: column ? parseInt(column, 10) : undefined,
      row: row ? parseInt(row, 10) : undefined,
      marginW: marginW ? parseInt(marginW, 10) : undefined,
      marginH: marginH ? parseInt(marginH, 10) : undefined,
      noBg,
      noFrame
    });

    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Cache-Control", "public, max-age=600");
    res.status(200).send(svg);
  } catch (err) {
    console.error("API /api/panels error:", err);

    const msg = String(err.message || err).replace(/</g, "&lt;");

    const errorSvg = `
      <svg width="500" height="80" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#1f2933" />
        <text x="20" y="45" fill="#f9fafb" font-size="14">
          Error: ${msg}
        </text>
      </svg>
    `;

    res.setHeader("Content-Type", "image/svg+xml");
    res.status(500).send(errorSvg);
  }
};
