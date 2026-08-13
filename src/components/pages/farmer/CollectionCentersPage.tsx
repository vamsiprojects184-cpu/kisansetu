'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/store/use-app-store';
import { mockCollectionCenters } from '@/data/mock-data';
import { PageHeader, EmptyState } from '@/components/shared/SharedComponents';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, Navigation, CheckCircle2 } from 'lucide-react';

export function FarmerCollectionCentersPage() {
  const { navigate } = useAppStore();
  const [search, setSearch] = useState('');
  const [selectedCenter, setSelectedCenter] = useState<string | null>(null);

  const filtered = mockCollectionCenters.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.address.toLowerCase().includes(search.toLowerCase())
  );

  const center = selectedCenter ? mockCollectionCenters.find(c => c.id === selectedCenter) : null;

  if (center) {
    return (
      <div>
        <button onClick={() => setSelectedCenter(null)} className='text-sm text-muted-foreground hover:text-foreground mb-4 flex items-center gap-1'>
          ← Back to Centers
        </button>
        <PageHeader title={center.name} subtitle={center.address} />

        <div className='grid gap-6 lg:grid-cols-2'>
          <div className='space-y-4'>
            <Card>
              <CardContent className='p-4'>
                <h3 className='font-semibold mb-3 flex items-center gap-2'>📍 Location</h3>
                <div className='bg-muted rounded-xl h-48 flex items-center justify-center text-muted-foreground'>
                  <div className='text-center'>
                    <MapPin size={32} className='mx-auto mb-2 opacity-50' />
                    <p className='text-sm'>Map View</p>
                    <p className='text-xs'>{center.address}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className='p-4 space-y-3'>
                <h3 className='font-semibold flex items-center gap-2'>🕐 Operating Hours</h3>
                <p className='text-sm text-muted-foreground'>{center.operatingHours}</p>
                <div className='flex items-center gap-2'>
                  <span className={cn('w-2.5 h-2.5 rounded-full', center.isOpen ? 'bg-emerald-500' : 'bg-red-500')} />
                  <span className='text-sm'>{center.isOpen ? 'Open Now' : 'Closed'}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className='p-4 space-y-3'>
                <h3 className='font-semibold'>📞 Contact</h3>
                <p className='text-sm text-muted-foreground'>{center.phone}</p>
              </CardContent>
            </Card>
          </div>

          <div className='space-y-4'>
            <Card>
              <CardContent className='p-4 space-y-3'>
                <h3 className='font-semibold'>📦 Accepted Crops</h3>
                <div className='flex flex-wrap gap-2'>
                  {center.acceptedCrops.map(crop => (
                    <Badge key={crop} variant='secondary' className='text-sm'>{crop}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className='p-4 space-y-3'>
                <h3 className='font-semibold'>📊 Capacity</h3>
                <div className='space-y-2'>
                  <div className='flex justify-between text-sm'>
                    <span className='text-muted-foreground'>Current Load</span>
                    <span className='font-medium'>{center.currentCapacity}%</span>
                  </div>
                  <div className='h-3 rounded-full bg-muted overflow-hidden'>
                    <div
                      className='h-full rounded-full transition-all'
                      style={{
                        width: `${center.currentCapacity}%`,
                        backgroundColor: center.currentCapacity > 80 ? '#ef4444' : center.currentCapacity > 60 ? '#f59e0b' : '#16a34a',
                      }}
                    />
                  </div>
                  <p className='text-xs text-muted-foreground'>{center.maxCapacity - center.currentCapacity} slots available</p>
                </div>
              </CardContent>
            </Card>

            <div className='flex gap-3'>
              <Button onClick={() => navigate('farmer/sell')} className='flex-1 gradient-green border-0'>
                Submit Product
              </Button>
              <Button variant='outline' className='flex-1 flex items-center gap-2'>
                <Navigation size={16} /> Directions
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title='Collection Centers' subtitle='Find nearby centers to sell your produce' />

      <div className='relative mb-6'>
        <Input
          placeholder='Search collection centers...'
          value={search}
          onChange={e => setSearch(e.target.value)}
          className='pl-10'
        />
        <MapPin size={18} className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground' />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon='🏢' title='No Centers Found' description='Try a different search term' />
      ) : (
        <div className='grid gap-4 sm:grid-cols-2'>
          {filtered.map((center, idx) => (
            <motion.div
              key={center.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card
                className='hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer'
                onClick={() => setSelectedCenter(center.id)}
              >
                <CardContent className='p-4'>
                  <div className='flex items-start justify-between mb-3'>
                    <div>
                      <h3 className='font-semibold'>{center.name}</h3>
                      <p className='text-sm text-muted-foreground flex items-center gap-1 mt-1'>
                        <MapPin size={14} /> {center.distance} km away
                      </p>
                    </div>
                    <Badge variant={center.isOpen ? 'default' : 'secondary'} className={center.isOpen ? 'bg-emerald-100 text-emerald-700' : ''}>
                      {center.isOpen ? 'Open' : 'Closed'}
                    </Badge>
                  </div>

                  <p className='text-xs text-muted-foreground mb-3'>{center.address}</p>

                  <div className='flex items-center gap-2 mb-3 text-xs text-muted-foreground'>
                    <Clock size={14} />
                    <span>{center.operatingHours}</span>
                  </div>

                  <div className='flex items-center justify-between'>
                    <div className='flex flex-wrap gap-1'>
                      {center.acceptedCrops.slice(0, 3).map(crop => (
                        <Badge key={crop} variant='outline' className='text-xs'>{crop}</Badge>
                      ))}
                      {center.acceptedCrops.length > 3 && (
                        <Badge variant='outline' className='text-xs'>+{center.acceptedCrops.length - 3}</Badge>
                      )}
                    </div>
                  </div>

                  <div className='mt-3 pt-3 border-t'>
                    <div className='flex justify-between text-xs mb-1'>
                      <span className='text-muted-foreground'>Capacity</span>
                      <span>{center.currentCapacity}%</span>
                    </div>
                    <div className='h-1.5 rounded-full bg-muted overflow-hidden'>
                      <div
                        className='h-full rounded-full'
                        style={{
                          width: `${center.currentCapacity}%`,
                          backgroundColor: center.currentCapacity > 80 ? '#ef4444' : '#16a34a',
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
