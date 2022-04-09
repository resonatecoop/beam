import { css } from "@emotion/css";
import React from "react";
import {
  FaFacebook,
  FaGlobe,
  FaInstagram,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";

export const LinkToWeb: React.FC<{ link: { href: string; text: string } }> = ({
  link,
}) => {
  const determineIcon = (text: string) => {
    if (text.includes("facebook")) {
      return <FaFacebook />;
    }
    if (text.includes("twitter")) {
      return <FaTwitter />;
    }
    if (text.includes("youtube")) {
      return <FaYoutube />;
    }
    if (text.includes("instagram")) {
      return <FaInstagram />;
    }
    return <FaGlobe />;
  };
  return (
    <a
      href={link.href}
      key={link.href}
      className={css`
        margin-right: 0.5rem;
      `}
    >
      {determineIcon(link.text)}
    </a>
  );
};

export default LinkToWeb;
