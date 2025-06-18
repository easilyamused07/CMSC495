import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import OpenAIComponent from '../OpenAIComponent';
import { getOpenAIResponse } from '../../services/openaiService';
import '@testing-library/jest-dom';

jest.mock('../../services/openaiService');

describe('OpenAIComponent', () => {
  it('renders and responds to input', async () => {
    (getOpenAIResponse as jest.Mock).mockResolvedValue('Mock AI response');

    render(<OpenAIComponent />);

    fireEvent.change(screen.getByPlaceholderText(/type your prompt/i), {
      target: { value: 'How do I treat a cut?' }
    });

    fireEvent.click(screen.getByText(/get response/i));

    await waitFor(() => {
      expect(screen.getByText(/Mock AI response/i)).toBeInTheDocument();
    });
  });
});
