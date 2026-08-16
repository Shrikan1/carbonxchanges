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
import { FiUpload, FiX, FiImage, FiVideo, FiAlertCircle, FiLoader, FiCheckCircle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from '../../components/layout/Navbar';

export default function ProjectPostEditorPage() {
  const { projectId: urlProjectId } = useParams();
  const navigate = useNavigate();

  const { projects, fetchProjects, loading: projectsLoading } = useSellerStore();
  const [selectedProjectId, setSelectedProjectId] = useState(urlProjectId || '');

  const [form, setForm] = useState({ title: '', description: '', story: '', how_it_works: '', images: [], videos: [] });
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  useEffect(() => {
    if (!urlProjectId && projects.length === 0) {
      fetchProjects();
    }
  }, [urlProjectId, projects.length, fetchProjects]);

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  /**
   * Upload a file to the Supabase public media bucket via /api/upload/media.
   * Returns the permanent public URL (not an IPFS CID).
   */
  async function handleFileUpload(e, type) {
    const file = e.target.files[0];
    if (!file) return;

    const setUploading = type === 'images' ? setUploadingImage : setUploadingVideo;
    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await api.post('/upload/media', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // res.data.url is a Supabase CDN URL (permanent, publicly accessible)
      setForm((prev) => ({ ...prev, [type]: [...prev[type], { url: res.data.url, name: file.name }] }));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to upload file. Check size limits (images: 10MB, videos: 100MB).');
    } finally {
      setUploading(false);
      e.target.value = null;
    }
  }

  function removeFile(index, type) {
    setForm((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!selectedProjectId) {
      setError('Please select a project first.');
      return;
    }
    if (!form.title.trim()) {
      setError('A title is required.');
      return;
    }

    setSaving(true);
    try {
      // Extract just the URL strings before sending to API
      const payload = {
        project_id: Number(selectedProjectId),
        ...form,
        images: form.images.map((f) => f.url),
        videos: form.videos.map((f) => f.url),
      };
      await projectPostApi.createProjectPost(payload);
      navigate(`/projects/${selectedProjectId}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to publish showcase');
    } finally {
      setSaving(false);
    }
  }

  const uploading = uploadingImage || uploadingVideo;

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
            <div role="heading" aria-level="1" className="text-3xl font-bold tracking-tight text-gray-900 mb-2 !font-sans !normal-case">
              Public Showcase
            </div>
            <p className="text-gray-500 text-sm">
              Create a public post to showcase your carbon reduction project to the community.
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl mb-6 flex items-center gap-3"
            >
              <FiAlertCircle size={20} className="flex-shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </motion.div>
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
                      {projects.map((p) => (
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

              {/* ── Media Upload ─────────────────────────────────────────── */}
              <div className="pt-6 border-t border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-1">Media Files</h3>
                <p className="text-xs text-gray-500 mb-5">
                  Files are stored on Supabase Storage and served via fast CDN. Images: max 10 MB · Videos: max 100 MB.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Images */}
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <FiImage className="text-emerald-600" /> Images
                    </Label>

                    <div className="space-y-2">
                      <AnimatePresence>
                        {form.images.map((item, i) => (
                          <motion.div
                            key={item.url}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50"
                          >
                            <img
                              src={item.url}
                              alt={item.name}
                              className="w-full h-32 object-cover"
                            />
                            <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-start justify-end p-2">
                              <button
                                type="button"
                                onClick={() => removeFile(i, 'images')}
                                className="bg-white/90 hover:bg-white text-gray-600 hover:text-red-500 rounded-lg p-1 shadow transition-colors"
                              >
                                <FiX size={14} />
                              </button>
                            </div>
                            <div className="px-3 py-1.5 flex items-center gap-1.5">
                              <FiCheckCircle className="text-emerald-500" size={12} />
                              <span className="text-xs text-gray-500 truncate">{item.name}</span>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>

                      <div className="relative">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, 'images')}
                          disabled={uploadingImage || saving}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className={`flex items-center justify-center gap-2 rounded-xl p-4 text-sm font-medium transition-colors border-2 border-dashed
                          ${uploadingImage ? 'bg-emerald-50 border-emerald-300 text-emerald-600' : 'bg-gray-50 hover:bg-gray-100 border-gray-300 text-gray-600'}`}>
                          {uploadingImage ? <FiLoader className="animate-spin" /> : <FiUpload />}
                          <span>{uploadingImage ? 'Uploading...' : 'Upload Image'}</span>
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
                      <AnimatePresence>
                        {form.videos.map((item, i) => (
                          <motion.div
                            key={item.url}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50"
                          >
                            <video
                              src={item.url}
                              className="w-full h-32 object-cover bg-black"
                              controls={false}
                              muted
                            />
                            <div className="absolute inset-0 bg-black/10 hover:bg-black/20 transition-colors flex items-start justify-end p-2">
                              <button
                                type="button"
                                onClick={() => removeFile(i, 'videos')}
                                className="bg-white/90 hover:bg-white text-gray-600 hover:text-red-500 rounded-lg p-1 shadow transition-colors"
                              >
                                <FiX size={14} />
                              </button>
                            </div>
                            <div className="px-3 py-1.5 flex items-center gap-1.5">
                              <FiCheckCircle className="text-emerald-500" size={12} />
                              <span className="text-xs text-gray-500 truncate">{item.name}</span>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>

                      <div className="relative">
                        <Input
                          type="file"
                          accept="video/*"
                          onChange={(e) => handleFileUpload(e, 'videos')}
                          disabled={uploadingVideo || saving}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className={`flex items-center justify-center gap-2 rounded-xl p-4 text-sm font-medium transition-colors border-2 border-dashed
                          ${uploadingVideo ? 'bg-emerald-50 border-emerald-300 text-emerald-600' : 'bg-gray-50 hover:bg-gray-100 border-gray-300 text-gray-600'}`}>
                          {uploadingVideo ? <FiLoader className="animate-spin" /> : <FiUpload />}
                          <span>{uploadingVideo ? 'Uploading...' : 'Upload Video'}</span>
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