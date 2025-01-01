import mongoose from 'mongoose';


// **User Schema**
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique:true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    isPhoneVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String
    },
    otp: {
        type: Number,
        validate: {
            validator: function(v) {
                return /^[0-9]{6}$/.test(v);
            },
            message: props => `${props.value} is not a valid 6-digit OTP!`
        }
    },
    authProviders: {
        google: String,
        github: String,
        facebook: String
    },
    profilePicture: {
        url: {
            type: String,
            default: 'https://static.vecteezy.com/system/resources/previews/022/385/025/non_2x/a-cute-surprised-black-haired-anime-girl-under-the-blooming-sakura-ai-generated-photo.jpg'
        },
        imageName: {
            type: String,
            default: 'dummyprofile.jpg'
        }
    },
    status: {
        type: String,
        default: 'active'
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    callHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Call'
    }],
    chats: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat'
    }],
    groups: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group'
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    typingTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    lastActive: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    collection: 'User'
});

userSchema.index({ username: 'text', email: 'text' });
// **Chat Schema**
const chatSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    isGroupChat: {
        type: Boolean,
        default: false
    },
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group'
    },
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    }
}, {
    timestamps: true,
    collection: 'Chat'
});

// **Message Schema**
const messageSchema = new mongoose.Schema({
    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat'
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    content: {
        type: String
    },
    media: {
        type: String
    },
    status: {
        type: String,
        enum: ['sent', 'delivered', 'read']
    },
    reactions: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        reaction: {
            type: String
        }
    }],
    isEncrypted: {
        type: Boolean,
        default: false
    },
    encryptionKey: {
        type: String
    },
    decryptionKey: {
        type: String
    }
}, {
    timestamps: true,
    collection: 'Message'
});

// **Group Schema**
const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    icon: {
        type: String
    },
    members: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        role: {
            type: String,
            enum: ['admin', 'member'],
            default: 'member'
        }
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String
    },
    isAdminOnly: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    collection: 'Group'
});

// **Call Schema**
const callSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    type: {
        type: String,
        enum: ['audio', 'video'],
        required: true
    },
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group'
    },
    startedAt: {
        type: Date,
        required: true
    },
    endedAt: {
        type: Date
    },
    status: {
        type: String,
        enum: ['ongoing', 'ended', 'missed'],
        default: 'ongoing'
    }
}, {
    timestamps: true,
    collection: 'Call'
});

// **Media Schema**
const mediaSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    messageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    },
    fileUrl: {
        type: String
    },
    fileType: {
        type: String,
        enum: ['image', 'video', 'audio']
    },
    fileSize: {
        type: Number
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    collection: 'Media'
});

// **Reaction Schema**
const reactionSchema = new mongoose.Schema({
    messageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reaction: {
        type: String
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, {
    collection: 'Reaction'
});

// **PinnedMessages Schema**
const pinnedMessageSchema = new mongoose.Schema({
    messageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    },
    pinned: {
        type: Boolean,
        default: true
    },
    pinnedAt: {
        type: Date,
        default: Date.now
    }
}, {
    collection: 'PinnedMessages'
});

// **ArchivedMessages Schema**
const archivedMessageSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    messageIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    }],
    archivedAt: {
        type: Date,
        default: Date.now
    }
}, {
    collection: 'ArchivedMessages'
});

// **DeletedMessages Schema**
const deletedMessageSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    messageIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    }],
    deletedAt: {
        type: Date,
        default: Date.now
    }
}, {
    collection: 'DeletedMessages'
});

// **Encryption Schema**
const encryptionSchema = new mongoose.Schema({
    messageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    },
    isEncrypted: {
        type: Boolean,
        default: false
    },
    encryptionKey: {
        type: String
    },
    decryptionKey: {
        type: String
    }
}, {
    collection: 'Encryption'
});

// **Presence Schema**
const presenceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    isOnline: {
        type: Boolean,
        default: false
    },
    lastSeen: {
        type: Date
    },
    activityStatus: {
        type: String,
        enum: ['Available', 'Do Not Disturb'],
        default: 'Available'
    },
    lastActivity: {
        type: Date
    }
}, {
    collection: 'Presence'
});

// **GroupLogs Schema**
const groupLogSchema = new mongoose.Schema({
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group'
    },
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    action: {
        type: String
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, {
    collection: 'GroupLogs'
});

// **UserLogs Schema**
const userLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    action: {
        type: String
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, {
    collection: 'UserLogs'
});

// **Reports Schema**
const reportSchema = new mongoose.Schema({
    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    messageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    },
    mediaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Media'
    },
    reason: {
        type: String
    },
    status: {
        type: String,
        enum: ['pending', 'resolved'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    collection: 'Reports'
});

// **Polls Schema**
const pollSchema = new mongoose.Schema({
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group'
    },
    question: {
        type: String
    },
    options: [{
        text: String,
        votes: {
            type: Number,
            default: 0
        }
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    collection: 'Polls'
});

// **Permissions Schema**
const permissionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group'
    },
    permissions: {
        canSendMessage: {
            type: Boolean,
            default: true
        },
        canAddMember: {
            type: Boolean,
            default: false
        },
        canRemoveMember: {
            type: Boolean,
            default: false
        },
        canChangeGroupInfo: {
            type: Boolean,
            default: false
        },
        canBlockUser: {
            type: Boolean,
            default: false
        }
    }
}, {
    collection: 'Permissions'
});

// Export all models
const User = mongoose.model('User', userSchema);
const Chat = mongoose.model('Chat', chatSchema);
const Message = mongoose.model('Message', messageSchema);
const Group = mongoose.model('Group', groupSchema);
const Call = mongoose.model('Call', callSchema);
const Media = mongoose.model('Media', mediaSchema);
const Reaction = mongoose.model('Reaction', reactionSchema);
const PinnedMessages = mongoose.model('PinnedMessages', pinnedMessageSchema);
const ArchivedMessages = mongoose.model('ArchivedMessages', archivedMessageSchema);
const DeletedMessages = mongoose.model('DeletedMessages', deletedMessageSchema);
const Encryption = mongoose.model('Encryption', encryptionSchema);
const Presence = mongoose.model('Presence', presenceSchema);
const GroupLogs = mongoose.model('GroupLogs', groupLogSchema);
const UserLogs = mongoose.model('UserLogs', userLogSchema);
const Reports = mongoose.model('Reports', reportSchema);
const Polls = mongoose.model('Polls', pollSchema);
const Permissions = mongoose.model('Permissions', permissionSchema);

export {
    User,
    Chat,
    Message,
    Group,
    Call,
    Media,
    Reaction,
    PinnedMessages,
    ArchivedMessages,
    DeletedMessages,
    Encryption,
    Presence,
    GroupLogs,
    UserLogs,
    Reports,
    Polls,
    Permissions
};
