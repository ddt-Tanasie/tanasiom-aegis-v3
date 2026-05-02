import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'

const mono = "'Share Tech Mono', monospace"
const display = "'Bebas Neue', sans-serif"
const body = "'Barlow Condensed', sans-serif"
const serif = "'Cormorant Garamond', serif"

// ─────────────────────────────────────────────
// LEGAL PROTECTION LAYER
// ─────────────────────────────────────────────
const LEGAL_DISCLAIMER = `IMPORTANT — PLEASE READ BEFORE DOWNLOADING

These documents are template resources provided by Tanasiom Aegis Security & Compliance ("Tanasiom Aegis"), operated by Dumitru Tanasie, for general guidance purposes only.

BY DOWNLOADING ANY DOCUMENT YOU AGREE THAT:

1. NO CLIENT RELATIONSHIP IS CREATED. Downloading a template does not create a consultancy, advisory, or any other professional relationship between you and Tanasiom Aegis.

2. NOT LEGAL ADVICE. These templates do not constitute legal advice. They have not been reviewed by a solicitor. You should seek independent legal advice before relying on any document for legal, regulatory, or compliance purposes.

3. NO LIABILITY. Tanasiom Aegis accepts no liability whatsoever for any loss, damage, regulatory action, certification failure, data breach, or other consequence arising from your use, misuse, or adaptation of these templates. This limitation applies to the fullest extent permitted by English law.

4. YOUR RESPONSIBILITY TO ADAPT. These templates require customisation for your specific organisation, jurisdiction, systems, and circumstances. Using a template without adaptation does not guarantee compliance with Cyber Essentials, UK GDPR, the Computer Misuse Act 1990, or any other legal or regulatory framework.

5. CE CERTIFICATION. These templates support preparation for Cyber Essentials certification. They do not constitute a CE assessment, guarantee CE certification, or replace the official IASME self-assessment questionnaire. Certification is issued solely by IASME-licensed Certification Bodies.

6. GOVERNING LAW. Any dispute arising from use of these templates is governed by the laws of England and Wales.

Tanasiom Aegis is an independent cybersecurity consultancy. We are not affiliated with NCSC, IASME, or the UK Government.`

// ─────────────────────────────────────────────
// DOCUMENT DATABASE
// ─────────────────────────────────────────────
const DOCS = [
  // ── CE REQUIRED ──────────────────────────
  {
    id: 'POL-001', area: 'All 5 Controls', areaColor: '#1d4ed8',
    tag: 'FOUNDATION', tagColor: '#dc2626',
    title: 'Information Security Policy',
    subtitle: 'Master IS Policy — CE v3.3 / ISO 27001 Aligned',
    pages: '8–12 pages', updated: 'April 2025',
    desc: 'Master information security policy covering governance, responsibilities, acceptable use, incident reporting, and management commitment. The foundation document for all CE certification applications.',
    ceRequired: true,
    content: `INFORMATION SECURITY POLICY
Version: 3.3 | Effective: April 2025 | Review: April 2026
Owner: [CISO / IT Manager / Director] | Classification: INTERNAL

TEMPLATE NOTICE: This document requires adaptation for your specific organisation before use.
Tanasiom Aegis accepts no liability for use of this template. See full disclaimer at tanasiomaegis.co.uk/docs

═══════════════════════════════════════════════════════════

1. PURPOSE AND SCOPE
This Information Security Policy establishes the framework for protecting [Organisation Name]'s
information assets, systems, and data. This policy applies to:

  • All employees, contractors, consultants, and third-party users
  • All information assets owned or managed by [Organisation Name]
  • All IT systems, networks, cloud services, and devices used for business purposes
  • All business locations, remote working environments, and third-party premises

Aligned with: NCSC Cyber Essentials v3.3 (2025), UK GDPR, Data Protection Act 2018,
Computer Misuse Act 1990, NIS Regulations 2018.

2. MANAGEMENT COMMITMENT
The Board of Directors of [Organisation Name] is committed to:
  • Maintaining an effective information security management programme
  • Providing adequate resources for security activities
  • Ensuring compliance with applicable legal and regulatory requirements
  • Reviewing this policy annually or following any significant incident

Signed: _________________________ Date: _________________________
[Director / CISO Name and Title]

3. ROLES AND RESPONSIBILITIES

3.1 Information Security Lead / CISO
  • Overall responsibility for the information security programme
  • Maintaining and reviewing this policy and associated documents
  • Coordinating response to security incidents
  • Ensuring CE certification is maintained annually

3.2 IT Manager / System Administrator
  • Implementing technical security controls
  • Managing patch and vulnerability management processes
  • Configuring firewalls, antivirus, and access controls
  • Maintaining system inventories and asset registers

3.3 All Staff
  • Reading, understanding, and complying with this policy
  • Completing annual security awareness training
  • Reporting suspected security incidents immediately
  • Protecting their login credentials and access devices

4. ACCEPTABLE USE
Permitted: Business activities relevant to role, approved personal use that
does not impact business operations, access to pre-approved cloud services.

Prohibited: Accessing systems beyond authorised level, installing unauthorised
software, sharing passwords, disabling security controls, storing sensitive data
on non-approved devices, using company systems for illegal or inappropriate content.

5. PASSWORD AND AUTHENTICATION POLICY
  • Minimum password length: 12 characters (14+ recommended)
  • Passwords must not be reused across systems or accounts
  • Default and factory-set passwords must be changed immediately
  • MFA is mandatory for all cloud services — CE v3.3 requirement
  • MFA is mandatory for all remote access (VPN, RDP, remote desktop)
  • Password managers (Bitwarden, 1Password) are recommended for all staff

6. DEVICE AND ENDPOINT SECURITY
  • All devices must run a vendor-supported operating system
  • Windows 7, 8, XP — PROHIBITED (end-of-life, CE automatic fail)
  • Automatic screen lock must activate after 5 minutes of inactivity
  • Full-disk encryption (BitLocker / FileVault) is mandatory on laptops
  • All devices must run approved and active anti-malware software

7. PATCH AND VULNERABILITY MANAGEMENT
  • Critical and High vulnerabilities (CVSS ≥7.0): patch within 14 days — CE MANDATORY
  • Medium vulnerabilities: patch within 30 days
  • Automatic updates must be enabled on all devices where available
  • Systems that cannot be patched must be isolated or decommissioned

8. INCIDENT RESPONSE OVERVIEW
  • All suspected incidents must be reported to [IS Lead / IT Manager] immediately
  • Initial triage must begin within 2 hours of report
  • Data breach incidents must be assessed for ICO notification within 72 hours
  • All incidents must be documented in the Incident Register
  • Contact Tanasiom Aegis for incident support: tanasiomaegis@gmail.com

9. POLICY COMPLIANCE
  • Violations may result in disciplinary action up to and including dismissal
  • Wilful breach will be reported to relevant authorities
  • This policy is reviewed annually by [IS Lead] and approved by [Director]
  • All staff confirm receipt and understanding on joining and at annual review`,
  },
  {
    id: 'POL-002', area: 'Firewalls', areaColor: '#dc2626',
    tag: 'CE REQUIRED', tagColor: '#16a34a',
    title: 'Firewall & Network Security Policy',
    subtitle: 'CE Firewalls Control — NCSC CE v3.3',
    pages: '5–7 pages', updated: 'April 2025',
    desc: 'Firewall rules documentation, boundary security, default-deny policy, and change management. Required evidence for the CE Firewalls control area.',
    ceRequired: true,
    content: `FIREWALL AND NETWORK SECURITY POLICY
Version: 2.1 | Effective: April 2025 | Review: April 2026
Owner: [IT Manager / Network Administrator] | Classification: CONFIDENTIAL

TEMPLATE NOTICE: This document requires adaptation for your specific organisation before use.
Tanasiom Aegis accepts no liability for use of this template. See full disclaimer at tanasiomaegis.co.uk/docs

═══════════════════════════════════════════════════════════

1. PURPOSE
This policy establishes requirements for firewall configuration, network access control,
and boundary security. It directly supports compliance with the NCSC CE Firewalls control.

2. CE MANDATORY REQUIREMENTS

2.1 Boundary Firewall
  • A boundary firewall must be in place at every network perimeter
  • Default-deny inbound rule: all inbound traffic blocked unless explicitly permitted
  • All permitted inbound rules must have documented business justification
  • Administrative interfaces must NOT be accessible from the internet
  • The firewall must run vendor-supported firmware/software

2.2 Device Firewall
  • Windows Defender Firewall: enabled on ALL Windows devices — CE mandatory
  • macOS Application Firewall: enabled on all macOS devices — CE mandatory
  • Linux: iptables or nftables rules configured
  • Device firewalls must not be disabled by standard users

2.3 Cloud Security Groups
  • All cloud VMs and services must have security groups / NSGs configured
  • Default-deny applies: only required ports open with documented justification
  • Cloud management consoles must NOT be accessible from 0.0.0.0/0

3. PERMITTED INBOUND PORTS (CUSTOMISE FOR YOUR ORGANISATION)
┌─────────────────────────────────────────────────────────────────┐
│ Port  │ Protocol │ Direction │ Justification         │ Review    │
├─────────────────────────────────────────────────────────────────┤
│ 443   │ TCP      │ Inbound   │ HTTPS web services    │ Permanent │
│ 80    │ TCP      │ Inbound   │ HTTP redirect to HTTPS│ Permanent │
│ 22    │ TCP      │ Inbound   │ SSH — mgmt IPs only   │ Quarterly │
│ ALL   │ ALL      │ Inbound   │ DEFAULT DENY          │ N/A       │
└─────────────────────────────────────────────────────────────────┘
NOTE: All rules must be reviewed quarterly. Remove any without documented justification.

4. AUTOMATIC CE FAILS — PROHIBITED CONFIGURATIONS
  ✗ Telnet (port 23) accessible from internet
  ✗ RDP (port 3389) accessible from internet without VPN
  ✗ Database ports (3306, 5432, 1433) accessible from internet
  ✗ Any port open with no documented business justification
  ✗ Router/firewall management console accessible from internet
  ✗ Default credentials on any network device
  ✗ UPnP enabled on boundary routers

5. FIREWALL CHANGE LOG TEMPLATE
Date | Change | Requested By | Approved By | Justification | Review Date
[Populate for each firewall rule change]`,
  },
  {
    id: 'POL-003', area: 'Update Management', areaColor: '#059669',
    tag: 'CE REQUIRED', tagColor: '#16a34a',
    title: 'Patch & Vulnerability Management Policy',
    subtitle: 'CE Update Management Control — NCSC CE v3.3',
    pages: '5–6 pages', updated: 'April 2025',
    desc: 'Software update policy, 14-day patch SLA, EOL software prohibition, vulnerability scanning schedule, and asset register requirements.',
    ceRequired: true,
    content: `PATCH AND VULNERABILITY MANAGEMENT POLICY
Version: 2.0 | Effective: April 2025 | Review: April 2026
Owner: [IT Manager] | Classification: INTERNAL

TEMPLATE NOTICE: This document requires adaptation for your specific organisation before use.
Tanasiom Aegis accepts no liability for use of this template. See full disclaimer at tanasiomaegis.co.uk/docs

═══════════════════════════════════════════════════════════

1. PURPOSE
To ensure all software and systems at [Organisation Name] are kept up to date,
reducing exposure to known vulnerabilities. Addresses NCSC CE Update Management control.

2. PATCH SLA SCHEDULE (CE MANDATORY)
┌──────────────────────────────────────────────────────────┐
│ Severity │ CVSS Score │ Patch Deadline │ Escalation      │
├──────────────────────────────────────────────────────────┤
│ CRITICAL │ 9.0–10.0   │ Within 7 days  │ Immediate       │
│ HIGH     │ 7.0–8.9    │ Within 14 days │ IT Manager      │
│ MEDIUM   │ 4.0–6.9    │ Within 30 days │ Scheduled       │
│ LOW      │ 0.1–3.9    │ Within 90 days │ Monthly cycle   │
│ CISA KEV │ Any        │ Within 48 hrs  │ Director        │
└──────────────────────────────────────────────────────────┘
CE v3.3 requires: Critical and High patches applied within 14 days of release.
Failure is an AUTOMATIC CE FAIL.

3. PROHIBITED SOFTWARE (CE AUTOMATIC FAIL)
  ✗ Windows XP, Vista, 7, 8, 8.1 — end of life
  ✗ Windows Server 2008, 2008 R2, 2012 — end of life
  ✗ macOS versions older than 3 years from current
  ✗ Any Android below version 10
  ✗ Any iOS below version 15
  ✗ Any Linux distribution with no vendor security updates

4. SUPPORTED SOFTWARE (as of April 2025)
  ✓ Windows 10 (22H2 — extended support until Oct 2025 — PLAN UPGRADE NOW)
  ✓ Windows 11 (23H2, 24H2)
  ✓ Windows Server 2019, 2022, 2025
  ✓ macOS Sonoma (14.x), Sequoia (15.x)
  ✓ Ubuntu 22.04 LTS, 24.04 LTS

5. ASSET REGISTER (MANDATORY CE EVIDENCE)
Hostname | OS Version | Last Patched | Owner | Location | In Scope | Notes
[Maintain this register — it is required CE evidence]

6. PATCH PROCESS
  Step 1 — IDENTIFY: Subscribe to NCSC Alerts, vendor bulletins, CISA KEV feed
  Step 2 — ASSESS: Evaluate severity, exploitability, business impact
  Step 3 — TEST: Test in non-production environment where possible
  Step 4 — DEPLOY: Apply patches within SLA using WSUS/SCCM/MDM/manual
  Step 5 — VERIFY: Confirm patch applied — check version numbers
  Step 6 — DOCUMENT: Record in Patch Log with date, device, version, approver
  Step 7 — REPORT: Monthly patch compliance report to management`,
  },
  {
    id: 'POL-004', area: 'User Access Control', areaColor: '#d97706',
    tag: 'CE REQUIRED', tagColor: '#16a34a',
    title: 'User Access Control Policy',
    subtitle: 'CE User Access Control — NCSC CE v3.3',
    pages: '6–8 pages', updated: 'April 2025',
    desc: 'User provisioning, MFA requirements, privileged access, leavers process, account reviews, and password policy aligned to CE v3.3 mandatory requirements.',
    ceRequired: true,
    content: `USER ACCESS CONTROL POLICY
Version: 2.1 | Effective: April 2025 | Review: April 2026
Owner: [HR / IT Manager] | Classification: INTERNAL

TEMPLATE NOTICE: This document requires adaptation for your specific organisation before use.
Tanasiom Aegis accepts no liability for use of this template. See full disclaimer at tanasiomaegis.co.uk/docs

═══════════════════════════════════════════════════════════

1. MFA REQUIREMENTS (CE v3.3 MANDATORY — NO EXCEPTIONS)
  ✓ ALL cloud services — Microsoft 365, Google Workspace, Dropbox, AWS, etc.
  ✓ ALL remote access solutions — VPN, RDP, remote desktop tools
  ✓ ALL password managers used for business
  ✓ ALL online banking and financial services
  ✓ ANY service accessible from outside the organisational network

  NO MFA = AUTOMATIC CE FAIL on any cloud service.

Approved MFA Methods (preference order):
  1. FIDO2 / hardware security key (YubiKey) — MOST SECURE
  2. Authenticator app (Microsoft Authenticator, Google Authenticator)
  3. Push notification via authenticator app
  4. SMS OTP — permitted but NOT recommended (SIM-swap vulnerable)

2. JOINERS PROCESS
  Before start: HR notifies IT of new starter — name, role, start date, systems required
  Day 1:        IT creates accounts with least privilege appropriate to role
  Day 1:        User completes security awareness induction
  Day 1:        User signs Acceptable Use Policy
  Day 1:        Verify MFA enrolled on all cloud services before granting access

3. LEAVERS PROCESS (CRITICAL — ACTIVE ACCOUNTS = CE FAIL)
  As soon as notice given: HR notifies IT of leaving date
  Last day:     ALL accounts disabled — email, cloud, VPN, physical access
  Last day:     Company devices collected and wiped
  Last day:     Access keys, door codes, MFA devices reclaimed
  Within 30 days: Account formally deleted or archived

4. PRIVILEGED ACCESS MANAGEMENT
  • Separate admin accounts MUST be used for administrative tasks — CE MANDATORY
  • Admin accounts must NEVER be used for day-to-day work (email, browsing)
  • Admin account passwords: 16+ characters, unique per system
  • MFA mandatory on ALL admin accounts — no exceptions
  • Admin account use must be logged and reviewed monthly

5. ACCESS REVIEWS
  • All user access rights must be formally reviewed at least quarterly
  • Line managers confirm access is appropriate for each team member
  • Unnecessary access must be removed within 5 business days
  • Access review results documented and retained for 2 years

6. USER ACCESS REGISTER (MANDATORY CE EVIDENCE)
Name | Role | Systems Access | Admin? | MFA Enrolled | Last Review | Leaver Date
[Maintain this register — it is required CE evidence]`,
  },
  {
    id: 'POL-005', area: 'Malware Protection', areaColor: '#7c3aed',
    tag: 'CE REQUIRED', tagColor: '#16a34a',
    title: 'Malware Protection Policy',
    subtitle: 'CE Malware Protection Control — NCSC CE v3.3',
    pages: '4–5 pages', updated: 'April 2025',
    desc: 'Antivirus requirements, approved software list, application whitelisting, malicious code prevention, and endpoint protection standards.',
    ceRequired: true,
    content: `MALWARE PROTECTION POLICY
Version: 2.0 | Effective: April 2025 | Review: April 2026
Owner: [IT Manager] | Classification: INTERNAL

TEMPLATE NOTICE: This document requires adaptation for your specific organisation before use.
Tanasiom Aegis accepts no liability for use of this template. See full disclaimer at tanasiomaegis.co.uk/docs

═══════════════════════════════════════════════════════════

1. CE REQUIREMENTS
CE v3.3 requires ONE OR MORE of the following on all in-scope devices:
  Option A — Anti-malware software with active, real-time protection
  Option B — Application allowlisting (only approved software can execute)
  Option C — Sandboxing (potentially malicious code runs in isolated environment)
For most SMEs, Option A is the most practical.

2. APPROVED ANTI-MALWARE SOLUTIONS
  Windows:
  • Microsoft Defender Antivirus (built-in, CE approved) ← RECOMMENDED FOR SMEs
  • CrowdStrike Falcon, Sophos Endpoint, ESET Endpoint Security, Bitdefender GravityZone

  macOS:
  • XProtect + Gatekeeper + Microsoft Defender for Endpoint
  • Malwarebytes for Teams, Sophos Endpoint

  NOT APPROVED for CE: Avast Free, AVG Free, Malwarebytes Free
  (free consumer AV does not meet CE requirements — no centralised management)

3. MANDATORY AV CONFIGURATION (CE REQUIREMENTS)
  ✓ Real-time / on-access scanning must be enabled
  ✓ Definitions must auto-update — maximum 24-hour lag permitted
  ✓ Regular scheduled scans configured — weekly minimum
  ✓ Centralised management console for organisations with 5+ devices
  ✓ Alerts for detected threats sent to IT Manager
  ✓ AV cannot be disabled by standard users

  AUTOMATIC CE FAIL:
  ✗ AV disabled or expired on any in-scope device
  ✗ Definitions not updated within 24 hours
  ✗ Standard users able to disable AV protection

4. EMAIL AND WEB SECURITY
  • Email filtering in place to block malicious attachments and phishing
  • DMARC, DKIM, and SPF configured on all company email domains
  • Macros in Office documents disabled unless business-justified
  • Downloads from untrusted sources are prohibited
  • Web filtering / DNS filtering enabled on all company devices

5. APPROVED SOFTWARE LIST
All software on company devices must be:
  ✓ Listed on the Approved Software Register
  ✓ Licensed and vendor-supported
  ✓ Downloaded from official vendor sources only
  ✓ Reviewed and approved by IT Manager before installation`,
  },
  {
    id: 'POL-006', area: 'Secure Configuration', areaColor: '#0891b2',
    tag: 'CE REQUIRED', tagColor: '#16a34a',
    title: 'Secure Configuration Policy',
    subtitle: 'CE Secure Configuration Control — NCSC CE v3.3',
    pages: '5–6 pages', updated: 'April 2025',
    desc: 'Device hardening standards, default password policy, unnecessary service removal, screen lock requirements, and configuration baselines.',
    ceRequired: true,
    content: `SECURE CONFIGURATION POLICY
Version: 2.0 | Effective: April 2025 | Review: April 2026
Owner: [IT Manager] | Classification: INTERNAL

TEMPLATE NOTICE: This document requires adaptation for your specific organisation before use.
Tanasiom Aegis accepts no liability for use of this template. See full disclaimer at tanasiomaegis.co.uk/docs

═══════════════════════════════════════════════════════════

1. DEFAULT PASSWORDS (CE MANDATORY)
ALL default passwords must be changed before any device is put into use.
AUTOMATIC CE FAIL: Any device with factory/default credentials.
Applies to: routers, firewalls, switches, printers, IP cameras, Wi-Fi APs,
servers, network management tools, any application with a default admin password.

2. UNNECESSARY SERVICES — REMOVE OR DISABLE
  ✗ Telnet — disable and remove (use SSH)
  ✗ FTP — disable unless essential (use SFTP)
  ✗ SNMP v1/v2c — upgrade to SNMPv3 or disable
  ✗ UPnP — disable on all routers and network devices
  ✗ WPS — disable on all Wi-Fi access points
  ✗ Guest accounts — disable on all systems
  ✗ AutoRun/AutoPlay — disable on Windows devices

3. SCREEN LOCK (CE MANDATORY)
  • Automatic screen lock must activate after 5 minutes of inactivity — MAXIMUM
  • 2 minutes recommended for sensitive environments
  • Screen lock must require password or biometric to unlock
  • Remote sessions (RDP, SSH) must timeout after 15 minutes of inactivity

4. WINDOWS HARDENING CHECKLIST
  ✓ Windows Defender Firewall: ENABLED (all profiles)
  ✓ Windows Defender Antivirus: ENABLED and updated
  ✓ Automatic Updates: ENABLED
  ✓ BitLocker Full Disk Encryption: ENABLED
  ✓ UAC (User Account Control): Set to maximum
  ✓ Guest account: DISABLED
  ✓ AutoRun: DISABLED
  ✓ Screen lock: Configured for 5 minutes
  ✓ Password complexity: ENFORCED via Group Policy

5. NETWORK DEVICE HARDENING
  ✓ Default credentials: CHANGED
  ✓ Management interface: LAN only — NOT internet-accessible
  ✓ UPnP: DISABLED
  ✓ WPS: DISABLED
  ✓ Firmware: Updated to latest supported version
  ✓ Guest Wi-Fi: Segregated from corporate network via VLAN`,
  },
  // ── LEGAL ──────────────────────────────────
  {
    id: 'POL-007', area: 'UK GDPR / DPA 2018', areaColor: '#1d4ed8',
    tag: 'LEGAL', tagColor: '#1d4ed8',
    title: 'Data Protection & UK GDPR Policy',
    subtitle: 'UK GDPR / Data Protection Act 2018 Compliance',
    pages: '10–14 pages', updated: 'April 2025',
    desc: 'UK GDPR compliance policy covering lawful basis, data subject rights, retention schedules, breach notification, and privacy by design.',
    ceRequired: false,
    content: `DATA PROTECTION AND UK GDPR POLICY
Version: 2.2 | Effective: April 2025 | Review: April 2026
Owner: [Data Protection Officer / Director] | Classification: INTERNAL

TEMPLATE NOTICE: This document requires adaptation for your specific organisation before use.
This template does not constitute legal advice. Consult a qualified solicitor.
Tanasiom Aegis accepts no liability for use of this template.

═══════════════════════════════════════════════════════════

1. LEGAL BASIS
This policy ensures [Organisation Name] processes personal data in compliance with:
  • UK General Data Protection Regulation (UK GDPR)
  • Data Protection Act 2018 (DPA 2018)
  • Privacy and Electronic Communications Regulations 2003 (PECR)

2. DATA PROTECTION PRINCIPLES (UK GDPR Article 5)
  1. Lawfulness, fairness, and transparency
  2. Purpose limitation — specified, explicit, legitimate purposes only
  3. Data minimisation — adequate, relevant, limited to what is necessary
  4. Accuracy — kept accurate and up to date
  5. Storage limitation — kept no longer than necessary
  6. Integrity and confidentiality — processed securely
  7. Accountability — we can demonstrate compliance

3. DATA SUBJECT RIGHTS
Data subjects have the right to:
  • ACCESS: Subject Access Requests — respond within 30 days
  • RECTIFICATION: Correct inaccurate data — 30 days
  • ERASURE ('Right to be Forgotten'): Delete where no longer needed
  • RESTRICTION: Restrict processing in certain circumstances
  • PORTABILITY: Provide data in machine-readable format
  • OBJECT: Object to processing based on legitimate interests

All requests directed to: [Data Protection Officer email]
All requests logged and responded to within 30 calendar days.

4. DATA RETENTION SCHEDULE
┌─────────────────────────────────────────────────────────────┐
│ Data Type           │ Retention Period │ Legal Basis         │
├─────────────────────────────────────────────────────────────┤
│ Employee HR records │ 6 years post-emp │ Legal obligation    │
│ Payroll records     │ 6 years          │ HMRC requirement    │
│ Customer contracts  │ 6 years post-end │ Limitation Act 1980 │
│ CCTV footage        │ 31 days          │ ICO guidance        │
│ CV / job applicants │ 6 months         │ Legitimate interests │
└─────────────────────────────────────────────────────────────┘

5. DATA BREACH NOTIFICATION (ICO — 72 HOURS)
  Hour 0:  Incident discovered — notify [DPO / Director] IMMEDIATELY
  Hour 24: Document breach details in Breach Register
  Hour 48: Decide on ICO notification — document decision
  Hour 72: Report to ICO if required — report.ico.org.uk

ICO Notification Line: 0303 123 1113
Online reporting: report.ico.org.uk`,
  },
  {
    id: 'POL-008', area: 'Incident Management', areaColor: '#dc2626',
    tag: 'CRITICAL', tagColor: '#dc2626',
    title: 'Incident Response Policy & Playbook',
    subtitle: 'Cyber Incident Management — NCSC Aligned',
    pages: '8–10 pages', updated: 'April 2025',
    desc: 'Incident classification framework, response procedures, communication plan, forensic evidence handling, breach notification, and post-incident review process.',
    ceRequired: false,
    content: `INCIDENT RESPONSE POLICY AND PLAYBOOK
Version: 2.0 | Effective: April 2025 | Review: April 2026
Owner: [CISO / IT Manager] | Classification: CONFIDENTIAL

TEMPLATE NOTICE: This document requires adaptation for your specific organisation before use.
Tanasiom Aegis accepts no liability for use of this template.

═══════════════════════════════════════════════════════════

1. INCIDENT CLASSIFICATION
┌───────────────────────────────────────────────────────────────┐
│ Severity │ Description                   │ Response │ Escalate │
├───────────────────────────────────────────────────────────────┤
│ P1       │ Active ransomware / breach    │ Immediate│ Director │
│ P2       │ Confirmed compromise          │ 2 hours  │ CISO/IT  │
│ P3       │ Suspected compromise          │ 4 hours  │ IT Mgr   │
│ P4       │ Policy violation / near miss  │ 1 day    │ IT Mgr   │
└───────────────────────────────────────────────────────────────┘

2. RESPONSE PHASES

PHASE 1 — PREPARATION
  • Maintain this playbook and review annually
  • Ensure all staff know how to report incidents
  • Subscribe to NCSC Early Warning Service (free)
  • Engage Tanasiom Aegis as on-call IR support: tanasiomaegis@gmail.com

PHASE 2 — IDENTIFICATION
  • Determine if a security event is an actual incident
  • Collect initial indicators of compromise (IoCs)
  • Assign severity classification (P1–P4)
  • DO NOT access compromised systems if P1 — isolate first

PHASE 3 — CONTAINMENT
  Short-term: Isolate affected systems from network, disable compromised accounts,
  block malicious IPs at firewall, preserve memory and logs BEFORE shutdown.
  
  Long-term: Deploy clean system images, rebuild from last known-good backup,
  identify and close initial access vector.

PHASE 4 — ERADICATION
  • Remove malware from all affected systems
  • Identify and remediate root cause
  • Apply relevant patches and configuration fixes
  • Reset all potentially compromised credentials

PHASE 5 — RECOVERY
  • Restore from verified clean backups
  • Vulnerability scan before reconnecting to network
  • Monitor for re-infection for minimum 30 days

PHASE 6 — POST-INCIDENT REVIEW
  • Conduct review within 14 days
  • Document: what happened, why, what was done, improvements
  • Update this playbook with lessons learned

3. RANSOMWARE PLAYBOOK
  Step 1: ISOLATE — disconnect affected devices from all networks IMMEDIATELY
  Step 2: DO NOT PAY — paying does not guarantee decryption and funds crime
  Step 3: REPORT — report to Action Fraud (0300 123 2040) and NCSC
  Step 4: ASSESS — identify scope using a clean machine
  Step 5: RESTORE — restore from pre-infection backups
  Step 6: REBUILD — if no clean backup, rebuild from scratch

4. KEY CONTACTS
  IT Manager: _________________ Tel: _________________
  Director: ___________________ Tel: _________________
  Tanasiom Aegis IR Support: tanasiomaegis@gmail.com
  NCSC: www.ncsc.gov.uk/section/about-this-website/contact-us
  Action Fraud: 0300 123 2040
  ICO Breach Report: report.ico.org.uk | 0303 123 1113`,
  },
  // ── LEGAL / OPERATIONAL ─────────────────────
  {
    id: 'LEG-001', area: 'Computer Misuse Act 1990', areaColor: '#7c3aed',
    tag: 'LEGAL', tagColor: '#7c3aed',
    title: 'Penetration Testing Scope of Work & Authorisation',
    subtitle: 'Rules of Engagement — Computer Misuse Act 1990 Compliance',
    pages: '4–5 pages', updated: 'April 2025',
    desc: 'Formal authorisation document for penetration testing engagements. Required by law under the Computer Misuse Act 1990. Defines scope, excluded systems, emergency contacts, and rules of engagement.',
    ceRequired: false,
    content: `PENETRATION TESTING SCOPE OF WORK AND AUTHORISATION
Document Reference: TA-SOW-[YYYY]-[NNN]
Version: 1.0 | Date: [DATE] | Classification: CONFIDENTIAL

IMPORTANT LEGAL NOTICE: Penetration testing without explicit written authorisation
is a criminal offence under Section 1 of the Computer Misuse Act 1990. This document
constitutes the required written authorisation. Both parties must sign before testing begins.

═══════════════════════════════════════════════════════════

PARTIES
Testing Organisation: Tanasiom Aegis Security & Compliance
                     Operated by: Dumitru Tanasie
                     Email: tanasiomaegis@gmail.com

Client Organisation:  [CLIENT ORGANISATION NAME]
                     [Company Registration Number]
                     [Registered Address]

Authorised Signatory: [Name, Title — must be authorised to approve engagement]
                     Signature: _______________________ Date: ___________

1. SCOPE OF ENGAGEMENT

IN SCOPE — explicitly authorised for testing:
  • IP Range(s): [e.g. 192.168.1.0/24]
  • Domain(s): [e.g. internal.clientname.com]
  • Web Applications: [list URLs]
  • Network Infrastructure: [list devices by IP/hostname]

OUT OF SCOPE — explicitly EXCLUDED:
  • Production databases containing live customer PII
  • Systems owned or operated by third parties without their explicit consent
  • Any system not explicitly listed in IN SCOPE above
  • [Add any additional exclusions]

Testing Type:
  ☐ Black Box (no prior knowledge)
  ☐ Grey Box (partial knowledge provided)
  ☐ White Box (full knowledge, credentials provided)

2. TESTING WINDOW
  Start: _________________ End: _________________
  Hours: ☐ Any time  ☐ Business hours only (09:00–17:30 GMT)

3. EMERGENCY CONTACTS (must be reachable at all times during testing)
  Primary: _____________ Tel: _____________ Email: _____________
  Secondary: ___________ Tel: _____________ Email: _____________
  Tanasiom Aegis: tanasiomaegis@gmail.com

4. RULES OF ENGAGEMENT
  ✓ All testing explicitly authorised by signed parties
  ✓ Testing halts immediately if requested by emergency contacts
  ✓ No destructive testing without explicit additional sign-off
  ✓ All findings reported to client only — no public disclosure
  ✓ Evidence handled securely — provided to client only
  ✓ Minimum required access — no lateral movement beyond agreed scope
  ✓ All actions documented for client review

5. LEGAL AUTHORISATION STATEMENT
I, [Authorised Signatory Name], confirm that I am duly authorised to grant consent
for penetration testing activities described in this document on behalf of
[Client Organisation Name]. I understand this authorisation is required under
Section 1 of the Computer Misuse Act 1990.

Signature: _______________________________ Date: _______________
Print Name: ______________________________ Title: _______________

6. DELIVERABLES
  • Executive Summary (non-technical overview for management)
  • Technical Report (findings, evidence, CVSS scores)
  • CE Control Area Mapping
  • Remediation Roadmap (prioritised action plan)
  • Retest Offer (verify remediation within 60 days)

Delivery: Encrypted PDF via secure email
Deadline: [X] business days from completion of testing`,
  },
  {
    id: 'LEG-002', area: 'England & Wales', areaColor: '#1d4ed8',
    tag: 'LEGAL', tagColor: '#1d4ed8',
    title: 'Tanasiom Aegis — Terms of Service',
    subtitle: 'Service Agreement — Governing Law: England & Wales',
    pages: '6–8 pages', updated: 'April 2025',
    desc: 'Service terms covering consultancy services, payment terms, liability limitations, intellectual property, confidentiality, and dispute resolution under English law.',
    ceRequired: false,
    content: `TANASIOM AEGIS SECURITY & COMPLIANCE
TERMS OF SERVICE
Version: 1.3 | Last Updated: April 2025
Governing Law: England and Wales

═══════════════════════════════════════════════════════════

1. PARTIES
Service Provider: Tanasiom Aegis Security & Compliance
                 Operated by: Dumitru Tanasie
                 Email: tanasiomaegis@gmail.com
                 Location: United Kingdom

Client: The individual or organisation purchasing services as identified
        in the relevant proposal or invoice.

2. SERVICES
Tanasiom Aegis provides:
  a) Cyber Essentials Gap Assessment and Readiness Review
  b) Penetration Testing (network, web application, internal infrastructure)
  c) Security Policy Development and Documentation
  d) Staff Security Awareness Training
  e) CE Certification Support and Advisory
  f) Vulnerability Assessment and Reporting

3. PAYMENT TERMS
  • All fees are in GBP and exclusive of VAT where applicable
  • Gap Assessments (£397): Payment in full required before engagement commences
  • Penetration Testing: 50% deposit required; balance due on report delivery
  • Invoices payable within 14 days of issue
  • Late payments accrue interest at 8% above Bank of England base rate per annum
    (pursuant to Late Payment of Commercial Debts (Interest) Act 1998)
  • Disputed invoices must be raised in writing within 7 days

4. SCOPE LIMITATIONS
  Tanasiom Aegis provides:
  • Pre-certification readiness assessments — NOT IASME certification
  • Template policy documents — NOT bespoke legal drafting
  • Penetration testing within agreed scope — NOT ongoing security monitoring
  • Recommendations and reports — NOT implementation services (unless separately agreed)

  Tanasiom Aegis does NOT:
  • Issue CE certificates (only IASME-licensed Certification Bodies can do this)
  • Provide legal advice
  • Provide ongoing managed security services (unless separately contracted)
  • Guarantee that following our recommendations will result in CE certification

5. LIMITATION OF LIABILITY
  • Tanasiom Aegis's total liability for any claim shall not exceed the fees paid
    for the relevant engagement in the preceding 12-month period
  • Tanasiom Aegis shall not be liable for indirect, consequential, or special damages
  • Nothing excludes liability for death, personal injury caused by negligence, or fraud
  • The client accepts that penetration testing carries inherent risk; Tanasiom Aegis
    shall not be liable for unavoidable service disruption during authorised testing

6. CONFIDENTIALITY
  • Both parties keep all engagement information strictly confidential
  • Tanasiom Aegis will not disclose findings to any third party without written consent
  • This obligation survives termination for 3 years
  • Client may not publish or commercially exploit deliverables without written consent

7. INTELLECTUAL PROPERTY
  • Deliverables (reports, policies, frameworks) become the client's property upon full payment
  • Tanasiom Aegis retains ownership of its methodologies, frameworks, tools, and
    underlying intellectual property
  • Template documents are licensed, not sold, and may not be redistributed
    without a White-Label Agreement

8. COMPUTER MISUSE ACT 1990 COMPLIANCE
  • All penetration testing requires explicit written authorisation (LEG-001)
  • Tanasiom Aegis will not conduct testing beyond agreed scope under any circumstances
  • Client warrants they are authorised to grant testing permission for all in-scope systems
  • Third-party hosted systems require separate authorisation from the hosting provider

9. INDEPENDENT STATUS
  Tanasiom Aegis is an independent cybersecurity consultancy. It is not affiliated with,
  endorsed by, or acting on behalf of NCSC, IASME, the UK Government, or any other
  regulatory body. CE certification can only be granted by IASME-licensed Certification Bodies.

10. GOVERNING LAW AND DISPUTE RESOLUTION
  • Governed by the laws of England and Wales
  • Disputes addressed through good-faith negotiation first
  • If unresolved in 30 days, referred to mediation
  • Failing mediation: exclusive jurisdiction of courts of England and Wales

11. CANCELLATION AND REFUNDS
  • Cancellation >7 days before: full refund minus 10% admin fee
  • Cancellation 3–7 days before: 50% refund
  • Cancellation <3 days before: no refund (engagement already prepared)
  • If Tanasiom Aegis cancels: full refund within 5 business days`,
  },
  {
    id: 'SCO-001', area: 'All 5 Controls', areaColor: '#1d4ed8',
    tag: 'CE SCOPE', tagColor: '#16a34a',
    title: 'CE Scope Definition — Small Business (1–9 employees)',
    subtitle: 'Organisation-Level CE Scope — NCSC Approved Format',
    pages: '2–3 pages', updated: 'April 2025',
    desc: 'Complete scope definition document for small businesses applying for Cyber Essentials. Covers network boundary, in-scope devices, cloud services, and scope statement.',
    ceRequired: true,
    content: `CYBER ESSENTIALS SCOPE DEFINITION DOCUMENT
Organisation-Level Assessment | 1–9 Employees
Reference: CE-SCOPE-[YYYY]-[NN] | Version: 1.0 | Date: [DATE]
NCSC CE v3.3 — 2025

TEMPLATE NOTICE: Adapt for your specific organisation before submission.
Tanasiom Aegis accepts no liability for use of this template.

═══════════════════════════════════════════════════════════

ORGANISATION DETAILS
Organisation Name:  [ORGANISATION NAME]
Company Number:     [COMPANY REG NUMBER]
Registered Address: [ADDRESS]
Primary Contact:    [NAME, TITLE, EMAIL, PHONE]
Certifying Body:    IASME Consortium

SCOPE STATEMENT
This CE assessment covers the entire organisation as a single scope.
All IT infrastructure, devices, cloud services, and network components
used to store or process [Organisation Name]'s data are included within scope.

IN-SCOPE: NETWORK BOUNDARY
  Primary office network: [IP range, e.g. 192.168.1.0/24]
  ISP router/modem:       [Make/Model] — provided by [ISP Name]
  Boundary firewall:      [Make/Model/Software]
  Wi-Fi network(s):       Corporate SSID: [SSID] / Guest SSID: [SSID]
  Remote working:         [Describe VPN or direct internet arrangement]

IN-SCOPE: DEVICES (complete for ALL devices)
┌──────────────────────────────────────────────────────────────┐
│ Asset Tag │ Type    │ OS & Version    │ Owner  │ In Scope    │
├──────────────────────────────────────────────────────────────┤
│ [TAG-001] │ Laptop  │ Win 11 23H2     │ [Name] │ YES         │
│ [TAG-002] │ Desktop │ Win 11 23H2     │ [Name] │ YES         │
│ [TAG-003] │ MacBook │ macOS 15.x      │ [Name] │ YES         │
│ [TAG-004] │ iPhone  │ iOS 18.x        │ [Name] │ YES         │
└──────────────────────────────────────────────────────────────┘

IN-SCOPE: CLOUD SERVICES (all business cloud services must be included)
┌──────────────────────────────────────────────────────────────────┐
│ Service           │ Provider  │ MFA Enabled │ Admin MFA │ Use   │
├──────────────────────────────────────────────────────────────────┤
│ Microsoft 365     │ Microsoft │ YES / NO    │ YES / NO  │ Email │
│ Google Workspace  │ Google    │ YES / NO    │ YES / NO  │ Drive │
│ Xero / QuickBooks │ [Provider]│ YES / NO    │ YES / NO  │ Accnts│
└──────────────────────────────────────────────────────────────────┘
CRITICAL: MFA must be YES on ALL cloud services — NO EXCEPTIONS

AUTHORISATION
I confirm this scope accurately represents [Organisation Name]'s IT infrastructure
and that I am a Director authorised to make this declaration.

Name: _________________________ Title: _________________________
Signature: _____________________ Date: _________________________`,
  },
  {
    id: 'ASS-001', area: 'All 5 Controls', areaColor: '#1d4ed8',
    tag: 'ASSESSMENT', tagColor: '#059669',
    title: 'CE Pre-Assessment Questionnaire',
    subtitle: 'Internal Readiness Check — Before IASME Application',
    pages: '5–7 pages', updated: 'April 2025',
    desc: 'Structured questionnaire to identify CE failures before paying the certification fee. Maps to official IASME questions across all 5 control areas.',
    ceRequired: true,
    content: `CYBER ESSENTIALS PRE-ASSESSMENT QUESTIONNAIRE
Internal Use Only — Complete Before IASME Application
Reference: TA-PRE-ASSESS-[YYYY] | Version: 2.0 | April 2025

TEMPLATE NOTICE: This is a preparation tool. It does not replace the official
IASME self-assessment questionnaire. CE certificates are issued solely by
IASME-licensed Certification Bodies. Tanasiom Aegis accepts no liability for
use of this template.

═══════════════════════════════════════════════════════════

INSTRUCTIONS: Answer YES/NO/PARTIAL. Any NO on a ✗ CE FAIL item must be
remediated before applying. Any PARTIAL requires investigation.

SECTION 1 — FIREWALLS
Q1.1  Boundary firewall in place between internet and internal network?
      [ ] YES  [ ] NO                 ✗ CE FAIL if NO

Q1.2  All inbound connections blocked by default (default-deny)?
      [ ] YES  [ ] NO                 ✗ CE FAIL if NO

Q1.3  All open inbound ports documented with business justification?
      [ ] YES  [ ] NO  [ ] PARTIAL    ✗ CE FAIL if NO

Q1.4  Router/firewall management interface inaccessible from internet?
      [ ] YES  [ ] NO                 ✗ CE FAIL if NO

Q1.5  All default router/firewall passwords changed?
      [ ] YES  [ ] NO                 ✗ CE FAIL if NO

Q1.6  Device firewalls enabled on all end-user devices?
      [ ] YES  [ ] NO  [ ] PARTIAL    ✗ CE FAIL if NO or PARTIAL

FIREWALLS: __/6  [ ] PASS  [ ] FAIL

SECTION 2 — SECURE CONFIGURATION
Q2.1  All default passwords changed on ALL devices before use?
      [ ] YES  [ ] NO                 ✗ CE FAIL if NO

Q2.2  Unnecessary software and services removed or disabled?
      [ ] YES  [ ] NO  [ ] PARTIAL

Q2.3  Screen lock configured — maximum 5-minute timeout?
      [ ] YES  [ ] NO  [ ] PARTIAL    ✗ CE FAIL if NO

Q2.4  Telnet disabled on all systems?
      [ ] YES  [ ] NO                 ✗ CE FAIL if NO

Q2.5  Admin accounts used only for admin tasks — not daily use?
      [ ] YES  [ ] NO  [ ] PARTIAL    ✗ CE FAIL if NO

SECURE CONFIG: __/5  [ ] PASS  [ ] FAIL

SECTION 3 — UPDATE MANAGEMENT
Q3.1  All operating systems on vendor-supported versions?
      [ ] YES  [ ] NO  [ ] PARTIAL    ✗ CE FAIL if any EOL OS

Q3.2  Critical patches applied within 14 days of vendor release?
      [ ] YES  [ ] NO  [ ] PARTIAL    ✗ CE FAIL if NO or PARTIAL

Q3.3  Automatic updates enabled on all devices where available?
      [ ] YES  [ ] NO  [ ] PARTIAL

Q3.4  All installed software licensed and vendor-supported?
      [ ] YES  [ ] NO  [ ] PARTIAL    ✗ CE FAIL if any unsupported software

Q3.5  Documented process for tracking and applying patches?
      [ ] YES  [ ] NO  [ ] PARTIAL

UPDATE MANAGEMENT: __/5  [ ] PASS  [ ] FAIL

SECTION 4 — USER ACCESS CONTROL
Q4.1  MFA enabled on ALL cloud services (M365, Google, Dropbox, etc.)?
      [ ] YES  [ ] NO  [ ] PARTIAL    ✗ CE FAIL if NO or PARTIAL

Q4.2  MFA enabled for all remote access (VPN, RDP, remote desktop)?
      [ ] YES  [ ] NO  [ ] PARTIAL    ✗ CE FAIL if NO

Q4.3  Leavers' accounts disabled on their last day?
      [ ] YES  [ ] NO  [ ] PARTIAL    ✗ CE FAIL if NO

Q4.4  All users have minimum access required for their role?
      [ ] YES  [ ] NO  [ ] PARTIAL    ✗ CE FAIL if NO

Q4.5  Privileged/admin accounts separate from standard user accounts?
      [ ] YES  [ ] NO  [ ] PARTIAL    ✗ CE FAIL if NO

USER ACCESS: __/5  [ ] PASS  [ ] FAIL

SECTION 5 — MALWARE PROTECTION
Q5.1  Active anti-malware running on all Windows and macOS devices?
      [ ] YES  [ ] NO  [ ] PARTIAL    ✗ CE FAIL if NO or PARTIAL

Q5.2  Anti-malware definitions auto-updated within 24 hours?
      [ ] YES  [ ] NO  [ ] PARTIAL    ✗ CE FAIL if NO

Q5.3  Users unable to disable or bypass anti-malware protection?
      [ ] YES  [ ] NO                 ✗ CE FAIL if NO

Q5.4  Email filtering in place to block malicious attachments?
      [ ] YES  [ ] NO  [ ] PARTIAL

Q5.5  Web filtering / DNS filtering in place?
      [ ] YES  [ ] NO  [ ] PARTIAL

MALWARE PROTECTION: __/5  [ ] PASS  [ ] FAIL

OVERALL CE READINESS
  Firewalls:           __/6  [ ] PASS  [ ] FAIL
  Secure Config:       __/5  [ ] PASS  [ ] FAIL
  Update Management:   __/5  [ ] PASS  [ ] FAIL
  User Access Control: __/5  [ ] PASS  [ ] FAIL
  Malware Protection:  __/5  [ ] PASS  [ ] FAIL

  [ ] READY TO APPLY — All 5 sections PASS
  [ ] NOT YET READY — Remediate items marked ✗ CE FAIL first

Assessment completed by: _____________________ Date: ____________
Book expert review: tanasiomaegis@gmail.com | £397 Gap Review`,
  },
]

const AREA_COLORS = {
  'Firewalls': '#dc2626',
  'Secure Configuration': '#0891b2',
  'Update Management': '#059669',
  'User Access Control': '#d97706',
  'Malware Protection': '#7c3aed',
}

const CE_REQUIRED_IDS = DOCS.filter(d => d.ceRequired).map(d => d.id)

// ─────────────────────────────────────────────
// DOCX GENERATOR
// ─────────────────────────────────────────────
function generateDocx(doc) {
  const escXml = str => str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  const lines = doc.content.split('\n')
  let bodyContent = ''

  lines.forEach(line => {
    const trimmed = line.trim()
    if (trimmed === '' || trimmed === '\u00A0') {
      bodyContent += `<w:p><w:pPr><w:spacing w:after="60"/></w:pPr></w:p>`
      return
    }
    const isRule = /^[═─┌┐└┘├┤┬┴┼│]+/.test(trimmed)
    const isTableRow = trimmed.includes('│')
    const isSectionTitle = /^[A-Z][A-Z\s&/\-,()]+$/.test(trimmed) && trimmed.length > 4 && !trimmed.startsWith('✓') && !trimmed.startsWith('✗') && !trimmed.startsWith('•') && !trimmed.includes('│')
    const isPass = trimmed.startsWith('✓')
    const isFail = trimmed.startsWith('✗') || trimmed.includes('AUTOMATIC CE FAIL')
    const isBullet = trimmed.startsWith('•') || trimmed.startsWith('Step') || /^\d+\./.test(trimmed)

    if (isRule) {
      bodyContent += `<w:p><w:pPr><w:pBdr><w:bottom w:val="single" w:sz="4" w:color="DDE3EC"/></w:pBdr></w:pPr></w:p>`
    } else if (isTableRow) {
      bodyContent += `<w:p><w:pPr><w:spacing w:after="40"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Courier New" w:hAnsi="Courier New"/><w:sz w:val="16"/><w:color w:val="1D4ED8"/></w:rPr><w:t xml:space="preserve">${escXml(line)}</w:t></w:r></w:p>`
    } else if (isSectionTitle) {
      bodyContent += `<w:p><w:pPr><w:spacing w:before="240" w:after="80"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="20"/><w:color w:val="0F172A"/></w:rPr><w:t>${escXml(trimmed)}</w:t></w:r></w:p>`
    } else if (isPass) {
      bodyContent += `<w:p><w:pPr><w:spacing w:after="60"/><w:ind w:left="240"/></w:pPr><w:r><w:rPr><w:sz w:val="18"/><w:color w:val="16A34A"/></w:rPr><w:t xml:space="preserve">${escXml(trimmed)}</w:t></w:r></w:p>`
    } else if (isFail) {
      bodyContent += `<w:p><w:pPr><w:spacing w:after="60"/><w:ind w:left="240"/></w:pPr><w:r><w:rPr><w:sz w:val="18"/><w:color w:val="DC2626"/></w:rPr><w:t xml:space="preserve">${escXml(trimmed)}</w:t></w:r></w:p>`
    } else if (isBullet) {
      bodyContent += `<w:p><w:pPr><w:spacing w:after="60"/><w:ind w:left="360"/></w:pPr><w:r><w:rPr><w:sz w:val="18"/><w:color w:val="334155"/></w:rPr><w:t xml:space="preserve">${escXml(line)}</w:t></w:r></w:p>`
    } else {
      bodyContent += `<w:p><w:pPr><w:spacing w:after="80"/></w:pPr><w:r><w:rPr><w:sz w:val="18"/><w:color w:val="475569"/></w:rPr><w:t xml:space="preserve">${escXml(line)}</w:t></w:r></w:p>`
    }
  })

  const docXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:body>
<w:p><w:pPr><w:jc w:val="center"/><w:spacing w:after="0"/></w:pPr>
<w:r><w:rPr><w:b/><w:sz w:val="26"/><w:color w:val="0F172A"/></w:rPr>
<w:t>TANASIOM AEGIS SECURITY &amp; COMPLIANCE</w:t></w:r></w:p>
<w:p><w:pPr><w:jc w:val="center"/><w:spacing w:after="0"/></w:pPr>
<w:r><w:rPr><w:sz w:val="20"/><w:color w:val="1D4ED8"/></w:rPr>
<w:t>${escXml(doc.title.toUpperCase())}</w:t></w:r></w:p>
<w:p><w:pPr><w:jc w:val="center"/><w:spacing w:after="60"/></w:pPr>
<w:r><w:rPr><w:sz w:val="16"/><w:color w:val="94A3B8"/></w:rPr>
<w:t>${escXml(doc.subtitle)} · ${doc.id} · Updated ${doc.updated}</w:t></w:r></w:p>
<w:p><w:pPr><w:pBdr><w:top w:val="single" w:sz="6" w:color="1D4ED8"/></w:pBdr><w:spacing w:after="80"/></w:pPr></w:p>
<w:p><w:pPr><w:pBdr><w:left w:val="single" w:sz="12" w:color="F59E0B"/></w:pBdr><w:ind w:left="180"/><w:spacing w:after="40"/></w:pPr>
<w:r><w:rPr><w:b/><w:sz w:val="16"/><w:color w:val="92400E"/></w:rPr>
<w:t>TEMPLATE DOCUMENT — REQUIRES ADAPTATION — NOT LEGAL ADVICE</w:t></w:r></w:p>
<w:p><w:pPr><w:pBdr><w:left w:val="single" w:sz="12" w:color="F59E0B"/></w:pBdr><w:ind w:left="180"/><w:spacing w:after="240"/></w:pPr>
<w:r><w:rPr><w:sz w:val="16"/><w:color w:val="78350F"/></w:rPr>
<w:t>This template must be reviewed, adapted for your organisation, and approved internally before use. Tanasiom Aegis Security &amp; Compliance accepts no liability for use of this document. CE certificates are issued solely by IASME-licensed Certification Bodies. Tanasiom Aegis is not affiliated with NCSC, IASME, or the UK Government. www.tanasiomaegis.co.uk</w:t></w:r></w:p>
${bodyContent}
<w:p><w:pPr><w:pBdr><w:top w:val="single" w:sz="4" w:color="DDE3EC"/></w:pBdr><w:spacing w:before="360" w:after="120"/></w:pPr></w:p>
<w:p><w:pPr><w:jc w:val="center"/></w:pPr>
<w:r><w:rPr><w:sz w:val="14"/><w:color w:val="94A3B8"/></w:rPr>
<w:t>Prepared by Tanasiom Aegis Security &amp; Compliance · Template document requiring adaptation · Not legal advice · Not a CE assessment · www.tanasiomaegis.co.uk</w:t></w:r></w:p>
<w:sectPr><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/></w:sectPr>
</w:body></w:document>`

  const relsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`
  const wordRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`
  const contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/></Types>`
  const stylesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:style w:type="paragraph" w:styleId="Normal"><w:name w:val="Normal"/><w:rPr><w:sz w:val="18"/></w:rPr></w:style></w:styles>`

  const enc = new TextEncoder()
  const crcTable = (() => {
    const t = new Uint32Array(256)
    for (let i = 0; i < 256; i++) {
      let c = i
      for (let j = 0; j < 8; j++) c = (c & 1) ? 0xEDB88320 ^ (c >>> 1) : c >>> 1
      t[i] = c
    }
    return t
  })()
  const crc32 = (data) => {
    let crc = 0xFFFFFFFF
    for (let i = 0; i < data.length; i++) crc = crcTable[(crc ^ data[i]) & 0xFF] ^ (crc >>> 8)
    return (crc ^ 0xFFFFFFFF) >>> 0
  }
  const u32le = (n) => new Uint8Array([n & 0xFF, (n >> 8) & 0xFF, (n >> 16) & 0xFF, (n >> 24) & 0xFF])
  const u16le = (n) => new Uint8Array([n & 0xFF, (n >> 8) & 0xFF])

  const files = {
    '[Content_Types].xml': contentTypesXml,
    '_rels/.rels': relsXml,
    'word/document.xml': docXml,
    'word/styles.xml': stylesXml,
    'word/_rels/document.xml.rels': wordRelsXml,
  }

  const entries = [], parts = []
  let offset = 0
  for (const [name, content] of Object.entries(files)) {
    const nameBytes = enc.encode(name)
    const data = enc.encode(content)
    const crc = crc32(data)
    const local = new Uint8Array([0x50,0x4B,0x03,0x04,0x14,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,...u32le(crc),...u32le(data.length),...u32le(data.length),...u16le(nameBytes.length),0x00,0x00,...nameBytes,...data])
    entries.push({ nameBytes, crc, size: data.length, offset })
    offset += local.length
    parts.push(local)
  }
  const centralDir = entries.map(e => new Uint8Array([0x50,0x4B,0x01,0x02,0x14,0x00,0x14,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,...u32le(e.crc),...u32le(e.size),...u32le(e.size),...u16le(e.nameBytes.length),0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,...u32le(e.offset),...e.nameBytes]))
  const cdSize = centralDir.reduce((s,c) => s+c.length, 0)
  const eocd = new Uint8Array([0x50,0x4B,0x05,0x06,0x00,0x00,0x00,0x00,...u16le(entries.length),...u16le(entries.length),...u32le(cdSize),...u32le(offset),0x00,0x00])
  const total = offset + cdSize + eocd.length
  const zip = new Uint8Array(total)
  let pos = 0
  for (const p of parts) { zip.set(p,pos); pos+=p.length }
  for (const c of centralDir) { zip.set(c,pos); pos+=c.length }
  zip.set(eocd,pos)

  const blob = new Blob([zip], { type:'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `tanasiom-aegis-${doc.id.toLowerCase()}-${doc.title.toLowerCase().replace(/[^a-z0-9]+/g,'-')}.docx`
  a.click()
}

// ─────────────────────────────────────────────
// DISCLAIMER GATE
// ─────────────────────────────────────────────
function DisclaimerGate({ onAccept }) {
  const [accepted, setAccepted] = useState(false)
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(15,23,42,0.85)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:'1.5rem' }}>
      <div style={{ background:'#ffffff', border:'1px solid #dde3ec', maxWidth:'640px', width:'100%', maxHeight:'90vh', overflow:'auto' }}>
        <div style={{ background:'#fef2f2', borderBottom:'1px solid #fecaca', padding:'1rem 1.5rem', display:'flex', alignItems:'center', gap:'0.75rem' }}>
          <span style={{ fontSize:'1.2rem' }}>⚠</span>
          <div style={{ fontFamily:display, fontSize:'1rem', letterSpacing:'2px', color:'#dc2626' }}>LEGAL NOTICE — READ BEFORE PROCEEDING</div>
        </div>
        <div style={{ padding:'1.5rem', fontFamily:mono, fontSize:'0.65rem', color:'#334155', lineHeight:2, whiteSpace:'pre-wrap', background:'#f8faff', maxHeight:'45vh', overflow:'auto', borderBottom:'1px solid #dde3ec' }}>
          {LEGAL_DISCLAIMER}
        </div>
        <div style={{ padding:'1.25rem 1.5rem' }}>
          <label style={{ display:'flex', alignItems:'flex-start', gap:'0.75rem', cursor:'pointer', marginBottom:'1.25rem' }}>
            <input type="checkbox" checked={accepted} onChange={e => setAccepted(e.target.checked)} style={{ marginTop:'3px', flexShrink:0, width:16, height:16, accentColor:'#1d4ed8' }} />
            <span style={{ fontSize:'0.82rem', color:'#334155', lineHeight:1.6 }}>
              I have read and understood the above disclaimer. I confirm that I will adapt these templates for my specific organisation, seek independent legal advice where required, and that I accept Tanasiom Aegis's limitation of liability in full. I understand that these documents do not constitute legal advice or a CE assessment.
            </span>
          </label>
          <div style={{ display:'flex', gap:'1rem' }}>
            <button onClick={() => accepted && onAccept()} disabled={!accepted} style={{ flex:1, background: accepted?'#1d4ed8':'#dde3ec', color: accepted?'#fff':'#94a3b8', fontFamily:display, fontSize:'1rem', letterSpacing:'3px', padding:'0.85rem', border:'none', cursor: accepted?'pointer':'not-allowed', transition:'all 0.2s' }}>
              I ACCEPT — ACCESS DOCUMENTS
            </button>
            <button onClick={() => window.history.back()} style={{ padding:'0.85rem 1.25rem', background:'transparent', border:'1px solid #dde3ec', color:'#64748b', fontFamily:mono, fontSize:'0.65rem', cursor:'pointer' }}>
              GO BACK
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// POLICY COMPLETENESS TRACKER
// ─────────────────────────────────────────────
function CompletenessTracker({ downloaded }) {
  const required = [
    { id:'POL-001', label:'Information Security Policy', area:'Foundation' },
    { id:'POL-002', label:'Firewall & Network Policy', area:'Firewalls' },
    { id:'POL-003', label:'Patch Management Policy', area:'Update Management' },
    { id:'POL-004', label:'User Access Control Policy', area:'User Access Control' },
    { id:'POL-005', label:'Malware Protection Policy', area:'Malware Protection' },
    { id:'POL-006', label:'Secure Configuration Policy', area:'Secure Configuration' },
  ]
  const done = required.filter(r => downloaded.has(r.id)).length
  const pct = Math.round((done / required.length) * 100)

  return (
    <div style={{ background:'#ffffff', border:'1px solid #dde3ec', padding:'1.5rem', marginBottom:'2rem' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem', flexWrap:'wrap', gap:'0.75rem' }}>
        <div>
          <div style={{ fontFamily:mono, fontSize:'9px', color:'#1d4ed8', letterSpacing:'3px', marginBottom:'0.25rem' }}>// YOUR CE POLICY COMPLETENESS</div>
          <div style={{ fontFamily:serif, fontSize:'0.95rem', fontStyle:'italic', color:'#64748b' }}>CE assessors check for documented policies across all 5 control areas</div>
        </div>
        <div style={{ textAlign:'right' }}>
          <div style={{ fontFamily:display, fontSize:'2.5rem', color: pct===100?'#16a34a':pct>50?'#d97706':'#dc2626', lineHeight:1 }}>{pct}%</div>
          <div style={{ fontFamily:mono, fontSize:'0.55rem', color:'#94a3b8' }}>{done}/{required.length} REQUIRED</div>
        </div>
      </div>
      <div style={{ height:'8px', background:'#edf0f5', borderRadius:'4px', marginBottom:'1.25rem', overflow:'hidden' }}>
        <div style={{ height:'100%', background: pct===100?'#16a34a':pct>50?'#d97706':'#dc2626', borderRadius:'4px', width:`${pct}%`, transition:'width 0.5s' }} />
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))', gap:'0.5rem' }}>
        {required.map(r => {
          const done = downloaded.has(r.id)
          const areaColor = AREA_COLORS[r.area] || '#1d4ed8'
          return (
            <div key={r.id} style={{ display:'flex', alignItems:'center', gap:'0.75rem', padding:'0.5rem 0.75rem', background: done?'#f0fdf4':'#f8faff', border:`1px solid ${done?'#bbf7d0':'#dde3ec'}` }}>
              <div style={{ width:20, height:20, borderRadius:'50%', background: done?'#16a34a':'#edf0f5', border:`1px solid ${done?'#16a34a':'#dde3ec'}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:'0.65rem', color: done?'#fff':'#94a3b8' }}>
                {done ? '✓' : '○'}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:'0.75rem', color: done?'#16a34a':'#0f172a', fontWeight:600, lineHeight:1.3 }}>{r.label}</div>
                <div style={{ fontFamily:mono, fontSize:'0.5rem', color: done?'#16a34a':'#94a3b8', marginTop:'0.1rem' }}>{r.id} · {r.area}</div>
              </div>
            </div>
          )
        })}
      </div>
      {pct < 100 && (
        <div style={{ marginTop:'1rem', padding:'0.75rem 1rem', background:'#fffbeb', border:'1px solid #fde68a', fontFamily:mono, fontSize:'0.62rem', color:'#92400e' }}>
          ⚠ {required.length - done} required {required.length - done === 1 ? 'policy' : 'policies'} still needed for CE — download the missing documents below
        </div>
      )}
      {pct === 100 && (
        <div style={{ marginTop:'1rem', padding:'0.75rem 1rem', background:'#f0fdf4', border:'1px solid #bbf7d0', fontFamily:mono, fontSize:'0.62rem', color:'#15803d' }}>
          ✓ All required CE policies downloaded — remember to adapt each one for your organisation before use
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// DOCUMENT CARD
// ─────────────────────────────────────────────
function DocCard({ doc, downloaded, onDownload }) {
  const [open, setOpen] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const isDone = downloaded.has(doc.id)

  const handleDownload = () => {
    setDownloading(true)
    setTimeout(() => {
      generateDocx(doc)
      onDownload(doc.id)
      setDownloading(false)
    }, 300)
  }

  return (
    <div style={{ background:'#ffffff', border:`1px solid ${open ? doc.areaColor : '#dde3ec'}`, borderLeft:`4px solid ${doc.areaColor}`, overflow:'hidden', transition:'all 0.2s' }}>
      {/* HEADER */}
      <div style={{ display:'flex', alignItems:'stretch', cursor:'pointer' }} onClick={() => setOpen(o => !o)}>
        <div style={{ flex:1, padding:'1.25rem 1.5rem', display:'grid', gridTemplateColumns:'1fr auto auto', gap:'1rem', alignItems:'center' }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', flexWrap:'wrap', marginBottom:'0.3rem' }}>
              <span style={{ fontFamily:mono, fontSize:'0.55rem', color:'#94a3b8' }}>{doc.id}</span>
              <span style={{ fontFamily:mono, fontSize:'0.52rem', color:doc.tagColor, border:`1px solid ${doc.tagColor}40`, padding:'1px 6px', letterSpacing:'1px' }}>{doc.tag}</span>
              <span style={{ fontFamily:mono, fontSize:'0.5rem', color:doc.areaColor, border:`1px solid ${doc.areaColor}30`, padding:'1px 5px' }}>{doc.area}</span>
              {isDone && <span style={{ fontFamily:mono, fontSize:'0.5rem', color:'#16a34a', border:'1px solid #bbf7d0', padding:'1px 5px', background:'#f0fdf4' }}>✓ DOWNLOADED</span>}
            </div>
            <div style={{ fontFamily:display, fontSize:'0.95rem', letterSpacing:'1px', color:'#0f172a', marginBottom:'0.15rem' }}>{doc.title}</div>
            <div style={{ fontFamily:mono, fontSize:'0.6rem', color:'#94a3b8' }}>{doc.subtitle}</div>
          </div>
          <div style={{ textAlign:'right', flexShrink:0 }}>
            <div style={{ fontFamily:mono, fontSize:'0.58rem', color:'#94a3b8' }}>{doc.pages}</div>
            <div style={{ fontFamily:mono, fontSize:'0.55rem', color:'#94a3b8', marginTop:'0.15rem' }}>{doc.updated}</div>
          </div>
          <div style={{ color:'#94a3b8', fontSize:'0.85rem', flexShrink:0 }}>{open ? '▲' : '▼'}</div>
        </div>
      </div>

      {/* EXPANDED */}
      {open && (
        <div style={{ borderTop:'1px solid #edf0f5' }}>
          <div style={{ padding:'1rem 1.5rem', background:'#f8faff', borderBottom:'1px solid #edf0f5', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'1rem' }}>
            <div style={{ flex:1 }}>
              <p style={{ fontSize:'0.82rem', color:'#334155', lineHeight:1.7, marginBottom:'0.5rem' }}>{doc.desc}</p>
              <div style={{ fontFamily:mono, fontSize:'0.58rem', color:'#92400e', background:'#fef3c7', border:'1px solid #fde68a', padding:'0.35rem 0.65rem', display:'inline-block' }}>
                ⚠ Requires adaptation for your organisation · Not legal advice · Template only
              </div>
            </div>
            <button onClick={handleDownload} disabled={downloading} style={{ background: downloading?'#94a3b8':'#1d4ed8', color:'#fff', border:'none', fontFamily:display, fontSize:'0.9rem', letterSpacing:'3px', padding:'0.75rem 1.5rem', cursor: downloading?'not-allowed':'pointer', transition:'all 0.2s', flexShrink:0, clipPath:'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' }}
              onMouseEnter={e => !downloading && (e.currentTarget.style.background='#1e40af')}
              onMouseLeave={e => !downloading && (e.currentTarget.style.background='#1d4ed8')}
            >
              {downloading ? 'GENERATING...' : '↓ DOWNLOAD .DOCX'}
            </button>
          </div>

          {/* PREVIEW */}
          <div style={{ background:'#0f172a', padding:'1.25rem 1.5rem', maxHeight:'400px', overflowY:'auto' }}>
            <pre style={{ fontFamily:mono, fontSize:'0.68rem', lineHeight:1.85, whiteSpace:'pre-wrap' }}>
              {doc.content.split('\n').map((line, i) => {
                const t = line.trim()
                const isRule = /^[═─]+/.test(t)
                const isSectionTitle = /^[A-Z][A-Z\s&/\-,()]+$/.test(t) && t.length > 4 && !t.startsWith('✓') && !t.startsWith('✗') && !t.includes('│')
                const isPass = t.startsWith('✓')
                const isFail = t.startsWith('✗') || t.includes('AUTOMATIC CE FAIL')
                const isTableRow = t.includes('│')
                const isNotice = t.startsWith('TEMPLATE NOTICE') || t.startsWith('IMPORTANT LEGAL')
                const c = isRule ? '#1e293b' : isNotice ? '#d97706' : isSectionTitle ? '#60a5fa' : isPass ? '#10b981' : isFail ? '#f87171' : isTableRow ? '#93c5fd' : '#cbd5e1'
                return <span key={i} style={{ color:c, display:'block' }}>{line || '\u00A0'}</span>
              })}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────
export default function Docs() {
  const [accepted, setAccepted] = useState(false)
  const [downloaded, setDownloaded] = useState(new Set())
  const [activeTag, setActiveTag] = useState('ALL')
  const [search, setSearch] = useState('')

  const handleDownload = (id) => setDownloaded(prev => new Set([...prev, id]))

  const tags = ['ALL', 'CE REQUIRED', 'FOUNDATION', 'CRITICAL', 'LEGAL', 'CE SCOPE', 'ASSESSMENT']
  const filtered = DOCS.filter(d => {
    if (activeTag !== 'ALL' && d.tag !== activeTag) return false
    if (search) {
      const q = search.toLowerCase()
      return d.title.toLowerCase().includes(q) || d.id.toLowerCase().includes(q) || d.desc.toLowerCase().includes(q) || d.area.toLowerCase().includes(q)
    }
    return true
  })

  const policyPackCTA = (
    <div style={{ background:'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)', padding:'3rem 2rem', position:'relative', overflow:'hidden', marginBottom:'2rem' }}>
      <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'400px', height:'200px', borderRadius:'50%', background:'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)', filter:'blur(60px)', pointerEvents:'none' }} />
      <div style={{ position:'relative', zIndex:1, display:'grid', gridTemplateColumns:'1fr auto', gap:'2rem', alignItems:'center', flexWrap:'wrap' }}>
        <div>
          <div style={{ fontFamily:mono, fontSize:'9px', color:'#60a5fa', letterSpacing:'4px', marginBottom:'0.75rem' }}>// THE DIFFERENCE BETWEEN PAPER-COMPLIANT AND ACTUALLY COMPLIANT</div>
          <h3 style={{ fontFamily:display, fontSize:'clamp(1.8rem, 4vw, 2.8rem)', letterSpacing:'2px', color:'#f0f6ff', lineHeight:0.9, marginBottom:'1rem' }}>
            TEMPLATES GET YOU STARTED.<br /><span style={{ color:'#60a5fa' }}>A REVIEW GETS YOU CERTIFIED.</span>
          </h3>
          <p style={{ fontFamily:serif, fontSize:'1rem', fontStyle:'italic', color:'rgba(224,236,255,0.65)', maxWidth:'500px', lineHeight:1.8 }}>
            These templates are a starting point. A Tanasiom Aegis Gap Review takes your adapted documents, verifies you're actually meeting CE requirements — not just holding the right paperwork — and gives you a prioritised action plan with a human behind it.
          </p>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem', flexShrink:0 }}>
          <Link to="/contact" style={{ background:'#1d4ed8', color:'#fff', fontFamily:display, fontSize:'1rem', letterSpacing:'3px', padding:'1rem 1.75rem', textDecoration:'none', textAlign:'center', clipPath:'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))', transition:'all 0.2s', whiteSpace:'nowrap' }}
            onMouseEnter={e => e.currentTarget.style.background='#1e40af'}
            onMouseLeave={e => e.currentTarget.style.background='#1d4ed8'}
          >BOOK GAP REVIEW — £397</Link>
          <Link to="/framework" style={{ color:'rgba(224,236,255,0.6)', fontFamily:mono, fontSize:'0.65rem', letterSpacing:'2px', textDecoration:'none', textAlign:'center', padding:'0.5rem', border:'1px solid rgba(255,255,255,0.15)', transition:'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.4)'; e.currentTarget.style.color='#fff' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.15)'; e.currentTarget.style.color='rgba(224,236,255,0.6)' }}
          >FREE SELF-CHECK FIRST →</Link>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ fontFamily:body, background:'#f4f6f8', color:'#1a2332', minHeight:'100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@300;400;600;700&family=Share+Tech+Mono&family=Cormorant+Garamond:ital,wght@1,400;1,600&display=swap');
        @media(max-width:768px){ .docs-hero{grid-template-columns:1fr!important;} }
      `}</style>

      {!accepted && <DisclaimerGate onAccept={() => setAccepted(true)} />}

      {/* HERO */}
      <div style={{ padding:'5rem 1.5rem 4rem', background:'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'20%', right:'10%', width:'400px', height:'400px', borderRadius:'50%', background:'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)', filter:'blur(80px)', pointerEvents:'none' }} />
        <div style={{ maxWidth:'1100px', margin:'0 auto', position:'relative', zIndex:2 }}>
          <div style={{ fontFamily:mono, fontSize:'10px', letterSpacing:'4px', color:'#60a5fa', marginBottom:'1.5rem' }}>// TANASIOM AEGIS SECURITY & COMPLIANCE — POLICY LIBRARY</div>
          <h1 style={{ fontFamily:display, fontSize:'clamp(2.5rem, 7vw, 5.5rem)', lineHeight:0.9, letterSpacing:'3px', color:'#f0f6ff', marginBottom:'1.25rem' }}>
            POLICY &<br /><span style={{ color:'#60a5fa' }}>DOCUMENT</span><br />LIBRARY.
          </h1>
          <p style={{ fontFamily:serif, fontSize:'clamp(1rem, 2vw, 1.2rem)', fontStyle:'italic', color:'rgba(224,236,255,0.7)', maxWidth:'620px', lineHeight:1.8, marginBottom:'2rem' }}>
            {DOCS.length} template documents covering all 5 Cyber Essentials control areas, UK GDPR, incident response, and penetration testing authorisation. Download as Word documents. Adapt. Use.
          </p>
          <div style={{ background:'rgba(220,38,38,0.1)', border:'1px solid rgba(220,38,38,0.3)', borderLeft:'3px solid #dc2626', padding:'0.85rem 1.25rem', display:'inline-block', maxWidth:'600px' }}>
            <span style={{ fontFamily:mono, fontSize:'0.62rem', color:'rgba(224,236,255,0.7)', letterSpacing:'1px', lineHeight:1.7, display:'block' }}>
              <strong style={{ color:'#f87171' }}>IMPORTANT:</strong> These are template documents. They require adaptation for your specific organisation. They do not constitute legal advice and do not guarantee CE certification. Tanasiom Aegis accepts no liability for their use.
            </span>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div style={{ background:'#ffffff', borderBottom:'1px solid #dde3ec' }}>
        <div style={{ maxWidth:'1100px', margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap:'1px', background:'#dde3ec' }}>
          {[
            { n: String(DOCS.filter(d=>d.ceRequired).length), l:'CE Required Docs', c:'#16a34a' },
            { n: String(DOCS.filter(d=>d.tag==='LEGAL').length), l:'Legal Documents', c:'#1d4ed8' },
            { n: String(DOCS.length), l:'Total Templates', c:'#0f172a' },
            { n: 'DOCX', l:'Download Format', c:'#1d4ed8' },
            { n: 'Free', l:'All Templates', c:'#16a34a' },
          ].map(s => (
            <div key={s.l} style={{ background:'#ffffff', padding:'1.25rem', textAlign:'center' }}>
              <div style={{ fontFamily:display, fontSize:'clamp(1.4rem, 3vw, 2rem)', color:s.c, lineHeight:1, marginBottom:'0.35rem' }}>{s.n}</div>
              <div style={{ fontSize:'0.75rem', color:'#64748b', lineHeight:1.4 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* LEGAL PROTECTION NOTICE */}
      <div style={{ background:'#fef3c7', borderBottom:'1px solid #fde68a', padding:'0.65rem 1.5rem' }}>
        <div style={{ maxWidth:'1100px', margin:'0 auto', fontFamily:mono, fontSize:'0.6rem', color:'#92400e', lineHeight:1.6 }}>
          ⚠ LEGAL NOTICE: These templates are provided for guidance purposes only. They do not constitute legal advice. Tanasiom Aegis Security & Compliance accepts no liability for their use, adaptation, or any failure to achieve CE certification. CE certificates are issued solely by IASME-licensed Certification Bodies. Tanasiom Aegis is an independent consultancy not affiliated with NCSC, IASME, or the UK Government. Governing law: England & Wales. For legal matters consult a qualified solicitor.
        </div>
      </div>

      {/* FILTER BAR */}
      <div style={{ background:'#ffffff', borderBottom:'1px solid #dde3ec', padding:'1rem 1.5rem', position:'sticky', top:'56px', zIndex:50 }}>
        <div style={{ maxWidth:'1100px', margin:'0 auto', display:'flex', gap:'0.75rem', flexWrap:'wrap', alignItems:'center' }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search documents..."
            style={{ flex:1, minWidth:'180px', background:'#f8faff', border:'1px solid #dde3ec', color:'#0f172a', fontFamily:body, fontSize:'0.82rem', padding:'0.5rem 0.75rem', outline:'none', transition:'border-color 0.2s' }}
            onFocus={e => e.target.style.borderColor='#1d4ed8'}
            onBlur={e => e.target.style.borderColor='#dde3ec'}
          />
          <div style={{ display:'flex', gap:'0.3rem', flexWrap:'wrap' }}>
            {tags.map(t => (
              <button key={t} onClick={() => setActiveTag(t)} style={{ background: activeTag===t?'#1d4ed8':'transparent', border:`1px solid ${activeTag===t?'#1d4ed8':'#dde3ec'}`, color: activeTag===t?'#fff':'#64748b', fontFamily:mono, fontSize:'0.58rem', letterSpacing:'1px', padding:'0.3rem 0.65rem', cursor:'pointer', transition:'all 0.15s' }}>{t}</button>
            ))}
          </div>
          <div style={{ fontFamily:mono, fontSize:'0.6rem', color:'#94a3b8', marginLeft:'auto', whiteSpace:'nowrap' }}>{filtered.length}/{DOCS.length} docs</div>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ maxWidth:'1100px', margin:'0 auto', padding:'2.5rem 1.5rem' }}>

        {/* COMPLETENESS TRACKER */}
        <CompletenessTracker downloaded={downloaded} />

        {/* DOCUMENTS */}
        <div style={{ display:'flex', flexDirection:'column', gap:'1px', background:'#dde3ec', marginBottom:'2rem' }}>
          {filtered.length === 0
            ? <div style={{ background:'#ffffff', padding:'3rem', textAlign:'center', fontFamily:mono, fontSize:'0.82rem', color:'#94a3b8' }}>No documents match your search.</div>
            : filtered.map(doc => <DocCard key={doc.id} doc={doc} downloaded={downloaded} onDownload={handleDownload} />)
          }
        </div>

        {/* POLICY PACK CTA */}
        {policyPackCTA}

        {/* OFFICIAL SOURCES */}
        <div style={{ background:'#ffffff', border:'1px solid #dde3ec', padding:'1.75rem' }}>
          <div style={{ fontFamily:mono, fontSize:'9px', color:'#1d4ed8', letterSpacing:'3px', marginBottom:'1.5rem' }}>// OFFICIAL REGULATORY SOURCES</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:'1px', background:'#dde3ec' }}>
            {[
              { label:'NCSC Cyber Essentials', url:'https://www.ncsc.gov.uk/cyberessentials/overview', cat:'NCSC', desc:'Official CE scheme overview and requirements' },
              { label:'IASME — Apply for CE', url:'https://iasme.co.uk/cyber-essentials/apply-for-cyber-essentials/', cat:'IASME', desc:'Official CE application portal' },
              { label:'ICO — UK GDPR Guide', url:'https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/', cat:'ICO', desc:'ICO guidance on UK GDPR compliance' },
              { label:'ICO — Report a Breach', url:'https://ico.org.uk/for-organisations/report-a-breach/', cat:'ICO', desc:'72-hour breach notification portal' },
              { label:'Computer Misuse Act 1990', url:'https://www.legislation.gov.uk/ukpga/1990/18/contents', cat:'LEGAL', desc:'Full text on legislation.gov.uk' },
              { label:'CISA KEV Catalog', url:'https://www.cisa.gov/known-exploited-vulnerabilities-catalog', cat:'CISA', desc:'Known Exploited Vulnerabilities' },
              { label:'NCSC — Incident Response', url:'https://www.ncsc.gov.uk/collection/incident-management', cat:'NCSC', desc:'NCSC incident management guidance' },
              { label:'CE Requirements v3.3', url:'https://www.ncsc.gov.uk/cyberessentials/overview', cat:'NCSC', desc:'Full technical requirements document' },
            ].map(l => (
              <a key={l.label} href={l.url} target="_blank" rel="noreferrer" style={{ background:'#f8faff', padding:'1rem', textDecoration:'none', display:'block', transition:'all 0.2s', borderTop:'2px solid transparent' }}
                onMouseEnter={e => { e.currentTarget.style.background='#eff6ff'; e.currentTarget.style.borderTopColor='#1d4ed8' }}
                onMouseLeave={e => { e.currentTarget.style.background='#f8faff'; e.currentTarget.style.borderTopColor='transparent' }}
              >
                <div style={{ fontFamily:mono, fontSize:'0.52rem', color:'#1d4ed8', letterSpacing:'2px', marginBottom:'0.2rem' }}>{l.cat}</div>
                <div style={{ fontSize:'0.8rem', color:'#0f172a', fontWeight:600, marginBottom:'0.15rem' }}>{l.label} ↗</div>
                <div style={{ fontFamily:mono, fontSize:'0.55rem', color:'#94a3b8', lineHeight:1.4 }}>{l.desc}</div>
              </a>
            ))}
          </div>
        </div>

      </div>

      {/* FOOTER LEGAL */}
      <div style={{ borderTop:'1px solid #dde3ec', padding:'1.5rem', textAlign:'center', background:'#ffffff' }}>
        <div style={{ fontFamily:mono, fontSize:'0.55rem', color:'#94a3b8', letterSpacing:'1px', lineHeight:1.8, maxWidth:'800px', margin:'0 auto' }}>
          TANASIOM AEGIS SECURITY & COMPLIANCE · TEMPLATE DOCUMENTS PROVIDED FOR GUIDANCE ONLY · NOT LEGAL ADVICE · NOT A CE ASSESSMENT · CE CERTIFICATES ISSUED SOLELY BY IASME-LICENSED CERTIFICATION BODIES · TANASIOM AEGIS IS NOT AFFILIATED WITH NCSC, IASME, OR THE UK GOVERNMENT · GOVERNING LAW: ENGLAND & WALES · © {new Date().getFullYear()} TANASIOM AEGIS SECURITY & COMPLIANCE
        </div>
      </div>
    </div>
  )
}