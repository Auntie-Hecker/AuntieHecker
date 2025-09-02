# Auntie Hecker – Blocklists (20250820-054100)

This directory contains generated blocklists and filters derived from the **canonical IOC master**.
All lists are public-safe (PII redacted). Indicators include IPs, domains, and URL hosts.

## Files
- `dns/`
  - `PiHole_adlist_AuntieHecker_20250820-054100.txt` – domains, one per line
  - `PiHole_regex_AuntieHecker_20250820-054100.txt` – RE2 regex for wildcard subdomains
  - `Unbound_blocklist_AuntieHecker_20250820-054100.conf` – `local-zone: "domain" always_nxdomain`
- `windows_firewall/`
  - `WindowsFirewall_Blocklist_IOCs_20250820-054100.ps1` – adds outbound block rules for IOC IPs
- `netguard/`
  - `NetGuard_Blocklist_IOCs_20250820-054100.txt` – hosts-style file mapping to 0.0.0.0
- `../filters/`
  - `Wireshark_DisplayFilter_IOCs_20250820-054100.txt` – display filter for quick hunting

## Maintenance
- Regenerate these after every IOC master update and commit with a new timestamped filename.
- Keep a rolling history; prune older drops if repo size becomes an issue.
- For Pi-hole, use adlist + regex for best coverage; monitor CPU for large regex sets.
- For Windows Firewall, domains/URLs are documented but not directly blockable—resolve and block IPs or use DNS blocks.

## Provenance
- Source: `Auntie_Hecker_IOC_Masterlist_UPDATED_20250820-053019.csv` (canonical master at generation time).