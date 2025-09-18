
### Step 1: Initialize Next.js 15 Project Structure
```
You are helping me build SecretBox, a secure key management application using Next.js 15 with TypeScript. I have an existing folder called 'secretbox' with README.md and Gemini.md files.

TASK: Initialize Next.js 15 project structure inside the existing secretbox folder while preserving existing files.

Requirements:
1. Use Next.js 15 (latest) with App Router
2. Enable TypeScript
3. Setup Tailwind CSS
4. Preserve existing README.md and Gemini.md files
5. Create the exact folder structure I'll provide
6. make sure you follow the rules or instructions in the Gemini.md file

PROJECT CONTEXT: SecretBox is a developer-focused secure credential management app with server-side encryption, Supabase authentication, and Next.js API routes.

Please provide the exact commands to run in the secretbox directory and the initial file contents for:
- package.json with all necessary dependencies
- next.config.js
- tailwind.config.js  
- tsconfig.json
- .env.local (template with placeholder values)

After setup, create this exact folder structure:
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── dashboard/
│   │   ├── collections/
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── keys/
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── settings/
│   │   │   └── page.tsx
│   │   ├── page.tsx
│   │   └── layout.tsx
│   ├── api/
│   │   ├── auth/
│   │   ├── keys/
│   │   ├── collections/
│   │   └── audit/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   ├── auth/
│   ├── keys/
│   ├── collections/
│   └── layout/
├── lib/
│   ├── server/
│   ├── supabase.ts
│   ├── validations.ts
│   └── utils.ts
├── types/
├── hooks/
├── context/
└── middleware.ts

Provide empty placeholder files where needed with proper TypeScript exports and basic structure comments.
```

## Step 2: Supabase project setup and environment variables
```
You are helping me build SecretBox, a secure key management application. We've completed Step 1 (Next.js 15 project setup) and now need to configure Supabase integration.

PROJECT CONTEXT: SecretBox uses Next.js 15 + TypeScript + Supabase for authentication and database. This is Step 2 of our build process.

TASK: Setup Supabase integration and environment configuration

Requirements:
1. Install all necessary Supabase packages for Next.js 15
2. Create proper environment variable structure
3. Setup Supabase client configuration for both client and server-side usage
4. Configure authentication helpers for Next.js App Router
5. Create type-safe database types structure

Please provide:

1. PACKAGE INSTALLATION COMMANDS:
   - All Supabase-related npm packages needed
   - Any additional authentication packages required

2. ENVIRONMENT VARIABLES SETUP:
   Create .env.local template with:
   - Supabase URL and keys (anon key, service role key)
   - Encryption key placeholder (32-byte base64)
   - Next.js configuration variables
   - Development/production environment flags

3. SUPABASE CLIENT CONFIGURATION:
   Create lib/supabase.ts with:
   - Client-side Supabase client
   - Server-side Supabase client 
   - Database client with proper TypeScript types
   - Authentication helpers

4. TYPE DEFINITIONS:
   Create types/supabase.ts with:
   - Database type definitions structure
   - User profile types
   - Collection and Key types
   - API response types

5. MIDDLEWARE SETUP:
   Update middleware.ts for:
   - Authentication route protection
   - Session management
   - Redirect logic for auth/protected routes

IMPORTANT: 
- Use Next.js 15 App Router patterns
- Ensure type safety throughout
- Follow Supabase v2 latest patterns
- Include proper error handling
- Add helpful comments explaining each configuration

After this step, I should be able to:
- Connect to Supabase from both client and server
- Have type-safe database operations
- Protect routes with authentication middleware
- Have proper environment variable structure ready
```


## Step 3: Database schema and migrations
```
You are helping me build SecretBox, a secure key management application. We've completed Steps 1-2 (Next.js setup + Supabase configuration) and now need to create the database schema.

PROJECT CONTEXT: SecretBox stores encrypted credentials with collections-based organization, audit logging, and Row Level Security. This is Step 3 of our build process.

TASK: Create complete database schema with migrations and Row Level Security policies

Requirements:
1. Design tables for user profiles, collections, keys, and audit logs
2. Implement proper indexes for performance
3. Setup Row Level Security (RLS) policies
4. Create Supabase migrations
5. Add database triggers for updated_at timestamps

Please provide:

1. DATABASE SCHEMA DESIGN:
   Create SQL migration files for:
   
   a) user_profiles table:
   - Links to auth.users
   - Stores full_name, avatar_url, theme_preference
   - master_password_hash for additional security
   - two_factor_enabled flag
   - created_at, updated_at timestamps

   b) collections table:
   - Links to user via user_id
   - name, description, color, icon fields
   - is_archived, sort_order for organization
   - created_at, updated_at timestamps

   c) keys table:
   - Links to user and collection
   - name, encrypted_value, encryption_iv, auth_tag
   - description, key_type (enum: api_key, secret, token, credential)
   - tags array, url, username fields
   - expires_at for expiration tracking
   - is_favorite, last_accessed_at, access_count
   - created_at, updated_at timestamps

   d) audit_logs table:
   - Tracks all user actions
   - action type, resource_type, resource_id
   - ip_address, user_agent, metadata jsonb
   - created_at timestamp

2. INDEXES AND PERFORMANCE:
   - Proper indexes for common queries
   - Composite indexes for filtering
   - GIN indexes for full-text search

3. ROW LEVEL SECURITY POLICIES:
   - Users can only access their own data
   - Proper policies for all CRUD operations
   - Audit log access restrictions

4. DATABASE TRIGGERS:
   - Auto-update updated_at timestamps
   - Audit log triggers for sensitive operations

5. SUPABASE MIGRATION FILES:
   - Proper migration file structure
   - Up and down migrations
   - Version control for schema changes

IMPORTANT:
- Use UUID primary keys
- Implement proper foreign key constraints
- Add check constraints where appropriate
- Include helpful comments in SQL
- Follow PostgreSQL best practices
- Ensure RLS policies are comprehensive

After this step, I should have:
- Complete database schema deployed
- Proper security policies active
- Audit logging infrastructure ready
- Performance-optimized queries
```


## Step 4: Server-Side Encryption Utilities
```
You are helping me build SecretBox, a secure key management application. We've completed Steps 1-3 (Next.js setup + Supabase + Database schema) and now need to implement server-side encryption utilities.

PROJECT CONTEXT: SecretBox uses AES-256-GCM encryption for all sensitive data, with server-side encryption/decryption in API routes. This is Step 4 of our build process.

TASK: Create comprehensive server-side encryption system with proper security practices

Requirements:
1. Implement AES-256-GCM encryption/decryption functions
2. Create secure key derivation utilities
3. Add encryption validation and error handling
4. Implement audit logging for crypto operations
5. Add performance monitoring for encryption operations

Please provide:

1. CORE ENCRYPTION MODULE (lib/server/encryption.ts):
   - encrypt() function with AES-256-GCM
   - decrypt() function with authentication tag validation
   - Proper error handling for invalid data
   - Memory clearing after operations
   - Input validation and sanitization

2. KEY DERIVATION UTILITIES:
   - Master key validation functions
   - Salt generation and management
   - Key stretching with PBKDF2 or similar
   - Secure random number generation

3. ENCRYPTION VALIDATION:
   - Test vectors for encryption/decryption
   - Integrity checking functions
   - Performance benchmarking utilities
   - Security validation helpers

4. AUDIT INTEGRATION (lib/server/audit.ts):
   - auditEncryption() function for crypto operations
   - Performance metric logging
   - Error event tracking
   - Security event monitoring

5. UTILITY FUNCTIONS (lib/server/crypto-utils.ts):
   - Secure memory clearing
   - Constant-time comparison functions
   - Encryption metadata helpers
   - Batch encryption/decryption for performance

6. TYPE DEFINITIONS:
   Update types/ with:
   - EncryptionResult interface
   - CryptoError types
   - AuditEvent types for crypto operations

SECURITY REQUIREMENTS:
- Use crypto.randomBytes() for all random data
- Implement proper IV (initialization vector) generation
- Add authentication tag validation
- Clear sensitive data from memory after use
- Validate all inputs before encryption
- Use constant-time operations where possible
- Add rate limiting for crypto operations

IMPORTANT:
- Follow OWASP cryptography guidelines
- Add comprehensive error handling
- Include performance monitoring
- Use TypeScript for type safety
- Add detailed JSDoc comments
- Include test cases for validation

After this step, I should have:
- Secure, battle-tested encryption functions
- Proper audit logging for all crypto operations
- Performance-optimized encryption system
- Type-safe encryption interfaces
- Comprehensive error handling
```


Step 5: Authentication system (Supabase Auth + Next.js middleware)
```
You are helping me build SecretBox, a secure key management application. We've completed Steps 1-4 (Setup + Database + Encryption) and now need to implement the complete authentication system.

PROJECT CONTEXT: SecretBox uses Supabase Auth with additional master password layer and session management. This is Step 5 of our build process.

TASK: Create complete authentication system with Supabase integration, master password support, and secure session management

Requirements:
1. Build authentication API routes
2. Create auth UI components  
3. Implement master password system
4. Setup session management
5. Add authentication utilities and hooks

Please provide:

1. AUTHENTICATION API ROUTES:
   Create in app/api/auth/:
   
   a) route.ts for login:
   - Supabase email/password authentication
   - Master password verification
   - Session creation and management
   - Error handling and rate limiting

   b) register/route.ts:
   - User registration with Supabase
   - User profile creation
   - Master password setup
   - Email verification handling

   c) logout/route.ts:
   - Session termination
   - Audit logging
   - Secure cleanup

   d) callback/route.ts:
   - Handle Supabase auth callbacks
   - Redirect logic after authentication

2. AUTHENTICATION COMPONENTS:
   Create in components/auth/:
   
   a) LoginForm.tsx:
   - Email/password form with validation
   - Master password input
   - Loading states and error handling
   - Responsive design with Tailwind

   b) RegisterForm.tsx:
   - Registration form with validation
   - Master password creation with strength meter
   - Terms acceptance
   - Form submission handling

   c) AuthProvider.tsx:
   - React context for auth state
   - User session management
   - Authentication status tracking

3. AUTHENTICATION UTILITIES (lib/server/auth.ts):
   - getServerSession() function
   - validateMasterPassword() function
   - createUserProfile() function
   - updateLastLogin() function
   - generateSecureTokens() function

4. AUTHENTICATION HOOKS (hooks/):
   - useAuth.ts for client-side auth state
   - useSession.ts for session management
   - useProtectedRoute.ts for route protection

5. MIDDLEWARE ENHANCEMENT:
   Update middleware.ts with:
   - Advanced route protection
   - Session validation
   - Master password requirement check
   - Redirect logic optimization

6. VALIDATION SCHEMAS (lib/validations.ts):
   Add Zod schemas for:
   - Login form validation
   - Registration form validation
   - Master password requirements
   - Session data validation

SECURITY FEATURES:
- Rate limiting on auth endpoints
- CSRF protection
- Secure session cookies
- Master password hashing with bcrypt
- Failed login attempt tracking
- Account lockout after failed attempts
- Audit logging for all auth events

UI/UX REQUIREMENTS:
- Clean, professional design
- Loading states and error messages
- Form validation with real-time feedback
- Responsive mobile-first design
- Accessibility compliance
- Password strength indicators

IMPORTANT:
- Use Supabase Auth best practices
- Implement proper error handling
- Add comprehensive logging
- Follow security guidelines
- Use TypeScript throughout
- Test authentication flows

After this step, I should have:
- Complete user registration and login system
- Master password security layer
- Protected routes and session management
- Professional authentication UI
- Comprehensive audit logging
```
 
## Step 6: Basic UI components and layout and Implement dark mode
```
You are helping me build SecretBox, a secure key management application. We've completed Steps 1-5 (Setup through Authentication) and now need to create the core UI components and layout system and of course implement them dark mode and light mode. 

PROJECT CONTEXT: SecretBox needs a clean, professional interface with reusable components, consistent design system, and responsive layouts. This is Step 6 of our build process.   

TASK: Create comprehensive UI component library and layout system with Tailwind CSS

Requirements:
1. Build reusable base UI components
2. Create layout components for dashboard
3. Implement responsive design system
4. Add loading states and error handling
5. Setup theme system and accessibility
6. Add dark mode and light mode support

Please provide:

1. BASE UI COMPONENTS (components/ui/):
   
   a) Button.tsx:
   - Multiple variants (primary, secondary, danger, outline)
   - Different sizes (sm, md, lg)
   - Loading states with spinners
   - Icon support with Lucide React
   - Disabled states and accessibility

   b) Input.tsx:
   - Text input with validation states
   - Password input with toggle visibility
   - Search input with icons
   - Textarea variant
   - Error message display

   c) Modal.tsx:
   - Overlay with backdrop blur
   - Close button and ESC key handling
   - Different sizes and positions
   - Animation with Tailwind transitions
   - Focus trap for accessibility

   d) Toast.tsx:
   - Success, error, warning, info variants
   - Auto-dismiss with timers
   - Action buttons support
   - Position management
   - Animation states

   e) Card.tsx:
   - Clean card design with shadows
   - Header, content, footer sections
   - Hover states and interactions
   - Loading skeleton states

2. LAYOUT COMPONENTS (components/layout/):
   
   a) Header.tsx:
   - User avatar and dropdown menu
   - Search functionality
   - Theme toggle (dark/light)
   - Mobile hamburger menu
   - Logout button

   b) Sidebar.tsx:
   - Navigation menu with icons
   - Active state indicators
   - Collapsible sections
   - Mobile responsive drawer
   - Collections list preview

   c) DashboardLayout.tsx:
   - Main layout wrapper
   - Sidebar and header integration
   - Content area with proper spacing
   - Mobile responsive breakpoints
   - Loading states

3. THEME SYSTEM:
   
   a) Update globals.css with:
   - CSS custom properties for colors
   - Dark/light theme variables
   - Typography scale
   - Spacing system
   - Animation utilities

   b) Create lib/theme.ts:
   - Theme switching utilities
   - System preference detection
   - Local storage persistence
   - Theme provider setup

4. FORM COMPONENTS:
   
   a) FormField.tsx:
   - Label and input wrapper
   - Error message display
   - Required field indicators
   - Help text support

   b) Select.tsx:
   - Dropdown select component
   - Multi-select support
   - Search functionality
   - Custom option rendering

5. LOADING & ERROR STATES:
   
   a) LoadingSpinner.tsx:
   - Different sizes and variants
   - Accessible loading indicators
   - Overlay loading states

   b) ErrorBoundary.tsx:
   - React error boundary
   - Fallback UI components
   - Error reporting integration
   - Recovery options

6. RESPONSIVE DESIGN SYSTEM:
   - Mobile-first approach
   - Tablet and desktop breakpoints
   - Touch-friendly interactions
   - Responsive typography
   - Grid and layout utilities

DESIGN REQUIREMENTS:
- Clean, modern aesthetic
- Consistent spacing and typography
- Subtle animations and transitions
- Professional color palette
- High contrast for accessibility
- Icon consistency with Lucide React

ACCESSIBILITY FEATURES:
- ARIA labels and descriptions
- Keyboard navigation support
- Focus indicators
- Screen reader compatibility
- Color contrast compliance
- Reduced motion preferences

IMPORTANT:
- Use Tailwind CSS utilities
- Follow React best practices
- Implement proper TypeScript types
- Add Storybook stories for components
- Include responsive design
- Test across different screen sizes

After this step, I should have:
- Complete UI component library
- Responsive dashboard layout
- Theme system with dark/light modes
- Accessible and professional interface
- Reusable design system

please use this theme system:

1. System Colors from  @samples/ 
2. **Interface Layout Sample** from @sample/ 
```
## Step 7: Key management CRUD operations
```
You are helping me build SecretBox, a secure key management application. We've completed Steps 1-6 (Setup through UI Components) and now need to implement the core key management system.

PROJECT CONTEXT: SecretBox allows users to securely store, manage, and retrieve encrypted credentials with full CRUD operations. This is Step 7 of our build process.

TASK: Create complete key management system with API routes, UI components, and secure operations

Requirements:
1. Build key management API routes with encryption
2. Create key UI components and forms
3. Implement key reveal/hide functionality
4. Add search and filtering capabilities
5. Setup audit logging for all key operations

Please provide:

1. KEY MANAGEMENT API ROUTES (app/api/keys/):
   
   a) route.ts (GET /api/keys, POST /api/keys):
   - GET: List user's keys with pagination
   - POST: Create new encrypted key
   - Input validation with Zod
   - Server-side encryption before storage
   - Audit logging for operations

   b) [id]/route.ts (GET, PUT, DELETE /api/keys/[id]):
   - GET: Retrieve and decrypt specific key
   - PUT: Update key with re-encryption
   - DELETE: Secure key deletion
   - Access tracking (last_accessed_at, access_count)
   - Master password verification for sensitive ops

   c) search/route.ts:
   - Full-text search across key names/descriptions
   - Filter by collection, type, tags
   - Sort by various criteria
   - Pagination support

2. KEY COMPONENTS (components/keys/):
   
   a) KeyList.tsx:
   - Display keys in card/list view
   - Search and filter controls
   - Pagination navigation
   - Bulk selection capabilities
   - Loading states and empty states

   b) KeyCard.tsx:
   - Individual key display component
   - Masked value with reveal toggle
   - Copy to clipboard functionality
   - Edit/delete action buttons
   - Favorite toggle and last accessed info
   - Key type indicators and badges

   c) KeyForm.tsx:
   - Add/edit key form
   - Collection selection dropdown
   - Key type selection with icons
   - Tags input with autocomplete
   - URL and expiration date fields
   - Form validation and error handling

   d) KeyReveal.tsx:
   - Secure key value display
   - Master password re-authentication
   - Auto-hide after timeout
   - Copy button with success feedback
   - Security warning messages

3. KEY UTILITIES (lib/keys.ts):
   - validateKeyData() function
   - formatKeyType() display helper
   - generateKeyId() utility
   - isKeyExpired() checker
   - sortKeys() with various criteria

4. KEY HOOKS (hooks/):
   - useKeys.ts for key data management
   - useKeyReveal.ts for secure reveal logic
   - useKeyForm.ts for form state management
   - useKeySearch.ts for search functionality

5. KEY VALIDATION SCHEMAS (lib/validations.ts):
   Add Zod schemas for:
   - CreateKeySchema with all required fields
   - UpdateKeySchema with optional fields
   - KeySearchSchema for search parameters
   - KeyRevealSchema for authentication

6. KEY TYPES (types/):
   Update with comprehensive types:
   - Key interface with all properties
   - KeyType enum (api_key, secret, token, credential)
   - KeyFormData interface
   - KeySearchParams interface
   - KeyRevealRequest interface

SECURITY FEATURES:
- Server-side encryption for all key values
- Master password verification for key access
- Rate limiting on key operations
- Audit logging for all key actions
- Secure clipboard operations with auto-clear
- Access tracking and monitoring

UI/UX FEATURES:
- Intuitive key organization
- Quick copy functionality
- Visual indicators for key types
- Search highlighting
- Responsive design
- Keyboard shortcuts for power users

PERFORMANCE OPTIMIZATIONS:
- Lazy loading for large key collections
- Virtual scrolling for performance
- Debounced search input
- Optimistic updates for UI responsiveness
- Caching for frequently accessed keys

IMPORTANT:
- Never expose decrypted values in client state
- Implement proper error handling
- Add comprehensive audit logging
- Use optimistic updates for better UX
- Follow security best practices
- Include proper loading states

After this step, I should have:
- Complete key CRUD operations
- Secure key reveal/hide functionality
- Professional key management interface
- Search and filtering capabilities
- Comprehensive audit logging
```
## Step 8: Collections management
```
You are helping me build SecretBox, a secure key management application. We've completed Steps 1-7 (Setup through Key Management) and now need to implement the collections management system for organizing keys.

PROJECT CONTEXT: SecretBox uses collections to organize keys by project, service, or category, with drag-and-drop functionality and visual organization. This is Step 8 of our build process.

TASK: Create complete collections management system with API routes, UI components, and organizational features

Requirements:
1. Build collections API routes with CRUD operations
2. Create collection UI components and management interface
3. Implement drag-and-drop key organization
4. Add collection sharing and collaboration prep
5. Setup collection-based access control and organization

Please provide:

1. COLLECTIONS API ROUTES (app/api/collections/):
   
   a) route.ts (GET /api/collections, POST /api/collections):
   - GET: List user's collections with key counts
   - POST: Create new collection with validation
   - Sort by name, created_date, or custom order
   - Include archived/active filtering
   - Collection statistics (key count, last modified)

   b) [id]/route.ts (GET, PUT, DELETE /api/collections/[id]):
   - GET: Retrieve collection with associated keys
   - PUT: Update collection (name, description, color, icon)
   - DELETE: Archive collection or hard delete if empty
   - Move keys to different collection
   - Access control validation

   c) [id]/keys/route.ts:
   - GET: List keys in specific collection
   - POST: Move keys between collections
   - PUT: Bulk update keys in collection
   - Collection-specific filtering and sorting

2. COLLECTION COMPONENTS (components/collections/):
   
   a) CollectionList.tsx:
   - Grid/list view of collections
   - Collection cards with key counts
   - Create new collection button
   - Search and filter collections
   - Archive/active toggle
   - Drag-and-drop reordering

   b) CollectionCard.tsx:
   - Visual collection representation
   - Custom color and icon display
   - Key count and last modified info
   - Quick action buttons (edit, archive, delete)
   - Preview of recent keys
   - Click to navigate to collection view

   c) CollectionForm.tsx:
   - Add/edit collection modal
   - Name and description fields
   - Color picker for customization
   - Icon selector with search
   - Validation and error handling
   - Archive/restore functionality

   d) CollectionManager.tsx:
   - Drag-and-drop interface for keys
   - Move keys between collections
   - Bulk operations (select multiple keys)
   - Visual feedback for drag operations
   - Undo functionality for moves

3. DASHBOARD INTEGRATION:
   
   a) Update dashboard/page.tsx:
   - Recent collections display
   - Quick stats (total keys, collections)
   - Recent activity feed
   - Quick create buttons
   - Search across all collections

   b) Create dashboard/collections/[id]/page.tsx:
   - Collection detail view
   - Keys within collection
   - Collection settings and management
   - Statistics and usage analytics

4. COLLECTION UTILITIES (lib/collections.ts):
   - validateCollectionData() function
   - generateCollectionColor() utility
   - sortCollections() with various criteria
   - moveKeyToCollection() helper
   - getCollectionStats() analytics

5. COLLECTION HOOKS (hooks/):
   - useCollections.ts for collection data management
   - useCollectionForm.ts for form state
   - useDragAndDrop.ts for key organization
   - useCollectionStats.ts for analytics

6. DRAG & DROP FUNCTIONALITY:
   - React DnD or similar library integration
   - Drag keys between collections
   - Visual feedback during drag operations
   - Touch support for mobile devices
   - Keyboard accessibility for drag operations
   - Undo/redo functionality

ORGANIZATIONAL FEATURES:
- Custom collection colors (8-10 predefined options)
- Icon selection from Lucide React library
- Collection descriptions and metadata
- Archive functionality (soft delete)
- Sort order customization
- Collection templates for common use cases

UI/UX ENHANCEMENTS:
- Visual hierarchy with colors and icons
- Smooth animations for drag-and-drop
- Contextual menus for quick actions
- Keyboard shortcuts for navigation
- Responsive grid layouts
- Empty state illustrations and guidance

PERFORMANCE CONSIDERATIONS:
- Lazy loading for large collections
- Virtual scrolling for many keys
- Debounced search and filtering
- Optimistic updates for drag operations
- Caching for collection metadata

IMPORTANT:
- Maintain referential integrity when moving keys
- Implement soft delete for data recovery
- Add proper validation for collection operations
- Include comprehensive error handling
- Design for future team collaboration features
- Ensure accessibility in drag-and-drop

After this step, I should have:
- Complete collection CRUD operations
- Intuitive drag-and-drop key organization
- Visual collection management interface
- Dashboard integration with collections
- Foundation for team collaboration features
```


## Step 9: Dashboard & Main Interface
```
You are helping me build SecretBox, a secure key management application. We've completed Steps 1-8 (Setup through Collections) and now need to create the main dashboard interface and navigation system.

PROJECT CONTEXT: SecretBox needs a comprehensive dashboard showing user activity, recent keys, collections overview, and intuitive navigation. This is Step 9 of our build process.

TASK: Create complete dashboard interface with analytics, recent activity, search functionality, and navigation system

Requirements:
1. Build comprehensive dashboard with analytics
2. Create global search functionality
3. Implement recent activity and quick access
4. Add user settings and profile management
5. Setup responsive navigation and mobile interface

Please provide:

1. DASHBOARD MAIN PAGE (app/dashboard/page.tsx):
   - Statistics cards (total keys, collections, recent activity)
   - Recent keys with quick access
   - Recently accessed collections
   - Activity timeline/feed
   - Quick action buttons (add key, create collection)
   - Search bar with global search
   - Welcome message and onboarding hints

2. GLOBAL SEARCH SYSTEM:
   
   a) app/api/search/route.ts:
   - Search across keys, collections, and descriptions
   - Full-text search with ranking
   - Filter by type, collection, date ranges
   - Pagination and result limiting
   - Search result highlighting

   b) components/search/:
   - GlobalSearch.tsx with command palette style
   - SearchResults.tsx with categorized results
   - SearchFilters.tsx for advanced filtering
   - RecentSearches.tsx for search history
   - Keyboard navigation (Cmd+K shortcut)

3. USER SETTINGS & PROFILE (app/dashboard/settings/page.tsx):
   
   a) Profile Settings:
   - Update name, email, avatar
   - Change master password
   - Two-factor authentication setup
   - Theme preferences (dark/light/system)
   - Language selection

   b) Security Settings:
   - Active sessions management
   - Login history and device tracking
   - Export/backup options
   - Account deletion with warnings
   - Privacy settings

   c) Application Settings:
   - Auto-logout timeout configuration
   - Default collection for new keys
   - Key expiration notification preferences
   - UI preferences (list/grid view, sorting)

4. NAVIGATION SYSTEM:
   
   a) Enhanced Sidebar (components/layout/Sidebar.tsx):
   - Dashboard, Keys, Collections navigation
   - User collections list with counts
   - Recent items quick access
   - Settings and logout options
   - Responsive collapse/expand
   - Active state indicators

   b) Breadcrumb Navigation:
   - Dynamic breadcrumbs for deep navigation
   - Click to navigate to parent levels
   - Current page indicators
   - Mobile-friendly responsive design

5. ANALYTICS & INSIGHTS:
   
   a) Dashboard Analytics:
   - Key creation trends (daily/weekly/monthly)
   - Most accessed keys and collections
   - Security alerts and notifications
   - Usage patterns and statistics
   - Storage usage indicators

   b) Activity Feed:
   - Recent key accesses with timestamps
   - Collection modifications
   - Security events (login, password changes)
   - System notifications
   - Real-time updates with Supabase subscriptions

6. MOBILE INTERFACE OPTIMIZATIONS:
   - Mobile-first responsive design
   - Touch-friendly interactions
   - Swipe gestures for actions
   - Mobile navigation drawer
   - Optimized search interface
   - Quick action floating button

DASHBOARD FEATURES:
- Real-time activity updates
- Customizable dashboard widgets
- Quick access to frequently used items
- Visual indicators for security status
- Onboarding flow for new users
- Keyboard shortcuts for power users

PERFORMANCE OPTIMIZATIONS:
- Lazy loading for dashboard widgets
- Cached analytics data
- Infinite scroll for activity feeds
- Debounced search with instant results
- Optimized database queries
- Image optimization for avatars

ACCESSIBILITY FEATURES:
- Screen reader support
- Keyboard navigation throughout
- High contrast mode support
- Focus management for modals
- ARIA labels for interactive elements
- Reduced motion preferences

IMPORTANT:
- Implement real-time updates where appropriate
- Add proper loading states for all components
- Include comprehensive error handling
- Design for scalability (many keys/collections)
- Maintain performance with large datasets
- Follow accessibility guidelines

After this step, I should have:
- Complete dashboard with analytics and insights
- Global search functionality across all data
- Comprehensive user settings and profile management
- Responsive navigation system
- Mobile-optimized interface
- Real-time activity tracking
```

## Step 10: Security hardening and audit logging
```
You are helping me build SecretBox, a secure key management application. We've completed Steps 1-9 (Core functionality complete) and now need to implement comprehensive security hardening and audit logging system.

PROJECT CONTEXT: SecretBox handles sensitive credentials and needs enterprise-grade security with comprehensive audit trails, rate limiting, and security monitoring. This is Step 10 of our build process.

TASK: Implement comprehensive security hardening, audit logging, and monitoring systems

Requirements:
1. Build comprehensive audit logging system
2. Implement advanced security middleware
3. Add rate limiting and abuse prevention  
4. Create security monitoring and alerts
5. Setup data export/import with encryption

Please provide:

1. AUDIT LOGGING SYSTEM:
   
   a) Enhanced app/api/audit/route.ts:
   - GET: Retrieve user's audit logs with pagination
   - Advanced filtering (date range, action type, resource)
   - Export audit logs with encryption
   - Real-time audit log streaming
   - Compliance reporting features

   b) lib/server/audit.ts improvements:
   - Detailed event tracking with context
   - IP geolocation and device fingerprinting
   - Risk scoring for unusual activities
   - Batch logging for performance
   - Structured logging with metadata

   c) Audit UI components (components/audit/):
   - AuditLogViewer.tsx with timeline view
   - SecurityAlerts.tsx for suspicious activity
   - AuditFilters.tsx for advanced filtering
   - ExportAuditLogs.tsx for compliance

2. SECURITY MIDDLEWARE ENHANCEMENTS:
   
   a) Advanced middleware.ts:
   - Rate limiting per user/IP/endpoint
   - Geolocation-based access control
   - Device fingerprinting an
```
## Step 11: Testing and deployment preparation