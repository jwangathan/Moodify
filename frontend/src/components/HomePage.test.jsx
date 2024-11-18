import { fireEvent, render, screen } from '@testing-library/react';
import HomePage from './HomePage';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../reducers/authReducer';
import { afterEach, describe, expect, it } from 'vitest';

const renderWithStore = (ui, { preloadedState } = {}) => {
	const store = configureStore({
		reducer: { auth: authReducer },
		preloadedState,
	});

	return render(<Provider store={store}>{ui}</Provider>);
};

afterEach(() => {
	global.open = window.open;
});

describe('HomePage', () => {
	it('renders user-specific content when user is logged in', () => {
		renderWithStore(<HomePage />, {
			preloadedState: {
				auth: {
					user: {
						user: {
							displayName: 'Test User',
							profileImage: 'https://example.com/profile.jpg',
						},
						topArtists: [],
						topGenres: [],
						topTracks: [],
					},
					loading: false,
				},
			},
		});
		expect(screen.getByAltText('Add a profile image!')).toBeInTheDocument();
		expect(screen.getByAltText('Add a profile image!')).toHaveAttribute(
			'src',
			'https://example.com/profile.jpg'
		);

		expect(screen.getByText('Test User')).toBeInTheDocument();
	});

	it('renders top items list when data is available', () => {
		renderWithStore(<HomePage />, {
			preloadedState: {
				auth: {
					user: {
						user: {
							displayName: 'Test User',
							profileImage: 'https://example.com/profile.jpg',
						},
						topArtists: [
							{
								id: '1',
								name: 'Artist 1',
								url: 'https://artist1.com',
							},
							{
								id: '2',
								name: 'Artist 2',
								url: 'https://artist2.com',
							},
						],
						topGenres: ['Genre 1', 'Genre 2'],
						topTracks: [
							{
								id: '1',
								name: 'Track 1',
								artists: ['Artist 1', 'Artist 2'],
								url: 'https://track1.com',
							},
							{
								id: '2',
								name: 'Track 2',
								artists: ['Artist 3', 'Artist 4'],
								url: 'https://track2.com',
							},
						],
					},
				},
			},
		});

		expect(screen.getByText('Top Artists (Past 6 months)')).toBeInTheDocument();
		expect(screen.getByText('Artist 1')).toBeInTheDocument();
		expect(screen.getByText('Artist 2')).toBeInTheDocument();

		expect(screen.getByText('Top Genres (Past 6 months)')).toBeInTheDocument();
		expect(screen.getByText('Genre 1')).toBeInTheDocument();
		expect(screen.getByText('Genre 2')).toBeInTheDocument();

		expect(screen.getByText('Top Tracks (Past 6 months)')).toBeInTheDocument();
		expect(
			screen.getByText('Track 1 - Artist 1, Artist 2')
		).toBeInTheDocument();
		expect(
			screen.getByText('Track 2 - Artist 3, Artist 4')
		).toBeInTheDocument();
	});

	it('redirects to the artist url when clicked', () => {
		const mockOpen = vi.fn();
		global.open = mockOpen;

		renderWithStore(<HomePage />, {
			preloadedState: {
				auth: {
					user: {
						user: {
							displayName: 'Test User',
							profileImage: 'https://example.com/profile.jpg',
						},
						topArtists: [
							{
								id: '1',
								name: 'Artist 1',
								url: 'https://artist1.com',
							},
						],
						topGenres: [],
						topTracks: [],
					},
				},
			},
		});

		const artistLink = screen.getByText('Artist 1');
		expect(artistLink).toBeInTheDocument();
		fireEvent.click(artistLink);
		expect(mockOpen).toHaveBeenCalledWith('https://artist1.com', '_blank');
	});

	it('redirects to the track url when clicked', () => {
		const mockOpen = vi.fn();
		global.open = mockOpen;

		renderWithStore(<HomePage />, {
			preloadedState: {
				auth: {
					user: {
						user: {
							displayName: 'Test User',
							profileImage: 'https://example.com/profile.jpg',
						},
						topArtists: [],
						topGenres: [],
						topTracks: [
							{
								id: '1',
								name: 'Track 1',
								artists: ['Artist 1'],
								url: 'https://track1.com',
							},
						],
					},
				},
			},
		});

		const trackLink = screen.getByText('Track 1 - Artist 1');
		expect(trackLink).toBeInTheDocument();
		fireEvent.click(trackLink);
		expect(mockOpen).toHaveBeenCalledWith('https://track1.com', '_blank');
	});

	it('renders a message when no top data is available', () => {
		renderWithStore(<HomePage />, {
			preloadedState: {
				auth: {
					user: {
						user: {
							displayName: 'Test User',
							profileImage: 'https://example.com/profile.jpg',
						},
						topArtists: [],
						topGenres: [],
						topTracks: [],
					},
				},
			},
		});

		expect(
			screen.getByText('Listen to some songs to find your top artists!')
		).toBeInTheDocument();
		expect(
			screen.getByText('Listen to some songs to find your top genres!')
		).toBeInTheDocument();
		expect(
			screen.getByText('Listen to some songs to find your top tracks!')
		).toBeInTheDocument();
	});

	it('does not render anything if user is not logged in', () => {
		renderWithStore(<HomePage />, {
			preloadedState: {
				auth: {
					user: null,
				},
			},
		});

		expect(
			screen.queryByAltText('Add a profile image!')
		).not.toBeInTheDocument();
		expect(screen.queryByText('Test User')).not.toBeInTheDocument();
		expect(
			screen.queryByText('Top Artists (Past 6 months)')
		).not.toBeInTheDocument();
		expect(
			screen.queryByText('Top Genres (Past 6 months)')
		).not.toBeInTheDocument();
		expect(
			screen.queryByText('Top Tracks (Past 6 months)')
		).not.toBeInTheDocument();
	});
});
