# Lucky Chat - A Modern Real-Time Chat Application with Supabase Integration

Lucky Chat is a real-time messaging application built with React, TypeScript, and Supabase that enables seamless communication between users. The application features a modern UI built with Radix UI components and Tailwind CSS, providing a responsive and accessible chat experience with real-time message updates.

The frontend development was enhanced using Lovable AI (via lovable-tagger), which helped in constructing and optimizing the React components. The application combines the power of React Query for state management, Supabase for real-time data synchronization and authentication, and a comprehensive UI component library to deliver a feature-rich chat experience. Users can engage in private conversations, track message read status, and enjoy a responsive interface that works across different devices.

## Repository Structure
```
.
├── src/                          # Source code directory
│   ├── components/               # React components
│   │   ├── ui/                  # Reusable UI components built with Radix UI
│   │   ├── ChatMessages.tsx     # Main chat messages component
│   │   ├── ChatSidebar.tsx     # Sidebar navigation component
│   │   └── UserSettings.tsx     # User settings component
│   ├── contexts/                # React context providers
│   │   └── ChatContext.tsx      # Chat state management context
│   ├── hooks/                   # Custom React hooks
│   │   ├── useMessages.ts       # Hook for managing chat messages
│   │   ├── useUsers.ts         # Hook for managing user data
│   │   └── useCurrentUser.ts   # Hook for current user state
│   ├── integrations/           
│   │   └── supabase/           # Supabase client configuration
│   ├── pages/                   # Application pages
│   │   ├── Auth.tsx            # Authentication page
│   │   ├── Index.tsx           # Main chat page
│   │   └── Landing.tsx         # Landing page
│   └── types/                   # TypeScript type definitions
├── public/                      # Static assets
└── config files                 # Configuration files for Vite, TypeScript, etc.
```

## Usage Instructions
### Prerequisites
- Node.js 18.x or higher
- npm or yarn package manager
- A Supabase account and project

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd lucky-chat

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your Supabase URL and anon key to .env
```

### Quick Start
1. Start the development server:
```bash
npm run dev
```

2. Open your browser and navigate to `http://localhost:8080`

3. Sign in or create an account using the authentication page

### More Detailed Examples
#### Starting a New Conversation
```typescript
// Using the ChatContext
const { sendMessage, setSelectedUser } = useChat();

// Select a user to chat with
setSelectedUser(user);

// Send a message
await sendMessage({
  content: "Hello!",
  receiver_id: selectedUser.id
});
```

#### Handling Real-time Updates
```typescript
// Using the useMessages hook
const { messages, markMessagesAsRead } = useMessages();

// Mark messages as read when viewing conversation
useEffect(() => {
  if (selectedUser) {
    markMessagesAsRead(selectedUser.id);
  }
}, [selectedUser]);
```

### Troubleshooting
#### Common Issues
1. **Authentication Issues**
   - Error: "Invalid credentials"
   - Solution: Verify your Supabase configuration in the environment variables
   ```bash
   VITE_SUPABASE_URL=your-project-url
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

2. **Real-time Updates Not Working**
   - Check Supabase connection status:
   ```typescript
   const status = supabase.getChannels()[0]?.state;
   console.log('Supabase connection status:', status);
   ```
   - Ensure your Supabase project has real-time enabled for the required tables

3. **Build Errors**
   - Clear the build cache:
   ```bash
   npm run clean
   npm install
   npm run build
   ```

4. **Row Level Security Not Enabled**
   - Error: "new row violates row-level security policy"
   - Solution: Enable RLS and set up appropriate policies in Supabase
   ```sql
   -- Enable RLS for messages table
   alter table messages enable row level security;

   -- Create policy for inserting messages
   create policy "Users can insert messages"
   on messages for insert
   with check (auth.uid() = sender_id);

   -- Create policy for viewing messages
   create policy "Users can view their messages"
   on messages for select
   using (auth.uid() in (sender_id, receiver_id));

   -- Enable RLS for profiles table
   alter table profiles enable row level security;

   -- Create policy for viewing profiles
   create policy "Profiles are viewable by everyone"
   on profiles for select
   using (true);

   -- Create policy for updating own profile
   create policy "Users can update own profile"
   on profiles for update
   using (auth.uid() = id);
   ```

## Data Flow
The application follows a real-time data synchronization pattern using Supabase's real-time subscriptions.

```ascii
+-------------+     +--------------+     +----------------+
|   Client    |     |   Supabase   |     |    Database    |
|   Browser   | <-> |  Real-time   | <-> |    Tables      |
+-------------+     +--------------+     +----------------+
       ^                   ^                    ^
       |                   |                    |
       v                   v                    v
+-------------+     +--------------+     +----------------+
|  React UI   |     |   Supabase   |     |    Auth &     |
| Components  | --> |   Client     | --> |    Storage    |
+-------------+     +--------------+     +----------------+
```

Key component interactions:
- ChatContext provides global state management for the chat application
- useMessages hook manages real-time message synchronization
- useUsers hook handles user presence and status updates
- Supabase client manages authentication and real-time subscriptions
- UI components update automatically based on real-time events
- Messages are stored and retrieved from Supabase database tables
- User authentication state is managed through Supabase Auth