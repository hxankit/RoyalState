import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrashIcon,
  MagnifyingGlassIcon,
  EnvelopeIcon,
  UserIcon,
  ChatBubbleBottomCenterTextIcon,
  FunnelIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import apiClient from '../services/apiClient';
import { formatDate } from '../lib/utils';

const FormQueries = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  const [selectedForm, setSelectedForm] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    page: 1,
    limit: 20
  });
  const [showFilters, setShowFilters] = useState(false);

  // Fetch form submissions
  const fetchForms = async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const response = await apiClient.get(`/api/forms/admin/all?${queryParams}`);
      setForms(response.data.data || []);
      setPagination(response.data.pagination || {});
    } catch (err) {
      console.error('Error fetching form submissions:', err);
      setError(`Failed to load form submissions. ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForms();
  }, [filters]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filtering
    }));
  };

  // Handle search
  const handleSearch = (value) => {
    handleFilterChange('search', value);
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      search: '',
      page: 1,
      limit: 20
    });
  };

  // Delete form submission
  const handleDelete = async (id) => {
    try {
      setDeleting(true);
      await apiClient.delete(`/api/forms/admin/${id}`);
      setForms(forms.filter(form => form._id !== id));
      setDeleteConfirm(null);
      setSelectedForm(null);
    } catch (err) {
      console.error('Error deleting form:', err);
      setError('Failed to delete form submission. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  // Pagination handlers
  const goToPage = (page) => {
    handleFilterChange('page', page);
  };

  const nextPage = () => {
    if (pagination.page < pagination.pages) {
      goToPage(pagination.page + 1);
    }
  };

  const prevPage = () => {
    if (pagination.page > 1) {
      goToPage(pagination.page - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#FBF7F3] to-white p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-[#1C1B1A] mb-1">Contact Form Submissions</h1>
            <p className="text-[#5A5856]">Manage and review customer inquiries from your contact form</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-[#D4755B]">{pagination.total || 0}</div>
            <div className="text-sm text-[#9CA3AF]">Total Submissions</div>
          </div>
        </div>
      </motion.div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
        >
          {error}
        </motion.div>
      )}

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-6 border border-[#E6D5C3] shadow-card mb-6"
      >
        <div className="flex flex-col gap-4">
          {/* Search Bar */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-3 w-5 h-5 text-[#9CA3AF]" />
            <input
              type="text"
              placeholder="Search by name, email, or message..."
              value={filters.search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-[#E6D5C3] rounded-lg focus:ring-2 focus:ring-[#D4755B] focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center justify-between">
            {filters.search && (
              <button
                onClick={clearFilters}
                className="text-sm text-[#D4755B] hover:text-[#C05E44] font-medium transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Forms Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl border border-[#E6D5C3] shadow-card overflow-hidden"
      >
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-[#E6D5C3] border-t-[#D4755B] rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-[#5A5856]">Loading form submissions...</p>
            </div>
          </div>
        ) : forms.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-6">
            <ChatBubbleBottomCenterTextIcon className="w-12 h-12 text-[#E6D5C3] mb-4" />
            <p className="text-[#9CA3AF] text-center">No form submissions found</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E6D5C3] bg-[#FBF7F3]">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#1C1B1A]">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#1C1B1A]">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#1C1B1A]">Phone</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#1C1B1A]">Message</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#1C1B1A]">Date</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-[#1C1B1A]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {forms.map((form, index) => (
                      <motion.tr
                        key={form._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="border-b border-[#E6D5C3] hover:bg-[#FBF7F3] transition-colors duration-150"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#D4755B] bg-opacity-20 flex items-center justify-center">
                              <UserIcon className="w-4 h-4 text-[#D4755B]" />
                            </div>
                            <span className="font-medium text-[#1C1B1A]">{form.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <EnvelopeIcon className="w-4 h-4 text-[#9CA3AF]" />
                            <span className="text-[#5A5856]">{form.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[#5A5856]">{form.phone || '—'}</span>
                        </td>
                        <td className="px-6 py-4 max-w-xs">
                          <p className="text-[#5A5856] truncate">{form.message}</p>
                        </td>
                        <td className="px-6 py-4 text-sm text-[#9CA3AF]">
                          {formatDate(form.createdAt)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setSelectedForm(form)}
                              className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-blue-600 hover:text-blue-700"
                              title="View details"
                            >
                              <ChatBubbleBottomCenterTextIcon className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(form._id)}
                              className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600 hover:text-red-700"
                              title="Delete"
                            >
                              <TrashIcon className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-4 p-6">
              <AnimatePresence>
                {forms.map((form) => (
                  <motion.div
                    key={form._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-[#FBF7F3] rounded-lg p-4 border border-[#E6D5C3]"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-[#1C1B1A]">{form.name}</p>
                        <p className="text-sm text-[#9CA3AF] mt-1">{formatDate(form.createdAt)}</p>
                      </div>
                      <button
                        onClick={() => setDeleteConfirm(form._id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="text-sm text-[#5A5856] mb-2">{form.email}</p>
                    {form.phone && <p className="text-sm text-[#5A5856] mb-2">{form.phone}</p>}
                    <p className="text-sm text-[#5A5856] mb-3">{form.message}</p>
                    <button
                      onClick={() => setSelectedForm(form)}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View full details
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </>
        )}
      </motion.div>

      {/* Pagination */}
      {!loading && forms.length > 0 && pagination.pages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 flex items-center justify-between"
        >
          <button
            onClick={prevPage}
            disabled={pagination.page === 1}
            className="px-4 py-2 border border-[#E6D5C3] rounded-lg text-[#1C1B1A] font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#FBF7F3] transition-colors"
          >
            Previous
          </button>
          <div className="text-sm text-[#5A5856]">
            Page <span className="font-semibold">{pagination.page}</span> of <span className="font-semibold">{pagination.pages}</span>
          </div>
          <button
            onClick={nextPage}
            disabled={pagination.page === pagination.pages}
            className="px-4 py-2 border border-[#E6D5C3] rounded-lg text-[#1C1B1A] font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#FBF7F3] transition-colors"
          >
            Next
          </button>
        </motion.div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedForm(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#1C1B1A]">Form Submission Details</h2>
                <button
                  onClick={() => setSelectedForm(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-[#1C1B1A] mb-2">Name</label>
                  <p className="text-[#5A5856]">{selectedForm.name}</p>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-[#1C1B1A] mb-2">Email</label>
                  <a
                    href={`mailto:${selectedForm.email}`}
                    className="text-[#D4755B] hover:text-[#C05E44] font-medium transition-colors"
                  >
                    {selectedForm.email}
                  </a>
                </div>

                {/* Phone */}
                {selectedForm.phone && (
                  <div>
                    <label className="block text-sm font-semibold text-[#1C1B1A] mb-2">Phone</label>
                    <a
                      href={`tel:${selectedForm.phone}`}
                      className="text-[#D4755B] hover:text-[#C05E44] font-medium transition-colors"
                    >
                      {selectedForm.phone}
                    </a>
                  </div>
                )}

                {/* Message */}
                <div>
                  <label className="block text-sm font-semibold text-[#1C1B1A] mb-2">Message</label>
                  <p className="text-[#5A5856] whitespace-pre-wrap">{selectedForm.message}</p>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-semibold text-[#1C1B1A] mb-2">Submitted</label>
                  <p className="text-[#5A5856]">{formatDate(selectedForm.createdAt)}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 flex gap-4">
                <button
                  onClick={() => setSelectedForm(null)}
                  className="flex-1 px-4 py-2.5 border border-[#E6D5C3] rounded-lg text-[#1C1B1A] font-medium hover:bg-[#FBF7F3] transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setDeleteConfirm(selectedForm._id);
                    setSelectedForm(null);
                  }}
                  className="flex-1 px-4 py-2.5 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-sm w-full p-8 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-[#1C1B1A] mb-2">Delete Form Submission?</h3>
              <p className="text-[#5A5856] mb-6">This action cannot be undone. Are you sure you want to delete this form submission?</p>

              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 border border-[#E6D5C3] rounded-lg text-[#1C1B1A] font-medium hover:bg-[#FBF7F3] transition-colors"
                  disabled={deleting}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {deleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Deleting...
                    </>
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FormQueries;
