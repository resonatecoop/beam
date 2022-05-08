import styled from "@emotion/styled";

export const InlineForm = styled.form<{ compact?: boolean }>`
  display: flex;
  margin-bottom: ${(props) => (props.compact ? "0" : "1rem")};

  > input {
    margin-bottom: 0rem;
    width: 100%;
  }

  > input + button {
    border: 1px solid #bfbfbf;
    border-left: none;
  }
`;

export default InlineForm;
