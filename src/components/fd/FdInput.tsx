interface FdInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  prefix?: string;
  suffix?: string;
}

function FdInput({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  prefix = "",
  suffix = "",
}: FdInputProps) {
  return (
    <div className="sip-input">

      <div className="sip-input-header">
        <label>{label}</label>

        <strong>
          {prefix}
          {value.toLocaleString("en-IN")}
          {suffix}
        </strong>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />

    </div>
  );
}

export default FdInput;