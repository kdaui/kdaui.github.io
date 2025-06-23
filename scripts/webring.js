(function() {
  const WR_URL = "https://kdaui.github.io/webring.json";

  fetch(WR_URL)
    .then(res => res.json())
    .then(data => {
      const current = window.location.href;
      const index = data.findIndex(site => current.includes(site.url));

      const prev = data[(index - 1 + data.length) % data.length];
      const next = data[(index + 1) % data.length];

      const container = document.createElement("div");
      container.style = "margin-top:20px;padding:10px;background:#111;color:#fff;text-align:center;font-family:monospace;";
      container.innerHTML = `
        <div>
          <strong>Webring:</strong>
          <a href="${prev.url}" style="color:#00f;text-decoration:underline;">Prev</a> |
          <a href="${data[0].url}" style="color:#0f0;text-decoration:underline;">Home</a> |
          <a href="${next.url}" style="color:#f00;text-decoration:underline;">Next</a>
        </div>
      `;

      document.body.appendChild(container);
    })
    .catch(err => console.error("Webring error:", err));
})();
