const BAIT_CLASS = "adsbox";

function createDomBait(): HTMLElement {
  const bait = document.createElement("div");
  bait.className = BAIT_CLASS;
  bait.setAttribute("aria-hidden", "true");
  bait.style.position = "absolute";
  bait.style.left = "-9999px";
  bait.style.width = "1px";
  bait.style.height = "1px";
  bait.innerHTML = "&nbsp;";
  document.body.appendChild(bait);
  return bait;
}

function isDomBaitBlocked(element: HTMLElement): boolean {
  const style = window.getComputedStyle(element);
  return (
    style.display === "none" ||
    style.visibility === "hidden" ||
    element.offsetHeight === 0 ||
    element.offsetWidth === 0
  );
}

async function isScriptBaitBlocked(): Promise<boolean> {
  try {
    const response = await fetch("/ads.js", {
      cache: "no-store",
      credentials: "same-origin",
    });

    if (!response.ok) {
      return true;
    }

    const script = document.createElement("script");
    script.src = `/ads.js?ts=${Date.now()}`;

    const loaded = await new Promise<boolean>((resolve) => {
      const timeout = window.setTimeout(() => resolve(false), 1200);
      script.onload = () => {
        window.clearTimeout(timeout);
        resolve(window.__pdfMergerAdsLoaded === true);
      };
      script.onerror = () => {
        window.clearTimeout(timeout);
        resolve(false);
      };
      document.body.appendChild(script);
    });

    script.remove();
    return !loaded;
  } catch {
    return true;
  }
}

export async function detectAdBlocker(): Promise<boolean> {
  if (typeof window === "undefined") {
    return false;
  }

  const bait = createDomBait();
  await new Promise((resolve) => window.setTimeout(resolve, 120));

  const domBlocked = isDomBaitBlocked(bait);
  bait.remove();

  if (domBlocked) {
    return true;
  }

  return isScriptBaitBlocked();
}

declare global {
  interface Window {
    __pdfMergerAdsLoaded?: boolean;
  }
}
