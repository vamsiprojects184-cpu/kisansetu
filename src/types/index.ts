// ============== USER TYPES ==============
export type UserRole = 'farmer' | 'consumer' | 'collection_center' | 'expert' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  language: string;
  location: string;
  state: string;
  district: string;
  village?: string;
  isOnboarded: boolean;
  joinedDate: string;
}

// ============== FARM TYPES ==============
export interface Farm {
  id: string;
  name: string;
  farmerId: string;
  location: string;
  state: string;
  district: string;
  village: string;
  totalAcres: number;
  irrigationAvailable: boolean;
  soilType: string;
  activeCrops: Crop[];
  soilHealthScore: number;
  createdAt: string;
}

export interface Field {
  id: string;
  farmId: string;
  name: string;
  acres: number;
  crop?: Crop;
  irrigationType: 'drip' | 'sprinkler' | 'flood' | 'none';
  lastIrrigation?: string;
}

// ============== CROP TYPES ==============
export type CropStage = 'planting' | 'vegetative' | 'flowering' | 'fruiting' | 'harvest' | 'post_harvest';
export type CropHealth = 'healthy' | 'moderate' | 'stressed' | 'diseased';
export type Season = 'kharif' | 'rabi' | 'zaid' | 'year_round';

export interface Crop {
  id: string;
  name: string;
  nameLocal?: string;
  icon: string;
  stage: CropStage;
  health: CropHealth;
  plantedDate: string;
  expectedHarvestDate: string;
  daysToHarvest: number;
  acres: number;
  variety?: string;
  expectedYield?: number;
  expectedRevenue?: number;
}

export interface CropRecommendation {
  id: string;
  cropName: string;
  icon: string;
  suitability: number;
  expectedRevenue: string;
  expectedYield: string;
  waterRequirement: 'low' | 'medium' | 'high';
  risk: 'low' | 'medium' | 'high';
  growingDuration: string;
  season: Season;
  reasons: string[];
  marketOpportunity: string;
  investment: string;
}

// ============== SOIL TYPES ==============
export interface SoilHealth {
  score: number;
  grade: 'excellent' | 'good' | 'fair' | 'poor';
  nitrogen: NutrientLevel;
  phosphorus: NutrientLevel;
  potassium: NutrientLevel;
  ph: number;
  organicCarbon: number;
  moisture: number;
  lastTestDate: string;
  recommendations: string[];
  suitableCrops: string[];
}

export type NutrientLevel = { value: number; status: 'low' | 'optimal' | 'high'; label: string; };

// ============== WEATHER TYPES ==============
export interface WeatherData {
  temperature: number;
  feelsLike: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  rainProbability: number;
  uvIndex: number;
  location: string;
}

export interface DailyForecast {
  date: string;
  day: string;
  high: number;
  low: number;
  condition: string;
  icon: string;
  rainProbability: number;
  farmingAlert?: string;
}

// ============== DISEASE TYPES ==============
export interface DiseaseDetection {
  id: string;
  diseaseName: string;
  confidence: number;
  severity: 'low' | 'moderate' | 'high' | 'severe';
  cropName: string;
  description: string;
  causes: string[];
  recommendedActions: string[];
  preventionTips: string[];
  detectedAt: string;
  needsExpertReview: boolean;
}

// ============== FERTILIZER TYPES ==============
export interface FertilizerRecommendation {
  id: string;
  stage: CropStage;
  nutrient: string;
  quantity: string;
  applicationMethod: string;
  timing: string;
  warning?: string;
  product: string;
}

// ============== IRRIGATION TYPES ==============
export interface IrrigationStatus {
  required: boolean;
  recommendedWater: number;
  bestTime: string;
  soilMoisture: number;
  factors: {
    soilMoisture: { value: number; status: string; };
    temperature: { value: number; status: string; };
    rainProbability: { value: number; status: string; };
    cropStage: { value: string; status: string; };
  };
  aiExplanation: string;
}

// ============== MARKET TYPES ==============
export interface MarketPrice {
  crop: string;
  price: number;
  unit: string;
  change: number;
  changePercent: number;
  market: string;
  date: string;
}

export interface MarketPrediction {
  outlook: string;
  direction: 'up' | 'down' | 'stable';
  confidence: 'high' | 'medium' | 'low';
  timeframe: string;
  factors: string[];
}

// ============== PRODUCT / MARKETPLACE TYPES ==============
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  image?: string;
  rating: number;
  reviewCount: number;
  farmer?: string;
  farmerLocation?: string;
  qualityScore?: number;
  harvestDate?: string;
  inStock: boolean;
  isCertified: boolean;
  germination?: string;
  description?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  deliveryAddress?: string;
  deliveryMethod?: string;
  paymentMethod?: string;
  estimatedDelivery?: string;
  trackingSteps: TrackingStep[];
}

export type OrderStatus = 'placed' | 'preparing' | 'quality_verified' | 'out_for_delivery' | 'delivered' | 'cancelled';

export interface TrackingStep {
  status: OrderStatus;
  label: string;
  completed: boolean;
  time?: string;
}

// ============== COLLECTION CENTER TYPES ==============
export interface CollectionCenter {
  id: string;
  name: string;
  address: string;
  distance: number;
  isOpen: boolean;
  acceptedCrops: string[];
  operatingHours: string;
  currentCapacity: number;
  maxCapacity: number;
  phone: string;
  lat?: number;
  lng?: number;
}

export interface QualityCheck {
  id: string;
  productName: string;
  farmerName: string;
  qualityScore: number;
  grade: 'premium' | 'standard' | 'rejected';
  freshness: number;
  sizeConsistency: number;
  appearance: number;
  damageCheck: number;
  verifiedAt: string;
  status: 'pending' | 'verified' | 'rejected';
}

// ============== AI ASSISTANT TYPES ==============
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

// ============== NOTIFICATION TYPES ==============
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'alert';
  read: boolean;
  createdAt: string;
  icon?: string;
}

// ============== ROUTING TYPES ==============
export type RoutePath =
  | 'landing'
  | 'login'
  | 'register'
  | 'onboarding'
  | 'farmer/dashboard'
  | 'farmer/my-farm'
  | 'farmer/farm-details'
  | 'farmer/soil-health'
  | 'farmer/crop-recommendations'
  | 'farmer/disease-detection'
  | 'farmer/fertilizer'
  | 'farmer/irrigation'
  | 'farmer/weather'
  | 'farmer/market-prices'
  | 'farmer/sell'
  | 'farmer/collection-centers'
  | 'farmer/orders'
  | 'farmer/payments'
  | 'farmer/notifications'
  | 'farmer/profile'
  | 'marketplace/home'
  | 'marketplace/seeds'
  | 'marketplace/products'
  | 'marketplace/product-detail'
  | 'marketplace/cart'
  | 'marketplace/checkout'
  | 'marketplace/order-tracking'
  | 'consumer/dashboard'
  | 'consumer/orders'
  | 'consumer/profile'
  | 'collection-center/dashboard'
  | 'collection-center/inventory'
  | 'collection-center/incoming'
  | 'collection-center/quality-check'
  | 'collection-center/payouts'
  | 'expert/dashboard'
  | 'expert/disease-cases'
  | 'expert/advisories'
  | 'admin/dashboard'
  | 'admin/users'
  | 'admin/farmers'
  | 'admin/products'
  | 'admin/orders'
  | 'admin/collection-centers'
  | 'admin/analytics';

// ============== ADMIN TYPES ==============
export interface AdminStats {
  totalFarmers: number;
  activeFarms: number;
  totalUsers: number;
  totalOrders: number;
  marketplaceVolume: number;
  diseaseReports: number;
  collectionCenters: number;
  revenue: number;
  growth: {
    farmers: number;
    orders: number;
    revenue: number;
  };
}
