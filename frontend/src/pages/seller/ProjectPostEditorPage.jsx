// src/pages/seller/ProjectPostEditorPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as projectPostApi from '../../api/endpoint/projectPostApi';
import api from '../../api/axiosInstance';
import { useSellerStore } from '../../store/useSellerStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Label } from '../../components/ui/Label';
import { Select } from '../../components/ui/Select';

export default function ProjectPostEditorPage() {
  const { projectId: urlProjectId } = useParams();
  const navigate = useNavigate();
  
  const { projects, fetchProjects, loading: projectsLoading } = useSellerStore();
  const [selectedProjectId, setSelectedProjectId] = useState(urlProjectId || '');
  
  const [form, setForm] = useState({ title: '', description: '', story: '', how_it_works: '', images: [], videos: [] });
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!urlProjectId && projects.length === 0) {
      fetchProjects();
    }
  }, [urlProjectId, projects.length, fetchProjects]);

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleFileUpload(e, type) {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setForm(prev => ({ ...prev, [type]: [...prev[type], res.data.cid] }));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to upload file');
    } finally {
      setUploading(false);
      e.target.value = null;
    }
  }

  function removeFile(index, type) {
    setForm(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    
    if (!selectedProjectId) {
      setError("Please select a project first.");
      return;
    }

    setSaving(true);
    try {
      await projectPostApi.createProjectPost({ project_id: Number(selectedProjectId), ...form });
      navigate(`/projects/${selectedProjectId}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to publish showcase');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Public Showcase</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {!urlProjectId && (
          <div>
            <Label htmlFor="project_select">Select Project</Label>
            {projectsLoading ? (
              <p className="text-sm text-muted-foreground mt-2">Loading projects...</p>
            ) : (
              <Select 
                id="project_select" 
                value={selectedProjectId} 
                onChange={(e) => setSelectedProjectId(e.target.value)}
                required
                className="mt-1"
              >
                <option value="" disabled>Select a project</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </Select>
            )}
          </div>
        )}

        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" required value={form.title} onChange={(e) => set('title', e.target.value)} />
        </div>
        <div>
          <Label htmlFor="description">Short Description</Label>
          <Textarea id="description" value={form.description} onChange={(e) => set('description', e.target.value)} />
        </div>
        <div>
          <Label htmlFor="story">Story</Label>
          <Textarea id="story" rows={6} value={form.story} onChange={(e) => set('story', e.target.value)} />
        </div>
        <div>
          <Label htmlFor="how_it_works">How It Works</Label>
          <Textarea id="how_it_works" rows={4} value={form.how_it_works} onChange={(e) => set('how_it_works', e.target.value)} />
        </div>

        {/* Media Upload */}
        <div className="space-y-4 pt-4 border-t border-border">
          <div>
            <Label>Images</Label>
            <div className="mt-2 space-y-2">
              {form.images.map((cid, i) => (
                <div key={cid} className="flex items-center justify-between bg-[#111] p-2 rounded border border-[#222]">
                  <span className="text-sm truncate text-[#888]">IPFS CID: {cid}</span>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeFile(i, 'images')} className="text-red-500 hover:text-red-400">Remove</Button>
                </div>
              ))}
              <Input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'images')} disabled={uploading || saving} className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
            </div>
          </div>

          <div>
            <Label>Videos</Label>
            <div className="mt-2 space-y-2">
              {form.videos.map((cid, i) => (
                <div key={cid} className="flex items-center justify-between bg-[#111] p-2 rounded border border-[#222]">
                  <span className="text-sm truncate text-[#888]">IPFS CID: {cid}</span>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeFile(i, 'videos')} className="text-red-500 hover:text-red-400">Remove</Button>
                </div>
              ))}
              <Input type="file" accept="video/*" onChange={(e) => handleFileUpload(e, 'videos')} disabled={uploading || saving} className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
            </div>
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {uploading && <p className="text-sm text-blue-500">Uploading ...</p>}
        
        <Button type="submit" disabled={saving || uploading || (!urlProjectId && !selectedProjectId)} className="w-full mt-4">
          {saving ? 'Publishing...' : 'Publish Showcase'}
        </Button>
      </form>
    </div>
  );
}