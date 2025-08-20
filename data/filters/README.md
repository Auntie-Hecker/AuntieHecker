# Auntie Hecker – Filters (20250820-054100)

`Wireshark_DisplayFilter_IOCs_20250820-054100.txt` is a ready-to-paste display filter:
- Matches IPv4 via `ip.addr == X`, IPv6 via `ipv6.addr == X`
- Matches domains/URL hosts via `frame contains "domain"`

**Usage:** Wireshark → Display Filter bar → paste contents of the file.