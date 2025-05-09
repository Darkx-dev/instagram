/* eslint-disable @next/next/no-img-element */
"use client";
import { Bookmark, HeartIcon, MessageCircle, Send, X } from "lucide-react";
import { createPortal } from "react-dom";
import Comment from "./Comment";
import { ExtendedPost } from "./ProfilePosts";
import { FormEvent, useState } from "react";
import { formatDistanceToNow } from "date-fns";

// Props for the modal component
interface ModalProps {
    onClose: () => void;
    post: ExtendedPost;
    username: string;
    avatarUrl?: string | null;
}

// Component to display a modal with post details, comments, and a comment form
function PreviewPostModal({
    onClose,
    post,
    username,
    avatarUrl = "https://cdn.jsdelivr.net/gh/alohe/avatars/png/3d_4.png",
}: ModalProps) {
    // State for comment input and submission status
    const [commentContent, setCommentContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Handle comment form submission
    const handleCommentSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!commentContent.trim()) return;

        setIsSubmitting(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append("content", commentContent);

            const response = await fetch(`/api/posts/${post.id}/comment`, {
                method: "POST",
                body: formData,
                credentials: "include", // Include session cookies
            });

            if (!response.ok) {
                throw new Error("Failed to post comment");
            }

            // Clear input on success
            setCommentContent("");
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Format post creation date
    const formattedDate = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });

    // console.log(post);
    return createPortal(
        <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center py-10"
            role="dialog"
            aria-label="Post preview modal"
        >
            {/* Close button */}
            <button
                onClick={onClose}
                className="fixed top-3 right-3 text-white cursor-pointer"
                aria-label="Close modal"
            >
                <X size={30} />
            </button>
            <div className="flex h-full bg-black rounded-lg">
                {/* Post image */}
                <div className="w-fit h-full">
                    {post.images[0]?.imageUrl ? (
                        <img
                            src={post.images[0].imageUrl}
                            alt={post.caption ?? "Post image"}
                            className="h-full w-full object-contain rounded-sm"
                        />
                    ) : (
                        <div className="h-full w-full bg-gray-700 flex items-center justify-center text-white">
                            No Image
                        </div>
                    )}
                </div>
                {/* Post details and comments */}
                <div className="flex flex-col w-sm h-full border-l border-zinc-700">
                    {/* User header */}
                    <div className="flex gap-2 items-center px-3 py-2">
                        <img
                            className="rounded-full size-10 aspect-square"
                            src={avatarUrl ?? "https://cdn.jsdelivr.net/gh/alohe/avatars/png/3d_4.png"}
                            alt={`${username}'s avatar`}
                        />
                        <span className="font-medium">{username}</span>
                    </div>
                    <hr className="border-zinc-700" />
                    {/* Comments list */}
                    <div id="comments-box" className="w-full px-3 py-2 flex-1 overflow-y-auto">
                        {post.comments.length > 0 ? (
                            post.comments.map((comment: ExtendedPost["comments"][number]) => (
                                <Comment
                                    key={comment.id}
                                    username={comment.author.username}
                                    avatarUrl={comment.author.avatarUrl ?? avatarUrl!}
                                    content={comment.content}
                                    createdAt={comment.createdAt}
                                    likes={0} // TODO: Add comment likes from CommentLike model
                                    isLiked={false} // TODO: Check if current user liked the comment
                                />
                            ))
                        ) : (
                            <p className="text-zinc-500 text-sm">No comments yet.</p>
                        )}
                    </div>
                    {/* Actions and metadata */}
                    <div className="mt-auto border-t border-zinc-700">
                        <div className="p-3">
                            <div className="flex justify-between items-center">
                                <div className="flex gap-2 items-center">
                                    <button aria-label="Like post">
                                        <HeartIcon size={25} />
                                    </button>
                                    <button aria-label="View comments">
                                        <MessageCircle size={25} />
                                    </button>
                                    <button aria-label="Share post">
                                        <Send size={25} />
                                    </button>
                                </div>
                                <button aria-label="Bookmark post">
                                    <Bookmark size={25} />
                                </button>
                            </div>
                            <div className="flex flex-col mt-3">
                                <span className="font-medium text-sm">{post.likes.length} likes</span>
                                <span className="text-zinc-500 text-xs">{formattedDate}</span>
                            </div>
                        </div>
                        {/* Comment form */}
                        <form
                            onSubmit={handleCommentSubmit}
                            className="flex items-center border-t border-zinc-700 p-3"
                        >
                            <input
                                type="text"
                                className="outline-none w-full bg-transparent text-white placeholder:text-sm text-sm"
                                placeholder="Add a comment..."
                                name="content"
                                value={commentContent}
                                onChange={(e) => setCommentContent(e.target.value)}
                                disabled={isSubmitting}
                            />
                            <button
                                className="text-blue-500 font-medium text-sm disabled:opacity-50"
                                type="submit"
                                disabled={isSubmitting || !commentContent.trim()}
                            >
                                Post
                            </button>
                        </form>
                        {error && <p className="text-red-500 text-sm px-3 pb-2">{error}</p>}
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}

export default PreviewPostModal;