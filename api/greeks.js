import pkg from "kiteconnect";
const { KiteConnect } = pkg;

export default async function handler(req, res) {
  try {
    const apiKey = process.env.KITE_API_KEY;
    const accessToken = process.env.KITE_ACCESS_TOKEN;

    const kc = new KiteConnect({
      api_key: apiKey,
      access_token: accessToken
    });

    // 1️⃣ Get NIFTY spot price
    const spotQuote = await kc.getQuote(["NSE:NIFTY 50"]);
    const spot = spotQuote["NSE:NIFTY 50"].last_price;

    // 2️⃣ Calculate ATM strike
    const atmStrike = Math.round(spot / 50) * 50;

    // 3️⃣ Find nearest weekly expiry
    const instruments = await kc.getInstruments("NFO");
    const niftyOptions = instruments.filter(
      i =>
        i.name === "NIFTY" &&
        i.strike === atmStrike &&
        (i.instrument_type === "CE" || i.instrument_type === "PE")
    );

    if (niftyOptions.length < 2) {
      return res.status(500).json({ error: "ATM options not found" });
    }

    const ce = niftyOptions.find(o => o.instrument_type === "CE");
    const pe = niftyOptions.find(o => o.instrument_type === "PE");

    // 4️⃣ Fetch Greeks
    const quotes = await kc.getQuote([
      `NFO:${ce.tradingsymbol}`,
      `NFO:${pe.tradingsymbol}`
    ]);

    const CE = quotes[`NFO:${ce.tradingsymbol}`].greeks;
    const PE = quotes[`NFO:${pe.tradingsymbol}`].greeks;

    return res.status(200).json({
      spot,
      strike: atmStrike,
      CE,
      PE
    });

  } catch (err) {
    return res.status(500).json({
      error: err.message || String(err)
    });
  }
}
