import { Alert, Button, Textarea } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Comment from "./Comment";

const CommentSection = ({ postId }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [commentError, setCommentError] = useState(null);
  const navigate = useNavigate();

  const handleComment = async (e) => {
    e.preventDefault();
    if (comment.length > 200) {
      return;
    }

    try {
      const res = await fetch("/api/comment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: comment,
          postId,
          userId: currentUser._id,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setComment("");
        setCommentError(null);
        setComments([data, ...comments]);
      }
    } catch (error) {
      console.log(error.message);
      setCommentError(error.message);
    }
  };

  const handleLike = async (commentId) => {
    if (!currentUser) {
      navigate("/sign-in");
      return;
    }

    try {
      const res = await fetch(`/api/comment/likeComment/${commentId}`, {
        method: "PUT",
      });
      if (res.ok) {
        const data = await res.json();
        setComments(
          comments.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  likes: data.likes,
                  numberOfLikes: data.likes.length,
                }
              : comment
          )
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchComment = async () => {
      try {
        const res = await fetch(`/api/comment/getPostComment/${postId}`);

        if (res.ok) {
          const data = await res.json();
          setComments(data);
        }
      } catch (error) {
        setCommentError(error.message);
      }
    };
    fetchComment();
  }, [postId]);

  return (
    <div className="max-w-3xl mx-auto w-full p-3">
      {currentUser ? (
        <div className="flex items-center gap-1 ">
          <p>Signed in as:</p>
          <img
            src={currentUser.profilePicture}
            alt={currentUser.username}
            className="w-5 h-5 object-cover rounded-full"
          />
          <Link
            to={`/dashboard?tab=profile`}
            className="text-sky-600 hover:underline"
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div>
          You must be signed in to comment
          <Link className="text-sky-600 hover:underline" to={"/sign-in"}>
            Signin
          </Link>
        </div>
      )}
      {currentUser && (
        <form
          onClick={handleComment}
          className="border border-teal-500 rounded-md p-3 my-2"
        >
          <Textarea
            placeholder="Add a comment..."
            rows={3}
            maxLength={200}
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
          <div className="flex items-center justify-between mt-5">
            <p className="text-gray-500">
              {200 - comment.length} charactor remaining
            </p>
            <Button
              className=""
              type="submit"
              gradientDuoTone={"purpleToBlue"}
              outline
            >
              Submit
            </Button>
          </div>
          {commentError && (
            <Alert color={"failure"} className="mt-5">
              {commentError}
            </Alert>
          )}
        </form>
      )}

      {comments.length === 0 ? (
        <p>No Comments yet</p>
      ) : (
        <>
          <div className="flex items-center gap-3 my-5 ">
            <div className="px-2 py-1 border border-gray-600">
              <p>{comments.length}</p>
            </div>
            <p>Comments</p>
          </div>
          {comments.map((comment) => (
            <Comment key={comment._id} comment={comment} onLike={handleLike} />
          ))}
        </>
      )}
    </div>
  );
};

export default CommentSection;
