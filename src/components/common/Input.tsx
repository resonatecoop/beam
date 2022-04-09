import React from "react";

import { css, cx } from "@emotion/css";

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
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}> = ({ onChange, disabled, name, value, className, placeholder }) => {
  return (
    <input
      name={name}
      placeholder={placeholder}
      className={cx(inputClass, className)}
      onChange={onChange}
      value={value}
      disabled={disabled}
    />
  );
};

export default Input;
