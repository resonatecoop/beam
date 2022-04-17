import styled from "@emotion/styled";
import React from "react";
import Modal from "./Modal";

const Code = styled.code`
  font-size: 0.8rem;
  background-color: black;
  display: block;
  color: white;
  padding: 1rem;
  position: relative;
  cursor: pointer;

  &:after {
    content: "copy";
    display: block;
    position: absolute;
    bottom: 0;
    right: 0;
    background: white;
    color: black;
    margin: 0.5rem;
    padding: 0.5rem;
    transition: 0.25s background;
  }

  &:hover:after {
    background: #ccc;
  }
`;

const embedRoot = "https://stream.resonate.coop/embed/";

const embed = (url: string) => `<iframe
  src="${url}"
  frameborder="0"
  width="400px"
  height="600"
  style="margin:0;border:none;width:400px;height:600px;border: 1px solid #000;"
  ></iframe>`;

export const SharePopUp: React.FC<{
  open: boolean;
  onClose: () => void;
  track?: Track;
  trackgroup?: Trackgroup;
}> = ({ open, track, trackgroup, onClose }) => {
  const url = trackgroup
    ? `${embedRoot}artist/${trackgroup.creator_id}/release/${trackgroup.slug}`
    : `${embedRoot}track/${track?.id}`;
  const copyToClipboard = () => {
    navigator.clipboard.writeText(embed(url));
  };

  return (
    <Modal open={open} onClose={onClose} size="small">
      <div>
        <h4>Embed code</h4>
        <Code onClick={copyToClipboard}>{embed(url)}</Code>
      </div>
    </Modal>
  );
};

export default SharePopUp;
