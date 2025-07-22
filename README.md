## 📜 Full Incident Timeline & History

The July 22, 2025 event is part of a broader and longer-term attack history. Here is a chronological breakdown of relevant incidents and findings:

---

### 🔹 2019-12-07
- **First Recorded Suspicious System Activity**
  - Windows services, file timestamps, and install paths show signs of compromise.
  - Multiple scheduled tasks and registry entries align with this date.
  - Possible initial deployment of persistent backdoor or surveillance VM.

---

### 🔹 2023
- **Lived at 393 Alfred Avenue**
  - The residence was later raided and linked to criminal investigations.
  - Suspected connections between Wi-Fi router activity and compromised endpoints.

---

### 🔹 Mid 2024 to Early 2025
- **Device Tampering and Repeated Infections**
  - Multiple Android and Windows devices show signs of unauthorized control.
  - Evidence of remote access tools (MDM-like control), Hyper-V VMs, and hidden adapters.
  - Routers broadcasting known SSIDs (SHAW-8378B0) even after relocation.

---

### 🔹 June 2025
- **OneDrive and Microsoft Account Abuse**
  - File metadata and audit logs reveal suspicious sync activity and automation.
  - Powershell scripts uncovered modifying Defender, telemetry, and update tasks.

---

### 🔹 July 18, 2025
- **Local Threat Report Created**
  - Uncovered: Hyper-V activity, network adapter spoofing, firewall misconfiguration.
  - Actions taken: Hyper-V disabled, logging restored, monitoring via SpiderFoot.

---

### 🔹 July 19–21, 2025
- **Evidence Collection Expanded**
  - HAR, PCAP, and Android logs archived.
  - Domains like `dotdaplug.com`, `remotewd.com`, and `waconazure.com` identified.
  - Firewall rules adjusted to block >200 domains/IPs.
  - Suspicious Facebook accounts linked to stolen identities and Marketplace listings.

---

### 🔹 July 22, 2025
- **NetGuard Monitoring Begins**
  - Kaspersky blocked by OS permissions, prompting switch to NetGuard.
  - Packet captures show suspicious DNS and outbound HTTPS to Akamai/Azure.
  - Android app masquerading as “Android System” discovered — intercepts screen, boot, and package events.

---

This attack is ongoing. I’ve preserved everything for analysis and cross-referenced it in the reports available in this repository.

"""

# Append this to the cleaned README content and save
final_readme = markdown_report + full_history_summary
final_readme_path = "/mnt/data/README_with_Full_History.md"
Path(final_readme_path).write_text(final_readme)

final_readme_path
