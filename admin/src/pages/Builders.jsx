import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Building2, Plus, Search, RefreshCw, Mail, Phone, User, Lock,
  AlertCircle, CheckCircle, Loader
} from "lucide-react";
import { toast } from "sonner";
import apiClient from "../services/apiClient";
import { cn, formatDate } from "../lib/utils";

const BuildersManagement = () => {
  // State
  const [builders, setBuilders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creatingBuilder, setCreatingBuilder] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    companyName: '',
    phone: ''
  });

  // Fetch all builders
  const fetchBuilders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get('/api/admin/builders');
      
      if (response.data.success) {
        setBuilders(response.data.builders);
      } else {
        setError(response.data.message || 'Failed to fetch builders');
      }
    } catch (err) {
      console.error("Error fetching builders:", err);
      setError("Unable to load builders. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBuilders();
  }, [fetchBuilders]);

  // Create builder
  const handleCreateBuilder = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Validation Error', {
        description: 'Name, email, and password are required'
      });
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Validation Error', {
        description: 'Password must be at least 6 characters'
      });
      return;
    }

    try {
      setCreatingBuilder(true);
      const response = await apiClient.post('/api/admin/builders', formData);

      if (response.data.success) {
        toast.success('Builder Created!', {
          description: `${formData.name} has been successfully created`
        });
        setBuilders([response.data.builder, ...builders]);
        setFormData({ name: '', email: '', password: '', companyName: '', phone: '' });
        setShowCreateModal(false);
      } else {
        toast.error('Creation Failed', {
          description: response.data.message || 'Failed to create builder'
        });
      }
    } catch (err) {
      console.error("Error creating builder:", err);
      const message = err.response?.data?.message || 'Failed to create builder. Please try again.';
      toast.error('Error', { description: message });
    } finally {
      setCreatingBuilder(false);
    }
  };

  // Filter builders by search term
  const filteredBuilders = builders.filter(builder => 
    builder.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    builder.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    builder.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF8F4] to-[#F5F1E8]">
      {/* Header */}
      <div className="bg-white border-b border-[#E6E0DA] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#FEE4D6] rounded-lg">
                <Building2 className="w-6 h-6 text-[#D4755B]" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#0F172A]">Builders Management</h1>
                <p className="text-sm text-[#64748B] mt-1">Create and manage property builders/listers</p>
              </div>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 bg-[#D4755B] text-white px-4 py-2 rounded-lg hover:bg-[#C05621] transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              New Builder
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-6 flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Search builders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[#E6E0DA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4755B]"
            />
          </div>
          <button
            onClick={() => fetchBuilders()}
            disabled={loading}
            className="p-2 hover:bg-white rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 text-[#64748B] ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 text-[#D4755B] animate-spin" />
          </div>
        ) : (
          <>
            {/* Builders Grid */}
            {filteredBuilders.length === 0 ? (
              <div className="text-center py-12">
                <Building2 className="w-12 h-12 text-[#E6E0DA] mx-auto mb-4" />
                <p className="text-[#64748B] text-lg">
                  {builders.length === 0 ? 'No builders created yet' : 'No builders match your search'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredBuilders.map((builder) => (
                  <motion.div
                    key={builder._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-[#E6E0DA] rounded-lg p-6 hover:shadow-lg transition-all"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 bg-[#FEE4D6] rounded-lg">
                        <Building2 className="w-6 h-6 text-[#D4755B]" />
                      </div>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>

                    {/* Name */}
                    <h3 className="text-lg font-bold text-[#0F172A] mb-1">
                      {builder.name}
                    </h3>

                    {/* Company */}
                    {builder.companyName && (
                      <p className="text-sm text-[#D4755B] font-medium mb-3">
                        {builder.companyName}
                      </p>
                    )}

                    {/* Details */}
                    <div className="space-y-2 mb-4 pb-4 border-b border-[#E6E0DA]">
                      <div className="flex items-center gap-2 text-sm text-[#64748B]">
                        <Mail className="w-4 h-4" />
                        <span className="truncate">{builder.email}</span>
                      </div>
                      {builder.phone && (
                        <div className="flex items-center gap-2 text-sm text-[#64748B]">
                          <Phone className="w-4 h-4" />
                          <span>{builder.phone}</span>
                        </div>
                      )}
                    </div>

                    {/* Created Date */}
                    <p className="text-xs text-[#94A3B8]">
                      Created {formatDate(new Date(builder.createdAt))}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Total Count */}
            {builders.length > 0 && (
              <div className="mt-6 text-center text-sm text-[#64748B]">
                Total Builders: {builders.length}
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Builder Modal */}
      {showCreateModal && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => !creatingBuilder && setShowCreateModal(false)}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg max-w-md w-full shadow-xl"
            >
              {/* Header */}
              <div className="border-b border-[#E6E0DA] p-6">
                <h2 className="text-2xl font-bold text-[#0F172A] flex items-center gap-2">
                  <Plus className="w-6 h-6 text-[#D4755B]" />
                  Create Builder Account
                </h2>
              </div>

              {/* Form */}
              <form onSubmit={handleCreateBuilder} className="p-6 space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-2">
                    Builder Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Full name"
                      className="w-full pl-10 pr-4 py-2 border border-[#E6E0DA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4755B]"
                      disabled={creatingBuilder}
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="builder@example.com"
                      className="w-full pl-10 pr-4 py-2 border border-[#E6E0DA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4755B]"
                      disabled={creatingBuilder}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-2">
                    Temporary Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="At least 6 characters"
                      className="w-full pl-10 pr-4 py-2 border border-[#E6E0DA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4755B]"
                      disabled={creatingBuilder}
                    />
                  </div>
                </div>

                {/* Company Name */}
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-2">
                    Company Name (Optional)
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      placeholder="Company name"
                      className="w-full pl-10 pr-4 py-2 border border-[#E6E0DA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4755B]"
                      disabled={creatingBuilder}
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-2">
                    Phone Number (Optional)
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full pl-10 pr-4 py-2 border border-[#E6E0DA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4755B]"
                      disabled={creatingBuilder}
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    disabled={creatingBuilder}
                    className="flex-1 px-4 py-2 border border-[#E6E0DA] text-[#0F172A] rounded-lg hover:bg-[#F5F1E8] transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creatingBuilder}
                    className="flex-1 px-4 py-2 bg-[#D4755B] text-white rounded-lg hover:bg-[#C05621] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {creatingBuilder ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Create Builder'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
};

export default BuildersManagement;
