import { fireEvent, render, screen } from '@testing-library/react';
import LoginPage from './LoginPage';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { vi } from 'vitest';
import loginService from '../services/auth';
import authReducer from '../reducers/authReducer';

vi.mock('../services/auth', () => ({
	default: {
		login: vi.fn(),
	},
}));

const renderWithStore = (ui, { preloadedState } = {}) => {
	const store = configureStore({
		reducer: { auth: authReducer },
		preloadedState,
	});

	return render(<Provider store={store}>{ui}</Provider>);
};

describe('LoginPage', () => {
	it('renders login button when user is not logged in', async () => {
		renderWithStore(<LoginPage />, {
			preloadedState: { auth: { user: null, loading: false } },
		});

		const loginButton = screen.getByText('Login To Spotify');

		expect(loginButton).toBeInTheDocument();
	});

	it('renders user-specific content when user is logged in', () => {
		renderWithStore(<LoginPage />, {
			preloadedState: {
				auth: { user: { user: { displayName: 'Test User' } }, loading: false },
			},
		});

		const sectionHeading = screen.getByText('How it Works');

		expect(sectionHeading).toBeInTheDocument();
	});

	it('calls loginService.login and redirects when login button is clicked', async () => {
		const mockLoginResponse = 'http://redirect.url';
		loginService.login.mockResolvedValue(mockLoginResponse);

		const originalLocation = window.location;
		delete window.location;
		window.location = { href: '' };

		renderWithStore(<LoginPage />, {
			preloadedState: { auth: { user: null, loading: false } },
		});

		const loginButton = screen.getByText('Login To Spotify');
		await fireEvent.click(loginButton);

		expect(loginService.login).toHaveBeenCalledTimes(1);
		expect(window.location.href).toBe(mockLoginResponse);
		window.location = originalLocation;
	});
});
