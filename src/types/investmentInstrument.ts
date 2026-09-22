export type InstrumentCategory = "Market-linked" | "Fixed-income";
export type InstrumentRiskLevel = "Low" | "Moderate" | "High";

export interface InvestmentInstrument {
  name: string;
  category: InstrumentCategory;
  description: string;
  returnMechanism: string;
  riskLevel: InstrumentRiskLevel;
  typicalReturnRange: string;
}
