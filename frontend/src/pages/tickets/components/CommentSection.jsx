// frontend/src/pages/tickets/components/CommentSection.jsx
import { useState } from "react";
import { useTickets } from "../hooks/useTickets";

const DEFAULT_USER = { id: "user-001", name: "John Doe", role: "USER" };

export default function CommentSection({ ticket, onUpdate, currentUser = DEFAULT_USER }) {
  const { addComment, editComment, deleteComment, loading } = useTickets();
  const [content, setContent]   = useState("");
  const [editId, setEditId]     = useState(null);
  const [editText, setEditText] = useState("");

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    const updated = await addComment(ticket.id, {
      authorId: currentUser.id,
      authorName: currentUser.name,
      userRole: currentUser.role,
      content,
    });
    setContent("");
    onUpdate?.(updated);
  };

  const handleEdit = async (commentId) => {
    const updated = await editComment(
      ticket.id,
      commentId,
      currentUser.id,
      editText
    );
    setEditId(null);
    onUpdate?.(updated);
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    await deleteComment(ticket.id, commentId, currentUser.id, currentUser.role === "ADMIN");
    onUpdate?.({ ...ticket, comments: ticket.comments.filter((c) => c.id !== commentId) });
  };

  const comments = ticket.comments || [];

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-700 text-sm">
        Comments ({comments.length})
      </h3>

      {/* Comment list */}
      <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
        {comments.length === 0 && (
          <p className="text-gray-400 text-sm text-center py-4">No comments yet.</p>
        )}
        {comments.map((c) => (
          <div key={c.id} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-700">{c.authorName}</span>
                <span className="text-xs bg-gray-200 text-gray-500 px-1.5 rounded">{c.userRole}</span>
                {c.edited && <span className="text-xs text-gray-400 italic">(edited)</span>}
              </div>
              <span className="text-xs text-gray-400">
                {new Date(c.createdAt).toLocaleDateString()}
              </span>
            </div>

            {editId === c.id ? (
              <div className="space-y-2 mt-1">
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  rows={2}
                  className="w-full border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#F47C20] resize-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(c.id)}
                    className="text-xs bg-[#F47C20] text-white px-3 py-1 rounded-lg hover:bg-orange-600"
                  >Save</button>
                  <button
                    onClick={() => setEditId(null)}
                    className="text-xs bg-gray-200 text-gray-600 px-3 py-1 rounded-lg hover:bg-gray-300"
                  >Cancel</button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-700 mt-1">{c.content}</p>
            )}

            {/* Edit only own comment; delete own or admin */}
            {(c.authorId === currentUser.id || currentUser.role === "ADMIN") && editId !== c.id && (
              <div className="flex gap-3 mt-2">
                {c.authorId === currentUser.id && (
                  <button
                    onClick={() => { setEditId(c.id); setEditText(c.content); }}
                    className="text-xs text-blue-500 hover:text-blue-700"
                  >Edit</button>
                )}
                <button
                  onClick={() => handleDelete(c.id)}
                  className="text-xs text-red-400 hover:text-red-600"
                >Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add comment */}
      <form onSubmit={handleAdd} className="flex gap-2 pt-2 border-t border-gray-100">
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F47C20]"
        />
        <button
          type="submit" disabled={loading || !content.trim()}
          className="bg-[#F47C20] hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition disabled:opacity-50"
        >
          Post
        </button>
      </form>
    </div>
  );
}