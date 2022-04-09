import React from "react";
import { css } from "@emotion/css";
import styled from "@emotion/styled";
import constants from "../../constants";
import IconButton from "./IconButton";

const background = css`
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
`;

const wrapper = css`
  position: fixed;
  pointer-events: none;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
`;

type ContentProps = {
  size?: "small";
};

const Content = styled.div<ContentProps>`
  pointer-events: auto;
  background-color: #fefefe;
  margin: 15% auto; /* 15% from the top and centered */
  padding: 20px;
  z-index: 999;
  border: 1px solid #888;
  width: ${(props) => (props.size === "small" ? "40%" : "80%")};

  @media (max-width: ${constants.bp.medium}px) {
    width: 90%;
    position: absolute;
    bottom: 10rem;
    z-index: 9999;
    right: 0;
    left: 0;
  }
`;

const close = css`
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
  border: none;
  background: none;
  line-height: 16px;
  cursor: pointer;
  margin-bottom: 0.25rem;
  &:hover,
  &:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
  }
`;

export const Modal: React.FC<{
  open: boolean;
  onClose: () => void;
  size?: "small";
}> = ({ children, open, onClose, size }) => {
  if (!open) {
    return null;
  }
  return (
    <>
      <div className={background} onClick={onClose}></div>
      <div className={wrapper}>
        <Content size={size}>
          <IconButton className={close} onClick={onClose} aria-label="close">
            &times;
          </IconButton>

          {children}
        </Content>
      </div>
    </>
  );
};

export default Modal;
