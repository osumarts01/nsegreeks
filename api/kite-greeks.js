import pkg from "kiteconnect";
const KiteConnect = pkg.KiteConnect;

export default async function handler(req, res) {
  try {
    const apiKey = process.env.KITE_API_KEY;
    const accessToken = process.env.KITE_ACCESS_TOKEN;

    if (!apiKey || !accessToken) {
      return res.status(500).json({
        error: "KITE_API_KEY or KITE_ACCESS_TOKEN missing"
      });
    }

    const kc = new KiteConnect({
      api_key: apiKey
    });

    kc.setAccessToken(accessToken);

    // Simple live check (this MUST work first)
    const profile = await kc.getProfile();

    return res.status(200).json({
      status: "KITE CONNECTED",
      user: profile.user_name,
      broker: profile.broker,
      login_time: profile.login_time
    });

  } catch (err) {
    console.error("KITE ERROR:", err);
    return res.status(500).json({
      error: err.message || "Kite API failed"
    });
  }
}
