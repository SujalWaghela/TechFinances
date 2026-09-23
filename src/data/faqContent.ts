export interface FaqItem {
  question: string;
  answer: string;
}

export const sipFaqs: FaqItem[] = [
  {
    question: "How is SIP return calculated here?",
    answer:
      "This calculator treats your SIP as monthly investments that earn a constant expected return. It converts your annual return into a monthly rate and uses the future-value formula for an annuity due (investments assumed at the start of each month). The result is an estimate based on the return you enter, not a forecast of real market performance.",
  },
  {
    question: "What is rupee-cost averaging?",
    answer:
      "With a SIP you invest a fixed amount each month, so you buy more units when prices are lower and fewer when prices are higher. Over time, that can smooth out the average purchase cost. It does not remove market risk or guarantee better returns than a lumpsum.",
  },
  {
    question: "Are SIP returns guaranteed?",
    answer:
      "No. SIPs into market-linked products such as equity mutual funds can rise or fall with markets. The numbers here assume a steady expected return you choose yourself. Actual outcomes may be higher or lower, and past performance is not a guarantee of future results.",
  },
  {
    question: "Why does the calculator use monthly compounding?",
    answer:
      "Because SIP contributions are monthly, the model applies a monthly rate equal to the annual rate divided by 12. That keeps the math consistent with how the contributions are timed in this tool. Real funds may compound differently depending on their NAV and dividend policies.",
  },
  {
    question: "What if I change or pause my SIP later?",
    answer:
      "This tool assumes you invest the same amount every month for the full tenure with no pauses or top-ups. If you skip months, change the amount, or redeem early, your final value will differ from the estimate shown here.",
  },
];

export const lumpsumFaqs: FaqItem[] = [
  {
    question: "How does compounding affect a one-time investment?",
    answer:
      "Your entire amount starts earning returns from day one, and those returns can earn further returns over the years. This calculator compounds annually using Future Value = Principal × (1 + rate)^years. The longer the tenure (and the higher the assumed rate), the more compounding can matter.",
  },
  {
    question: "What's the difference between Lumpsum and SIP returns?",
    answer:
      "A lumpsum invests everything at once, so the full principal compounds for the whole period. A SIP spreads the same total money over many months, so later contributions have less time to grow. For the same total invested and the same assumed rate, a lumpsum often shows a higher ending value in this model — but real markets may favour either approach depending on timing.",
  },
  {
    question: "Are lumpsum returns guaranteed?",
    answer:
      "Not for market-linked investments. The figure you see is an estimate based on the expected annual return you enter. Actual equity or mutual-fund returns can vary year to year, and you could also lose money. Treat the result as a planning aid, not a promise.",
  },
  {
    question: "Does this use annual or monthly compounding?",
    answer:
      "This lumpsum calculator compounds once a year at the rate you enter. That matches a simple annual growth assumption. Some products compound more frequently; if yours does, your real outcome may differ slightly from this estimate.",
  },
  {
    question: "Should I invest lumpsum or start a SIP?",
    answer:
      "It depends on whether you have a large sum ready now and how comfortable you are with market timing. A lumpsum can work when you already have the money and a long horizon; a SIP can help if you earn monthly or want to invest gradually. Use both calculators to compare scenarios, then match the choice to your cash flow and risk comfort.",
  },
];

export const fdFaqs: FaqItem[] = [
  {
    question: "How often is interest compounded here?",
    answer:
      "This FD calculator compounds interest quarterly — four times a year — which is the usual convention for many Indian bank FDs. Maturity value is Principal × (1 + r/4)^(4 × years), where r is the annual rate you enter as a decimal.",
  },
  {
    question: "Are FD returns guaranteed?",
    answer:
      "Bank FD rates are contractual for the tenure you book at that bank, subject to the bank's terms. The amount shown here is a mathematical estimate using the rate and tenure you enter. Always confirm the actual rate, compounding frequency, and premature-withdrawal rules with your bank before investing.",
  },
  {
    question: "Is FD interest taxable?",
    answer:
      "In India, interest from fixed deposits is generally taxable as income under your applicable slab, and banks may deduct TDS above certain thresholds. This calculator can show a simple tax adjustment in Reality Check, but it is not tax advice — your exact liability depends on your income and filing status.",
  },
  {
    question: "What if I withdraw my FD early?",
    answer:
      "Banks often pay a lower rate or charge a penalty for premature withdrawal, so you may receive less than the projected maturity amount. This tool assumes you hold the deposit until maturity at the rate you entered.",
  },
  {
    question: "Why is my bank's quote slightly different?",
    answer:
      "Banks may use a different day-count method, payout option (cumulative vs interest payout), senior-citizen rate, or compounding frequency. Small differences in those assumptions can change the maturity value even at the same headline rate.",
  },
];

export const emiFaqs: FaqItem[] = [
  {
    question: "What is the EMI formula used?",
    answer:
      "EMI = [P × r × (1+r)^n] / [(1+r)^n − 1], where P is the loan amount, r is the monthly interest rate (annual rate ÷ 12 ÷ 100), and n is the number of months (years × 12). Total interest is (EMI × n) − P. If the rate is zero, EMI is simply the principal divided by the number of months.",
  },
  {
    question: "Does prepaying reduce my tenure or my EMI amount?",
    answer:
      "That depends on what you ask the lender to do. Many lenders let you keep the EMI the same and shorten the tenure, or keep the tenure and lower the EMI. This calculator does not model prepayments — it shows a standard fixed EMI for the full original tenure.",
  },
  {
    question: "Is the interest rate fixed for the whole loan?",
    answer:
      "Only if your loan is on a fixed rate. Floating-rate home or personal loans can change when the lender revises rates, which changes your EMI or tenure. Enter the rate your lender quotes today; if it changes later, recalculate.",
  },
  {
    question: "Why is total payment much higher than the loan amount?",
    answer:
      "Each EMI pays both interest and principal. Early EMIs are interest-heavy; later ones repay more principal. Over a long tenure, interest can add up to a large share of what you pay overall. Shortening the tenure or negotiating a lower rate usually reduces total interest.",
  },
  {
    question: "Are processing fees included?",
    answer:
      "No. This tool calculates EMI, total interest, and total repayment on the loan principal only. Processing fees, insurance, GST, or other charges from the lender are extra and would increase your true cost of borrowing.",
  },
];
