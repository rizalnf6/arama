'use client';

import { useState, useEffect } from 'react';
import { getBedroomConfigs, createBedroomConfig, updateBedroomConfig, deleteBedroomConfig, BedroomConfig } from '@/lib/api';

export default function BedroomConfigsPage() {
  const [configs, setConfigs] = useState<BedroomConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingConfig, setEditingConfig] = useState<BedroomConfig | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price_add: 0,
    max_guests: 2,
    is_default: false,
  });

  useEffect(() => {
    loadConfigs();
  }, []);

  async function loadConfigs() {
    try {
      const data = await getBedroomConfigs();
      setConfigs(data || []);
    } catch (error) {
      console.error('Failed to load configs:', error);
    } finally {
      setLoading(false);
    }
  }

  function openModal(config?: BedroomConfig) {
    if (config) {
      setEditingConfig(config);
      setFormData({
        name: config.name,
        description: config.description,
        price_add: config.price_add,
        max_guests: config.max_guests,
        is_default: config.is_default,
      });
    } else {
      setEditingConfig(null);
      setFormData({
        name: '',
        description: '',
        price_add: 0,
        max_guests: 2,
        is_default: false,
      });
    }
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (editingConfig) {
        await updateBedroomConfig(editingConfig.id, formData);
      } else {
        await createBedroomConfig(formData);
      }
      await loadConfigs();
      setShowModal(false);
    } catch (error) {
      console.error('Failed to save config:', error);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this bedroom configuration?')) return;
    try {
      await deleteBedroomConfig(id);
      await loadConfigs();
    } catch (error) {
      console.error('Failed to delete config:', error);
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
        <h1 className="text-3xl font-bold text-gray-900">Bedroom Configurations</h1>
        <button
          onClick={() => openModal()}
          className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition"
        >
          + Add Configuration
        </button>
      </div>

      {/* Configs Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {configs.map((config) => (
          <div key={config.id} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{config.name}</h3>
                {config.is_default && (
                  <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 text-green-600 text-xs rounded-full">
                    Default
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openModal(config)}
                  className="text-gray-400 hover:text-primary-600 transition"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(config.id)}
                  className="text-gray-400 hover:text-red-600 transition"
                >
                  🗑️
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-4">{config.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Up to {config.max_guests} guests</span>
              <span className="text-xl font-bold text-primary-600">
                {config.price_add === 0 ? 'Base' : `+$${config.price_add}`}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingConfig ? 'Edit Configuration' : 'Add Configuration'}
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
                  placeholder="e.g., 2 Bedroom Villa"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  rows={2}
                  placeholder="Brief description of this configuration"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price Add ($)</label>
                  <input
                    type="number"
                    value={formData.price_add}
                    onChange={(e) => setFormData({ ...formData, price_add: Number(e.target.value) })}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Guests</label>
                  <input
                    type="number"
                    value={formData.max_guests}
                    onChange={(e) => setFormData({ ...formData, max_guests: Number(e.target.value) })}
                    min="1"
                    max="20"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_default"
                  checked={formData.is_default}
                  onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <label htmlFor="is_default" className="text-sm text-gray-700">Set as default configuration</label>
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
                  {editingConfig ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
