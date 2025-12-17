'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Property, BedroomConfig, getProperties, getBedroomConfigs, getPropertyAvailability, getPropertyPricing, createEnquiry, PricingResponse } from '@/lib/api';

// Navigation Component
function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      if (isMobileMenuOpen) setIsMobileMenuOpen(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobileMenuOpen]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <a href="/" className={`text-2xl font-serif font-bold ${isScrolled ? 'text-primary-700' : 'text-white'}`}>
            Villa Arama
          </a>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#about" className={`hover:text-primary-500 transition ${isScrolled ? 'text-gray-700' : 'text-white'}`}>About</a>
            <a href="#pricing" className={`hover:text-primary-500 transition ${isScrolled ? 'text-gray-700' : 'text-white'}`}>Pricing</a>
            <a href="#amenities" className={`hover:text-primary-500 transition ${isScrolled ? 'text-gray-700' : 'text-white'}`}>Amenities</a>
            <a href="#booking" className="bg-primary-600 text-white px-6 py-2 rounded-full hover:bg-primary-700 transition">Book Now</a>
          </div>

          <button 
            className={`md:hidden ${isScrolled ? 'text-gray-700' : 'text-white'}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white shadow-lg"
        >
          <div className="px-4 py-4 space-y-4">
            <a href="#about" className="block text-gray-700 hover:text-primary-500">About</a>
            <a href="#pricing" className="block text-gray-700 hover:text-primary-500">Pricing</a>
            <a href="#amenities" className="block text-gray-700 hover:text-primary-500">Amenities</a>
            <a href="#booking" className="block bg-primary-600 text-white px-6 py-2 rounded-full text-center">Book Now</a>
          </div>
        </motion.div>
      )}
    </nav>
  );
}

// Hero Component
function Hero({ property }: { property: Property | null }) {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: property ? `url(${property.image_url})` : 'url(https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1600)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-serif font-bold mb-6"
        >
          {property?.name || 'Villa Arama Riverside'}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl mb-4 text-white/90"
        >
          {property?.tagline || 'Luxury Riverside Retreat in Bali'}
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-lg mb-8 text-white/80 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          {property?.location || 'Ubud, Bali, Indonesia'}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-6 mb-8"
        >
          <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
            <span className="text-lg">🛏️</span>
            <span>{property?.bedrooms || 3} Bedrooms</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
            <span className="text-lg">🚿</span>
            <span>{property?.bathrooms || 3} Bathrooms</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
            <span className="text-lg">👥</span>
            <span>Up to {property?.max_guests || 8} Guests</span>
          </div>
        </motion.div>
        <motion.a
          href="#booking"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition transform hover:scale-105"
        >
          Check Availability
        </motion.a>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </motion.div>
    </section>
  );
}

// About Section
function AboutSection({ property }: { property: Property | null }) {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">About the Villa</h2>
          <div className="w-24 h-1 bg-primary-500 mx-auto mb-6" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              {property?.description || 'Experience tranquility at Villa Arama Riverside, a stunning luxury villa nestled along the banks of a pristine river in Bali. This exclusive retreat offers an unparalleled blend of traditional Balinese architecture and modern luxury amenities.'}
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Wake up to the gentle sounds of flowing water, enjoy breathtaking views from your private terrace, and immerse yourself in the natural beauty that surrounds this exceptional property.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 gap-4"
          >
            {property?.images?.slice(0, 4).map((img, idx) => (
              <div key={idx} className={`rounded-2xl overflow-hidden shadow-lg ${idx === 0 ? 'row-span-2' : ''}`}>
                <img src={img} alt={`Villa view ${idx + 1}`} className="w-full h-full object-cover" />
              </div>
            )) || (
              <>
                <div className="row-span-2 rounded-2xl overflow-hidden shadow-lg">
                  <img src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600" alt="Villa view" className="w-full h-full object-cover" />
                </div>
                <div className="rounded-2xl overflow-hidden shadow-lg">
                  <img src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400" alt="Villa pool" className="w-full h-full object-cover" />
                </div>
                <div className="rounded-2xl overflow-hidden shadow-lg">
                  <img src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=400" alt="Villa bedroom" className="w-full h-full object-cover" />
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Pricing Section
function PricingSection({ bedroomConfigs }: { bedroomConfigs: BedroomConfig[] }) {
  const [seasons] = useState([
    { name: 'Peak Season', period: 'Dec 15 - Jan 10', price: 350, highlight: true },
    { name: 'High Season', period: 'Jul 1 - Aug 31', price: 280, highlight: false },
    { name: 'Regular Season', period: 'Other dates', price: 200, highlight: false },
  ]);

  return (
    <section id="pricing" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">Seasonal Pricing</h2>
          <div className="w-24 h-1 bg-primary-500 mx-auto mb-6" />
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our dynamic pricing ensures you always get the best value. Prices vary by season and bedroom configuration.
          </p>
        </motion.div>

        {/* Season Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {seasons.map((season, idx) => (
            <motion.div
              key={season.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className={`rounded-2xl p-8 text-center ${season.highlight ? 'bg-primary-600 text-white' : 'bg-white shadow-lg'}`}
            >
              <h3 className={`text-2xl font-bold mb-2 ${season.highlight ? 'text-white' : 'text-gray-900'}`}>
                {season.name}
              </h3>
              <p className={`text-sm mb-4 ${season.highlight ? 'text-primary-100' : 'text-gray-500'}`}>
                {season.period}
              </p>
              <div className={`text-4xl font-bold mb-2 ${season.highlight ? 'text-white' : 'text-primary-600'}`}>
                ${season.price}
              </div>
              <p className={`text-sm ${season.highlight ? 'text-primary-100' : 'text-gray-500'}`}>
                per night (base rate)
              </p>
            </motion.div>
          ))}
        </div>

        {/* Bedroom Configurations */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Bedroom Configurations</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {bedroomConfigs.length > 0 ? bedroomConfigs.map((config) => (
              <div key={config.id} className="border border-gray-200 rounded-xl p-6 hover:border-primary-500 transition">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{config.name}</h4>
                <p className="text-sm text-gray-500 mb-3">{config.description}</p>
                <p className="text-sm text-gray-600 mb-2">Up to {config.max_guests} guests</p>
                <p className="text-xl font-bold text-primary-600">
                  {config.price_add === 0 ? 'Base price' : `+$${config.price_add}/night`}
                </p>
              </div>
            )) : (
              <>
                <div className="border border-gray-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">1 Bedroom Suite</h4>
                  <p className="text-sm text-gray-500 mb-3">Cozy suite with one master bedroom</p>
                  <p className="text-sm text-gray-600 mb-2">Up to 2 guests</p>
                  <p className="text-xl font-bold text-primary-600">Base price</p>
                </div>
                <div className="border border-gray-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">2 Bedroom Villa</h4>
                  <p className="text-sm text-gray-500 mb-3">Spacious villa with two bedrooms</p>
                  <p className="text-sm text-gray-600 mb-2">Up to 4 guests</p>
                  <p className="text-xl font-bold text-primary-600">+$75/night</p>
                </div>
                <div className="border border-gray-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">3 Bedroom Estate</h4>
                  <p className="text-sm text-gray-500 mb-3">Full estate with three bedrooms</p>
                  <p className="text-sm text-gray-600 mb-2">Up to 8 guests</p>
                  <p className="text-xl font-bold text-primary-600">+$150/night</p>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Amenities Section
function AmenitiesSection({ property }: { property: Property | null }) {
  const amenities = property?.amenities || [
    'Private Pool', 'River View', 'Air Conditioning', 'Free WiFi', 
    'Full Kitchen', 'Daily Housekeeping', 'Garden', 'BBQ Area', 
    'Yoga Deck', 'Parking'
  ];

  const amenityIcons: Record<string, string> = {
    'Private Pool': '🏊',
    'River View': '🌊',
    'Air Conditioning': '❄️',
    'Free WiFi': '📶',
    'Full Kitchen': '👨‍🍳',
    'Daily Housekeeping': '🧹',
    'Garden': '🌿',
    'BBQ Area': '🍖',
    'Yoga Deck': '🧘',
    'Parking': '🚗',
  };

  return (
    <section id="amenities" className="py-20 bg-primary-900 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">Amenities</h2>
          <div className="w-24 h-1 bg-primary-400 mx-auto mb-6" />
          <p className="text-lg text-primary-200 max-w-2xl mx-auto">
            Everything you need for a perfect stay
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {amenities.map((amenity, idx) => (
            <motion.div
              key={amenity}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="bg-white/10 rounded-xl p-6 text-center backdrop-blur-sm hover:bg-white/20 transition"
            >
              <span className="text-3xl mb-3 block">{amenityIcons[amenity] || '✨'}</span>
              <span className="text-sm">{amenity}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Booking Form Section
function BookingSection({ 
  property, 
  bedroomConfigs, 
  blockedDates 
}: { 
  property: Property | null; 
  bedroomConfigs: BedroomConfig[];
  blockedDates: string[];
}) {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [bedroomConfigId, setBedroomConfigId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [pricing, setPricing] = useState<PricingResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (checkIn && checkOut && property) {
      setLoading(true);
      getPropertyPricing(property.id, checkIn, checkOut, bedroomConfigId)
        .then((data) => setPricing(data as PricingResponse))
        .catch(() => setPricing(null))
        .finally(() => setLoading(false));
    }
  }, [checkIn, checkOut, bedroomConfigId, property]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property) return;

    setSubmitting(true);
    setError('');

    try {
      await createEnquiry({
        property_id: property.id,
        name,
        email,
        phone,
        check_in: checkIn,
        check_out: checkOut,
        guests,
        bedroom_config_id: bedroomConfigId,
        message,
      });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit enquiry');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <section id="booking" className="py-20 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-lg p-12"
          >
            <div className="text-6xl mb-6">🎉</div>
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">Thank You!</h2>
            <p className="text-lg text-gray-600 mb-6">
              Your booking enquiry has been received. We&apos;ll get back to you within 24 hours.
            </p>
            <button
              onClick={() => {
                setSuccess(false);
                setCheckIn('');
                setCheckOut('');
                setName('');
                setEmail('');
                setPhone('');
                setMessage('');
              }}
              className="bg-primary-600 text-white px-8 py-3 rounded-full hover:bg-primary-700 transition"
            >
              Make Another Enquiry
            </button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="booking" className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">Book Your Stay</h2>
          <div className="w-24 h-1 bg-primary-500 mx-auto mb-6" />
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Send us an enquiry and we&apos;ll confirm your booking within 24 hours
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
              {error}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Check-in Date</label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Check-out Date</label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                min={checkIn || new Date().toISOString().split('T')[0]}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Number of Guests</label>
              <select
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bedroom Configuration</label>
              <select
                value={bedroomConfigId}
                onChange={(e) => setBedroomConfigId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select configuration</option>
                {bedroomConfigs.map((config) => (
                  <option key={config.id} value={config.id}>
                    {config.name} {config.price_add > 0 ? `(+$${config.price_add}/night)` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Pricing Display */}
          {pricing && pricing.total_price && (
            <div className="mb-6 p-6 bg-primary-50 rounded-xl border border-primary-100">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Estimated Total ({pricing.nights} nights)</p>
                  <p className="text-3xl font-bold text-primary-600">${pricing.total_price.toFixed(2)}</p>
                </div>
                <div className="text-right text-sm text-gray-500">
                  <p>Avg. ${(pricing.total_price / pricing.nights).toFixed(2)}/night</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number (Optional)</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="+1 234 567 8900"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Message (Optional)</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              placeholder="Any special requests or questions?"
            />
          </div>

          <button
            type="submit"
            disabled={submitting || !checkIn || !checkOut}
            className="w-full bg-primary-600 text-white py-4 rounded-full text-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Sending...' : 'Send Enquiry'}
          </button>
        </motion.form>
      </div>
    </section>
  );
}

// Footer Component
function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-serif font-bold mb-4">Villa Arama</h3>
            <p className="text-gray-400">
              Experience luxury riverside living in the heart of Bali.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#about" className="hover:text-white transition">About</a></li>
              <li><a href="#pricing" className="hover:text-white transition">Pricing</a></li>
              <li><a href="#amenities" className="hover:text-white transition">Amenities</a></li>
              <li><a href="#booking" className="hover:text-white transition">Book Now</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Ubud, Bali, Indonesia</li>
              <li>info@villaarama.com</li>
              <li>+62 123 456 789</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-gray-500">
          <p>© 2024 Villa Arama Riverside. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

// Main Page Component
export default function HomePage() {
  const [property, setProperty] = useState<Property | null>(null);
  const [bedroomConfigs, setBedroomConfigs] = useState<BedroomConfig[]>([]);
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [properties, configs] = await Promise.all([
          getProperties(),
          getBedroomConfigs(),
        ]);

        if (properties.length > 0) {
          setProperty(properties[0]);
          const availability = await getPropertyAvailability(properties[0].id);
          setBlockedDates(availability.blocked_dates || []);
        }
        setBedroomConfigs(configs);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-primary-700">Loading Villa Arama...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero property={property} />
      <AboutSection property={property} />
      <PricingSection bedroomConfigs={bedroomConfigs} />
      <AmenitiesSection property={property} />
      <BookingSection property={property} bedroomConfigs={bedroomConfigs} blockedDates={blockedDates} />
      <Footer />
    </main>
  );
}
