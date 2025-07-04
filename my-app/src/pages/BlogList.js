import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./BlogList.css";

const BlogList = () => {
  const [articles, setArticles] = useState([]);
  const [api, setApi] = useState("");
  useEffect(() => {
    setApi(process.env.REACT_APP_API);
      axios
        .get(`${api}/api/articles?populate=*`)
        .then((res) => {
          setArticles(res.data.data);
        })
        .catch((err) => {
          console.error("Error fetching articles:", err);
        });
  }, [api]);
  return (
    <div className="blog-list-container">
      <h1 className="blog-list-title">LumezAI Blog</h1>
      <p className="blog-list-subtitle">
        Insights, tips, and updates from the world of AI-powered fashion
      </p>

      <div className="blog-grid">
        {articles.map((article) => {
          if (!article) return null;

          const {
            id,
            title,
            slug,
            coverImage,
            publishedDate,
            readingTime,
            content,
          } = article;

          const imageUrl = coverImage?.url;
          return (
            <div className="blog-card">
              {imageUrl && (
                <div
                  className="blog-card-image"
                  style={{
                    backgroundImage: `linear-gradient(to bottom, rgba(255,255,255,0.1), rgba(255,255,255,0.1)), url(${imageUrl})`,
                  }}
                />
              )}

              <div className="blog-card-content">
                <p className="blog-card-meta">
                  {new Date(publishedDate).toLocaleDateString()} • {readingTime}{" "}
                  min read
                </p>
                <h3 className="blog-card-title">{title}</h3>
                <p className="blog-card-excerpt">{content.slice(0, 120)}...</p>
                <Link to={`/blog/${slug}`} className="blog-card-link">
                  Read more →
                </Link>
              </div>
            </div>
          );
        })}
      </div>
      <p>More articles coming soon!</p>
      <Link to={`/subscribe`}>
        <button className="button">subscribe for more</button>
      </Link>
    </div>
  );
};

export default BlogList;
