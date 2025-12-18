import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../api/apiClient';

const PrayerManagement = () => {
  const { token, isReadOnlyAdmin } = useAuth();
  const [prayers, setPrayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedPrayer, setSelectedPrayer] = useState(null);
  const [showPrayerModal, setShowPrayerModal] = useState(false);

  useEffect(() => {
    fetchPrayers();
  }, [currentPage]);

  const fetchPrayers = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/admin/prayers', {
        params: {
          page: currentPage,
          limit: 10
        },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setPrayers(response.data.prayers);
      setTotalPages(response.data.total_pages);
    } catch (err) {
      setError('Failed to fetch prayers');
      console.error('Prayers fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePrayer = async (prayerId) => {
    if (window.confirm('Are you sure you want to delete this prayer?')) {
      try {
        await apiClient.delete(`/admin/prayers/${prayerId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        fetchPrayers();
      } catch (err) {
        setError('Failed to delete prayer');
        console.error('Prayer delete error:', err);
      }
    }
  };

  const openPrayerModal = (prayer) => {
    setSelectedPrayer(prayer);
    setShowPrayerModal(true);
  };

  const PrayerModal = () => {
    if (!selectedPrayer) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-semibold">Prayer Details</h2>
            <button
              onClick={() => setShowPrayerModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <p className="text-gray-900">{selectedPrayer.title}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <p className="text-gray-900 bg-gray-50 p-3 rounded">{selectedPrayer.content}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Author
                </label>
                <p className="text-gray-900">{selectedPrayer.user_name || 'Anonymous'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Anonymous
                </label>
                <p className="text-gray-900">{selectedPrayer.is_anonymous ? 'Yes' : 'No'}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Created
                </label>
                <p className="text-gray-900">
                  {new Date(selectedPrayer.created_at).toLocaleDateString()}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Responses
                </label>
                <p className="text-gray-900">{selectedPrayer.response_count}</p>
              </div>
            </div>
            
            {selectedPrayer.responses && selectedPrayer.responses.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Responses ({selectedPrayer.responses.length})
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedPrayer.responses.map((response) => (
                    <div key={response.id} className="bg-gray-50 p-3 rounded">
                      <p className="text-sm text-gray-800">{response.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(response.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => setShowPrayerModal(false)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Close
            </button>
            <button
              onClick={() => {
                handleDeletePrayer(selectedPrayer.id);
                setShowPrayerModal(false);
              }}
              disabled={isReadOnlyAdmin}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Delete Prayer
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading && prayers.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading prayers...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#3b2a20]">Prayer Management</h1>
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
          <button
            onClick={() => {
              window.open('/api/admin/export/prayers', '_blank');
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 w-full sm:w-auto"
          >
            Export CSV
          </button>
          <div className="text-sm text-gray-600">
            Total: {prayers.length} prayers
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Mobile Prayers Cards */}
      <div className="block md:hidden space-y-4">
        {prayers.map((prayer) => (
          <div key={prayer.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 mb-1">{prayer.title}</h3>
                <p className="text-sm text-slate-600">{prayer.user_name || 'Anonymous'}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    prayer.is_anonymous
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {prayer.is_anonymous ? 'Anonymous' : 'Public'}
                  </span>
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    {prayer.response_count} responses
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Created: {new Date(prayer.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => openPrayerModal(prayer)}
                  className="text-blue-600 hover:text-blue-900 px-3 py-1 rounded hover:bg-blue-50 transition-colors text-sm"
                >
                  View
                </button>
                <button
                  onClick={() => handleDeletePrayer(prayer.id)}
                  disabled={isReadOnlyAdmin}
                  className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-1 rounded hover:bg-red-50 transition-colors text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Prayers List */}
      <div className="hidden md:block bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Anonymous
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Responses
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {prayers.map((prayer) => (
                <tr key={prayer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                      {prayer.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {prayer.user_name || 'Anonymous'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      prayer.is_anonymous 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {prayer.is_anonymous ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{prayer.response_count}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(prayer.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => openPrayerModal(prayer)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDeletePrayer(prayer.id)}
                        disabled={isReadOnlyAdmin}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}

      {prayers.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">No prayers found.</p>
        </div>
      )}

      {/* Prayer Modal */}
      {showPrayerModal && <PrayerModal />}
    </div>
  );
};

export default PrayerManagement;