import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    resetToken: { type: String },
    resetTokenExpire: { type: Date },

    // User role field - now includes superadmin
    role: {
        type: String,
        enum: ['user', 'builder', 'superadmin'],
        default: 'user'  // Regular users by default
    },

    // Email verification fields
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String },
    verificationTokenExpiry: { type: Date },

    // User status management fields
    status: {
        type: String,
        enum: ['active', 'suspended', 'banned'],
        default: 'active'
    },
    suspendedUntil: { type: Date },
    banReason: { type: String },
    suspendReason: { type: String },
    bannedAt: { type: Date },
    suspendedAt: { type: Date },
    bannedBy: { type: String },      // Admin email
    suspendedBy: { type: String },   // Admin email
    lastActive: { type: Date },
    lastLogin: { type: Date },       // Track last login for all roles
    
    // Builder-specific fields
    companyName: { type: String },
    phone: { type: String },
    createdBy: { type: String }      // Admin email who created this builder
}, {
    timestamps: true  // Adds createdAt and updatedAt
});

// Hash password before saving (for all users including admins)
UserSchema.pre('save', async function(next) {
    // Skip if password hasn't been modified
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Indexes for efficient queries
UserSchema.index({ status: 1, createdAt: -1 });       // Filter by status + sort
UserSchema.index({ suspendedUntil: 1 });              // Auto-unsuspend cron
UserSchema.index({ email: 'text', name: 'text' });    // Text search
UserSchema.index({ role: 1 });                        // Filter by role
UserSchema.index({ email: 1, role: 1 });              // Email + role lookup

const User = mongoose.model('User', UserSchema);

export default User;