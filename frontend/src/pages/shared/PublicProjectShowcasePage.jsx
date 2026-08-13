// src/pages/PublicProjectShowcasePage.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as projectPostApi from '../../api/endpoint/projectPostApi';
import * as sellerApi from '../../api/endpoint/Sellerapi';
import LocationMap from '../../components/LocationMap';
import { Button } from '../../components/ui/Button';

export default function PublicProjectShowcasePage() {
  const { projectId } = useParams();
  const [posts, setPosts] = useState([]);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [postsRes, projectRes] = await Promise.all([
          projectPostApi.getProjectPosts(projectId),
          sellerApi.getProjectById(projectId).catch(() => null), // may 403 for a non-owner/non-staff viewer — fine, map still works from post data alone if this fails
        ]);
        setPosts(postsRes.data.posts);
        setProject(projectRes?.data?.project || null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [projectId]);

  async function handleLike(postId) {
    const { data } = await projectPostApi.likeProjectPost(postId);
    setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, likes_count: data.likes_count } : p)));
  }

  async function handleShare(postId) {
    const { data } = await projectPostApi.shareProjectPost(postId);
    setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, shares_count: data.shares_count } : p)));
    navigator.clipboard?.writeText(window.location.href);
  }

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      {project?.latitude && project?.longitude && (
        <LocationMap markers={[{ lat: project.latitude, lng: project.longitude, label: project.title }]} />
      )}

      {posts.map((post) => (
        <article key={post.id} className="space-y-4 border-b border-border pb-8">
          <h1 className="text-3xl font-bold">{post.title}</h1>
          <p className="text-muted-foreground">{post.description}</p>
          {post.story && <p className="whitespace-pre-line">{post.story}</p>}
          {post.how_it_works && (
            <div>
              <h2 className="font-semibold mb-1">How It Works</h2>
              <p className="whitespace-pre-line">{post.how_it_works}</p>
            </div>
          )}

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => handleLike(post.id)}>❤ {post.likes_count}</Button>
            <Button variant="outline" onClick={() => handleShare(post.id)}>↗ Share ({post.shares_count})</Button>
          </div>
        </article>
      ))}
    </div>
  );
}