import { useCallback, useEffect, useRef, useState } from "react";

const TURNSTILE_SCRIPT_ID = "cloudflare-turnstile-script";
const TURNSTILE_SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

let turnstileScriptPromise;

const loadTurnstile = () => {
  if (window.turnstile) return Promise.resolve();
  if (turnstileScriptPromise) return turnstileScriptPromise;

  turnstileScriptPromise = new Promise((resolve, reject) => {
    const existingScript = document.getElementById(TURNSTILE_SCRIPT_ID);

    const handleLoad = () => resolve();
    const handleError = () => {
      turnstileScriptPromise = null;
      reject(new Error("Turnstile script could not be loaded"));
    };

    if (existingScript) {
      existingScript.addEventListener("load", handleLoad, { once: true });
      existingScript.addEventListener("error", handleError, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = TURNSTILE_SCRIPT_ID;
    script.src = TURNSTILE_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.addEventListener("load", handleLoad, { once: true });
    script.addEventListener("error", handleError, { once: true });
    document.body.appendChild(script);
  });

  return turnstileScriptPromise;
};

const useTurnstile = (siteKey) => {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const [token, setToken] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const renderTurnstile = () => {
      if (!isMounted || !window.turnstile || !containerRef.current) return;
      if (widgetIdRef.current !== null) return;

      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        callback: setToken,
        "expired-callback": () => setToken(""),
        "error-callback": () => setToken(""),
      });
    };

    loadTurnstile()
      .then(renderTurnstile)
      .catch(() => {
        if (isMounted) {
          setError(
            "The security check could not be loaded. Please refresh the page and try again.",
          );
        }
      });

    return () => {
      isMounted = false;
      if (window.turnstile && widgetIdRef.current !== null) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [siteKey]);

  const reset = useCallback(() => {
    setToken("");
    if (window.turnstile && widgetIdRef.current !== null) {
      window.turnstile.reset(widgetIdRef.current);
    }
  }, []);

  return { containerRef, token, error, reset };
};

export default useTurnstile;
