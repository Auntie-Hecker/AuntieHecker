Deppy04/auntiehecker
Overview

This repository documents my experience as a victim of a suspected cyber attack, likely tied to the "Auntie Hecker" campaign. I created this public repo to seek help from the security community and share evidence for analysis. The attack was detected around July 22, 2025, and I’m currently using NetGuard (a firewall app) for protection after facing permission issues with Kaspersky Premium.
Background

    Incident Date: Approximately July 22, 2025 (ongoing investigation).
    Suspected Campaign: "Auntie Hecker" - a stealthy threat operation involving techniques like Hyper-V persistence, adapter injection, firewall tampering, and PowerShell abuse (per the attached report).
    Device: Android phone (OS version TBD - please check Settings > About Phone if advising).
    Initial Defense: Attempted Kaspersky Premium, but permission denials prevented full functionality. Switched to paid NetGuard.

Evidence

    Auntie Hecker Threat Intelligence Report: Generated 2025-07-22 22:29:18 UTC, lists high-risk IPs (e.g., 103.224.212.220, 104.244.42.133, 107.161.23.204) and domains (e.g., waconazure.com, remotewd.com, akamaitechologies.com).
    Corrupted Domain Summary: A damaged file with potential domain data (needs re-upload or recreation).
    NetGuard Logs: To be added as I monitor traffic (see below).

Current Actions

    NetGuard Configuration:
        Blocking listed IPs and domains via custom rules.
        Enabling logging to capture suspicious activity.
    Next Steps:
        Testing blocks (e.g., safe attempt to connect to 103.224.212.220).
        Considering a factory reset after data backup.

How You Can Help

I’m not a security expert and need assistance analyzing this attack. Please:

    Review the report and suggest mitigation steps.
    Advise on NetGuard settings or alternative tools.
    Help decode the corrupted domain summary or identify additional IOCs.
    Share recovery tips (e.g., malware removal, safe reset).

Contact

    Repo Owner: Deppy04 (me!)
    Questions: Open an issue here or reply to this repo.
    Spread the Word: Share this link (https://github.com/Deppy04/auntiehecker) on forums like r/cybersecurity or X with #cybersecurity #helpneeded.

Disclaimer

This is a personal project for self-defense and community support. I’m sharing data to learn and recover—please handle with care.

Last Updated: 2025-07-22 18:52 CDT
