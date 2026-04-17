import React, { useState } from 'react';
import { toast } from 'sonner';
import { appointmentsAPI } from '../../services/api';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: string;
  propertyName: string;
}

const EnquiryModal: React.FC<EnquiryModalProps> = ({ 
  isOpen, 
  onClose, 
  propertyId, 
  propertyName 
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    date: '',
    timeSlot: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await appointmentsAPI.schedule({
        propertyId,
        date: formData.date,
        time: formData.timeSlot,
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        message: `Enquiry for ${propertyName}`,
      });
      
      toast.success('Enquiry Submitted!', {
        description: "We'll get back to you within 24 hours."
      });
      
      // Reset form and close modal
      setFormData({ fullName: '', email: '', phone: '', date: '', timeSlot: '' });
      onClose();
    } catch (err: any) {
      console.error('Failed to submit enquiry:', err);
      const msg = err.response?.data?.message || 'Failed to submit enquiry. Please try again.';
      setError(msg);
      toast.error('Enquiry Failed', {
        description: msg
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[#E6E0DA]">
            <div>
              <h2 className="font-syne text-xl text-[#0F172A]">
                Enquire Now
              </h2>
              <p className="font-manrope font-extralight text-xs text-[#64748B] mt-1">
                {propertyName}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-[#6B7280] hover:text-[#0F172A] transition-colors"
            >
              <span className="material-icons">close</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Full Name */}
            <div>
              <label className="block font-manrope font-extralight text-xs text-[#64748B] uppercase tracking-wider mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className="w-full bg-[#F5F1E8] border border-[#E6E0DA] rounded-lg px-4 py-3 font-manrope font-extralight text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#D4755B] transition-colors"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block font-manrope font-extralight text-xs text-[#64748B] uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your.email@example.com"
                className="w-full bg-[#F5F1E8] border border-[#E6E0DA] rounded-lg px-4 py-3 font-manrope font-extralight text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#D4755B] transition-colors"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block font-manrope font-extralight text-xs text-[#64748B] uppercase tracking-wider mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+91 98765 43210"
                className="w-full bg-[#F5F1E8] border border-[#E6E0DA] rounded-lg px-4 py-3 font-manrope font-extralight text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#D4755B] transition-colors"
                required
              />
            </div>

            {/* Date */}
            <div>
              <label className="block font-manrope font-extralight text-xs text-[#64748B] uppercase tracking-wider mb-2">
                Preferred Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full bg-[#F5F1E8] border border-[#E6E0DA] rounded-lg px-4 py-3 font-manrope font-extralight text-sm text-[#0F172A] focus:outline-none focus:border-[#D4755B] transition-colors"
                required
              />
            </div>

            {/* Time Slot */}
            <div>
              <label className="block font-manrope font-extralight text-xs text-[#64748B] uppercase tracking-wider mb-2">
                Time Slot
              </label>
              <select
                name="timeSlot"
                value={formData.timeSlot}
                onChange={handleInputChange}
                className="w-full bg-[#F5F1E8] border border-[#E6E0DA] rounded-lg px-4 py-3 font-manrope font-extralight text-sm text-[#0F172A] focus:outline-none focus:border-[#D4755B] transition-colors appearance-none cursor-pointer"
                required
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%230F172A' d='M6 8L2 4h8z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 1rem center'
                }}
              >
                <option value="">Select time slot</option>
                <option value="09:00">09:00 AM - 10:00 AM</option>
                <option value="10:00">10:00 AM - 11:00 AM</option>
                <option value="11:00">11:00 AM - 12:00 PM</option>
                <option value="14:00">02:00 PM - 03:00 PM</option>
                <option value="15:00">03:00 PM - 04:00 PM</option>
                <option value="16:00">04:00 PM - 05:00 PM</option>
              </select>
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-center font-manrope text-xs text-red-500 mt-2">
                {error}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#D4755B] hover:bg-[#C05621] disabled:opacity-60 disabled:cursor-not-allowed text-white font-manrope font-bold text-base py-3 rounded-xl transition-all shadow-lg hover:shadow-xl mt-6"
            >
              {submitting ? 'Submitting...' : 'Submit Enquiry'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default EnquiryModal;
