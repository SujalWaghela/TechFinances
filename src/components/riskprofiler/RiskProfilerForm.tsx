import type { RiskProfileInput } from "../../types/riskProfiler";

interface RiskProfilerFormProps {
  values: RiskProfileInput;
  onChange: (values: RiskProfileInput) => void;
  onSubmit: () => void;
}

interface FieldConfig {
  key: keyof RiskProfileInput;
  label: string;
  min: number;
  max: number;
  step: number;
  prefix?: string;
  suffix?: string;
}

const FIELDS: FieldConfig[] = [
  {
    key: "age",
    label: "Age",
    min: 18,
    max: 65,
    step: 1,
    suffix: " yrs",
  },
  {
    key: "monthlyIncome",
    label: "Monthly Income",
    min: 10_000,
    max: 500_000,
    step: 5_000,
    prefix: "₹",
  },
  {
    key: "investmentHorizonYears",
    label: "Investment Horizon",
    min: 1,
    max: 30,
    step: 1,
    suffix: " Years",
  },
  {
    key: "existingSavings",
    label: "Existing Savings",
    min: 0,
    max: 5_000_000,
    step: 50_000,
    prefix: "₹",
  },
  {
    key: "dependents",
    label: "Dependents",
    min: 0,
    max: 5,
    step: 1,
  },
  {
    key: "riskToleranceScore",
    label: "Risk Tolerance (1–10)",
    min: 1,
    max: 10,
    step: 1,
  },
];

function formatFieldValue(field: FieldConfig, value: number): string {
  const formatted = value.toLocaleString("en-IN");
  return `${field.prefix ?? ""}${formatted}${field.suffix ?? ""}`;
}

function RiskProfilerForm({
  values,
  onChange,
  onSubmit,
}: RiskProfilerFormProps) {
  function handleFieldChange(key: keyof RiskProfileInput, next: number) {
    onChange({
      ...values,
      [key]: next,
    });
  }

  return (
    <form
      className="sip-inputs risk-profiler-form"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      {FIELDS.map((field) => (
        <div className="sip-input" key={field.key}>
          <div className="sip-input-header">
            <label htmlFor={`risk-${field.key}`}>{field.label}</label>
            <strong>{formatFieldValue(field, values[field.key])}</strong>
          </div>

          <input
            id={`risk-${field.key}`}
            type="range"
            min={field.min}
            max={field.max}
            step={field.step}
            value={values[field.key]}
            onChange={(event) =>
              handleFieldChange(field.key, Number(event.target.value))
            }
          />
        </div>
      ))}

      <button type="submit" className="risk-profiler-submit">
        Analyse Risk Profile
      </button>
    </form>
  );
}

export default RiskProfilerForm;
