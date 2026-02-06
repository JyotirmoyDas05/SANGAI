import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Region from '../src/models/Region.js';
import State from '../src/models/State.js';
import connectDB from '../src/config/database.js';

// Load environment variables from parent directory
dotenv.config({ path: '.env' });

// --- SEED DATA COPY ---
// (Copied from src/data/definingThemes.js to ensure self-contained execution)

const NORTHEAST_THEMES = [
    {
        icon: 'terrain',
        title: 'Ancient Landscapes',
        description: 'From snow-capped peaks to living root bridges, hills and valleys that have shaped life for millennia.',
        image: { url: '', caption: 'Misty hills of Northeast India' }
    },
    {
        icon: 'diversity_3',
        title: 'Cultural Mosaic',
        description: 'Over 200 tribes, each with distinct languages, beliefs, and traditions woven into daily life.',
        image: { url: '', caption: 'Tribal diversity of Northeast' }
    },
    {
        icon: 'explore',
        title: 'Borderland Identity',
        description: 'A region where ancient trade routes meet, creating unique exchanges and resilient communities.',
        image: { url: '', caption: 'Historic trade routes' }
    },
    {
        icon: 'eco',
        title: 'Living Biodiversity',
        description: "One of the world's biodiversity hotspots, where communities have preserved nature for generations.",
        image: { url: '', caption: 'Rich biodiversity' }
    }
];

const ARUNACHAL_THEMES = [
    {
        icon: 'wb_twilight',
        title: 'Land of Dawn-Lit Mountains',
        description: 'The first place in India to greet the rising sun, where misty peaks glow golden at daybreak.',
        image: { url: '', caption: 'Sunrise over Arunachal mountains' }
    },
    {
        icon: 'temple_buddhist',
        title: 'Tawang Monastery',
        description: 'Home to one of Asia\'s largest Buddhist monasteries, a spiritual beacon of the Monpa people since the 17th century.',
        image: { url: '', caption: 'Tawang Monastery' }
    },
    {
        icon: 'local_florist',
        title: 'Orchid Paradise',
        description: 'Over 600 orchid species flourish here, integrated into rituals, medicine, and local crafts.',
        image: { url: '', caption: 'Orchids of Arunachal' }
    },
    {
        icon: 'groups',
        title: 'Tribal Self-Governance',
        description: 'Over 25 major tribes with unique democratic councils like the Adi Kebang and Apatani Buliang that govern community life.',
        image: { url: '', caption: 'Tribal council meeting' }
    }
];

const ASSAM_THEMES = [
    {
        icon: 'local_cafe',
        title: 'Tea Heritage',
        description: 'Since 1823, Assam has produced the world\'s boldest teas—a heritage that defines the state\'s identity and economy.',
        image: { url: '', caption: 'Tea gardens of Assam' }
    },
    {
        icon: 'water',
        title: 'Brahmaputra River',
        description: 'The mighty masculine river that is the lifeline of the region, nurturing rice, tea, and sacred traditions.',
        image: { url: '', caption: 'Brahmaputra River' }
    },
    {
        icon: 'pets',
        title: 'One-Horned Rhino',
        description: 'Kaziranga protects two-thirds of the world\'s surviving rhinos—a symbol of Assamese pride and conservation success.',
        image: { url: '', caption: 'Rhino at Kaziranga' }
    },
    {
        icon: 'checkroom',
        title: 'Golden Muga Silk',
        description: 'The only place on Earth producing golden Muga silk—an ancient weaving tradition passed through generations.',
        image: { url: '', caption: 'Muga silk weaving' }
    }
];

const MANIPUR_THEMES = [
    {
        icon: 'water',
        title: 'Loktak Lake',
        description: 'South Asia\'s largest freshwater lake with floating phumdis, a mirror reflecting Manipuri civilization.',
        image: { url: '', caption: 'Loktak Lake' }
    },
    {
        icon: 'cruelty_free',
        title: 'The Dancing Deer',
        description: 'The endangered Sangai deer survives only here, celebrated as the bridge between humans and nature.',
        image: { url: '', caption: 'Sangai deer' }
    },
    {
        icon: 'sports',
        title: 'Birthplace of Polo',
        description: 'Modern polo began here as Sagol Kangjei, played since 1400 BCE on the world\'s oldest polo ground.',
        image: { url: '', caption: 'Traditional polo' }
    },
    {
        icon: 'theater_comedy',
        title: 'Ras Lila Dance',
        description: 'Classical dance depicting divine love, born from a king\'s vision and performed in temple courtyards.',
        image: { url: '', caption: 'Ras Lila performance' }
    }
];

const MEGHALAYA_THEMES = [
    {
        icon: 'nature',
        title: 'Living Root Bridges',
        description: 'Indigenous engineers grow bridges from rubber tree roots—structures that strengthen with age over centuries.',
        image: { url: '', caption: 'Living root bridge' }
    },
    {
        icon: 'family_restroom',
        title: 'Matrilineal Society',
        description: 'Children take their mother\'s name, daughters inherit property—a rare matrilineal tradition preserved for generations.',
        image: { url: '', caption: 'Khasi matrilineal family' }
    },
    {
        icon: 'landscape',
        title: 'Abode of Caves',
        description: 'Over 1,500 limestone caves including the world\'s longest sandstone cave—an underground wonderland.',
        image: { url: '', caption: 'Cave formations' }
    },
    {
        icon: 'thunderstorm',
        title: 'Wettest Place on Earth',
        description: 'Mawsynram receives nearly 12,000mm of rain annually—the clouds truly call this their abode.',
        image: { url: '', caption: 'Monsoon in Cherrapunji' }
    }
];

const MIZORAM_THEMES = [
    {
        icon: 'forest',
        title: 'Green Gold Kingdom',
        description: 'Lush bamboo forests blanket 95% of the land—the foundation of homes, crafts, music, and even food.',
        image: { url: '', caption: 'Bamboo forests of Mizoram' }
    },
    {
        icon: 'music_note',
        title: 'Cheraw Bamboo Dance',
        description: 'Dancers weave through rhythmic bamboo staves in this ancient 1st century art form.',
        image: { url: '', caption: 'Cheraw dance performance' }
    },
    {
        icon: 'church',
        title: 'Land of the Blue Mountain',
        description: '87% Christian population transformed by missionaries who brought faith, schools, and literacy together.',
        image: { url: '', caption: 'Church in Mizoram' }
    },
    {
        icon: 'volunteer_activism',
        title: 'Tlawmngaihna Spirit',
        description: 'An ethical code of selfless hospitality—guests are honored, strangers are family, kindness is law.',
        image: { url: '', caption: 'Mizo hospitality' }
    }
];

const NAGALAND_THEMES = [
    {
        icon: 'festival',
        title: 'Hornbill Festival',
        description: 'The "Festival of Festivals" where 17 tribes unite each December to celebrate their heritage at Kisama village.',
        image: { url: '', caption: 'Hornbill Festival' }
    },
    {
        icon: 'shield',
        title: 'Warrior Heritage',
        description: 'A fierce legacy of independence where headhunting once proved courage—now transformed into cultural pride.',
        image: { url: '', caption: 'Naga warrior' }
    },
    {
        icon: 'handshake',
        title: 'Morung Tradition',
        description: 'The traditional youth dormitory where boys learned crafts, songs, and the ways of their tribe.',
        image: { url: '', caption: 'Morung building' }
    },
    {
        icon: 'checkroom',
        title: 'Naga Shawls',
        description: 'Each tribe\'s distinct patterns tell stories of status and identity—woven with mithun bulls, elephants, and stars.',
        image: { url: '', caption: 'Naga shawl patterns' }
    }
];

const SIKKIM_THEMES = [
    {
        icon: 'landscape',
        title: 'Sacred Kanchenjunga',
        description: 'The world\'s third-highest peak is worshipped as a guardian deity—climbing from India is forbidden out of reverence.',
        image: { url: '', caption: 'Kanchenjunga mountain' }
    },
    {
        icon: 'temple_buddhist',
        title: 'Buddhist Monasteries',
        description: 'Rumtek and Pemayangtse preserve centuries of Buddhist wisdom in the former Kingdom of the Chogyal.',
        image: { url: '', caption: 'Rumtek Monastery' }
    },
    {
        icon: 'eco',
        title: 'First Organic State',
        description: 'Since 2016, the world\'s first fully organic state—no chemicals, only traditional wisdom and sustainable farming.',
        image: { url: '', caption: 'Organic farms' }
    },
    {
        icon: 'flag',
        title: 'Prayer Flags',
        description: 'Colorful lungta flags flutter everywhere, carrying Buddhist prayers on the wind to spread blessings.',
        image: { url: '', caption: 'Prayer flags' }
    }
];

const TRIPURA_THEMES = [
    {
        icon: 'temple_hindu',
        title: 'Shakti Peetha Temple',
        description: 'The tortoise-shaped Tripura Sundari Temple is one of 51 sacred Shakti Peethas, built in the 16th century.',
        image: { url: '', caption: 'Tripura Sundari Temple' }
    },
    {
        icon: 'account_balance',
        title: 'Ujjayanta Palace',
        description: 'The royal palace named by Tagore—"Rising Sun"—now a museum of Northeast\'s art and heritage.',
        image: { url: '', caption: 'Ujjayanta Palace' }
    },
    {
        icon: 'diversity_2',
        title: 'Nineteen Tribes',
        description: 'From Tripuri royalty to Chakma fishermen, 19 tribes perform unique dances like Goria and Hojagiri.',
        image: { url: '', caption: 'Tribal dance' }
    },
    {
        icon: 'construction',
        title: 'Bamboo Artistry',
        description: 'Master craftspeople weave bamboo so fine it resembles ivory—a tradition honored with national awards.',
        image: { url: '', caption: 'Bamboo crafts' }
    }
];

const THEMES_BY_SLUG = {
    'northeast': NORTHEAST_THEMES,
    'arunachal-pradesh': ARUNACHAL_THEMES,
    'assam': ASSAM_THEMES,
    'manipur': MANIPUR_THEMES,
    'meghalaya': MEGHALAYA_THEMES,
    'mizoram': MIZORAM_THEMES,
    'nagaland': NAGALAND_THEMES,
    'sikkim': SIKKIM_THEMES,
    'tripura': TRIPURA_THEMES
};

// --- END SEED DATA ---

const seedDefiningThemes = async () => {
    try {
        await connectDB();
        console.log('Connected to database...');

        // 1. Update Northeast Region
        console.log('Updating Northeast Region...');
        const updatedRegion = await Region.findOneAndUpdate(
            { slug: 'northeast' },
            { $set: { definingThemes: THEMES_BY_SLUG['northeast'] } },
            { new: true }
        );
        if (updatedRegion) {
            console.log('✅ Northeast region updated');
        } else {
            console.log('❌ Northeast region not found');
        }

        // 2. Update States
        console.log('Updating States...');
        const states = Object.keys(THEMES_BY_SLUG).filter(slug => slug !== 'northeast');

        for (const slug of states) {
            const updatedState = await State.findOneAndUpdate(
                { slug: slug },
                { $set: { definingThemes: THEMES_BY_SLUG[slug] } },
                { new: true }
            );

            if (updatedState) {
                console.log(`✅ State updated: ${slug}`);
            } else {
                console.log(`❌ State not found: ${slug}`);
            }
        }

        console.log('Defining Themes seeding completed!');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding data:', err);
        process.exit(1);
    }
};

seedDefiningThemes();
