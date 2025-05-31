function injectTopBanner() {
  if (document.getElementById("classificationBanner")) return;

  const banner = document.createElement("div");
  banner.id = "classificationBanner";
  banner.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background: #111;
    color: white;
    padding: 8px 12px;
    font-family: sans-serif;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    z-index: 9999;
  `;

  const textSpan = document.createElement("span");
  textSpan.innerText = "Classify this site:";

  const buttonsContainer = document.createElement("div");
  buttonsContainer.style.display = "flex";
  buttonsContainer.style.gap = "8px";
  buttonsContainer.style.marginRight = "10px";

  const productiveBtn = document.createElement("button");
  productiveBtn.innerText = "Productive";
  productiveBtn.style.cssText = `
    background: transparent;
    border: 1px solid white;
    color: white;
    padding: 4px 8px;
    cursor: pointer;
    font-size: 14px;
    border-radius: 3px;
  `;

  const distractionBtn = document.createElement("button");
  distractionBtn.innerText = "Distraction";
  distractionBtn.style.cssText = productiveBtn.style.cssText;

  productiveBtn.onclick = () => {
    console.log("productive");
    chrome.runtime.sendMessage({
      type: "classifySite",
      payload: {
        url: window.location.hostname,
        category: "productive",
      },
    });
    console.log("message sent");
    banner.remove();
  };
  distractionBtn.onclick = () => {
    console.log("distraction");
    chrome.runtime.sendMessage({
      type: "classifySite",
      payload: {
        url: window.location.hostname,
        category: "distraction",
      },
    });
    console.log("message sent");
    banner.remove();
  };

  buttonsContainer.appendChild(productiveBtn);
  buttonsContainer.appendChild(distractionBtn);

  banner.appendChild(textSpan);
  banner.appendChild(buttonsContainer);

  document.body.prepend(banner);
}

injectTopBanner();
