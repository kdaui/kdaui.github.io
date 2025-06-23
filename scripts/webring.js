(async () => {
  const ringURL = 'https://kdaui.github.io/webring.json';
  const current = document.currentScript.getAttribute('data-id');

  try {
    const res = await fetch(ringURL);
    const sites = await res.json();

    const currentIndex = sites.findIndex(site => site.id === current);
    if (currentIndex === -1) throw new Error("Current site not found");

    const prev = sites[(currentIndex - 1 + sites.length) % sites.length];
    const next = sites[(currentIndex + 1) % sites.length];

    const wrapper = document.createElement('div');
    wrapper.className = 'webring';
    wrapper.innerHTML = `
      <p>
        <a href="${prev.url}" target="_blank">← ${prev.name}</a> | 
        <a href="${next.url}" target="_blank">${next.name} →</a> | 
        <a href="${ringURL}" target="_blank">Ring JSON</a>
      </p>
    `;
    document.body.appendChild(wrapper);
  } catch (err) {
    console.error('Webring error:', err);
  }
})();
