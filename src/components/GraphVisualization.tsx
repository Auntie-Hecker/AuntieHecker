import React, { useEffect, useRef, useState } from 'react';

interface GraphData {
  nodes: Array<{
    id: string;
    label: string;
    group: string;
    title: string;
  }>;
  edges: Array<{
    from: string;
    to: string;
    label: string;
    arrows: string;
  }>;
}

// Declare vis-network types to avoid TypeScript issues
declare global {
  interface Window {
    vis: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  }
}

const GraphVisualization: React.FC = () => {
  const networkRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [network, setNetwork] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [visLoaded, setVisLoaded] = useState(false);

  const loadVisNetwork = () => {
    if (window.vis) {
      setVisLoaded(true);
      return;
    }

    // Load vis-network from CDN
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/vis-network/standalone/umd/vis-network.min.js';
    script.onload = () => setVisLoaded(true);
    document.head.appendChild(script);
  };

  const fetchGraphData = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/graph-data');
      if (response.ok) {
        const data = await response.json();
        setGraphData(data);
      }
    } catch (error) {
      console.error('Failed to fetch graph data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVisNetwork();
    fetchGraphData();
  }, []);

  useEffect(() => {
    if (!graphData || !networkRef.current || !visLoaded || !window.vis) return;

    // Create datasets using vis DataSet
    const nodes = new window.vis.DataSet(graphData.nodes);
    const edges = new window.vis.DataSet(graphData.edges.map(edge => ({
      ...edge,
      id: `${edge.from}-${edge.to}` // Add unique ID for edges
    })));

    // Network configuration
    const options = {
      nodes: {
        shape: 'dot',
        size: 16,
        font: {
          size: 12,
          color: '#000000'
        },
        borderWidth: 2,
        shadow: true
      },
      edges: {
        width: 2,
        color: { inherit: 'from' },
        smooth: {
          type: 'continuous'
        },
        arrows: {
          to: { enabled: true, scaleFactor: 1, type: 'arrow' }
        },
        font: {
          size: 8,
          align: 'middle'
        }
      },
      groups: {
        domain: {
          color: { background: '#FF6B6B', border: '#FF5252' }
        },
        ip: {
          color: { background: '#4ECDC4', border: '#26A69A' }
        },
        hash: {
          color: { background: '#45B7D1', border: '#2196F3' }
        },
        source: {
          color: { background: '#96CEB4', border: '#66BB6A' }
        }
      },
      physics: {
        enabled: true,
        stabilization: { iterations: 100 },
        barnesHut: {
          gravitationalConstant: -2000,
          springConstant: 0.001,
          springLength: 200
        }
      },
      interaction: {
        hover: true,
        tooltipDelay: 200,
        hideEdgesOnDrag: false,
        hideNodesOnDrag: false
      }
    };

    // Create network
    const networkInstance = new window.vis.Network(
      networkRef.current,
      { nodes, edges },
      options
    );

    setNetwork(networkInstance);

    // Cleanup
    return () => {
      networkInstance.destroy();
    };
  }, [graphData, visLoaded]);

  return (
    <section id="graph-visualization" style={{ padding: '2rem 0' }}>
      <h2>IOC Relationship Graph</h2>
      <p>Interactive visualization of IOC relationships and connections</p>
      
      <div style={{ marginBottom: '1rem' }}>
        <button
          onClick={fetchGraphData}
          disabled={loading}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: loading ? '#6c757d' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginRight: '0.5rem'
          }}
        >
          {loading ? 'Loading...' : 'Refresh Graph'}
        </button>
        
        {network && (
          <button
            onClick={() => network.fit()}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Fit to Screen
          </button>
        )}
      </div>

      <div style={{ marginBottom: '1rem', fontSize: '0.9em' }}>
        <strong>Legend:</strong>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <div style={{ 
              width: '16px', 
              height: '16px', 
              backgroundColor: '#FF6B6B', 
              borderRadius: '50%',
              border: '2px solid #FF5252'
            }}></div>
            <span>Domains</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <div style={{ 
              width: '16px', 
              height: '16px', 
              backgroundColor: '#4ECDC4', 
              borderRadius: '50%',
              border: '2px solid #26A69A'
            }}></div>
            <span>IP Addresses</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <div style={{ 
              width: '16px', 
              height: '16px', 
              backgroundColor: '#45B7D1', 
              borderRadius: '50%',
              border: '2px solid #2196F3'
            }}></div>
            <span>Hashes</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <div style={{ 
              width: '16px', 
              height: '16px', 
              backgroundColor: '#96CEB4', 
              borderRadius: '50%',
              border: '2px solid #66BB6A'
            }}></div>
            <span>Sources</span>
          </div>
        </div>
      </div>

      <div
        ref={networkRef}
        style={{
          width: '100%',
          height: '600px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          backgroundColor: '#f8f9fa'
        }}
      >
        {!graphData && !loading && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: '#666',
            fontSize: '1.1em'
          }}>
            No graph data available. Upload IOC data to visualize relationships.
          </div>
        )}
        {loading && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: '#666',
            fontSize: '1.1em'
          }}>
            Loading graph data...
          </div>
        )}
        {!visLoaded && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: '#666',
            fontSize: '1.1em'
          }}>
            Loading visualization library...
          </div>
        )}
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.9em', color: '#666' }}>
        <p><strong>Instructions:</strong></p>
        <ul>
          <li>Hover over nodes to see details</li>
          <li>Click and drag nodes to reposition them</li>
          <li>Use mouse wheel to zoom in/out</li>
          <li>Click "Fit to Screen" to center and scale the graph</li>
        </ul>
      </div>
    </section>
  );
};

export default GraphVisualization;