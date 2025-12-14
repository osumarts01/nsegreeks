import pkg from "kiteconnect";
const { KiteConnect } = pkg;

export default async function handler(req, res) {
  try {
    const kc = new KiteConnect({
      api_key: process.env.KITE_API_KEY,
      access_token: process.env.KITE_ACCESS_TOKEN
    });

    // 1️⃣ NIFTY Spot
    const spotQuote = await kc.getQuote(["NSE:NIFTY 50"]);
    const spot = spotQuote["NSE:NIFTY 50"].last_price;

    const strike = Math.round(spot / 50) * 50;

    // 2️⃣ MANUAL WEEKLY SYMBOLS (NO getInstruments)
    // ⚠️ CHANGE EXPIRY EVERY THURSDAY
    const EXPIRY = "25JAN"; // <-- UPDATE WEEKLY

    const ceSymbol = `NFO:NIFTY${EXPIRY}${strike}CE`;
    const peSymbol = `NFO:NIFTY${EXPIRY}${strike}PE`;

    // 3️⃣ Fetch Greeks
    const quotes = await kc.getQuote([ceSymbol, peSymbol]);

    const CE = quotes[ceSymbol].greeks;
    const PE = quotes[peSymbol].greeks;

    res.status(200).json({
      spot,
      strike,
      CE,
      PE
    });

  } catch (err) {
    res.status(500).json({
      error: err.message || String(err)
    });
  }
}
