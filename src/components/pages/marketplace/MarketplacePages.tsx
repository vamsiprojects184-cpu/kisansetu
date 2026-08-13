'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ShoppingCart, Star, Plus, Minus, Trash2, ChevronRight,
  MapPin, Truck, ShieldCheck, Leaf, ArrowLeft, Check, Package, Search,
  CreditCard, Banknote, Smartphone, Sprout, Calendar, Clock, Tag,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAppStore } from '@/store/use-app-store';
import { useCartStore } from '@/store/use-cart-store';
import { mockSeedProducts, mockConsumerProducts } from '@/data/mock-data';
import { PageHeader, OrderTimeline, fadeIn, fadeInUp, staggerContainer, SectionWrapper, EmptyState } from '@/components/shared/SharedComponents';
import type { Product } from '@/types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// ============== HELPERS ==============
const categoryIcons: Record<string, string> = {
  Vegetables: '🥬',
  Grains: '🌾',
  Spices: '🌶️',
  Fruits: '🍎',
  Organic: '🌱',
  Dairy: '🥚',
  Fibers: '🧵',
};

function getCategoryIcon(category: string) {
  for (const [key, icon] of Object.entries(categoryIcons)) {
    if (category.toLowerCase().includes(key.toLowerCase())) return icon;
  }
  return '📦';
}

function getCategoryColor(category: string) {
  const map: Record<string, string> = {
    Vegetables: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Grains: 'bg-amber-50 text-amber-700 border-amber-200',
    Spices: 'bg-red-50 text-red-700 border-red-200',
    Dairy: 'bg-sky-50 text-sky-700 border-sky-200',
    Organic: 'bg-lime-50 text-lime-700 border-lime-200',
    Fruits: 'bg-orange-50 text-orange-700 border-orange-200',
    Fibers: 'bg-violet-50 text-violet-700 border-violet-200',
  };
  for (const [key, cls] of Object.entries(map)) {
    if (category.toLowerCase().includes(key.toLowerCase())) return cls;
  }
  return 'bg-gray-50 text-gray-700 border-gray-200';
}

function getImageGradient(category: string) {
  const map: Record<string, string> = {
    Vegetables: 'bg-gradient-to-br from-emerald-100 to-green-200',
    Grains: 'bg-gradient-to-br from-amber-100 to-yellow-200',
    Spices: 'bg-gradient-to-br from-red-100 to-orange-200',
    Dairy: 'bg-gradient-to-br from-sky-100 to-blue-200',
    Organic: 'bg-gradient-to-br from-lime-100 to-green-200',
    Fruits: 'bg-gradient-to-br from-orange-100 to-pink-200',
    Fibers: 'bg-gradient-to-br from-violet-100 to-purple-200',
  };
  for (const [key, cls] of Object.entries(map)) {
    if (category.toLowerCase().includes(key.toLowerCase())) return cls;
  }
  return 'bg-gradient-to-br from-gray-100 to-gray-200';
}

function RatingStars({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
  const sz = size === 'sm' ? 'size-3' : 'size-4';
  return (
    <div className='flex items-center gap-0.5'>
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          className={cn(sz, i <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200')}
        />
      ))}
    </div>
  );
}

// ============== 1. MARKETPLACE HOME ==============
const homeCategories = [
  { name: 'Vegetables', icon: '🥬' },
  { name: 'Grains', icon: '🌾' },
  { name: 'Spices', icon: '🌶️' },
  { name: 'Dairy', icon: '🥚' },
  { name: 'Organic', icon: '🌱' },
  { name: 'Seeds', icon: '🌰' },
];

function HomeProductCard({ product }: { product: Product }) {
  const { navigate } = useAppStore();
  const { addToCart } = useCartStore();

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.inStock) return;
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <motion.div {...fadeIn}>
      <Card
        className='hover:shadow-md transition-all hover:-translate-y-0.5 h-full cursor-pointer group'
        onClick={() => navigate('marketplace/product-detail' as any, { productId: product.id })}
      >
        <CardContent className='p-3'>
          {/* Image */}
          <div className={cn('aspect-square rounded-xl flex items-center justify-center mb-3 relative overflow-hidden', getImageGradient(product.category))}>
            <span className='text-5xl group-hover:scale-110 transition-transform duration-300'>
              {getCategoryIcon(product.category)}
            </span>
            {product.isCertified && (
              <div className='absolute top-2 right-2'>
                <Badge className='bg-emerald-500 text-white text-[10px] px-1.5 py-0 gap-0.5'>
                  <ShieldCheck className='size-3' /> Certified
                </Badge>
              </div>
            )}
            {product.qualityScore && product.qualityScore >= 90 && (
              <div className='absolute top-2 left-2'>
                <Badge className='bg-amber-500 text-white text-[10px] px-1.5 py-0'>
                  Premium
                </Badge>
              </div>
            )}
          </div>

          {/* Name */}
          <h3 className='font-medium text-sm leading-tight line-clamp-2 min-h-[2.5rem]'>{product.name}</h3>

          {/* Farmer */}
          {product.farmer && (
            <p className='text-xs text-muted-foreground mt-1 truncate flex items-center gap-1'>
              <Sprout className='size-3 shrink-0' /> {product.farmer}
            </p>
          )}

          {/* Rating */}
          <div className='flex items-center gap-1.5 mt-1.5'>
            <RatingStars rating={product.rating} />
            <span className='text-xs text-muted-foreground'>{product.rating}</span>
          </div>

          {/* Price + Add to Cart */}
          <div className='flex items-center justify-between mt-3'>
            <div>
              <span className='font-bold text-base'>₹{product.price.toLocaleString('en-IN')}</span>
              <span className='text-xs text-muted-foreground'>/{product.unit}</span>
            </div>
            <Button
              size='sm'
              className='rounded-lg text-xs h-8 gap-1'
              onClick={handleAdd}
              disabled={!product.inStock}
            >
              <ShoppingCart className='size-3' />
              {product.inStock ? 'Add' : 'Sold'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function MarketplaceHome() {
  const { navigate } = useAppStore();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const freshToday = mockConsumerProducts.slice(0, 4);
  const directFromFarmers = mockConsumerProducts.slice(4);
  const seasonalPicks = mockSeedProducts.slice(0, 4);

  const handleCategoryClick = (cat: string) => {
    if (cat === 'Seeds') {
      navigate('marketplace/seeds');
    } else {
      setActiveCategory(activeCategory === cat ? null : cat);
    }
  };

  return (
    <div className='space-y-6'>
      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className='relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 p-6 md:p-8 text-white'
      >
        <div className='absolute inset-0 bg-[url("data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.06%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E")] opacity-40' />
        <div className='relative z-10'>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className='text-3xl md:text-4xl font-bold'
          >
            🌿 Fresh from Farms
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className='text-white/80 mt-2 text-sm md:text-base max-w-md'
          >
            Direct from verified farmers to your doorstep. Quality produce at fair prices.
          </motion.p>
        </div>
      </motion.div>

      {/* Search Bar */}
      <div className='relative'>
        <Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground' />
        <Input
          placeholder='Search products, seeds, spices...'
          className='pl-10 rounded-xl h-11'
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Category Pills */}
      <div className='flex gap-2 overflow-x-auto pb-2 scrollbar-none'>
        {homeCategories.map(cat => (
          <button
            key={cat.name}
            onClick={() => handleCategoryClick(cat.name)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition-all',
              activeCategory === cat.name
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background border-border hover:border-primary/30 hover:bg-primary/5'
            )}
          >
            <span>{cat.icon}</span>
            {cat.name}
          </button>
        ))}
      </div>

      {/* Fresh Today */}
      <SectionWrapper
        title='Fresh Today'
        subtitle='Harvested today, delivered tomorrow'
        action={
          <Button
            variant='ghost'
            size='sm'
            className='text-primary'
            onClick={() => navigate('marketplace/products')}
          >
            View All <ChevronRight className='size-4 ml-1' />
          </Button>
        }
      >
        <div className='grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3'>
          {freshToday.map(product => (
            <HomeProductCard key={product.id} product={product} />
          ))}
        </div>
      </SectionWrapper>

      {/* Direct from Farmers */}
      <SectionWrapper
        title='Direct from Farmers'
        subtitle='Skip the middleman, support local farming'
        action={
          <Button
            variant='ghost'
            size='sm'
            className='text-primary'
            onClick={() => navigate('marketplace/products')}
          >
            View All <ChevronRight className='size-4 ml-1' />
          </Button>
        }
      >
        <div className='grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3'>
          {directFromFarmers.map(product => (
            <HomeProductCard key={product.id} product={product} />
          ))}
        </div>
      </SectionWrapper>

      {/* Seasonal Picks */}
      <SectionWrapper
        title='Seasonal Picks'
        subtitle='Seeds & supplies for the current season'
        action={
          <Button
            variant='ghost'
            size='sm'
            className='text-primary'
            onClick={() => navigate('marketplace/seeds')}
          >
            View All Seeds <ChevronRight className='size-4 ml-1' />
          </Button>
        }
      >
        <div className='grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3'>
          {seasonalPicks.map(product => (
            <HomeProductCard key={product.id} product={product} />
          ))}
        </div>
      </SectionWrapper>
    </div>
  );
}

// ============== 2. SEEDS PAGE ==============
const seedCategories = ['All', 'Vegetables', 'Grains', 'Fruits', 'Organic', 'Fibers'];

export function SeedsPage() {
  const { navigate } = useAppStore();
  const { addToCart } = useCartStore();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const filtered = useMemo(() => {
    let products = mockSeedProducts;
    if (filter !== 'All') {
      products = products.filter(p => p.category === filter);
    }
    if (search) {
      const q = search.toLowerCase();
      products = products.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    return products;
  }, [search, filter]);

  return (
    <div className='space-y-6'>
      <PageHeader title='Buy Quality Seeds' subtitle='Certified seeds for better yield' />

      {/* Search + Filter Row */}
      <div className='flex flex-col sm:flex-row gap-3'>
        <div className='relative flex-1'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground' />
          <Input
            placeholder='Search seeds...'
            className='pl-10 rounded-xl h-11'
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className='flex gap-2 overflow-x-auto pb-2 scrollbar-none'>
        {seedCategories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={cn(
              'px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition-all',
              filter === cat
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background border-border hover:border-primary/30 hover:bg-primary/5'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Seed Products Grid */}
      <div className='grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3'>
        {filtered.map((product, idx) => (
          <motion.div key={product.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }}>
            <Card className='hover:shadow-md transition-all hover:-translate-y-0.5 h-full'>
              <CardContent className='p-3'>
                {/* Image */}
                <div className={cn('aspect-square rounded-xl flex items-center justify-center mb-3 relative', getImageGradient(product.category))}>
                  <span className='text-5xl'>{getCategoryIcon(product.category)}</span>
                  {!product.inStock && (
                    <div className='absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center'>
                      <Badge variant='destructive' className='text-xs'>Out of Stock</Badge>
                    </div>
                  )}
                  {product.isCertified && product.inStock && (
                    <div className='absolute top-2 right-2'>
                      <Badge className='bg-emerald-500 text-white text-[10px] px-1.5 py-0 gap-0.5'>
                        <ShieldCheck className='size-3' /> Certified
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Category Badge */}
                <Badge variant='outline' className={cn('text-[10px] px-1.5 py-0 mb-1.5 border', getCategoryColor(product.category))}>
                  {product.category}
                </Badge>

                {/* Name */}
                <h3 className='font-medium text-sm leading-tight line-clamp-2 min-h-[2.5rem]'>{product.name}</h3>

                {/* Rating */}
                <div className='flex items-center gap-1.5 mt-1.5'>
                  <RatingStars rating={product.rating} />
                  <span className='text-xs text-muted-foreground'>{product.rating}</span>
                </div>

                {/* Germination */}
                {product.germination && (
                  <div className='flex items-center gap-1 mt-1.5 text-xs text-muted-foreground'>
                    <Sprout className='size-3 text-emerald-500' />
                    <span>{product.germination} germination</span>
                  </div>
                )}

                {/* Price + Add to Cart */}
                <div className='flex items-center justify-between mt-3'>
                  <div>
                    <span className='font-bold text-base'>₹{product.price.toLocaleString('en-IN')}</span>
                    <span className='text-xs text-muted-foreground'>/{product.unit}</span>
                  </div>
                  <Button
                    size='sm'
                    className='rounded-lg text-xs h-8 gap-1'
                    onClick={() => {
                      if (!product.inStock) return;
                      addToCart(product);
                      toast.success(`${product.name} added to cart!`);
                    }}
                    disabled={!product.inStock}
                  >
                    <ShoppingCart className='size-3' />
                    {product.inStock ? 'Add' : 'Sold'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <EmptyState
          icon='🌰'
          title='No seeds found'
          description='Try adjusting your search or filter criteria'
        />
      )}
    </div>
  );
}

// ============== 3. PRODUCTS PAGE ==============
type SortOption = 'price_asc' | 'price_desc' | 'rating' | 'newest';
const allProductCategories = ['All', 'Vegetables', 'Grains', 'Spices', 'Dairy', 'Organic', 'Fruits', 'Fibers'];

export function ProductsPage() {
  const { navigate } = useAppStore();
  const { addToCart } = useCartStore();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('newest');
  const [category, setCategory] = useState('All');

  const allProducts = useMemo(() => [...mockConsumerProducts, ...mockSeedProducts], []);

  const filtered = useMemo(() => {
    let products = allProducts;
    if (category !== 'All') {
      products = products.filter(p => p.category === category);
    }
    if (search) {
      const q = search.toLowerCase();
      products = products.filter(
        p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || (p.farmer && p.farmer.toLowerCase().includes(q))
      );
    }
    switch (sort) {
      case 'price_asc': products = [...products].sort((a, b) => a.price - b.price); break;
      case 'price_desc': products = [...products].sort((a, b) => b.price - a.price); break;
      case 'rating': products = [...products].sort((a, b) => b.rating - a.rating); break;
      case 'newest': break;
    }
    return products;
  }, [search, sort, category, allProducts]);

  return (
    <div className='space-y-6'>
      <PageHeader title='All Products' subtitle='Browse fresh produce and farm supplies' />

      {/* Search + Sort Row */}
      <div className='flex flex-col sm:flex-row gap-3'>
        <div className='relative flex-1'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground' />
          <Input
            placeholder='Search all products...'
            className='pl-10 rounded-xl h-11'
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <Select value={sort} onValueChange={v => setSort(v as SortOption)}>
          <SelectTrigger className='w-full sm:w-[200px] rounded-xl h-11'>
            <SelectValue placeholder='Sort by' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='price_asc'>Price: Low to High</SelectItem>
            <SelectItem value='price_desc'>Price: High to Low</SelectItem>
            <SelectItem value='rating'>Top Rated</SelectItem>
            <SelectItem value='newest'>Newest First</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className='flex gap-6'>
        {/* Desktop Sidebar */}
        <aside className='hidden lg:block w-48 shrink-0'>
          <Card>
            <CardContent className='p-4'>
              <h3 className='font-semibold text-sm mb-3'>Categories</h3>
              <div className='space-y-1'>
                {allProductCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={cn(
                      'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                      category === cat
                        ? 'bg-primary text-primary-foreground font-medium'
                        : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {cat !== 'All' && <span className='mr-2'>{getCategoryIcon(cat)}</span>}
                    {cat}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </aside>

        {/* Mobile Category Scroll + Product Grid */}
        <div className='flex-1 min-w-0'>
          {/* Mobile Categories */}
          <div className='lg:hidden flex gap-2 overflow-x-auto pb-3 scrollbar-none'>
            {allProductCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={cn(
                  'px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition-all',
                  category === cat
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background border-border hover:border-primary/30 hover:bg-primary/5'
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className='grid grid-cols-2 lg:grid-cols-3 gap-3'>
            {filtered.map((product, idx) => (
              <motion.div key={product.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }}>
                <Card className='hover:shadow-md transition-all hover:-translate-y-0.5 h-full'>
                  <CardContent className='p-3'>
                    <div
                      className={cn('aspect-square rounded-xl flex items-center justify-center mb-3 relative cursor-pointer', getImageGradient(product.category))}
                      onClick={() => navigate('marketplace/product-detail' as any, { productId: product.id })}
                    >
                      <span className='text-5xl'>{getCategoryIcon(product.category)}</span>
                      {!product.inStock && (
                        <div className='absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center'>
                          <Badge variant='destructive' className='text-xs'>Out of Stock</Badge>
                        </div>
                      )}
                      {product.isCertified && product.inStock && (
                        <div className='absolute top-2 right-2'>
                          <Badge className='bg-emerald-500 text-white text-[10px] px-1.5 py-0 gap-0.5'>
                            <ShieldCheck className='size-3' /> Certified
                          </Badge>
                        </div>
                      )}
                    </div>

                    <h3
                      className='font-medium text-sm leading-tight line-clamp-2 min-h-[2.5rem] cursor-pointer'
                      onClick={() => navigate('marketplace/product-detail' as any, { productId: product.id })}
                    >
                      {product.name}
                    </h3>

                    {product.farmer && (
                      <p className='text-xs text-muted-foreground mt-1 truncate flex items-center gap-1'>
                        <Sprout className='size-3 shrink-0' /> {product.farmer}
                      </p>
                    )}

                    <div className='flex items-center gap-1.5 mt-1.5'>
                      <RatingStars rating={product.rating} />
                      <span className='text-xs text-muted-foreground'>{product.rating}</span>
                    </div>

                    <div className='flex items-center justify-between mt-3'>
                      <div>
                        <span className='font-bold'>₹{product.price.toLocaleString('en-IN')}</span>
                        <span className='text-xs text-muted-foreground'>/{product.unit}</span>
                      </div>
                      <Button
                        size='sm'
                        className='rounded-lg text-xs h-8 gap-1'
                        onClick={() => {
                          if (!product.inStock) return;
                          addToCart(product);
                          toast.success(`${product.name} added to cart!`);
                        }}
                        disabled={!product.inStock}
                      >
                        <ShoppingCart className='size-3' />
                        {product.inStock ? 'Add' : 'Sold'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <EmptyState
              icon='🔍'
              title='No products found'
              description='Try adjusting your search or filter'
              action='Browse Marketplace'
              onAction={() => { setSearch(''); setCategory('All'); }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ============== 4. PRODUCT DETAIL PAGE ==============
export function ProductDetailPage() {
  const { navigate, routeParams } = useAppStore();
  const { addToCart } = useCartStore();
  const allProducts = [...mockConsumerProducts, ...mockSeedProducts];
  const product = allProducts.find(p => p.id === routeParams.productId) || mockConsumerProducts[0];
  const [qty, setQty] = useState(1);

  const related = allProducts
    .filter(p => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addToCart(product);
    toast.success(`${qty}x ${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    for (let i = 0; i < qty; i++) addToCart(product);
    navigate('marketplace/checkout');
  };

  return (
    <div className='space-y-6 max-w-4xl'>
      {/* Back Button */}
      <button
        onClick={() => navigate('marketplace/home')}
        className='text-muted-foreground hover:text-foreground text-sm flex items-center gap-1 transition-colors'
      >
        <ArrowLeft className='size-4' /> Back
      </button>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Product Image */}
        <motion.div {...fadeInUp}>
          <Card className='overflow-hidden'>
            <div className={cn('aspect-square flex items-center justify-center', getImageGradient(product.category))}>
              <span className='text-8xl'>{getCategoryIcon(product.category)}</span>
            </div>
          </Card>
        </motion.div>

        {/* Product Info */}
        <motion.div {...fadeInUp} transition={{ delay: 0.1 }} className='space-y-4'>
          {/* Badges */}
          <div className='flex items-center gap-2 flex-wrap'>
            <Badge variant='outline' className={cn('border', getCategoryColor(product.category))}>
              {product.category}
            </Badge>
            {product.isCertified && (
              <Badge className='bg-emerald-500 text-white gap-1'>
                <ShieldCheck className='size-3' /> Certified
              </Badge>
            )}
            {product.qualityScore && (
              <Badge className='bg-amber-500 text-white'>
                Quality: {product.qualityScore}/100
              </Badge>
            )}
          </div>

          {/* Name */}
          <h1 className='text-2xl md:text-3xl font-bold'>{product.name}</h1>

          {/* Rating */}
          <div className='flex items-center gap-2'>
            <RatingStars rating={product.rating} size='md' />
            <span className='font-medium'>{product.rating}</span>
            <span className='text-sm text-muted-foreground'>({product.reviewCount} reviews)</span>
          </div>

          {/* Price */}
          <div className='flex items-baseline gap-1'>
            <span className='text-3xl font-bold'>₹{product.price.toLocaleString('en-IN')}</span>
            <span className='text-muted-foreground'>/{product.unit}</span>
          </div>

          <Separator />

          {/* Farmer/Source Info Card */}
          {product.farmer && (
            <Card className='bg-muted/30'>
              <CardContent className='p-4 flex items-center gap-3'>
                <div className='w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center'>
                  <Sprout className='size-5 text-primary' />
                </div>
                <div>
                  <p className='font-medium text-sm'>{product.farmer}</p>
                  {product.farmerLocation && (
                    <p className='text-xs text-muted-foreground flex items-center gap-1 mt-0.5'>
                      <MapPin className='size-3' /> {product.farmerLocation}
                    </p>
                  )}
                </div>
                {product.harvestDate && (
                  <div className='ml-auto text-right'>
                    <p className='text-xs text-muted-foreground'>Harvested</p>
                    <p className='text-xs font-medium'>{product.harvestDate}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Description */}
          {product.description && (
            <p className='text-sm text-muted-foreground leading-relaxed'>{product.description}</p>
          )}

          {/* Germination for seeds */}
          {product.germination && (
            <div className='flex items-center gap-2 text-sm'>
              <Sprout className='size-4 text-emerald-500' />
              <span className='text-muted-foreground'>Germination Rate:</span>
              <span className='font-semibold text-emerald-600'>{product.germination}</span>
            </div>
          )}

          <Separator />

          {/* Quantity Selector */}
          <div className='flex items-center gap-4'>
            <span className='text-sm font-medium'>Quantity:</span>
            <div className='flex items-center border rounded-xl'>
              <Button variant='ghost' size='icon' className='h-10 w-10' onClick={() => setQty(Math.max(1, qty - 1))}>
                <Minus className='size-4' />
              </Button>
              <span className='w-12 text-center font-semibold'>{qty}</span>
              <Button variant='ghost' size='icon' className='h-10 w-10' onClick={() => setQty(qty + 1)}>
                <Plus className='size-4' />
              </Button>
            </div>
            <span className='text-sm text-muted-foreground'>₹{(product.price * qty).toLocaleString('en-IN')} total</span>
          </div>

          {/* Action Buttons */}
          <div className='flex gap-3 pt-2'>
            <Button
              variant='outline'
              className='flex-1 h-12 rounded-xl gap-2'
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              <ShoppingCart className='size-5' />
              Add to Cart
            </Button>
            <Button
              className='flex-1 h-12 rounded-xl gap-2'
              onClick={handleBuyNow}
              disabled={!product.inStock}
            >
              <CreditCard className='size-5' />
              Buy Now
            </Button>
          </div>

          {!product.inStock && (
            <p className='text-sm text-destructive text-center'>This product is currently out of stock</p>
          )}
        </motion.div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <SectionWrapper title='Related Products' subtitle={`More ${product.category}`}>
          <div className='grid grid-cols-2 lg:grid-cols-4 gap-3'>
            {related.map((p, idx) => {
              const { addToCart: addRelated } = useCartStore.getState();
              return (
                <motion.div key={p.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                  <Card
                    className='hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer'
                    onClick={() => {
                      setQty(1);
                      navigate('marketplace/product-detail' as any, { productId: p.id });
                    }}
                  >
                    <CardContent className='p-3'>
                      <div className={cn('aspect-square rounded-xl flex items-center justify-center mb-2', getImageGradient(p.category))}>
                        <span className='text-4xl'>{getCategoryIcon(p.category)}</span>
                      </div>
                      <h3 className='font-medium text-sm line-clamp-1'>{p.name}</h3>
                      <div className='flex items-center justify-between mt-2'>
                        <span className='font-bold text-sm'>₹{p.price.toLocaleString('en-IN')}</span>
                        <Button
                          size='sm'
                          className='h-7 text-xs gap-1 rounded-lg'
                          onClick={(e) => {
                            e.stopPropagation();
                            addRelated(p);
                            toast.success(`${p.name} added to cart!`);
                          }}
                          disabled={!p.inStock}
                        >
                          <ShoppingCart className='size-3' /> Add
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </SectionWrapper>
      )}
    </div>
  );
}

// ============== 5. CART PAGE ==============
export function CartPage() {
  const { items, updateQuantity, removeFromCart, getTotal, getItemCount } = useCartStore();
  const { navigate } = useAppStore();

  const subtotal = getTotal();
  const deliveryFee = subtotal > 500 ? 0 : 49;
  const total = subtotal + deliveryFee;

  if (items.length === 0) {
    return (
      <div className='space-y-6'>
        <PageHeader title='Shopping Cart' />
        <EmptyState
          icon='🛒'
          title='Your cart is empty'
          description='Browse the marketplace and add fresh products to your cart'
          action='Browse Marketplace'
          onAction={() => navigate('marketplace/home')}
        />
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Shopping Cart'
        subtitle={`${getItemCount()} item${getItemCount() !== 1 ? 's' : ''}`}
      />

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Cart Items */}
        <div className='lg:col-span-2 space-y-3'>
          {items.map(item => (
            <motion.div key={item.product.id} {...fadeIn}>
              <Card>
                <CardContent className='p-4'>
                  <div className='flex items-start gap-4'>
                    {/* Product Image */}
                    <div
                      className={cn('w-16 h-16 md:w-20 md:h-20 rounded-xl flex items-center justify-center shrink-0 cursor-pointer', getImageGradient(item.product.category))}
                      onClick={() => navigate('marketplace/product-detail' as any, { productId: item.product.id })}
                    >
                      <span className='text-3xl'>{getCategoryIcon(item.product.category)}</span>
                    </div>

                    {/* Product Info */}
                    <div className='flex-1 min-w-0'>
                      <h3 className='font-medium text-sm md:text-base truncate'>{item.product.name}</h3>
                      {item.product.farmer && (
                        <p className='text-xs text-muted-foreground mt-0.5 flex items-center gap-1'>
                          <Sprout className='size-3' /> {item.product.farmer}
                        </p>
                      )}
                      <p className='text-sm text-muted-foreground mt-1'>
                        ₹{item.product.price.toLocaleString('en-IN')}/{item.product.unit}
                      </p>

                      {/* Quantity Controls + Remove (Mobile) */}
                      <div className='flex items-center justify-between mt-3 lg:hidden'>
                        <div className='flex items-center border rounded-lg'>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className='px-2.5 py-1.5 hover:bg-muted transition-colors'
                          >
                            <Minus className='size-3' />
                          </button>
                          <span className='w-8 text-center text-sm font-medium'>{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className='px-2.5 py-1.5 hover:bg-muted transition-colors'
                          >
                            <Plus className='size-3' />
                          </button>
                        </div>
                        <div className='flex items-center gap-3'>
                          <p className='font-semibold text-sm'>₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</p>
                          <button
                            onClick={() => { removeFromCart(item.product.id); toast.success('Removed from cart'); }}
                            className='text-muted-foreground hover:text-destructive transition-colors'
                          >
                            <Trash2 className='size-4' />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Quantity Controls + Remove (Desktop) */}
                    <div className='hidden lg:flex flex-col items-end gap-3'>
                      <button
                        onClick={() => { removeFromCart(item.product.id); toast.success('Removed from cart'); }}
                        className='text-muted-foreground hover:text-destructive transition-colors'
                      >
                        <Trash2 className='size-4' />
                      </button>
                      <div className='flex items-center border rounded-lg'>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className='px-2.5 py-1.5 hover:bg-muted transition-colors'
                        >
                          <Minus className='size-3' />
                        </button>
                        <span className='w-8 text-center text-sm font-medium'>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className='px-2.5 py-1.5 hover:bg-muted transition-colors'
                        >
                          <Plus className='size-3' />
                        </button>
                      </div>
                      <p className='font-semibold'>₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Order Summary */}
        <div>
          <Card className='sticky top-4'>
            <CardHeader>
              <CardTitle className='text-base'>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className='space-y-3'>
              <div className='flex justify-between text-sm'>
                <span className='text-muted-foreground'>Subtotal ({getItemCount()} items)</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className='flex justify-between text-sm'>
                <span className='text-muted-foreground'>Delivery Fee</span>
                <span className={deliveryFee === 0 ? 'text-emerald-600 font-medium' : ''}>
                  {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                </span>
              </div>
              {deliveryFee > 0 && (
                <p className='text-xs text-muted-foreground'>Free delivery on orders above ₹500</p>
              )}
              <Separator />
              <div className='flex justify-between font-bold text-lg'>
                <span>Total</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
              <Button
                size='lg'
                className='w-full rounded-xl mt-2'
                onClick={() => navigate('marketplace/checkout')}
              >
                Proceed to Checkout <ChevronRight className='size-4 ml-1' />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ============== 6. CHECKOUT PAGE ==============
type CheckoutStep = 1 | 2 | 3;
const stepLabels = ['Delivery', 'Payment', 'Confirm'];

const paymentMethods = [
  {
    id: 'UPI',
    label: 'UPI',
    icon: Smartphone,
    description: 'Pay via UPI (GPay, PhonePe, Paytm)',
    color: 'bg-violet-50 border-violet-200 text-violet-700',
  },
  {
    id: 'COD',
    label: 'Cash on Delivery',
    icon: Banknote,
    description: 'Pay when your order arrives',
    color: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  },
  {
    id: 'Card',
    label: 'Credit/Debit Card',
    icon: CreditCard,
    description: 'Visa, Mastercard, RuPay',
    color: 'bg-sky-50 border-sky-200 text-sky-700',
  },
];

export function CheckoutPage() {
  const { items, getTotal, placeOrder } = useCartStore();
  const { navigate } = useAppStore();
  const [step, setStep] = useState<CheckoutStep>(1);
  const [payment, setPayment] = useState('UPI');
  const [form, setForm] = useState({ name: '', phone: '', address: '', city: '', pincode: '' });

  const subtotal = getTotal();
  const deliveryFee = subtotal > 500 ? 0 : 49;
  const total = subtotal + deliveryFee;

  const canProceedDelivery = form.name && form.phone && form.address && form.city && form.pincode;

  const handlePlaceOrder = () => {
    if (items.length === 0) { toast.error('Cart is empty!'); return; }
    const fullAddress = `${form.name}, ${form.phone}, ${form.address}, ${form.city} - ${form.pincode}`;
    const order = placeOrder(fullAddress, 'Standard Delivery', payment);
    toast.success(`Order ${order.id} placed successfully!`);
    navigate('marketplace/order-tracking', { orderId: order.id });
  };

  if (items.length === 0) {
    return (
      <div className='space-y-6'>
        <button
          onClick={() => navigate('marketplace/cart')}
          className='text-muted-foreground hover:text-foreground text-sm flex items-center gap-1 transition-colors'
        >
          <ArrowLeft className='size-4' /> Back to Cart
        </button>
        <EmptyState
          icon='🛒'
          title='Your cart is empty'
          description='Add products to your cart before checking out'
          action='Browse Marketplace'
          onAction={() => navigate('marketplace/home')}
        />
      </div>
    );
  }

  return (
    <div className='space-y-6 max-w-3xl'>
      {/* Back Button */}
      <button
        onClick={() => navigate('marketplace/cart')}
        className='text-muted-foreground hover:text-foreground text-sm flex items-center gap-1 transition-colors'
      >
        <ArrowLeft className='size-4' /> Back to Cart
      </button>

      <PageHeader title='Checkout' />

      {/* Progress Steps */}
      <div className='relative'>
        <div className='flex items-center justify-between'>
          {stepLabels.map((label, idx) => {
            const stepNum = (idx + 1) as CheckoutStep;
            const isActive = step === stepNum;
            const isCompleted = step > stepNum;
            return (
              <React.Fragment key={label}>
                <button
                  onClick={() => { if (isCompleted || isActive) setStep(stepNum); }}
                  className='flex flex-col items-center gap-1.5'
                >
                  <div
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all',
                      isCompleted
                        ? 'bg-primary text-primary-foreground border-primary'
                        : isActive
                          ? 'border-primary text-primary bg-primary/5'
                          : 'border-muted-foreground/30 text-muted-foreground'
                    )}
                  >
                    {isCompleted ? <Check className='size-5' /> : stepNum}
                  </div>
                  <span className={cn('text-xs font-medium', isActive ? 'text-primary' : 'text-muted-foreground')}>
                    {label}
                  </span>
                </button>
                {idx < stepLabels.length - 1 && (
                  <div className={cn('flex-1 h-0.5 mx-2 mt-[-1.25rem]', (step > stepNum || (step === stepNum + 1)) ? 'bg-primary' : 'bg-muted')} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Step 1: Delivery Address */}
      {step === 1 && (
        <motion.div {...fadeInUp}>
          <Card>
            <CardHeader>
              <CardTitle className='text-base flex items-center gap-2'>
                <Truck className='size-5 text-primary' /> Delivery Address
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <label className='text-sm font-medium'>Full Name</label>
                  <Input
                    placeholder='Enter your name'
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className='rounded-xl'
                  />
                </div>
                <div className='space-y-2'>
                  <label className='text-sm font-medium'>Phone Number</label>
                  <Input
                    placeholder='+91 9876543210'
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    className='rounded-xl'
                  />
                </div>
              </div>
              <div className='space-y-2'>
                <label className='text-sm font-medium'>Address</label>
                <Input
                  placeholder='House no, Street, Area'
                  value={form.address}
                  onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                  className='rounded-xl'
                />
              </div>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <label className='text-sm font-medium'>City</label>
                  <Input
                    placeholder='Enter city'
                    value={form.city}
                    onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                    className='rounded-xl'
                  />
                </div>
                <div className='space-y-2'>
                  <label className='text-sm font-medium'>Pincode</label>
                  <Input
                    placeholder='500001'
                    value={form.pincode}
                    onChange={e => setForm(f => ({ ...f, pincode: e.target.value }))}
                    className='rounded-xl'
                  />
                </div>
              </div>
              <Button
                className='w-full rounded-xl mt-2'
                onClick={() => {
                  if (!canProceedDelivery) {
                    toast.error('Please fill all fields');
                    return;
                  }
                  setStep(2);
                }}
              >
                Continue to Payment <ChevronRight className='size-4 ml-1' />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Step 2: Payment Method */}
      {step === 2 && (
        <motion.div {...fadeInUp}>
          <Card>
            <CardHeader>
              <CardTitle className='text-base flex items-center gap-2'>
                <CreditCard className='size-5 text-primary' /> Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-3'>
              <RadioGroup value={payment} onValueChange={setPayment} className='space-y-3'>
                {paymentMethods.map(method => {
                  const Icon = method.icon;
                  const isSelected = payment === method.id;
                  return (
                    <label
                      key={method.id}
                      className={cn(
                        'flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all',
                        isSelected
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/30'
                      )}
                    >
                      <RadioGroupItem value={method.id} />
                      <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', method.color)}>
                        <Icon className='size-5' />
                      </div>
                      <div className='flex-1'>
                        <p className='font-medium text-sm'>{method.label}</p>
                        <p className='text-xs text-muted-foreground'>{method.description}</p>
                      </div>
                      {isSelected && <Check className='size-5 text-primary' />}
                    </label>
                  );
                })}
              </RadioGroup>

              <div className='flex gap-3 mt-4'>
                <Button variant='outline' className='flex-1 rounded-xl' onClick={() => setStep(1)}>
                  <ArrowLeft className='size-4 mr-1' /> Back
                </Button>
                <Button className='flex-1 rounded-xl' onClick={() => setStep(3)}>
                  Review Order <ChevronRight className='size-4 ml-1' />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Step 3: Confirm Order */}
      {step === 3 && (
        <motion.div {...fadeInUp} className='space-y-4'>
          {/* Items Summary */}
          <Card>
            <CardHeader>
              <CardTitle className='text-base flex items-center gap-2'>
                <Package className='size-5 text-primary' /> Order Items ({items.length})
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-3'>
              {items.map(item => (
                <div key={item.product.id} className='flex items-center justify-between text-sm'>
                  <div className='flex items-center gap-3 min-w-0'>
                    <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm', getImageGradient(item.product.category))}>
                      {getCategoryIcon(item.product.category)}
                    </div>
                    <span className='truncate'>{item.product.name}</span>
                    <span className='text-muted-foreground shrink-0'>×{item.quantity}</span>
                  </div>
                  <span className='font-medium shrink-0 ml-2'>₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
              <Separator />
              <div className='flex justify-between text-sm'>
                <span className='text-muted-foreground'>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className='flex justify-between text-sm'>
                <span className='text-muted-foreground'>Delivery</span>
                <span className={deliveryFee === 0 ? 'text-emerald-600 font-medium' : ''}>
                  {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                </span>
              </div>
              <Separator />
              <div className='flex justify-between font-bold text-lg'>
                <span>Total</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
            </CardContent>
          </Card>

          {/* Delivery & Payment Summary */}
          <Card>
            <CardContent className='p-4 space-y-2'>
              <div className='flex items-start gap-2 text-sm'>
                <MapPin className='size-4 text-muted-foreground mt-0.5 shrink-0' />
                <div>
                  <p className='font-medium'>Delivery Address</p>
                  <p className='text-muted-foreground'>{form.name}, {form.address}, {form.city} - {form.pincode}</p>
                </div>
              </div>
              <Separator />
              <div className='flex items-center gap-2 text-sm'>
                <CreditCard className='size-4 text-muted-foreground shrink-0' />
                <span className='font-medium'>Payment:</span>
                <span className='text-muted-foreground'>{paymentMethods.find(m => m.id === payment)?.label}</span>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className='flex gap-3'>
            <Button variant='outline' className='flex-1 rounded-xl' onClick={() => setStep(2)}>
              <ArrowLeft className='size-4 mr-1' /> Back
            </Button>
            <Button
              size='lg'
              className='flex-1 rounded-xl'
              onClick={handlePlaceOrder}
            >
              <Check className='size-4 mr-1' /> Place Order · ₹{total.toLocaleString('en-IN')}
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// ============== 7. ORDER TRACKING PAGE ==============
export function OrderTrackingPage() {
  const { navigate, routeParams } = useAppStore();
  const { orders } = useCartStore();
  const order = orders.find(o => o.id === routeParams.orderId);

  if (!order) {
    return (
      <div className='space-y-6'>
        <button
          onClick={() => navigate('marketplace/home')}
          className='text-muted-foreground hover:text-foreground text-sm flex items-center gap-1 transition-colors'
        >
          <ArrowLeft className='size-4' /> Back
        </button>
        <EmptyState
          icon='📦'
          title='Order Not Found'
          description='The order you are looking for does not exist'
          action='Go to Marketplace'
          onAction={() => navigate('marketplace/home')}
        />
      </div>
    );
  }

  const statusColor: Record<string, string> = {
    placed: 'bg-blue-100 text-blue-700',
    preparing: 'bg-amber-100 text-amber-700',
    quality_verified: 'bg-emerald-100 text-emerald-700',
    out_for_delivery: 'bg-violet-100 text-violet-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  return (
    <div className='space-y-6 max-w-2xl'>
      {/* Back Button */}
      <button
        onClick={() => navigate('marketplace/home')}
        className='text-muted-foreground hover:text-foreground text-sm flex items-center gap-1 transition-colors'
      >
        <ArrowLeft className='size-4' /> Back
      </button>

      {/* Order Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
        <div>
          <h1 className='text-2xl font-bold'>{order.id}</h1>
          <p className='text-sm text-muted-foreground flex items-center gap-1 mt-1'>
            <Calendar className='size-3' />
            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        <Badge className={cn('w-fit', statusColor[order.status] || 'bg-gray-100 text-gray-700')}>
          {order.status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
        </Badge>
      </div>

      {/* Order Timeline */}
      <motion.div {...fadeIn}>
        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Order Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <OrderTimeline steps={order.trackingSteps} />
          </CardContent>
        </Card>
      </motion.div>

      {/* Order Items */}
      <motion.div {...fadeInUp}>
        <Card>
          <CardHeader>
            <CardTitle className='text-base flex items-center gap-2'>
              <Package className='size-5 text-primary' /> Order Items
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            {order.items.map(item => (
              <div key={item.product.id} className='flex items-center gap-3'>
                <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center shrink-0', getImageGradient(item.product.category))}>
                  <span className='text-xl'>{getCategoryIcon(item.product.category)}</span>
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='text-sm font-medium truncate'>{item.product.name}</p>
                  <p className='text-xs text-muted-foreground'>
                    Qty: {item.quantity} · ₹{item.product.price.toLocaleString('en-IN')}/{item.product.unit}
                  </p>
                </div>
                <p className='font-semibold text-sm shrink-0'>
                  ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                </p>
              </div>
            ))}
            <Separator />
            <div className='flex justify-between font-bold'>
              <span>Total</span>
              <span>₹{order.total.toLocaleString('en-IN')}</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Delivery Info */}
      <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader>
            <CardTitle className='text-base flex items-center gap-2'>
              <Truck className='size-5 text-primary' /> Delivery Details
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            {order.deliveryAddress && (
              <div className='flex items-start gap-3 text-sm'>
                <MapPin className='size-4 text-muted-foreground mt-0.5 shrink-0' />
                <div>
                  <p className='font-medium'>Delivery Address</p>
                  <p className='text-muted-foreground'>{order.deliveryAddress}</p>
                </div>
              </div>
            )}
            {order.estimatedDelivery && (
              <div className='flex items-center gap-3 text-sm'>
                <Clock className='size-4 text-muted-foreground shrink-0' />
                <div>
                  <p className='font-medium'>Estimated Delivery</p>
                  <p className='text-muted-foreground'>
                    {new Date(order.estimatedDelivery).toLocaleDateString('en-IN', {
                      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            )}
            {order.paymentMethod && (
              <div className='flex items-center gap-3 text-sm'>
                <CreditCard className='size-4 text-muted-foreground shrink-0' />
                <div>
                  <p className='font-medium'>Payment Method</p>
                  <p className='text-muted-foreground'>{order.paymentMethod}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
