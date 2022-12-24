import React from "react";
import { css } from "@emotion/css";
import styled from "@emotion/styled";
import { bp } from "../../constants";
import IconButton from "./IconButton";
import ReactDOM from "react-dom";
import Background from "./Background";

const wrapper = css`
  position: fixed;
  pointer-events: none;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: scroll;
`;

type ContentProps = {
  size?: "small";
};

const Content = styled.div<ContentProps>`
  pointer-events: auto;
  background-color: #fefefe;
  margin: 0 auto;
  margin-top: 6rem;
  padding: 20px;
  max-height: 80%;
  overflow: scroll;
  z-index: 999;
  border: 1px solid #888;
  display: flex;
  flex-direction: column;
  width: ${(props) => (props.size === "small" ? "40%" : "80%")};
  animation: 300ms ease-out forwards slide-up;

  @media (max-width: ${bp.medium}px) {
    width: 90%;
    position: absolute;
    z-index: 9999;
    right: 0;
    left: 0;
  }

  @media (prefers-color-scheme: dark) {
    background-color: #333;
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
  margin-right: 0;
  padding-right: 0 !important;
  padding-top: 0 !important;

  &:hover,
  &:focus {
    text-decoration: none;
  }
`;

export const Modal: React.FC<{
  open: boolean;
  onClose: () => void;
  size?: "small";
}> = ({ children, open, onClose, size }) => {
  const [container] = React.useState(() => {
    // This will be executed only on the initial render
    // https://reactjs.org/docs/hooks-reference.html#lazy-initial-state
    return document.createElement("div");
  });
  React.useEffect(() => {
    document.body.appendChild(container);
    return () => {
      document.body.removeChild(container);
    };
  }, [container]);

  const onCloseWrapper = React.useCallback(
    (
      e:
        | React.MouseEvent<HTMLButtonElement, MouseEvent>
        | React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
      e.stopPropagation();
      onClose();
    },
    [onClose]
  );

  if (!open) {
    return null;
  }

  return ReactDOM.createPortal(
    <>
      <Background onClick={onCloseWrapper} />
      <div className={wrapper} data-cy="modal">
        <Content size={size}>
          <div>
            <IconButton
              className={close}
              onClick={onCloseWrapper}
              aria-label="close"
            >
              &times;
            </IconButton>
          </div>
          {children}
        </Content>
      </div>
    </>,
    container
  );
};

export default Modal;
