
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { KeyCard } from '@/components/keys/KeyCard';
import { Key } from '@/types/supabase';

// Mock child components
jest.mock('@/components/keys/KeyReveal', () => ({ KeyReveal: ({ onClose }: any) => <div data-testid="key-reveal"><button onClick={onClose}>Close</button></div> }));
jest.mock('@/components/ui/ConfirmationDialog', () => ({ ConfirmationDialog: ({ onConfirm, onClose }: any) => <div data-testid="confirmation-dialog"><button onClick={onConfirm}>Confirm</button><button onClick={onClose}>Cancel</button></div> }));
jest.mock('@/components/keys/KeyForm', () => ({ KeyForm: ({ onSubmit, onCancel }: any) => <div data-testid="key-form"><button onClick={() => onSubmit({})}>Submit</button><button onClick={onCancel}>Cancel</button></div> }));

const mockKey: Key = {
  id: '1',
  name: 'Test Key',
  user_id: '123',
  collection_id: '456',
  encrypted_value: 'abc',
  iv: 'def',
  auth_tag: 'ghi',
  key_type: 'api_key',
  created_at: new Date().toISOString(),
  last_accessed_at: new Date().toISOString(),
  expires_at: null,
  description: 'A test key',
};

describe('KeyCard', () => {
  const onUpdate = jest.fn();
  const onDelete = jest.fn();

  beforeEach(() => {
    // Mock navigator.clipboard
    Object.assign(navigator, { clipboard: { writeText: jest.fn() } });
  });

  it('should render key information correctly', () => {
    render(<KeyCard keyData={mockKey} onUpdate={onUpdate} onDelete={onDelete} isUpdating={false} isDeleting={false} />);
    expect(screen.getByText('Test Key')).toBeInTheDocument();
    expect(screen.getByText('api_key')).toBeInTheDocument();
    expect(screen.getByText('Collection')).toBeInTheDocument();
  });

  it('should open the reveal modal when reveal button is clicked', () => {
    render(<KeyCard keyData={mockKey} onUpdate={onUpdate} onDelete={onDelete} isUpdating={false} isDeleting={false} />);
    fireEvent.click(screen.getByRole('button', { name: /reveal/i }));
    expect(screen.getByTestId('key-reveal')).toBeInTheDocument();
  });

  it('should open the edit modal when edit button is clicked', () => {
    render(<KeyCard keyData={mockKey} onUpdate={onUpdate} onDelete={onDelete} isUpdating={false} isDeleting={false} />);
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    expect(screen.getByTestId('key-form')).toBeInTheDocument();
  });

  it('should open the delete confirmation dialog when delete button is clicked', () => {
    render(<KeyCard keyData={mockKey} onUpdate={onUpdate} onDelete={onDelete} isUpdating={false} isDeleting={false} />);
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    expect(screen.getByTestId('confirmation-dialog')).toBeInTheDocument();
  });

  it('should call onUpdate when the edit form is submitted', () => {
    render(<KeyCard keyData={mockKey} onUpdate={onUpdate} onDelete={onDelete} isUpdating={false} isDeleting={false} />);
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    fireEvent.click(screen.getByText('Submit'));
    expect(onUpdate).toHaveBeenCalledWith('1', {});
  });

  it('should call onDelete when the delete is confirmed', () => {
    render(<KeyCard keyData={mockKey} onUpdate={onUpdate} onDelete={onDelete} isUpdating={false} isDeleting={false} />);
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    fireEvent.click(screen.getByText('Confirm'));
    expect(onDelete).toHaveBeenCalledWith('1');
  });
});
