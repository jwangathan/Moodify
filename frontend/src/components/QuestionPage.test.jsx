import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import QuestionPage from './QuestionPage';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, useNavigate } from 'react-router-dom';

vi.mock('react-router-dom', async () => {
	const actual = await vi.importActual('react-router-dom');
	return {
		...actual,
		useNavigate: vi.fn(),
	};
});

describe('QuestionPage', () => {
	it('renders first question content correctly', () => {
		render(
			<MemoryRouter>
				<QuestionPage />
			</MemoryRouter>
		);

		expect(
			screen.getByText(/Tell me about something in your life/i)
		).toBeInTheDocument();
		expect(
			screen.getByText(/e.g. I had a hard day at work/i)
		).toBeInTheDocument();
		expect(screen.getByRole('textbox')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
	});

	it('proceeds to the second step on form submission', async () => {
		render(
			<MemoryRouter>
				<QuestionPage />
			</MemoryRouter>
		);

		const input = screen.getByRole('textbox');
		const submitButton = screen.getByRole('button', { name: /submit/i });

		fireEvent.change(input, { target: { value: 'I had a hard day at work' } });
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(
				screen.getByText(/What would you like to feel from this?/i)
			).toBeInTheDocument();
		});

		expect(
			screen.getByText(/e.g. I want to feel more relaxed/i)
		).toBeInTheDocument();
	});

	it('navigates to the callback page with correct state after second step', async () => {
		const mockNavigate = vi.fn();
		useNavigate.mockReturnValue(mockNavigate);

		render(
			<MemoryRouter>
				<QuestionPage />
			</MemoryRouter>
		);

		const input = screen.getByRole('textbox');
		const submitButton = screen.getByRole('button', { name: /submit/i });

		fireEvent.change(input, { target: { value: 'I had a hard day at work' } });
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(
				screen.getByText(/What would you like to feel from this?/i)
			).toBeInTheDocument();
		});

		fireEvent.change(input, {
			target: { value: 'I want to feel more relaxed' },
		});
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(mockNavigate).toHaveBeenCalledWith('/entries/callback', {
				state: {
					situation: 'I had a hard day at work',
					emotion: 'I want to feel more relaxed',
				},
			});
		});
	});

	it('resets the state after navigation', async () => {
		const mockNavigate = vi.fn();
		useNavigate.mockReturnValue(mockNavigate);

		render(
			<MemoryRouter>
				<QuestionPage />
			</MemoryRouter>
		);

		const input = screen.getByRole('textbox');
		const submitButton = screen.getByRole('button', { name: /submit/i });

		fireEvent.change(input, { target: { value: 'I had a hard day at work' } });
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(
				screen.getByText(/What would you like to feel from this?/i)
			).toBeInTheDocument();
		});

		fireEvent.change(input, {
			target: { value: 'I want to feel more relaxed' },
		});
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(mockNavigate).toHaveBeenCalledWith('/entries/callback', {
				state: {
					situation: 'I had a hard day at work',
					emotion: 'I want to feel more relaxed',
				},
			});
		});

		expect(input).toHaveValue('');
	});
});
