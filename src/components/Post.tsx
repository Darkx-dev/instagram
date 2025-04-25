/* eslint-disable @next/next/no-img-element */
"use client"
import { useState } from "react";
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import type { FormEvent } from "react";

type Comment = {
    username: string;
    text: string;
};

type LikedBy = {
    username: string;
    profilePic: string;
};

type PostProps = {
    id: number;
    username: string;
    profilePic: string;
    content: string[];
    caption: string;
    timestamp: string;
    isLiked: boolean;
    likes: number;
    likedBy: LikedBy[];
    comments: Comment[];
    isVerified?: boolean;
    onViewAllComments?: () => void;
};

export default function Post({
    username,
    profilePic,
    content,
    caption,
    timestamp,
    isLiked: initialIsLiked,
    likes: initialLikes,
    likedBy,
    comments,
    isVerified = false,
    onViewAllComments,
}: PostProps) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isLiked, setIsLiked] = useState(initialIsLiked);
    const [likes, setLikes] = useState(initialLikes);
    const [saved, setSaved] = useState(false);
    const [comment, setComment] = useState("");

    const handleLike = () => {
        if (isLiked) {
            setLikes(likes - 1);
        } else {
            setLikes(likes + 1);
        }
        setIsLiked(!isLiked);
    };

    const handleSave = () => {
        setSaved(!saved);
    };

    const handleComment = (e: FormEvent) => {
        e.preventDefault();
        if (comment.trim()) {
            // In a real app, you would add the comment to the comments array
            // and send it to the backend
            setComment("");
        }
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev === content.length - 1 ? prev : prev + 1));
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? prev : prev - 1));
    };

    // Display only 2 comments, regardless of how many there are
    const displayedComments = comments.slice(0, 2);

    return (
        <div className=" text-white max-w-[31rem] mx-auto border-b border-zinc-800">
            {/* Post Header */}
            <div className="flex items-center justify-between py-3">
                <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 p-0.5 mr-2">
                        <img
                            src={profilePic}
                            alt={username}
                            className="w-full h-full rounded-full object-cover border border-black"
                        />
                    </div>
                    <div className="flex items-center">
                        <span className="font-medium text-sm">{username}</span>
                        {isVerified && (
                            <span className="ml-1 text-blue-500">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#3897f0" />
                                </svg>
                            </span>
                        )}
                        <span className="text-gray-500 mx-1">•</span>
                        <span className="text-gray-500 text-sm">{timestamp}</span>
                    </div>
                </div>
                <button>
                    <MoreHorizontal size={20} className="text-white" />
                </button>
            </div>

            {/* Post Content Carousel */}
            <div className="w-full relative border ">
                <div className="relative overflow-hidden">
                    <img
                        src={content[currentSlide]}
                        alt={`Content slide ${currentSlide + 1}`}
                        className="w-full object-cover"
                        onDoubleClick={handleLike}
                    />

                    {/* Navigation Arrows (only show if there are multiple slides) */}
                    {content.length > 1 && (
                        <>
                            {currentSlide > 0 && (
                                <button
                                    onClick={prevSlide}
                                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-opacity-50 rounded-full p-1"
                                >
                                    <ChevronLeft size={24} className="text-white" />
                                </button>
                            )}

                            {currentSlide < content.length - 1 && (
                                <button
                                    onClick={nextSlide}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2  bg-opacity-50 rounded-full p-1"
                                >
                                    <ChevronRight size={24} className="text-white" />
                                </button>
                            )}
                        </>
                    )}

                    {/* Progress Indicators */}
                    {content.length > 1 && (
                        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1">
                            {content.map((_, index) => (
                                <div
                                    key={index}
                                    className={`h-2 w-2 rounded-full ${index === currentSlide ? 'bg-white' : 'bg-gray-500'}`}
                                    onClick={() => setCurrentSlide(index)}
                                    role="button"
                                    tabIndex={0}
                                    aria-label={`Go to slide ${index + 1}`}
                                ></div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="p-3">
                <div className="flex justify-between mb-2">
                    <div className="flex space-x-4">
                        <button onClick={handleLike} className="focus:outline-none">
                            <Heart
                                size={24}
                                className={`${isLiked ? "fill-red-500 text-red-500" : "text-white"}`}
                            />
                        </button>
                        <button className="focus:outline-none">
                            <MessageCircle size={24} className="text-white" />
                        </button>
                        <button className="focus:outline-none">
                            <Send size={24} className="text-white" />
                        </button>
                    </div>
                    <button onClick={handleSave} className="focus:outline-none">
                        <Bookmark
                            size={24}
                            className={`${saved ? "fill-white text-white" : "text-white"}`}
                        />
                    </button>
                </div>

                {/* Likes */}
                {likedBy && likedBy.length > 0 && (
                    <div className="flex items-center mb-2">
                        <div className="flex -space-x-2 mr-2">
                            {likedBy.slice(0, 3).map((user, index) => (
                                <img
                                    key={index}
                                    src={user.profilePic}
                                    alt={user.username}
                                    className="w-5 h-5 rounded-full border border-black"
                                />
                            ))}
                        </div>
                        <div className="text-sm">
                            Liked by <span className="font-medium">{likedBy[0].username}</span>
                            {likedBy.length > 1 && (
                                <> and <span className="font-medium">{likes - 1} others</span></>
                            )}
                        </div>
                    </div>
                )}

                {/* Caption */}
                <div className="text-sm mb-1">
                    <span className="font-medium mr-1">{username}</span>
                    {caption.length > 100 ? (
                        <>
                            {caption.substring(0, 100)}
                            <span className="text-gray-500"> more</span>
                        </>
                    ) : (
                        caption
                    )}
                </div>

                {/* Comments */}
                {comments.length > 0 && (
                    <div className="text-sm mt-2">
                        {/* Keep the button but use the onViewAllComments prop instead of internal state */}
                        {comments.length > 2 && (
                            <button
                                className="text-gray-500 mb-1"
                                onClick={onViewAllComments}
                            >
                                View all {comments.length} comments
                            </button>
                        )}

                        {displayedComments.map((comment, index) => (
                            <div key={index} className="mb-1">
                                <span className="font-medium mr-1">{comment.username}</span>
                                {comment.text}
                            </div>
                        ))}
                    </div>
                )}

                {/* Add Comment */}
                <form onSubmit={handleComment} className="mt-3 flex items-center">
                    <input
                        type="text"
                        placeholder="Add a comment..."
                        className="text-sm flex-1 bg-transparent outline-none text-gray-300"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    <button type="submit" className="text-blue-500 text-sm font-medium" disabled={!comment.trim()}>
                        Post
                    </button>
                </form>
            </div>
        </div>
    );
}