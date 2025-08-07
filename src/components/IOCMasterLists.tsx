import React, { useState, useEffect, useCallback } from 'react';

interface IOCStats {
  type: string;
  count: number;
}

interface IOC {
  value: string;
  type: string;
  lastSeen: string;
}

const IOCMasterLists: React.FC = () => {
  const [stats, setStats] = useState<IOCStats[]>([]);
  const [iocs, setIocs] = useState<IOC[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/ioc-stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchIOCs = useCallback(async () => {
    setLoading(true);
    try {
      const url = new URL('http://localhost:3001/api/iocs');
      url.searchParams.append('page', currentPage.toString());
      url.searchParams.append('limit', '20');
      if (selectedType) {
        url.searchParams.append('type', selectedType);
      }

      const response = await fetch(url.toString());
      if (response.ok) {
        const data = await response.json();
        setIocs(data);
      }
    } catch (error) {
      console.error('Failed to fetch IOCs:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedType, currentPage]);

  useEffect(() => {
    fetchIOCs();
  }, [fetchIOCs]);

  const handleTypeFilter = (type: string) => {
    setSelectedType(type === selectedType ? '' : type);
    setCurrentPage(1);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <section id="ioc-master-lists" style={{ padding: '2rem 0' }}>
      <h2>IOC Master Lists</h2>
      
      {/* Statistics Section */}
      <div style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}>
        <h3>IOC Statistics</h3>
        {stats.length > 0 ? (
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {stats.map((stat) => (
              <div
                key={stat.type}
                onClick={() => handleTypeFilter(stat.type)}
                style={{
                  padding: '0.5rem 1rem',
                  border: `2px solid ${selectedType === stat.type ? '#007bff' : '#ddd'}`,
                  borderRadius: '4px',
                  cursor: 'pointer',
                  backgroundColor: selectedType === stat.type ? '#e3f2fd' : '#f8f9fa',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
                  {stat.type}s
                </div>
                <div style={{ fontSize: '1.2em', color: '#007bff' }}>
                  {stat.count}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No IOC data available. Upload IOC files to see statistics.</p>
        )}
        
        <button
          onClick={fetchStats}
          style={{
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Refresh Stats
        </button>
      </div>

      {/* IOC List Section */}
      <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}>
        <h3>
          Recent IOCs 
          {selectedType && (
            <span style={{ fontSize: '0.8em', color: '#666' }}>
              - Filtered by {selectedType}
            </span>
          )}
        </h3>
        
        {loading ? (
          <p>Loading IOCs...</p>
        ) : iocs.length > 0 ? (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa' }}>
                    <th style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'left' }}>
                      Type
                    </th>
                    <th style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'left' }}>
                      Value
                    </th>
                    <th style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'left' }}>
                      Last Seen
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {iocs.map((ioc, index) => (
                    <tr key={index}>
                      <td style={{ 
                        padding: '0.5rem', 
                        border: '1px solid #ddd',
                        textTransform: 'capitalize',
                        fontWeight: 'bold'
                      }}>
                        {ioc.type}
                      </td>
                      <td style={{ 
                        padding: '0.5rem', 
                        border: '1px solid #ddd',
                        fontFamily: 'monospace',
                        wordBreak: 'break-all'
                      }}>
                        {ioc.value}
                      </td>
                      <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>
                        {formatDate(ioc.lastSeen)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                style={{
                  marginRight: '0.5rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: currentPage === 1 ? '#6c757d' : '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                }}
              >
                Previous
              </button>
              <span style={{ margin: '0 1rem' }}>Page {currentPage}</span>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={iocs.length < 20}
                style={{
                  marginLeft: '0.5rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: iocs.length < 20 ? '#6c757d' : '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: iocs.length < 20 ? 'not-allowed' : 'pointer'
                }}
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <p>No IOCs found. Upload IOC data to populate the database.</p>
        )}
      </div>
    </section>
  );
};

export default IOCMasterLists;
