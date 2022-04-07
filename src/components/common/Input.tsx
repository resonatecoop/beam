import React from "react";

import { css } from "@emotion/css";

const inputClass = css`
  border: 1px solid #dfdfdf;
  padding: 0.5rem;
  font-size: 1rem;
  margin-bottom: 0.5rem;
`;

export const Input: React.FC<{
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  value: string;
  disabled?: boolean;
}> = ({ onChange, disabled, name, value }) => {
  return (
    <input
      name={name}
      className={inputClass}
      onChange={onChange}
      value={value}
      disabled={disabled}
    />
  );
};

export default Input;
