import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout/Layout';

// Pages
import IntroPage from './pages/IntroPage/IntroPage';
import ExplorePage from './pages/ExplorePage/ExplorePage';
import SearchPage from './pages/SearchPage/SearchPage';
import DestinationPage from './pages/DestinationPage/DestinationPage';
import MockDestinationPage from './pages/DestinationDetailsPage/MockDestinationPage';
import NortheastPage from './pages/NortheastPage/NortheastPage';
import StatePage from './pages/StatePage/StatePage';
import DistrictPage from './pages/DistrictPage/DistrictPage';
import CulturalPage from './pages/CulturalPage/CulturalPage';
import CulturalDetailView from './pages/CulturalPage/CulturalDetailView';
import FestivalDetailView from './pages/ExplorePage/views/FestivalDetailView';
import HomestayDetailView from './pages/DestinationDetailsPage/HomestayDetailView';
import ShoppingPage from './pages/ShoppingPage/ShoppingPage';
import CollectionPage from './pages/CollectionPage/CollectionPage';
import ProductPage from './pages/ProductPage/ProductPage';

// Views (reused across pages)
import DestinationsView from './pages/ExplorePage/views/DestinationsView';
import EssentialsView from './pages/ExplorePage/views/EssentialsView';
import FestivalsView from './pages/ExplorePage/views/FestivalsView';
// import PlacesView from './pages/ExplorePage/views/Places/PlacesView'; // Removed: use DestinationsView
import HomestaysView from './pages/ExplorePage/views/HomestaysView';
import GuidesView from './pages/ExplorePage/views/GuidesView';
import CMSLayout from './pages/CMS/CMSLayout';
import CMSDashboard from './pages/CMS/CMSDashboard';
import FestivalForm from './pages/CMS/FestivalForm';
import DestinationForm from './pages/CMS/DestinationForm';
import CMSCulturalItemEditor from './pages/CMS/CMSCulturalItemEditor';

/**
 * SANGAI Route Configuration
 * 
 * HIERARCHICAL STRUCTURE:
 * /northeast                              → All NE content
 * /northeast/:stateSlug                   → State page + aggregated content
 * /northeast/:stateSlug/:districtSlug     → District page + specific content
 * 
 * Content views inherit from hierarchy:
 * /northeast/festivals                    → ALL festivals in NE
 * /northeast/manipur/festivals            → Festivals in Manipur (all districts)
 * /northeast/manipur/imphal_west/festivals → Festivals in Imphal West only
 * 
 * SPECIAL ROUTES:
 * /explore   → God route (access everything)
 * /shopping  → Global shopping (accessible from anywhere)
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

            // Explore Page (God Route - access to everything)
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

            // ============================================
            // HIERARCHICAL NORTHEAST ROUTES
            // ============================================
            {
                path: 'northeast',
                element: <NortheastPage />,
                children: [
                    // Region-level views
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
                    {
                        path: 'festivals/:id',
                        element: <FestivalDetailView />,
                    },
                    {
                        path: 'places',
                        element: <DestinationsView />,
                    },
                    {
                        path: 'homestays',
                        element: <HomestaysView />,
                    },
                    {
                        path: 'guides',
                        element: <GuidesView />,
                    },
                    // Culture pages at region level
                    {
                        path: 'culture',
                        element: <CulturalPage />,
                    },
                    {
                        path: 'culture/:category',
                        element: <CulturalPage />,
                    },
                    {
                        path: 'culture/:category/:id',
                        element: <CulturalDetailView />,
                    },

                    // STATE LEVEL: /northeast/:stateSlug
                    {
                        path: ':stateSlug',
                        element: <StatePage />,
                        children: [
                            // State-level views
                            {
                                path: 'festivals',
                                element: <FestivalsView />,
                            },
                            {
                                path: 'festivals/:id',
                                element: <FestivalDetailView />,
                            },
                            {
                                path: 'places',
                                element: <DestinationsView />,
                            },
                            {
                                path: 'homestays',
                                element: <HomestaysView />,
                            },
                            {
                                path: 'guides',
                                element: <GuidesView />,
                            },
                            {
                                path: 'culture',
                                element: <CulturalPage />,
                            },
                            {
                                path: 'culture/:category',
                                element: <CulturalPage />,
                            },
                            {
                                path: 'culture/:category/:id',
                                element: <CulturalDetailView />,
                            },
                            // DISTRICT LEVEL: /northeast/:stateSlug/:districtSlug
                            {
                                path: ':districtSlug',
                                element: <DistrictPage />,
                                children: [
                                    // District-level views
                                    {
                                        path: 'festivals',
                                        element: <FestivalsView />,
                                    },
                                    {
                                        path: 'festivals/:id',
                                        element: <FestivalDetailView />,
                                    },
                                    {
                                        path: 'places',
                                        element: <DestinationsView />,
                                    },
                                    {
                                        path: 'homestays',
                                        element: <HomestaysView />,
                                    },
                                    {
                                        path: 'guides',
                                        element: <GuidesView />,
                                    },
                                    // Destination within district
                                    {
                                        path: 'destination/:id',
                                        element: <MockDestinationPage />,
                                    },
                                    {
                                        path: 'destination/:id/:homestayId',
                                        element: <HomestayDetailView />,
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },

            // ============================================
            // GLOBAL SHOPPING (Standalone)
            // ============================================
            {
                path: 'shopping',
                element: <ShoppingPage />,
            },
            {
                path: 'shopping/collection/:category',
                element: <CollectionPage />,
            },
            {
                path: 'collections/:category',
                element: <CollectionPage />,
            },
            {
                path: 'shopping/:category/:productSlug',
                element: <ProductPage />,
            },
            {
                path: 'collections/:category/:productSlug',
                element: <ProductPage />,
            },
            {
                path: 'collections/:category/products/:productSlug',
                element: <ProductPage />,
            },
        ],
    },
    {
        path: '/dev-cms',
        element: <CMSLayout />,
        children: [
            {
                index: true,
                element: <CMSDashboard />
            },
            {
                path: 'festivals/new',
                element: <FestivalForm />
            },
            {
                path: 'festivals/edit/:id',
                element: <FestivalForm />
            },
            {
                path: 'destinations/new',
                element: <DestinationForm />
            },
            {
                path: 'destinations/edit/:id',
                element: <DestinationForm />
            },
            {
                path: 'cultural-items/new',
                element: <CMSCulturalItemEditor />
            },
            {
                path: 'cultural-items/edit/:id',
                element: <CMSCulturalItemEditor />
            },
        ]
    }
]);

