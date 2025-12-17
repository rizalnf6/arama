'use client';

import { useState, useEffect } from 'react';
import { getICalURLs, addICalURL, deleteICalURL, syncICalFeeds, getProperties, ICalURL, Property } from '@/lib/api';

export default function CalendarPage() {
  const [icalURLs, setICalURLs] = useState<ICalURL[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    property_id: '',
    url: '',
    source: 'airbnb',
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [urlsData, propertiesData] = await Promise.all([
        getICalURLs(),
        getProperties(),
      ]);
      setICalURLs(urlsData || []);
      setProperties(propertiesData || []);
      if (propertiesData.length > 0 && !formData.property_id) {
        setFormData(prev => ({ ...prev, property_id: propertiesData[0].id }));
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await addICalURL(formData);
      await loadData();
      setShowModal(false);
      setFormData({ ...formData, url: '' });
    } catch (error) {
      console.error('Failed to add iCal URL:', error);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this calendar feed?')) return;
    try {
      await deleteICalURL(id);
      await loadData();
    } catch (error) {
      console.error('Failed to delete iCal URL:', error);
    }
  }

  async function handleSync() {
    setSyncing(true);
    try {
      await syncICalFeeds();
      await loadData();
    } catch (error) {
      console.error('Failed to sync:', error);
    } finally {
      setSyncing(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Calendar Sync</h1>
        <div className="flex gap-4">
          <button
            onClick={handleSync}
            disabled={syncing}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition disabled:opacity-50"
          >
            {syncing ? 'Syncing...' : '🔄 Sync All'}
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition"
          >
            + Add Calendar
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">How iCal Sync Works</h2>
        <p className="text-gray-600 mb-4">
          Add iCal feed URLs from Airbnb, Booking.com, or other platforms. The system will automatically 
          fetch blocked dates and prevent double bookings.
        </p>
        <div className="flex gap-4 text-sm">
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full">Active</span>
          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full">Failed</span>
        </div>
      </div>

      {/* iCal URLs List */}
      {icalURLs.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <span className="text-6xl mb-4 block">📅</span>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Calendar Feeds</h3>
          <p className="text-gray-500 mb-6">Add your first iCal URL to sync external bookings</p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition"
          >
            Add Calendar Feed
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {icalURLs.map((ical) => (
            <div key={ical.id} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className={`w-3 h-3 rounded-full ${ical.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`} />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900 capitalize">{ical.source}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        ical.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {ical.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 truncate max-w-lg">{ical.url}</p>
                    {ical.last_sync && (
                      <p className="text-xs text-gray-400 mt-1">
                        Last synced: {new Date(ical.last_sync).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(ical.id)}
                  className="text-gray-400 hover:text-red-600 transition"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Add Calendar Feed</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Property</label>
                <select
                  value={formData.property_id}
                  onChange={(e) => setFormData({ ...formData, property_id: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  {properties.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                <select
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="airbnb">Airbnb</option>
                  <option value="booking">Booking.com</option>
                  <option value="vrbo">VRBO</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">iCal URL</label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="https://www.airbnb.com/calendar/ical/..."
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                >
                  Add Calendar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
