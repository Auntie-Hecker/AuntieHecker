# Auntie Hecker - Cybersecurity Forensics Platform

## Project Overview
This is a React + TypeScript + Vite web application for documenting and analyzing cybersecurity incidents, threat intelligence, and digital forensics. The project centers around the "Auntie Hecker" investigation - a real-world forensic analysis of a sophisticated, persistent cyber intrusion.

## Architecture & Key Components

### Core React Structure
- **Single-page application** with component-based sections (no routing)
- **Static layout**: All components render simultaneously in `App.tsx` 
- **Components**: `Home`, `CaseWebs`, `ThreatLogs`, `IOCMasterLists`, `ToolsAndScripts`, `UploadDownloadZone`, `ContactAbout`
- Each component represents a section of the cybersecurity platform

### Data Files & Formats
The project works extensively with cybersecurity data files:
- **IOC data**: CSV files (`auntie-hecker-IOCs.csv`) with IP addresses, domains, hashes
- **Threat reports**: Markdown files with detailed forensic analysis (`AuntieHecker_Threat_Report_2025-07-19.md`)
- **Investigation summaries**: Text files documenting compromise details
- **SpiderFoot exports**: CSV files from reconnaissance tools
- **VirusTotal data**: JSON exports from malware analysis
- **Network captures**: Wireshark filter files

### Core Concept: "6 Degrees of Kevin Bacon for Malware"
The platform's central mission is tracking connection chains in cyber attacks:
- **Person A** downloads file → **File hash** connects to **Domain** → **Domain** resolves to **IP** → **IP** hosts **Additional malware**
- Each IOC should be linkable to show the full attack chain and infrastructure relationships
- Focus on documenting how one compromise leads to discovering broader threat actor infrastructure

### Development Patterns

#### Component Structure
```tsx
// Standard pattern for each section component
const ComponentName: React.FC = () => (
  <section id="component-name" style={{padding: '2rem 0'}}>
    <h2>Section Title</h2>
    {/* Content focused on cybersecurity data presentation */}
  </section>
);
```

#### IOC Management Patterns
- **IOC Categories**: Separate master lists for IPs, domains, file hashes, URLs, email addresses
- **Connection Tracking**: Each IOC should link to related IOCs to show attack progression
- **Source Attribution**: Track which tool/investigation discovered each IOC (`Source_Document` field)
- **Timeline Integration**: Connect IOCs to specific dates and investigation phases

#### Component Functionality Patterns

**IOCMasterLists Component:**
- Tabbed interface for different IOC categories (IPs, Domains, Hashes, etc.)
- Search/filter functionality across IOC types
- Visual connection mapping between related IOCs
- Export capabilities for different security tools

**CaseWebs Component:**
- Interactive network graphs showing IOC relationships
- Timeline view of how one IOC led to discovering others
- "Attack chain" visualization from initial compromise to full infrastructure
- Connection strength indicators based on evidence quality

**ThreatLogs Component:**
- Chronological investigation entries with embedded IOCs
- Cross-references to IOC master lists
- Evidence linking and chain-of-custody documentation
- Investigation milestone tracking

#### File Organization
- `/src/components/` - All React components
- Root directory - Investigation data files (CSVs, markdown reports, text summaries)
- `/analysis/` - Analysis results and processed data
- `/logs/` - Raw log files from investigations
- `/public/` - Static assets and VirusTotal data

## Development Workflow

### Commands
```bash
npm run dev     # Start development server
npm run build   # TypeScript compilation + Vite build
npm run lint    # ESLint with React + TypeScript rules
npm run preview # Preview production build
```

### Key Files to Understand
- `App.tsx` - Main component that imports and renders all sections
- `auntie-hecker-IOCs.csv` - Core IOC database format
- `AuntieHecker_Threat_Report_2025-07-19.md` - Example of detailed forensic documentation
- `package.json` - Project named "auntie_web", React 19 + Vite 7

## Cybersecurity Context
This is NOT a generic web app - it's a forensics documentation platform. When adding features:
- Focus on threat intelligence visualization and IOC management
- Consider data formats from security tools (SpiderFoot, VirusTotal, Wireshark)
- Maintain forensic evidence integrity and traceability
- Support investigation workflows and incident response documentation
- **Connection Mapping**: Always consider how new IOCs relate to existing ones
- **Attack Chain Documentation**: Every feature should support building the narrative from initial compromise to full infrastructure discovery

## Data Processing Workflows

### IOC CSV Format
```csv
IOC_Type,IOC_Value,Source_Document,Related_IOCs,Discovery_Date,Confidence_Level
IP,192.168.1.1,SpiderFoot_scan.csv,domain:example.com;hash:abc123,2025-07-19,High
```

### Connection Chain Example
```
Initial File Download → File Hash → C2 Domain → IP Address → Additional Malware → Infrastructure Network
```

## Future Integration Considerations
- **Security Tool APIs**: Plan for VirusTotal, SpiderFoot, MISP integration
- **Data Export**: Support for STIX/TAXII, OpenIOC, and other threat intelligence formats
- **Collaboration**: Multi-analyst investigation support and evidence sharing
- **Security**: Implement proper data handling for sensitive forensic evidence

## Browser Title & Branding
Note: `index.html` still shows "Vite + React + TS" - should be updated to "Auntie Hecker" for proper branding.