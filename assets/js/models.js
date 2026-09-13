(function () {
  const D = window.RESEARCH_DATA;

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function pctFromLogBeta(beta) {
    return (Math.exp(beta) - 1) * 100;
  }

  function predictCost(input) {
    const area = clamp(Number(input.area), D.cost.range.area.min, D.cost.range.area.max);
    const production = clamp(Number(input.production), D.cost.range.production.min, D.cost.range.production.max);
    const shortage = clamp(Number(input.shortage), 1, 5);
    const decline = clamp(Number(input.decline), 1, 5);
    const irrigationBeta = D.cost.irrigation[input.irrigation]?.beta ?? 0;
    const sourceBeta = D.cost.source[input.source]?.beta ?? 0;

    const logCost = D.cost.intercept
      + D.cost.coefficients.lnArea * Math.log(area)
      + D.cost.coefficients.lnProduction * Math.log(production)
      + irrigationBeta
      + sourceBeta
      + D.cost.coefficients.shortage * shortage
      + D.cost.coefficients.decline * decline;

    return {
      area,
      production,
      shortage,
      decline,
      logCost,
      costMillion: Math.exp(logCost),
      inSample: Number(input.area) >= D.cost.range.area.min
        && Number(input.area) <= D.cost.range.area.max
        && Number(input.production) >= D.cost.range.production.min
        && Number(input.production) <= D.cost.range.production.max
    };
  }

  function wtpScenario(households, bidAmount) {
    const N = Math.max(1, Math.round(Number(households) || 1));
    const bid = D.wtp.bids.find((x) => x.amount === Number(bidAmount)) || D.wtp.bids[0];
    const expectedParticipants = N * bid.rate;
    const annualFunds = expectedParticipants * bid.amount;
    return { households: N, ...bid, expectedParticipants, annualFunds };
  }

  function landShortageComparison(fromLevel, toLevel) {
    const from = clamp(Number(fromLevel), 1, 5);
    const to = clamp(Number(toLevel), 1, 5);
    const delta = to - from;
    const betaDelta = D.land.shortage.beta * delta;
    return {
      from,
      to,
      delta,
      relativePct: pctFromLogBeta(betaDelta),
      oneStepPct: pctFromLogBeta(D.land.shortage.beta)
    };
  }

  window.MODELS = Object.freeze({ clamp, pctFromLogBeta, predictCost, wtpScenario, landShortageComparison });
})();
