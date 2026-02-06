# Seed Cultural Threads via CMS API
# Run from project root: powershell -ExecutionPolicy Bypass -File scripts/seedCulturalThreadsAPI.ps1

$BASE_URL = "http://localhost:3001/api/cms/states"

# Manipur
$manipurData = @{
    culturalThreads = @(
        @{ title = "Festival Rhythms"; insight = "Lai Haraoba celebrates the creation myth with classical dance and ancient rituals"; imageUrl = "https://images.unsplash.com/photo-1533241517006-be2f985b8829?q=80" },
        @{ title = "Music & Dance"; insight = "Manipuri classical dance, a gift to India from the royal courts of Kangla"; imageUrl = "https://images.unsplash.com/photo-1583795484071-3c453e3a7c71?q=80" },
        @{ title = "Woven Heritage"; insight = "Every Meitei woman weaves, creating intricate patterns on the backstrap loom"; imageUrl = "https://images.unsplash.com/photo-1558171813-4c088753af8f?q=80" },
        @{ title = "Food Stories"; insight = "Eromba and singju reveal a cuisine rooted in fermentation and fresh herbs"; imageUrl = "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80" },
        @{ title = "Wild Sanctuary"; insight = "Keibul Lamjao, the world only floating national park, home to the sangai deer"; imageUrl = "https://images.unsplash.com/photo-1474511320723-9a56873571b7?q=80" }
    )
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "$BASE_URL/manipur/cultural-threads" -Method Put -Body $manipurData -ContentType "application/json"
Write-Host "Updated Manipur"

# Assam
$assamData = @{
    culturalThreads = @(
        @{ title = "Festival Rhythms"; insight = "Bihu celebrates the eternal cycle of sowing, harvest, and renewal"; imageUrl = "https://images.unsplash.com/photo-1533241517006-be2f985b8829?q=80" },
        @{ title = "Music & Dance"; insight = "The dhol and pepa create a rhythm that echoes through tea-garden valleys"; imageUrl = "https://images.unsplash.com/photo-1583795484071-3c453e3a7c71?q=80" },
        @{ title = "Woven Heritage"; insight = "Muga and Eri silk, golden threads spun from the wild"; imageUrl = "https://images.unsplash.com/photo-1558171813-4c088753af8f?q=80" },
        @{ title = "Food Stories"; insight = "Duck curry with ash gourd and Khar reveal a cuisine of fermentation and smoke"; imageUrl = "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80" },
        @{ title = "Wild Sanctuary"; insight = "Kaziranga one-horned rhino, a survivor of epochs, moves with ancient dignity"; imageUrl = "https://images.unsplash.com/photo-1474511320723-9a56873571b7?q=80" }
    )
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "$BASE_URL/assam/cultural-threads" -Method Put -Body $assamData -ContentType "application/json"
Write-Host "Updated Assam"

# Meghalaya
$meghalayaData = @{
    culturalThreads = @(
        @{ title = "Festival Rhythms"; insight = "Wangala celebrates the harvest moon with a hundred drums beating as one"; imageUrl = "https://images.unsplash.com/photo-1533241517006-be2f985b8829?q=80" },
        @{ title = "Music & Dance"; insight = "Nongkrem dance honors the goddess with five days of sacred movement"; imageUrl = "https://images.unsplash.com/photo-1583795484071-3c453e3a7c71?q=80" },
        @{ title = "Woven Heritage"; insight = "Eri shawls spun from peace silk, where the moth lives to complete its cycle"; imageUrl = "https://images.unsplash.com/photo-1558171813-4c088753af8f?q=80" },
        @{ title = "Food Stories"; insight = "Jadoh and Tungrymbai bring together rice, meat, and fermented soybean"; imageUrl = "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80" },
        @{ title = "Wild Sanctuary"; insight = "Living root bridges grow stronger each generation, spanning monsoon rivers"; imageUrl = "https://images.unsplash.com/photo-1474511320723-9a56873571b7?q=80" }
    )
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "$BASE_URL/meghalaya/cultural-threads" -Method Put -Body $meghalayaData -ContentType "application/json"
Write-Host "Updated Meghalaya"

# Nagaland
$nagalandData = @{
    culturalThreads = @(
        @{ title = "Festival Rhythms"; insight = "Hornbill Festival gathers seventeen tribes in celebration, not rivalry"; imageUrl = "https://images.unsplash.com/photo-1533241517006-be2f985b8829?q=80" },
        @{ title = "Music & Dance"; insight = "War dances transformed into performances of grace and cultural pride"; imageUrl = "https://images.unsplash.com/photo-1583795484071-3c453e3a7c71?q=80" },
        @{ title = "Woven Attire"; insight = "Each tribe shawl tells a story of identity through patterns passed down generations"; imageUrl = "https://images.unsplash.com/photo-1558171813-4c088753af8f?q=80" },
        @{ title = "Food Stories"; insight = "Smoked pork with bamboo shoot and the legendary Naga King Chilli"; imageUrl = "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80" },
        @{ title = "Wild Sanctuary"; insight = "Dzukou Valley blooms with lilies that exist nowhere else on Earth"; imageUrl = "https://images.unsplash.com/photo-1474511320723-9a56873571b7?q=80" }
    )
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "$BASE_URL/nagaland/cultural-threads" -Method Put -Body $nagalandData -ContentType "application/json"
Write-Host "Updated Nagaland"

# Arunachal Pradesh
$arunachalData = @{
    culturalThreads = @(
        @{ title = "Festival Rhythms"; insight = "Losar marks the Tibetan New Year with butter lamps illuminating monastery halls"; imageUrl = "https://images.unsplash.com/photo-1533241517006-be2f985b8829?q=80" },
        @{ title = "Music & Dance"; insight = "Masked monastery dances preserve teachings in movement and color"; imageUrl = "https://images.unsplash.com/photo-1583795484071-3c453e3a7c71?q=80" },
        @{ title = "Woven Attire"; insight = "Apatani nose plugs and the intricate textiles of twenty-six distinct tribes"; imageUrl = "https://images.unsplash.com/photo-1558171813-4c088753af8f?q=80" },
        @{ title = "Food Stories"; insight = "Thukpa and momos warm travelers on high-altitude monastery trails"; imageUrl = "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80" },
        @{ title = "Wild Sanctuary"; insight = "Namdapha, where tigers and snow leopards share the same forest"; imageUrl = "https://images.unsplash.com/photo-1474511320723-9a56873571b7?q=80" }
    )
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "$BASE_URL/arunachal-pradesh/cultural-threads" -Method Put -Body $arunachalData -ContentType "application/json"
Write-Host "Updated Arunachal Pradesh"

# Mizoram
$mizoramData = @{
    culturalThreads = @(
        @{ title = "Festival Rhythms"; insight = "Chapchar Kut celebrates spring with the entire community in synchronized joy"; imageUrl = "https://images.unsplash.com/photo-1533241517006-be2f985b8829?q=80" },
        @{ title = "Music & Dance"; insight = "Cheraw bamboo dance requires perfect rhythm between dancers and pole-holders"; imageUrl = "https://images.unsplash.com/photo-1583795484071-3c453e3a7c71?q=80" },
        @{ title = "Woven Heritage"; insight = "Puan cloth in distinctive patterns marks identity and ceremonial occasions"; imageUrl = "https://images.unsplash.com/photo-1558171813-4c088753af8f?q=80" },
        @{ title = "Food Stories"; insight = "Bai and vawksa rep reveal a cuisine of smoke, herbs, and bamboo shoots"; imageUrl = "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80" },
        @{ title = "Wild Sanctuary"; insight = "Blue Mountain, where bamboo forests shelter rare langurs and wildcats"; imageUrl = "https://images.unsplash.com/photo-1474511320723-9a56873571b7?q=80" }
    )
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "$BASE_URL/mizoram/cultural-threads" -Method Put -Body $mizoramData -ContentType "application/json"
Write-Host "Updated Mizoram"

# Tripura
$tripuraData = @{
    culturalThreads = @(
        @{ title = "Festival Rhythms"; insight = "Garia Puja honors the deity of wealth with community offerings and dance"; imageUrl = "https://images.unsplash.com/photo-1533241517006-be2f985b8829?q=80" },
        @{ title = "Music & Dance"; insight = "Lebang Boomani mimics the movement of insects in joyful harvest celebration"; imageUrl = "https://images.unsplash.com/photo-1583795484071-3c453e3a7c71?q=80" },
        @{ title = "Woven Heritage"; insight = "Bamboo craft elevated to fine art in baskets, furniture, and musical instruments"; imageUrl = "https://images.unsplash.com/photo-1558171813-4c088753af8f?q=80" },
        @{ title = "Food Stories"; insight = "Mui borok cuisine merges tribal traditions with Bengali influences"; imageUrl = "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80" },
        @{ title = "Wild Sanctuary"; insight = "Clouded Leopard National Park protects species found nowhere else in India"; imageUrl = "https://images.unsplash.com/photo-1474511320723-9a56873571b7?q=80" }
    )
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "$BASE_URL/tripura/cultural-threads" -Method Put -Body $tripuraData -ContentType "application/json"
Write-Host "Updated Tripura"

# Sikkim
$sikkimData = @{
    culturalThreads = @(
        @{ title = "Festival Rhythms"; insight = "Losar and Saga Dawa fill monasteries with chanting, offerings, and sacred dance"; imageUrl = "https://images.unsplash.com/photo-1533241517006-be2f985b8829?q=80" },
        @{ title = "Music & Dance"; insight = "Cham dances reveal Buddhist teachings through masks and movement"; imageUrl = "https://images.unsplash.com/photo-1583795484071-3c453e3a7c71?q=80" },
        @{ title = "Woven Heritage"; insight = "Lepcha handlooms create textiles as intricate as the sacred texts they honor"; imageUrl = "https://images.unsplash.com/photo-1558171813-4c088753af8f?q=80" },
        @{ title = "Food Stories"; insight = "Gundruk, kinema, and chhurpi preserve food through fermentation and altitude"; imageUrl = "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80" },
        @{ title = "Wild Sanctuary"; insight = "Red pandas and snow leopards roam under the gaze of Kanchenjunga"; imageUrl = "https://images.unsplash.com/photo-1474511320723-9a56873571b7?q=80" }
    )
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "$BASE_URL/sikkim/cultural-threads" -Method Put -Body $sikkimData -ContentType "application/json"
Write-Host "Updated Sikkim"

Write-Host ""
Write-Host "All cultural threads seeded successfully!"

