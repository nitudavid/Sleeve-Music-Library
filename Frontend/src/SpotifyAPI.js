import axios from 'axios';
import { Buffer } from 'buffer';

const CLIENT_ID = 'placeholder';
const CLIENT_SECRET = 'placeholder';
const BASE_URL = 'https://api.spotify.com/v1';

let accessToken = '';
let tokenExpirationTime = 0;

const getAccessToken = async () => {
    const tokenUrl = 'https://accounts.spotify.com/api/token';
    const data = {
        grant_type: 'client_credentials',
    };

    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64'),
    };

    try {
        const response = await axios.post(tokenUrl, new URLSearchParams(data).toString(), { headers });
        accessToken = response.data.access_token;
        tokenExpirationTime = Date.now() + response.data.expires_in * 1000; // Calculate token expiration time
        return accessToken;
    } catch (error) {
        console.error('Error fetching access token:', error);
        throw error;
    }
};

// Function to check if the token is expired and refresh it if necessary
const checkAndRefreshToken = async () => {
    if (!accessToken || Date.now() >= tokenExpirationTime) {
        await getAccessToken();
    }
};

// API instance
const spotifyApi = axios.create({
    baseURL: BASE_URL,
});

spotifyApi.interceptors.request.use(
    async (config) => {
        await checkAndRefreshToken();
        config.headers.Authorization = `Bearer ${accessToken}`;
        return config;
    },
    (error) => Promise.reject(error)
);

// Function to search for artists
export const searchArtists = async (artistName) => {
    try {
        const response = await spotifyApi.get('/search', {
            params: {
                q: artistName,
                type: 'artist',
                market: 'US',
            },
        });
        return response.data.artists.items;
    } catch (error) {
        console.error('Error fetching artists from Spotify API:', error);
        throw error;
    }
};

// Function to search for albums
export const searchAlbums = async (albumName) => {
    try {
        const response = await spotifyApi.get('/search', {
            params: {
                q: albumName,
                type: 'album',
                market: 'US',
            },
        });
        return response.data.albums.items;
    } catch (error) {
        console.error('Error fetching albums from Spotify API:', error);
        throw error;
    }
};

export const getArtistDetails = async (artistID) => {
    try {
        const response = await spotifyApi.get(`/artists/${artistID}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching artist details from Spotify API:', error);
        throw error;
    }
};

export const getArtistAlbums = async (artistID) => {
    try {
        const response = await spotifyApi.get(`/artists/${artistID}/albums`);
        return response.data.items;
    } catch (error) {
        console.error('Error fetching artist details from Spotify API:', error);
        throw error;
    }
};

export const getAlbumDetails = async (albumID) => {
    try {
        const response = await spotifyApi.get(`/albums/${albumID}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching album details from Spotify API:', error);
        throw error;
    }
};
