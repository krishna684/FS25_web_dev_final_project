const CommentList = ({ comments }) => {
  if (!comments?.length) return <p>No comments yet.</p>;
  return (
    <ul className="comment-list">
      {comments.map((c) => (
        <li key={c._id}>
          <p>{c.content ?? c.text}</p>
          <small>
            {c.author?.name || c.author?.email || c.author} •{" "}
            {new Date(c.createdAt).toLocaleString()}
          </small>
        </li>
      ))}
    </ul>
  );
};

export default CommentList;
