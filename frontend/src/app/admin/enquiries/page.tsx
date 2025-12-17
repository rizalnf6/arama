'use client';

import { useState, useEffect } from 'react';
import { getEnquiries, updateEnquiryStatus, exportEnquiries, Enquiry } from '@/lib/api';

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadEnquiries();
  }, []);

  async function loadEnquiries() {
    try {
      const data = await getEnquiries();
      setEnquiries(data || []);
    } catch (error) {
      console.error('Failed to load enquiries:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(id: string, status: string) {
    try {
      await updateEnquiryStatus(id, status);
      await loadEnquiries();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  }

  async function handleExport() {
    try {
      const blob = await exportEnquiries();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'enquiries.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to export:', error);
    }
  }

  const filteredEnquiries = enquiries.filter(e => {
    if (filter === 'all') return true;
    return e.status === filter;
  });

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
        <h1 className="text-3xl font-bold text-gray-900">Enquiries</h1>
        <button
          onClick={handleExport}
          className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition"
        >
          📥 Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {['all', 'pending', 'confirmed', 'cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg capitalize transition ${
              filter === status
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Enquiries List */}
      {filteredEnquiries.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <span className="text-6xl mb-4 block">📧</span>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Enquiries</h3>
          <p className="text-gray-500">Enquiries from the booking form will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEnquiries.map((enquiry) => (
            <div key={enquiry.id} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{enquiry.name}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      enquiry.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      enquiry.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {enquiry.status}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-4 gap-4 text-sm mb-4">
                    <div>
                      <p className="text-gray-500">Email</p>
                      <p className="text-gray-900">{enquiry.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Phone</p>
                      <p className="text-gray-900">{enquiry.phone || '-'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Dates</p>
                      <p className="text-gray-900">{enquiry.check_in} → {enquiry.check_out}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Guests</p>
                      <p className="text-gray-900">{enquiry.guests}</p>
                    </div>
                  </div>

                  {enquiry.message && (
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <p className="text-sm text-gray-500 mb-1">Message</p>
                      <p className="text-gray-700">{enquiry.message}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold text-primary-600">${enquiry.total_price?.toFixed(2)}</p>
                    <div className="flex gap-2">
                      {enquiry.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(enquiry.id, 'confirmed')}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
                          >
                            ✓ Confirm
                          </button>
                          <button
                            onClick={() => handleStatusChange(enquiry.id, 'cancelled')}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
                          >
                            ✕ Cancel
                          </button>
                        </>
                      )}
                      {enquiry.status === 'confirmed' && (
                        <button
                          onClick={() => handleStatusChange(enquiry.id, 'pending')}
                          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition text-sm"
                        >
                          Reset to Pending
                        </button>
                      )}
                      {enquiry.status === 'cancelled' && (
                        <button
                          onClick={() => handleStatusChange(enquiry.id, 'pending')}
                          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition text-sm"
                        >
                          Reset to Pending
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-400 mt-4">
                Submitted: {new Date(enquiry.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
