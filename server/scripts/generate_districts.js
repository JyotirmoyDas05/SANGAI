/**
 * Script to generate complete districts.json from GeoJSON map data
 * Run with: node server/scripts/generate_districts.cjs
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


// State codes mapping
const STATE_CODES = {
    'Arunanchal Pradesh': 'AR',
    'Assam': 'AS',
    'Manipur': 'MN',
    'Meghalaya': 'ML',
    'Mizoram': 'MZ',
    'Nagaland': 'NL',
    'Sikkim': 'SK',
    'Tripura': 'TR'
};

// State full names (corrected spelling)
const STATE_NAMES = {
    'Arunanchal Pradesh': 'Arunachal Pradesh',
    'Assam': 'Assam',
    'Manipur': 'Manipur',
    'Meghalaya': 'Meghalaya',
    'Mizoram': 'Mizoram',
    'Nagaland': 'Nagaland',
    'Sikkim': 'Sikkim',
    'Tripura': 'Tripura'
};

// Cultural data for districts (expand as needed)
const DISTRICT_DATA = {
    // MANIPUR
    'Bishnupur': {
        tagline: 'Land of the Dancing Deer',
        senseOfPlace: 'Where the lake reflects the sky.',
        themes: ['Wetlands', 'Sangai Deer', 'Ancient Temples'],
        knownFor: ['Loktak Lake', 'Red Ware Pottery', 'Moirang Temples', 'Sangai Deer'],
        population: '2.4 Lakhs', area: '496 sq km',
        landscapeType: 'Wetland & Valley'
    },
    'Imphal West': {
        tagline: 'Heart of the Valley',
        senseOfPlace: 'Where history breathes through ancient palace walls.',
        themes: ['Kangla Fort', 'Ima Keithel', 'Thang-Ta'],
        knownFor: ['Kangla Fort', 'Ima Keithel', 'Manipuri Dance', 'Polo Ground'],
        population: '5.2 Lakhs', area: '519 sq km',
        landscapeType: 'Valley & Urban'
    },
    'Imphal East': {
        tagline: 'Eastern Gateway',
        senseOfPlace: 'Where tradition meets modernity.',
        themes: ['Historic Sites', 'Cultural Centers', 'Handloom'],
        knownFor: ['Khwairamband Bazaar', 'War Cemeteries', 'Handloom'],
        population: '4.5 Lakhs', area: '710 sq km',
        landscapeType: 'Valley'
    },
    'Thoubal': {
        tagline: 'Land of Warriors',
        senseOfPlace: 'Where the spirit of resistance lives on.',
        themes: ['Historic Battles', 'Agriculture', 'Handloom'],
        knownFor: ['INA Memorial', 'Waithou Lake', 'Sugarcane'],
        population: '4.2 Lakhs', area: '514 sq km',
        landscapeType: 'Valley'
    },
    'Chandel': {
        tagline: 'Gateway to Myanmar',
        senseOfPlace: 'Where cultures merge at the border.',
        themes: ['Border Trade', 'Tribal Heritage', 'Scenic Hills'],
        knownFor: ['Moreh Border Town', 'Yangoupokpi', 'Tribal Culture'],
        population: '1.4 Lakhs', area: '3,313 sq km',
        landscapeType: 'Hills & Border'
    },
    'Churachandpur': {
        tagline: 'Land of Many Tribes',
        senseOfPlace: 'Where diverse hill tribes create a tapestry of culture.',
        themes: ['Tribal Diversity', 'Christianity', 'Handwoven Textiles'],
        knownFor: ['Tribal Villages', 'Churches', 'Handloom', 'Tipaimukh'],
        population: '2.7 Lakhs', area: '4,570 sq km',
        landscapeType: 'Highland'
    },
    'Senapati': {
        tagline: 'Land of the Maos',
        senseOfPlace: 'Where warrior traditions echo through misty hills.',
        themes: ['Mao Tribe', 'Highland Culture', 'Scenic Beauty'],
        knownFor: ['Makhel Village', 'Mao Gate', 'Yangkhullen'],
        population: '4.5 Lakhs', area: '3,271 sq km',
        landscapeType: 'Highland'
    },
    'Tamenglong': {
        tagline: 'Land of Hornbill',
        senseOfPlace: 'Where the forests whisper ancient secrets.',
        themes: ['Biodiversity', 'Waterfalls', 'Zeme Tribe'],
        knownFor: ['Zeilad Lake', 'Buning Meadow', 'Barak Waterfalls'],
        population: '1.4 Lakhs', area: '4,391 sq km',
        landscapeType: 'Dense Forest'
    },
    'Ukhrul': {
        tagline: 'Land of the Tangkhul',
        senseOfPlace: 'Where Shirui Lily blooms nowhere else on Earth.',
        themes: ['Shirui Lily', 'Tangkhul Culture', 'Pine Forests'],
        knownFor: ['Shirui Kashung Peak', 'Kachou Phung Lake', 'Tangkhul Shawls'],
        population: '1.8 Lakhs', area: '4,544 sq km',
        landscapeType: 'Highland'
    },

    // MEGHALAYA
    'East Khasi Hills': {
        tagline: 'The Abode of Clouds',
        senseOfPlace: 'The misty hills where clouds come home.',
        themes: ['Monsoon Capital', 'Living Root Bridges', 'Rock Capital'],
        knownFor: ['Living Root Bridges', 'Shillong', 'Cherrapunji', 'Khasi Culture'],
        population: '8.2 Lakhs', area: '2,748 sq km',
        landscapeType: 'Plateau & Gorges'
    },
    'West Khasi Hills': {
        tagline: 'Hidden Waterfalls',
        senseOfPlace: 'Where secret cascades await the adventurous.',
        themes: ['Waterfalls', 'Sacred Groves', 'Tribal Markets'],
        knownFor: ['Nohkalikai Falls', 'Mawphanlur', 'Sacred Forests'],
        population: '3.8 Lakhs', area: '5,247 sq km',
        landscapeType: 'Forested Plateau'
    },
    'Jaintia Hills': {
        tagline: 'Land of Mysteries',
        senseOfPlace: 'Where monoliths guard ancient secrets.',
        themes: ['Monoliths', 'Caves', 'Jaintia Tribe'],
        knownFor: ['Nartiang Monoliths', 'Syndai Cave', 'Jaintia Dance'],
        population: '3.9 Lakhs', area: '3,819 sq km',
        landscapeType: 'Plateau & Caves'
    },
    'East Garo Hills': {
        tagline: 'Wild Heartland',
        senseOfPlace: 'Where elephants roam and Wangala drums echo.',
        themes: ['Wildlife', 'Garo Culture', 'Rivers'],
        knownFor: ['Siju Cave', 'Wangala Festival', 'Simsang River'],
        population: '3.2 Lakhs', area: '2,603 sq km',
        landscapeType: 'Hills & Rivers'
    },
    'West Garo Hills': {
        tagline: 'The Sunset Ranges',
        senseOfPlace: 'Where the sun sets over lush green hills.',
        themes: ['Garo Tribe', 'Nokrek Biosphere', 'Citrus Fruits'],
        knownFor: ['Nokrek Peak', 'Tura', 'Oranges', 'Wangala'],
        population: '6.4 Lakhs', area: '3,714 sq km',
        landscapeType: 'Rolling Hills'
    },
    'South Garo Hills': {
        tagline: 'The Frontier',
        senseOfPlace: 'Where Meghalaya meets Bangladesh.',
        themes: ['Border Culture', 'Forest Reserves', 'Rivers'],
        knownFor: ['Baghmara', 'Siju Wildlife', 'Border Trade'],
        population: '1.4 Lakhs', area: '1,850 sq km',
        landscapeType: 'Lowland Forest'
    },
    'Ri Bhoi': {
        tagline: 'The Gateway',
        senseOfPlace: 'Where Meghalaya welcomes the world.',
        themes: ['Gateway District', 'Orchids', 'Waterfalls'],
        knownFor: ['Umiam Lake', 'Orchid Centers', 'Nongpoh'],
        population: '2.6 Lakhs', area: '2,448 sq km',
        landscapeType: 'Plateau & Lake'
    },

    // NAGALAND
    'Kohima': {
        tagline: 'The Historic Battleground',
        senseOfPlace: 'Where history and hills converge.',
        themes: ['WWII History', 'Hornbill Festival', 'Faith & Tradition'],
        knownFor: ['Hornbill Festival', 'War Cemetery', 'Angami Shawls', 'Dzukou Valley'],
        population: '2.7 Lakhs', area: '1,463 sq km',
        landscapeType: 'Rugged Mountains'
    },
    'Dimapur': {
        tagline: 'The Commercial Hub',
        senseOfPlace: 'Where commerce meets ancient ruins.',
        themes: ['Trade Center', 'Kachari Ruins', 'Gateway'],
        knownFor: ['Kachari Ruins', 'Rangapahar', 'Commercial Center'],
        population: '3.8 Lakhs', area: '927 sq km',
        landscapeType: 'Plains & Foothills'
    },
    'Mokokchung': {
        tagline: 'Land of the Ao',
        senseOfPlace: 'Where Ao traditions shine bright.',
        themes: ['Ao Tribe', 'Moatsu Festival', 'Education'],
        knownFor: ['Ungma Village', 'Moatsu Festival', 'Ao Culture'],
        population: '1.9 Lakhs', area: '1,615 sq km',
        landscapeType: 'Hills'
    },
    'Mon': {
        tagline: 'Land of the Konyak',
        senseOfPlace: 'Where the last headhunters tell their tales.',
        themes: ['Konyak Tribe', 'Tattoo Culture', 'Angh System'],
        knownFor: ['Longwa Village', 'Konyak Warriors', 'Aoling Festival'],
        population: '2.5 Lakhs', area: '1,786 sq km',
        landscapeType: 'Remote Mountains'
    },
    'Tuensang': {
        tagline: 'The Frontier District',
        senseOfPlace: 'Where multiple Naga tribes converge.',
        themes: ['Multi-Tribal', 'Remote Beauty', 'Traditional Life'],
        knownFor: ['Chang Tribe', 'Yimchunger Tribe', 'Traditional Villages'],
        population: '1.9 Lakhs', area: '4,228 sq km',
        landscapeType: 'Remote Hills'
    },
    'Wokha': {
        tagline: 'Land of the Lotha',
        senseOfPlace: 'Where Doyang River flows through history.',
        themes: ['Lotha Tribe', 'Doyang Dam', 'Tokhu Emong'],
        knownFor: ['Doyang River', 'Tokhu Emong Festival', 'Lotha Shawls'],
        population: '1.7 Lakhs', area: '1,628 sq km',
        landscapeType: 'River Valley'
    },
    'Zunheboto': {
        tagline: 'Land of the Sumi',
        senseOfPlace: 'Where Sumi traditions thrive.',
        themes: ['Sumi Tribe', 'Aghunato', 'Traditional Crafts'],
        knownFor: ['Aghunato', 'Sumi Shawls', 'Ahuna Festival'],
        population: '1.4 Lakhs', area: '1,255 sq km',
        landscapeType: 'Hills'
    },
    'Phek': {
        tagline: 'Land of the Chakhesang',
        senseOfPlace: 'Where Dzukou blooms in solitude.',
        themes: ['Chakhesang Tribe', 'Dzukou Valley', 'Terrace Farming'],
        knownFor: ['Dzukou Valley', 'Shilloi Lake', 'Chakhesang Culture'],
        population: '1.6 Lakhs', area: '2,026 sq km',
        landscapeType: 'Mountain Valleys'
    },
    'Peren': {
        tagline: 'Land of the Zeliang',
        senseOfPlace: 'Where Zeliang warriors once ruled.',
        themes: ['Zeliang Tribe', 'Benreu Village', 'Traditional Dance'],
        knownFor: ['Benreu', 'Mt. Pauna', 'Zeliang Dance'],
        population: '1.6 Lakhs', area: '1,431 sq km',
        landscapeType: 'Hills'
    },
    'Longleng': {
        tagline: 'Land of Handloom',
        senseOfPlace: 'Where Phom traditions weave stories.',
        themes: ['Phom Tribe', 'Handloom', 'Monyu Festival'],
        knownFor: ['Phom Shawls', 'Monyu Festival', 'Traditional Villages'],
        population: '0.5 Lakhs', area: '885 sq km',
        landscapeType: 'Hills'
    },
    'Kiphire': {
        tagline: 'The Hidden District',
        senseOfPlace: 'Where remoteness preserves tradition.',
        themes: ['Sangtam Tribe', 'Saramati Peak', 'Remote Villages'],
        knownFor: ['Mount Saramati', 'Fakim Wildlife', 'Sangtam Culture'],
        population: '0.7 Lakhs', area: '1,130 sq km',
        landscapeType: 'Remote Mountains'
    },

    // ARUNACHAL PRADESH
    'Tawang': {
        tagline: 'The Spiritual Sanctuary',
        senseOfPlace: 'Where the chants of monks meet the winter snow.',
        themes: ['Tawang Monastery', 'Sela Pass', 'Monpa Culture'],
        knownFor: ['Tawang Monastery', 'Sela Pass', '6th Dalai Lama Birthplace', 'War Memorial'],
        population: '0.5 Lakhs', area: '2,085 sq km',
        landscapeType: 'Alpine & Glacial'
    },
    'West Kameng': {
        tagline: 'The Buddhist Circuit',
        senseOfPlace: 'Where monastery bells echo through valleys.',
        themes: ['Bomdila Monastery', 'Orchids', 'Hot Springs'],
        knownFor: ['Bomdila', 'Dirang', 'Eagles Nest', 'Apple Orchards'],
        population: '0.8 Lakhs', area: '7,422 sq km',
        landscapeType: 'Mountain Valleys'
    },
    'East Kameng': {
        tagline: 'Land of the Nyishi',
        senseOfPlace: 'Where Nyishi traditions thrive.',
        themes: ['Nyishi Tribe', 'Pakke Sanctuary', 'Rivers'],
        knownFor: ['Pakke Tiger Reserve', 'Seppa', 'Nyishi Culture'],
        population: '0.8 Lakhs', area: '4,134 sq km',
        landscapeType: 'Dense Forest'
    },
    'Papum Pare': {
        tagline: 'The Capital Region',
        senseOfPlace: 'Where Arunachal meets modernity.',
        themes: ['State Capital', 'Ganga Lake', 'Craft Centers'],
        knownFor: ['Itanagar', 'Ganga Lake', 'Ita Fort', 'Craft Museum'],
        population: '1.8 Lakhs', area: '2,875 sq km',
        landscapeType: 'Foothills'
    },
    'Lower Subansiri': {
        tagline: 'Gateway to the Sun',
        senseOfPlace: 'Where the Subansiri flows free.',
        themes: ['Apatani Tribe', 'Ziro Valley', 'Sustainable Farming'],
        knownFor: ['Ziro Valley', 'Apatani Culture', 'Ziro Music Festival'],
        population: '0.8 Lakhs', area: '3,460 sq km',
        landscapeType: 'Valley'
    },
    'Upper Subansiri': {
        tagline: 'The Highland Frontier',
        senseOfPlace: 'Where mountains touch the clouds.',
        themes: ['Remote Villages', 'Tagin Tribe', 'Adventures'],
        knownFor: ['Daporijo', 'Tagin Culture', 'Mountain Treks'],
        population: '0.8 Lakhs', area: '7,032 sq km',
        landscapeType: 'High Mountains'
    },
    'West Siang': {
        tagline: 'Heart of the Adi',
        senseOfPlace: 'Where the Siang thunders through.',
        themes: ['Adi Tribe', 'Siang River', 'Suspension Bridges'],
        knownFor: ['Aalo', 'Mechuka', 'Adi Culture', 'Hanging Bridges'],
        population: '1.1 Lakhs', area: '8,325 sq km',
        landscapeType: 'River Gorges'
    },
    'East Siang': {
        tagline: 'Where India Begins',
        senseOfPlace: 'Where the first rays of sun touch India.',
        themes: ['Sunrise Point', 'Adi Culture', 'River Adventure'],
        knownFor: ['Pasighat', 'Bodak', 'Adi Galo Tribe'],
        population: '1.0 Lakhs', area: '4,005 sq km',
        landscapeType: 'River Plains'
    },
    'Upper Siang': {
        tagline: 'The Border District',
        senseOfPlace: 'Where adventure meets the frontier.',
        themes: ['Indo-China Border', 'Siang River', 'Remote Beauty'],
        knownFor: ['Yingkiong', 'Mouling Park', 'Rafting'],
        population: '0.4 Lakhs', area: '6,188 sq km',
        landscapeType: 'Remote Mountains'
    },
    'Dibang Valley': {
        tagline: 'The Mystic Valley',
        senseOfPlace: 'Where the Idu Mishmi guard ancient secrets.',
        themes: ['Idu Mishmi', 'Biodiversity', 'Remote Wilderness'],
        knownFor: ['Anini', 'Idu Mishmi Culture', 'Mehao Lake'],
        population: '0.1 Lakhs', area: '9,129 sq km',
        landscapeType: 'Wilderness'
    },
    'Lower Dibang Valley': {
        tagline: 'Where Rivers Meet',
        senseOfPlace: 'Where Dibang and Lohit embrace.',
        themes: ['River Confluence', 'Mishmi Tribe', 'Forests'],
        knownFor: ['Roing', 'Mayudia Pass', 'Mishmi Hills'],
        population: '0.5 Lakhs', area: '3,900 sq km',
        landscapeType: 'River Valleys'
    },
    'Lohit': {
        tagline: 'Land of the Mishmi',
        senseOfPlace: 'Where the Lohit River writes history.',
        themes: ['Mishmi Tribe', 'Walong History', 'Border Region'],
        knownFor: ['Tezu', 'Walong', 'Parshuram Kund'],
        population: '1.5 Lakhs', area: '2,402 sq km',
        landscapeType: 'River Valley'
    },
    'Anjaw': {
        tagline: 'The Easternmost',
        senseOfPlace: 'Where India greets the rising sun.',
        themes: ['Easternmost District', 'Mishmi Culture', 'Remote Beauty'],
        knownFor: ['Dong Village', 'First Sunrise', 'Kibithu'],
        population: '0.2 Lakhs', area: '6,190 sq km',
        landscapeType: 'Remote Mountains'
    },
    'Changlang': {
        tagline: 'Land of the Tangsa',
        senseOfPlace: 'Where Stillwell Road tells war stories.',
        themes: ['WWII Heritage', 'Tangsa Tribe', 'Coal Mines'],
        knownFor: ['Namdapha Park', 'Stillwell Road', 'Tangsa Culture'],
        population: '1.5 Lakhs', area: '4,662 sq km',
        landscapeType: 'Dense Forest'
    },
    'Tirap': {
        tagline: 'Land of the Nocte',
        senseOfPlace: 'Where Nocte chiefs still rule villages.',
        themes: ['Nocte Tribe', 'Traditional Chiefs', 'Border Region'],
        knownFor: ['Khonsa', 'Nocte Culture', 'Traditional Longhouses'],
        population: '1.1 Lakhs', area: '2,362 sq km',
        landscapeType: 'Hills'
    },
    'Kurung Kumey': {
        tagline: 'The Hidden North',
        senseOfPlace: 'Where remoteness preserves purity.',
        themes: ['Nyishi Tribe', 'Remote Villages', 'Dense Forests'],
        knownFor: ['Koloriang', 'Nyishi Culture', 'Pristine Forests'],
        population: '0.9 Lakhs', area: '6,040 sq km',
        landscapeType: 'Remote Forest'
    },

    // MIZORAM
    'Aizawl': {
        tagline: 'The Singing City',
        senseOfPlace: 'Where every Sunday the city sings.',
        themes: ['Church Capital', 'Mizo Culture', 'Hilltop Living'],
        knownFor: ['Churches', 'Bara Bazaar', 'Durtlang Hills', 'Mizo Handloom'],
        population: '4.0 Lakhs', area: '3,576 sq km',
        landscapeType: 'Hilltop City'
    },
    'Lunglei': {
        tagline: 'The Southern Hub',
        senseOfPlace: 'Where the southern hills embrace you.',
        themes: ['Southern Gateway', 'Educational Hub', 'Rivers'],
        knownFor: ['Lunglei Town', 'Zobawk', 'Tuichang River'],
        population: '1.6 Lakhs', area: '4,538 sq km',
        landscapeType: 'Southern Hills'
    },
    'Champhai': {
        tagline: 'The Rice Bowl',
        senseOfPlace: 'Where terraced fields meet Myanmar.',
        themes: ['Rice Production', 'Border Trade', 'Scenic Beauty'],
        knownFor: ['Rih Dil Lake', 'Zote Wildlife', 'Border Markets'],
        population: '1.3 Lakhs', area: '3,185 sq km',
        landscapeType: 'Border Valley'
    },
    'Kolasib': {
        tagline: 'The Northern Gateway',
        senseOfPlace: 'Where Mizoram begins.',
        themes: ['Gateway District', 'Rivers', 'Tribal Villages'],
        knownFor: ['Kolasib Town', 'Tlawng River', 'Vairengte'],
        population: '0.8 Lakhs', area: '1,382 sq km',
        landscapeType: 'Northern Hills'
    },
    'Mamit': {
        tagline: 'The Western Frontier',
        senseOfPlace: 'Where Mizoram meets Tripura.',
        themes: ['Wildlife', 'Bamboo Forests', 'Border Region'],
        knownFor: ['Dampa Sanctuary', 'Tut Lake', 'Bamboo Products'],
        population: '0.9 Lakhs', area: '3,025 sq km',
        landscapeType: 'Dense Forest'
    },
    'Serchhip': {
        tagline: 'The Central Highland',
        senseOfPlace: 'Where Mizo traditions run deepest.',
        themes: ['Traditional Culture', 'Scenic Drives', 'Villages'],
        knownFor: ['Vantawng Falls', 'Chhingchhip', 'Traditional Weaving'],
        population: '0.6 Lakhs', area: '1,421 sq km',
        landscapeType: 'Highland'
    },
    'Lawangtlai': {
        tagline: 'Land of the Lai',
        senseOfPlace: 'Where Lai traditions color the hills.',
        themes: ['Lai Tribe', 'Traditional Dress', 'Border Region'],
        knownFor: ['Lawangtlai Town', 'Lai Culture', 'Saza Cave'],
        population: '1.2 Lakhs', area: '2,557 sq km',
        landscapeType: 'Hills'
    },
    'Saiha': {
        tagline: 'Land of the Mara',
        senseOfPlace: 'Where the Mara people thrive.',
        themes: ['Mara Tribe', 'Southernmost District', 'Traditional Life'],
        knownFor: ['Saiha Town', 'Mara Culture', 'Palak Lake'],
        population: '0.6 Lakhs', area: '1,399 sq km',
        landscapeType: 'Southern Hills'
    },

    // TRIPURA
    'West Tripura': {
        tagline: 'The Royal Capital',
        senseOfPlace: 'Where Manikya kings left their legacy.',
        themes: ['Royal Heritage', 'Ujjayanta Palace', 'Cultural Hub'],
        knownFor: ['Ujjayanta Palace', 'Agartala', 'Neermahal', 'Tripureswari Temple'],
        population: '17.2 Lakhs', area: '3,544 sq km',
        landscapeType: 'Plains & Hills'
    },
    'South Tripura': {
        tagline: 'The Border Land',
        senseOfPlace: 'Where rubber plantations meet forests.',
        themes: ['Rubber Plantations', 'Tribal Culture', 'Wildlife'],
        knownFor: ['Sabroom', 'Pilak', 'Rubber Industry'],
        population: '4.3 Lakhs', area: '1,534 sq km',
        landscapeType: 'Plains & Forest'
    },
    'North Tripura': {
        tagline: 'The Tea Gateway',
        senseOfPlace: 'Where tea gardens paint the hills.',
        themes: ['Tea Gardens', 'Bangladesh Border', 'Commerce'],
        knownFor: ['Dharmanagar', 'Unakoti', 'Tea Estates'],
        population: '6.9 Lakhs', area: '2,995 sq km',
        landscapeType: 'Hilly Plains'
    },
    'Dhalai': {
        tagline: 'The Tribal Heartland',
        senseOfPlace: 'Where tribal traditions thrive.',
        themes: ['Tribal Culture', 'Forests', 'Remote Villages'],
        knownFor: ['Ambassa', 'Raima Valley', 'Tribal Handicrafts'],
        population: '3.8 Lakhs', area: '2,400 sq km',
        landscapeType: 'Forested Hills'
    },

    // SIKKIM
    'East': {
        tagline: 'The Capital District',
        senseOfPlace: 'Where Gangtok watches over the kingdom.',
        themes: ['State Capital', 'Monasteries', 'Organic Farming'],
        knownFor: ['Gangtok', 'Rumtek Monastery', 'Tsomgo Lake', 'Nathula Pass'],
        population: '2.8 Lakhs', area: '954 sq km',
        landscapeType: 'Mountain Capital'
    },
    'North': {
        tagline: 'The Sacred Heights',
        senseOfPlace: 'Where Kanchenjunga guards the land.',
        themes: ['Kanchenjunga', 'Hot Springs', 'High Altitude'],
        knownFor: ['Lachung', 'Gurudongmar Lake', 'Yumthang Valley'],
        population: '0.4 Lakhs', area: '4,226 sq km',
        landscapeType: 'High Himalaya'
    },
    'South': {
        tagline: 'The Green District',
        senseOfPlace: 'Where cardamom scents the air.',
        themes: ['Buddha Park', 'Cardamom', 'Forests'],
        knownFor: ['Namchi', 'Buddha Park', 'Temi Tea Garden'],
        population: '1.5 Lakhs', area: '750 sq km',
        landscapeType: 'Forested Hills'
    },
    'West': {
        tagline: 'The Trekkers Paradise',
        senseOfPlace: 'Where trails lead to Kanchenjunga.',
        themes: ['Trekking', 'Monasteries', 'Lakes'],
        knownFor: ['Pelling', 'Khecheopalri Lake', 'Dzongri Trek'],
        population: '1.4 Lakhs', area: '1,166 sq km',
        landscapeType: 'Mountain Trails'
    },

    // ASSAM
    'Kamrup Metropolitan': {
        tagline: 'The Gateway City',
        senseOfPlace: 'Where Guwahati bridges the Northeast.',
        themes: ['Gateway City', 'Kamakhya Temple', 'Commerce'],
        knownFor: ['Kamakhya Temple', 'Umananda', 'Brahmaputra', 'Gateway to NE'],
        population: '12.5 Lakhs', area: '1,528 sq km',
        landscapeType: 'Urban & River'
    },
    'Kamrup': {
        tagline: 'The Ancient Kingdom',
        senseOfPlace: 'Where the Kamrup kingdom once flourished.',
        themes: ['Ancient History', 'Silk', 'Rural Assam'],
        knownFor: ['Hajo', 'Sualkuchi Silk', 'Ancient Temples'],
        population: '15.2 Lakhs', area: '4,345 sq km',
        landscapeType: 'Plains & Wetlands'
    },
    'Dibrugarh': {
        tagline: 'The Tea City',
        senseOfPlace: 'Where tea gardens stretch to the horizon.',
        themes: ['Tea Industry', 'Oil & Gas', 'Cultural Hub'],
        knownFor: ['Tea Gardens', 'Dibru Saikhowa', 'Oil Industry'],
        population: '13.3 Lakhs', area: '3,381 sq km',
        landscapeType: 'River Plains'
    },
    'Jorhat': {
        tagline: 'Cultural Capital',
        senseOfPlace: 'Where Ahom legacy lives on.',
        themes: ['Ahom Heritage', 'Tea', 'Education'],
        knownFor: ['Majuli Island', 'Toklai Tea Research', 'Ahom Sites'],
        population: '10.9 Lakhs', area: '2,851 sq km',
        landscapeType: 'River Plains'
    },
    'Sivasagar': {
        tagline: 'The Ahom Capital',
        senseOfPlace: 'Where 600 years of Ahom history echoes.',
        themes: ['Ahom Kingdom', 'Historical Monuments', 'Tanks'],
        knownFor: ['Rang Ghar', 'Talatal Ghar', 'Sivasagar Tank'],
        population: '11.5 Lakhs', area: '2,668 sq km',
        landscapeType: 'Historic Plains'
    },
    'Tinsukia': {
        tagline: 'The Energy Hub',
        senseOfPlace: 'Where oil fuels the region.',
        themes: ['Oil Industry', 'Wildlife', 'Border District'],
        knownFor: ['Digboi Oil Fields', 'Dibru Saikhowa', 'Stilwell Road'],
        population: '13.3 Lakhs', area: '3,790 sq km',
        landscapeType: 'River & Forest'
    },
    'Dhemaji': {
        tagline: 'Land of Rice',
        senseOfPlace: 'Where rivers bring life and floods.',
        themes: ['Agriculture', 'Mishing Tribe', 'Floods'],
        knownFor: ['Mishing Villages', 'Rice Production', 'River Islands'],
        population: '6.9 Lakhs', area: '3,237 sq km',
        landscapeType: 'Floodplains'
    },
    'Lakhimpur': {
        tagline: 'The Rice Bowl',
        senseOfPlace: 'Where paddies golden stretch endlessly.',
        themes: ['Rice Production', 'Subansiri', 'Rural Life'],
        knownFor: ['North Lakhimpur', 'Rice', 'Subansiri River'],
        population: '10.4 Lakhs', area: '2,277 sq km',
        landscapeType: 'River Plains'
    },
    'Golaghat': {
        tagline: 'Gateway to Karbi',
        senseOfPlace: 'Where plains meet Karbi hills.',
        themes: ['Tea Gardens', 'Kaziranga', 'Transition Zone'],
        knownFor: ['Kaziranga', 'Numaligarh Refinery', 'Tea'],
        population: '10.7 Lakhs', area: '3,502 sq km',
        landscapeType: 'Plains & Hills'
    },
    'Nagaon': {
        tagline: 'The Central Hub',
        senseOfPlace: 'Where Assam finds its center.',
        themes: ['Agriculture', 'History', 'Wetlands'],
        knownFor: ['Bordowa', 'Laokhowa', 'Rice Production'],
        population: '28.2 Lakhs', area: '3,831 sq km',
        landscapeType: 'Central Plains'
    },
    'Sonitpur': {
        tagline: 'Land of Legends',
        senseOfPlace: 'Where Usha and Aniruddha found love.',
        themes: ['Mythology', 'Wildlife', 'Tea'],
        knownFor: ['Tezpur', 'Nameri', 'Agnigarh Hill'],
        population: '19.2 Lakhs', area: '5,324 sq km',
        landscapeType: 'Foothills'
    },
    'Darrang': {
        tagline: 'The Historic Frontier',
        senseOfPlace: 'Where history meets the Brahmaputra.',
        themes: ['Agriculture', 'History', 'Char Areas'],
        knownFor: ['Mangaldoi', 'Historic Sites', 'Agriculture'],
        population: '9.3 Lakhs', area: '1,585 sq km',
        landscapeType: 'Plains'
    },
    'Udalguri': {
        tagline: 'Bodo Heartland',
        senseOfPlace: 'Where Bodo culture thrives.',
        themes: ['Bodo Tribe', 'Forests', 'Wildlife'],
        knownFor: ['Bodoland', 'Manas Buffer', 'Bodo Culture'],
        population: '8.3 Lakhs', area: '1,852 sq km',
        landscapeType: 'Foothills'
    },
    'Baksa': {
        tagline: 'The Wildlife Corridor',
        senseOfPlace: 'Where Manas tigers roam.',
        themes: ['Manas', 'Bodo Culture', 'Wildlife'],
        knownFor: ['Manas National Park', 'Bodo Heritage', 'Wildlife'],
        population: '9.5 Lakhs', area: '2,400 sq km',
        landscapeType: 'Forest & Plains'
    },
    'Nalbari': {
        tagline: 'The Cultural Hub',
        senseOfPlace: 'Where art and literature flourish.',
        themes: ['Literature', 'Art', 'Culture'],
        knownFor: ['Billeshwar Temple', 'Cultural Events', 'Handloom'],
        population: '7.7 Lakhs', area: '1,052 sq km',
        landscapeType: 'Plains'
    },
    'Barpeta': {
        tagline: 'Sankardeva Land',
        senseOfPlace: 'Where Vaishnavism found its voice.',
        themes: ['Vaishnavism', 'Sattra Culture', 'Handloom'],
        knownFor: ['Barpeta Sattra', 'Manas', 'Mask Making'],
        population: '16.9 Lakhs', area: '3,245 sq km',
        landscapeType: 'Plains & Wetlands'
    },
    'Chirang': {
        tagline: 'The Green District',
        senseOfPlace: 'Where forests meet the plains.',
        themes: ['Manas', 'Bodo Culture', 'Agriculture'],
        knownFor: ['Manas Buffer', 'Kajalgaon', 'Bodo Weaving'],
        population: '4.8 Lakhs', area: '1,975 sq km',
        landscapeType: 'Foothills'
    },
    'Kokrajhar': {
        tagline: 'BTR Capital',
        senseOfPlace: 'Where Bodoland dreams live.',
        themes: ['Bodo Culture', 'Autonomy', 'Markets'],
        knownFor: ['BTR Capital', 'Bodo Culture', 'Weekly Markets'],
        population: '8.9 Lakhs', area: '3,129 sq km',
        landscapeType: 'Plains'
    },
    'Dhubri': {
        tagline: 'The Western Gateway',
        senseOfPlace: 'Where Brahmaputra enters.',
        themes: ['Brahmaputra', 'Border', 'Trade'],
        knownFor: ['Dhubri Town', 'River Trade', 'Border District'],
        population: '19.5 Lakhs', area: '2,838 sq km',
        landscapeType: 'River Plains'
    },
    'Goalpara': {
        tagline: 'Land of Ancient Temples',
        senseOfPlace: 'Where rock temples guard the river.',
        themes: ['Ancient Temples', 'Wildlife', 'River'],
        knownFor: ['Suryapahar', 'Sri Surya Temple', 'Manas Corridor'],
        population: '10.1 Lakhs', area: '1,824 sq km',
        landscapeType: 'Plains & Hills'
    },
    'Bongaigaon': {
        tagline: 'The Industrial Town',
        senseOfPlace: 'Where refineries meet traditions.',
        themes: ['Industry', 'Petrochemicals', 'Trade'],
        knownFor: ['BRPL Refinery', 'Jogighopa', 'Trade Hub'],
        population: '7.4 Lakhs', area: '1,093 sq km',
        landscapeType: 'Industrial Plains'
    },
    'Marigaon': {
        tagline: 'The Wetland District',
        senseOfPlace: 'Where beels and rivers define life.',
        themes: ['Wetlands', 'Fisheries', 'Agriculture'],
        knownFor: ['Pobitora', 'Wetlands', 'Fishing'],
        population: '9.6 Lakhs', area: '1,704 sq km',
        landscapeType: 'Wetlands'
    },
    'Karbi Anglong': {
        tagline: 'The Highland Territory',
        senseOfPlace: 'Where Karbi traditions reign supreme.',
        themes: ['Karbi Tribe', 'Hills', 'Autonomy'],
        knownFor: ['Diphu', 'Karbi Culture', 'Amri Karbi', 'Rongker Festival'],
        population: '9.6 Lakhs', area: '10,434 sq km',
        landscapeType: 'Hilly'
    },
    'Dima Hasao': {
        tagline: 'The Hill District',
        senseOfPlace: 'Where the train winds through tunnels.',
        themes: ['Dimasa Tribe', 'Railways', 'Hills'],
        knownFor: ['Haflong', 'Jatinga', 'Dima Hasao Railway'],
        population: '2.1 Lakhs', area: '4,888 sq km',
        landscapeType: 'Hills'
    },
    'Cachar': {
        tagline: 'The Barak Valley',
        senseOfPlace: 'Where Bengali and Assamese cultures merge.',
        themes: ['Barak River', 'Bengali Culture', 'Tea'],
        knownFor: ['Silchar', 'Khaspur', 'Barak River'],
        population: '17.4 Lakhs', area: '3,786 sq km',
        landscapeType: 'River Valley'
    },
    'Karimganj': {
        tagline: 'The Border District',
        senseOfPlace: 'Where Assam meets Bangladesh.',
        themes: ['Border Trade', 'Bengali Culture', 'Rivers'],
        knownFor: ['Karimganj Town', 'Border Trade', 'Rice'],
        population: '12.3 Lakhs', area: '1,809 sq km',
        landscapeType: 'Plains'
    },
    'Hailakandi': {
        tagline: 'The Compact District',
        senseOfPlace: 'Where diversity lives in harmony.',
        themes: ['Compact', 'Diverse', 'Agriculture'],
        knownFor: ['Hailakandi Town', 'Agriculture', 'Culture'],
        population: '6.6 Lakhs', area: '1,327 sq km',
        landscapeType: 'Plains'
    }
};

// Generate slug from district name
function generateSlug(name) {
    return name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
}

// Generate ID from state code and district name (use full slug for uniqueness)
function generateId(stateCode, name) {
    const slug = name.toUpperCase().replace(/\s+/g, '_').replace(/[^A-Z0-9_]/g, '');
    return `${stateCode}_${slug}`;
}

// Read GeoJSON
const geoJsonPath = join(__dirname, '../../src/MAP/NEW DISTRICTS.json');
const geoJson = JSON.parse(readFileSync(geoJsonPath, 'utf8'));

// Filter to Northeast states only
const neStates = Object.keys(STATE_CODES);
const neFeatures = geoJson.features.filter(f => neStates.includes(f.properties.ST_NM));

// Generate districts
const districts = neFeatures.map(feature => {
    const { DISTRICT, ST_NM } = feature.properties;
    const stateCode = STATE_CODES[ST_NM];
    const stateName = STATE_NAMES[ST_NM];
    const slug = generateSlug(DISTRICT);
    const _id = generateId(stateCode, DISTRICT);

    // Get custom data or use defaults
    const customData = DISTRICT_DATA[DISTRICT] || {
        tagline: `Discover ${DISTRICT}`,
        senseOfPlace: `Explore the beauty of ${DISTRICT}.`,
        themes: ['Culture', 'Nature', 'Heritage'],
        knownFor: [DISTRICT, stateName, 'Local Culture'],
        population: 'Data pending', area: 'Data pending',
        landscapeType: 'Varied'
    };

    return {
        _id,
        stateCode,
        stateName,
        districtName: DISTRICT,
        region: 'northeast',
        slug,
        tagline: customData.tagline,
        heroImage: {
            url: `https://source.unsplash.com/800x600/?${encodeURIComponent(DISTRICT)},${encodeURIComponent(stateName)},india`,
            caption: DISTRICT
        },
        images: {
            hero: [`https://source.unsplash.com/1200x800/?${encodeURIComponent(DISTRICT)},${encodeURIComponent(stateName)}`]
        },
        senseOfPlace: {
            oneLiner: customData.senseOfPlace,
            backgroundTexture: 'url_texture'
        },
        description: {
            title: `Welcome to ${DISTRICT}`,
            content: `Discover the unique culture, natural beauty, and rich heritage of ${DISTRICT} in ${stateName}. This district offers a blend of traditions and landscapes that define the spirit of Northeast India.`
        },
        definingThemes: customData.themes.slice(0, 3).map((theme, i) => ({
            icon: ['explore', 'nature', 'celebration'][i % 3],
            title: theme,
            description: `Experience the ${theme.toLowerCase()} of ${DISTRICT}.`
        })),
        knownFor: customData.knownFor,
        population: customData.population,
        area: customData.area,
        location: {
            lat: 0, // Would need to calculate centroid from GeoJSON
            lng: 0
        },
        context: {
            landscapeType: customData.landscapeType,
            surroundings: `Part of ${stateName}, ${DISTRICT} showcases the diverse landscapes of Northeast India.`,
            partOfState: stateName
        },
        landAndMemory: {
            title: `Stories of ${DISTRICT}`,
            content: `The land of ${DISTRICT} holds centuries of history, tradition, and the spirit of its people. Every village, every hill, every river has a story to tell.`
        },
        shoppingCta: {
            title: `Crafts of ${DISTRICT}`,
            categories: ['Handloom', 'Handicrafts', 'Local Products']
        },
        audioKey: `${slug}_intro`,
        weatherCode: 80,
        experiences: [
            {
                type: 'walking',
                title: `Explore ${DISTRICT}`,
                description: `Discover the hidden gems of ${DISTRICT}.`
            }
        ],
        nearbyDistricts: [],
        searchKeywords: [DISTRICT, stateName, 'Northeast', 'India']
    };
});

// Write output
const outputPath = join(__dirname, '../../src/json_backend/data/districts.json');
writeFileSync(outputPath, JSON.stringify(districts, null, 2), 'utf8');

console.log(`✅ Generated ${districts.length} districts`);
console.log(`📁 Output: ${outputPath}`);
