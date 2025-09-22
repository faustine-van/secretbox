
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LoginForm } from '@/components/auth/LoginForm';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

// Mock dependencies
jest.mock('@/hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(),
}));

const mockUseAuth = useAuth as jest.Mock;
const mockUseRouter = useRouter as jest.Mock;
const mockUseToast = useToast as jest.Mock;

describe('LoginForm', () => {
  let mockLogin: jest.Mock;
  let mockPush: jest.Mock;
  let mockToast: jest.Mock;

  beforeEach(() => {
    mockLogin = jest.fn();
    mockPush = jest.fn();
    mockToast = jest.fn();

    mockUseAuth.mockReturnValue({ login: mockLogin });
    mockUseRouter.mockReturnValue({ push: mockPush });
    mockUseToast.mockReturnValue({ toast: mockToast });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the initial credentials form', () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/account password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument();
  });

  it('should allow typing into email and password fields', () => {
    render(<LoginForm />);
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/account password/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('should show master password step after successful credential validation', async () => {
    mockLogin.mockResolvedValueOnce({ error: null });
    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/account password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    });

    await waitFor(() => {
      expect(screen.getByLabelText(/master password/i)).toBeInTheDocument();
    });
    
    expect(mockToast).toHaveBeenCalledWith({
      title: "Credentials Verified",
      description: "Please enter your master password to continue",
    });
  });

  it('should show an error toast on credential validation failure', async () => {
    mockLogin.mockResolvedValueOnce({ error: { message: 'Invalid credentials' } });
    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/account password/i), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'wrongpassword');
    });

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        variant: "destructive",
        title: "Login Failed",
        description: 'Invalid credentials',
      });
    });
  });

  it('should submit all credentials and redirect on final login success', async () => {
    // First step
    mockLogin.mockResolvedValueOnce({ error: null });
    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/account password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));

    // Wait for master password screen
    await waitFor(() => {
      expect(screen.getByLabelText(/master password/i)).toBeInTheDocument();
    });

    // Second step
    mockLogin.mockResolvedValueOnce({ error: null });
    fireEvent.change(screen.getByLabelText(/master password/i), { target: { value: 'masterpass' } });
    fireEvent.click(screen.getByRole('button', { name: /unlock vault/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123', 'masterpass');
    });

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Master Password Verified",
        description: "Welcome back! You have successfully logged in.",
      });
    });
    
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });
});
