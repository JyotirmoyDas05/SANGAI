import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout/Layout';

// Pages
import IntroPage from './pages/IntroPage/IntroPage';
import ExplorePage from './pages/ExplorePage/ExplorePage';
import SearchPage from './pages/SearchPage/SearchPage';
import DestinationPage from './pages/DestinationPage/DestinationPage';
import MockDestinationPage from './pages/DestinationDetailsPage/MockDestinationPage';
import NortheastPage from './pages/NortheastPage/NortheastPage';
import RegionPage from './pages/RegionPage/RegionPage';

// Views (reused across pages)
import DestinationsView from './pages/ExplorePage/views/DestinationsView';
import EssentialsView from './pages/ExplorePage/views/EssentialsView';
import FestivalsView from './pages/ExplorePage/views/FestivalsView';

/**
 * SANGAI Route Configuration
 * 
 * Updated navigation flow:
 * - /explore → Map-only page with Explore button
 * - /northeast → Northeast region page with subpages
 * - /:region → Dynamic state/district page with subpages
 */
export const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            // Intro Page (Landing)
            {
                index: true,
                element: <IntroPage />,
            },

            // Explore Page (Map Only)
            {
                path: 'explore',
                element: <ExplorePage />,
            },

            // Search Page
            {
                path: 'search',
                element: <SearchPage />,
            },

            // Individual Destination Page
            {
                path: 'destination/:id',
                element: <DestinationPage />,
            },

            // Northeast Region Page
            {
                path: 'northeast',
                element: <NortheastPage />,
                children: [
                    {
                        path: 'destinations',
                        element: <DestinationsView />,
                    },
                    {
                        path: 'essentials',
                        element: <EssentialsView />,
                    },
                    {
                        path: 'festivals',
                        element: <FestivalsView />,
                    },
                ],
            },

            // Dynamic Region Page (states and districts)
            // e.g., /manipur, /imphal_west
            {
                path: ':region',
                element: <RegionPage />,
                children: [
                    {
                        path: 'destinations',
                        element: <DestinationsView />,
                    },
                    {
                        path: 'essentials',
                        element: <EssentialsView />,
                    },
                    {
                        path: 'festivals',
                        element: <FestivalsView />,
                    },
                ],
            },
        ],
    },
    {
        path: '/mock-destination/:id',
        element: <MockDestinationPage />,
    },
]);
