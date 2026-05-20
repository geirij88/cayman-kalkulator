const TAX_RATE_COMMON = 0.22;
const SOCIAL_SECURITY_RATE = 0.076;
const G_AMOUNT = 130160;
const DNB_LOW_LIMIT_G = 7.1;
const DNB_HIGH_LIMIT_G = 12;
const DNB_LOW_RATE = 0.03;
const DNB_HIGH_RATE = 0.15;
const MPK_RATE = 0.033;
const MPK_MAX_G = 12;
const FREE_DAY_ALLOWANCE_RATE = 177;

const TAX_BRACKETS = [
  { from: 226100, to: 318300, rate: 0.017 },
  { from: 318300, to: 725050, rate: 0.04 },
  { from: 725050, to: 980100, rate: 0.137 },
  { from: 980100, to: 1467200, rate: 0.168 },
  { from: 1467200, to: Infinity, rate: 0.178 },
];

const form = document.querySelector("#caymanForm");
const offerForm = document.querySelector("#offerForm");
const tabButtons = document.querySelectorAll("[data-tab-target]");
const tabPanels = document.querySelectorAll("[data-tab-panel]");
const fields = {
  annualSalary: document.querySelector("#annualSalary"),
  eurOffer: document.querySelector("#eurOffer"),
  eurRate: document.querySelector("#eurRate"),
  freeDayCount: document.querySelector("#freeDayCount"),
  navRate: document.querySelector("#navRate"),
  offerCurrentSalary: document.querySelector("#offerCurrentSalary"),
  offerNavRate: document.querySelector("#offerNavRate"),
  offerRate: document.querySelector("#offerRate"),
  offerSalaryEur: document.querySelector("#offerSalaryEur"),
};

const output = {
  baseSalaryToday: document.querySelector("#baseSalaryToday"),
  commonTax: document.querySelector("#commonTax"),
  socialTax: document.querySelector("#socialTax"),
  bracketTax: document.querySelector("#bracketTax"),
  bracketTaxLabel: document.querySelector("#bracketTaxLabel"),
  breakEvenCurrentNet: document.querySelector("#breakEvenCurrentNet"),
  breakEvenEurDetail: document.querySelector("#breakEvenEurDetail"),
  breakEvenFixedCosts: document.querySelector("#breakEvenFixedCosts"),
  breakEvenFormula: document.querySelector("#breakEvenFormula"),
  breakEvenBracketTax: document.querySelector("#breakEvenBracketTax"),
  breakEvenBracketTaxLabel: document.querySelector("#breakEvenBracketTaxLabel"),
  breakEvenCommonTax: document.querySelector("#breakEvenCommonTax"),
  breakEvenNavRate: document.querySelector("#breakEvenNavRate"),
  breakEvenNavCost: document.querySelector("#breakEvenNavCost"),
  breakEvenNetCheck: document.querySelector("#breakEvenNetCheck"),
  breakEvenNok: document.querySelector("#breakEvenNok"),
  breakEvenPensionCost: document.querySelector("#breakEvenPensionCost"),
  breakEvenSocialTax: document.querySelector("#breakEvenSocialTax"),
  breakEvenTax: document.querySelector("#breakEvenTax"),
  totalTax: document.querySelector("#totalTax"),
  totalSalaryToday: document.querySelector("#totalSalaryToday"),
  netSalary: document.querySelector("#netSalary"),
  navCost: document.querySelector("#navCost"),
  mpkCost: document.querySelector("#mpkCost"),
  mpkBasis: document.querySelector("#mpkBasis"),
  mpkValuePreview: document.querySelector("#mpkValuePreview"),
  cbaPensionCost: document.querySelector("#cbaPensionCost"),
  pensionLowBasis: document.querySelector("#pensionLowBasis"),
  pensionHighBasis: document.querySelector("#pensionHighBasis"),
  pensionLowValue: document.querySelector("#pensionLowValue"),
  pensionHighValue: document.querySelector("#pensionHighValue"),
  pensionTotalPreview: document.querySelector("#pensionTotalPreview"),
  directValue: document.querySelector("#directValue"),
  freeDayIncomeToday: document.querySelector("#freeDayIncomeToday"),
  grossUpBase: document.querySelector("#grossUpBase"),
  grossUpTax: document.querySelector("#grossUpTax"),
  grossCommonTax: document.querySelector("#grossCommonTax"),
  grossSocialTax: document.querySelector("#grossSocialTax"),
  compBracketTax: document.querySelector("#compBracketTax"),
  compBracketTaxLabel: document.querySelector("#compBracketTaxLabel"),
  grossCompensation: document.querySelector("#grossCompensation"),
  grossCheck: document.querySelector("#grossCheck"),
  equivalentSalary: document.querySelector("#equivalentSalary"),
  monthlyEquivalentSalary: document.querySelector("#monthlyEquivalentSalary"),
  marginalTax: document.querySelector("#marginalTax"),
  mobileAnnualSalary: document.querySelector("#mobileAnnualSalary"),
  mobileDirectValue: document.querySelector("#mobileDirectValue"),
  mobileEquivalentSalary: document.querySelector("#mobileEquivalentSalary"),
  equivalentEuroMonth: document.querySelector("#equivalentEuroMonth"),
  equivalentEuroYear: document.querySelector("#equivalentEuroYear"),
  euroNote: document.querySelector("#euroNote"),
  eurOfferNokMonth: document.querySelector("#eurOfferNokMonth"),
  eurOfferNokYear: document.querySelector("#eurOfferNokYear"),
  summaryText: document.querySelector("#summaryText"),
  bracketWarning: document.querySelector("#bracketWarning"),
  printAnnualSalary: document.querySelector("#printAnnualSalary"),
  printDirectValue: document.querySelector("#printDirectValue"),
  printEquivalentEuroMonth: document.querySelector("#printEquivalentEuroMonth"),
  printEquivalentEuroYear: document.querySelector("#printEquivalentEuroYear"),
  printEquivalentSalary: document.querySelector("#printEquivalentSalary"),
  printEurRate: document.querySelector("#printEurRate"),
  printGrossCompensation: document.querySelector("#printGrossCompensation"),
  printGrossUpTax: document.querySelector("#printGrossUpTax"),
  printMonthlyEquivalentSalary: document.querySelector("#printMonthlyEquivalentSalary"),
  printMpkCost: document.querySelector("#printMpkCost"),
  printNavCost: document.querySelector("#printNavCost"),
  printNetSalary: document.querySelector("#printNetSalary"),
  printPensionCost: document.querySelector("#printPensionCost"),
  printTotalTax: document.querySelector("#printTotalTax"),
  navDirectCost: document.querySelector("#navDirectCost"),
  navGrossBracketTax: document.querySelector("#navGrossBracketTax"),
  navGrossNeeded: document.querySelector("#navGrossNeeded"),
  navGrossNote: document.querySelector("#navGrossNote"),
  navGrossTax: document.querySelector("#navGrossTax"),
  offerBreakEven: document.querySelector("#offerBreakEven"),
  offerBracketTax: document.querySelector("#offerBracketTax"),
  offerBracketTaxLabel: document.querySelector("#offerBracketTaxLabel"),
  offerCompareCurrent: document.querySelector("#offerCompareCurrent"),
  offerCompareDifference: document.querySelector("#offerCompareDifference"),
  offerCompareDifferenceLine: document.querySelector("#offerCompareDifferenceLine"),
  offerCompareNew: document.querySelector("#offerCompareNew"),
  offerCompareRate: document.querySelector("#offerCompareRate"),
  offerCommonTax: document.querySelector("#offerCommonTax"),
  offerCurrentNet: document.querySelector("#offerCurrentNet"),
  offerCurrentSalaryNok: document.querySelector("#offerCurrentSalaryNok"),
  offerCurrentTax: document.querySelector("#offerCurrentTax"),
  offerDifference: document.querySelector("#offerDifference"),
  offerFinalNet: document.querySelector("#offerFinalNet"),
  offerMpkCost: document.querySelector("#offerMpkCost"),
  offerNavCost: document.querySelector("#offerNavCost"),
  offerNetAfterTax: document.querySelector("#offerNetAfterTax"),
  offerNote: document.querySelector("#offerNote"),
  offerPensionCost: document.querySelector("#offerPensionCost"),
  offerSalaryEurOut: document.querySelector("#offerSalaryEurOut"),
  offerSalaryNok: document.querySelector("#offerSalaryNok"),
  offerSocialTax: document.querySelector("#offerSocialTax"),
  offerStatusCard: document.querySelector("#offerStatusCard"),
  offerStatusText: document.querySelector("#offerStatusText"),
  offerTax: document.querySelector("#offerTax"),
  offerTaxNote: document.querySelector("#offerTaxNote"),
};

const money = new Intl.NumberFormat("nb-NO", {
  style: "currency",
  currency: "NOK",
  maximumFractionDigits: 0,
});

const percent = new Intl.NumberFormat("nb-NO", {
  maximumFractionDigits: 1,
  minimumFractionDigits: 1,
});

const rateFormat = new Intl.NumberFormat("nb-NO", {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

function kroner(amount) {
  return money.format(Math.round(amount));
}

function euro(amount) {
  return `${new Intl.NumberFormat("nb-NO", {
    maximumFractionDigits: 0,
  }).format(Math.round(amount))} EUR`;
}

function rateText(amount) {
  return rateFormat.format(amount);
}

function numberValue(field) {
  return Number(fields[field].value) || 0;
}

function calculateBracketTax(income) {
  return TAX_BRACKETS.reduce((sum, bracket) => {
    const taxablePart = Math.max(0, Math.min(income, bracket.to) - bracket.from);
    return sum + taxablePart * bracket.rate;
  }, 0);
}

function findTaxBracket(income) {
  if (income <= TAX_BRACKETS[0].from) return 0;
  const index = TAX_BRACKETS.findIndex((bracket) => income > bracket.from && income <= bracket.to);
  return index >= 0 ? index + 1 : TAX_BRACKETS.length;
}

function calculateTotalTax(income) {
  return income * TAX_RATE_COMMON +
    income * SOCIAL_SECURITY_RATE +
    calculateBracketTax(income);
}

function calculateExtraTaxBreakdown(baseSalary, grossExtra) {
  return {
    bracket: calculateBracketTax(baseSalary + grossExtra) - calculateBracketTax(baseSalary),
    common: grossExtra * TAX_RATE_COMMON,
    social: grossExtra * SOCIAL_SECURITY_RATE,
  };
}

function calculateDnbPension(income) {
  const lowLimit = G_AMOUNT * DNB_LOW_LIMIT_G;
  const highLimit = G_AMOUNT * DNB_HIGH_LIMIT_G;
  const lowBasis = Math.min(income, lowLimit);
  const highBasis = Math.max(0, Math.min(income, highLimit) - lowLimit);
  const lowValue = lowBasis * DNB_LOW_RATE;
  const highValue = highBasis * DNB_HIGH_RATE;

  return {
    highBasis,
    highValue,
    lowBasis,
    lowValue,
    total: lowValue + highValue,
  };
}

function calculateMpk(income) {
  const basis = Math.min(income, G_AMOUNT * MPK_MAX_G);

  return {
    basis,
    value: basis * MPK_RATE,
  };
}

function calculateGrossUp(baseSalary, targetNetValue) {
  if (targetNetValue <= 0) {
    return {
      grossCompensation: 0,
      taxOnCompensation: 0,
    };
  }

  let low = targetNetValue;
  let high = targetNetValue * 3;
  const baseTax = calculateTotalTax(baseSalary);

  while (high - (calculateTotalTax(baseSalary + high) - baseTax) < targetNetValue) {
    high *= 1.5;
  }

  for (let i = 0; i < 80; i += 1) {
    const middle = (low + high) / 2;
    const extraTax = calculateTotalTax(baseSalary + middle) - baseTax;
    const netExtra = middle - extraTax;

    if (netExtra >= targetNetValue) high = middle;
    else low = middle;
  }

  const grossCompensation = high;
  const taxOnCompensation = calculateTotalTax(baseSalary + grossCompensation) - baseTax;

  return {
    grossCompensation,
    taxOnCompensation,
  };
}

function calculateOfferBreakEven(currentSalary, navRate, fixedPensionCost) {
  const currentNet = currentSalary - calculateTotalTax(currentSalary);
  let low = 0;
  let high = Math.max(currentSalary * 2, fixedPensionCost * 4, 100000);

  const netAfterCosts = (grossSalary) =>
    grossSalary - calculateTotalTax(grossSalary) - (grossSalary * navRate) - fixedPensionCost;

  while (netAfterCosts(high) < currentNet) {
    high *= 1.5;
  }

  for (let i = 0; i < 80; i += 1) {
    const middle = (low + high) / 2;
    if (netAfterCosts(middle) >= currentNet) high = middle;
    else low = middle;
  }

  return high;
}

function setOfferStatus(difference, hasOffer) {
  output.offerStatusCard.classList.toggle("positive", hasOffer && difference >= 0);
  output.offerStatusCard.classList.toggle("negative", hasOffer && difference < 0);

  if (!hasOffer) {
    output.offerStatusText.textContent = "Skriv inn eurotilbudet for å se om du havner pluss eller minus.";
    return;
  }

  output.offerStatusText.textContent = difference >= 0
    ? "Tilbudet ser ut til å dekke dagens netto og de valgte kostnadene."
    : "Tilbudet dekker ikke dagens netto når skatt, frivillig medlemskap og tapte pensjonsordninger trekkes fra.";
}

function calculate() {
  const annualSalary = numberValue("annualSalary");
  const eurRate = numberValue("eurRate") || 1;
  const eurOffer = numberValue("eurOffer");
  const freeDayCount = numberValue("freeDayCount");
  const navRate = numberValue("navRate") / 100;
  const freeDayCost = freeDayCount * FREE_DAY_ALLOWANCE_RATE;
  const currentTotalSalary = annualSalary + freeDayCost;
  const dnbPension = calculateDnbPension(annualSalary);
  const mpk = calculateMpk(annualSalary);

  const commonTax = currentTotalSalary * TAX_RATE_COMMON;
  const socialTax = currentTotalSalary * SOCIAL_SECURITY_RATE;
  const bracketTax = calculateBracketTax(currentTotalSalary);
  const totalTax = commonTax + socialTax + bracketTax;
  const netSalary = currentTotalSalary - totalTax;

  const navCost = annualSalary * navRate;
  const mpkCost = mpk.value;
  const directValue = navCost + mpkCost + dnbPension.total;
  const grossUp = calculateGrossUp(currentTotalSalary, directValue);
  const navGrossUp = calculateGrossUp(currentTotalSalary, navCost);
  const equivalentSalary = currentTotalSalary + grossUp.grossCompensation;
  const grossTaxBreakdown = calculateExtraTaxBreakdown(currentTotalSalary, grossUp.grossCompensation);
  const navTaxBreakdown = calculateExtraTaxBreakdown(currentTotalSalary, navGrossUp.grossCompensation);
  const compBracketTax = grossTaxBreakdown.bracket;
  const marginalTaxRate = grossUp.grossCompensation > 0
    ? grossUp.taxOnCompensation / grossUp.grossCompensation
    : 0;

  output.baseSalaryToday.textContent = kroner(annualSalary);
  output.freeDayIncomeToday.textContent = kroner(freeDayCost);
  output.totalSalaryToday.textContent = kroner(currentTotalSalary);
  output.commonTax.textContent = kroner(commonTax);
  output.socialTax.textContent = kroner(socialTax);
  output.bracketTaxLabel.textContent = `Trinnskatt (${findTaxBracket(currentTotalSalary)})`;
  output.bracketTax.textContent = kroner(bracketTax);
  output.totalTax.textContent = kroner(totalTax);
  output.netSalary.textContent = kroner(netSalary);
  output.navCost.textContent = kroner(navCost);
  output.mpkCost.textContent = kroner(mpkCost);
  output.mpkBasis.textContent = kroner(mpk.basis);
  output.mpkValuePreview.textContent = kroner(mpk.value);
  output.cbaPensionCost.textContent = kroner(dnbPension.total);
  output.pensionLowBasis.textContent = kroner(dnbPension.lowBasis);
  output.pensionHighBasis.textContent = kroner(dnbPension.highBasis);
  output.pensionLowValue.textContent = kroner(dnbPension.lowValue);
  output.pensionHighValue.textContent = kroner(dnbPension.highValue);
  output.pensionTotalPreview.textContent = kroner(dnbPension.total);
  output.directValue.textContent = kroner(directValue);
  output.navDirectCost.textContent = kroner(navCost);
  output.navGrossTax.textContent = kroner(navGrossUp.taxOnCompensation);
  output.navGrossBracketTax.textContent = kroner(navTaxBreakdown.bracket);
  output.navGrossNeeded.textContent = kroner(navGrossUp.grossCompensation);
  output.navGrossNote.textContent =
    `${kroner(navCost)} er selve kostnaden. For at du skal sitte igjen med dette etter skatt, må brutto lønn økes med omtrent ${kroner(navGrossUp.grossCompensation)}. Differansen er skatt på kompensasjonen.`;
  output.mobileAnnualSalary.textContent = kroner(currentTotalSalary);
  output.mobileDirectValue.textContent = kroner(directValue);
  output.grossUpBase.textContent = kroner(directValue);
  output.grossUpTax.textContent = kroner(grossUp.taxOnCompensation);
  output.grossCommonTax.textContent = kroner(grossTaxBreakdown.common);
  output.grossSocialTax.textContent = kroner(grossTaxBreakdown.social);
  output.compBracketTaxLabel.textContent = `Herav trinnskatt (${findTaxBracket(equivalentSalary)})`;
  output.compBracketTax.textContent = kroner(compBracketTax);
  output.grossCompensation.textContent = kroner(grossUp.grossCompensation);
  output.grossCheck.textContent =
    `${kroner(grossUp.grossCompensation)} - ${kroner(grossUp.taxOnCompensation)} = ca. ${kroner(directValue)}`;
  output.equivalentSalary.textContent = kroner(equivalentSalary);
  output.mobileEquivalentSalary.textContent = kroner(equivalentSalary);
  output.monthlyEquivalentSalary.textContent = kroner(equivalentSalary / 12);
  output.marginalTax.textContent = `${percent.format(marginalTaxRate * 100)} %`;
  output.summaryText.textContent =
    `Med ${kroner(currentTotalSalary)} i norsk årslønn inkludert fridagskostpenger må ny lønn være omtrent ${kroner(equivalentSalary)} for at ${kroner(directValue)} i tapte ordninger skal være dekket etter skatt.`;
  output.bracketWarning.hidden = equivalentSalary <= 1467200;
  output.bracketWarning.textContent = equivalentSalary > 1467200
    ? `Ny likeverdig årslønn passerer trinn 5-grensen på ${kroner(1467200)}. Delen over grensen får 17,8 % trinnskatt, og dette er inkludert i gross-up.`
    : "";

  const equivalentEuroYear = equivalentSalary / eurRate;
  const eurOfferNokYear = eurOffer * eurRate;
  output.equivalentEuroYear.textContent = euro(equivalentEuroYear);
  output.equivalentEuroMonth.textContent = euro(equivalentEuroYear / 12);
  output.eurOfferNokYear.textContent = eurOffer > 0 ? kroner(eurOfferNokYear) : "Skriv inn EUR";
  output.eurOfferNokMonth.textContent = eurOffer > 0 ? kroner(eurOfferNokYear / 12) : "0 kr";
  output.euroNote.textContent =
    `Ved kurs ${rateText(eurRate)} tilsvarer likeverdig årslønn ${euro(equivalentEuroYear)}.`;

  output.printAnnualSalary.textContent = kroner(currentTotalSalary);
  output.printTotalTax.textContent = kroner(totalTax);
  output.printNetSalary.textContent = kroner(netSalary);
  output.printNavCost.textContent = kroner(navCost);
  output.printMpkCost.textContent = kroner(mpkCost);
  output.printPensionCost.textContent = kroner(dnbPension.total);
  output.printDirectValue.textContent = kroner(directValue);
  output.printGrossUpTax.textContent = kroner(grossUp.taxOnCompensation);
  output.printGrossCompensation.textContent = kroner(grossUp.grossCompensation);
  output.printEquivalentSalary.textContent = kroner(equivalentSalary);
  output.printMonthlyEquivalentSalary.textContent = kroner(equivalentSalary / 12);
  output.printEurRate.textContent = rateText(eurRate);
  output.printEquivalentEuroYear.textContent = euro(equivalentEuroYear);
  output.printEquivalentEuroMonth.textContent = euro(equivalentEuroYear / 12);
}

function calculateOffer() {
  const currentSalary = Number(fields.offerCurrentSalary.value) || 0;
  const offerSalaryEur = Number(fields.offerSalaryEur.value) || 0;
  const offerRate = Number(fields.offerRate.value) || 1;
  const navRate = (Number(fields.offerNavRate.value) || 0) / 100;
  const currentTax = calculateTotalTax(currentSalary);
  const currentNet = currentSalary - currentTax;
  const offerSalaryNok = offerSalaryEur * offerRate;
  const offerCommonTax = offerSalaryNok * TAX_RATE_COMMON;
  const offerSocialTax = offerSalaryNok * SOCIAL_SECURITY_RATE;
  const offerBracketTax = calculateBracketTax(offerSalaryNok);
  const offerTax = offerCommonTax + offerSocialTax + offerBracketTax;
  const offerNetAfterTax = offerSalaryNok - offerTax;
  const offerNavCost = offerSalaryNok * navRate;
  const currentMpk = calculateMpk(currentSalary).value;
  const currentPension = calculateDnbPension(currentSalary).total;
  const fixedPensionCost = currentMpk + currentPension;
  const offerFinalNet = offerNetAfterTax - offerNavCost - fixedPensionCost;
  const difference = offerFinalNet - currentNet;
  const breakEvenNok = calculateOfferBreakEven(currentSalary, navRate, fixedPensionCost);
  const breakEvenEur = breakEvenNok / offerRate;
  const breakEvenCommonTax = breakEvenNok * TAX_RATE_COMMON;
  const breakEvenSocialTax = breakEvenNok * SOCIAL_SECURITY_RATE;
  const breakEvenBracketTax = calculateBracketTax(breakEvenNok);
  const breakEvenTax = calculateTotalTax(breakEvenNok);
  const breakEvenNavCost = breakEvenNok * navRate;
  const breakEvenNetCheck = breakEvenNok - breakEvenTax - breakEvenNavCost - fixedPensionCost;
  const hasOffer = offerSalaryEur > 0;

  output.offerCurrentSalaryNok.textContent = kroner(currentSalary);
  output.offerCurrentTax.textContent = kroner(currentTax);
  output.offerCurrentNet.textContent = kroner(currentNet);
  output.offerSalaryEurOut.textContent = euro(offerSalaryEur);
  output.offerSalaryNok.textContent = kroner(offerSalaryNok);
  output.offerTax.textContent = kroner(offerTax);
  output.offerCommonTax.textContent = kroner(offerCommonTax);
  output.offerSocialTax.textContent = kroner(offerSocialTax);
  output.offerBracketTaxLabel.textContent = `Herav trinnskatt (${findTaxBracket(offerSalaryNok)})`;
  output.offerBracketTax.textContent = kroner(offerBracketTax);
  output.offerNetAfterTax.textContent = kroner(offerNetAfterTax);
  output.offerTaxNote.textContent =
    `${kroner(offerTax)} = ${kroner(offerCommonTax)} i 22 % skatt + ${kroner(offerSocialTax)} i trygdeavgift + ${kroner(offerBracketTax)} i trinnskatt.`;
  output.offerNavCost.textContent = kroner(offerNavCost);
  output.offerMpkCost.textContent = kroner(currentMpk);
  output.offerPensionCost.textContent = kroner(currentPension);
  output.offerFinalNet.textContent = hasOffer ? kroner(offerFinalNet) : "Skriv inn tilbud";
  output.offerCompareRate.textContent = rateText(offerRate);
  output.offerCompareCurrent.textContent = kroner(currentNet);
  output.offerCompareNew.textContent = hasOffer ? kroner(offerFinalNet) : "Skriv inn tilbud";
  output.offerDifference.textContent = hasOffer ? kroner(difference) : "Skriv inn tilbud";
  output.offerCompareDifference.textContent = hasOffer ? kroner(difference) : "Skriv inn tilbud";
  output.offerCompareNew.classList.toggle("positive-value", hasOffer && offerFinalNet >= 0);
  output.offerCompareNew.classList.toggle("negative-value", hasOffer && offerFinalNet < 0);
  output.offerCompareDifferenceLine.classList.toggle("positive-line", hasOffer && difference >= 0);
  output.offerCompareDifferenceLine.classList.toggle("negative-line", hasOffer && difference < 0);
  output.offerBreakEven.textContent = `${euro(breakEvenEur)} / ${kroner(breakEvenNok)}`;
  output.offerNote.textContent =
    `Nullpunktet er funnet ved å prøve seg frem til en bruttolønn der netto etter skatt, frivillig medlemskap og tapte pensjonsordninger blir lik netto i dag.`;
  output.breakEvenCurrentNet.textContent = kroner(currentNet);
  output.breakEvenFixedCosts.textContent = kroner(fixedPensionCost);
  output.breakEvenNavRate.textContent = `${percent.format(navRate * 100)} %`;
  output.breakEvenNok.textContent = kroner(breakEvenNok);
  output.breakEvenTax.textContent = kroner(breakEvenTax);
  output.breakEvenCommonTax.textContent = kroner(breakEvenCommonTax);
  output.breakEvenSocialTax.textContent = kroner(breakEvenSocialTax);
  output.breakEvenBracketTaxLabel.textContent = `Herav trinnskatt (${findTaxBracket(breakEvenNok)})`;
  output.breakEvenBracketTax.textContent = kroner(breakEvenBracketTax);
  output.breakEvenNavCost.textContent = kroner(breakEvenNavCost);
  output.breakEvenPensionCost.textContent = kroner(fixedPensionCost);
  output.breakEvenNetCheck.textContent = kroner(breakEvenNetCheck);
  output.breakEvenFormula.textContent = `${kroner(breakEvenNok)} / ${rateText(offerRate)}`;
  output.breakEvenEurDetail.textContent = euro(breakEvenEur);

  setOfferStatus(difference, hasOffer);
}

function syncOfferDefaults() {
  fields.offerCurrentSalary.value = fields.annualSalary.value;
  fields.offerRate.value = fields.eurRate.value;
  fields.offerNavRate.value = fields.navRate.value;
  calculateOffer();
}

function switchTab(target) {
  tabButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.tabTarget === target);
  });

  tabPanels.forEach((panel) => {
    const isActive = panel.dataset.tabPanel === target;
    panel.classList.toggle("active", isActive);
    panel.hidden = !isActive;
  });

  if (target === "offer") syncOfferDefaults();
}

form.addEventListener("input", calculate);
form.addEventListener("change", calculate);
fields.eurRate.addEventListener("input", calculate);
fields.eurRate.addEventListener("change", calculate);
fields.eurOffer.addEventListener("input", calculate);
fields.eurOffer.addEventListener("change", calculate);
offerForm.addEventListener("input", calculateOffer);
offerForm.addEventListener("change", calculateOffer);

tabButtons.forEach((button) => {
  button.addEventListener("click", () => switchTab(button.dataset.tabTarget));
});

calculate();
calculateOffer();
