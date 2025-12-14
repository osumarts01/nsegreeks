import KiteConnect from "kiteconnect";

export default async function handler(req, res) {
  try {
    const apiKey = process.env.KITE_API_KEY;
    const accessToken = process.env.KITE_ACCESS_TOKEN;

    if (!apiKey || !accessToken) {
      return res.status(500).json({ error: "Missing Kite credentials" });
    }

    const kc = new KiteConnect({ api_key: apiKey });
    kc.setAccessToken(accessToken);

    // Example: NIFTY spot
    const quote = await kc.getQuote(["NSE:NIFTY 50"]);

    res.status(200).json({
      status: "OK",
      ltp: quote["NSE:NIFTY 50"].last_price
    });

  } catch (err) {
    res.status(500).json({
      error: err.message || err.toString()
    });
  }
}
