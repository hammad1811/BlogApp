import React, { useEffect, useState } from 'react';
import WriteBlog from '../components/WriteBlog';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function EditPost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_PORT}/api/v1/blog/getPostById/${id}`, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });

        if (res.data && res.data.data) {
          setPost(res.data.data);
        } else {
          throw new Error('Invalid API response format');
        }
      } catch (error) {
        setError('Failed to fetch post. Please try again later.');
        toast.error('Failed to fetch post');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  return (
    <div>
      {error && <p>{error}</p>}
      {loading ? <p>Loading...</p> : post ? <WriteBlog post={post} /> : <p>No post found</p>}
    </div>
  );
}

export default EditPost;
