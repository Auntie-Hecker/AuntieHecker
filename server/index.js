const express = require('express');
const cors = require('cors');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const neo4j = require('neo4j-driver');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Neo4j connection
let driver;
const NEO4J_URI = process.env.NEO4J_URI || 'bolt://localhost:7687';
const NEO4J_USER = process.env.NEO4J_USER || 'neo4j';
const NEO4J_PASSWORD = process.env.NEO4J_PASSWORD || 'password';

// Initialize Neo4j driver
function initNeo4j() {
  try {
    driver = neo4j.driver(NEO4J_URI, neo4j.auth.basic(NEO4J_USER, NEO4J_PASSWORD));
    console.log('Neo4j driver initialized');
  } catch (error) {
    console.error('Failed to initialize Neo4j driver:', error);
  }
}

// Test Neo4j connection
app.get('/api/test-connection', async (req, res) => {
  if (!driver) {
    return res.status(500).json({ error: 'Neo4j driver not initialized' });
  }

  const session = driver.session();
  try {
    const result = await session.run('RETURN "Hello, Neo4j!" as message');
    const message = result.records[0].get('message');
    res.json({ status: 'success', message, connected: true });
  } catch (error) {
    console.error('Neo4j connection test failed:', error);
    res.status(500).json({ error: 'Failed to connect to Neo4j', connected: false });
  } finally {
    await session.close();
  }
});

// Create constraints and indexes for IOCs
async function createConstraints() {
  if (!driver) return;
  
  const session = driver.session();
  try {
    // Create constraints for unique IOCs
    await session.run('CREATE CONSTRAINT ioc_value_unique IF NOT EXISTS FOR (ioc:IOC) REQUIRE ioc.value IS UNIQUE');
    await session.run('CREATE CONSTRAINT domain_name_unique IF NOT EXISTS FOR (d:Domain) REQUIRE d.name IS UNIQUE');
    await session.run('CREATE CONSTRAINT ip_address_unique IF NOT EXISTS FOR (ip:IP) REQUIRE ip.address IS UNIQUE');
    await session.run('CREATE CONSTRAINT hash_value_unique IF NOT EXISTS FOR (h:Hash) REQUIRE h.value IS UNIQUE');
    
    console.log('Neo4j constraints created successfully');
  } catch (error) {
    console.error('Error creating constraints:', error);
  } finally {
    await session.close();
  }
}

// Upload and process IOC CSV file
app.post('/api/upload-iocs', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  if (!driver) {
    return res.status(500).json({ error: 'Neo4j driver not initialized' });
  }

  const session = driver.session();
  let processed = 0;
  let errors = 0;

  try {
    const results = [];
    const filePath = req.file.path;

    // Parse CSV file
    await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', resolve)
        .on('error', reject);
    });

    // Process each IOC
    for (const row of results) {
      try {
        const iocType = row.IOC_Type?.toLowerCase();
        const iocValue = row.IOC_Value;
        const source = row.Source_Document || 'Unknown';

        if (!iocValue || !iocType) {
          errors++;
          continue;
        }

        // Create IOC nodes based on type
        let query;
        let params = { value: iocValue, source: source, timestamp: new Date().toISOString() };

        switch (iocType) {
          case 'domain':
            query = `
              MERGE (d:Domain {name: $value})
              MERGE (ioc:IOC {value: $value, type: 'domain'})
              MERGE (s:Source {name: $source})
              MERGE (ioc)-[:DETECTED_BY]->(s)
              MERGE (ioc)-[:REPRESENTS]->(d)
              SET d.lastSeen = $timestamp, ioc.lastSeen = $timestamp
            `;
            break;
          case 'ip':
            query = `
              MERGE (ip:IP {address: $value})
              MERGE (ioc:IOC {value: $value, type: 'ip'})
              MERGE (s:Source {name: $source})
              MERGE (ioc)-[:DETECTED_BY]->(s)
              MERGE (ioc)-[:REPRESENTS]->(ip)
              SET ip.lastSeen = $timestamp, ioc.lastSeen = $timestamp
            `;
            break;
          case 'hash':
            query = `
              MERGE (h:Hash {value: $value})
              MERGE (ioc:IOC {value: $value, type: 'hash'})
              MERGE (s:Source {name: $source})
              MERGE (ioc)-[:DETECTED_BY]->(s)
              MERGE (ioc)-[:REPRESENTS]->(h)
              SET h.lastSeen = $timestamp, ioc.lastSeen = $timestamp
            `;
            break;
          default:
            query = `
              MERGE (ioc:IOC {value: $value, type: $type})
              MERGE (s:Source {name: $source})
              MERGE (ioc)-[:DETECTED_BY]->(s)
              SET ioc.lastSeen = $timestamp
            `;
            params.type = iocType;
        }

        await session.run(query, params);
        processed++;
      } catch (error) {
        console.error('Error processing IOC:', error);
        errors++;
      }
    }

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    res.json({
      message: 'IOCs processed successfully',
      processed,
      errors,
      total: results.length
    });

  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).json({ error: 'Failed to process file' });
  } finally {
    await session.close();
  }
});

// Get IOC statistics
app.get('/api/ioc-stats', async (req, res) => {
  if (!driver) {
    return res.status(500).json({ error: 'Neo4j driver not initialized' });
  }

  const session = driver.session();
  try {
    const result = await session.run(`
      MATCH (ioc:IOC)
      RETURN 
        ioc.type as type,
        count(ioc) as count
      ORDER BY count DESC
    `);

    const stats = result.records.map(record => ({
      type: record.get('type'),
      count: record.get('count').toNumber()
    }));

    res.json(stats);
  } catch (error) {
    console.error('Error getting IOC stats:', error);
    res.status(500).json({ error: 'Failed to get IOC statistics' });
  } finally {
    await session.close();
  }
});

// Get IOCs with pagination
app.get('/api/iocs', async (req, res) => {
  if (!driver) {
    return res.status(500).json({ error: 'Neo4j driver not initialized' });
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const type = req.query.type;
  const skip = (page - 1) * limit;

  const session = driver.session();
  try {
    let query = `
      MATCH (ioc:IOC)
      ${type ? 'WHERE ioc.type = $type' : ''}
      RETURN ioc.value as value, ioc.type as type, ioc.lastSeen as lastSeen
      ORDER BY ioc.lastSeen DESC
      SKIP $skip LIMIT $limit
    `;

    const params = { skip, limit };
    if (type) params.type = type;

    const result = await session.run(query, params);
    const iocs = result.records.map(record => ({
      value: record.get('value'),
      type: record.get('type'),
      lastSeen: record.get('lastSeen')
    }));

    res.json(iocs);
  } catch (error) {
    console.error('Error getting IOCs:', error);
    res.status(500).json({ error: 'Failed to get IOCs' });
  } finally {
    await session.close();
  }
});

// Get graph data for visualization
app.get('/api/graph-data', async (req, res) => {
  if (!driver) {
    return res.status(500).json({ error: 'Neo4j driver not initialized' });
  }

  const session = driver.session();
  try {
    const result = await session.run(`
      MATCH (ioc:IOC)-[r]-(related)
      RETURN 
        ioc.value as source_value,
        ioc.type as source_type,
        type(r) as relationship,
        related.name as target_value,
        labels(related)[0] as target_type
      LIMIT 100
    `);

    const nodes = new Map();
    const edges = [];

    result.records.forEach(record => {
      const sourceValue = record.get('source_value');
      const sourceType = record.get('source_type');
      const targetValue = record.get('target_value');
      const targetType = record.get('target_type');
      const relationship = record.get('relationship');

      // Add nodes
      nodes.set(sourceValue, {
        id: sourceValue,
        label: sourceValue,
        group: sourceType,
        title: `${sourceType.toUpperCase()}: ${sourceValue}`
      });

      nodes.set(targetValue, {
        id: targetValue,
        label: targetValue,
        group: targetType.toLowerCase(),
        title: `${targetType}: ${targetValue}`
      });

      // Add edge
      edges.push({
        from: sourceValue,
        to: targetValue,
        label: relationship,
        arrows: 'to'
      });
    });

    res.json({
      nodes: Array.from(nodes.values()),
      edges
    });
  } catch (error) {
    console.error('Error getting graph data:', error);
    res.status(500).json({ error: 'Failed to get graph data' });
  } finally {
    await session.close();
  }
});

// Initialize server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  initNeo4j();
  createConstraints();
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  if (driver) {
    await driver.close();
  }
  process.exit(0);
});