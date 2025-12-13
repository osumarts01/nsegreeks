export const config = {
  runtime: "nodejs"
};

export default async function handler(req, res) {
  try {
    // IMPORTANT: require inside function (Vercel fix)
    const KiteConnect = require("kiteconnect").KiteConnect;

    const kc = new KiteConnect({
      api_key: process.env.KITE_API_KEY
    });

    kc.setAccessToken(process.env.KITE_ACCESS_TOKEN);

    const q = await kc.getLTP(["NSE:NIFTY 50"]);
    const S = q["NSE:NIFTY 50"].last_price;

    // ===== Greeks math =====
    const normPDF = x => Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
    const erf = x => {
      const s = x >= 0 ? 1 : -1;
      x = Math.abs(x);
      const a1=0.254829592,a2=-0.284496736,a3=1.421413741,a4=-1.453152027,a5=1.061405429,p=0.3275911;
      const t=1/(1+p*x);
      return s*(1-(((((a5*t+a4)*t+a3)*t+a2)*t+a1)*t)*Math.exp(-x*x));
    };
    const normCDF = x => 0.5*(1+erf(x/Math.sqrt(2)));

    const iv = 0.14;
    const r = 0.06;
    const t = 3 / 365;
    const K = Math.round(S / 50) * 50;

    const d1 = (Math.log(S/K)+(r+0.5*iv*iv)*t)/(iv*Math.sqrt(t));
    const d2 = d1 - iv*Math.sqrt(t);

    const data = {
      delta: normCDF(d1),
      gamma: normPDF(d1)/(S*iv*Math.sqrt(t)),
      vega: (S*normPDF(d1)*Math.sqrt(t))/100,
      theta: (
        -S*normPDF(d1)*iv/(2*Math.sqrt(t))
        - r*K*Math.exp(-r*t)*normCDF(d2)
      ) / 365
    };

    res.status(200).json(data);

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
