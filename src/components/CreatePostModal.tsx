/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState } from "react";
import ReactDOM from "react-dom";
import { CreatePostIcon } from "./Icons";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";

interface ModalProps {
    onClose: () => void,
    avatarUrl?: string,
    username: string
}

export default function CreatePostModal({ onClose, avatarUrl = 'https://cdn.jsdelivr.net/gh/alohe/avatars/png/3d_4.png', username }: ModalProps) {
    const [files, setFiles] = useState<File[]>([]);
    const [caption, setCaption] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);

    if (typeof window === "undefined") return null;

    const handleOuterClick = (e: React.MouseEvent) => {
        e.preventDefault();
        onClose();
    };

    const handleInnerClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevents the click event from propagating to the outer div
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles([...files, ...Array.from(e.target.files)]);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files) {
            setFiles([...files, ...Array.from(e.dataTransfer.files)]);
        }
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % files.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) =>
            (prevIndex - 1 + files.length) % files.length
        );
    };

    const handleShare = async () => {
        if (files.length < 1) return;

        try {
            const formData = new FormData();
            files.forEach((file) => {
                formData.append("files", file);
            })
            formData.append("caption", caption);
            const response = await axios.post('/api/posts', formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            console.log(response);
            onClose();
        } catch (err) {
            console.error("Error posting:", err);
        }
    }

    return ReactDOM.createPortal(
        <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
            onClick={handleOuterClick}
        >
            <div
                className="rounded-2xl overflow-clip"
                onClick={handleInnerClick}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                <div className="bg-zinc-950 py-3 border-b border-zinc-500 flex justify-between px-5">
                    <ArrowLeft onClick={onClose} className="cursor-pointer" />
                    <h5 className="font-medium">Create new post</h5>
                    <button className="text-blue-500 cursor-pointer font-medium" onClick={handleShare}>Share</button>
                </div>
                <div className="flex">
                    <div className="flex flex-col justify-center items-center bg-zinc-800 w-xl aspect-square relative">
                        {files.length === 0 ? (
                            <>
                                <CreatePostIcon />
                                <h4 className="my-2">Drag photos and videos here</h4>
                                <input
                                    type="file"
                                    accept="image/*"
                                    // accept="image/*,video/*"
                                    multiple
                                    className="hidden"
                                    id="fileInput"
                                    onChange={handleFileSelect}
                                />
                                <label
                                    htmlFor="fileInput"
                                    className="rounded-lg bg-blue-500 text-white px-3 py-1 cursor-pointer"
                                >
                                    Select from computer
                                </label>
                            </>
                        ) : (
                            <>
                                <div className="w-full h-full flex items-center justify-center">
                                    {files[currentIndex].type.startsWith("image/") ? (
                                        <img
                                            src={URL.createObjectURL(files[currentIndex])}
                                            alt="Selected media"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <video
                                            src={URL.createObjectURL(files[currentIndex])}
                                            controls
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                </div>
                                {files.length > 1 && (
                                    <>
                                        <div onClick={handlePrev} className="bg-black/50 rounded-full cursor-pointer absolute left-4 p-1 top-1/2 transform -translate-y-1/2">
                                            <ChevronLeft size={20} />
                                        </div>
                                        <div onClick={handleNext} className="absolute rounded-full p-1 cursor-pointer right-4 top-1/2 transform -translate-y-1/2 bg-black/50">
                                            <ChevronRight size={20} />
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                    <div className="w-sm bg-zinc-800 p-5 border-l border-zinc-500">
                        <div className="flex items-center gap-2">
                            <img className="rounded-full size-10" src={avatarUrl} alt="" />
                            <p>{username}</p>
                        </div>
                        <textarea className="w-full mt-2 outline-none resize-none" value={caption} onChange={(e) => setCaption(e.target.value)} rows={15} placeholder="Write a caption" name="" id=""></textarea>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
