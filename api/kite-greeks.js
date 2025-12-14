import KiteConnect from "kiteconnect";

export default async function handler(req, res) {
  try {
    const apiKey = process.env.KITE_API_KEY;
    const accessToken = process.env.KITE_ACCESS_TOKEN;

    if (!apiKey || !accessToken) {
      return res.status(500).json({
        error: "Kite API key or access token missing"
      });
    }

    const kc = new KiteConnect({ api_key: apiKey });
    kc.setAccessToken(accessToken);

    // NIFTY 50 instrument token = 256265
    const quote = await kc.getQuote(["NSE:NIFTY 50"]);

    const ltp = quote["NSE:NIFTY 50"].last_price;

    // Dummy Greeks calculation placeholder (REAL data comes next step)
    // This step only proves Kite connection works
    const greeks = {
      CE: {
        delta: 0.55,
        gamma: 0.0012,
        vega: 9.2,
        theta: -24.0
      },
      PE: {
        delta: -0.45,
        gamma: 0.0012,
        vega: 9.2,
        theta: -19.8
      },
      ltp
    };

    return res.status(200).json(greeks);
  } catch (err) {
    console.error("Kite error:", err);
    return res.status(500).json({
      error: err.message || "Kite API failed"
    });
  }
}
