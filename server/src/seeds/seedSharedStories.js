/**
 * Seed Script: Add Shared Story content for all Northeast states
 * Run with: node server/src/seeds/seedSharedStories.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

const sharedStories = {
    manipur: {
        title: 'A Story of Enchanted Waters',
        paragraphs: [
            'In the heart of this emerald valley, where the Loktak floating islands drift like dreams upon still water, a civilization learned to live between earth and sky.',
            'Here, polo was not merely a sport but a conversation between rider and horse, a dance first witnessed when kings celebrated love. The ancient texts speak of Kangleipak, land of the Meiteis, where warriors wore silk and gods blessed the playing fields.',
            'The jewels that gave this land its name were never just gems, but the thousand shades of green that paint its hills, the silver of its lakes at dawn, and the gold of its classical dancers moving through temple courtyards.',
            'Today, as fishermen glide across phumdis in circular boats and artists weave stories into fabric, Manipur remains what it has always been, a place where culture flows like water, finding its way through every aspect of life.'
        ],
        tone: 'philosophical'
    },
    assam: {
        title: 'A Story of the Mighty River',
        paragraphs: [
            'Long before the Himalayas rose, the Brahmaputra was already ancient, a river so vast it carries the sediments of continents, so wild it remakes its course each monsoon, so sacred it is called the son of Brahma.',
            'On its banks, a culture emerged that understood abundance. The Ahoms ruled for six centuries, leaving behind a legacy of resilience. When the morning mist rises over endless tea gardens, it carries the echoes of a thousand Bihu songs celebrating the eternal cycle of sowing and harvest.',
            'In Kaziranga tall grass, the one-horned rhino, survivor of epochs, moves with the same unhurried dignity as the river itself. This is a land where nature and civilization learned to dance together, where silk is spun from the wild and every festival is a thanksgiving.',
            'Assam does not merely occupy the Brahmaputra valley; it has become inseparable from the river rhythm, flooding, receding, renewing, and flowering again and again.'
        ],
        tone: 'philosophical'
    },
    meghalaya: {
        title: 'A Story of Living Roots',
        paragraphs: [
            'In the abode of clouds, where monsoons arrive like returning gods and children grow up knowing every shade of rain, people learned a different kind of patience, the patience to grow bridges from living trees.',
            'These root bridges are not just engineering marvels; they are lessons in collaboration between human will and nature time. Planted by grandfathers, crossed by grandchildren, they grow stronger with each passing generation.',
            'Here, in one of Earth last matrilineal societies, lineage flows through mothers, names pass through daughters, and the youngest inherits not just property but responsibility. The mountains themselves seem feminine, rolling, nurturing, holding the clouds close.',
            'When Cherrapunji waterfalls thunder and Shillong pines sway in Scottish mist, Meghalaya whispers its secret: true strength lies not in conquering nature, but in becoming one with it.'
        ],
        tone: 'philosophical'
    },
    nagaland: {
        title: 'A Story of Transformation',
        paragraphs: [
            'The mountains of Nagaland have witnessed an extraordinary journey, from headhunters to hymn singers, from warriors to peacemakers, from isolation to celebration. This is not a story of loss but of evolution.',
            'Once, young men earned their identity through courage in battle, their achievements inked permanently upon their faces. Today, the Hornbill Festival gathers all seventeen tribes not as rivals but as one family, their ancient dances now performed in friendship rather than rivalry.',
            'At Kisama Heritage Village, the morung, once a warrior training ground, has become a cultural archive. The hornbill feathers in a dancer headdress carry the same significance they always did: grace, integrity, and connection to the forest.',
            'Nagaland transformation reminds us that traditions need not be frozen in time. They can grow, adapt, and become bridges between who we were and who we choose to become.'
        ],
        tone: 'philosophical'
    },
    'arunachal-pradesh': {
        title: 'A Story of First Light',
        paragraphs: [
            'When dawn breaks over India, it touches Arunachal Pradesh first, the land of the rising sun, where twenty-six tribes have preserved memories older than written history, and monasteries perch on heights that challenge both body and belief.',
            'At Tawang, the second-largest monastery in the world rises above the clouds, its 700 monks continuing a tradition of learning that has flowed from Tibet for centuries. Yet in the same land, animist tribes still speak to rivers and mountains as their ancestors did.',
            'This is a place of extraordinary diversity, Monpa Buddhists, Nyishi warriors, Apatani valley farmers, each maintaining distinct languages, customs, and cosmologies. They share only geography and a respect for the land that sustains them.',
            'In Arunachal uncharted valleys, where rare orchids bloom and rivers still run wild, India stores its oldest mysteries and its newest beginnings, a reminder that the deepest knowledge often dwells in the places hardest to reach.'
        ],
        tone: 'philosophical'
    },
    mizoram: {
        title: 'A Story of Blue Mountains',
        paragraphs: [
            'There is a reason Mizoram is called the land of the blue mountain, and it is more than the hue of distant peaks seen through morning mist. It is a quality of spirit, serene, musical, unyielding.',
            'The Mizo people trace their origin to Chhinlung, a mythical cave from which they emerged into light. Perhaps this memory of shared origin explains their fierce egalitarianism, their tradition of Tlawmngaina, a code demanding selflessness, hospitality, and grace under pressure.',
            'When the Cheraw dancers leap between bamboo poles, their rhythm is the heartbeat of a culture that has turned challenge into art. The bamboo that once sheltered, fed, and armed them now celebrates them.',
            'Modern Mizoram, peaceful, literate, devout, bears little resemblance to the insurgent past. Yet the transformation holds no contradiction: a people who emerged from darkness know the value of light.'
        ],
        tone: 'philosophical'
    },
    tripura: {
        title: 'A Story of Enduring Kingdoms',
        paragraphs: [
            'For over five hundred years, the Manikya kings ruled from these hills, one of the longest dynastic lines in Indian history. Their palaces still stand: Ujjayanta in the capital, Neermahal rising from lake waters like a royal dream.',
            'But Tripura story is older than its kings. The Tripura Sundari Temple sits where the goddess foot touched earth, one of fifty-one sacred sites scattered across the subcontinent. Pilgrims have climbed to Matabari for centuries, seeking the blessing of the Mother.',
            'Bamboo grows everywhere here, in forests, in markets, in the hands of craftsmen who weave it into art. It shelters homes, becomes furniture, transforms into instruments. No material better represents Tripura resourcefulness.',
            'Today, though the kings are gone and traditions evolve, Tripura maintains its essential character: spiritual but practical, tribal and cosmopolitan, ancient in memory but ever adapting.'
        ],
        tone: 'philosophical'
    },
    sikkim: {
        title: 'A Story of Sacred Heights',
        paragraphs: [
            'Under the watchful presence of Kanchenjunga, guardian deity, treasure house, sacred peak, Sikkim has cultivated a relationship with its land that the modern world is only beginning to understand.',
            'When Guru Rinpoche blessed this kingdom in the eighth century, he is said to have hidden treasures throughout the land, not gold or gems, but spiritual teachings to be discovered when humanity needed them most. Perhaps Sikkim recent transformation into India first fully organic state is such a revealing.',
            'In over 200 monasteries, prayers wheel continuously. On terraced farms, crops grow without chemicals. In alpine meadows, rare flowers bloom unseen by any but the most determined seekers.',
            'Sikkim reminds us that the highest achievements are not always the most visible. Sometimes, true progress means learning again what our ancestors knew: that the mountain is sacred, the soil is alive, and we are merely guests in a world far older than ourselves.'
        ],
        tone: 'philosophical'
    }
};

async function seedSharedStories() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected successfully!\n');

        const State = mongoose.model('State', new mongoose.Schema({}, { strict: false }));

        for (const [slug, story] of Object.entries(sharedStories)) {
            const result = await State.updateOne(
                { slug },
                { $set: { sharedStory: story } }
            );

            if (result.matchedCount > 0) {
                console.log(`Updated ${slug}: "${story.title}"`);
            } else {
                console.log(`State not found: ${slug}`);
            }
        }

        console.log('\nShared stories seeded successfully!');
    } catch (error) {
        console.error('Error seeding shared stories:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

seedSharedStories();
