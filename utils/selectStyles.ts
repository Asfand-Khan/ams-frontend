import { StylesConfig } from "react-select";

export interface SelectOption {
  value: number | string;
  label: string | number;
}

// Make it generic so it works with both single and multi
export const selectStyles: StylesConfig<SelectOption, false> = {
  control: (provided, state) => ({
    ...provided,
    border: state.isFocused ? "1px solid #0074FC" : "1px solid #e5e5e5",
    borderRadius: "8px",
    padding: "2px",
    boxShadow: state.isFocused ? "0 0 0 3px rgba(201, 63, 82, 0.5)" : "none",
    "&:hover": {
      border: state.isFocused ? "1px solid #0074FC" : "1px solid #e5e5e5",
    },
    fontSize: "14px",
    color: "#0a0a0a",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#0a0a0a",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#737373",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#f5f5f5"
      : state.isFocused
      ? "#f5f5f5"
      : "white",
    color: "#0a0a0a",
    fontSize: "14px",
    "&:hover": {
      backgroundColor: "#f5f5f5",
      color: "#0a0a0a",
    },
  }),
};