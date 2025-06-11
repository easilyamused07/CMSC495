import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import InjuryForm from '../../components/InjuryForm';
import * as api from '../../services/api';
import '@testing-library/jest-dom';

// Mock the API function
jest.mock('../../services/api');

describe('InjuryForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders input and buttons', () => {
    render(<InjuryForm />);
    expect(screen.getByPlaceholderText(/Describe the injury/i)).toBeInTheDocument();
    expect(screen.getByText(/Use AI to Parse/i)).toBeInTheDocument();
  });

  it('handles manual search and displays steps', async () => {
    const mockSteps = ['Step 1', 'Step 2'];
    (api.parseWithAIOrFallback as jest.Mock).mockResolvedValue(mockSteps);

    render(<InjuryForm />);
    fireEvent.change(screen.getByPlaceholderText(/describe the injury/i), {
      target: { value: 'bleeding' },
    });
    fireEvent.click(screen.getByText(/Use AI to Parse/i));

    await waitFor(() => {
      mockSteps.forEach(step => {
        expect(screen.getByText(step)).toBeInTheDocument();
      });
    });
  });

  it('shows error message on failure', async () => {
    (api.parseWithAIOrFallback as jest.Mock).mockRejectedValue(new Error('Network error'));

    render(<InjuryForm />);
    fireEvent.change(screen.getByPlaceholderText(/describe the injury/i), {
      target: { value: 'unknown' },
    });
    fireEvent.click(screen.getByText(/Use AI to Parse/i));

    await waitFor(() => {
      expect(screen.getByText(/An error occurred/i)).toBeInTheDocument();
    });
  });
});
