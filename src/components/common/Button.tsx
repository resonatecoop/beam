import React from "react";

import styled from "@emotion/styled";

export interface Compactable {
  compact?: boolean;
}

const CustomButton = styled.button<Compactable>`
  border: none;
  background: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  line-height: 1rem;
  padding: ${(props) => (props.compact ? ".3rem .5rem" : "1rem")};
  background-color: var(--magenta);
  color: white;
  border-radius: 2px;
  margin-right: 0.25rem;
  white-space: nowrap;
  transition: 0.25s background-color;

  &:hover:not(:disabled) {
    background-color: var(--dark-magenta);
    cursor: pointer;
  }

  & .startIcon {
    margin-right: 1rem;
    line-height: 0.785rem;
  }

  & .endIcon {
    margin-left: 1rem;
    line-height: 0.785rem;
  }
`;

export interface ButtonProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  startIcon?: React.ReactElement;
  endIcon?: React.ReactElement;
  disabled?: boolean;
  style?: React.CSSProperties;
  className?: string;
  compact?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  startIcon,
  endIcon,
  disabled,
  compact,
}) => {
  return (
    <CustomButton onClick={onClick} disabled={disabled} compact={compact}>
      {startIcon ? <span className="startIcon">{startIcon}</span> : ""}
      {children}
      {endIcon ? <span className="endIcon">{endIcon}</span> : ""}
    </CustomButton>
  );
};

export default Button;
