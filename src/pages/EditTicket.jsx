import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import api from "../services/api";

const EditTicket = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [project, setProject] = useState("");
  const [priority, setPriority] = useState("medium");
  const [status, setStatus] = useState("todo");
  const [assignedTo, setAssignedTo] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          ticketResponse,
          projectsResponse,
          usersResponse,
          commentsResponse,
        ] = await Promise.all([
          api.get(`/tickets/${id}`),
          api.get("/projects"),
          api.get("/users"),
          api.get(`/comments/ticket/${id}`),
        ]);

        const ticket = ticketResponse.data;

        setTitle(ticket.title);
        setDescription(ticket.description);
        setProject(ticket.project?._id || "");
        setPriority(ticket.priority);
        setStatus(ticket.status);
        setAssignedTo(ticket.assignedTo?._id || "");

        setProjects(projectsResponse.data);
        setUsers(usersResponse.data);
        setComments(commentsResponse.data);
      } catch (error) {
        setError(
          error.response?.data?.message ||
          "Failed to load ticket"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!commentText.trim()) {
      setError("Comment cannot be empty");
      return;
    }

    setError("");
    setCommentLoading(true);

    try {
      const response = await api.post(
        `/comments/ticket/${id}`,
        {
          text: commentText.trim(),
        }
      );

      setComments((prev) => [
        ...prev,
        response.data,
      ]);

      setCommentText("");
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Failed to add comment"
      );
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    const confirmed = window.confirm(
      "Delete this comment?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/comments/${commentId}`);

      setComments((prev) =>
        prev.filter(
          (comment) => comment._id !== commentId
        )
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Failed to delete comment"
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSaving(true);

    try {
      await api.put(`/tickets/${id}`, {
        title,
        description,
        project,
        priority,
        status,
        assignedTo: assignedTo || null,
      });

      navigate("/tickets");
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Failed to update ticket"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="empty-state">
        Loading ticket...
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Edit Ticket</h1>
          <p>Update ticket details</p>
        </div>
      </div>

      <section className="panel form-panel">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label>Title</label>

          <input
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            required
          />

          <label>Description</label>

          <textarea
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            rows={7}
            required
          />

          <div className="form-row">
            <div>
              <label>Project</label>

              <select
                value={project}
                onChange={(e) =>
                  setProject(e.target.value)
                }
                required
              >
                {projects.map((p) => (
                  <option
                    key={p._id}
                    value={p._id}
                  >
                    {p.key} - {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>Assigned To</label>

              <select
                value={assignedTo}
                onChange={(e) =>
                  setAssignedTo(e.target.value)
                }
              >
                <option value="">
                  Unassigned
                </option>

                {users.map((user) => (
                  <option
                    key={user._id}
                    value={user._id}
                  >
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div>
              <label>Priority</label>

              <select
                value={priority}
                onChange={(e) =>
                  setPriority(e.target.value)
                }
              >
                <option value="low">Low</option>
                <option value="medium">
                  Medium
                </option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label>Status</label>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value)
                }
              >
                <option value="todo">Todo</option>
                <option value="in-progress">
                  In Progress
                </option>
                <option value="resolved">
                  Resolved
                </option>
                <option value="closed">
                  Closed
                </option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="secondary-btn"
              onClick={() =>
                navigate("/tickets")
              }
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-btn"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>
          </div>
        </form>

        <div className="comments-section">

          <h2>Comments</h2>

          <form onSubmit={handleAddComment} className="comment-form">

            <label htmlFor="comment">
              Comment
            </label>

            <textarea
              id="comment"
              value={commentText}
              onChange={(e) =>
                setCommentText(e.target.value)
              }
              placeholder="Write a comment..."
              rows={4}
              maxLength={500}
              required
            />

            <div className="comment-form-footer">

              <span className="character-count">
                {commentText.length}/500
              </span>

              <button
                type="submit"
                className="primary-btn"
                disabled={
                  commentLoading ||
                  !commentText.trim()
                }
              >
                {commentLoading
                  ? "Adding..."
                  : "Add Comment"}
              </button>

            </div>

          </form>

          <div className="comments-list">

            {comments.map((comment) => (
              <div
                className="comment-card"
                key={comment._id}
              >

                <div className="comment-header">

                  <strong>
                    {comment.createdBy?.name ||
                      "Unknown User"}
                  </strong>

                  <span>
                    {new Date(
                      comment.createdAt
                    ).toLocaleString()}
                  </span>

                </div>

                <p>{comment.text}</p>

                {(user?.role === "admin" ||
                  comment.createdBy?._id ===
                  user?._id) && (
                    <button
                      className="delete-btn"
                      onClick={() =>
                        handleDeleteComment(
                          comment._id
                        )
                      }
                    >
                      Delete
                    </button>
                  )}

              </div>
            ))}

            {comments.length === 0 && (
              <div className="empty-state">
                No comments yet.
              </div>
            )}

          </div>
        </div>

      </section>
    </div>
  );
};

export default EditTicket;