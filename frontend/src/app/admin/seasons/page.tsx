'use client';

import { useState, useEffect } from 'react';
import { getSeasons, createSeason, updateSeason, deleteSeason, Season } from '@/lib/api';

export default function SeasonsPage() {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSeason, setEditingSeason] = useState<Season | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    start_date: '',
    end_date: '',
    daily_price: 0,
    is_default: false,
  });

  useEffect(() => {
    loadSeasons();
  }, []);

  async function loadSeasons() {
    try {
      const data = await getSeasons();
      setSeasons(data || []);
    } catch (error) {
      console.error('Failed to load seasons:', error);
    } finally {
      setLoading(false);
    }
  }

  function openModal(season?: Season) {
    if (season) {
      setEditingSeason(season);
      setFormData({
        name: season.name,
        start_date: season.start_date,
        end_date: season.end_date,
        daily_price: season.daily_price,
        is_default: season.is_default,
      });
    } else {
      setEditingSeason(null);
      setFormData({
        name: '',
        start_date: '',
        end_date: '',
        daily_price: 0,
        is_default: false,
      });
    }
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (editingSeason) {
        await updateSeason(editingSeason.id, formData);
      } else {
        await createSeason(formData);
      }
      await loadSeasons();
      setShowModal(false);
    } catch (error) {
      console.error('Failed to save season:', error);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this season?')) return;
    try {
      await deleteSeason(id);
      await loadSeasons();
    } catch (error) {
      console.error('Failed to delete season:', error);
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
        <h1 className="text-3xl font-bold text-gray-900">Seasonal Pricing</h1>
        <button
          onClick={() => openModal()}
          className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition"
        >
          + Add Season
        </button>
      </div>

      {/* Seasons Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {seasons.map((season) => (
          <div key={season.id} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{season.name}</h3>
                {season.is_default && (
                  <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                    Default
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openModal(season)}
                  className="text-gray-400 hover:text-primary-600 transition"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(season.id)}
                  className="text-gray-400 hover:text-red-600 transition"
                >
                  🗑️
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              {season.start_date} → {season.end_date}
            </p>
            <p className="text-3xl font-bold text-primary-600">${season.daily_price}</p>
            <p className="text-sm text-gray-500">per night</p>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingSeason ? 'Edit Season' : 'Add Season'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., Peak Season"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date (MM-DD)</label>
                  <input
                    type="text"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="12-15"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date (MM-DD)</label>
                  <input
                    type="text"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="01-10"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Daily Price ($)</label>
                <input
                  type="number"
                  value={formData.daily_price}
                  onChange={(e) => setFormData({ ...formData, daily_price: Number(e.target.value) })}
                  required
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_default"
                  checked={formData.is_default}
                  onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <label htmlFor="is_default" className="text-sm text-gray-700">Set as default season</label>
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
                  {editingSeason ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
