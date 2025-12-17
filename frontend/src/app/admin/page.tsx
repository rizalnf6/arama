'use client';

import { useState, useEffect } from 'react';
import { getEnquiries, getSeasons, getBedroomConfigs, Enquiry, Season, BedroomConfig } from '@/lib/api';

export default function AdminDashboard() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [bedroomConfigs, setBedroomConfigs] = useState<BedroomConfig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [enquiriesData, seasonsData, configsData] = await Promise.all([
          getEnquiries(),
          getSeasons(),
          getBedroomConfigs(),
        ]);
        setEnquiries(enquiriesData || []);
        setSeasons(seasonsData || []);
        setBedroomConfigs(configsData || []);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const pendingEnquiries = enquiries.filter(e => e.status === 'pending').length;
  const confirmedEnquiries = enquiries.filter(e => e.status === 'confirmed').length;
  const totalRevenue = enquiries
    .filter(e => e.status === 'confirmed')
    .reduce((sum, e) => sum + (e.total_price || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Enquiries</p>
              <p className="text-3xl font-bold text-gray-900">{enquiries.length}</p>
            </div>
            <span className="text-3xl">📧</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-3xl font-bold text-yellow-600">{pendingEnquiries}</p>
            </div>
            <span className="text-3xl">⏳</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Confirmed</p>
              <p className="text-3xl font-bold text-green-600">{confirmedEnquiries}</p>
            </div>
            <span className="text-3xl">✅</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Est. Revenue</p>
              <p className="text-3xl font-bold text-primary-600">${totalRevenue.toFixed(0)}</p>
            </div>
            <span className="text-3xl">💰</span>
          </div>
        </div>
      </div>

      {/* Quick Info */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Seasons Overview */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Seasonal Pricing</h2>
          <div className="space-y-3">
            {seasons.map((season) => (
              <div key={season.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{season.name}</p>
                  <p className="text-sm text-gray-500">{season.start_date} - {season.end_date}</p>
                </div>
                <p className="text-lg font-bold text-primary-600">${season.daily_price}/night</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bedroom Configs */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Bedroom Configurations</h2>
          <div className="space-y-3">
            {bedroomConfigs.map((config) => (
              <div key={config.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{config.name}</p>
                  <p className="text-sm text-gray-500">Up to {config.max_guests} guests</p>
                </div>
                <p className="text-lg font-bold text-primary-600">
                  {config.price_add === 0 ? 'Base' : `+$${config.price_add}`}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Enquiries */}
      <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Enquiries</h2>
        {enquiries.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No enquiries yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Dates</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Guests</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Total</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {enquiries.slice(0, 5).map((enquiry) => (
                  <tr key={enquiry.id} className="border-b last:border-0">
                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-900">{enquiry.name}</p>
                      <p className="text-sm text-gray-500">{enquiry.email}</p>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {enquiry.check_in} → {enquiry.check_out}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{enquiry.guests}</td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">${enquiry.total_price?.toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                        enquiry.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                        enquiry.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {enquiry.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
