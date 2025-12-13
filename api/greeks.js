const ce = greeks({ S, K, r, t, iv, type: "CE" });
const pe = greeks({ S, K, r, t, iv, type: "PE" });

res.status(200).json({
  CE: ce,
  PE: pe,
  DIFF: {
    delta: +(ce.delta - pe.delta).toFixed(2),
    gamma: +(ce.gamma - pe.gamma).toFixed(4),
    vega: +(ce.vega - pe.vega).toFixed(2),
    theta: +(ce.theta - pe.theta).toFixed(2)
  },
  ts: Date.now()
});
