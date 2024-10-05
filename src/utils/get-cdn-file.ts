export function getCdnFn() {
    const script = document.createElement("script");
    const inlineSdk = "https://dr4h9151gox1m.cloudfront.net/dist/checkout-inline.js";
    script.src = inlineSdk;
    script.onload = () => {
    }
    if (!document.querySelector(`[src="${inlineSdk}"]`)) {
      document.head.appendChild(script);
    }
}