# Neo4j Integration Setup Guide

This guide explains how to set up and use the Neo4j integration in AuntieHecker for storing and analyzing IOC (Indicators of Compromise) data.

## Prerequisites

1. **Neo4j Database**: You need access to a Neo4j database instance
   - Local installation: Download from [https://neo4j.com/download/](https://neo4j.com/download/)
   - Neo4j Aura (cloud): Sign up at [https://neo4j.com/cloud/platform/aura-graph-database/](https://neo4j.com/cloud/platform/aura-graph-database/)
   - Docker: `docker run --publish=7474:7474 --publish=7687:7687 --volume=$HOME/neo4j/data:/data neo4j`

## Configuration

1. **Environment Setup**:
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` file** with your Neo4j credentials:
   ```
   NEO4J_URI=bolt://localhost:7687
   NEO4J_USER=neo4j
   NEO4J_PASSWORD=your_password_here
   PORT=3001
   ```

   For Neo4j Aura cloud instances, use the connection URI provided in your Aura console.

## Installation & Running

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the application**:
   ```bash
   npm run dev
   ```
   This starts both the backend server (port 3001) and frontend (port 5173)

3. **Test the connection**:
   - Open the application in your browser
   - Navigate to the "Upload / Download Zone" section
   - Click "Test Connection" to verify Neo4j connectivity

## Usage

### Uploading IOC Data

1. **Prepare your CSV file** with the following format:
   ```csv
   IOC_Type,IOC_Value,Source_Document
   domain,malicious-domain.com,SecurityTool
   ip,192.168.1.100,ThreatIntel
   hash,d41d8cd98f00b204e9800998ecf8427e,VirusTotal
   ```

2. **Upload process**:
   - Go to "Upload / Download Zone"
   - Select your CSV file
   - Click "Upload to Neo4j"
   - Monitor the upload progress and results

### Viewing IOC Data

1. **IOC Master Lists**: View statistics and browse uploaded IOCs
   - Filter by IOC type (domain, ip, hash)
   - Paginate through large datasets
   - See last seen timestamps

2. **Graph Visualization**: Interactive relationship graph
   - Visual representation of IOC connections
   - Color-coded by IOC type
   - Interactive navigation and zoom

## Data Model

The Neo4j database uses the following node types and relationships:

### Node Types
- `IOC`: Central node for each indicator
- `Domain`: Domain name nodes
- `IP`: IP address nodes  
- `Hash`: File hash nodes
- `Source`: Data source nodes

### Relationships
- `IOC -[:REPRESENTS]-> Domain/IP/Hash`: Links IOCs to their actual values
- `IOC -[:DETECTED_BY]-> Source`: Links IOCs to their detection sources

## API Endpoints

The backend provides the following REST API endpoints:

- `GET /api/test-connection`: Test Neo4j connectivity
- `POST /api/upload-iocs`: Upload IOC CSV files
- `GET /api/ioc-stats`: Get IOC statistics by type
- `GET /api/iocs`: Get paginated IOC list with optional filtering
- `GET /api/graph-data`: Get graph visualization data

## Troubleshooting

### Connection Issues
- Verify Neo4j is running and accessible
- Check credentials in `.env` file
- Ensure firewall allows connections to Neo4j ports (7687, 7474)

### Upload Issues
- Verify CSV format matches expected structure
- Check file permissions and size limits
- Monitor server logs for detailed error messages

### Performance
- For large datasets, consider batch processing
- Monitor Neo4j memory usage
- Use indexes for better query performance

## Security Considerations

- Never commit `.env` files to version control
- Use strong passwords for Neo4j
- Consider encryption for production deployments
- Implement proper authentication for the API endpoints

## Data Sources

AuntieHecker supports various IOC data sources:
- SpiderFoot exports
- SecurityTrails data
- VirusTotal feeds
- Custom threat intelligence feeds
- Manual IOC lists

The existing `auntie-hecker-IOCs.csv` file can be uploaded as a starting dataset.