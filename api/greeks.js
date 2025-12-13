// ===== BLACK–SCHOLES GREEKS =====
const normPDF = x => Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
const erf = x => {
  const sign = x >= 0 ? 1 : -1;
  x = Math.abs(x);
  const a1 = 0.254829592, a2 = -0.284496736,
        a3 = 1.421413741, a4 = -1.453152027,
        a5 = 1.061405429, p = 0.3275911;
  const t = 1 / (1 + p * x);
  const y = 1 - (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t) * Math.exp(-x * x);
  return sign * y;
};
const normCDF = x => 0.5 * (1 + erf(x / Math.sqrt(2)));

function greeks({ S, K, r, t, iv, type }) {
  const d1 = (Math.log(S / K) + (r + 0.5 * iv * iv) * t) / (iv * Math.sqrt(t));
  const d2 = d1 - iv * Math.sqrt(t);

  return {
    delta: type === "CE" ? normCDF(d1) : normCDF(d1) - 1,
    gamma: normPDF(d1) / (S * iv * Math.sqrt(t)),
    vega: (S * normPDF(d1) * Math.sqrt(t)) / 100,
    theta:
      type === "CE"
        ? (-S * normPDF(d1) * iv / (2 * Math.sqrt(t)) -
            r * K * Math.exp(-r * t) * normCDF(d2)) / 365
        : (-S * normPDF(d1) * iv / (2 * Math.sqrt(t)) +
            r * K * Math.exp(-r * t) * normCDF(-d2)) / 365
  };
}
