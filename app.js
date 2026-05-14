const TAX_RATE_COMMON = 0.22;
const SOCIAL_SECURITY_RATE = 0.076;
const G_AMOUNT = 130160;
const DNB_LOW_LIMIT_G = 7.1;
const DNB_HIGH_LIMIT_G = 12;
const DNB_LOW_RATE = 0.03;
const DNB_HIGH_RATE = 0.15;
const MPK_RATE = 0.033;
const MPK_MAX_G = 12;

const TAX_BRACKETS = [
  { from: 226100, to: 318300, rate: 0.017 },
  { from: 318300, to: 725050, rate: 0.04 },
  { from: 725050, to: 980100, rate: 0.137 },
  { from: 980100, to: 1467200, rate: 0.168 },
  { from: 1467200, to: Infinity, rate: 0.178 },
];

const form = document.querySelector("#caymanForm");
const fields = {
  annualSalary: document.querySelector("#annualSalary"),
  eurOffer: document.querySelector("#eurOffer"),
  eurRate: document.querySelector("#eurRate"),
  navRate: document.querySelector("#navRate"),
};

const output = {
  commonTax: document.querySelector("#commonTax"),
  socialTax: document.querySelector("#socialTax"),
  bracketTax: document.querySelector("#bracketTax"),
  bracketTaxLabel: document.querySelector("#bracketTaxLabel"),
  totalTax: document.querySelector("#totalTax"),
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
  grossUpBase: document.querySelector("#grossUpBase"),
  grossUpTax: document.querySelector("#grossUpTax"),
  compBracketTax: document.querySelector("#compBracketTax"),
  compBracketTaxLabel: document.querySelector("#compBracketTaxLabel"),
  grossCompensation: document.querySelector("#grossCompensation"),
  equivalentSalary: document.querySelector("#equivalentSalary"),
  monthlyEquivalentSalary: document.querySelector("#monthlyEquivalentSalary"),
  marginalTax: document.querySelector("#marginalTax"),
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

function kroner(amount) {
  return money.format(Math.round(amount));
}

function euro(amount) {
  return `${new Intl.NumberFormat("nb-NO", {
    maximumFractionDigits: 0,
  }).format(Math.round(amount))} EUR`;
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

function calculate() {
  const annualSalary = numberValue("annualSalary");
  const eurRate = numberValue("eurRate") || 1;
  const eurOffer = numberValue("eurOffer");
  const navRate = numberValue("navRate") / 100;
  const dnbPension = calculateDnbPension(annualSalary);
  const mpk = calculateMpk(annualSalary);

  const commonTax = annualSalary * TAX_RATE_COMMON;
  const socialTax = annualSalary * SOCIAL_SECURITY_RATE;
  const bracketTax = calculateBracketTax(annualSalary);
  const totalTax = commonTax + socialTax + bracketTax;
  const netSalary = annualSalary - totalTax;

  const navCost = annualSalary * navRate;
  const mpkCost = mpk.value;
  const directValue = navCost + mpkCost + dnbPension.total;
  const grossUp = calculateGrossUp(annualSalary, directValue);
  const equivalentSalary = annualSalary + grossUp.grossCompensation;
  const compBracketTax = calculateBracketTax(equivalentSalary) - bracketTax;
  const marginalTaxRate = grossUp.grossCompensation > 0
    ? grossUp.taxOnCompensation / grossUp.grossCompensation
    : 0;

  output.commonTax.textContent = kroner(commonTax);
  output.socialTax.textContent = kroner(socialTax);
  output.bracketTaxLabel.textContent = `Trinnskatt (${findTaxBracket(annualSalary)})`;
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
  output.grossUpBase.textContent = kroner(directValue);
  output.grossUpTax.textContent = kroner(grossUp.taxOnCompensation);
  output.compBracketTaxLabel.textContent = `Herav trinnskatt (${findTaxBracket(equivalentSalary)})`;
  output.compBracketTax.textContent = kroner(compBracketTax);
  output.grossCompensation.textContent = kroner(grossUp.grossCompensation);
  output.equivalentSalary.textContent = kroner(equivalentSalary);
  output.monthlyEquivalentSalary.textContent = kroner(equivalentSalary / 12);
  output.marginalTax.textContent = `${percent.format(marginalTaxRate * 100)} %`;
  output.summaryText.textContent =
    `Med ${kroner(annualSalary)} i norsk årslønn må ny lønn være omtrent ${kroner(equivalentSalary)} for at ${kroner(directValue)} i tapte ordninger skal være dekket etter skatt.`;
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
    `Ved kurs ${eurRate.toLocaleString("nb-NO")} tilsvarer likeverdig årslønn ${euro(equivalentEuroYear)}.`;

  output.printAnnualSalary.textContent = kroner(annualSalary);
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
  output.printEurRate.textContent = eurRate.toLocaleString("nb-NO");
  output.printEquivalentEuroYear.textContent = euro(equivalentEuroYear);
  output.printEquivalentEuroMonth.textContent = euro(equivalentEuroYear / 12);
}

form.addEventListener("input", calculate);
form.addEventListener("change", calculate);
fields.eurRate.addEventListener("input", calculate);
fields.eurRate.addEventListener("change", calculate);
fields.eurOffer.addEventListener("input", calculate);
fields.eurOffer.addEventListener("change", calculate);

calculate();
