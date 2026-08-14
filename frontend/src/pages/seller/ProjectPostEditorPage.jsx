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
import { FiUpload, FiX, FiImage, FiVideo, FiAlertCircle } from 'react-icons/fi';
import { motion } from 'motion/react';
import Navbar from '../../components/layout/Navbar';

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
    <div className="min-h-screen w-full flex flex-col items-center bg-[#f4f7f5] text-gray-900 pt-24 pb-12 font-sans">
      <Navbar />
      <div className="w-full max-w-[800px] px-4 md:px-8">
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full"
        >
          {/* Header */}
          <div className="mb-8">
            <div role="heading" aria-level="1" className="text-3xl font-bold tracking-tight text-gray-900 mb-2 !font-sans !normal-case">Public Showcase</div>
            <p className="text-gray-500 text-sm">Create a public post to showcase your carbon reduction project to the community.</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl mb-6 flex items-center gap-3">
              <FiAlertCircle size={20} />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {!urlProjectId && (
                <div>
                  <Label htmlFor="project_select" className="text-sm font-semibold text-gray-700">Select Project</Label>
                  {projectsLoading ? (
                    <p className="text-sm text-gray-500 mt-2 animate-pulse">Loading projects...</p>
                  ) : (
                    <Select 
                      id="project_select" 
                      value={selectedProjectId} 
                      onChange={(e) => setSelectedProjectId(e.target.value)}
                      required
                      className="mt-1.5 h-11 bg-gray-50 border-gray-200 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 w-full"
                    >
                      <option value="" disabled>Select a project to showcase</option>
                      {projects.map(p => (
                        <option key={p.id} value={p.id}>{p.title}</option>
                      ))}
                    </Select>
                  )}
                </div>
              )}

              <div>
                <Label htmlFor="title" className="text-sm font-semibold text-gray-700">Title</Label>
                <Input 
                  id="title" 
                  required 
                  value={form.title} 
                  onChange={(e) => set('title', e.target.value)} 
                  className="mt-1.5 h-11 bg-gray-50 border-gray-200 rounded-xl focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="e.g. Reforestation in the Amazon"
                />
              </div>
              
              <div>
                <Label htmlFor="description" className="text-sm font-semibold text-gray-700">Short Description</Label>
                <Textarea 
                  id="description" 
                  value={form.description} 
                  onChange={(e) => set('description', e.target.value)} 
                  className="mt-1.5 bg-gray-50 border-gray-200 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 resize-none min-h-[100px]"
                  placeholder="A brief overview of your project's goals."
                />
              </div>
              
              <div>
                <Label htmlFor="story" className="text-sm font-semibold text-gray-700">Project Story</Label>
                <Textarea 
                  id="story" 
                  rows={6} 
                  value={form.story} 
                  onChange={(e) => set('story', e.target.value)} 
                  className="mt-1.5 bg-gray-50 border-gray-200 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                  placeholder="Tell the full story behind your carbon reduction efforts..."
                />
              </div>
              
              <div>
                <Label htmlFor="how_it_works" className="text-sm font-semibold text-gray-700">How It Works</Label>
                <Textarea 
                  id="how_it_works" 
                  rows={4} 
                  value={form.how_it_works} 
                  onChange={(e) => set('how_it_works', e.target.value)} 
                  className="mt-1.5 bg-gray-50 border-gray-200 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                  placeholder="Explain the technical or practical details of how you reduce carbon."
                />
              </div>

              {/* Media Upload */}
              <div className="pt-6 border-t border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Media Files</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Images */}
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <FiImage className="text-emerald-600" /> Images
                    </Label>
                    
                    <div className="space-y-2">
                      {form.images.map((cid, i) => (
                        <div key={cid} className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-200">
                          <span className="text-xs truncate text-gray-500 flex-1 mr-2" title={cid}>CID: {cid.substring(0, 16)}...</span>
                          <button type="button" onClick={() => removeFile(i, 'images')} className="text-gray-400 hover:text-red-500 p-1">
                            <FiX />
                          </button>
                        </div>
                      ))}
                      
                      <div className="relative">
                        <Input 
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => handleFileUpload(e, 'images')} 
                          disabled={uploading || saving} 
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                        />
                        <div className="flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 border border-dashed border-gray-300 rounded-xl p-4 text-sm font-medium text-gray-600 transition-colors">
                          <FiUpload />
                          <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Videos */}
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <FiVideo className="text-emerald-600" /> Videos
                    </Label>
                    
                    <div className="space-y-2">
                      {form.videos.map((cid, i) => (
                        <div key={cid} className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-200">
                          <span className="text-xs truncate text-gray-500 flex-1 mr-2" title={cid}>CID: {cid.substring(0, 16)}...</span>
                          <button type="button" onClick={() => removeFile(i, 'videos')} className="text-gray-400 hover:text-red-500 p-1">
                            <FiX />
                          </button>
                        </div>
                      ))}
                      
                      <div className="relative">
                        <Input 
                          type="file" 
                          accept="video/*" 
                          onChange={(e) => handleFileUpload(e, 'videos')} 
                          disabled={uploading || saving} 
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                        />
                        <div className="flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 border border-dashed border-gray-300 rounded-xl p-4 text-sm font-medium text-gray-600 transition-colors">
                          <FiUpload />
                          <span>{uploading ? 'Uploading...' : 'Upload Video'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 flex justify-end">
                <Button 
                  type="submit" 
                  disabled={saving || uploading}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11 px-8 rounded-xl shadow-sm"
                >
                  {saving ? 'Publishing...' : 'Publish Showcase'}
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}