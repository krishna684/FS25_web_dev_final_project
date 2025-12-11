import { useState } from "react";

const CommentForm = ({ onSubmit }) => {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSubmit({ text });
    setText("");
  };

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <textarea
        rows={3}
        placeholder="Add a comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button className="btn-primary" type="submit">
        Comment
      </button>
    </form>
  );
};

export default CommentForm;
