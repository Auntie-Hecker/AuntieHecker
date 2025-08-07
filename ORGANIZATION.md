# AuntieHecker Repository Organization

This document describes the organized file structure of the AuntieHecker cybersecurity investigation project.

## Project Overview

AuntieHecker is a cybersecurity investigation project that combines:
- A React + TypeScript web application for data visualization and analysis
- Investigation reports and documentation
- Indicators of Compromise (IOCs) and threat intelligence data
- Evidence files and screenshots
- Analysis tools and scripts

## Directory Structure

```
/
├── src/                    # React application source code
├── public/                 # Web application public assets
├── reports/                # Investigation reports and summaries
├── iocs/                   # Indicators of Compromise files
├── evidence/               # Screenshots and evidence files
├── analysis/               # Raw analysis data and tools
│   ├── spiderfoot/         # SpiderFoot analysis files
│   ├── raw/                # Raw analysis data
│   └── pixel/              # Pixel analysis data
├── data/                   # Structured data files
│   ├── processed/          # Processed analysis data
│   └── iocs/               # IOC data files
├── scripts/                # Analysis scripts and tools
│   └── ioc-tools/          # IOC processing tools
├── .github/                # GitHub configuration and workflows
└── dist/                   # Built web application (auto-generated)
```

## File Organization

### Reports (`/reports/`)
- Investigation reports and threat assessments
- Summary documents
- Situation analyses

**Files:**
- `AuntieHecker_Threat_Report_2025-07-19.md` - Main threat report
- `AuntieHecker_Threat_Report_Summary.txt` - Executive summary
- `Auntie_Hecker_Situation_Summary.txt` - Situation overview
- `wslandhyperv_investigation_summary.txt` - Windows/Hyper-V investigation
- `summary` - Additional summary data

### IOCs (`/iocs/`)
- Indicators of Compromise files
- Hash files and signatures
- Network filters and rules

**Files:**
- `auntie-hecker-IOCs.csv` - Main IOC list
- `virustotal-iocs.json` - VirusTotal IOC data (renamed from "IOC's VirusTotal.json")
- `virustotal-domains.txt` - VirusTotal domains (renamed from "virustotal Domains of Interest")
- `auntiehecker_cab_hashes.txt` - CAB file hashes
- `auntie_hecker_ioc_filter.wireshark.txt` - Wireshark filters
- `IOCS` - Additional IOC data

### Evidence (`/evidence/`)
- Screenshots and visual evidence
- Investigation artifacts

**Files:**
- `Screenshot_20250721-072745.png` - Investigation screenshot
- `Screenshot_20250721-075930.png` - Investigation screenshot
- `1000000034.png` - Evidence image

### Analysis (`/analysis/`)
- Raw analysis data and tool outputs
- Organized by tool and data type

**SpiderFoot (`/analysis/spiderfoot/`):**
- `spiderfoot-10.csv` - SpiderFoot analysis data (renamed from "SpiderFoot(10).csv")
- `spiderfoot-9.csv` - SpiderFoot analysis data (renamed from "SpiderFoot(9).csv")
- `104.21.53.170SpiderFoot.gexf` - GEXF graph data

### Data (`/data/`)
- Structured and processed data files

**Processed (`/data/processed/`):**
- `FileScan_Report_Links.csv` - File scan report data

### Web Application
**Source (`/src/`):**
- React components and application logic
- TypeScript configuration
- Application assets

**Build Configuration:**
- `package.json` - Node.js dependencies and scripts
- `vite.config.ts` - Vite build configuration
- `tsconfig.*.json` - TypeScript configuration
- `eslint.config.js` - ESLint configuration

## File Naming Conventions

Files have been renamed to follow consistent conventions:
- No spaces in filenames (use hyphens or underscores)
- No special characters like apostrophes
- Descriptive, lowercase names where appropriate
- Consistent file extensions

### Renamed Files:
- `IOC's VirusTotal.json` → `virustotal-iocs.json`
- `virustotal Domains of Interest` → `virustotal-domains.txt`
- `SpiderFoot(10).csv` → `spiderfoot-10.csv`
- `SpiderFoot(9).csv` → `spiderfoot-9.csv`

## Web Application

The React + TypeScript web application can be built and run using standard npm commands:

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint

# Preview production build
npm run preview
```

## Benefits of This Organization

1. **Clear Separation**: Web application files are separate from investigation data
2. **Logical Grouping**: Related files are grouped by purpose and type
3. **Consistent Naming**: Files follow consistent naming conventions
4. **Maintainability**: Easy to find and manage specific types of files
5. **Scalability**: Structure supports adding new investigations and data
6. **Build Compatibility**: Web application builds and runs correctly after reorganization

## Maintenance

When adding new files:
- Place reports in `/reports/`
- Place IOCs in `/iocs/`
- Place evidence in `/evidence/`
- Place analysis data in appropriate `/analysis/` subdirectories
- Follow consistent naming conventions
- Update this documentation if new directories are needed