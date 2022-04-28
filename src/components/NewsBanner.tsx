import { css } from "@emotion/css";
import styled from "@emotion/styled";
import React from "react";
import { FaTimesCircle } from "react-icons/fa";
import IconButton from "./common/IconButton";

const News = styled.div`
  width: 100%;
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  text-align: center;
  font-size: 1rem;
  padding: 1rem;
  position: relative;
`;

type NewsType = {
  date?: string;
  title?: string;
  content?: string;
  dismissed?: boolean;
};

export const NewsBanner = () => {
  const [news, setNews] = React.useState<NewsType>();

  const fetchNews = async () => {
    try {
      const resp = await fetch(
        "https://raw.githubusercontent.com/simonv3/beam/main/app-news.json"
      );
      const mostRecentNews = await resp.json();

      const existingNewsString = localStorage.getItem("news");
      const existingNews: NewsType = JSON.parse(
        existingNewsString && existingNewsString !== ""
          ? existingNewsString
          : "{}"
      );

      if (mostRecentNews.date !== existingNews.date) {
        setNews(mostRecentNews);
        localStorage.setItem("news", JSON.stringify(mostRecentNews));
      } else if (!existingNews.dismissed) {
        setNews(existingNews);
      }
    } catch (e) {
      console.warn("no news", e);
    }
  };

  const dismissNews = React.useCallback(() => {
    localStorage.setItem("news", JSON.stringify({ ...news, dismissed: true }));
    setNews(undefined);
  }, [news]);

  React.useEffect(() => {
    fetchNews();
  }, []);

  if (!news || !news.title || !news.date || !news.content) {
    return null;
  }

  return (
    <News>
      <strong>{news.title}</strong>: {news.content}
      <IconButton
        className={css`
          position: absolute;
          top: 0.5rem;
          right: 1rem;
          color: white !important;
        `}
        onClick={dismissNews}
      >
        <FaTimesCircle />
      </IconButton>
    </News>
  );
};
