'use client';

import React, { useSyncExternalStore } from 'react';
import { useAuthStore } from '@/store/use-auth-store';
import { useAppStore } from '@/store/use-app-store';
import FarmerLayout from '@/components/layouts/FarmerLayout';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import AIChatPanel from '@/components/shared/AIChatPanel';
import { LoadingState } from '@/components/shared/SharedComponents';

// Auth Pages
import { LandingPage, LoginPage, RegisterPage, OnboardingPage } from '@/components/pages/auth/AuthPages';

// Farmer Pages
import { FarmerDashboard, MyFarmPage, FarmDetailsPage, FarmerProfilePage, NotificationsPage, FarmerOrdersPage, FarmerPaymentsPage } from '@/components/pages/farmer/FarmerPages';
import { SoilHealthPage, CropRecommendationsPage, DiseaseDetectionPage, FertilizerPage, IrrigationPage, WeatherPage, MarketPricesPage } from '@/components/pages/farmer/AgriculturePages';
import { FarmerSellPage } from '@/components/pages/farmer/SellPages';
import { FarmerCollectionCentersPage } from '@/components/pages/farmer/CollectionCentersPage';

// Marketplace Pages
import { MarketplaceHome, SeedsPage, ProductsPage, ProductDetailPage, CartPage, CheckoutPage, OrderTrackingPage } from '@/components/pages/marketplace/MarketplacePages';

// Consumer Pages
import { ConsumerDashboard, ConsumerOrdersPage, ConsumerProfilePage } from '@/components/pages/consumer/ConsumerPages';

// Collection Center Pages
import { CCDashboard, CCInventory, CCIncoming, CCQualityCheck, CCPayouts } from '@/components/pages/collection-center/CCPages';

// Expert Pages
import { ExpertDashboard, ExpertDiseaseCases, ExpertAdvisories } from '@/components/pages/expert/ExpertPages';

// Admin Pages
import { AdminDashboard, AdminUsers, AdminFarmers, AdminProducts, AdminOrders, AdminCollectionCenters, AdminAnalytics } from '@/components/pages/admin/AdminPages';

// Settings Page
import SettingsPage from '@/components/pages/settings/SettingsPage';

import type { RoutePath } from '@/types';

// ============== ROUTE MAP ==============
const publicRoutes: RoutePath[] = ['landing', 'login', 'register'];

// Hydration-safe hook: returns false on server, true on client
const emptySubscribe = () => () => {};
function useHydrated(): boolean {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

function getRouteComponent(route: RoutePath): React.ReactNode {
  switch (route) {
    // Auth
    case 'landing': return <LandingPage />;
    case 'login': return <LoginPage />;
    case 'register': return <RegisterPage />;
    case 'onboarding': return <OnboardingPage />;

    // Farmer
    case 'farmer/dashboard': return <FarmerDashboard />;
    case 'farmer/my-farm': return <MyFarmPage />;
    case 'farmer/farm-details': return <FarmDetailsPage />;
    case 'farmer/soil-health': return <SoilHealthPage />;
    case 'farmer/crop-recommendations': return <CropRecommendationsPage />;
    case 'farmer/disease-detection': return <DiseaseDetectionPage />;
    case 'farmer/fertilizer': return <FertilizerPage />;
    case 'farmer/irrigation': return <IrrigationPage />;
    case 'farmer/weather': return <WeatherPage />;
    case 'farmer/market-prices': return <MarketPricesPage />;
    case 'farmer/sell': return <FarmerSellPage />;
    case 'farmer/collection-centers': return <FarmerCollectionCentersPage />;
    case 'farmer/orders': return <FarmerOrdersPage />;
    case 'farmer/payments': return <FarmerPaymentsPage />;
    case 'farmer/notifications': return <NotificationsPage />;
    case 'farmer/profile': return <FarmerProfilePage />;

    // Marketplace
    case 'marketplace/home': return <MarketplaceHome />;
    case 'marketplace/seeds': return <SeedsPage />;
    case 'marketplace/products': return <ProductsPage />;
    case 'marketplace/product-detail': return <ProductDetailPage />;
    case 'marketplace/cart': return <CartPage />;
    case 'marketplace/checkout': return <CheckoutPage />;
    case 'marketplace/order-tracking': return <OrderTrackingPage />;

    // Consumer
    case 'consumer/dashboard': return <ConsumerDashboard />;
    case 'consumer/orders': return <ConsumerOrdersPage />;
    case 'consumer/profile': return <ConsumerProfilePage />;

    // Collection Center
    case 'collection-center/dashboard': return <CCDashboard />;
    case 'collection-center/inventory': return <CCInventory />;
    case 'collection-center/incoming': return <CCIncoming />;
    case 'collection-center/quality-check': return <CCQualityCheck />;
    case 'collection-center/payouts': return <CCPayouts />;

    // Expert
    case 'expert/dashboard': return <ExpertDashboard />;
    case 'expert/disease-cases': return <ExpertDiseaseCases />;
    case 'expert/advisories': return <ExpertAdvisories />;

    // Admin
    case 'admin/dashboard': return <AdminDashboard />;
    case 'admin/users': return <AdminUsers />;
    case 'admin/farmers': return <AdminFarmers />;
    case 'admin/products': return <AdminProducts />;
    case 'admin/orders': return <AdminOrders />;
    case 'admin/collection-centers': return <AdminCollectionCenters />;
    case 'admin/analytics': return <AdminAnalytics />;

    // Settings
    case 'settings': return <SettingsPage />;

    default: return <LandingPage />;
  }
}

function getLayout(route: RoutePath, children: React.ReactNode): React.ReactNode {
  const user = useAuthStore.getState().user;
  if (!user) return children;

  if (route.startsWith('farmer/')) return <FarmerLayout>{children}</FarmerLayout>;
  return <DashboardLayout>{children}</DashboardLayout>;
}

export default function AppRouter() {
  const { user, isAuthenticated } = useAuthStore();
  const { currentRoute, navigate } = useAppStore();
  const mounted = useHydrated();

  if (!mounted) {
    return <LoadingState />;
  }

  // Show landing for unauthenticated users on protected routes
  const isPublicRoute = publicRoutes.includes(currentRoute);
  const isOnboarding = currentRoute === 'onboarding';

  if (!isAuthenticated && !isPublicRoute && !isOnboarding) {
    return <LandingPage />;
  }

  const pageContent = getRouteComponent(currentRoute);
  const layout = getLayout(currentRoute, pageContent);
  const showAIChat = isAuthenticated && (user?.role === 'farmer');

  return (
    <div className='min-h-screen bg-background'>
      {layout}
      {showAIChat && <AIChatPanel />}
    </div>
  );
}
