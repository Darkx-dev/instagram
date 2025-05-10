import axios from 'axios';

// User API functions
export const fetchUserProfile = async (username: string) => {
  try {
    const response = await axios.get(`/api/users/${username}`);
    return response.data.user;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const fetchCurrentUser = async () => {
  try {
    const response = await axios.get('/api/users/me');
    return response.data.user;
  } catch (error) {
    console.error('Error fetching current user:', error);
    throw error;
  }
};

export const updateUserProfile = async (data: {
  fullName?: string;
  bio?: string;
  avatarUrl?: string;
  pronouns?: string;
  accountType?: string;
  currentPassword?: string;
  newPassword?: string;
}) => {
  try {
    const response = await axios.patch('/api/users/me', data);
    return response.data.user;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

export const followUser = async (username: string) => {
  try {
    const response = await axios.post(`/api/users/${username}/follow`);
    return response.data;
  } catch (error) {
    console.error('Error following user:', error);
    throw error;
  }
};

export const unfollowUser = async (username: string) => {
  try {
    const response = await axios.delete(`/api/users/${username}/follow`);
    return response.data;
  } catch (error) {
    console.error('Error unfollowing user:', error);
    throw error;
  }
};

export const fetchUserFollowers = async (username: string, page = 1, limit = 20) => {
  try {
    const response = await axios.get(`/api/users/${username}/followers?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user followers:', error);
    throw error;
  }
};

export const fetchUserFollowing = async (username: string, page = 1, limit = 20) => {
  try {
    const response = await axios.get(`/api/users/${username}/following?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user following:', error);
    throw error;
  }
};

// Post API functions
export const fetchUserPosts = async (username: string, page = 1, limit = 20) => {
  try {
    const response = await axios.get(`/api/posts?authorId=${username}&page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user posts:', error);
    throw error;
  }
};

export const fetchSavedPosts = async (page = 1, limit = 20) => {
  try {
    const response = await axios.get(`/api/users/me/saved?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching saved posts:', error);
    throw error;
  }
};

export const likePost = async (postId: string) => {
  try {
    const response = await axios.post(`/api/posts/${postId}/like`);
    return response.data;
  } catch (error) {
    console.error('Error liking post:', error);
    throw error;
  }
};

export const unlikePost = async (postId: string) => {
  try {
    const response = await axios.delete(`/api/posts/${postId}/like`);
    return response.data;
  } catch (error) {
    console.error('Error unliking post:', error);
    throw error;
  }
};

export const savePost = async (postId: string) => {
  try {
    const response = await axios.post(`/api/posts/${postId}/save`);
    return response.data;
  } catch (error) {
    console.error('Error saving post:', error);
    throw error;
  }
};

export const unsavePost = async (postId: string) => {
  try {
    const response = await axios.delete(`/api/posts/${postId}/save`);
    return response.data;
  } catch (error) {
    console.error('Error unsaving post:', error);
    throw error;
  }
};

// Comment API functions
export const fetchPostComments = async (postId: string, page = 1, limit = 20) => {
  try {
    const response = await axios.get(`/api/posts/${postId}/comments?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching post comments:', error);
    throw error;
  }
};

export const createComment = async (postId: string, content: string) => {
  try {
    const formData = new FormData();
    formData.append('content', content);
    
    const response = await axios.post(`/api/posts/${postId}/comment`, formData);
    return response.data;
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
};

export const deleteComment = async (commentId: string) => {
  try {
    const response = await axios.delete(`/api/comments/${commentId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};

export const likeComment = async (commentId: string) => {
  try {
    const response = await axios.post(`/api/comments/${commentId}/like`);
    return response.data;
  } catch (error) {
    console.error('Error liking comment:', error);
    throw error;
  }
};

export const unlikeComment = async (commentId: string) => {
  try {
    const response = await axios.delete(`/api/comments/${commentId}/like`);
    return response.data;
  } catch (error) {
    console.error('Error unliking comment:', error);
    throw error;
  }
};
