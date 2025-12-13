import KiteConnect from "kiteconnect";

const kc = new KiteConnect({
  api_key: process.env.KITE_API_KEY
});

kc.setAccessToken(process.env.KITE_ACCESS_TOKEN);

export default async function handler(req, res) {
  try {
    const symbol = "NIFTY";
    const expiry = "2025-12-16"; // CHANGE WEEKLY EXPIRY HERE

    // 1. Get instruments
    const instruments = await kc.getInstruments("NFO");

    const niftyOptions = instruments.filter(
      i =>
        i.name === symbol &&
        i.expiry === expiry &&
        i.instrument_type === "CE" || i.instrument_type === "PE"
    );

    // 2. Pick ATM strike
    const ltp = await kc.getLTP("NSE:NIFTY 50");
    const spot = ltp["NSE:NIFTY 50"].last_price;

    const atmStrike =
      Math.round(spot / 50) * 50;

    const CE = niftyOptions.find(
      o => o.strike === atmStrike && o.instrument_type === "CE"
    );

    const PE = niftyOptions.find(
      o => o.strike === atmStrike && o.instrument_type === "PE"
    );

    // 3. Fetch Greeks
    const greeks = await kc.getQuote([
      `NFO:${CE.tradingsymbol}`,
      `NFO:${PE.tradingsymbol}`
    ]);

    const CEg = greeks[`NFO:${CE.tradingsymbol}`].greeks;
    const PEg = greeks[`NFO:${PE.tradingsymbol}`].greeks;

    res.json({
      CE: CEg,
      PE: PEg
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
