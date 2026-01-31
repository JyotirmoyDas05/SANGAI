/**
 * Audio Mapping Configuration
 * Maps region/state slugs to their background audio track URLs.
 * 
 * Note: These are currently placeholder URLs. Replace with actual asset paths.
 */

import assamTheme from '../assets/music/assam_theme.mpeg';
import meghalayaTheme from '../assets/music/meghalaya_theme.m4a';
import manipurTheme from '../assets/music/manipur_theme.mp3';
import nagalandTheme from '../assets/music/nagaland_theme.mp3';

const PLACEHOLDER_SONG = 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3';

export const REGION_AUDIO = {
    // Northeast Region (Overview)
    'northeast': PLACEHOLDER_SONG,

    // States
    'arunachal_pradesh': PLACEHOLDER_SONG,
    'assam': assamTheme,
    'manipur': manipurTheme,
    'meghalaya': meghalayaTheme,
    'mizoram': PLACEHOLDER_SONG,
    'nagaland': nagalandTheme,
    'sikkim': PLACEHOLDER_SONG,
    'tripura': PLACEHOLDER_SONG
};

/**
 * Helper to get audio for a potentially nested district
 * @param {string} slug - The current page slug (state or district)
 * @param {string} parentState - (Optional) The parent state slug if this is a district
 */
export function getAudioForRegion(slug, parentState = null) {
    if (REGION_AUDIO[slug]) {
        return REGION_AUDIO[slug];
    }

    if (parentState && REGION_AUDIO[parentState]) {
        return REGION_AUDIO[parentState];
    }

    // Default to Northeast theme if nothing else matches
    return REGION_AUDIO['northeast'];
}
