import type {
  User, Farm, Crop, CropRecommendation, SoilHealth, WeatherData, DailyForecast,
  MarketPrice, MarketPrediction, Product, CollectionCenter, DiseaseDetection,
  FertilizerRecommendation, IrrigationStatus, QualityCheck, Order, Notification,
  AdminStats, ChatMessage, CropStage
} from '@/types';

// ============== DEMO USERS ==============
export const demoUsers: Record<string, User> = {
  farmer: {
    id: 'f1', name: 'Vamsi Krishna', email: 'vamsi@farm.ai', phone: '+91 9876543210',
    role: 'farmer', language: 'en', location: 'Siddipet, Telangana',
    state: 'Telangana', district: 'Siddipet', village: 'Gajwel',
    isOnboarded: true, joinedDate: '2024-06-15',
  },
  consumer: {
    id: 'c1', name: 'Priya Sharma', email: 'priya@gmail.com', phone: '+91 9123456789',
    role: 'consumer', language: 'en', location: 'Hyderabad, Telangana',
    state: 'Telangana', district: 'Hyderabad', isOnboarded: true, joinedDate: '2024-09-01',
  },
  collection_center: {
    id: 'cc1', name: 'Rajesh Kumar', email: 'rajesh@greenagri.in', phone: '+91 9988776655',
    role: 'collection_center', language: 'en', location: 'Warangal, Telangana',
    state: 'Telangana', district: 'Warangal', isOnboarded: true, joinedDate: '2024-03-10',
  },
  expert: {
    id: 'e1', name: 'Dr. Anitha Reddy', email: 'anitha@agri-expert.in', phone: '+91 9876501234',
    role: 'expert', language: 'en', location: 'Hyderabad, Telangana',
    state: 'Telangana', district: 'Hyderabad', isOnboarded: true, joinedDate: '2024-01-20',
  },
  admin: {
    id: 'a1', name: 'Admin User', email: 'admin@kisansetu.com', phone: '+91 9000000001',
    role: 'admin', language: 'en', location: 'Hyderabad, Telangana',
    state: 'Telangana', district: 'Hyderabad', isOnboarded: true, joinedDate: '2023-01-01',
  },
};

// ============== FARMS ==============
export const mockFarms: Farm[] = [
  {
    id: 'farm1', name: 'Green Valley Farm', farmerId: 'f1', location: 'Gajwel, Siddipet',
    state: 'Telangana', district: 'Siddipet', village: 'Gajwel', totalAcres: 5,
    irrigationAvailable: true, soilType: 'Red Sandy Loam', soilHealthScore: 82,
    activeCrops: [], createdAt: '2024-06-15',
  },
  {
    id: 'farm2', name: 'Cherry Blossom Acres', farmerId: 'f1', location: 'Wargal, Siddipet',
    state: 'Telangana', district: 'Siddipet', village: 'Wargal', totalAcres: 3,
    irrigationAvailable: true, soilType: 'Black Cotton Soil', soilHealthScore: 75,
    activeCrops: [], createdAt: '2024-08-01',
  },
];

// ============== CROPS ==============
export const mockCrops: Crop[] = [
  {
    id: 'crop1', name: 'Tomato', nameLocal: 'టమాట', icon: '🍅', stage: 'flowering', health: 'healthy',
    plantedDate: '2024-11-01', expectedHarvestDate: '2025-02-15', daysToHarvest: 42,
    acres: 2, variety: 'Hybrid GT-4', expectedYield: 12000, expectedRevenue: 120000,
  },
  {
    id: 'crop2', name: 'Rice', nameLocal: 'వరి', icon: '🌾', stage: 'vegetative', health: 'healthy',
    plantedDate: '2024-10-15', expectedHarvestDate: '2025-02-28', daysToHarvest: 68,
    acres: 3, variety: 'BPT-5204 (Samba Masuri)', expectedYield: 7500, expectedRevenue: 150000,
  },
  {
    id: 'crop3', name: 'Chilli', nameLocal: 'మిర్చి', icon: '🌶️', stage: 'fruiting', health: 'moderate',
    plantedDate: '2024-09-01', expectedHarvestDate: '2025-01-15', daysToHarvest: 15,
    acres: 1.5, variety: 'Guntur Chilli', expectedYield: 3000, expectedRevenue: 90000,
  },
];

mockFarms[0].activeCrops = [mockCrops[0], mockCrops[1]];
mockFarms[1].activeCrops = [mockCrops[2]];

// ============== SOIL HEALTH ==============
export const mockSoilHealth: SoilHealth = {
  score: 82, grade: 'good',
  nitrogen: { value: 245, status: 'low', label: 'Low' },
  phosphorus: { value: 32, status: 'optimal', label: 'Optimal' },
  potassium: { value: 380, status: 'optimal', label: 'Optimal' },
  ph: 6.8, organicCarbon: 0.72, moisture: 34,
  lastTestDate: '2024-12-15',
  recommendations: [
    'Add organic compost to improve nitrogen levels',
    'Apply vermicompost at 2 tonnes per acre',
    'Consider green manuring with dhaincha crop',
    'Retest soil after 45 days of treatment',
  ],
  suitableCrops: ['Tomato', 'Brinjal', 'Chilli', 'Okra', 'Cotton'],
};

// ============== WEATHER ==============
export const mockWeather: WeatherData = {
  temperature: 28, feelsLike: 30, condition: 'Partly Cloudy', icon: '⛅',
  humidity: 65, windSpeed: 12, windDirection: 'NE', rainProbability: 20,
  uvIndex: 6, location: 'Siddipet, Telangana',
};

export const mockForecast: DailyForecast[] = [
  { date: '2025-01-06', day: 'Today', high: 32, low: 22, condition: 'Partly Cloudy', icon: '⛅', rainProbability: 20 },
  { date: '2025-01-07', day: 'Tue', high: 30, low: 21, condition: 'Light Rain', icon: '🌧️', rainProbability: 75, farmingAlert: 'Rain expected. Avoid fertilizer application.' },
  { date: '2025-01-08', day: 'Wed', high: 28, low: 20, condition: 'Heavy Rain', icon: '⛈️', rainProbability: 90, farmingAlert: 'Heavy rainfall expected. Avoid irrigation and field operations.' },
  { date: '2025-01-09', day: 'Thu', high: 27, low: 19, condition: 'Rainy', icon: '🌧️', rainProbability: 80 },
  { date: '2025-01-10', day: 'Fri', high: 29, low: 20, condition: 'Cloudy', icon: '☁️', rainProbability: 35 },
  { date: '2025-01-11', day: 'Sat', high: 31, low: 21, condition: 'Sunny', icon: '☀️', rainProbability: 10 },
  { date: '2025-01-12', day: 'Sun', high: 33, low: 22, condition: 'Sunny', icon: '☀️', rainProbability: 5 },
];

// ============== CROP RECOMMENDATIONS ==============
export const mockCropRecommendations: CropRecommendation[] = [
  {
    id: 'rec1', cropName: 'Tomato', icon: '🍅', suitability: 92, expectedRevenue: '₹1.2L',
    expectedYield: '12,000 kg/acre', waterRequirement: 'medium', risk: 'medium',
    growingDuration: '90-120 days', season: 'rabi',
    reasons: ['Soil pH (6.8) is ideal for tomato cultivation', 'Current season favorable for tomato', 'Strong market demand in nearby cities', 'Your experience with tomato cultivation'],
    marketOpportunity: 'High demand in Hyderabad markets. Price trend is upward due to seasonal shortage.',
    investment: '₹25,000-30,000 per acre',
  },
  {
    id: 'rec2', cropName: 'Brinjal', icon: '🍆', suitability: 88, expectedRevenue: '₹95K',
    expectedYield: '8,000 kg/acre', waterRequirement: 'medium', risk: 'low',
    growingDuration: '100-130 days', season: 'rabi',
    reasons: ['Soil type is well-suited for brinjal', 'Low disease risk in current conditions', 'Consistent market demand year-round', 'Good companion crop with tomato'],
    marketOpportunity: 'Stable prices with consistent demand. Less price fluctuation compared to tomato.',
    investment: '₹20,000-25,000 per acre',
  },
  {
    id: 'rec3', cropName: 'Cotton', icon: '🧵', suitability: 85, expectedRevenue: '₹1.5L',
    expectedYield: '1,500 kg/acre', waterRequirement: 'low', risk: 'medium',
    growingDuration: '150-180 days', season: 'kharif',
    reasons: ['Red sandy loam soil is excellent for cotton', 'Low water requirement matches your irrigation', 'MSP guarantee provides price safety', 'Good previou yield history in your region'],
    marketOpportunity: 'Government MSP of ₹7,521/quintal. Strong demand from textile mills.',
    investment: '₹35,000-40,000 per acre',
  },
  {
    id: 'rec4', cropName: 'Maize', icon: '🌽', suitability: 80, expectedRevenue: '₹75K',
    expectedYield: '3,500 kg/acre', waterRequirement: 'medium', risk: 'low',
    growingDuration: '90-100 days', season: 'rabi',
    reasons: ['Quick growing cycle allows double cropping', 'Low pest and disease pressure', 'Good market for poultry feed industry', 'Improves soil health as rotation crop'],
    marketOpportunity: 'Steady demand from poultry and starch industries. Multiple harvests possible.',
    investment: '₹18,000-22,000 per acre',
  },
  {
    id: 'rec5', cropName: 'Onion', icon: '🧅', suitability: 78, expectedRevenue: '₹1.1L',
    expectedYield: '15,000 kg/acre', waterRequirement: 'medium', risk: 'high',
    growingDuration: '120-150 days', season: 'rabi',
    reasons: ['High profit potential in current market', 'Your soil drainage is suitable', 'Good storage capability after harvest', 'Regional climate favors onion cultivation'],
    marketOpportunity: 'Price volatility is high - can range from ₹15-80/kg. Timing of harvest is critical.',
    investment: '₹22,000-28,000 per acre',
  },
  {
    id: 'rec6', cropName: 'Okra (Bhindi)', icon: '🥬', suitability: 76, expectedRevenue: '₹65K',
    expectedYield: '6,000 kg/acre', waterRequirement: 'medium', risk: 'low',
    growingDuration: '50-65 days', season: 'year_round',
    reasons: ['Short duration crop for quick returns', 'Continuous harvesting over 2-3 months', 'Low investment requirement', 'Good demand throughout the year'],
    marketOpportunity: 'Consistent demand. Can be harvested multiple times from single planting.',
    investment: '₹12,000-15,000 per acre',
  },
];

// ============== MARKET PRICES ==============
export const mockMarketPrices: MarketPrice[] = [
  { crop: 'Tomato', price: 28, unit: 'kg', change: 2.5, changePercent: 8, market: 'Hyderabad', date: '2025-01-06' },
  { crop: 'Rice', price: 32, unit: 'kg', change: -0.5, changePercent: -1.5, market: 'Warangal', date: '2025-01-06' },
  { crop: 'Chilli', price: 180, unit: 'kg', change: 12, changePercent: 7, market: 'Guntur', date: '2025-01-06' },
  { crop: 'Onion', price: 35, unit: 'kg', change: -8, changePercent: -18, market: 'Hyderabad', date: '2025-01-06' },
  { crop: 'Cotton', price: 7521, unit: 'quintal', change: 120, changePercent: 1.6, market: 'Adilabad', date: '2025-01-06' },
  { crop: 'Maize', price: 22, unit: 'kg', change: 1, changePercent: 4.8, market: 'Karimnagar', date: '2025-01-06' },
  { crop: 'Brinjal', price: 25, unit: 'kg', change: 3, changePercent: 12, market: 'Hyderabad', date: '2025-01-06' },
  { crop: 'Potato', price: 20, unit: 'kg', change: -2, changePercent: -9, market: 'Hyderabad', date: '2025-01-06' },
];

export const mockMarketPrediction: MarketPrediction = {
  outlook: 'Tomato prices may increase over the next 7-14 days due to reduced supply from Maharashtra and Karnataka regions. Cold wave conditions in northern markets are driving demand up.',
  direction: 'up', confidence: 'high', timeframe: '7-14 days',
  factors: ['Reduced supply from Maharashtra', 'Cold wave increasing demand', 'Transport disruptions in Karnataka', 'Festival season demand pickup'],
};

export const priceHistory = {
  tomato: [
    { week: 'W1', price: 22 }, { week: 'W2', price: 20 }, { week: 'W3', price: 18 },
    { week: 'W4', price: 21 }, { week: 'W5', price: 24 }, { week: 'W6', price: 25.5 },
    { week: 'W7', price: 28 },
  ],
  chilli: [
    { week: 'W1', price: 160 }, { week: 'W2', price: 155 }, { week: 'W3', price: 148 },
    { week: 'W4', price: 152 }, { week: 'W5', price: 165 }, { week: 'W6', price: 172 },
    { week: 'W7', price: 180 },
  ],
  onion: [
    { week: 'W1', price: 50 }, { week: 'W2', price: 48 }, { week: 'W3', price: 42 },
    { week: 'W4', price: 38 }, { week: 'W5', price: 40 }, { week: 'W6', price: 37 },
    { week: 'W7', price: 35 },
  ],
};

// ============== SEED PRODUCTS ==============
export const mockSeedProducts: Product[] = [
  { id: 's1', name: 'Tomato Hybrid GT-4 Seeds', category: 'Vegetables', price: 450, unit: 'packet', rating: 4.5, reviewCount: 234, inStock: true, isCertified: true, germination: '95%', description: 'High-yielding hybrid tomato seeds suitable for rabi season. Resistant to common diseases.' },
  { id: 's2', name: 'Rice BPT-5204 Seeds', category: 'Grains', price: 380, unit: 'kg', rating: 4.7, reviewCount: 567, inStock: true, isCertified: true, germination: '92%', description: 'Premium Samba Masuri variety. Fine grain quality with excellent cooking properties.' },
  { id: 's3', name: 'Guntur Chilli Seeds', category: 'Vegetables', price: 520, unit: 'packet', rating: 4.3, reviewCount: 189, inStock: true, isCertified: true, germination: '88%', description: 'Authentic Guntur chilli variety known for high pungency and bright red color.' },
  { id: 's4', name: 'Cotton Bt Hybrid Seeds', category: 'Fibers', price: 820, unit: 'packet', rating: 4.6, reviewCount: 321, inStock: true, isCertified: true, germination: '90%', description: 'Bt cotton hybrid with high boll weight and excellent fiber quality.' },
  { id: 's5', name: 'Maize Hybrid 900M Seeds', category: 'Grains', price: 350, unit: 'packet', rating: 4.4, reviewCount: 145, inStock: true, isCertified: true, germination: '93%', description: 'High-yielding maize hybrid suitable for both rabi and kharif seasons.' },
  { id: 's6', name: 'Brinjal Purple Long Seeds', category: 'Vegetables', price: 280, unit: 'packet', rating: 4.2, reviewCount: 98, inStock: true, isCertified: true, germination: '90%', description: 'Long purple brinjal variety with excellent shelf life and taste.' },
  { id: 's7', name: 'Onion N-53 Seeds', category: 'Vegetables', price: 320, unit: 'packet', rating: 4.1, reviewCount: 76, inStock: true, isCertified: true, germination: '85%', description: 'Medium-sized onion variety with good storage quality.' },
  { id: 's8', name: 'Okra Pusa Sawani Seeds', category: 'Vegetables', price: 200, unit: 'packet', rating: 4.5, reviewCount: 210, inStock: true, isCertified: true, germination: '92%', description: 'Popular okra variety with tender pods and high yield potential.' },
  { id: 's9', name: 'Organic Tomato Seeds', category: 'Organic', price: 580, unit: 'packet', rating: 4.8, reviewCount: 56, inStock: true, isCertified: true, germination: '88%', description: 'Certified organic tomato seeds. No chemical treatment.' },
  { id: 's10', name: 'Watermelon Sugar Baby Seeds', category: 'Fruits', price: 390, unit: 'packet', rating: 4.3, reviewCount: 87, inStock: false, isCertified: true, germination: '87%', description: 'Compact watermelon variety perfect for small farms. Sweet and early maturing.' },
];

// ============== CONSUMER PRODUCTS ==============
export const mockConsumerProducts: Product[] = [
  { id: 'p1', name: 'Fresh Tomatoes', category: 'Vegetables', price: 40, unit: 'kg', rating: 4.6, reviewCount: 89, farmer: 'Green Valley Farm', farmerLocation: 'Siddipet, Telangana', qualityScore: 91, harvestDate: '2025-01-05', inStock: true, isCertified: true, description: 'Farm-fresh tomatoes, hand-picked at peak ripeness.' },
  { id: 'p2', name: 'Premium Basmati Rice', category: 'Grains', price: 85, unit: 'kg', rating: 4.8, reviewCount: 234, farmer: 'Rajesh Farms', farmerLocation: 'Karimnagar, Telangana', qualityScore: 95, harvestDate: '2024-12-20', inStock: true, isCertified: true, description: 'Aromatic basmati rice, aged for 6 months for perfect flavor.' },
  { id: 'p3', name: 'Red Chilli Powder', category: 'Spices', price: 320, unit: 'kg', rating: 4.7, reviewCount: 456, farmer: 'Spice Coop', farmerLocation: 'Guntur, Andhra Pradesh', qualityScore: 93, harvestDate: '2025-01-01', inStock: true, isCertified: true, description: 'Pure Guntur chilli powder, no additives. Rich red color and heat.' },
  { id: 'p4', name: 'Fresh Brinjal', category: 'Vegetables', price: 35, unit: 'kg', rating: 4.4, reviewCount: 67, farmer: 'Green Valley Farm', farmerLocation: 'Siddipet, Telangana', qualityScore: 88, harvestDate: '2025-01-05', inStock: true, isCertified: true, description: 'Fresh purple brinjal, harvested daily from local farms.' },
  { id: 'p5', name: 'Organic Onions', category: 'Vegetables', price: 45, unit: 'kg', rating: 4.5, reviewCount: 123, farmer: 'Organic Acres', farmerLocation: 'Nizamabad, Telangana', qualityScore: 90, harvestDate: '2025-01-04', inStock: true, isCertified: true, description: 'Certified organic onions, naturally grown without chemicals.' },
  { id: 'p6', name: 'Farm Fresh Eggs', category: 'Dairy', price: 80, unit: 'dozen', rating: 4.7, reviewCount: 345, farmer: 'Happy Hens Farm', farmerLocation: 'Medak, Telangana', qualityScore: 94, harvestDate: '2025-01-06', inStock: true, isCertified: true, description: 'Free-range country eggs from healthy, naturally fed hens.' },
  { id: 'p7', name: 'Fresh Green Chillies', category: 'Vegetables', price: 60, unit: 'kg', rating: 4.3, reviewCount: 78, farmer: 'Green Valley Farm', farmerLocation: 'Siddipet, Telangana', qualityScore: 87, harvestDate: '2025-01-05', inStock: true, isCertified: true, description: 'Fresh green chillies, medium spicy, perfect for daily cooking.' },
  { id: 'p8', name: 'Raw Cotton (Kapas)', category: 'Fibers', price: 7500, unit: 'quintal', rating: 4.6, reviewCount: 34, farmer: 'Cotton Belt Farm', farmerLocation: 'Adilabad, Telangana', qualityScore: 92, harvestDate: '2024-12-15', inStock: true, isCertified: true, description: 'Premium quality raw cotton, high staple length.' },
];

// ============== COLLECTION CENTERS ==============
export const mockCollectionCenters: CollectionCenter[] = [
  {
    id: 'cc1', name: 'GreenAgri Collection Center', address: 'Main Road, Warangal Urban, Telangana',
    distance: 4.2, isOpen: true, acceptedCrops: ['Tomato', 'Chilli', 'Onion', 'Brinjal'],
    operatingHours: '6:00 AM - 8:00 PM', currentCapacity: 65, maxCapacity: 100, phone: '+91 98765 43210',
  },
  {
    id: 'cc2', name: 'Krishna Agri Hub', address: 'Station Road, Karimnagar, Telangana',
    distance: 12.5, isOpen: true, acceptedCrops: ['Rice', 'Maize', 'Cotton'],
    operatingHours: '7:00 AM - 6:00 PM', currentCapacity: 40, maxCapacity: 80, phone: '+91 87654 32109',
  },
  {
    id: 'cc3', name: 'Farm Fresh Mandi', address: 'Market Yard, Siddipet, Telangana',
    distance: 2.1, isOpen: false, acceptedCrops: ['Tomato', 'Brinjal', 'Okra', 'Onion'],
    operatingHours: '5:00 AM - 2:00 PM', currentCapacity: 80, maxCapacity: 100, phone: '+91 76543 21098',
  },
  {
    id: 'cc4', name: 'Telangana Agri Market', address: 'Industrial Area, Hyderabad, Telangana',
    distance: 45, isOpen: true, acceptedCrops: ['All Vegetables', 'All Grains', 'Spices'],
    operatingHours: '6:00 AM - 10:00 PM', currentCapacity: 30, maxCapacity: 200, phone: '+91 65432 10987',
  },
];

// ============== DISEASE DETECTION ==============
export const mockDiseaseResult: DiseaseDetection = {
  id: 'd1', diseaseName: 'Early Blight', confidence: 91, severity: 'moderate',
  cropName: 'Tomato',
  description: 'Early blight is a common fungal disease affecting tomato plants, caused by Alternaria solani. It typically appears as dark, concentric ring-shaped spots on older leaves.',
  causes: ['High humidity conditions', 'Overhead irrigation', 'Poor air circulation', 'Nitrogen deficiency'],
  recommendedActions: [
    'Remove and destroy affected leaves immediately',
    'Apply copper-based fungicide (Bordeaux mixture)',
    'Improve air circulation by proper plant spacing',
    'Avoid overhead irrigation - use drip irrigation instead',
    'Apply neem oil spray as organic treatment',
  ],
  preventionTips: [
    'Practice crop rotation (3-year cycle)',
    'Use resistant tomato varieties',
    'Ensure proper plant spacing (60cm between plants)',
    'Apply preventive fungicide before rainy season',
    'Keep foliage dry during irrigation',
  ],
  detectedAt: '2025-01-06T10:30:00', needsExpertReview: false,
};

// ============== FERTILIZER RECOMMENDATIONS ==============
export const mockFertilizerRecs: FertilizerRecommendation[] = [
  {
    id: 'fr1', stage: 'planting', nutrient: 'DAP (Di-ammonium Phosphate)', quantity: '50 kg/acre',
    applicationMethod: 'Basal application - mix into soil before planting', timing: 'At planting',
    product: 'Indian Potash Limited DAP',
  },
  {
    id: 'fr2', stage: 'vegetative', nutrient: 'Urea', quantity: '25 kg/acre',
    applicationMethod: 'Top dressing - apply around plant base and water', timing: '20 days after planting',
    warning: 'Do not apply during rainy conditions to prevent leaching',
    product: 'IFFCO Urea',
  },
  {
    id: 'fr3', stage: 'flowering', nutrient: 'NPK 10:26:26', quantity: '30 kg/acre',
    applicationMethod: 'Side dressing along rows, then irrigate', timing: 'At first flowering',
    warning: 'Excess nitrogen can reduce fruit set',
    product: 'Coromandel International',
  },
  {
    id: 'fr4', stage: 'fruiting', nutrient: 'Potash (MOP)', quantity: '20 kg/acre',
    applicationMethod: 'Dissolve in water and apply through drip irrigation', timing: 'At fruit setting stage',
    product: 'Tata Potash',
  },
  {
    id: 'fr5', stage: 'harvest', nutrient: 'None required', quantity: '-',
    applicationMethod: '-', timing: 'Pre-harvest',
    warning: 'Stop all fertilizer application 15 days before harvest',
    product: '-',
  },
];

// ============== IRRIGATION STATUS ==============
export const mockIrrigationStatus: IrrigationStatus = {
  required: true, recommendedWater: 1200, bestTime: '6:00 AM – 8:00 AM',
  soilMoisture: 32,
  factors: {
    soilMoisture: { value: 32, status: 'Low' },
    temperature: { value: 28, status: 'Normal' },
    rainProbability: { value: 20, status: 'Low' },
    cropStage: { value: 'Flowering', status: 'Critical' },
  },
  aiExplanation: 'Your tomato crop is in the flowering stage which requires consistent moisture. Soil moisture is below optimal at 32%. With low rain probability tomorrow, irrigation is recommended. Drip irrigation at 1200 liters will maintain ideal soil moisture for fruit set.',
};

// ============== ORDERS ==============
export const mockOrders: Order[] = [
  {
    id: 'ORD-2025-001',
    items: [{ product: mockConsumerProducts[0], quantity: 5 }, { product: mockConsumerProducts[3], quantity: 2 }],
    total: 270, status: 'delivered', createdAt: '2024-12-28',
    deliveryAddress: 'Flat 302, Green Towers, Madhapur, Hyderabad',
    deliveryMethod: 'Express Delivery', paymentMethod: 'UPI',
    estimatedDelivery: '2024-12-30',
    trackingSteps: [
      { status: 'placed', label: 'Order Placed', completed: true, time: 'Dec 28, 10:30 AM' },
      { status: 'preparing', label: 'Preparing', completed: true, time: 'Dec 28, 11:00 AM' },
      { status: 'quality_verified', label: 'Quality Verified', completed: true, time: 'Dec 28, 2:00 PM' },
      { status: 'out_for_delivery', label: 'Out for Delivery', completed: true, time: 'Dec 30, 8:00 AM' },
      { status: 'delivered', label: 'Delivered', completed: true, time: 'Dec 30, 10:30 AM' },
    ],
  },
  {
    id: 'ORD-2025-002',
    items: [{ product: mockConsumerProducts[5], quantity: 3 }],
    total: 240, status: 'out_for_delivery', createdAt: '2025-01-05',
    deliveryAddress: 'Flat 302, Green Towers, Madhapur, Hyderabad',
    deliveryMethod: 'Standard Delivery', paymentMethod: 'Cash on Delivery',
    estimatedDelivery: '2025-01-07',
    trackingSteps: [
      { status: 'placed', label: 'Order Placed', completed: true, time: 'Jan 5, 3:00 PM' },
      { status: 'preparing', label: 'Preparing', completed: true, time: 'Jan 5, 3:30 PM' },
      { status: 'quality_verified', label: 'Quality Verified', completed: true, time: 'Jan 6, 9:00 AM' },
      { status: 'out_for_delivery', label: 'Out for Delivery', completed: false, time: 'Jan 7, 8:00 AM' },
      { status: 'delivered', label: 'Delivered', completed: false },
    ],
  },
];

// ============== QUALITY CHECKS ==============
export const mockQualityChecks: QualityCheck[] = [
  {
    id: 'qc1', productName: 'Tomato', farmerName: 'Vamsi Krishna', qualityScore: 91,
    grade: 'premium', freshness: 94, sizeConsistency: 88, appearance: 92, damageCheck: 90,
    verifiedAt: '2025-01-06', status: 'verified',
  },
  {
    id: 'qc2', productName: 'Chilli', farmerName: 'Ramesh Reddy', qualityScore: 78,
    grade: 'standard', freshness: 82, sizeConsistency: 70, appearance: 80, damageCheck: 80,
    verifiedAt: '2025-01-06', status: 'verified',
  },
  {
    id: 'qc3', productName: 'Brinjal', farmerName: 'Suresh Kumar', qualityScore: 0,
    grade: 'standard', freshness: 0, sizeConsistency: 0, appearance: 0, damageCheck: 0,
    verifiedAt: '', status: 'pending',
  },
];

// ============== NOTIFICATIONS ==============
export const mockNotifications: Notification[] = [
  { id: 'n1', title: 'Weather Alert', message: 'Heavy rainfall expected tomorrow. Avoid fertilizer application.', type: 'warning', read: false, createdAt: '2025-01-06T09:00:00', icon: '🌧️' },
  { id: 'n2', title: 'Irrigation Reminder', message: 'Your tomato crop needs irrigation today. Best time: 6-8 AM.', type: 'alert', read: false, createdAt: '2025-01-06T08:00:00', icon: '💧' },
  { id: 'n3', title: 'Market Update', message: 'Tomato prices increased by 8% in Hyderabad market today.', type: 'success', read: false, createdAt: '2025-01-06T07:00:00', icon: '📈' },
  { id: 'n4', title: 'Order Delivered', message: 'Your order ORD-2025-001 has been delivered successfully.', type: 'success', read: true, createdAt: '2025-01-05T10:30:00', icon: '✅' },
  { id: 'n5', title: 'New AI Advisory', message: 'Dr. Reddy has published a new advisory on managing early blight in tomato.', type: 'info', read: true, createdAt: '2025-01-04T14:00:00', icon: '🔬' },
];

// ============== ADMIN STATS ==============
export const mockAdminStats: AdminStats = {
  totalFarmers: 2847, activeFarms: 4231, totalUsers: 8934, totalOrders: 12450,
  marketplaceVolume: 2450000, diseaseReports: 156, collectionCenters: 24, revenue: 1850000,
  growth: { farmers: 12.5, orders: 18.3, revenue: 22.1 },
};

// ============== AI CHAT MOCK ==============
export const mockChatResponses: Record<string, string> = {
  default: "I'd be happy to help with your farm! Could you please tell me more about what you'd like to know?",
  'what should i grow': 'Based on your soil health score of 82 and the current rabi season, I recommend **Tomato** (92% suitability) or **Brinjal** (88% suitability). Both match your soil type well and have strong market demand. Would you like detailed crop plans?',
  'is irrigation needed today': 'Yes, irrigation is recommended today. Your tomato crop is in the flowering stage and soil moisture is at 32% (below optimal). I recommend **1,200 liters** of water between **6:00 AM - 8:00 AM** using drip irrigation. Rain probability is only 20% tomorrow, so no natural relief expected.',
  'why are my leaves yellow': 'Yellowing leaves (chlorosis) can be caused by several factors: 1) **Nitrogen deficiency** - your soil test showed low nitrogen, 2) **Overwatering** - check soil drainage, 3) **Pest infestation** - inspect for mites or aphids. I recommend checking the leaves closely. Would you like to scan the leaves for disease detection?',
  'show today market prices': 'Here are today\'s prices in Hyderabad market: 🍅 Tomato ₹28/kg (↑8%), 🌶️ Chilli ₹180/kg (↑7%), 🧅 Onion ₹35/kg (↓18%), 🍆 Brinjal ₹25/kg (↑12%). AI predicts tomato prices may increase further in the next 7-14 days.',
  'hello': 'Good morning, Vamsi! 👋 How can I help with your farm today? You can ask me about crop recommendations, weather, market prices, disease detection, or any farming question.',
};

export const mockChatHistory: ChatMessage[] = [
  { id: 'm1', role: 'assistant', content: 'Good morning, Vamsi! 👋 How can I help with your farm today?', timestamp: '2025-01-06T08:00:00' },
];

// ============== EXPERT DISEASE CASES ==============
export const mockDiseaseCases = [
  { id: 'dc1', cropName: 'Tomato', farmerName: 'Ramesh Reddy', location: 'Warangal', confidence: 54, status: 'pending' as const, submittedAt: '2025-01-06T09:30:00' },
  { id: 'dc2', cropName: 'Rice', farmerName: 'Lakshmi Devi', location: 'Karimnagar', confidence: 42, status: 'pending' as const, submittedAt: '2025-01-06T08:15:00' },
  { id: 'dc3', cropName: 'Cotton', farmerName: 'Suresh Babu', location: 'Adilabad', confidence: 71, status: 'reviewed' as const, submittedAt: '2025-01-05T14:00:00' },
];

// ============== HELPER ==============
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
