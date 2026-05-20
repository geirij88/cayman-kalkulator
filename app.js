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
const SEAFARER_DEDUCTION_RATE = 0.30;
const SEAFARER_DEDUCTION_MAX = 86300;
const TABLE_TAX_MONTHS = 10.5;

const TAX_TABLE_CHOICES = [
  { code: "", label: "Velg tabell fra Skatteetaten", type: "none", amount: 0 },
  ...Array.from({ length: 41 }, (_, index) => {
    const amount = index * 10000;
    return {
      amount,
      code: String(8000 + index * 10),
      label: `${8000 + index * 10} - fradrag ${amount.toLocaleString("nb-NO")} kr`,
      type: "deduction",
    };
  }),
  ...Array.from({ length: 40 }, (_, index) => {
    const amount = (index + 1) * 10000;
    return {
      amount,
      code: String(9010 + index * 10),
      label: `${9010 + index * 10} - tillegg ${amount.toLocaleString("nb-NO")} kr`,
      type: "addition",
    };
  }),
];

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
  offerSeafarerDeduction: document.querySelector("#offerSeafarerDeduction"),
  offerSalaryEur: document.querySelector("#offerSalaryEur"),
  offerTableCode: document.querySelector("#offerTableCode"),
  offerTableMonthlyTax: document.querySelector("#offerTableMonthlyTax"),
  offerUseTableTax: document.querySelector("#offerUseTableTax"),
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
  breakEvenCommonTaxLabel: document.querySelector("#breakEvenCommonTaxLabel"),
  breakEvenNavRate: document.querySelector("#breakEvenNavRate"),
  breakEvenNavCost: document.querySelector("#breakEvenNavCost"),
  breakEvenNetCheck: document.querySelector("#breakEvenNetCheck"),
  breakEvenNok: document.querySelector("#breakEvenNok"),
  breakEvenPensionCost: document.querySelector("#breakEvenPensionCost"),
  breakEvenSeafarerDeduction: document.querySelector("#breakEvenSeafarerDeduction"),
  breakEvenSeafarerTaxSaving: document.querySelector("#breakEvenSeafarerTaxSaving"),
  breakEvenSocialTax: document.querySelector("#breakEvenSocialTax"),
  breakEvenSocialTaxLabel: document.querySelector("#breakEvenSocialTaxLabel"),
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
  offerCommonTaxLabel: document.querySelector("#offerCommonTaxLabel"),
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
  offerSeafarerDeductionUsed: document.querySelector("#offerSeafarerDeductionUsed"),
  offerSeafarerTaxSaving: document.querySelector("#offerSeafarerTaxSaving"),
  offerSalaryEurOut: document.querySelector("#offerSalaryEurOut"),
  offerSalaryNok: document.querySelector("#offerSalaryNok"),
  offerSocialTax: document.querySelector("#offerSocialTax"),
  offerSocialTaxLabel: document.querySelector("#offerSocialTaxLabel"),
  offerStatusCard: document.querySelector("#offerStatusCard"),
  offerStatusText: document.querySelector("#offerStatusText"),
  offerTableInfo: document.querySelector("#offerTableInfo"),
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

function populateTaxTableChoices() {
  fields.offerTableCode.innerHTML = TAX_TABLE_CHOICES.map((choice) =>
    `<option value="${choice.code}">${choice.label}</option>`
  ).join("");
}

function selectedTaxTableChoice() {
  return TAX_TABLE_CHOICES.find((choice) => choice.code === fields.offerTableCode.value) || TAX_TABLE_CHOICES[0];
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

function calculateSeafarerDeduction(income, enabled) {
  if (!enabled) return 0;
  return Math.min(income * SEAFARER_DEDUCTION_RATE, SEAFARER_DEDUCTION_MAX);
}

function calculateTaxWithSeafarerDeduction(income, enabled) {
  const seafarerDeduction = calculateSeafarerDeduction(income, enabled);
  const commonBeforeDeduction = income * TAX_RATE_COMMON;
  const seafarerTaxSaving = seafarerDeduction * TAX_RATE_COMMON;
  const common = Math.max(0, commonBeforeDeduction - seafarerTaxSaving);
  const social = income * SOCIAL_SECURITY_RATE;
  const bracket = calculateBracketTax(income);

  return {
    bracket,
    common,
    commonBeforeDeduction,
    seafarerDeduction,
    seafarerTaxSaving,
    social,
    total: common + social + bracket,
  };
}

function calculateOfferTax(income, useSeafarerDeduction, useTableTax, monthlyTableTax) {
  if (!useTableTax) return calculateTaxWithSeafarerDeduction(income, useSeafarerDeduction);

  const tableTax = monthlyTableTax * TABLE_TAX_MONTHS;
  return {
    bracket: 0,
    common: monthlyTableTax,
    commonBeforeDeduction: monthlyTableTax,
    seafarerDeduction: useSeafarerDeduction ? calculateSeafarerDeduction(income, true) : 0,
    seafarerTaxSaving: 0,
    social: tableTax,
    total: tableTax,
    usesTableTax: true,
  };
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

function calculateOfferBreakEven(currentSalary, navRate, fixedPensionCost, useSeafarerDeduction, useTableTax, monthlyTableTax) {
  const currentNet = currentSalary - calculateTotalTax(currentSalary);
  let low = 0;
  let high = Math.max(currentSalary * 2, fixedPensionCost * 4, 100000);

  const netAfterCosts = (grossSalary) =>
    grossSalary -
    calculateOfferTax(grossSalary, useSeafarerDeduction, useTableTax, monthlyTableTax).total -
    (grossSalary * navRate) -
    fixedPensionCost;

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

function setOfferStatus(difference, hasOffer, missingTableTax = false) {
  output.offerStatusCard.classList.toggle("positive", hasOffer && !missingTableTax && difference >= 0);
  output.offerStatusCard.classList.toggle("negative", hasOffer && !missingTableTax && difference < 0);

  if (!hasOffer) {
    output.offerStatusText.textContent = "Skriv inn eurotilbudet for å se om du havner pluss eller minus.";
    return;
  }

  if (missingTableTax) {
    output.offerStatusText.textContent = "Skriv inn tabelltrekk per vanlig måned før tilbudet kan sammenlignes med dagens lønn.";
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
  const useSeafarerDeduction = fields.offerSeafarerDeduction.checked;
  const useTableTax = fields.offerUseTableTax.checked;
  const monthlyTableTax = Number(fields.offerTableMonthlyTax.value) || 0;
  const tableChoice = selectedTaxTableChoice();
  const missingTableTax = useTableTax && monthlyTableTax <= 0;
  const currentTax = calculateTotalTax(currentSalary);
  const currentNet = currentSalary - currentTax;
  const offerSalaryNok = offerSalaryEur * offerRate;
  const offerTaxBreakdown = calculateOfferTax(offerSalaryNok, useSeafarerDeduction, useTableTax, monthlyTableTax);
  const offerCommonTax = offerTaxBreakdown.common;
  const offerSocialTax = offerTaxBreakdown.social;
  const offerBracketTax = offerTaxBreakdown.bracket;
  const offerTax = offerTaxBreakdown.total;
  const offerNetAfterTax = offerSalaryNok - offerTax;
  const offerNavCost = offerSalaryNok * navRate;
  const currentMpk = calculateMpk(currentSalary).value;
  const currentPension = calculateDnbPension(currentSalary).total;
  const fixedPensionCost = currentMpk + currentPension;
  const offerFinalNet = offerNetAfterTax - offerNavCost - fixedPensionCost;
  const difference = offerFinalNet - currentNet;
  const breakEvenNok = calculateOfferBreakEven(currentSalary, navRate, fixedPensionCost, useSeafarerDeduction, useTableTax, monthlyTableTax);
  const breakEvenEur = breakEvenNok / offerRate;
  const breakEvenTaxBreakdown = calculateOfferTax(breakEvenNok, useSeafarerDeduction, useTableTax, monthlyTableTax);
  const breakEvenCommonTax = breakEvenTaxBreakdown.common;
  const breakEvenSocialTax = breakEvenTaxBreakdown.social;
  const breakEvenBracketTax = breakEvenTaxBreakdown.bracket;
  const breakEvenTax = breakEvenTaxBreakdown.total;
  const breakEvenNavCost = breakEvenNok * navRate;
  const breakEvenNetCheck = breakEvenNok - breakEvenTax - breakEvenNavCost - fixedPensionCost;
  const hasOffer = offerSalaryEur > 0;
  const canShowOfferResult = hasOffer && !missingTableTax;
  const taxText = (value) => missingTableTax ? "Skriv inn trekk" : kroner(value);
  const breakEvenText = (value) => missingTableTax ? "Skriv inn trekk" : kroner(value);

  output.offerCurrentSalaryNok.textContent = kroner(currentSalary);
  output.offerCurrentTax.textContent = kroner(currentTax);
  output.offerCurrentNet.textContent = kroner(currentNet);
  output.offerSalaryEurOut.textContent = euro(offerSalaryEur);
  output.offerSalaryNok.textContent = kroner(offerSalaryNok);
  output.offerTax.textContent = taxText(offerTax);
  output.offerCommonTaxLabel.textContent = useTableTax
    ? "Tabelltrekk per vanlig måned"
    : "Herav 22 % alminnelig skatt etter fradrag";
  output.offerCommonTax.textContent = taxText(offerCommonTax);
  output.offerSeafarerDeductionUsed.textContent = useTableTax ? "Se tabell" : kroner(offerTaxBreakdown.seafarerDeduction);
  output.offerSeafarerTaxSaving.textContent = useTableTax ? "Se tabell" : kroner(offerTaxBreakdown.seafarerTaxSaving);
  output.offerSocialTaxLabel.textContent = useTableTax
    ? `Årsskatt fra tabell (${TABLE_TAX_MONTHS.toLocaleString("nb-NO")} måneder)`
    : "Herav trygdeavgift 7,6 %";
  output.offerSocialTax.textContent = taxText(offerSocialTax);
  output.offerBracketTaxLabel.textContent = useTableTax
    ? "Herav trinnskatt"
    : `Herav trinnskatt (${findTaxBracket(offerSalaryNok)})`;
  output.offerBracketTax.textContent = useTableTax ? "Inngår i tabell" : kroner(offerBracketTax);
  output.offerNetAfterTax.textContent = canShowOfferResult ? kroner(offerNetAfterTax) : missingTableTax ? "Skriv inn trekk" : "Skriv inn tilbud";
  output.offerTaxNote.textContent =
    missingTableTax
      ? "Tabellmodus er valgt, men månedstrekket mangler. Skriv inn trekk per vanlig måned fra skattekortet for å bruke tabelltrekk lokalt."
      : useTableTax
      ? `${kroner(offerTax)} = ${kroner(monthlyTableTax)} tabelltrekk per vanlig måned × ${TABLE_TAX_MONTHS.toLocaleString("nb-NO")} måneder. Dette overstyrer den forenklede 22 % + 7,6 % + trinnskatt-beregningen lokalt.`
      : useSeafarerDeduction
      ? `${kroner(offerTax)} = ${kroner(offerTaxBreakdown.commonBeforeDeduction)} i 22 % skatt - ${kroner(offerTaxBreakdown.seafarerTaxSaving)} fra sjømannsfradrag + ${kroner(offerSocialTax)} i trygdeavgift + ${kroner(offerBracketTax)} i trinnskatt.`
      : `${kroner(offerTax)} = ${kroner(offerCommonTax)} i 22 % skatt + ${kroner(offerSocialTax)} i trygdeavgift + ${kroner(offerBracketTax)} i trinnskatt.`;
  output.offerTableInfo.textContent = tableChoice.type === "deduction"
    ? `Tabell ${tableChoice.code}: Skatteetaten oppgir ${kroner(tableChoice.amount)} i fradrag hensyntatt i tabellen.`
    : tableChoice.type === "addition"
      ? `Tabell ${tableChoice.code}: Skatteetaten oppgir ${kroner(tableChoice.amount)} i tillegg hensyntatt i tabellen.`
      : "Velg tabellnummer for å se hvilket fradrag eller tillegg tabellen bygger på.";
  output.offerNavCost.textContent = kroner(offerNavCost);
  output.offerMpkCost.textContent = kroner(currentMpk);
  output.offerPensionCost.textContent = kroner(currentPension);
  output.offerFinalNet.textContent = canShowOfferResult ? kroner(offerFinalNet) : missingTableTax ? "Skriv inn trekk" : "Skriv inn tilbud";
  output.offerCompareRate.textContent = rateText(offerRate);
  output.offerCompareCurrent.textContent = kroner(currentNet);
  output.offerCompareNew.textContent = canShowOfferResult ? kroner(offerFinalNet) : missingTableTax ? "Skriv inn trekk" : "Skriv inn tilbud";
  output.offerDifference.textContent = canShowOfferResult ? kroner(difference) : missingTableTax ? "Skriv inn trekk" : "Skriv inn tilbud";
  output.offerCompareDifference.textContent = canShowOfferResult ? kroner(difference) : missingTableTax ? "Skriv inn trekk" : "Skriv inn tilbud";
  output.offerCompareNew.classList.toggle("positive-value", canShowOfferResult && offerFinalNet >= 0);
  output.offerCompareNew.classList.toggle("negative-value", canShowOfferResult && offerFinalNet < 0);
  output.offerCompareDifferenceLine.classList.toggle("positive-line", canShowOfferResult && difference >= 0);
  output.offerCompareDifferenceLine.classList.toggle("negative-line", canShowOfferResult && difference < 0);
  output.offerBreakEven.textContent = missingTableTax ? "Skriv inn trekk" : `${euro(breakEvenEur)} / ${kroner(breakEvenNok)}`;
  output.offerNote.textContent =
    `Nullpunktet er funnet ved å prøve seg frem til en bruttolønn der netto etter skatt, frivillig medlemskap og tapte pensjonsordninger blir lik netto i dag.`;
  output.breakEvenCurrentNet.textContent = kroner(currentNet);
  output.breakEvenFixedCosts.textContent = kroner(fixedPensionCost);
  output.breakEvenNavRate.textContent = `${percent.format(navRate * 100)} %`;
  output.breakEvenNok.textContent = breakEvenText(breakEvenNok);
  output.breakEvenTax.textContent = breakEvenText(breakEvenTax);
  output.breakEvenCommonTaxLabel.textContent = useTableTax
    ? "Tabelltrekk per vanlig måned"
    : "Herav 22 % alminnelig skatt etter fradrag";
  output.breakEvenCommonTax.textContent = breakEvenText(breakEvenCommonTax);
  output.breakEvenSeafarerDeduction.textContent = useTableTax ? "Se tabell" : kroner(breakEvenTaxBreakdown.seafarerDeduction);
  output.breakEvenSeafarerTaxSaving.textContent = useTableTax ? "Se tabell" : kroner(breakEvenTaxBreakdown.seafarerTaxSaving);
  output.breakEvenSocialTaxLabel.textContent = useTableTax
    ? `Årsskatt fra tabell (${TABLE_TAX_MONTHS.toLocaleString("nb-NO")} måneder)`
    : "Herav trygdeavgift 7,6 %";
  output.breakEvenSocialTax.textContent = breakEvenText(breakEvenSocialTax);
  output.breakEvenBracketTaxLabel.textContent = useTableTax
    ? "Herav trinnskatt"
    : `Herav trinnskatt (${findTaxBracket(breakEvenNok)})`;
  output.breakEvenBracketTax.textContent = useTableTax ? "Inngår i tabell" : kroner(breakEvenBracketTax);
  output.breakEvenNavCost.textContent = breakEvenText(breakEvenNavCost);
  output.breakEvenPensionCost.textContent = kroner(fixedPensionCost);
  output.breakEvenNetCheck.textContent = breakEvenText(breakEvenNetCheck);
  output.breakEvenFormula.textContent = missingTableTax ? "Skriv inn trekk" : `${kroner(breakEvenNok)} / ${rateText(offerRate)}`;
  output.breakEvenEurDetail.textContent = missingTableTax ? "Skriv inn trekk" : euro(breakEvenEur);

  setOfferStatus(difference, hasOffer, missingTableTax);
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

populateTaxTableChoices();
calculate();
calculateOffer();
