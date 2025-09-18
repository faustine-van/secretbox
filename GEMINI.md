# 🤖 gemini.md – SecretBox Project Guide

## 📌 Project Overview
SecretBox is a **security-first key management application** for developers to safely store, organize, and retrieve sensitive credentials like **API keys, tokens, and database credentials**.

- **Core Technology Stack**: Next.js 15+ (App Router), TypeScript, Supabase (PostgreSQL), Tailwind CSS, Node.js crypto (AES-256-GCM), Vercel deployment  
- **Security Architecture**: Server-side encryption, zero-trust model, comprehensive audit logging, re-authentication for sensitive operations, rate-limited endpoints  

---

## 🎯 AI Assistant Default Behavior

### Security-First Mindset
- Always prioritize security over convenience in design decisions  
- Never suggest client-side encryption or sensitive data handling  
- Include security considerations in every recommendation  
- Assume all user input is potentially malicious and must be validated  
- Consider audit logging requirements for all sensitive operations  

### Code Quality Standards
- Generate production-ready code with comprehensive error handling  
- Include TypeScript types for all functions, props, and API responses  
- Implement accessibility features by default (ARIA labels, keyboard navigation)  
- Add loading states, error boundaries, and user feedback mechanisms  
- Follow defensive programming practices with proper input validation  

### Performance Considerations
- Optimize queries and use indexing where appropriate  
- Implement caching strategies when beneficial  
- Use pagination for large datasets  
- Optimize both server-side and client-side performance  
- Consider mobile and low-bandwidth scenarios  

---

## 📋 Code Generation Standards

### Component Development
- Use functional components with TypeScript interfaces for props  
- Apply compound component patterns for complex UI  
- Extract custom hooks for reusable stateful logic  
- Always include loading and error states for async ops  
- Prefer composition over inheritance  
- Design with mobile-first responsive patterns  

### API Route Standards
- Validate all inputs with Zod schemas  
- Apply rate limiting appropriate to endpoint sensitivity  
- Require authentication & authorization checks  
- Audit log all sensitive operations  
- Return consistent error formats and HTTP codes  
- Add compression where useful  

### Database Interaction
- Always enforce RLS (Row Level Security) policies  
- Add server-side checks for redundancy  
- Index frequently queried columns  
- Use transactions for multi-step operations  
- Prefer soft deletes to preserve audit trails  
- Select only needed columns (avoid `*`)  

### Security Rules
- Never expose encryption keys or sensitive config  
- Clear sensitive data from memory after use  
- Secure session management with cookies  
- Use timing-safe comparison for sensitive ops  
- Log comprehensively without leaking secrets  
- Apply progressive delays on repeated auth failures  

### Styling & UI
- Use Tailwind utility classes consistently  
- Follow design system for spacing, colors, typography  
- Provide dark mode with contrast compliance  
- Meet WCAG 2.1 AA accessibility standards  
- Use semantic HTML + ARIA attributes  
- Support full keyboard navigation  

---

## 🔧 Development Workflow

### Testing
- Unit tests for utils and encryption logic  
- Integration tests for API routes with auth  
- Component tests for accessibility & UX  
- Security tests for encryption/auth flows  
- E2E tests for critical user journeys  
- Cover error scenarios and edge cases  

### Documentation
- Add JSDoc to complex functions and classes  
- Inline comments on security-sensitive code  
- Keep README updated with new features  
- Document API request/response examples  
- List required environment variables  
- Provide migration guides for breaking changes  

### Error Handling
- Show user-friendly errors (no system leaks)  
- Log for debugging without exposing secrets  
- Use consistent API error responses  
- Apply graceful degradation for non-critical failures  
- Retry transient failures where safe  
- Return proper HTTP status codes with clear messages  

---

## 🚨 Security-Specific Instructions

### Encryption & Sensitive Data
- Encrypt/decrypt only on server-side  
- Use separate IV + auth_tag per operation  
- Plan for key rotation in architecture  
- Validate auth_tag before decryption  
- Clear sensitive memory immediately  
- Never log plaintext secrets or passwords  

### Authentication & Authorization
- Validate ownership via RLS + server checks  
- Implement session timeouts & re-auth flows  
- Add device fingerprinting and suspicious activity alerts  
- Require re-auth for high-sensitivity operations  
- Enforce CSRF protection + security headers  
- Log all auth events with audit trails  

### Rate Limiting & Abuse Prevention
- Apply stricter limits for decryption & export  
- Add progressive delays on repeated failures  
- Use IP + user-based rate limiting  
- Detect bulk/suspicious operations  
- Enforce CAPTCHA or verification if needed  
- Build automated response to threats  

---

## 📊 Data Modeling Guidelines

### Database Design
- Use UUIDs for all primary keys  
- Add `created_at` + `updated_at` timestamps  
- Store encrypted values with IV + auth_tag fields  
- Define proper FKs with cascading rules  
- Use JSONB for flexible metadata  
- Implement soft deletes for audits  

### API Response Formatting
- Standardize response structures  
- Add pagination metadata on list endpoints  
- Always return correct HTTP codes + descriptive errors  
- Include rate-limit headers in responses  
- Enforce strict CORS policies  
- Apply security headers by default  

### Audit Logging
- Log all sensitive data access with user + timestamp  
- Capture IPs, user agents, request metadata  
- Store logs in separate, protected tables  
- Define retention & compliance policies  
- Add alerts for suspicious patterns  
- Support audit reporting features  

---

## 🤖 AI Prompting Guidelines

### Context Provision
Always include:  
- Relevant code patterns & conventions  
- Database schema & constraints  
- Security/compliance requirements  
- Performance & scalability needs  
- UX & accessibility goals  
- Error scenarios & edge cases  

### Feature Requests
Format requests with:  
- Functional requirements & acceptance criteria  
- Security & threat model implications  
- Schema or migration needs  
- API endpoint specifications (auth included)  
- UI/UX + accessibility requirements  
- Testing requirements for new code  

### Code Review / Refactoring
Include:  
- Current implementation & known issues  
- Security/performance bottlenecks  
- Scalability & future-proofing goals  
- Backward compatibility needs  
- Testing gaps or failures  
- Documentation updates required  
