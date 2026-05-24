const TAX_RATE_COMMON = 0.22;
const SOCIAL_SECURITY_RATE = 0.076;
const SOCIAL_SECURITY_LOWER_LIMIT = 99650;
const SOCIAL_SECURITY_MAX_RATE_ABOVE_LIMIT = 0.25;
const PERSONAL_ALLOWANCE = 114540;
const MINIMUM_DEDUCTION_RATE = 0.46;
const MINIMUM_DEDUCTION_MAX = 95700;
const SEAFARER_DEDUCTION_RATE = 0.30;
const SEAFARER_DEDUCTION_MAX = 86300;
const G_AMOUNT = 136549;
const DNB_LOW_LIMIT_G = 7.1;
const DNB_HIGH_LIMIT_G = 12;
const DNB_LOW_RATE = 0.03;
const DNB_HIGH_RATE = 0.15;
const MPK_RATE = 0.033;
const MPK_MAX_G = 12;
const FREE_DAY_ALLOWANCE_RATE = 177;
const SAFETY_REPRESENTATIVE_COMPENSATION = 776;
const MONTHS_PER_YEAR = 12;

const TAX_BRACKETS = [
  { from: 226100, to: 318300, rate: 0.017 },
  { from: 318300, to: 725050, rate: 0.04 },
  { from: 725050, to: 980100, rate: 0.137 },
  { from: 980100, to: 1467200, rate: 0.168 },
  { from: 1467200, to: Infinity, rate: 0.178 },
];

const form = document.querySelector("#caymanForm");
const offerForm = document.querySelector("#offerForm");
const printLanguageDialog = document.querySelector("#printLanguageDialog");
const saveReportPdfButton = document.querySelector("#saveReportPdf");
const useModelBreakEvenButton = document.querySelector("#useModelBreakEven");
const tabButtons = document.querySelectorAll("[data-tab-target]");
const tabPanels = document.querySelectorAll("[data-tab-panel]");
const reportHeading = {
  eyebrow: document.querySelector("#reportEyebrow"),
  intro: document.querySelector("#reportIntro"),
  title: document.querySelector("#reportTitle"),
};
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
  offerSeafarerDeduction: document.querySelector("#offerSeafarerDeduction"),
  safetyRepresentative: document.querySelector("#safetyRepresentative"),
  seafarerDeduction: document.querySelector("#seafarerDeduction"),
};

const output = {
  baseSalaryToday: document.querySelector("#baseSalaryToday"),
  commonTax: document.querySelector("#commonTax"),
  commonTaxBasis: document.querySelector("#commonTaxBasis"),
  standardDeduction: document.querySelector("#standardDeduction"),
  seafarerDeduction: document.querySelector("#seafarerDeductionValue"),
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
  safetyRepresentativeIncomeToday: document.querySelector("#safetyRepresentativeIncomeToday"),
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
  printSeafarerDeduction: document.querySelector("#printSeafarerDeduction"),
  printTotalTax: document.querySelector("#printTotalTax"),
  reportBody: document.querySelector("#reportBody"),
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
  offerCommonTaxBasis: document.querySelector("#offerCommonTaxBasis"),
  offerCurrentNet: document.querySelector("#offerCurrentNet"),
  offerCurrentSalaryNok: document.querySelector("#offerCurrentSalaryNok"),
  offerCurrentTax: document.querySelector("#offerCurrentTax"),
  offerDifference: document.querySelector("#offerDifference"),
  offerFinalNet: document.querySelector("#offerFinalNet"),
  offerMpkCost: document.querySelector("#offerMpkCost"),
  offerModelNote: document.querySelector("#offerModelNote"),
  offerNavCost: document.querySelector("#offerNavCost"),
  offerNetAfterTax: document.querySelector("#offerNetAfterTax"),
  offerNote: document.querySelector("#offerNote"),
  offerPensionCost: document.querySelector("#offerPensionCost"),
  offerSalaryEurOut: document.querySelector("#offerSalaryEurOut"),
  offerSalaryNok: document.querySelector("#offerSalaryNok"),
  offerSocialTax: document.querySelector("#offerSocialTax"),
  offerStatusCard: document.querySelector("#offerStatusCard"),
  offerStatusText: document.querySelector("#offerStatusText"),
  offerStandardDeduction: document.querySelector("#offerStandardDeduction"),
  offerSeafarerDeduction: document.querySelector("#offerSeafarerDeductionValue"),
  offerTax: document.querySelector("#offerTax"),
  offerTaxNote: document.querySelector("#offerTaxNote"),
  breakEvenSeafarerDeduction: document.querySelector("#breakEvenSeafarerDeduction"),
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

function getMainTaxOptions() {
  return {
    useSeafarerDeduction: Boolean(fields.seafarerDeduction.checked),
  };
}

function getOfferTaxOptions() {
  return {
    useSeafarerDeduction: Boolean(fields.offerSeafarerDeduction.checked),
  };
}

function getModelSnapshot() {
  const annualSalary = numberValue("annualSalary");
  const eurRate = numberValue("eurRate") || 1;
  const freeDayCount = numberValue("freeDayCount");
  const navRate = numberValue("navRate") / 100;
  const taxOptions = getMainTaxOptions();
  const freeDayCost = freeDayCount * FREE_DAY_ALLOWANCE_RATE;
  const safetyRepresentativeCost = fields.safetyRepresentative.checked
    ? SAFETY_REPRESENTATIVE_COMPENSATION * MONTHS_PER_YEAR
    : 0;
  const currentTotalSalary = annualSalary + freeDayCost + safetyRepresentativeCost;
  const dnbPension = calculateDnbPension(annualSalary);
  const mpk = calculateMpk(annualSalary);
  const fixedPensionCost = mpk.value + dnbPension.total;
  const breakEvenSalary = calculateOfferBreakEven(currentTotalSalary, navRate, fixedPensionCost, taxOptions);

  return {
    annualSalary,
    breakEvenSalary,
    currentTotalSalary,
    eurRate,
    fixedPensionCost,
    navRate,
    taxOptions,
  };
}

function calculateBracketTax(income) {
  return TAX_BRACKETS.reduce((sum, bracket) => {
    const taxablePart = Math.max(0, Math.min(income, bracket.to) - bracket.from);
    return sum + taxablePart * bracket.rate;
  }, 0);
}

function calculateMinimumDeduction(income) {
  return Math.min(income * MINIMUM_DEDUCTION_RATE, MINIMUM_DEDUCTION_MAX);
}

function calculateStandardDeduction(income) {
  return Math.min(income, calculateMinimumDeduction(income) + PERSONAL_ALLOWANCE);
}

function calculateSeafarerDeduction(income, taxOptions = {}) {
  if (!taxOptions.useSeafarerDeduction) return 0;
  return Math.min(income * SEAFARER_DEDUCTION_RATE, SEAFARER_DEDUCTION_MAX);
}

function calculateOrdinaryDeduction(income, taxOptions = {}) {
  return Math.min(income, calculateStandardDeduction(income) + calculateSeafarerDeduction(income, taxOptions));
}

function calculateOrdinaryTaxBasis(income, taxOptions = {}) {
  return Math.max(0, income - calculateOrdinaryDeduction(income, taxOptions));
}

function calculateCommonTax(income, taxOptions = {}) {
  return calculateOrdinaryTaxBasis(income, taxOptions) * TAX_RATE_COMMON;
}

function calculateSocialSecurityTax(income) {
  const ordinaryContribution = income * SOCIAL_SECURITY_RATE;
  const limitedContribution = Math.max(0, income - SOCIAL_SECURITY_LOWER_LIMIT) *
    SOCIAL_SECURITY_MAX_RATE_ABOVE_LIMIT;

  return Math.min(ordinaryContribution, limitedContribution);
}

function findTaxBracket(income) {
  if (income <= TAX_BRACKETS[0].from) return 0;
  const index = TAX_BRACKETS.findIndex((bracket) => income > bracket.from && income <= bracket.to);
  return index >= 0 ? index + 1 : TAX_BRACKETS.length;
}

function calculateTotalTax(income, taxOptions = {}) {
  return calculateCommonTax(income, taxOptions) +
    calculateSocialSecurityTax(income) +
    calculateBracketTax(income);
}

function calculateTaxDetails(income, taxOptions = {}) {
  const standardDeduction = calculateStandardDeduction(income);
  const seafarerDeduction = calculateSeafarerDeduction(income, taxOptions);
  const commonTaxBasis = calculateOrdinaryTaxBasis(income, taxOptions);
  const commonTax = commonTaxBasis * TAX_RATE_COMMON;
  const socialTax = calculateSocialSecurityTax(income);
  const bracketTax = calculateBracketTax(income);

  return {
    bracketTax,
    commonTax,
    commonTaxBasis,
    seafarerDeduction,
    socialTax,
    standardDeduction,
    totalTax: commonTax + socialTax + bracketTax,
  };
}

function calculateExtraTaxBreakdown(baseSalary, grossExtra, taxOptions = {}) {
  return {
    bracket: calculateBracketTax(baseSalary + grossExtra) - calculateBracketTax(baseSalary),
    common: calculateCommonTax(baseSalary + grossExtra, taxOptions) - calculateCommonTax(baseSalary, taxOptions),
    social: calculateSocialSecurityTax(baseSalary + grossExtra) - calculateSocialSecurityTax(baseSalary),
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

function calculateGrossUp(baseSalary, targetNetValue, taxOptions = {}) {
  if (targetNetValue <= 0) {
    return {
      grossCompensation: 0,
      taxOnCompensation: 0,
    };
  }

  let low = targetNetValue;
  let high = targetNetValue * 3;
  const baseTax = calculateTotalTax(baseSalary, taxOptions);

  while (high - (calculateTotalTax(baseSalary + high, taxOptions) - baseTax) < targetNetValue) {
    high *= 1.5;
  }

  for (let i = 0; i < 80; i += 1) {
    const middle = (low + high) / 2;
    const extraTax = calculateTotalTax(baseSalary + middle, taxOptions) - baseTax;
    const netExtra = middle - extraTax;

    if (netExtra >= targetNetValue) high = middle;
    else low = middle;
  }

  const grossCompensation = high;
  const taxOnCompensation = calculateTotalTax(baseSalary + grossCompensation, taxOptions) - baseTax;

  return {
    grossCompensation,
    taxOnCompensation,
  };
}

function reportRow(label, value, className = "") {
  return `
    <div class="report-row ${className}">
      <dt>${label}</dt>
      <dd>${value}</dd>
    </div>
  `;
}

function reportFact(label, value, note = "") {
  return `
    <div class="report-fact">
      <span>${label}</span>
      <strong>${value}</strong>
      ${note ? `<small>${note}</small>` : ""}
    </div>
  `;
}

function reportImportantNotice(language = "no") {
  if (language === "en") {
    return `
      <section class="report-section report-important report-wide">
        <h3>Important to know</h3>
        <p>This is a negotiation calculation. Tax is individual and can be affected by deductions, debt interest, family situation, municipality/residence and other personal circumstances.</p>
        <p>The calculation keeps private finances outside the model and shows the value of Norwegian employment/CBA elements that may disappear when moving to a new contract. Please report any errors you discover.</p>
      </section>
    `;
  }

  return `
    <section class="report-section report-important report-wide">
      <h3>Viktig å vite</h3>
      <p>Dette er en forhandlingskalkyle. Skatt er individuelt og påvirkes av fradrag, gjeldsrenter, familieforhold, bosted og andre personlige forhold.</p>
      <p>Kalkylen holder privatøkonomi utenfor og viser verdien av norsk ansettelse/CBA som kan falle bort ved utflagging. Oppdager dere noen feil si i fra!</p>
    </section>
  `;
}

function setReportHeading(language = "no") {
  const text = language === "en"
    ? {
      eyebrow: "Report based on the compensation model",
      intro: "The report explains the calculation step by step, using the same rates and input as the calculator.",
      title: "Employer costs when moving to a new contract",
    }
    : {
      eyebrow: "Rapport basert på kompensasjonsmodellen",
      intro: "Rapporten forklarer tallene steg for steg, med samme satser og input som ligger i kalkulatoren.",
      title: "Arbeidsgiverkostnader ved overgang til ny kontrakt",
    };

  reportHeading.eyebrow.textContent = text.eyebrow;
  reportHeading.intro.textContent = text.intro;
  reportHeading.title.textContent = text.title;
}

function renderEnglishReport() {
  const annualSalary = numberValue("annualSalary");
  const eurRate = numberValue("eurRate") || 1;
  const freeDayCount = numberValue("freeDayCount");
  const navRate = numberValue("navRate") / 100;
  const taxOptions = getMainTaxOptions();
  const freeDayCost = freeDayCount * FREE_DAY_ALLOWANCE_RATE;
  const safetyRepresentativeCost = fields.safetyRepresentative.checked
    ? SAFETY_REPRESENTATIVE_COMPENSATION * MONTHS_PER_YEAR
    : 0;
  const currentTotalSalary = annualSalary + freeDayCost + safetyRepresentativeCost;
  const dnbPension = calculateDnbPension(annualSalary);
  const mpk = calculateMpk(annualSalary);
  const currentTax = calculateTaxDetails(currentTotalSalary, taxOptions);
  const netSalary = currentTotalSalary - currentTax.totalTax;
  const navCost = annualSalary * navRate;
  const mpkCost = mpk.value;
  const directValue = navCost + mpkCost + dnbPension.total;
  const fixedPensionCost = mpkCost + dnbPension.total;
  const grossUp = calculateGrossUp(currentTotalSalary, directValue, taxOptions);
  const equivalentSalary = currentTotalSalary + grossUp.grossCompensation;
  const totalValueBreakEven = calculateOfferBreakEven(currentTotalSalary, navRate, fixedPensionCost, taxOptions);
  const totalValueNetToday = currentTotalSalary - calculateTotalTax(currentTotalSalary, taxOptions);
  const totalValueNavAtBreakEven = totalValueBreakEven * navRate;
  const totalValueBreakEvenTax = calculateTotalTax(totalValueBreakEven, taxOptions);
  const totalValueBreakEvenCheck = totalValueBreakEven -
    totalValueBreakEvenTax -
    totalValueNavAtBreakEven -
    fixedPensionCost;
  const grossTaxBreakdown = calculateExtraTaxBreakdown(currentTotalSalary, grossUp.grossCompensation, taxOptions);
  const compBracketTax = grossTaxBreakdown.bracket;

  setReportHeading("en");
  output.reportBody.innerHTML = `
    <section class="report-key-facts">
      ${reportFact("Current salary basis", kroner(currentTotalSalary), "Base salary and selected allowances")}
      ${reportFact("Seafarers' allowance", kroner(currentTax.seafarerDeduction), taxOptions.useSeafarerDeduction ? "30%, max NOK 86,300" : "Not selected")}
      ${reportFact("Values that must be replaced", kroner(directValue), "NAV/voluntary membership and pension")}
      ${reportFact("Economic break-even point", kroner(totalValueBreakEven), `${euro(totalValueBreakEven / eurRate)} at EUR/NOK ${rateText(eurRate)}`)}
    </section>

    ${reportImportantNotice("en")}

    <section class="report-section">
      <h3>1. Current pay that must be carried forward</h3>
      <p>This is the pay and allowances in the current Norwegian model. Before a new contract is assessed, this must be the starting point. If these values are not included, the offer is not compared against the correct current situation.</p>
      <dl class="report-list">
        ${reportRow("Base salary", kroner(annualSalary), "report-positive")}
        ${reportRow(`Leave-day meal allowance (${freeDayCount} days x ${kroner(FREE_DAY_ALLOWANCE_RATE)})`, kroner(freeDayCost), "report-positive")}
        ${reportRow(`Safety representative compensation (${kroner(SAFETY_REPRESENTATIVE_COMPENSATION)} x ${MONTHS_PER_YEAR} months)`, kroner(safetyRepresentativeCost), "report-positive")}
        ${reportRow("Total annual pay before tax", kroner(currentTotalSalary), "report-total")}
      </dl>
    </section>

    <section class="report-section">
      <h3>2. Tax on current pay</h3>
      <p>The tax is split up to show what it consists of. The 22% ordinary income tax is not calculated on the full gross salary. Minimum deduction, personal allowance and any seafarers' allowance are applied first. National Insurance contribution and bracket tax are calculated on gross/personal income.</p>
      <dl class="report-list">
        ${reportRow("Total annual pay before tax", kroner(currentTotalSalary))}
        ${reportRow("Minimum deduction and personal allowance", kroner(currentTax.standardDeduction), "report-positive")}
        ${reportRow("Seafarers' allowance", kroner(currentTax.seafarerDeduction), "report-positive")}
        ${reportRow("Basis for 22% ordinary income tax", kroner(currentTax.commonTaxBasis))}
        ${reportRow("Ordinary income tax 22%", kroner(currentTax.commonTax), "report-negative")}
        ${reportRow("National Insurance contribution 7.6%", kroner(currentTax.socialTax), "report-negative")}
        ${reportRow(`Bracket tax (${findTaxBracket(currentTotalSalary)})`, kroner(currentTax.bracketTax), "report-negative")}
        ${reportRow("Total calculated tax", kroner(currentTax.totalTax), "report-negative")}
        ${reportRow("Net pay after tax", kroner(netSalary), "report-total")}
      </dl>
    </section>

    <section class="report-section">
      <h3>3. Costs that must be replaced</h3>
      <p>This is not extra pay or profit. These are values and schemes in the current Norwegian model that the employee must cover privately if they disappear under a new contract.</p>
      <dl class="report-list">
        ${reportRow(`Voluntary National Insurance / employer equivalent (${percent.format(navRate * 100)}% of base salary)`, kroner(navCost), "report-negative")}
        ${reportRow("MPK employer contribution 3.3%", kroner(mpkCost), "report-negative")}
        ${reportRow("Defined contribution pension in DnB", kroner(dnbPension.total), "report-negative")}
        ${reportRow("Total value that must be replaced", kroner(directValue), "report-total")}
      </dl>
    </section>

    <section class="report-section">
      <h3>4. Why compensation must be higher than the direct cost</h3>
      <p>The employer cannot simply add the direct cost and assume the employee is covered. If compensation is paid as salary, it is also taxed. Gross compensation must therefore be higher, so that the employee is left with the correct amount after tax.</p>
      <dl class="report-list">
        ${reportRow("Actual value that must be covered after tax", kroner(directValue), "report-negative")}
        ${reportRow("Required gross compensation", kroner(grossUp.grossCompensation), "report-positive")}
        ${reportRow("Tax triggered by the compensation", kroner(grossUp.taxOnCompensation), "report-negative")}
        ${reportRow("Of which 22% ordinary income tax", kroner(grossTaxBreakdown.common), "report-negative")}
        ${reportRow("Of which National Insurance contribution 7.6%", kroner(grossTaxBreakdown.social), "report-negative")}
        ${reportRow(`Of which bracket tax (${findTaxBracket(equivalentSalary)})`, kroner(compBracketTax), "report-negative")}
        ${reportRow("Control: gross compensation minus tax", `${kroner(grossUp.grossCompensation)} - ${kroner(grossUp.taxOnCompensation)} = approx. ${kroner(directValue)}`, "report-total")}
      </dl>
    </section>

    <section class="report-section report-wide">
      <h3>5. New salary required for the employee to break even</h3>
      <p>This is the main figure in the report. It shows the new gross salary required for the employee to be left with the same net amount as today, after Norwegian tax, voluntary National Insurance/NAV and lost pension schemes have been deducted.</p>
      <dl class="report-list">
        ${reportRow("Current net pay based on salary and allowances", kroner(totalValueNetToday))}
        ${reportRow("MPK and DnB pension that must be covered", kroner(fixedPensionCost), "report-negative")}
        ${reportRow(`NAV/voluntary membership on new salary (${percent.format(navRate * 100)}%)`, kroner(totalValueNavAtBreakEven), "report-negative")}
        ${reportRow("Tax on new salary", kroner(totalValueBreakEvenTax), "report-negative")}
        ${reportRow("New annual salary giving economic break-even", kroner(totalValueBreakEven), "report-total")}
        ${reportRow("New monthly salary giving economic break-even", kroner(totalValueBreakEven / 12), "report-total")}
        ${reportRow(`Converted to EUR at EUR/NOK ${rateText(eurRate)}`, euro(totalValueBreakEven / eurRate), "report-total")}
      </dl>
      <p class="report-check">Calculation: ${kroner(totalValueBreakEven)} in new salary - ${kroner(totalValueBreakEvenTax)} in tax - ${kroner(totalValueNavAtBreakEven)} in voluntary National Insurance/NAV - ${kroner(fixedPensionCost)} in pension = approx. ${kroner(totalValueBreakEvenCheck)}. This equals the current net amount.</p>
    </section>

    <section class="report-section report-conclusion report-wide">
      <h3>Conclusion</h3>
      <p>For the employee not to lose financially in the transition, the new annual salary must be approximately ${kroner(totalValueBreakEven)}. This equals ${kroner(totalValueBreakEven / 12)} per month, or ${euro(totalValueBreakEven / eurRate)} per year at an EUR/NOK rate of ${rateText(eurRate)}. This figure is not a gain. It is the break-even point where today's net pay and lost schemes are compensated.</p>
    </section>

    <section class="report-section report-sources report-wide">
      <h3>Sources and assumptions</h3>
      <p>Tax is still individual, but the rates in the calculation are based on official 2026 rates. The NAV rate is selected by the user in the calculator.</p>
      <dl class="report-list">
        ${reportRow("Tax", `<a href="https://www.skatteetaten.no/nn/rettskjelder/type/uttalelser/uttalelser/forskuddsutskrivingen-2026/" target="_blank" rel="noopener noreferrer">Norwegian Tax Administration - 2026 withholding rates</a>`)}
        ${reportRow("Seafarers' allowance", `<a href="https://www.skatteetaten.no/en/rates/seafarers-allowance/" target="_blank" rel="noopener noreferrer">Norwegian Tax Administration - seafarers' allowance</a>`)}
        ${reportRow("NAV voluntary membership", `<a href="https://www.nav.no/frivillig-medlemskap" target="_blank" rel="noopener noreferrer">NAV - voluntary membership</a>`)}
        ${reportRow("National Insurance base amount", `<a href="https://www.nav.no/grunnbelopet" target="_blank" rel="noopener noreferrer">NAV - base amount G: ${kroner(G_AMOUNT)}</a>`)}
        ${reportRow("Contribution basis", `<a href="https://lovdata.no/forskrift/2025-12-19-2784/%C2%A72" target="_blank" rel="noopener noreferrer">Lovdata - contribution basis 2026</a>`)}
      </dl>
    </section>
  `;
}

function calculateOfferBreakEven(currentSalary, navRate, fixedPensionCost, taxOptions = {}) {
  const currentNet = currentSalary - calculateTotalTax(currentSalary, taxOptions);
  let low = 0;
  let high = Math.max(currentSalary * 2, fixedPensionCost * 4, 100000);

  const netAfterCosts = (grossSalary) =>
    grossSalary - calculateTotalTax(grossSalary, taxOptions) - (grossSalary * navRate) - fixedPensionCost;

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
  const taxOptions = getMainTaxOptions();
  const freeDayCost = freeDayCount * FREE_DAY_ALLOWANCE_RATE;
  const safetyRepresentativeCost = fields.safetyRepresentative.checked
    ? SAFETY_REPRESENTATIVE_COMPENSATION * MONTHS_PER_YEAR
    : 0;
  const currentTotalSalary = annualSalary + freeDayCost + safetyRepresentativeCost;
  const dnbPension = calculateDnbPension(annualSalary);
  const mpk = calculateMpk(annualSalary);
  const currentTax = calculateTaxDetails(currentTotalSalary, taxOptions);
  const netSalary = currentTotalSalary - currentTax.totalTax;

  const navCost = annualSalary * navRate;
  const mpkCost = mpk.value;
  const directValue = navCost + mpkCost + dnbPension.total;
  const fixedPensionCost = mpkCost + dnbPension.total;
  const grossUp = calculateGrossUp(currentTotalSalary, directValue, taxOptions);
  const navGrossUp = calculateGrossUp(currentTotalSalary, navCost, taxOptions);
  const equivalentSalary = currentTotalSalary + grossUp.grossCompensation;
  const totalValueBreakEven = calculateOfferBreakEven(currentTotalSalary, navRate, fixedPensionCost, taxOptions);
  const totalValueNetToday = currentTotalSalary - calculateTotalTax(currentTotalSalary, taxOptions);
  const totalValueNavAtBreakEven = totalValueBreakEven * navRate;
  const totalValueBreakEvenTax = calculateTotalTax(totalValueBreakEven, taxOptions);
  const totalValueBreakEvenCheck = totalValueBreakEven -
    totalValueBreakEvenTax -
    totalValueNavAtBreakEven -
    fixedPensionCost;
  const grossTaxBreakdown = calculateExtraTaxBreakdown(currentTotalSalary, grossUp.grossCompensation, taxOptions);
  const navTaxBreakdown = calculateExtraTaxBreakdown(currentTotalSalary, navGrossUp.grossCompensation, taxOptions);
  const compBracketTax = grossTaxBreakdown.bracket;
  const marginalTaxRate = grossUp.grossCompensation > 0
    ? grossUp.taxOnCompensation / grossUp.grossCompensation
    : 0;

  output.baseSalaryToday.textContent = kroner(annualSalary);
  output.freeDayIncomeToday.textContent = kroner(freeDayCost);
  output.safetyRepresentativeIncomeToday.textContent = kroner(safetyRepresentativeCost);
  output.totalSalaryToday.textContent = kroner(currentTotalSalary);
  output.standardDeduction.textContent = kroner(currentTax.standardDeduction);
  output.seafarerDeduction.textContent = kroner(currentTax.seafarerDeduction);
  output.commonTaxBasis.textContent = kroner(currentTax.commonTaxBasis);
  output.commonTax.textContent = kroner(currentTax.commonTax);
  output.socialTax.textContent = kroner(currentTax.socialTax);
  output.bracketTaxLabel.textContent = `Trinnskatt (${findTaxBracket(currentTotalSalary)})`;
  output.bracketTax.textContent = kroner(currentTax.bracketTax);
  output.totalTax.textContent = kroner(currentTax.totalTax);
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
    `${kroner(navCost)} er selve kostnaden beregnet av grunnlønn. For at du skal sitte igjen med dette etter skatt, må brutto lønn økes med omtrent ${kroner(navGrossUp.grossCompensation)}. Differansen er skatt på kompensasjonen.`;
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
    `Med ${kroner(currentTotalSalary)} i norsk årslønn inkludert valgte tillegg må ny lønn være omtrent ${kroner(equivalentSalary)} for at ${kroner(directValue)} i tapte ordninger skal være dekket etter skatt.`;
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
  output.printSeafarerDeduction.textContent = kroner(currentTax.seafarerDeduction);
  output.printTotalTax.textContent = kroner(currentTax.totalTax);
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

  setReportHeading("no");
  output.reportBody.innerHTML = `
    <section class="report-key-facts">
      ${reportFact("Dagens lønnsgrunnlag", kroner(currentTotalSalary), "Grunnlønn og valgte tillegg")}
      ${reportFact("Sjømannsfradrag", kroner(currentTax.seafarerDeduction), taxOptions.useSeafarerDeduction ? "30 %, maks 86 300 kr" : "Ikke valgt")}
      ${reportFact("Verdier som må erstattes", kroner(directValue), "NAV/frivillig medlemskap og pensjon")}
      ${reportFact("Økonomisk nullpunkt", kroner(totalValueBreakEven), `${euro(totalValueBreakEven / eurRate)} ved kurs ${rateText(eurRate)}`)}
    </section>

    ${reportImportantNotice("no")}

    <section class="report-section">
      <h3>1. Dagens lønn som må videreføres</h3>
      <p>Dette er lønnen og tilleggene arbeidstaker har i dagens norske modell. Før man vurderer ny kontrakt, må dette være startpunktet. Hvis disse verdiene ikke tas med, sammenlignes ikke tilbudet mot riktig dagens situasjon.</p>
      <dl class="report-list">
        ${reportRow("Grunnlønn", kroner(annualSalary), "report-positive")}
        ${reportRow(`Fridagskostpenger (${freeDayCount} dager x ${kroner(FREE_DAY_ALLOWANCE_RATE)})`, kroner(freeDayCost), "report-positive")}
        ${reportRow(`Verneombudskompensasjon (${kroner(SAFETY_REPRESENTATIVE_COMPENSATION)} x ${MONTHS_PER_YEAR} mnd)`, kroner(safetyRepresentativeCost), "report-positive")}
        ${reportRow("Total årslønn før skatt", kroner(currentTotalSalary), "report-total")}
      </dl>
    </section>

    <section class="report-section">
      <h3>2. Skatt på dagens lønn</h3>
      <p>Skatten er delt opp for å vise hva den består av. 22 % alminnelig skatt beregnes ikke av hele bruttolønnen. Først trekkes minstefradrag, personfradrag og eventuelt sjømannsfradrag fra. Trygdeavgift og trinnskatt beregnes av brutto/personinntekt.</p>
      <dl class="report-list">
        ${reportRow("Total årslønn før skatt", kroner(currentTotalSalary))}
        ${reportRow("Minstefradrag og personfradrag", kroner(currentTax.standardDeduction), "report-positive")}
        ${reportRow("Sjømannsfradrag", kroner(currentTax.seafarerDeduction), "report-positive")}
        ${reportRow("Grunnlag for 22 % alminnelig skatt", kroner(currentTax.commonTaxBasis))}
        ${reportRow("Alminnelig skatt 22 %", kroner(currentTax.commonTax), "report-negative")}
        ${reportRow("Trygdeavgift 7,6 %", kroner(currentTax.socialTax), "report-negative")}
        ${reportRow(`Trinnskatt (${findTaxBracket(currentTotalSalary)})`, kroner(currentTax.bracketTax), "report-negative")}
        ${reportRow("Total beregnet skatt", kroner(currentTax.totalTax), "report-negative")}
        ${reportRow("Netto utbetalt etter skatt", kroner(netSalary), "report-total")}
      </dl>
    </section>

    <section class="report-section">
      <h3>3. Kostnader som må erstattes</h3>
      <p>Dette er ikke ekstra lønn eller gevinst. Dette er verdier/ordninger som ligger i dagens norske modell, men som arbeidstaker selv må dekke dersom de faller bort ved ny kontrakt.</p>
      <dl class="report-list">
        ${reportRow(`Frivillig folketrygd / arbeidsgiverdel (${percent.format(navRate * 100)} % av grunnlønn)`, kroner(navCost), "report-negative")}
        ${reportRow("MPK arbeidsgiverandel 3,3 %", kroner(mpkCost), "report-negative")}
        ${reportRow("Innskuddspensjon i DnB", kroner(dnbPension.total), "report-negative")}
        ${reportRow("Samlet verdi som må erstattes", kroner(directValue), "report-total")}
      </dl>
    </section>

    <section class="report-section">
      <h3>4. Hvorfor kompensasjonen må være høyere enn kostnaden</h3>
      <p>Arbeidsgiver kan ikke bare legge til den direkte kostnaden og anta at arbeidstaker er dekket. Hvis kompensasjonen betales som lønn, blir den også skattlagt. Derfor må brutto kompensasjon være høyere, slik at arbeidstaker sitter igjen med riktig beløp etter skatt.</p>
      <dl class="report-list">
        ${reportRow("Faktisk verdi som skal dekkes etter skatt", kroner(directValue), "report-negative")}
        ${reportRow("Nødvendig brutto kompensasjon", kroner(grossUp.grossCompensation), "report-positive")}
        ${reportRow("Skatt som utløses på kompensasjonen", kroner(grossUp.taxOnCompensation), "report-negative")}
        ${reportRow("Herav 22 % alminnelig skatt", kroner(grossTaxBreakdown.common), "report-negative")}
        ${reportRow("Herav trygdeavgift 7,6 %", kroner(grossTaxBreakdown.social), "report-negative")}
        ${reportRow(`Herav trinnskatt (${findTaxBracket(equivalentSalary)})`, kroner(compBracketTax), "report-negative")}
        ${reportRow("Kontroll: brutto kompensasjon minus skatt", `${kroner(grossUp.grossCompensation)} - ${kroner(grossUp.taxOnCompensation)} = ca. ${kroner(directValue)}`, "report-total")}
      </dl>
    </section>

    <section class="report-section report-wide">
      <h3>5. Ny lønn som gjør at arbeidstaker går i null</h3>
      <p>Dette er hovedtallet i rapporten. Det viser hvilken ny bruttolønn som må til for at arbeidstaker skal sitte igjen med samme netto som i dag, etter at norsk skatt, frivillig folketrygd/NAV og tapte pensjonsordninger er trukket fra.</p>
      <dl class="report-list">
        ${reportRow("Netto i dag basert på lønn og tillegg", kroner(totalValueNetToday))}
        ${reportRow("MPK og innskuddspensjon som må dekkes", kroner(fixedPensionCost), "report-negative")}
        ${reportRow(`NAV/frivillig medlemskap av ny lønn (${percent.format(navRate * 100)} %)`, kroner(totalValueNavAtBreakEven), "report-negative")}
        ${reportRow("Skatt på ny lønn", kroner(totalValueBreakEvenTax), "report-negative")}
        ${reportRow("Ny årslønn som gir økonomisk nullpunkt", kroner(totalValueBreakEven), "report-total")}
        ${reportRow("Ny månedslønn som gir økonomisk nullpunkt", kroner(totalValueBreakEven / 12), "report-total")}
        ${reportRow(`Omregnet til EUR ved kurs ${rateText(eurRate)}`, euro(totalValueBreakEven / eurRate), "report-total")}
      </dl>
      <p class="report-check">Regnestykket er: ${kroner(totalValueBreakEven)} i ny lønn - ${kroner(totalValueBreakEvenTax)} i skatt - ${kroner(totalValueNavAtBreakEven)} i frivillig folketrygd/NAV - ${kroner(fixedPensionCost)} i pensjon = ca. ${kroner(totalValueBreakEvenCheck)}. Dette tilsvarer dagens netto.</p>
    </section>

    <section class="report-section report-conclusion report-wide">
      <h3>Konklusjon</h3>
      <p>For at arbeidstaker ikke skal tape økonomisk på overgangen, må ny årslønn være omtrent ${kroner(totalValueBreakEven)}. Det tilsvarer ${kroner(totalValueBreakEven / 12)} per måned, eller ${euro(totalValueBreakEven / eurRate)} per år ved EUR/NOK-kurs ${rateText(eurRate)}. Dette tallet er ikke en gevinst. Det er nullpunktet der dagens netto og bortfalte ordninger er kompensert.</p>
    </section>

    <section class="report-section report-sources report-wide">
      <h3>Kilder og forutsetninger</h3>
      <p>Skatt er fortsatt individuelt, men satsene i kalkylen bygger på offentlige 2026-satser. NAV-satsen er valgt av brukeren i kalkulatoren.</p>
      <dl class="report-list">
        ${reportRow("Skatt", `<a href="https://www.skatteetaten.no/nn/rettskjelder/type/uttalelser/uttalelser/forskuddsutskrivingen-2026/" target="_blank" rel="noopener noreferrer">Skatteetaten - forskuddsutskrivingen 2026</a>`)}
        ${reportRow("Sjømannsfradrag", `<a href="https://www.skatteetaten.no/satser/sjomannsfradrag/" target="_blank" rel="noopener noreferrer">Skatteetaten - sjømannsfradrag</a>`)}
        ${reportRow("NAV frivillig medlemskap", `<a href="https://www.nav.no/frivillig-medlemskap" target="_blank" rel="noopener noreferrer">NAV - frivillig medlemskap</a>`)}
        ${reportRow("Grunnbeløp", `<a href="https://www.nav.no/grunnbelopet" target="_blank" rel="noopener noreferrer">NAV - grunnbeløpet: ${kroner(G_AMOUNT)}</a>`)}
        ${reportRow("Avgiftsgrunnlag", `<a href="https://lovdata.no/forskrift/2025-12-19-2784/%C2%A72" target="_blank" rel="noopener noreferrer">Lovdata - avgiftsgrunnlag 2026</a>`)}
      </dl>
    </section>
  `;
}

function calculateOffer() {
  const modelSnapshot = offerForm.dataset.useModelBasis === "true"
    ? getModelSnapshot()
    : null;
  const currentSalary = modelSnapshot?.currentTotalSalary || Number(fields.offerCurrentSalary.value) || 0;
  const pensionBasis = modelSnapshot?.annualSalary || currentSalary;
  const offerSalaryEur = Number(fields.offerSalaryEur.value) || 0;
  const offerRate = Number(fields.offerRate.value) || 1;
  const navRate = (Number(fields.offerNavRate.value) || 0) / 100;
  const taxOptions = getOfferTaxOptions();
  const currentTax = calculateTaxDetails(currentSalary, taxOptions);
  const currentNet = currentSalary - currentTax.totalTax;
  const offerSalaryNok = offerSalaryEur * offerRate;
  const offerTax = calculateTaxDetails(offerSalaryNok, taxOptions);
  const offerNetAfterTax = offerSalaryNok - offerTax.totalTax;
  const offerNavCost = offerSalaryNok * navRate;
  const currentMpk = calculateMpk(pensionBasis).value;
  const currentPension = calculateDnbPension(pensionBasis).total;
  const fixedPensionCost = currentMpk + currentPension;
  const offerFinalNet = offerNetAfterTax - offerNavCost - fixedPensionCost;
  const difference = offerFinalNet - currentNet;
  const breakEvenNok = calculateOfferBreakEven(currentSalary, navRate, fixedPensionCost, taxOptions);
  const breakEvenEur = breakEvenNok / offerRate;
  const breakEvenTax = calculateTaxDetails(breakEvenNok, taxOptions);
  const breakEvenNavCost = breakEvenNok * navRate;
  const breakEvenNetCheck = breakEvenNok - breakEvenTax.totalTax - breakEvenNavCost - fixedPensionCost;
  const hasOffer = offerSalaryEur > 0;

  output.offerCurrentSalaryNok.textContent = kroner(currentSalary);
  output.offerModelNote.textContent = modelSnapshot
    ? "Tilbudsfanen bruker nå lønn, tillegg, kurs og satser fra kompensasjonsmodellen. Tilbudt lønn i euro er fortsatt manuelt."
    : "Knappen henter grunnlønn, tillegg, kurs og satser fra kompensasjonsmodellen. Tilbudt lønn i euro fylles alltid inn manuelt.";
  output.offerCurrentTax.textContent = kroner(currentTax.totalTax);
  output.offerCurrentNet.textContent = kroner(currentNet);
  output.offerSalaryEurOut.textContent = euro(offerSalaryEur);
  output.offerSalaryNok.textContent = kroner(offerSalaryNok);
  output.offerTax.textContent = kroner(offerTax.totalTax);
  output.offerStandardDeduction.textContent = kroner(offerTax.standardDeduction);
  output.offerSeafarerDeduction.textContent = kroner(offerTax.seafarerDeduction);
  output.offerCommonTaxBasis.textContent = kroner(offerTax.commonTaxBasis);
  output.offerCommonTax.textContent = kroner(offerTax.commonTax);
  output.offerSocialTax.textContent = kroner(offerTax.socialTax);
  output.offerBracketTaxLabel.textContent = `Herav trinnskatt (${findTaxBracket(offerSalaryNok)})`;
  output.offerBracketTax.textContent = kroner(offerTax.bracketTax);
  output.offerNetAfterTax.textContent = kroner(offerNetAfterTax);
  output.offerTaxNote.textContent =
    `${kroner(offerTax.totalTax)} = ${kroner(offerTax.commonTax)} i 22 % skatt etter fradrag + ${kroner(offerTax.socialTax)} i trygdeavgift + ${kroner(offerTax.bracketTax)} i trinnskatt. Minstefradrag/personfradrag${taxOptions.useSeafarerDeduction ? " og sjømannsfradrag" : ""} er trukket fra før 22 % skatt.`;
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
  output.breakEvenTax.textContent = kroner(breakEvenTax.totalTax);
  output.breakEvenSeafarerDeduction.textContent = kroner(breakEvenTax.seafarerDeduction);
  output.breakEvenCommonTax.textContent = kroner(breakEvenTax.commonTax);
  output.breakEvenSocialTax.textContent = kroner(breakEvenTax.socialTax);
  output.breakEvenBracketTaxLabel.textContent = `Herav trinnskatt (${findTaxBracket(breakEvenNok)})`;
  output.breakEvenBracketTax.textContent = kroner(breakEvenTax.bracketTax);
  output.breakEvenNavCost.textContent = kroner(breakEvenNavCost);
  output.breakEvenPensionCost.textContent = kroner(fixedPensionCost);
  output.breakEvenNetCheck.textContent = kroner(breakEvenNetCheck);
  output.breakEvenFormula.textContent = `${kroner(breakEvenNok)} / ${rateText(offerRate)}`;
  output.breakEvenEurDetail.textContent = euro(breakEvenEur);

  setOfferStatus(difference, hasOffer);
}

function syncOfferDefaults() {
  delete offerForm.dataset.useModelBasis;
  fields.offerCurrentSalary.value = fields.annualSalary.value;
  fields.offerRate.value = fields.eurRate.value;
  fields.offerNavRate.value = fields.navRate.value;
  fields.offerSeafarerDeduction.checked = fields.seafarerDeduction.checked;
  calculateOffer();
}

function useModelBasisForOffer() {
  const modelSnapshot = getModelSnapshot();
  offerForm.dataset.useModelBasis = "true";
  fields.offerCurrentSalary.value = Math.round(modelSnapshot.currentTotalSalary);
  fields.offerRate.value = modelSnapshot.eurRate;
  fields.offerNavRate.value = fields.navRate.value;
  fields.offerSeafarerDeduction.checked = modelSnapshot.taxOptions.useSeafarerDeduction;
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

function printReport(language) {
  if (language === "en") {
    renderEnglishReport();
  } else {
    calculate();
  }

  document.body.dataset.printMode = "report";
  window.setTimeout(() => window.print(), 50);
}

form.addEventListener("input", calculate);
form.addEventListener("change", calculate);
fields.eurRate.addEventListener("input", calculate);
fields.eurRate.addEventListener("change", calculate);
fields.eurOffer.addEventListener("input", calculate);
fields.eurOffer.addEventListener("change", calculate);
offerForm.addEventListener("input", calculateOffer);
offerForm.addEventListener("change", calculateOffer);
fields.offerCurrentSalary.addEventListener("input", () => {
  delete offerForm.dataset.useModelBasis;
});
useModelBreakEvenButton.addEventListener("click", useModelBasisForOffer);
saveReportPdfButton.addEventListener("click", () => {
  if (printLanguageDialog?.showModal) {
    printLanguageDialog.showModal();
    return;
  }

  const language = window.confirm("Print English report? Velg Avbryt for norsk rapport.")
    ? "en"
    : "no";
  printReport(language);
});

document.querySelectorAll("[data-report-print-language]").forEach((button) => {
  button.addEventListener("click", () => {
    const language = button.dataset.reportPrintLanguage;
    printLanguageDialog.close();
    printReport(language);
  });
});

window.addEventListener("afterprint", () => {
  delete document.body.dataset.printMode;
  calculate();
});

tabButtons.forEach((button) => {
  button.addEventListener("click", () => switchTab(button.dataset.tabTarget));
});

calculate();
calculateOffer();
