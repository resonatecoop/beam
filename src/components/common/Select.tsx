import styled from "@emotion/styled";
import React from "react";

export const SelectEl = styled.select`
  font-size: 1rem;
`;

export const Select: React.FC<{
  value: string;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
  options: { label: string; value: string }[];
}> = ({ value, onChange, options }) => {
  return (
    <SelectEl value={value} onChange={onChange}>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </SelectEl>
  );
};

export default Select;
