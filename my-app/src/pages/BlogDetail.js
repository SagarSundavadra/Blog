import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./BlogDetail.css";
import { Link } from "react-router-dom";

const BlogDetail = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_API}/api/articles?filters[slug][$eq]=${slug}&populate=*`
      )
      .then((res) => {
        setArticle(res.data.data[0]);
      });
  }, [slug]);

  if (!article) return <p>Loading...</p>;
  const { title, content, coverImage, author, publishedDate, readingTime } =
    article;

  const parsePlainText = (raw) => {
    if (typeof raw !== "string") return "";

    let html = raw;

    html = html.replace(/^###### (.+)$/gm, "<h6>$1</h6>");
    html = html.replace(/^##### (.+)$/gm, "<h5>$1</h5>");
    html = html.replace(/^#### (.+)$/gm, "<h4>$1</h4>");
    html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>");
    html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>");
    html = html.replace(/^# (.+)$/gm, "<h1>$1</h1>");

    html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

    html = html.replace(/\_(.+?)\_/g, "<em>$1</em>");

    html = html.replace(/^>\s*(.+)$/gm, "<blockquote>$1</blockquote>");

    html = html.replace(/^- (.+)$/gm, "<li>$1</li>");

    html = html.replace(/(<li>.*<\/li>)(\s*<li>.*<\/li>)*/g, function (match) {
      return "<ul>" + match + "</ul>";
    });

    html = html.replace(/^(\d+)\. (.+)$/gm, "<li>$2</li>");

    const paragraphs = html.split(/\n\s*\n/);
    const processedParagraphs = paragraphs.map((paragraph) => {
      if (paragraph.trim().match(/^(<li>.*<\/li>\s*)+$/)) {
        return "<ol>" + paragraph + "</ol>";
      }
      return paragraph;
    });

    html = processedParagraphs.join("\n\n");
    html = html.replace(/\n(?![^<]*>)/g, "<br/>");

    html = html.replace(
      /<br\/>\s*(<\/?(h[1-6]|ul|ol|li|blockquote)[^>]*>)\s*<br\/>/g,
      "$1"
    );
    html = html.replace(
      /(<\/?(h[1-6]|ul|ol|li|blockquote)[^>]*>)\s*<br\/>/g,
      "$1"
    );
    html = html.replace(
      /<br\/>\s*(<\/?(h[1-6]|ul|ol|li|blockquote)[^>]*>)/g,
      "$1"
    );

    return html;
  };
  let parsedText = parsePlainText(content);
  const imageUrl = coverImage?.url;

  return (
    <div className="blog-container">
      <Link to={`/`} className="blog-card-link">
        ← Back To Blog
      </Link>
      <h1 className="blog-title">{title}</h1>
      {imageUrl && (
        <div
          className="blog-cover-with-content"
          style={{ backgroundImage: `url(${imageUrl})` }}
        >
          {/* <img
      src={imageUrl}
      alt="Blog cover"
      className="blog-cover-image"
    /> */}
        </div>
      )}
      <div className="blog-meta">
        <span>📅 {new Date(publishedDate).toLocaleDateString()}</span>
        <span>⏱️ {readingTime} min read</span>
        <span>✍️ By {author}</span>
      </div>
      <div className="blog-cover-overlay">
        <div
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: parsedText }}
        />
      </div>
    </div>
  );
};

export default BlogDetail;
