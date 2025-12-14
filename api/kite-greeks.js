import pkg from "kiteconnect";
const { KiteConnect } = pkg;

export default async function handler(req, res) {
  try {
    const apiKey = (process.env.KITE_API_KEY || "").trim();
    const accessToken = (process.env.KITE_ACCESS_TOKEN || "").trim();

    if (!apiKey || !accessToken) {
      return res.status(500).json({ error: "Missing Kite credentials" });
    }

    // IMPORTANT: pass access_token in constructor
    const kc = new KiteConnect({
      api_key: apiKey,
      access_token: accessToken
    });

    // Simple auth test
    const profile = await kc.getProfile();

    return res.status(200).json({
      status: "KITE CONNECTED",
      user: profile.user_name,
      broker: profile.broker
    });

  } catch (err) {
    return res.status(500).json({
      error: err.message || String(err)
    });
  }
}
