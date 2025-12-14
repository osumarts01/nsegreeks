import pkg from "kiteconnect";
const { KiteConnect } = pkg;

export default async function handler(req, res) {
  try {
    const apiKey = process.env.KITE_API_KEY;
    const accessToken = process.env.KITE_ACCESS_TOKEN;

    const kc = new KiteConnect({ api_key: apiKey });
    kc.setAccessToken(accessToken);

    // SIMPLE AUTH CHECK ONLY
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
