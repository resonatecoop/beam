import React from "react";

import styled from "@emotion/styled";

export interface Compactable {
  compact?: boolean;
  variant?: "link" | "outlined";
}

const CustomButton = styled.button<Compactable>`
  background: none;
  border: none;

  transition: 0.25s background-color, 0.25s color;

  ${(props) => {
    switch (props.variant) {
      case "link":
        return `
          color: var(--magenta);

          &:hover:not(:disabled) {
            color: var(--dark-magenta);
          }
        `;
      case "outlined":
        return `
          color: var(--magenta);
          background-color: transparent;
          border: 2px solid var(--magenta);
          padding: ${props.compact ? ".3rem .5rem" : "1rem"};

          &:hover:not(:disabled) {
            color: var(--dark-magenta);
            border: 2px solid var(--dark-magenta);
          }

          &[disabled] {
            color: #ddd;
            border-color: #ddd;
          }
        `;
      default:
        return `
          padding: ${props.compact ? ".3rem .5rem" : "1rem"};
          background-color: var(--magenta);
          color: white;

          &:hover:not(:disabled) {
            background-color: var(--dark-magenta);
          }
        `;
    }
  }}
  align-items: center;
  display: inline-flex;
  border-radius: 6px;
  font-size: 1rem;
  justify-content: center;
  line-height: 1rem;
  margin-right: 0.25rem;
  white-space: nowrap;

  &:hover:not(:disabled) {
    cursor: pointer;
  }

  & .startIcon {
    margin-top: 0.1rem;
    margin-right: 0.5rem;
    line-height: 0.785rem;
  }

  & .endIcon {
    margin-top: 0.1rem;
    margin-left: 0.5rem;
    line-height: 0.785rem;
  }
`;

export interface ButtonProps extends Compactable {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  startIcon?: React.ReactElement;
  endIcon?: React.ReactElement;
  disabled?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  startIcon,
  endIcon,
  disabled,
  ...props
}) => {
  return (
    <CustomButton onClick={onClick} disabled={disabled} {...props}>
      {startIcon ? <span className="startIcon">{startIcon}</span> : ""}
      {children}
      {endIcon ? <span className="endIcon">{endIcon}</span> : ""}
    </CustomButton>
  );
};

export default Button;
