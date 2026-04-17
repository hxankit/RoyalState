import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Building2, Calendar, Eye, RefreshCw, AlertCircle, Loader,
  Mail, MapPin, Clock, TrendingUp, ExternalLink
} from "lucide-react";
import { toast } from "sonner";
import { cn, formatDate } from "../lib/utils";
import { useBuilderDashboard } from "../store/hooks";

// ─── Stat Card ───────────────────────────────────────────────────────────────
const StatCard = ({ title, value, icon: Icon, accent, description, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.08 }}
    className="bg-white rounded-2xl p-6 border border-[#E6D5C3] shadow-card hover:shadow-card-hover transition-all duration-300 group"
  >
    <div className="flex items-start justify-between mb-4">
      <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110", accent.bg)}>
        <Icon className={cn("w-5 h-5", accent.icon)} />
      </div>
    </div>
    <div className="text-3xl font-bold text-[#1C1B1A] mb-1 tabular-nums">
      {value ?? <span className="text-[#9CA3AF] text-xl">—</span>}
    </div>
    <div className="text-sm font-semibold text-[#1C1B1A] mb-0.5">{title}</div>
    <div className="text-xs text-[#9CA3AF]">{description}</div>
  </motion.div>
);

// ─── Enquiry Item ────────────────────────────────────────────────────────────
const EnquiryItem = ({ enquiry, index }) => {
  const visitorName = enquiry.userId?.name || enquiry.guestInfo?.name || 'Guest';
  const visitorEmail = enquiry.userId?.email || enquiry.guestInfo?.email || 'N/A';
  const visitorPhone = enquiry.userId?.phone || enquiry.guestInfo?.phone || 'N/A';

  const statusColors = {
    pending: { bg: 'bg-yellow-50', badge: 'bg-yellow-100 text-yellow-800' },
    confirmed: { bg: 'bg-green-50', badge: 'bg-green-100 text-green-800' },
    cancelled: { bg: 'bg-red-50', badge: 'bg-red-100 text-red-800' },
    completed: { bg: 'bg-blue-50', badge: 'bg-blue-100 text-blue-800' }
  };

  const colors = statusColors[enquiry.status] || statusColors.pending;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`border border-[#E6D5C3] rounded-xl p-4 transition-all hover:shadow-card ${colors.bg}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="font-semibold text-[#1C1B1A] text-sm mb-1">
            {enquiry.propertyId?.title || 'Unknown Property'}
          </div>
          <div className="flex items-center gap-2 text-xs text-[#5A5856]">
            <MapPin className="w-3 h-3" />
            {enquiry.propertyId?.location || 'Unknown Location'}
          </div>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${colors.badge}`}>
          {enquiry.status.charAt(0).toUpperCase() + enquiry.status.slice(1)}
        </span>
      </div>

      {/* Visitor Info */}
      <div className="bg-white/60 rounded-lg p-3 mb-3 space-y-1.5 text-xs">
        <div className="font-medium text-[#1C1B1A]">{visitorName}</div>
        {visitorEmail !== 'N/A' && (
          <div className="flex items-center gap-2 text-[#5A5856]">
            <Mail className="w-3 h-3" />
            {visitorEmail}
          </div>
        )}
        {visitorPhone !== 'N/A' && (
          <div className="flex items-center gap-2 text-[#5A5856]">
            <span className="text-[#D4755B]">📞</span>
            {visitorPhone}
          </div>
        )}
      </div>

      {/* Viewing Details */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-[#5A5856]">
          <Calendar className="w-3 h-3" />
          <span>{new Date(enquiry.date).toLocaleDateString()}</span>
          <Clock className="w-3 h-3" />
          <span>{enquiry.time}</span>
        </div>
        <span className="text-[#9CA3AF] text-xs">
          {formatDate(new Date(enquiry.createdAt))}
        </span>
      </div>
    </motion.div>
  );
};

const BuilderDashboard = () => {
  const { stats, enquiries, loading, error, fetchStats } = useBuilderDashboard();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await fetchStats(true); // Force refresh
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchStats]);

  useEffect(() => {
    fetchStats(false); // Load from cache or fetch
  }, [fetchStats]);

  const statCards = [
    {
      title: "Total Properties",
      value: stats?.totalProperties,
      icon: Building2,
      accent: { bg: "bg-[#D4755B]/10", icon: "text-[#D4755B]" },
      description: "Listed by you",
    },
    {
      title: "Active Listings",
      value: stats?.activeListings,
      icon: Eye,
      accent: { bg: "bg-emerald-50", icon: "text-emerald-600" },
      description: "Currently active",
    },
    {
      title: "Total Enquiries",
      value: stats?.totalEnquiries,
      icon: Mail,
      accent: { bg: "bg-blue-50", icon: "text-blue-600" },
      description: "From visitors",
    },
    {
      title: "Pending Enquiries",
      value: stats?.pendingEnquiries,
      icon: Clock,
      accent: { bg: "bg-amber-50", icon: "text-amber-600" },
      description: "Awaiting response",
    },
  ];

  return (
    <div className="min-h-screen pb-12 px-4 bg-[#FAF8F4]">
      <div className="max-w-7xl mx-auto pt-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-[#1C1B1A] mb-1">Builder Dashboard</h1>
            <p className="text-[#5A5856] text-sm">Manage your properties and track enquiries</p>
          </div>
          <motion.button
            onClick={handleRefresh}
            disabled={isRefreshing}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E6D5C3] text-[#1C1B1A] rounded-xl text-sm font-medium hover:border-[#D4755B] hover:text-[#D4755B] transition-all duration-200 shadow-card disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </motion.button>
        </motion.div>

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-600 text-sm">{error}</p>
          </motion.div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader className="w-8 h-8 text-[#D4755B] animate-spin mb-4" />
            <p className="text-[#5A5856]">Loading your dashboard...</p>
          </div>
        ) : (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statCards.map((card, index) => (
                <StatCard key={card.title} {...card} index={index} />
              ))}
            </div>

            {/* Recent Enquiries */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 border border-[#E6D5C3] shadow-card"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-[#D4755B]/10 rounded-xl flex items-center justify-center">
                    <Mail className="w-5 h-5 text-[#D4755B]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#1C1B1A]">Recent Enquiries</h3>
                    <p className="text-xs text-[#9CA3AF] mt-0.5">Latest visitor inquiries</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-[#D4755B]">
                  {enquiries.length} total
                </span>
              </div>

              {enquiries.length === 0 ? (
                <div className="text-center py-12">
                  <Mail className="w-12 h-12 text-[#E6D5C3] mx-auto mb-3" />
                  <p className="text-[#5A5856]">No enquiries yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {enquiries.slice(0, 10).map((enquiry, index) => (
                    <EnquiryItem key={enquiry._id} enquiry={enquiry} index={index} />
                  ))}
                  {enquiries.length > 10 && (
                    <div className="text-center py-4">
                      <a
                        href="/appointments"
                        className="text-[#D4755B] text-sm font-medium hover:underline flex items-center justify-center gap-2"
                      >
                        View all {enquiries.length} enquiries
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default BuilderDashboard;
