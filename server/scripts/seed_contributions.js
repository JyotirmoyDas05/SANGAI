import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Region from '../src/models/Region.js';
import State from '../src/models/State.js';
import connectDB from '../src/config/database.js';

// Load environment variables from current directory (server/)
dotenv.config({ path: '.env' });

// --- SEED DATA COPY ---
// (Copied from src/data/contributions.js to ensure self-contained execution)
const NORTHEAST_CONTRIBUTIONS = [
    {
        icon: 'eco',
        title: 'A Living Laboratory',
        description: "Home to the world's wettest place, ancient forests, and species found nowhere else on Earth.",
        image: {
            url: 'https://images.unsplash.com/photo-1596886472605-2244f0ce63a8?w=800',
            caption: 'Northeast Biodiversity'
        }
    },
    {
        icon: 'psychology',
        title: 'Indigenous Wisdom',
        description: 'Sustainable farming, natural medicine, and conservation practices refined over generations.',
        image: {
            url: 'https://images.unsplash.com/photo-1605648911000-848e02930264?w=800',
            caption: 'Tribal Elder'
        }
    },
    {
        icon: 'agriculture',
        title: 'Organic Heritage',
        description: "From Assam tea to Manipur's black rice, agriculture here is traditionally organic and biodiverse.",
        image: {
            url: 'https://images.unsplash.com/photo-1582531029528-eb1c27b6aa61?w=800',
            caption: 'Tea Gardens'
        }
    },
    {
        icon: 'brush',
        title: 'Handloom Legacy',
        description: "Each state's weavers create textiles that are wearable art, recognized globally for their craftsmanship.",
        image: {
            url: 'https://images.unsplash.com/photo-1628081699042-886ec0b2b8cc?w=800',
            caption: 'Handloom Weaving'
        }
    }
];

const STATE_CONTRIBUTIONS = {
    'arunachal_pradesh': [
        {
            icon: 'local_florist',
            title: 'Orchid Paradise',
            description: "Home to over 600 species of orchids, turning the state's forests into a botanical treasure.",
            image: { url: 'https://images.unsplash.com/photo-1566723224361-cc0a6a57088b?w=800', caption: 'Rare Orchids' }
        },
        {
            icon: 'security',
            title: 'The Eastern Sentinel',
            description: "Standing as the guardian of India's sunrise border, bridging the subcontinent with East Asia.",
            image: { url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', caption: 'Border Mountains' }
        },
        {
            icon: 'groups',
            title: 'Tribal Democracy',
            description: 'The Kebang system showcases deeply rooted democratic self-governance traditions.',
            image: { url: 'https://images.unsplash.com/photo-1544733422-251e532ca775?w=800', caption: 'Tribal Council' }
        },
        {
            icon: 'energy_savings_leaf',
            title: "India's Powerhouse",
            description: "With immense hydroelectric potential, it promises to energize the nation's future.",
            image: { url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800', caption: 'Mountain River' }
        }
    ],
    'assam': [
        {
            icon: 'oil_barrel',
            title: 'Liquid Gold',
            description: "Birthplace of India's oil industry, fueling development for over a century.",
            image: { url: 'https://images.unsplash.com/photo-1518182170546-0766cc651a2d?w=800', caption: 'Oil Digboi' }
        },
        {
            icon: 'local_cafe',
            title: 'The Tea Garden',
            description: "Producing half of India's tea, Assam wakes up the world with its bold brew.",
            image: { url: 'https://images.unsplash.com/photo-1598555813876-b6d3763f350c?w=800', caption: 'Assam Tea' }
        },
        {
            icon: 'pets',
            title: 'Rhino Sanctuary',
            description: 'A global conservation success story, saving the One-Horned Rhino from extinction.',
            image: { url: 'https://images.unsplash.com/photo-1535940426027-6f8d070b4be7?w=800', caption: 'One Horned Rhino' }
        },
        {
            icon: 'checkroom',
            title: 'Golden Silk',
            description: 'The exclusive home of Muga silk, a fabric that outlives its wearer.',
            image: { url: 'https://images.unsplash.com/photo-1605367031976-599381676df4?w=800', caption: 'Assam Silk' }
        }
    ],
    'manipur': [
        {
            icon: 'sports_martial_arts',
            title: 'Powerhouse of Champions',
            description: "A tiny state producing a disproportionate number of India's Olympic icons.",
            image: { url: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800', caption: 'Athletes' }
        },
        {
            icon: 'theater_comedy',
            title: 'Classical Grace',
            description: "Gave the world Manipuri Dance (Ras Lila), one of India's classical art forms.",
            image: { url: 'https://images.unsplash.com/photo-1528659578166-5743b0ba16cc?w=800', caption: 'Manipuri Dance' }
        },
        {
            icon: 'sports_score',
            title: 'Birthplace of Polo',
            description: 'Sagol Kangjei, the traditional game here, evolved into the modern game of Polo.',
            image: { url: 'https://images.unsplash.com/photo-1533842852233-d8c36af864c3?w=800', caption: 'Polo' }
        },
        {
            icon: 'bridge',
            title: 'Gateway to the East',
            description: 'Historically and strategically, the bridge connecting the Indian subcontinent to Southeast Asia.',
            image: { url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800', caption: 'Asian Highway' }
        }
    ],
    'meghalaya': [
        {
            icon: 'forest',
            title: 'Living Engineering',
            description: 'The Jingkieng Jri (Living Root Bridges) are bio-engineering marvels distinct to this land.',
            image: { url: 'https://images.unsplash.com/photo-1590053165219-c8872cd92348?w=800', caption: 'Root Bridge' }
        },
        {
            icon: 'family_restroom',
            title: 'Matrilineal Pride',
            description: "One of the world's few societies where lineage and inheritance pass through the mother.",
            image: { url: 'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?w=800', caption: 'Khasi Woman' }
        },
        {
            icon: 'music_note',
            title: 'Rock Capital',
            description: "Shillong's vibrant music scene makes it the undisputed Rock Capital of India.",
            image: { url: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800', caption: 'Concert' }
        },
        {
            icon: 'diamond',
            title: 'Mineral Foundation',
            description: 'Its limestone and coal reserves have historically supported regional infrastructure.',
            image: { url: 'https://images.unsplash.com/photo-1615811361269-6d6360c7f1a5?w=800', caption: 'Caves' }
        }
    ],
    'mizoram': [
        {
            icon: 'handshake',
            title: 'Peace Dividends',
            description: "Transitioning from insurgency to become one of India's most peaceful and stable states.",
            image: { url: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800', caption: 'Peaceful Hills' }
        },
        {
            icon: 'school',
            title: 'Literacy Leaders',
            description: 'Consistently boasting one of the highest literacy rates in the country.',
            image: { url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800', caption: 'Students' }
        },
        {
            icon: 'grass',
            title: 'Bamboo Wealth',
            description: 'With vast bamboo forests, it leads in the sustainable utilization of "Green Gold".',
            image: { url: 'https://images.unsplash.com/photo-1596707328608-591be6708d7c?w=800', caption: 'Bamboo Forest' }
        },
        {
            icon: 'volunteer_activism', // approximation
            title: 'Tlawmngaihna',
            description: 'A unique ethical code of self-sacrifice and community service that defines Mizo life.',
            image: { url: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800', caption: 'Community Service' }
        }
    ],
    'nagaland': [
        {
            icon: 'celebration',
            title: 'Festival of Festivals',
            description: 'The Hornbill Festival has put Northeast tribal culture on the global tourism map.',
            image: { url: 'https://images.unsplash.com/photo-1605367031737-29177114b0b1?w=800', caption: 'Hornbill Festival' }
        },
        {
            icon: 'restaurant',
            title: 'Fiery Legacy',
            description: "Home to the Raja Mircha (King Chili), once the world's hottest pepper.",
            image: { url: 'https://images.unsplash.com/photo-1615484477778-ca3b77940c25?w=800', caption: 'Chili' }
        },
        {
            icon: 'shield',
            title: 'Warrior Defense',
            description: 'Where the Battle of Kohima halted the Japanese advance in WWII, changing history.',
            image: { url: 'https://images.unsplash.com/photo-1591893325608-8f5539d0f799?w=800', caption: 'War Cemetery' }
        },
        {
            icon: 'people',
            title: 'Communitisation',
            description: 'A pioneer in handing over management of public services to local communities.',
            image: { url: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=800', caption: 'Village Council' }
        }
    ],
    'sikkim': [
        {
            icon: 'spa',
            title: '100% Organic',
            description: "The world's first fully organic state, setting a global benchmark for sustainable farming.",
            image: { url: 'https://images.unsplash.com/photo-1621961458348-f013d182b6a2?w=800', caption: 'Organic Farm' }
        },
        {
            icon: 'medication',
            title: 'Medicinal Hub',
            description: "A treasury of Himalayan healing herbs, fueling India's traditional medicine.",
            image: { url: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800', caption: 'Medicinal Plants' }
        },
        {
            icon: 'recycling',
            title: 'Green Governance',
            description: 'Strict environmental laws banning plastic and pesticides protect its fragile ecology.',
            image: { url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800', caption: 'Clean Mountains' }
        },
        {
            icon: 'temple_buddhist',
            title: 'Peace & Harmony',
            description: 'A model of peaceful coexistence between Lepcha, Bhutia, and Nepali communities.',
            image: { url: 'https://images.unsplash.com/photo-1621245035252-094770135d96?w=800', caption: 'Monastery' }
        }
    ],
    'tripura': [
        {
            icon: 'tire_repair', // rubber
            title: 'Rubber Revolution',
            description: 'The second largest rubber producer in India, driving industrial growth.',
            image: { url: 'https://images.unsplash.com/photo-1598335624134-2e6f21223a8c?w=800', caption: 'Rubber Plantation' }
        },
        {
            icon: 'gas_meter',
            title: 'Clean Energy',
            description: 'A power surplus state rich in natural gas, lighting up neighbors.',
            image: { url: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=800', caption: 'Energy Plant' }
        },
        {
            icon: 'castle',
            title: 'Royal History',
            description: 'The Manikya dynasty ruled for centuries, leaving a legacy of palaces and temples.',
            image: { url: 'https://images.unsplash.com/photo-1631862521996-2244f0ce63a8?w=800', caption: 'Ujjayanta Palace' } // generic placeholder
        },
        {
            icon: 'architecture',
            title: 'Bamboo Architects',
            description: 'Masters of bamboo craft, creating everything from houses to exquisite art.',
            image: { url: 'https://images.unsplash.com/photo-1634626084022-de1610996884?w=800', caption: 'Bamboo Craft' }
        }
    ]
};

const mapToModel = (themes) => {
    return themes.map(theme => ({
        icon: theme.icon,
        title: theme.title,
        description: theme.description,
        image: theme.image
    }));
};

const seedContributions = async () => {
    try {
        await connectDB();
        console.log('Connected to database...');

        // 1. Seed Northeast Region
        console.log('Updating Northeast Region...');
        await Region.findOneAndUpdate(
            { slug: 'northeast' },
            { $set: { contributions: mapToModel(NORTHEAST_CONTRIBUTIONS) } },
            { new: true, upsert: true }
        );
        console.log('✅ Northeast region updated');

        // 2. Seed States
        console.log('Updating States...');
        const stateKeys = Object.keys(STATE_CONTRIBUTIONS);

        for (const slug of stateKeys) {
            // Try matching slug or code (if needed)
            // Our slugs usually match keys if keys are efficient
            const updatedState = await State.findOneAndUpdate(
                { slug: slug },
                { $set: { contributions: mapToModel(STATE_CONTRIBUTIONS[slug]) } },
                { new: true }
            );

            if (updatedState) {
                console.log(`✅ State updated: ${slug}`);
            } else {
                console.log(`❌ State not found: ${slug}`);
                // Try alternate slug format if needed (e.g. arunachal-pradesh vs arunachal_pradesh)
                const altSlug = slug.replace('_', '-');
                const retryState = await State.findOneAndUpdate(
                    { slug: altSlug },
                    { $set: { contributions: mapToModel(STATE_CONTRIBUTIONS[slug]) } },
                    { new: true }
                );
                if (retryState) console.log(`   ✅ Retry success with slug: ${altSlug}`);
            }
        }

        console.log('Contributions seeding completed!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding contributions:', error);
        process.exit(1);
    }
};

seedContributions();
