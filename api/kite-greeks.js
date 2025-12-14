import pkg from "kiteconnect";
const { KiteConnect } = pkg;

export default async function handler(req, res) {
  try {
    const kc = new KiteConnect({
      api_key: process.env.KITE_API_KEY,
      access_token: process.env.KITE_ACCESS_TOKEN
    });

    // Example: NIFTY option instrument tokens (replace with real ones)
    const instruments = [
      "NFO:NIFTY25JAN26000CE",
      "NFO:NIFTY25JAN26000PE"
    ];

    const quotes = await kc.getQuote(instruments);

    res.status(200).json(quotes);
  } catch (err) {
    res.status(500).json({
      error: err.message || err.toString()
    });
  }
}
