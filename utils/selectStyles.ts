import { StylesConfig } from "react-select";

interface SelectOption {
  value: number;
  label: string;
}

export const selectStyles: StylesConfig<SelectOption, false> = {
  control: (provided, state) => ({
    ...provided,
    border: state.isFocused ? "1px solid #c93f52" : "1px solid #e5e5e5",
    borderRadius: "8px",
    padding: "2px",
    boxShadow: state.isFocused ? "0 0 0 3px rgba(201, 63, 82, 0.5)" : "none",
    "&:hover": {
      border: state.isFocused ? "1px solid #c93f52" : "1px solid #e5e5e5",
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
    color: state.isSelected ? "#0a0a0a" : "#0a0a0a",
    fontSize: "14px",
    "&:hover": {
      backgroundColor: "#f5f5f5",
      color: "#0a0a0a",
    },
  }),
};
