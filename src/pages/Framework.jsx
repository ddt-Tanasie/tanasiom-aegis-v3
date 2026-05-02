import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Radar } from 'react-chartjs-2'
import {
  Chart as ChartJS, RadialLinearScale, PointElement,
  LineElement, Filler, Tooltip, Legend,
} from 'chart.js'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

const THREATS = [
  'Threat watch: phishing remains the most prevalent attack type reported by affected UK businesses',
  'Scheme update: CE v3.3 now mandates MFA on all cloud services for all users — not just admins',
  'IASME: High-risk and critical updates must be applied within 14 days under current scheme rules',
  'Scope reminder: BYOD devices accessing organisational data or cloud services are in scope for CE',
  'NCSC guidance: default passwords on network devices must be changed — assessors specifically check this',
  'Scheme update: cloud services must now be formally included in your CE scope statement',
  'ICO reminder: personal data on end-of-life devices requires documented sanitisation, not a factory reset',
  'CE renewal: your controls are checked again at renewal — slippage between years causes failures',
]

const QS = [
  { id:'FW-01', area:'Firewalls', code:'fw', title:'All devices have firewall protection', text:'Are all in-scope devices protected by a correctly configured firewall or network device with firewall functionality?', hint:'Includes boundary firewalls, host-based firewalls on laptops, and cloud firewalls. Home ISP routers are out of scope unless provided by the organisation.', critical:true, rem:'Enable Windows Firewall on all devices. Configure boundary firewall on your office router. Use software firewalls on home-working laptops.' },
  { id:'FW-02', area:'Firewalls', code:'fw', title:'Default admin passwords changed', text:'Have all default administrative passwords on firewalls and network devices been changed to strong unique passwords?', hint:'Default passwords like "admin/admin" are publicly known and represent a likely certification blocker under CE.', critical:true, rem:'Change all router/firewall default credentials. Use the Password Policy template. Document the change date in your Firewall Rules log.' },
  { id:'FW-03', area:'Firewalls', code:'fw', title:'Admin interface not internet-accessible', text:'Is the administrative interface of your firewall/router blocked from internet access — unless protected by MFA or a trusted IP allowlist?', hint:'Internet-facing admin panels are a critical vulnerability. Remote admin must use MFA or IP restriction.', critical:false, rem:'Disable WAN-side admin access in your router settings. If remote admin is required, enable MFA or set an IP allowlist.' },
  { id:'FW-04', area:'Firewalls', code:'fw', title:'Default-deny on inbound connections', text:'Does your firewall block unauthenticated inbound connections by default?', hint:'Traffic should be blocked unless explicitly permitted by an approved, documented rule.', critical:false, rem:'Review firewall settings. Enable default-deny on inbound traffic. Document any exceptions with business justification.' },
  { id:'FW-05', area:'Firewalls', code:'fw', title:'Inbound rules documented with business need', text:'Are all inbound firewall rules approved by an authorised person and documented with a stated business need?', hint:'Assessors specifically check for documented firewall rules. Undocumented rules are a common fail point.', critical:false, rem:'Use the Firewall Rules Documentation template: record each rule with purpose, ports, protocol, approver, date approved.' },
  { id:'FW-06', area:'Firewalls', code:'fw', title:'Unnecessary rules removed promptly', text:'Are firewall rules that are no longer required removed or disabled promptly?', hint:'Stale rules expand attack surface unnecessarily.', critical:false, rem:'Schedule quarterly firewall rule reviews. Remove any rules with no current business justification.' },
  { id:'FW-07', area:'Firewalls', code:'fw', title:'Software firewall on untrusted networks', text:'Do employees use a software firewall on devices when connecting to untrusted networks?', hint:'Device-level software firewalls are required for remote workers on public Wi-Fi.', critical:false, rem:'Confirm Windows Firewall is enabled on all laptops. Create a Remote Working Policy.' },
  { id:'FW-08', area:'Firewalls', code:'fw', title:'Cloud firewall controls configured', text:'Where cloud services are in scope, have appropriate data flow policies been configured?', hint:'For SaaS/IaaS you must still ensure network security controls are applied.', critical:false, rem:'Review Microsoft 365 or cloud provider security settings. Enable network access controls where available.' },
  { id:'FW-09', area:'Firewalls', code:'fw', title:'VPN firewall boundary understood', text:'If remote workers use a corporate VPN, is the firewall boundary correctly understood?', hint:'The CE firewall boundary is at the corporate firewall — not the home router.', critical:false, rem:'Document your VPN configuration and clarify the firewall boundary in your scope document.' },
  { id:'FW-10', area:'Firewalls', code:'fw', title:'Wireless access points secured', text:'Have wireless access points been included in scope and configured securely?', hint:'Wi-Fi access points routing to the internet are in scope.', critical:false, rem:'Audit all wireless access points. Ensure WPA2/WPA3 is used; change default SSIDs and passwords.' },
  { id:'SC-01', area:'Secure Configuration', code:'sc', title:'Unnecessary user accounts removed', text:'Have unnecessary user accounts including guest accounts been removed or disabled?', hint:'Default guest accounts are a common misconfiguration.', critical:false, rem:'Computer Management → Local Users on each device. Disable Guest and any unused accounts.' },
  { id:'SC-02', area:'Secure Configuration', code:'sc', title:'Default application passwords changed', text:'Have default passwords been changed for all applications and operating systems?', hint:'This applies to software with pre-set passwords, not just network devices.', critical:true, rem:'Audit all applications for default credentials. Change to strong unique passwords per the Password Policy template.' },
  { id:'SC-03', area:'Secure Configuration', code:'sc', title:'Unnecessary software removed', text:'Has unnecessary software been removed or disabled from all in-scope devices?', hint:'Unused software is a source of unpatched vulnerabilities.', critical:false, rem:'Review installed programs on each device. Uninstall anything not required for business use.' },
  { id:'SC-04', area:'Secure Configuration', code:'sc', title:'Auto-run disabled', text:'Has the auto-run feature been disabled on all in-scope devices?', hint:'Auto-run allows malware on USB drives to execute without user action.', critical:false, rem:'Disable AutoPlay and AutoRun in Windows Settings / Group Policy.' },
  { id:'SC-05', area:'Secure Configuration', code:'sc', title:'Authentication required before access', text:'Are users required to authenticate before accessing any organisational data?', hint:'No device should provide access to business data without prior authentication.', critical:false, rem:'Ensure all devices require sign-in. Remove any auto-login configurations.' },
  { id:'SC-06', area:'Secure Configuration', code:'sc', title:'Device locking controls in place', text:'Do all in-scope devices require a PIN, password, or biometric to unlock?', hint:'Minimum 6-character PIN. Lockout after 10 attempts required.', critical:false, rem:'Enable screen lock on all devices. Set minimum 6-character PIN. Enable lockout after 10 failed attempts.' },
  { id:'SC-07', area:'Secure Configuration', code:'sc', title:'BYOD devices secured', text:'If employees use personal devices to access organisational data, have those devices been configured to CE requirements?', hint:'BYOD devices accessing email or business apps are in scope.', critical:false, rem:'Apply MDM policies to BYOD or create a BYOD policy restricting which data can be accessed.' },
  { id:'SC-08', area:'Secure Configuration', code:'sc', title:'Asset inventory maintained', text:'Does your organisation maintain an accurate inventory of all in-scope hardware and software assets?', hint:'NCSC emphasises effective asset management underpins all five CE controls.', critical:false, rem:'Complete the Device and Software Inventory template. Record all laptops, phones, servers, and cloud services.' },
  { id:'SC-09', area:'Secure Configuration', code:'sc', title:'MSP/third-party accounts managed', text:'Where an MSP or third party uses accounts on your systems, have those accounts been included in scope?', hint:'All accounts your organisation owns including those used by MSPs are in scope.', critical:false, rem:'List all MSP/third-party accounts in your User Access Control Matrix.' },
  { id:'SC-10', area:'Secure Configuration', code:'sc', title:'Scope formally defined', text:'Has the CE assessment scope been formally defined to include all networks, devices, and cloud services?', hint:'A scope without end-user devices is not acceptable.', critical:false, rem:'Document your scope using the Scope Definition template.' },
  { id:'UM-01', area:'Update Management', code:'um', title:'All software licensed and supported', text:'Is all software on in-scope devices licensed and actively supported by the vendor?', hint:'Unsupported software (e.g. Windows 7, Office 2010) is a likely certification blocker.', critical:true, rem:'Audit all software for end-of-life status. Remove or upgrade any software no longer receiving security updates.' },
  { id:'UM-02', area:'Update Management', code:'um', title:'Automatic updates enabled', text:'Has automatic updating been enabled on all in-scope devices where the vendor supports it?', hint:'Automatic updates reduce the risk of patches being missed.', critical:false, rem:'Enable Windows Update automatic downloads and installs on all devices.' },
  { id:'UM-03', area:'Update Management', code:'um', title:'Critical patches within 14 days', text:'Are security updates rated "critical" or "high risk" (CVSS ≥7.0) applied within 14 days of vendor release?', hint:'The 14-day rule is strictly enforced under CE v3.3. Overdue critical patches are a likely certification blocker.', critical:true, rem:'Implement the Patch Management Procedure. Track all patches using the Patch Tracking Template.' },
  { id:'UM-04', area:'Update Management', code:'um', title:'OS updates current', text:'Are all operating systems running a currently supported version with the latest security updates?', hint:'Applies to Windows, macOS, iOS, Android, Linux on any in-scope device.', critical:false, rem:'Run Windows Update / Software Update on all devices. Upgrade any end-of-life OS.' },
  { id:'UM-05', area:'Update Management', code:'um', title:'Application software updated', text:'Is all business application software updated to the latest version?', hint:'Browsers in particular must be kept current.', critical:false, rem:'Check all installed applications for updates. Enable auto-update where possible.' },
  { id:'UM-06', area:'Update Management', code:'um', title:'Mobile device updates applied', text:'Are mobile devices used for business running a supported OS version with security updates applied?', hint:'Mobile devices are in scope if they access organisational data.', critical:false, rem:'Check iOS/Android update settings on all business-use mobile devices. Enable automatic updates.' },
  { id:'UM-07', area:'Update Management', code:'um', title:'Patch tracking mechanism in place', text:'Does your organisation have a formal process for tracking the patch status of all in-scope software?', hint:'Without a tracking mechanism you cannot demonstrate compliance with the 14-day rule.', critical:false, rem:'Adopt the Patch Tracking Template. Record software versions, patch dates, CVSS scores.' },
  { id:'UM-08', area:'Update Management', code:'um', title:'Network device firmware updated', text:'Is the firmware on firewalls, routers, and other network devices kept up to date?', hint:'Router and firewall firmware is software and must be kept current.', critical:false, rem:'Check your router/firewall admin panel for firmware updates. Set a quarterly review.' },
  { id:'UM-09', area:'Update Management', code:'um', title:'Unsupported software isolated or removed', text:'Where software has become unsupported, has it been removed or isolated with no internet access?', hint:'Virtual patching is not an acceptable long-term solution.', critical:false, rem:'Remove or upgrade all unsupported software. Document any isolated network sub-sets.' },
  { id:'UM-10', area:'Update Management', code:'um', title:'Cloud service updates monitored', text:'Are updates and changes to cloud services monitored and applied in line with vendor guidance?', hint:'Cloud service updates can introduce security changes requiring configuration review.', critical:false, rem:'Subscribe to vendor security bulletins. Review Microsoft 365 Message Centre weekly.' },
  { id:'UA-01', area:'User Access Control', code:'ua', title:'MFA on all cloud services', text:'Is Multi-Factor Authentication enabled on all cloud services for all users?', hint:'MFA on cloud services is mandatory under CE v3.3. This is a likely certification blocker if not configured.', critical:true, rem:'Enable MFA immediately on all cloud services. Enable Security Defaults in Microsoft 365 admin centre.' },
  { id:'UA-02', area:'User Access Control', code:'ua', title:'Separate admin accounts used', text:'Do administrators use a separate, dedicated account for admin tasks?', hint:'Admin tasks must never be performed from standard user accounts.', critical:true, rem:'Create dedicated admin accounts. Standard accounts for daily use, separate admin accounts for privileged tasks only.' },
  { id:'UA-03', area:'User Access Control', code:'ua', title:'Least privilege applied', text:'Do users only have access to the systems and data required for their current role?', hint:'Privilege creep is a common SME issue.', critical:false, rem:"Conduct an access rights review. Remove any access not required for the user's current role." },
  { id:'UA-04', area:'User Access Control', code:'ua', title:'Leavers process in place', text:'Are user accounts disabled or deleted promptly when staff leave?', hint:'Accounts must be disabled on the last day of employment without exception.', critical:true, rem:'Implement a leavers checklist. Accounts must be disabled on the last day of employment.' },
  { id:'UA-05', area:'User Access Control', code:'ua', title:'Unique credentials for each user', text:'Does every user authenticate using unique individual credentials?', hint:'Shared accounts prevent accountability.', critical:false, rem:'Audit for any shared accounts. Create individual accounts for all users.' },
  { id:'UA-06', area:'User Access Control', code:'ua', title:'Password minimum length enforced', text:'Does your password policy require at least 12 characters or mandate MFA?', hint:'CE requires one of: MFA, 12+ character passwords, or 8+ with common-password blocking.', critical:false, rem:'Update your Password Policy to mandate minimum 12-character passwords or implement a deny list.' },
  { id:'UA-07', area:'User Access Control', code:'ua', title:'Brute-force protection in place', text:'Are user accounts protected against brute-force attacks?', hint:'At least one protection must be in place for all accounts including cloud services.', critical:false, rem:'Enable account lockout in Azure AD / Active Directory. Check cloud service login throttling settings.' },
  { id:'UA-08', area:'User Access Control', code:'ua', title:'MFA on admin accounts', text:'Is MFA enabled on all administrative accounts?', hint:'Admin accounts must always use MFA.', critical:true, rem:'Enable MFA for all admin accounts. Use Microsoft Authenticator or a FIDO2 security key.' },
  { id:'UA-09', area:'User Access Control', code:'ua', title:'Privileges reviewed regularly', text:'Are special access privileges reviewed regularly?', hint:'Access rights must be reviewed at minimum quarterly.', critical:false, rem:'Conduct quarterly access reviews using the User Access Control Matrix.' },
  { id:'UA-10', area:'User Access Control', code:'ua', title:'No mandatory password expiry', text:'Is your password policy aligned with NCSC guidance — not enforcing regular mandatory password expiry?', hint:'NCSC explicitly recommends against mandatory rotation.', critical:false, rem:'Update your Password Policy to remove forced expiry. Communicate the rationale to staff.' },
  { id:'MP-01', area:'Malware Protection', code:'mp', title:'Anti-malware active on all devices', text:'Is anti-malware software active and running on all in-scope Windows and macOS devices?', hint:'Microsoft Defender is acceptable. At least one mechanism must be active on every device.', critical:true, rem:'Verify Microsoft Defender is enabled: Settings → Windows Security → Virus & threat protection.' },
  { id:'MP-02', area:'Malware Protection', code:'mp', title:'Anti-malware definitions updated automatically', text:'Is anti-malware software configured to update its definitions automatically?', hint:'Out-of-date virus definitions mean new malware will not be detected.', critical:false, rem:'Enable automatic definition updates in Windows Security / your AV software.' },
  { id:'MP-03', area:'Malware Protection', code:'mp', title:'Real-time protection enabled', text:'Is anti-malware configured for real-time protection not just on-demand scanning?', hint:'Scan-only products or disabled real-time protection will fail CE assessment.', critical:false, rem:'Enable Real-time protection in Windows Security → Virus & threat protection settings.' },
  { id:'MP-04', area:'Malware Protection', code:'mp', title:'Malicious website blocking enabled', text:'Is anti-malware or browser controls configured to block connections to known malicious websites?', hint:'Web filtering and SmartScreen are part of the malware protection requirement.', critical:false, rem:'Enable Microsoft Defender SmartScreen. Enable web content filtering in your browser or firewall.' },
  { id:'MP-05', area:'Malware Protection', code:'mp', title:'Unapproved software installation prevented', text:'Are users prevented from installing unsigned or unapproved applications?', hint:'Standard user accounts without admin rights achieve this for most users.', critical:false, rem:'Use standard user accounts so users cannot install unapproved software without authorisation.' },
  { id:'MP-06', area:'Malware Protection', code:'mp', title:'Email malware protection in place', text:'Is email-borne malware filtered at the server/cloud level before reaching users?', hint:'Microsoft 365 Defender for Office 365 or equivalent provides server-side email scanning.', critical:false, rem:'Enable Microsoft Defender for Office 365 or confirm your email provider has anti-malware scanning enabled.' },
  { id:'MP-07', area:'Malware Protection', code:'mp', title:'Anti-malware logs accessible', text:'Are anti-malware logs accessible and reviewed periodically?', hint:'IASME assessors may check logs during CE Plus audits.', critical:false, rem:'Check Windows Security → Protection History for recent results. Set up monthly log review.' },
  { id:'MP-08', area:'Malware Protection', code:'mp', title:'Mobile device malware protection', text:'Do mobile devices used for business have malware protection?', hint:'iOS with App Store-only restrictions is generally acceptable.', critical:false, rem:'iOS: permit only App Store apps. Android: install mobile AV or restrict to managed app store.' },
  { id:'MP-09', area:'Malware Protection', code:'mp', title:'Incident response procedure defined', text:'Does your organisation have a documented process for responding to a cyber incident?', hint:'An Incident Response Procedure demonstrates readiness beyond just technical controls.', critical:false, rem:'Complete the Incident Response Policy template. Communicate the procedure to all staff.' },
  { id:'MP-10', area:'Malware Protection', code:'mp', title:'Backups in place', text:'Does your organisation maintain regular backups of critical data with at least one copy stored separately?', hint:'Backups are strongly recommended by NCSC and assess overall cyber resilience.', critical:false, rem:'Enable OneDrive/SharePoint auto-backup. Create an offline or offsite backup. Test restoration quarterly.' },
]

const AREAS = ['Firewalls','Secure Configuration','Update Management','User Access Control','Malware Protection']

const TEMPLATES = [
  { icon:'🔥', name:'Firewall Rules Documentation', version:'v1.0', area:'Firewalls', desc:'Document all inbound firewall rules with business justification, approver, and review dates. Required CE evidence.', sections:[{ heading:'Document Control', fields:['Organisation:','Prepared by:','Approved by:','Version:','Date:','Next review:'] },{ heading:'Purpose', body:'This document records all inbound firewall rules in scope for Cyber Essentials. All rules must have a named business justification and an authorised approver.' },{ heading:'Firewall Rules Register', table:['Rule ID','Description / Purpose','Source IP / Range','Destination','Protocol & Port(s)','Business Justification','Approved By','Date Approved','Review Date'] },{ heading:'Review History', table:['Date','Reviewed By','Changes Made','Outcome'] },{ heading:'Sign-off', fields:['Prepared by:','Role:','Date:','Approved by:','Role:','Date:'] }] },
  { icon:'🔐', name:'Password & MFA Policy', version:'v1.0', area:'User Access Control', desc:'NCSC-aligned password policy. Minimum 12 characters, no mandatory expiry, brute-force protection, MFA mandate for cloud services.', sections:[{ heading:'Document Control', fields:['Organisation:','Prepared by:','Approved by:','Version:','Date:','Next review:'] },{ heading:'Policy Statement', body:'All user accounts accessing organisational systems must be protected by strong credentials. This policy applies to all employees, contractors, and third parties with access to in-scope systems.' },{ heading:'Password Requirements', body:'• Minimum 12 characters\n• No mandatory periodic expiry (NCSC-aligned)\n• Brute-force protection required on all accounts\n• Block commonly used passwords\n• Use a password manager for unique credentials\n• Never reuse passwords across services' },{ heading:'MFA Requirements', body:'• MFA is mandatory on all cloud services for all users — CE v3.3\n• MFA is mandatory on all administrative accounts\n• Recommended: authenticator app over SMS\n• Acceptable: FIDO2 hardware key, authenticator app\n• Not acceptable as sole factor: SMS where alternatives exist' },{ heading:'Account Lockout', body:'• Maximum 10 failed attempts before lockout\n• Lockout duration: minimum 5 minutes or admin unlock required\n• Applies to all in-scope systems including cloud portals' },{ heading:'Sign-off', fields:['Prepared by:','Role:','Date:','Approved by:','Role:','Date:'] }] },
  { icon:'🩹', name:'Patch Management Procedure', version:'v1.0', area:'Update Management', desc:'Formal process ensuring critical patches are applied within the 14-day CE v3.3 requirement. Includes patch tracking log.', sections:[{ heading:'Document Control', fields:['Organisation:','Prepared by:','Approved by:','Version:','Date:','Next review:'] },{ heading:'Purpose', body:'This procedure ensures that security updates are applied within the timescales required by Cyber Essentials v3.3. Critical and high-risk updates (CVSS score ≥7.0) must be applied within 14 days of release.' },{ heading:'Weekly Patch Review Process', body:'Step 1 — Every Monday: Check Windows Update on all in-scope devices\nStep 2 — Every Monday: Review Microsoft 365 Admin Centre for service updates\nStep 3 — Check vendor advisories for all in-scope business applications\nStep 4 — Record findings in Patch Tracking Log (below)\nStep 5 — Apply all critical/high patches within 14 days of release\nStep 6 — Confirm application and record completion date' },{ heading:'Patch Tracking Log', table:['Software / Device','Current Version','Patch Available','CVSS Score','Release Date','14-Day Deadline','Applied Date','Applied By','Evidence'] },{ heading:'Unsupported Software Register', table:['Software','End-of-Life Date','Action Taken','Isolated? Y/N','Removal Planned By'] },{ heading:'Sign-off', fields:['Prepared by:','Role:','Date:','Approved by:','Role:','Date:'] }] },
  { icon:'👥', name:'User Access Control Matrix', version:'v1.0', area:'User Access Control', desc:'Track all user accounts, MFA status, privileges, access scope, and review dates. Required CE evidence.', sections:[{ heading:'Document Control', fields:['Organisation:','Prepared by:','Approved by:','Version:','Date:','Next review:'] },{ heading:'Purpose', body:'This matrix records all user accounts across in-scope systems, their access rights, MFA status, and last review date. CE requires accounts to use least privilege and to be reviewed regularly.' },{ heading:'User Account Register', table:['Full Name','Job Title','Standard Account','Admin Account (Separate)','MFA Enabled','Services Accessible','Access Level','Last Reviewed','Status (Active/Inactive)'] },{ heading:'Third-Party & MSP Accounts', table:['Organisation','Named Contact','Account Name','Systems Accessed','Access Level','MFA Enabled','Review Date','Expiry / End Date'] },{ heading:'Leavers Process', body:'On last day of employment:\n□ Standard account disabled\n□ Admin account disabled\n□ MFA device removed / revoked\n□ Cloud service access revoked\n□ Access matrix updated\n□ Manager sign-off obtained\n□ Date recorded in this document' },{ heading:'Quarterly Review Sign-off', table:['Quarter','Reviewed By','Date','Changes Made','Sign-off'] }] },
  { icon:'🚨', name:'Incident Response Policy', version:'v1.0', area:'Malware Protection', desc:'Documented procedure for responding to malware, data breaches, account compromise and suspected incidents.', sections:[{ heading:'Document Control', fields:['Organisation:','Prepared by:','Approved by:','Version:','Date:','Next review:'] },{ heading:'Purpose', body:'This policy defines how the organisation responds to a suspected or confirmed cyber security incident. All staff must be aware of this procedure.' },{ heading:'What Counts as an Incident', body:'• Suspected malware or ransomware on any device\n• Unexpected account lockout or password reset\n• Unauthorised access attempt (successful or not)\n• Lost or stolen device containing business data\n• Phishing email that was clicked or credentials entered\n• Unusual system behaviour or unexplained data access' },{ heading:'Immediate Response Steps', body:'Step 1 — Isolate the affected device from the network immediately (unplug ethernet / disable Wi-Fi)\nStep 2 — Do NOT turn off the device unless advised to do so\nStep 3 — Do NOT attempt to investigate or fix the device yourself\nStep 4 — Contact the named incident lead immediately\n\nIncident Lead: ___________________\nContact: ___________________\nBackup contact: ___________________' },{ heading:'GDPR Notification Requirement', body:'If personal data may have been compromised:\n• The ICO must be notified within 72 hours of becoming aware\n• ICO report portal: ico.org.uk/make-a-report\n• Record: what data was affected, how many individuals, likely impact, steps taken' },{ heading:'Incident Log', table:['Date','Reported By','Description','Systems Affected','Action Taken','ICO Notified Y/N','Resolved Date'] },{ heading:'Sign-off', fields:['Prepared by:','Role:','Date:','Approved by:','Role:','Date:'] }] },
  { icon:'📋', name:'Scope Definition Document', version:'v1.0', area:'All Controls', desc:'Formally define your CE assessment scope before applying. Assessors challenge scope statements that are incomplete.', sections:[{ heading:'Document Control', fields:['Organisation:','Legal entity name:','Prepared by:','Approved by:','Version:','Date:'] },{ heading:'Scope Statement', body:'This document defines the boundary of the Cyber Essentials assessment for [Organisation Name]. All systems, devices and services within this boundary are in scope for the assessment.' },{ heading:'In-Scope Assets', table:['Asset Type','Description / Names','Location','Users','Internet-facing Y/N','Notes'] },{ heading:'Cloud Services In Scope', table:['Service Name','Provider','Business Use','Users','Admin Account Holder','MFA Enabled'] },{ heading:'BYOD and Home-Working', body:'• Does the organisation permit BYOD? Y / N\n• If yes, do BYOD devices access organisational data or cloud services? Y / N\n• If yes, BYOD devices are in scope and must meet CE requirements\n• Remote working policy reference: ___________________' },{ heading:'Explicitly Out of Scope', body:'List any systems, sites or services explicitly excluded and the reason for exclusion:' },{ heading:'Sign-off', fields:['Prepared by:','Role:','Date:','Approved by:','Role:','Date:'] }] },
  { icon:'🛡️', name:'MFA Implementation Guide', version:'v1.0', area:'User Access Control', desc:'Step-by-step guide for enabling MFA on Microsoft 365 and common cloud services. Mandatory under CE v3.3.', sections:[{ heading:'Document Control', fields:['Organisation:','Prepared by:','Approved by:','Version:','Date:'] },{ heading:'Why MFA is Required', body:'CE v3.3 mandates MFA on all cloud services for all users. This applies to Microsoft 365, Google Workspace, Xero, Salesforce, and any other service accessed via internet login. Failure to configure MFA is a likely certification blocker.' },{ heading:'Microsoft 365 — Enable Security Defaults', body:'Option A (simplest — recommended for most SMEs):\n1. Sign in to admin.microsoft.com\n2. Go to: Identity → Overview → Properties\n3. Click "Manage security defaults"\n4. Set to Enabled\n5. Save\n6. All users will be prompted to register MFA at next sign-in\n\nOption B (conditional access — for more control):\n1. Requires Azure AD P1 licence\n2. Create conditional access policy requiring MFA for all users\n3. Exclude break-glass account only' },{ heading:'Google Workspace', body:'1. Admin Console → Security → Authentication → 2-step verification\n2. Select "Turn on enforcement"\n3. Set enforcement date (allow 2 weeks for users to register)\n4. Monitor: Security → Authentication → 2-Step Verification report' },{ heading:'MFA Method Preference', body:'Recommended (most secure to least):\n1. FIDO2 hardware security key (e.g. YubiKey)\n2. Authenticator app (Microsoft Authenticator, Google Authenticator)\n3. Push notification via authenticator app\n4. SMS one-time code (acceptable but weaker)\n\nNot acceptable as the only authentication method: SMS alone where app-based alternatives exist' },{ heading:'Evidence for CE Assessment', body:'• Screenshot of Security Defaults enabled in M365 admin\n• Screenshot of 2-step enforcement in Google Workspace\n• Screenshot of per-user MFA status report\n• This completed document with sign-off' },{ heading:'Sign-off', fields:['Prepared by:','Role:','Date:','Approved by:','Role:','Date:'] }] },
]

// ─────────────────────────────────────────────
// DOCX GENERATOR
// ─────────────────────────────────────────────
function generateTemplateDocx(t) {
  const esc = str => str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
  let body = ''
  body += `<w:p><w:pPr><w:jc w:val="center"/><w:spacing w:after="0"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="26"/><w:color w:val="0F172A"/></w:rPr><w:t>TANASIOM AEGIS SECURITY &amp; COMPLIANCE</w:t></w:r></w:p>`
  body += `<w:p><w:pPr><w:jc w:val="center"/><w:spacing w:after="0"/></w:pPr><w:r><w:rPr><w:sz w:val="20"/><w:color w:val="1D4ED8"/></w:rPr><w:t>CYBER ESSENTIALS WORKING DOCUMENT</w:t></w:r></w:p>`
  body += `<w:p><w:pPr><w:jc w:val="center"/><w:spacing w:after="240"/></w:pPr><w:r><w:rPr><w:sz w:val="16"/><w:color w:val="94A3B8"/></w:rPr><w:t>${esc(t.name)} · ${esc(t.version)} · ${esc(t.area)}</w:t></w:r></w:p>`
  body += `<w:p><w:pPr><w:pBdr><w:top w:val="single" w:sz="6" w:color="1D4ED8"/></w:pBdr><w:spacing w:after="80"/></w:pPr></w:p>`
  body += `<w:p><w:pPr><w:pBdr><w:left w:val="single" w:sz="12" w:color="F59E0B"/></w:pBdr><w:ind w:left="180"/><w:spacing w:after="40"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="16"/><w:color w:val="92400E"/></w:rPr><w:t>WORKING DOCUMENT — REQUIRES ADAPTATION — NOT A CERTIFICATION OUTPUT — NOT LEGAL ADVICE</w:t></w:r></w:p>`
  body += `<w:p><w:pPr><w:pBdr><w:left w:val="single" w:sz="12" w:color="F59E0B"/></w:pBdr><w:ind w:left="180"/><w:spacing w:after="240"/></w:pPr><w:r><w:rPr><w:sz w:val="16"/><w:color w:val="78350F"/></w:rPr><w:t>This template must be completed, reviewed, and approved internally before use as CE evidence. Tanasiom Aegis Security &amp; Compliance accepts no liability for its use. CE certificates are issued solely by IASME-licensed Certification Bodies. Not affiliated with NCSC, IASME, or the UK Government. Governing law: England &amp; Wales. For legal matters consult a qualified solicitor.</w:t></w:r></w:p>`
  t.sections.forEach(s => {
    body += `<w:p><w:pPr><w:spacing w:before="240" w:after="80"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="20"/><w:color w:val="0F172A"/></w:rPr><w:t>${esc(s.heading.toUpperCase())}</w:t></w:r></w:p>`
    body += `<w:p><w:pPr><w:pBdr><w:bottom w:val="single" w:sz="4" w:color="DDE3EC"/></w:pBdr><w:spacing w:after="120"/></w:pPr></w:p>`
    if (s.body) {
      s.body.split('\n').forEach(line => {
        const ip = line.trim().startsWith('•') || /^Step \d/.test(line.trim()) || /^\d\./.test(line.trim()) || line.trim().startsWith('□')
        const isPass = line.trim().startsWith('✓'), isFail = line.trim().startsWith('✗')
        const c = isPass ? '16A34A' : isFail ? 'DC2626' : '334155'
        body += `<w:p><w:pPr><w:spacing w:after="60"/>${ip?'<w:ind w:left="240"/>':''}</w:pPr><w:r><w:rPr><w:sz w:val="18"/><w:color w:val="${c}"/></w:rPr><w:t xml:space="preserve">${esc(line)}</w:t></w:r></w:p>`
      })
    }
    if (s.fields) {
      s.fields.forEach(f => {
        body += `<w:p><w:pPr><w:spacing w:after="80"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="18"/><w:color w:val="475569"/></w:rPr><w:t xml:space="preserve">${esc(f)}  </w:t></w:r><w:r><w:rPr><w:sz w:val="18"/><w:color w:val="CBD5E1"/></w:rPr><w:t>___________________________</w:t></w:r></w:p>`
      })
    }
    if (s.table) {
      const hdr = s.table.map(h=>`<w:tc><w:tcPr><w:shd w:val="clear" w:color="auto" w:fill="EFF6FF"/></w:tcPr><w:p><w:r><w:rPr><w:b/><w:sz w:val="16"/><w:color w:val="1D4ED8"/></w:rPr><w:t>${esc(h)}</w:t></w:r></w:p></w:tc>`).join('')
      const rows = [1,2,3].map(()=>`<w:tr>${s.table.map(()=>`<w:tc><w:p><w:r><w:rPr><w:sz w:val="18"/></w:rPr><w:t></w:t></w:r></w:p></w:tc>`).join('')}</w:tr>`).join('')
      body += `<w:tbl><w:tblPr><w:tblW w:w="0" w:type="auto"/><w:tblBorders><w:top w:val="single" w:sz="4" w:color="DDE3EC"/><w:left w:val="single" w:sz="4" w:color="DDE3EC"/><w:bottom w:val="single" w:sz="4" w:color="DDE3EC"/><w:right w:val="single" w:sz="4" w:color="DDE3EC"/><w:insideH w:val="single" w:sz="4" w:color="DDE3EC"/><w:insideV w:val="single" w:sz="4" w:color="DDE3EC"/></w:tblBorders></w:tblPr><w:tr>${hdr}</w:tr>${rows}</w:tbl><w:p><w:pPr><w:spacing w:after="120"/></w:pPr></w:p>`
    }
  })
  body += `<w:p><w:pPr><w:pBdr><w:top w:val="single" w:sz="4" w:color="DDE3EC"/></w:pBdr><w:spacing w:before="360" w:after="120"/></w:pPr></w:p>`
  body += `<w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:sz w:val="14"/><w:color w:val="94A3B8"/></w:rPr><w:t>Template prepared by Tanasiom Aegis Security &amp; Compliance · Requires adaptation · Not legal advice · Not a CE assessment · Governing law: England &amp; Wales · www.tanasiomaegis.co.uk</w:t></w:r></w:p>`

  const docXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${body}<w:sectPr><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/></w:sectPr></w:body></w:document>`
  const rX = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`
  const wR = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`
  const cT = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/></Types>`
  const sT = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:style w:type="paragraph" w:styleId="Normal"><w:name w:val="Normal"/><w:rPr><w:sz w:val="18"/></w:rPr></w:style></w:styles>`

  const enc = new TextEncoder()
  const crcT = (() => { const t = new Uint32Array(256); for(let i=0;i<256;i++){let c=i;for(let j=0;j<8;j++)c=(c&1)?0xEDB88320^(c>>>1):c>>>1;t[i]=c}; return t })()
  const crc32 = d => { let c=0xFFFFFFFF; for(let i=0;i<d.length;i++)c=crcT[(c^d[i])&0xFF]^(c>>>8); return (c^0xFFFFFFFF)>>>0 }
  const u32 = n => new Uint8Array([n&0xFF,(n>>8)&0xFF,(n>>16)&0xFF,(n>>24)&0xFF])
  const u16 = n => new Uint8Array([n&0xFF,(n>>8)&0xFF])
  const files = {'[Content_Types].xml':cT,'_rels/.rels':rX,'word/document.xml':docXml,'word/styles.xml':sT,'word/_rels/document.xml.rels':wR}
  const entries=[],parts=[]
  let offset=0
  for(const [name,content] of Object.entries(files)){
    const nb=enc.encode(name),data=enc.encode(content),crc=crc32(data)
    const local=new Uint8Array([0x50,0x4B,0x03,0x04,0x14,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,...u32(crc),...u32(data.length),...u32(data.length),...u16(nb.length),0x00,0x00,...nb,...data])
    entries.push({nb,crc,size:data.length,offset});offset+=local.length;parts.push(local)
  }
  const cd=entries.map(e=>new Uint8Array([0x50,0x4B,0x01,0x02,0x14,0x00,0x14,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,...u32(e.crc),...u32(e.size),...u32(e.size),...u16(e.nb.length),0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,...u32(e.offset),...e.nb]))
  const cdSize=cd.reduce((s,c)=>s+c.length,0)
  const eocd=new Uint8Array([0x50,0x4B,0x05,0x06,0x00,0x00,0x00,0x00,...u16(entries.length),...u16(entries.length),...u32(cdSize),...u32(offset),0x00,0x00])
  const zip=new Uint8Array(offset+cdSize+eocd.length)
  let pos=0
  for(const p of parts){zip.set(p,pos);pos+=p.length}
  for(const c of cd){zip.set(c,pos);pos+=c.length}
  zip.set(eocd,pos)
  const blob=new Blob([zip],{type:'application/vnd.openxmlformats-officedocument.wordprocessingml.document'})
  const a=document.createElement('a')
  a.href=URL.createObjectURL(blob)
  a.download=`tanasiom-${t.name.toLowerCase().replace(/\s+/g,'-')}-${t.version}.docx`
  a.click()
}

// ─────────────────────────────────────────────
// SCORE + GAPS
// ─────────────────────────────────────────────
function calcScore(answers) {
  const aS={},aT={}
  AREAS.forEach(a=>{aS[a]=0;aT[a]=0})
  let tot=0,totM=0,critFail=false
  QS.forEach((q,i)=>{
    const a=answers[i]||'NO'
    const pts={YES:2,PARTIAL:1,NO:0,NA:0}[a]
    const counted=a!=='NA'
    aS[q.area]+=pts; if(counted)aT[q.area]+=2
    tot+=pts; if(counted)totM+=2
    if(q.critical&&a==='NO')critFail=true
  })
  const pct=totM>0?Math.round((tot/totM)*100):0
  let cls,desc
  if(critFail){cls='LIKELY BLOCKERS FOUND';desc='One or more likely certification blockers identified under the public CE v3.3 rules. Address these before applying.'}
  else if(pct>=85){cls='NEAR SUBMISSION-READY';desc='Strong readiness estimate. Complete remaining documentation and consider proceeding to a Certification Body.'}
  else if(pct>=70){cls='NEARLY READY';desc='Good foundations with some gaps. Address HIGH-priority items and build the evidence pack before applying.'}
  else if(pct>=50){cls='SIGNIFICANT GAPS';desc='Substantial work required. Follow the remediation roadmap, prioritising blockers first.'}
  else{cls='NOT READY';desc='Fundamental controls are missing. Begin with the likely blockers and work through the full remediation plan.'}
  return{tot,totM,pct,cls,desc,critFail,aS,aT}
}

function calcGaps(answers) {
  const gaps=[]
  QS.forEach((q,i)=>{
    const a=answers[i]||'NO'
    if(a!=='YES'&&a!=='NA'){
      const p=q.critical&&a==='NO'?'BLOCKER':(q.critical||a==='NO')?'HIGH':'MEDIUM'
      gaps.push({q,a,p})
    }
  })
  return gaps.sort((a,b)=>({BLOCKER:0,HIGH:1,MEDIUM:2}[a.p]-{BLOCKER:0,HIGH:1,MEDIUM:2}[b.p]))
}

// ─────────────────────────────────────────────
// EMAIL
// ─────────────────────────────────────────────
const INTAKE_DEFAULT = {company_name:'',industry:'',employees:'',website:'',contact_name:'',contact_email:'',contact_phone:'',biggest_concern:'',ce_status:'',deadline:'',how_found:'',notes:''}

// ─── WEB3FORMS ───────────────────────────────────────────────────────────────
const W3F_KEY = 'fafdbcfa-f86f-456d-958d-44da4a95e651'

async function sendEmail(subject, lines, replyTo, replyName, caseId, score, blockers) {
  const message = lines.join('\n')
  const payload = {
    access_key: W3F_KEY,
    subject,
    message,
    botcheck: '',
    from_name: 'Tanasiom Aegis Security & Compliance',
  }
  if (replyTo) {
    payload.replyto = replyTo
  }
  const res = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!data.success) throw new Error(data.message || 'Submission failed')

  // Auto-reply to client
  if (replyTo && caseId) {
    const autoBody = [
      `Dear ${replyName},`,
      '',
      'Thank you for submitting your Cyber Essentials Gap Review request to Tanasiom Aegis.',
      '',
      `YOUR CASE REFERENCE: ${caseId}`,
      'Please quote this reference in all correspondence with us.',
      '',
      '=== YOUR SUBMISSION SUMMARY ===',
      `CE Readiness Estimate: ${score}%`,
      `Likely Blockers Identified: ${blockers}`,
      '',
      '=== WHAT HAPPENS NEXT ===',
      '1. We review your self-check results (within 2 hours)',
      '2. You receive scope confirmation and invoice (within 1 business day)',
      '3. Gap Review begins on payment confirmation',
      '4. Written report delivered within 48 hours of payment',
      '',
      '=== CONTACT ===',
      'Email: tanasiomaegis@gmail.com',
      'Response: within 1 business day',
      '',
      '=== LEGAL NOTICE ===',
      'This acknowledgement does not constitute a contract or guarantee of certification.',
      'Tanasiom Aegis is an independent readiness advisory service, not affiliated',
      'with NCSC, IASME, or any Certification Body.',
      'CE certificates are issued solely by IASME-licensed Certification Bodies.',
      'Governing law: England & Wales.',
      '',
      'Tanasiom Aegis Security & Compliance',
      'tanasiomaegis@gmail.com',
    ].join('\n')

    await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: W3F_KEY,
        subject: `Your CE Gap Review — Case ${caseId} | Tanasiom Aegis`,
        message: autoBody,
        botcheck: '',
        from_name: 'Tanasiom Aegis Security & Compliance',
        to_email: replyTo,
        replyto: 'tanasiomaegis@gmail.com',
      }),
    })
  }

  return data
}

const PILL = {fw:'#2563eb',sc:'#7c3aed',um:'#059669',ua:'#d97706',mp:'#dc2626'}

// ─────────────────────────────────────────────
// TEMPLATE MODAL — checkbox gate on first download per session only
// ─────────────────────────────────────────────
function TemplateModal({ t, onClose, templateAccepted, onTemplateAccept }) {
  const [checked, setChecked] = useState(false)
  const [generating, setGenerating] = useState(false)
  const canDownload = templateAccepted || checked

  const handleDownload = () => {
    if (!canDownload) return
    if (!templateAccepted) onTemplateAccept()
    setGenerating(true)
    setTimeout(() => { generateTemplateDocx(t); setGenerating(false) }, 300)
  }

  return (
    <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.6)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',padding:'1.5rem' }} onClick={onClose}>
      <div style={{ background:'#fff',border:'1px solid #dde3ec',maxWidth:'720px',width:'100%',maxHeight:'88vh',overflow:'auto' }} onClick={e=>e.stopPropagation()}>

        {/* Header */}
        <div style={{ position:'sticky',top:0,background:'#fff',borderBottom:'1px solid #dde3ec',padding:'1.25rem 1.5rem',display:'flex',justifyContent:'space-between',alignItems:'flex-start' }}>
          <div>
            <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:'0.58rem',color:'#1d4ed8',letterSpacing:'2px',marginBottom:'0.3rem' }}>{t.area.toUpperCase()} · {t.version}</div>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:'1.3rem',letterSpacing:'2px',color:'#0f172a' }}>{t.name}</div>
            <div style={{ fontSize:'0.78rem',color:'#64748b',marginTop:'0.2rem' }}>{t.desc}</div>
          </div>
          <button onClick={onClose} style={{ background:'none',border:'none',color:'#94a3b8',cursor:'pointer',fontSize:'1.3rem',lineHeight:1,padding:'0 0 0 1rem',flexShrink:0 }}>✕</button>
        </div>

        {/* Legal disclaimer */}
        <div style={{ background:'#fefce8',border:'1px solid #fde68a',borderLeft:'4px solid #f59e0b',margin:'1rem 1.5rem 0',padding:'0.85rem 1rem' }}>
          <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:'0.6rem',color:'#92400e',letterSpacing:'1px',marginBottom:'0.2rem' }}>WORKING DOCUMENT — NOT CERTIFICATION OUTPUT — NOT LEGAL ADVICE</div>
          <div style={{ fontSize:'0.75rem',color:'#78350f',lineHeight:1.65 }}>
            This template must be completed, reviewed, and approved internally before use as CE evidence. It does not constitute legal advice. Tanasiom Aegis Security & Compliance accepts no liability for its use. CE certificates are issued solely by IASME-licensed Certification Bodies. Not affiliated with NCSC, IASME, or the UK Government. Governing law: England & Wales.
          </div>
        </div>

        {/* Sections preview */}
        <div style={{ padding:'1rem 1.5rem 0' }}>
          {t.sections.map((s,i) => (
            <div key={i} style={{ marginBottom:'1.25rem',border:'1px solid #edf0f5',overflow:'hidden' }}>
              <div style={{ background:'#f8faff',padding:'0.6rem 1rem',borderBottom:'1px solid #edf0f5',display:'flex',alignItems:'center',gap:'0.5rem' }}>
                <div style={{ width:3,height:14,background:'#1d4ed8',flexShrink:0 }} />
                <span style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:'0.85rem',letterSpacing:'2px',color:'#0f172a' }}>{s.heading}</span>
              </div>
              <div style={{ padding:'0.85rem 1rem' }}>
                {s.body && <pre style={{ fontFamily:"'Barlow Condensed',sans-serif",fontSize:'0.8rem',color:'#334155',lineHeight:1.75,whiteSpace:'pre-wrap',margin:0 }}>{s.body}</pre>}
                {s.fields && s.fields.map((f,j) => (
                  <div key={j} style={{ display:'flex',alignItems:'center',gap:'0.75rem',padding:'0.3rem 0',borderBottom:'1px solid #f1f5f9' }}>
                    <span style={{ fontSize:'0.78rem',color:'#475569',minWidth:'140px' }}>{f}</span>
                    <div style={{ flex:1,height:'1px',borderBottom:'1px dashed #cbd5e1' }} />
                  </div>
                ))}
                {s.table && (
                  <div style={{ overflowX:'auto' }}>
                    <table style={{ width:'100%',borderCollapse:'collapse',fontSize:'0.72rem' }}>
                      <thead><tr style={{ background:'#f0f7ff' }}>{s.table.map((h,j)=><th key={j} style={{ padding:'0.4rem 0.6rem',textAlign:'left',color:'#1d4ed8',fontFamily:"'Share Tech Mono',monospace",fontSize:'0.6rem',letterSpacing:'1px',borderBottom:'1px solid #dde3ec',whiteSpace:'nowrap' }}>{h}</th>)}</tr></thead>
                      <tbody>{[1,2,3].map(r=><tr key={r} style={{ borderBottom:'1px solid #f1f5f9' }}>{s.table.map((_,j)=><td key={j} style={{ padding:'0.5rem 0.6rem',color:'#94a3b8',fontSize:'0.68rem' }}>—</td>)}</tr>)}</tbody>
                    </table>
                    <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:'0.58rem',color:'#94a3b8',padding:'0.4rem 0',textAlign:'right' }}>Add rows as required</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ position:'sticky',bottom:0,background:'#fff',borderTop:'1px solid #dde3ec',padding:'1rem 1.5rem' }}>
          {/* Checkbox shown on first download only — disappears after acceptance */}
          {!templateAccepted && (
            <label style={{ display:'flex',alignItems:'flex-start',gap:'0.75rem',cursor:'pointer',marginBottom:'0.85rem',padding:'0.75rem',background:'#f8faff',border:'1px solid #dde3ec' }}>
              <input type="checkbox" checked={checked} onChange={e=>setChecked(e.target.checked)} style={{ marginTop:'3px',flexShrink:0,width:15,height:15,accentColor:'#1d4ed8' }} />
              <span style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:'0.62rem',color:'#334155',lineHeight:1.65 }}>
                I understand this is a template requiring adaptation for my organisation. It is not legal advice, not a CE assessment output, and Tanasiom Aegis Security & Compliance accepts no liability for its use. Governing law: England & Wales.
              </span>
            </label>
          )}
          <div style={{ display:'flex',gap:'0.75rem',flexWrap:'wrap' }}>
            <button onClick={handleDownload} disabled={!canDownload||generating} style={{ flex:1,background:canDownload?'#1d4ed8':'#94a3b8',color:'#fff',fontFamily:"'Bebas Neue',sans-serif",fontSize:'1rem',letterSpacing:'3px',padding:'0.85rem',border:'none',cursor:canDownload?'pointer':'not-allowed',clipPath:'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',transition:'all 0.2s' }}
              onMouseEnter={e=>{if(canDownload)e.currentTarget.style.background='#1e40af'}}
              onMouseLeave={e=>{if(canDownload)e.currentTarget.style.background='#1d4ed8'}}
            >{generating?'GENERATING...':canDownload?'↓ DOWNLOAD .DOCX':'TICK THE BOX ABOVE TO DOWNLOAD'}</button>
            <Link to="/contact" style={{ flex:1,background:'transparent',color:'#1d4ed8',fontFamily:"'Share Tech Mono',monospace",fontSize:'0.72rem',letterSpacing:'2px',padding:'0.85rem',border:'1px solid #bfdbfe',textDecoration:'none',display:'block',textAlign:'center',transition:'all 0.2s' }}
              onMouseEnter={e=>e.currentTarget.style.background='#eff6ff'}
              onMouseLeave={e=>e.currentTarget.style.background='transparent'}
            >NEED THIS CUSTOMISED? →</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────
export default function Framework() {
  const [phase, setPhase]           = useState('intro')
  const [cur, setCur]               = useState(0)
  const [answers, setAnswers]       = useState({})
  const [activeTab, setActiveTab]   = useState('results')
  const [openModal, setOpenModal]   = useState(null)
  const [intake, setIntake]         = useState(INTAKE_DEFAULT)
  const [sending, setSending]       = useState(false)
  const [sendError, setSendError]   = useState('')
  const [showIntake, setShowIntake] = useState(false)
  const [tickerPos, setTickerPos]   = useState(0)
  const [templateAccepted, setTemplateAccepted] = useState(false)
  const [caseIdConfirm, setCaseIdConfirm] = useState('')

  useEffect(() => {
    const t = setInterval(()=>setTickerPos(p=>p+1),50)
    return ()=>clearInterval(t)
  },[])

  const s    = calcScore(answers)
  const gaps = calcGaps(answers)
  const sc   = s.critFail?'#dc2626':s.pct>=80?'#16a34a':s.pct>=60?'#d97706':'#dc2626'

  const radarData = {
    labels:['Firewalls','Secure Config','Updates','User Access','Malware'],
    datasets:[{label:'Readiness estimate',data:AREAS.map(a=>s.aT[a]>0?Math.round((s.aS[a]/s.aT[a])*100):0),backgroundColor:'rgba(29,78,216,0.08)',borderColor:'rgba(29,78,216,0.5)',pointBackgroundColor:'#1d4ed8',borderWidth:2}],
  }
  const radarOpts = {
    responsive:true,maintainAspectRatio:false,
    scales:{r:{min:0,max:100,ticks:{stepSize:25,color:'#94a3b8',backdropColor:'transparent',font:{size:9}},grid:{color:'#e2e8f0'},angleLines:{color:'#e2e8f0'},pointLabels:{color:'#334155',font:{size:10}}}},
    plugins:{legend:{display:false}},
  }

  const nextQ = () => { if(cur===QS.length-1){setPhase('results');setActiveTab('results')}else setCur(c=>c+1) }
  const prevQ = () => { if(cur>0)setCur(c=>c-1) }

  const exportReport = () => {
    const d = new Date().toLocaleDateString('en-GB')
    const lines = [
      'TANASIOM AEGIS SECURITY & COMPLIANCE',
      'CYBER ESSENTIALS READINESS ESTIMATE',
      '='.repeat(60),
      `Date: ${d}`,
      `Overall readiness estimate: ${s.pct}% — ${s.cls}`,
      `Likely blockers: ${s.critFail?'YES — see below':'None identified'}`,
      '',
      'LEGAL NOTICE: This is a readiness estimate based on your answers against',
      'the public CE v3.3 requirements. It is NOT an IASME certification decision',
      'and may not be presented as such. It does not constitute legal advice.',
      'CE certificates are issued solely by IASME-licensed Certification Bodies.',
      'Tanasiom Aegis is not affiliated with NCSC, IASME, or the UK Government.',
      'Governing law: England & Wales.',
      '='.repeat(60),
      '',
      'CONTROL AREA SCORES',
      ...AREAS.map(a=>`${a}: ${s.aT[a]>0?Math.round((s.aS[a]/s.aT[a])*100):0}%`),
      '',
      'GAP ANALYSIS & REMEDIATION PROMPTS',
      ...gaps.map(g=>`\n[${g.p}] ${g.q.id} — ${g.q.title}\nRemediation prompt: ${g.q.rem}`),
      '',
      '='.repeat(60),
      'Prepared by Tanasiom Aegis Security & Compliance.',
      'Not a certification decision. Not legal advice.',
      'Certification is issued by an IASME-licensed Certification Body.',
      'www.tanasiomaegis.co.uk',
    ]
    const blob=new Blob([lines.join('\n')],{type:'text/plain'})
    const a=document.createElement('a')
    a.href=URL.createObjectURL(blob)
    a.download=`tanasiom-readiness-estimate-${d.replace(/\//g,'-')}.txt`
    a.click()
  }

  const handleIntakeSubmit = async () => {
    if(!intake.company_name||!intake.contact_name||!intake.contact_email){setSendError('Please fill in Company Name, Contact Name and Email.');return}
    setSending(true);setSendError('')
    try {
      const caseId = 'TA-' + Date.now().toString(36).toUpperCase().slice(-6) + '-' + Math.random().toString(36).toUpperCase().slice(2,5)
      const blockerList = gaps.filter(g=>g.p==='BLOCKER')
      const highList    = gaps.filter(g=>g.p==='HIGH')
      const medList     = gaps.filter(g=>g.p==='MEDIUM')
      const areaScores  = AREAS.map(a => `  ${a}: ${s.aT[a]>0?Math.round((s.aS[a]/s.aT[a])*100):0}%`).join('\n')
      const fmtGaps = (list) => list.length===0 ? '  None' : list.map(g=>`  [${g.q.id}] ${g.q.title}\n  → ${g.q.rem}`).join('\n\n')
      const allAnswers = QS.map((q,i)=>{
        const ans = answers[i] || 'NO'
        return `  ${q.id} | ${ans.padEnd(7)} | ${q.title}`
      }).join('\n')

      await sendEmail(
        `[TANASIOM AEGIS] Gap Review Booking ${caseId} — ${intake.company_name} (${s.pct}% · ${blockerList.length} blockers)`,
        [
          `=== CE GAP REVIEW BOOKING · CASE ${caseId} ===`,
          '',
          '--- CONTACT ---',
          `Case ID:   ${caseId}`,
          `Company:   ${intake.company_name}`,
          `Name:      ${intake.contact_name}`,
          `Email:     ${intake.contact_email}`,
          `Phone:     ${intake.contact_phone||'N/A'}`,
          `Industry:  ${intake.industry||'N/A'}`,
          `Employees: ${intake.employees||'N/A'}`,
          `Website:   ${intake.website||'N/A'}`,
          '',
          '--- CONTEXT ---',
          `CE Status:      ${intake.ce_status||'N/A'}`,
          `Deadline:       ${intake.deadline||'N/A'}`,
          `Concern:        ${intake.biggest_concern||'N/A'}`,
          `How found:      ${intake.how_found||'N/A'}`,
          `Notes:          ${intake.notes||'N/A'}`,
          '',
          '--- SELF-CHECK RESULTS ---',
          `Overall score:  ${s.pct}% — ${s.cls}`,
          `Blockers:       ${blockerList.length} likely blockers`,
          `Total gaps:     ${gaps.length}  (Blockers: ${blockerList.length} · High: ${highList.length} · Medium: ${medList.length})`,
          '',
          'Control area scores:',
          areaScores,
          '',
          '--- LIKELY BLOCKERS ---',
          fmtGaps(blockerList),
          '',
          '--- HIGH PRIORITY GAPS ---',
          fmtGaps(highList),
          '',
          '--- MEDIUM GAPS ---',
          fmtGaps(medList),
          '',
          '--- FULL 50-QUESTION ANSWER LOG ---',
          allAnswers,
          '',
          'GDPR consent: YES (submitted via intake form)',
        ],
        intake.contact_email,
        intake.contact_name,
        caseId,
        s.pct,
        blockerList.length
      )
      setCaseIdConfirm(caseId); setShowIntake(false);setPhase('confirm')
    } catch(err){setSendError(`Send failed: ${err.message}`)}
    setSending(false)
  }

  const inp = {background:'#f8faff',border:'1px solid #dde3ec',color:'#0f172a',fontFamily:"'Barlow Condensed',sans-serif",fontSize:'0.88rem',padding:'0.65rem 0.85rem',width:'100%',outline:'none',transition:'border-color 0.2s'}
  const tickerText = THREATS.join('     ·     ')
  const offset = (tickerPos * 0.4) % (tickerText.length * 7.5)

  return (
    <div style={{ fontFamily:"'Barlow Condensed',sans-serif",background:'#f4f6f8',color:'#1a2332',minHeight:'100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@300;400;600;700&family=Share+Tech+Mono&family=Cormorant+Garamond:ital,wght@1,400;1,600&display=swap');
        @media(max-width:768px){ .fw-grid-2{grid-template-columns:1fr!important;} .fw-grid-4{grid-template-columns:repeat(2,1fr)!important;} }
      `}</style>

      {/* THREAT TICKER */}
      <div style={{ background:'#0f172a',borderBottom:'1px solid #1e293b',padding:'0.5rem 0',overflow:'hidden',position:'relative' }}>
        <div style={{ display:'flex',whiteSpace:'nowrap',transform:`translateX(-${offset}px)`,transition:'none' }}>
          <span style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:'0.62rem',color:'#64748b',letterSpacing:'0.04em',paddingRight:'4rem' }}>
            {tickerText} · {tickerText}
          </span>
        </div>
        <div style={{ position:'absolute',left:0,top:0,bottom:0,width:'60px',background:'linear-gradient(90deg, #0f172a, transparent)',pointerEvents:'none' }} />
        <div style={{ position:'absolute',right:0,top:0,bottom:0,width:'60px',background:'linear-gradient(270deg, #0f172a, transparent)',pointerEvents:'none' }} />
      </div>

      {/* ══ INTRO ══ */}
      {phase === 'intro' && (
        <div>
          {/* HERO */}
          <div style={{ padding:'5rem 1.5rem 4rem',background:'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)',position:'relative',overflow:'hidden' }}>
            <div style={{ position:'absolute',top:'20%',right:'10%',width:'400px',height:'400px',borderRadius:'50%',background:'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)',filter:'blur(80px)',pointerEvents:'none' }} />
            <div style={{ maxWidth:'900px',margin:'0 auto',position:'relative',zIndex:2 }}>
              <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:'10px',letterSpacing:'4px',color:'#60a5fa',marginBottom:'1rem' }}>// FREE CYBER ESSENTIALS READINESS CHECK — BUILT AROUND THE PUBLIC CE v3.3 REQUIREMENTS</div>
              <h1 style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:'clamp(2.5rem, 7vw, 5.5rem)',lineHeight:0.9,letterSpacing:'3px',color:'#f0f6ff',marginBottom:'1rem' }}>
                KNOW WHERE YOU STAND<br /><span style={{ color:'#60a5fa' }}>BEFORE YOU PAY FOR CERTIFICATION.</span>
              </h1>
              <p style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:'1.15rem',fontStyle:'italic',color:'rgba(224,236,255,0.65)',maxWidth:'620px',lineHeight:1.7,marginBottom:'1.5rem' }}>
                50 diagnostic questions across the 5 control areas. Independent readiness estimate and remediation prompts. Free to run — no account, no paywall.
              </p>
              <div style={{ background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',padding:'0.75rem 1.25rem',display:'inline-block',marginBottom:'2rem' }}>
                <span style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:'0.65rem',color:'#fbbf24',letterSpacing:'1px' }}>
                  ⚠ Independent readiness service. We do not certify. An IASME-licensed Certification Body does. Not affiliated with NCSC or IASME.
                </span>
              </div>
              <div style={{ display:'flex',gap:'1rem',flexWrap:'wrap' }}>
                <button onClick={()=>{setCur(0);setAnswers({});setPhase('assess')}} style={{ background:'#1d4ed8',color:'#fff',fontFamily:"'Bebas Neue',sans-serif",fontSize:'1.1rem',letterSpacing:'3px',padding:'0.9rem 2rem',border:'none',cursor:'pointer',clipPath:'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',transition:'all 0.2s' }}
                  onMouseEnter={e=>e.currentTarget.style.background='#1e40af'}
                  onMouseLeave={e=>e.currentTarget.style.background='#1d4ed8'}
                >START FREE SELF-CHECK — 50 QUESTIONS →</button>
                <Link to="/contact" style={{ background:'transparent',color:'rgba(224,236,255,0.7)',fontFamily:"'Share Tech Mono',monospace",fontSize:'0.78rem',letterSpacing:'2px',padding:'0.9rem 1.75rem',border:'1px solid rgba(255,255,255,0.2)',textDecoration:'none',display:'inline-block',transition:'all 0.2s' }}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,0.5)';e.currentTarget.style.color='#fff'}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,0.2)';e.currentTarget.style.color='rgba(224,236,255,0.7)'}}
                >BOOK THE GAP REVIEW — £397</Link>
              </div>
              <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:'0.6rem',color:'rgba(224,236,255,0.25)',marginTop:'1.25rem',letterSpacing:'1px' }}>
                ~15 minutes · 100% free · no account required · readiness estimate only, not a certification decision · governing law: England & Wales
              </div>
            </div>
          </div>

          {/* HOW THIS WORKS */}
          <div style={{ padding:'3.5rem 1.5rem',background:'#ffffff',borderBottom:'1px solid #dde3ec' }}>
            <div style={{ maxWidth:'1100px',margin:'0 auto' }}>
              <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:'9px',color:'#1d4ed8',letterSpacing:'3px',marginBottom:'0.5rem' }}>// HOW THIS WORKS</div>
              <h2 style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:'clamp(2rem, 5vw, 3rem)',letterSpacing:'2px',color:'#0f172a',marginBottom:'2.5rem' }}>FREE SELF-CHECK. <span style={{ color:'#1d4ed8' }}>THEN A PAID REVIEW IF YOU NEED ONE.</span></h2>
              <div className="fw-grid-4" style={{ display:'grid',gridTemplateColumns:'repeat(4, 1fr)',gap:'1px',background:'#dde3ec' }}>
                {[
                  {step:'01',label:'Run the self-check',desc:'Answer 50 questions across the 5 CE control areas. Takes about 15 minutes. Completely free.',color:'#1d4ed8'},
                  {step:'02',label:'Get your estimate',desc:'See a readiness score, likely blockers, and remediation prompts for every gap. Download the report.',color:'#0ea5e9'},
                  {step:'03',label:'Book a review if needed',desc:'If the results show blockers or you want a human to verify your scope and evidence — book the £397 Gap Review.',color:'#7c3aed'},
                  {step:'04',label:'Apply with confidence',desc:'After the review and implementation, apply to an IASME-licensed Certification Body. Most prepared clients pass first time.',color:'#16a34a'},
                ].map(s=>(
                  <div key={s.step} style={{ background:'#f8faff',padding:'1.75rem 1.5rem',borderTop:`3px solid ${s.color}` }}>
                    <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:'0.6rem',color:s.color,letterSpacing:'3px',marginBottom:'0.35rem' }}>STEP {s.step}</div>
                    <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:'1.1rem',letterSpacing:'1px',color:'#0f172a',marginBottom:'0.6rem' }}>{s.label}</div>
                    <p style={{ fontSize:'0.8rem',color:'#64748b',lineHeight:1.7 }}>{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 5 CONTROL AREAS */}
          <div style={{ padding:'3.5rem 1.5rem',background:'#f4f6f8',borderBottom:'1px solid #dde3ec' }}>
            <div style={{ maxWidth:'1100px',margin:'0 auto' }}>
              <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:'9px',color:'#1d4ed8',letterSpacing:'3px',marginBottom:'0.5rem' }}>// THE 5 CYBER ESSENTIALS CONTROL AREAS</div>
              <h2 style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:'clamp(1.8rem, 4vw, 2.5rem)',letterSpacing:'2px',color:'#0f172a',marginBottom:'2rem' }}>10 QUESTIONS PER AREA. <span style={{ color:'#1d4ed8' }}>50 TOTAL.</span></h2>
              <div style={{ display:'grid',gridTemplateColumns:'repeat(5, 1fr)',gap:'1px',background:'#dde3ec' }}>
                {[
                  {code:'fw',label:'Firewalls',desc:'Boundary and device-level protection. Inbound rule documentation. Default-deny.',color:'#2563eb'},
                  {code:'sc',label:'Secure Configuration',desc:'Removing defaults. Disabling unnecessary accounts and software. Scope definition.',color:'#7c3aed'},
                  {code:'um',label:'Update Management',desc:'14-day patch rule. Supported software only. Patch tracking evidence.',color:'#059669'},
                  {code:'ua',label:'User Access Control',desc:'MFA on all cloud services. Separate admin accounts. Leavers process.',color:'#d97706'},
                  {code:'mp',label:'Malware Protection',desc:'Active anti-malware. Real-time protection. Incident response procedure.',color:'#dc2626'},
                ].map((a,i)=>(
                  <div key={a.code} style={{ background:'#ffffff',padding:'1.5rem',borderTop:`3px solid ${a.color}` }}>
                    <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:'0.6rem',color:a.color,letterSpacing:'2px',marginBottom:'0.35rem' }}>0{i+1}</div>
                    <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:'1rem',letterSpacing:'1px',color:'#0f172a',marginBottom:'0.5rem' }}>{a.label}</div>
                    <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:'0.55rem',color:'#64748b',marginBottom:'0.6rem' }}>10 questions</div>
                    <p style={{ fontSize:'0.75rem',color:'#64748b',lineHeight:1.65 }}>{a.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ILLUSTRATIVE EXAMPLE */}
          <div style={{ padding:'3.5rem 1.5rem',background:'#ffffff',borderBottom:'1px solid #dde3ec' }}>
            <div style={{ maxWidth:'1100px',margin:'0 auto' }}>
              <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:'9px',color:'#1d4ed8',letterSpacing:'3px',marginBottom:'0.5rem' }}>// ILLUSTRATIVE EXAMPLE — SAMPLE SME PROGRESS</div>
              <h2 style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:'clamp(1.8rem, 4vw, 2.5rem)',letterSpacing:'2px',color:'#0f172a',marginBottom:'0.5rem' }}>WHAT IMPROVEMENT LOOKS LIKE.</h2>
              <p style={{ fontSize:'0.82rem',color:'#64748b',marginBottom:'2rem',maxWidth:'600px',lineHeight:1.7 }}>Illustrative scoring example only — based on a sample 12-person professional services firm using this tool before and after a 30-day remediation period.</p>
              <div style={{ background:'#f8faff',border:'1px solid #dde3ec',padding:'2rem',display:'grid',gridTemplateColumns:'1fr auto 1fr',gap:'2rem',alignItems:'center' }}>
                <div style={{ textAlign:'center' }}>
                  <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:'0.65rem',color:'#dc2626',letterSpacing:'2px',marginBottom:'0.5rem' }}>BASELINE ESTIMATE</div>
                  <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:'4rem',color:'#dc2626',lineHeight:1 }}>42%</div>
                  <div style={{ fontSize:'0.78rem',color:'#64748b',marginTop:'0.4rem' }}>No formal controls documented. MFA missing. Scope undefined.</div>
                </div>
                <div style={{ textAlign:'center',color:'#94a3b8',fontSize:'2rem' }}>→</div>
                <div style={{ textAlign:'center' }}>
                  <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:'0.65rem',color:'#16a34a',letterSpacing:'2px',marginBottom:'0.5rem' }}>POST-REMEDIATION ESTIMATE</div>
                  <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:'4rem',color:'#16a34a',lineHeight:1 }}>92%</div>
                  <div style={{ fontSize:'0.78rem',color:'#64748b',marginTop:'0.4rem' }}>MFA enabled, policies in place, evidence pack complete, scope defined.</div>
                </div>
              </div>
              <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:'0.6rem',color:'#94a3b8',marginTop:'0.75rem',textAlign:'center' }}>Illustrative example only. Individual results depend on starting position and effort applied.</div>
            </div>
          </div>

          {/* COST CONTEXT */}
          <div style={{ padding:'3.5rem 1.5rem',background:'#f4f6f8',borderBottom:'1px solid #dde3ec' }}>
            <div style={{ maxWidth:'1100px',margin:'0 auto' }}>
              <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:'9px',color:'#1d4ed8',letterSpacing:'3px',marginBottom:'0.5rem' }}>// THE COST OF GETTING IT WRONG</div>
              <h2 style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:'clamp(1.8rem, 4vw, 2.5rem)',letterSpacing:'2px',color:'#0f172a',marginBottom:'2rem' }}>SUBMIT ONCE. <span style={{ color:'#1d4ed8' }}>NOT TWICE.</span></h2>
              <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))',gap:'1px',background:'#dde3ec' }}>
                {[
                  {label:'This Self-Check',cost:'FREE',sub:'Right now',color:'#16a34a',note:'Independent readiness estimate'},
                  {label:'Gap Review',cost:'£397',sub:'48hr readiness review',color:'#1d4ed8',note:'Tanasiom Aegis — human-led'},
                  {label:'IASME CE Cert',cost:'From £320+VAT',sub:'Micro orgs · size-dependent',color:'#64748b',note:'Issued by IASME Certification Body'},
                  {label:'Reapplication Cost',cost:'Fresh fee',sub:'After failed submission',color:'#dc2626',note:'Plus delay and potential contract loss'},
                  {label:'CE Plus',cost:'Quoted individually',sub:'With technical audit',color:'#64748b',note:'Assessor-led, most credible'},
                ].map(c=>(
                  <div key={c.label} style={{ background:'#ffffff',padding:'1.25rem',textAlign:'center' }}>
                    <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:'1.3rem',color:c.color,lineHeight:1,marginBottom:'0.3rem' }}>{c.cost}</div>
                    <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:'0.95rem',letterSpacing:'1px',color:'#0f172a',marginBottom:'0.2rem' }}>{c.label}</div>
                    <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:'0.55rem',color:'#94a3b8',marginBottom:'0.35rem' }}>{c.sub}</div>
                    <div style={{ fontSize:'0.7rem',color:'#64748b' }}>{c.note}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop:'0.75rem',fontFamily:"'Share Tech Mono',monospace",fontSize:'0.6rem',color:'#94a3b8',textAlign:'center' }}>CE certification fees sourced from IASME published pricing. Subject to change — verify at iasme.co.uk</div>
            </div>
          </div>

          {/* TEMPLATES */}
          <div style={{ padding:'4rem 1.5rem',background:'#ffffff',borderBottom:'1px solid #dde3ec' }}>
            <div style={{ maxWidth:'1100px',margin:'0 auto' }}>
              <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:'9px',color:'#1d4ed8',letterSpacing:'3px',marginBottom:'0.5rem' }}>// 7 FREE WORKING DOCUMENT TEMPLATES</div>
              <h2 style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:'clamp(1.8rem, 4vw, 2.5rem)',letterSpacing:'2px',color:'#0f172a',marginBottom:'0.5rem' }}>DOWNLOAD. COMPLETE. <span style={{ color:'#1d4ed8' }}>SUBMIT AS EVIDENCE.</span></h2>
              <p style={{ fontSize:'0.85rem',color:'#64748b',maxWidth:'620px',marginBottom:'0.75rem',lineHeight:1.75 }}>Structured working documents built around the evidence IASME assessors look for. Download free and complete in-house — or have Tanasiom Aegis customise them to your exact environment.</p>
              <div style={{ background:'#fefce8',border:'1px solid #fde68a',borderLeft:'4px solid #f59e0b',padding:'0.75rem 1rem',marginBottom:'2rem' }}>
                <span style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:'0.62rem',color:'#92400e',letterSpacing:'1px' }}>
                  Working document templates — must be completed and approved internally before use as CE evidence. Not a certification output. Not legal advice. Tanasiom Aegis accepts no liability for their use. Governing law: England & Wales.
                </span>
              </div>
              <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))',gap:'1rem' }}>
                {TEMPLATES.map((t,i)=>(
                  <div key={t.name} style={{ background:'#f8faff',border:'1px solid #dde3ec',padding:'1.75rem',cursor:'pointer',transition:'all 0.2s',borderTop:'3px solid #1d4ed8' }}
                    onMouseEnter={e=>{e.currentTarget.style.background='#eff6ff';e.currentTarget.style.borderColor='#1d4ed8'}}
                    onMouseLeave={e=>{e.currentTarget.style.background='#f8faff';e.currentTarget.style.borderColor='#dde3ec';e.currentTarget.style.borderTopColor='#1d4ed8'}}
                    onClick={()=>setOpenModal(i)}
                  >
                    <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'1rem' }}>
                      <span style={{ fontSize:'1.75rem' }}>{t.icon}</span>
                      <div style={{ textAlign:'right' }}>
                        <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:'0.55rem',color:'#1d4ed8',border:'1px solid #bfdbfe',padding:'2px 6px',marginBottom:'0.2rem' }}>{t.area}</div>
                        <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:'0.52rem',color:'#94a3b8' }}>{t.version}</div>
                      </div>
                    </div>
                    <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:'1.05rem',letterSpacing:'1px',color:'#0f172a',marginBottom:'0.4rem' }}>{t.name}</div>
                    <p style={{ fontSize:'0.78rem',color:'#64748b',lineHeight:1.65,marginBottom:'1.25rem' }}>{t.desc}</p>
                    <button style={{ width:'100%',background:'#1d4ed8',color:'#fff',fontFamily:"'Share Tech Mono',monospace",fontSize:'0.65rem',letterSpacing:'2px',padding:'0.6rem',border:'none',cursor:'pointer',transition:'all 0.2s' }}
                      onClick={e=>{e.stopPropagation();setOpenModal(i)}}
                      onMouseEnter={e=>e.currentTarget.style.background='#1e40af'}
                      onMouseLeave={e=>e.currentTarget.style.background='#1d4ed8'}
                    >PREVIEW & DOWNLOAD ↓</button>
                    <div style={{ display:'flex',gap:'0.75rem',marginTop:'0.65rem',flexWrap:'wrap' }}>
                      {t.sections.slice(0,4).map((sec,j)=><span key={j} style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:'0.52rem',color:'#94a3b8',background:'#edf0f5',padding:'2px 6px' }}>{sec.heading}</span>)}
                      {t.sections.length>4&&<span style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:'0.52rem',color:'#94a3b8' }}>+{t.sections.length-4} more</span>}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop:'2rem',background:'#f0f7ff',border:'1px solid #bfdbfe',padding:'1.5rem',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'1rem' }}>
                <div>
                  <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:'1.1rem',letterSpacing:'2px',color:'#0f172a',marginBottom:'0.25rem' }}>NEED THEM CUSTOMISED TO YOUR BUSINESS?</div>
                  <div style={{ fontSize:'0.8rem',color:'#64748b' }}>Tailored with your legal entity, your devices, your services, your named owners and approval dates. Policy Pack — £297.</div>
                </div>
                <Link to="/contact" style={{ background:'#1d4ed8',color:'#fff',fontFamily:"'Bebas Neue',sans-serif",fontSize:'0.95rem',letterSpacing:'2px',padding:'0.75rem 1.5rem',textDecoration:'none',transition:'all 0.2s',clipPath:'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' }}
                  onMouseEnter={e=>e.currentTarget.style.background='#1e40af'}
                  onMouseLeave={e=>e.currentTarget.style.background='#1d4ed8'}
                >GET POLICY PACK — £297 →</Link>
              </div>
            </div>
          </div>

          {/* OFFICIAL RESOURCES */}
          <div style={{ padding:'3rem 1.5rem',background:'#f4f6f8',borderBottom:'1px solid #dde3ec' }}>
            <div style={{ maxWidth:'1100px',margin:'0 auto' }}>
              <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:'9px',color:'#64748b',letterSpacing:'3px',marginBottom:'1.5rem' }}>// OFFICIAL RESOURCES — ALWAYS VERIFY REQUIREMENTS DIRECT FROM SOURCE</div>
              <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))',gap:'1px',background:'#dde3ec' }}>
                {[
                  {label:'NCSC Cyber Essentials',url:'https://www.ncsc.gov.uk/cyberessentials/overview',tag:'GOV.UK',note:'Official scheme overview'},
                  {label:'IASME Consortium',url:'https://iasme.co.uk',tag:'IASME',note:'Certification bodies & pricing'},
                  {label:'IASME Readiness Tool',url:'https://iasme.co.uk/cyber-essentials/readiness-tool/',tag:'FREE TOOL',note:'Official free self-check'},
                  {label:'ICO GDPR Guidance',url:'https://ico.org.uk/for-organisations/',tag:'ICO',note:'Data protection obligations'},
                  {label:'NCSC Cyber Action Toolkit',url:'https://www.ncsc.gov.uk/collection/small-business-guide',tag:'FREE GUIDE',note:'NCSC small business guidance'},
                  {label:'CVE Database',url:'https://cve.mitre.org',tag:'CVE',note:'Official vulnerability records'},
                ].map(l=>(
                  <a key={l.label} href={l.url} target="_blank" rel="noreferrer" style={{ background:'#ffffff',padding:'1.25rem',textDecoration:'none',display:'block',transition:'all 0.2s',borderTop:'2px solid transparent' }}
                    onMouseEnter={e=>{e.currentTarget.style.background='#f8faff';e.currentTarget.style.borderTopColor='#1d4ed8'}}
                    onMouseLeave={e=>{e.currentTarget.style.background='#ffffff';e.currentTarget.style.borderTopColor='transparent'}}
                  >
                    <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:'0.55rem',color:'#1d4ed8',letterSpacing:'2px',marginBottom:'0.3rem' }}>{l.tag}</div>
                    <div style={{ fontSize:'0.82rem',color:'#0f172a',fontWeight:600,marginBottom:'0.2rem' }}>{l.label} ↗</div>
                    <div style={{ fontSize:'0.7rem',color:'#94a3b8' }}>{l.note}</div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* BOTTOM CTA */}
          <div style={{ padding:'5rem 1.5rem',background:'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)',textAlign:'center',position:'relative',overflow:'hidden' }}>
            <div style={{ position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:'500px',height:'300px',borderRadius:'50%',background:'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)',filter:'blur(60px)',pointerEvents:'none' }} />
            <div style={{ position:'relative',zIndex:1 }}>
              <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:'9px',color:'#60a5fa',letterSpacing:'4px',marginBottom:'1.5rem' }}>// DO NOT GUESS IN THE PORTAL</div>
              <h2 style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:'clamp(2.5rem, 6vw, 5rem)',letterSpacing:'3px',color:'#f0f6ff',lineHeight:0.9,marginBottom:'1rem' }}>
                SUBMIT WITH A PLAN.<br /><span style={{ color:'#60a5fa' }}>NOT FINGERS CROSSED.</span>
              </h2>
              <p style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:'1.15rem',fontStyle:'italic',color:'rgba(224,236,255,0.55)',maxWidth:'500px',margin:'0 auto 2rem',lineHeight:1.8 }}>
                If the self-check shows blockers, the next move is a human review. We turn your answers into a prioritised action plan, evidence list, and clear next step.
              </p>
              <div style={{ display:'flex',gap:'1rem',justifyContent:'center',flexWrap:'wrap',marginBottom:'1.5rem' }}>
                <Link to="/contact" style={{ background:'#1d4ed8',color:'#fff',fontFamily:"'Bebas Neue',sans-serif",fontSize:'1.2rem',letterSpacing:'3px',padding:'1rem 2.5rem',textDecoration:'none',clipPath:'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',transition:'all 0.2s' }}
                  onMouseEnter={e=>e.currentTarget.style.background='#1e40af'}
                  onMouseLeave={e=>e.currentTarget.style.background='#1d4ed8'}
                >BOOK THE 48-HOUR GAP REVIEW — £397 →</Link>
                <button onClick={()=>{setCur(0);setAnswers({});setPhase('assess')}} style={{ background:'transparent',color:'rgba(224,236,255,0.7)',fontFamily:"'Share Tech Mono',monospace",fontSize:'0.78rem',letterSpacing:'2px',padding:'1rem 1.75rem',border:'1px solid rgba(255,255,255,0.2)',cursor:'pointer',transition:'all 0.2s' }}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,0.5)';e.currentTarget.style.color='#fff'}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,0.2)';e.currentTarget.style.color='rgba(224,236,255,0.7)'}}
                >RUN THE SELF-CHECK FIRST</button>
              </div>
              <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:'0.6rem',color:'rgba(224,236,255,0.25)',letterSpacing:'1px' }}>No hard sell. We review your score, scope and blockers first. No obligation.</div>
            </div>
          </div>
        </div>
      )}

      {/* ══ ASSESSMENT ══ */}
      {phase === 'assess' && (
        <div>
          <div style={{ position:'sticky',top:'56px',zIndex:100,background:'rgba(255,255,255,0.97)',backdropFilter:'blur(16px)',borderBottom:'1px solid #dde3ec',padding:'0.75rem 1.5rem',display:'flex',alignItems:'center',gap:'1rem' }}>
            <span style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:'0.58rem',color:PILL[QS[cur].code],border:`1px solid ${PILL[QS[cur].code]}`,padding:'2px 8px',flexShrink:0,letterSpacing:'1px' }}>{QS[cur].area}</span>
            <div style={{ flex:1,height:'4px',background:'#edf0f5',borderRadius:'2px' }}>
              <div style={{ height:'100%',background:'#1d4ed8',borderRadius:'2px',width:`${((cur+1)/50)*100}%`,transition:'width 0.35s' }} />
            </div>
            <span style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:'0.72rem',color:'#64748b',whiteSpace:'nowrap' }}>{cur+1} / 50</span>
          </div>
          <div style={{ maxWidth:'720px',margin:'0 auto',padding:'3rem 1.5rem' }}>
            <div style={{ background:'#ffffff',border:'1px solid #dde3ec',borderTop:`3px solid ${PILL[QS[cur].code]}`,padding:'2rem',marginBottom:'1.5rem' }}>
              <div style={{ display:'flex',alignItems:'center',gap:'0.75rem',marginBottom:'1rem' }}>
                <span style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:'0.65rem',color:'#94a3b8' }}>{QS[cur].id}</span>
                {QS[cur].critical&&<span style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:'0.58rem',color:'#dc2626',border:'1px solid #fecaca',padding:'1px 6px',letterSpacing:'1px' }}>⚠ LIKELY BLOCKER</span>}
              </div>
              <h2 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:'clamp(1.2rem, 3vw, 1.6rem)',color:'#0f172a',lineHeight:1.3,marginBottom:'0.75rem' }}>{QS[cur].title}</h2>
              <p style={{ fontSize:'0.88rem',color:'#334155',lineHeight:1.65,marginBottom:'0.75rem' }}>{QS[cur].text}</p>
              <p style={{ fontSize:'0.78rem',color:'#64748b',lineHeight:1.6,fontStyle:'italic',borderLeft:'2px solid #dde3ec',paddingLeft:'0.75rem' }}>💡 {QS[cur].hint}</p>
            </div>
            <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.75rem',marginBottom:'2rem' }}>
              {[
                {k:'YES',label:'Yes — fully implemented',pts:'2 points',color:'#16a34a',bg:'rgba(22,163,74,0.06)'},
                {k:'PARTIAL',label:'Partial — inconsistently applied',pts:'1 point',color:'#d97706',bg:'rgba(217,119,6,0.06)'},
                {k:'NO',label:'No — not implemented',pts:'0 points',color:'#dc2626',bg:'rgba(220,38,38,0.06)'},
                {k:'NA',label:'N/A — not applicable',pts:'excluded',color:'#64748b',bg:'rgba(100,116,139,0.06)'},
              ].map(opt=>{
                const sel=answers[cur]===opt.k
                return(
                  <button key={opt.k} onClick={()=>setAnswers(p=>({...p,[cur]:opt.k}))} style={{ background:sel?opt.bg:'#ffffff',border:`1px solid ${sel?opt.color:'#dde3ec'}`,color:sel?opt.color:'#334155',padding:'1rem',textAlign:'left',cursor:'pointer',transition:'all 0.2s' }}>
                    <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:'1rem',letterSpacing:'2px',marginBottom:'0.2rem' }}>{opt.k}</div>
                    <div style={{ fontSize:'0.78rem',color:sel?opt.color:'#64748b' }}>{opt.label}</div>
                    <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:'0.6rem',color:sel?opt.color:'#94a3b8',marginTop:'0.25rem' }}>{opt.pts}</div>
                  </button>
                )
              })}
            </div>
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center' }}>
              <button onClick={prevQ} disabled={cur===0} style={{ background:'transparent',color:'#64748b',fontFamily:"'Share Tech Mono',monospace",fontSize:'0.72rem',letterSpacing:'2px',padding:'0.75rem 1.5rem',border:'1px solid #dde3ec',cursor:cur===0?'not-allowed':'pointer',opacity:cur===0?0.3:1,transition:'all 0.2s' }}>← BACK</button>
              <button onClick={nextQ} disabled={!(cur in answers)} style={{ background:(cur in answers)?'#1d4ed8':'#e2e8f0',color:(cur in answers)?'#fff':'#94a3b8',fontFamily:"'Bebas Neue',sans-serif",fontSize:'1rem',letterSpacing:'3px',padding:'0.75rem 2rem',border:'none',cursor:(cur in answers)?'pointer':'not-allowed',clipPath:'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',transition:'all 0.2s' }}>
                {cur===49?'VIEW RESULTS →':'NEXT →'}
              </button>
            </div>
            <div style={{ textAlign:'center',marginTop:'1.5rem' }}>
              <button onClick={()=>setPhase('intro')} style={{ background:'none',border:'none',color:'#94a3b8',fontFamily:"'Share Tech Mono',monospace",fontSize:'0.6rem',cursor:'pointer',letterSpacing:'1px' }}>← BACK TO INTRO</button>
            </div>
          </div>
        </div>
      )}

      {/* ══ RESULTS ══ */}
      {phase === 'results' && (
        <div style={{ maxWidth:'1100px',margin:'0 auto',padding:'3rem 1.5rem' }}>

          {/* Legal notice — always visible */}
          <div style={{ background:'#fefce8',border:'1px solid #fde68a',borderLeft:'4px solid #f59e0b',padding:'0.85rem 1.25rem',marginBottom:'2rem' }}>
            <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:'0.6rem',color:'#92400e',letterSpacing:'1px',marginBottom:'0.2rem' }}>LEGAL NOTICE</div>
            <span style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:'0.62rem',color:'#92400e',letterSpacing:'1px' }}>
              This is a Tanasiom Aegis readiness estimate based on your answers and the public CE v3.3 requirements. It is not an assessor's decision, does not constitute legal advice, and may not be presented as a certification outcome. CE certificates are issued solely by IASME-licensed Certification Bodies. Tanasiom Aegis is not affiliated with NCSC, IASME, or the UK Government. Governing law: England & Wales.
            </span>
          </div>

          {/* Tab nav */}
          <div style={{ borderBottom:'1px solid #dde3ec',marginBottom:'2.5rem',display:'flex',gap:0,overflowX:'auto' }}>
            {[{id:'results',label:'RESULTS'},{id:'gaps',label:`GAPS (${gaps.length})`},{id:'templates',label:'TEMPLATES'}].map(t=>(
              <button key={t.id} onClick={()=>setActiveTab(t.id)} style={{ background:'none',border:'none',cursor:'pointer',fontFamily:"'Share Tech Mono',monospace",fontSize:'0.68rem',letterSpacing:'2px',padding:'1rem 1.25rem',whiteSpace:'nowrap',color:activeTab===t.id?'#1d4ed8':'#64748b',borderBottom:`2px solid ${activeTab===t.id?'#1d4ed8':'transparent'}`,transition:'all 0.15s' }}>{t.label}</button>
            ))}
          </div>

          {activeTab === 'results' && (
            <div>
              <div className="fw-grid-2" style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'2rem',marginBottom:'2rem' }}>
                {/* Score card */}
                <div style={{ background:'#ffffff',border:'1px solid #dde3ec',borderTop:`4px solid ${sc}`,padding:'2.5rem',textAlign:'center' }}>
                  <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:'9px',color:'#64748b',letterSpacing:'3px',marginBottom:'1rem' }}>// READINESS ESTIMATE</div>
                  <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:'5rem',color:sc,lineHeight:1 }}>{s.pct}%</div>
                  <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:'1.2rem',letterSpacing:'2px',color:sc,margin:'0.5rem 0' }}>{s.cls}</div>
                  <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:'0.65rem',color:'#94a3b8',marginBottom:'1.5rem' }}>{s.tot} / {s.totM} POINTS</div>
                  {s.critFail&&(
                    <div style={{ padding:'0.75rem',background:'#fef2f2',border:'1px solid #fecaca',fontFamily:"'Share Tech Mono',monospace",fontSize:'0.65rem',color:'#dc2626',marginBottom:'1rem',lineHeight:1.6 }}>
                      ⚠ Likely certification blockers identified under the public CE v3.3 rules. Address these before applying.
                    </div>
                  )}
                  <p style={{ fontSize:'0.82rem',color:'#64748b',lineHeight:1.65,marginBottom:'1.5rem' }}>{s.desc}</p>
                  {/* Report download — no friction, inline disclaimer only */}
                  <button onClick={exportReport} style={{ width:'100%',background:'transparent',color:'#1d4ed8',fontFamily:"'Share Tech Mono',monospace",fontSize:'0.72rem',letterSpacing:'2px',padding:'0.75rem',border:'1px solid #bfdbfe',cursor:'pointer',marginBottom:'0.35rem',transition:'all 0.2s' }}
                    onMouseEnter={e=>e.currentTarget.style.background='#eff6ff'}
                    onMouseLeave={e=>e.currentTarget.style.background='transparent'}
                  >↓ DOWNLOAD READINESS ESTIMATE</button>
                  <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:'0.55rem',color:'#94a3b8',marginBottom:'1rem',letterSpacing:'1px',lineHeight:1.5 }}>
                    Readiness estimate only — not a certification decision · Governing law: England & Wales
                  </div>
                  <button onClick={()=>setActiveTab('gaps')} style={{ width:'100%',background:'#1d4ed8',color:'#fff',fontFamily:"'Bebas Neue',sans-serif",fontSize:'1rem',letterSpacing:'3px',padding:'0.75rem',border:'none',cursor:'pointer',clipPath:'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',transition:'all 0.2s' }}
                    onMouseEnter={e=>e.currentTarget.style.background='#1e40af'}
                    onMouseLeave={e=>e.currentTarget.style.background='#1d4ed8'}
                  >VIEW GAP ANALYSIS →</button>
                </div>
                {/* Radar */}
                <div style={{ background:'#ffffff',border:'1px solid #dde3ec',padding:'2rem' }}>
                  <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:'9px',color:'#64748b',letterSpacing:'3px',marginBottom:'0.35rem' }}>// CONTROL AREA BREAKDOWN</div>
                  <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:'0.58rem',color:'#94a3b8',marginBottom:'1rem' }}>Readiness estimate — not an assessor score</div>
                  <div style={{ height:'220px' }}><Radar data={radarData} options={radarOpts} /></div>
                  <div style={{ marginTop:'1.5rem' }}>
                    {AREAS.map(a=>{
                      const pct=s.aT[a]>0?Math.round((s.aS[a]/s.aT[a])*100):0
                      const c=pct>=80?'#16a34a':pct>=60?'#d97706':'#dc2626'
                      return(
                        <div key={a} style={{ marginBottom:'0.6rem' }}>
                          <div style={{ display:'flex',justifyContent:'space-between',marginBottom:'0.25rem' }}>
                            <span style={{ fontSize:'0.78rem',color:'#334155' }}>{a}</span>
                            <span style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:'0.7rem',color:c }}>{pct}%</span>
                          </div>
                          <div style={{ height:'5px',background:'#edf0f5',borderRadius:'3px' }}>
                            <div style={{ height:'100%',background:c,borderRadius:'3px',width:`${pct}%`,transition:'width 0.5s' }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div style={{ background:'#f0f7ff',border:'1px solid #bfdbfe',padding:'2rem',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'1.5rem' }}>
                <div>
                  <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:'9px',color:'#1d4ed8',letterSpacing:'3px',marginBottom:'0.5rem' }}>// WANT A HUMAN TO VERIFY THIS?</div>
                  <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:'1.3rem',letterSpacing:'2px',color:'#0f172a',marginBottom:'0.35rem' }}>BOOK THE 48-HOUR GAP REVIEW.</div>
                  <div style={{ fontSize:'0.82rem',color:'#64748b',maxWidth:'480px',lineHeight:1.65 }}>We review your score, scope and blockers, then give you a prioritised action plan and evidence checklist. No hard sell. No obligation.</div>
                </div>
                <button onClick={()=>setShowIntake(true)} style={{ background:'#1d4ed8',color:'#fff',fontFamily:"'Bebas Neue',sans-serif",fontSize:'1rem',letterSpacing:'3px',padding:'0.85rem 2rem',border:'none',cursor:'pointer',clipPath:'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',transition:'all 0.2s',flexShrink:0 }}
                  onMouseEnter={e=>e.currentTarget.style.background='#1e40af'}
                  onMouseLeave={e=>e.currentTarget.style.background='#1d4ed8'}
                >BOOK GAP REVIEW — £397 →</button>
              </div>
              <div style={{ textAlign:'center',marginTop:'2rem' }}>
                <button onClick={()=>{setCur(0);setAnswers({});setPhase('assess')}} style={{ background:'transparent',color:'#64748b',fontFamily:"'Share Tech Mono',monospace",fontSize:'0.65rem',letterSpacing:'2px',padding:'0.65rem 1.5rem',border:'1px solid #dde3ec',cursor:'pointer',transition:'all 0.2s' }}>RESTART SELF-CHECK</button>
              </div>
            </div>
          )}

          {activeTab === 'gaps' && (
            <div>
              <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.5rem',flexWrap:'wrap',gap:'1rem' }}>
                <div>
                  <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:'9px',color:'#dc2626',letterSpacing:'3px',marginBottom:'0.35rem' }}>// GAP ANALYSIS & REMEDIATION PROMPTS</div>
                  <div style={{ fontSize:'0.85rem',color:'#64748b' }}>{gaps.length} gaps — {gaps.filter(g=>g.p==='BLOCKER').length} Likely blockers · {gaps.filter(g=>g.p==='HIGH').length} High · {gaps.filter(g=>g.p==='MEDIUM').length} Medium</div>
                </div>
                <div style={{ display:'flex',flexDirection:'column',alignItems:'flex-end',gap:'0.25rem' }}>
                  <button onClick={exportReport} style={{ background:'transparent',color:'#1d4ed8',fontFamily:"'Share Tech Mono',monospace",fontSize:'0.68rem',letterSpacing:'2px',padding:'0.65rem 1.25rem',border:'1px solid #bfdbfe',cursor:'pointer',transition:'all 0.2s' }}>↓ EXPORT REPORT</button>
                  <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:'0.52rem',color:'#94a3b8',letterSpacing:'0.5px' }}>Readiness estimate only — not a certification decision</div>
                </div>
              </div>
              {gaps.length===0?(
                <div style={{ padding:'2rem',textAlign:'center',background:'#f0fdf4',border:'1px solid #bbf7d0',color:'#16a34a',fontFamily:"'Share Tech Mono',monospace",fontSize:'0.8rem' }}>✓ NO GAPS — ALL CONTROLS PASSED OR N/A</div>
              ):(
                <div style={{ display:'flex',flexDirection:'column',gap:'1px',background:'#dde3ec' }}>
                  {gaps.map(({q,p})=>{
                    const pc=p==='BLOCKER'?'#dc2626':p==='HIGH'?'#d97706':'#1d4ed8'
                    return(
                      <div key={q.id} style={{ background:'#ffffff',padding:'1.5rem',position:'relative' }}>
                        <div style={{ position:'absolute',left:0,top:0,bottom:0,width:'3px',background:pc }} />
                        <div style={{ paddingLeft:'0.75rem' }}>
                          <div style={{ display:'flex',alignItems:'center',gap:'0.75rem',marginBottom:'0.5rem',flexWrap:'wrap' }}>
                            <span style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:'0.58rem',color:pc,border:`1px solid ${pc}`,padding:'1px 6px',letterSpacing:'1px' }}>{p}</span>
                            <span style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:'0.65rem',color:'#94a3b8' }}>{q.id}</span>
                            <span style={{ fontSize:'0.85rem',fontWeight:600,color:'#0f172a' }}>{q.title}</span>
                          </div>
                          <div style={{ fontSize:'0.78rem',color:'#64748b',lineHeight:1.6,marginBottom:'0.5rem' }}>{q.text}</div>
                          <div style={{ fontSize:'0.78rem',color:'#334155',lineHeight:1.6,background:'#f8faff',padding:'0.65rem 0.85rem',borderLeft:'2px solid #1d4ed8' }}>
                            <strong style={{ color:'#1d4ed8' }}>→ Remediation prompt: </strong>{q.rem}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
              {gaps.length>0&&(
                <div style={{ marginTop:'2rem',background:'#f0f7ff',border:'1px solid #bfdbfe',padding:'2rem',textAlign:'center' }}>
                  <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:'1.5rem',letterSpacing:'2px',color:'#0f172a',marginBottom:'0.5rem' }}>NEED HELP CLOSING THESE GAPS?</div>
                  <p style={{ fontSize:'0.85rem',color:'#64748b',maxWidth:'480px',margin:'0 auto 1.5rem',lineHeight:1.7 }}>The 48-hour Gap Review turns this list into a prioritised action plan, evidence checklist, and clear next step — with a human who knows the scheme.</p>
                  <button onClick={()=>setShowIntake(true)} style={{ background:'#1d4ed8',color:'#fff',fontFamily:"'Bebas Neue',sans-serif",fontSize:'1rem',letterSpacing:'3px',padding:'0.85rem 2rem',border:'none',cursor:'pointer',clipPath:'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',transition:'all 0.2s' }}
                    onMouseEnter={e=>e.currentTarget.style.background='#1e40af'}
                    onMouseLeave={e=>e.currentTarget.style.background='#1d4ed8'}
                  >BOOK GAP REVIEW — £397 →</button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'templates' && (
            <div>
              <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:'9px',color:'#1d4ed8',letterSpacing:'3px',marginBottom:'0.5rem' }}>// WORKING DOCUMENT TEMPLATES</div>
              <div style={{ background:'#fefce8',border:'1px solid #fde68a',borderLeft:'4px solid #f59e0b',padding:'0.75rem 1rem',marginBottom:'2rem' }}>
                <span style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:'0.62rem',color:'#92400e',letterSpacing:'1px' }}>
                  Working document templates — must be completed and approved internally. Not a certification output. Not legal advice. Tanasiom Aegis accepts no liability for their use. Governing law: England & Wales.
                </span>
              </div>
              <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))',gap:'1rem' }}>
                {TEMPLATES.map((t,i)=>(
                  <div key={t.name} style={{ background:'#f8faff',border:'1px solid #dde3ec',borderTop:'3px solid #1d4ed8',padding:'1.5rem',cursor:'pointer',transition:'all 0.2s' }}
                    onClick={()=>setOpenModal(i)}
                    onMouseEnter={e=>e.currentTarget.style.background='#eff6ff'}
                    onMouseLeave={e=>e.currentTarget.style.background='#f8faff'}
                  >
                    <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'0.75rem' }}>
                      <span style={{ fontSize:'1.5rem' }}>{t.icon}</span>
                      <span style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:'0.55rem',color:'#1d4ed8',border:'1px solid #bfdbfe',padding:'2px 6px' }}>{t.area}</span>
                    </div>
                    <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:'1rem',letterSpacing:'1px',color:'#0f172a',marginBottom:'0.35rem' }}>{t.name}</div>
                    <p style={{ fontSize:'0.78rem',color:'#64748b',lineHeight:1.65,marginBottom:'1rem' }}>{t.desc}</p>
                    <button style={{ width:'100%',background:'#1d4ed8',color:'#fff',fontFamily:"'Share Tech Mono',monospace",fontSize:'0.65rem',letterSpacing:'2px',padding:'0.6rem',border:'none',cursor:'pointer' }}
                      onClick={e=>{e.stopPropagation();setOpenModal(i)}}
                    >PREVIEW & DOWNLOAD ↓</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══ CONFIRM ══ */}
      {phase === 'confirm' && (
        <div style={{ maxWidth:'560px',margin:'0 auto',padding:'6rem 1.5rem',textAlign:'center' }}>
          <div style={{ background:'#ffffff',border:'1px solid #bbf7d0',borderTop:'4px solid #16a34a',padding:'3rem' }}>
            <div style={{ fontSize:'3rem',marginBottom:'1rem' }}>✅</div>
            <h2 style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:'2.5rem',letterSpacing:'3px',color:'#16a34a',marginBottom:'1rem' }}>MESSAGE RECEIVED</h2>
            <p style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:'1.1rem',fontStyle:'italic',color:'#64748b',lineHeight:1.7,marginBottom:'2rem' }}>
              We have your details and your readiness estimate. Dumitru will review your results and be in touch within 24 hours.
            </p>
            <div style={{ background:'#f8faff',border:'1px solid #dde3ec',padding:'1.25rem',marginBottom:'2rem',textAlign:'left' }}>
              <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:'9px',color:'#64748b',letterSpacing:'3px',marginBottom:'0.75rem' }}>// YOUR SUBMISSION</div>
              <div style={{ fontSize:'0.82rem',color:'#334155',lineHeight:1.8 }}>
                <div><span style={{ color:'#94a3b8' }}>Company: </span>{intake.company_name}</div>
                <div><span style={{ color:'#94a3b8' }}>Contact: </span>{intake.contact_name}</div>
                <div><span style={{ color:'#94a3b8' }}>Email: </span>{intake.contact_email}</div>
                <div><span style={{ color:'#94a3b8' }}>Readiness estimate: </span><span style={{ color:sc }}>{s.pct}%</span></div>
                <div style={{marginTop:'0.5rem',paddingTop:'0.5rem',borderTop:'1px solid #edf0f5'}}><span style={{ color:'#94a3b8' }}>Case reference: </span><span style={{fontFamily:"'Share Tech Mono',monospace",color:'#1d4ed8',fontWeight:600}}>{caseIdConfirm}</span></div>
                <div style={{fontSize:'0.72rem',color:'#94a3b8',marginTop:'0.25rem'}}>Quote this reference in all correspondence</div>
              </div>
            </div>
            <Link to="/" style={{ background:'transparent',color:'#1d4ed8',fontFamily:"'Share Tech Mono',monospace",fontSize:'0.72rem',letterSpacing:'2px',padding:'0.75rem 1.5rem',border:'1px solid #bfdbfe',textDecoration:'none',display:'inline-block',transition:'all 0.2s' }}>← BACK TO HOME</Link>
          </div>
        </div>
      )}

      {/* ══ INTAKE MODAL ══ */}
      {showIntake && phase !== 'confirm' && (
        <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',zIndex:500,display:'flex',alignItems:'center',justifyContent:'center',padding:'1.5rem' }} onClick={()=>setShowIntake(false)}>
          <div style={{ background:'#fff',border:'1px solid #dde3ec',maxWidth:'640px',width:'100%',maxHeight:'90vh',overflow:'auto' }} onClick={e=>e.stopPropagation()}>
            <div style={{ position:'sticky',top:0,background:'#fff',borderBottom:'1px solid #dde3ec',padding:'1.25rem 1.5rem',display:'flex',justifyContent:'space-between',alignItems:'center' }}>
              <div>
                <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:'9px',color:'#1d4ed8',letterSpacing:'3px',marginBottom:'0.2rem' }}>// BOOK THE 48-HOUR GAP REVIEW</div>
                <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:'1.1rem',letterSpacing:'2px',color:'#0f172a' }}>TELL US ABOUT YOUR BUSINESS</div>
              </div>
              <button onClick={()=>setShowIntake(false)} style={{ background:'none',border:'none',color:'#94a3b8',cursor:'pointer',fontSize:'1.2rem' }}>✕</button>
            </div>
            <div style={{ padding:'1.5rem' }}>
              <div style={{ background:'#f8faff',border:'1px solid #dde3ec',borderLeft:`3px solid ${sc}`,padding:'1rem 1.25rem',marginBottom:'1.5rem',display:'flex',gap:'1.5rem',flexWrap:'wrap',alignItems:'center' }}>
                <div style={{ textAlign:'center' }}>
                  <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:'2rem',color:sc }}>{s.pct}%</div>
                  <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:'0.58rem',color:'#94a3b8' }}>ESTIMATE</div>
                </div>
                <div style={{ textAlign:'center' }}>
                  <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:'2rem',color:'#dc2626' }}>{gaps.filter(g=>g.p==='BLOCKER').length}</div>
                  <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:'0.58rem',color:'#94a3b8' }}>BLOCKERS</div>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:'0.62rem',color:'#64748b',lineHeight:1.6 }}>Your score will be sent to Dumitru so we arrive prepared. No hard sell — just clarity.</div>
                </div>
              </div>
              <div style={{ display:'flex',flexDirection:'column',gap:'1rem' }}>
                <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:'9px',color:'#1d4ed8',letterSpacing:'3px' }}>// YOUR COMPANY</div>
                <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.75rem' }}>
                  {[{key:'company_name',label:'Company Name *',placeholder:'e.g. TechStart Solutions Ltd'},{key:'website',label:'Website',placeholder:'e.g. techstart.co.uk'}].map(f=>(
                    <div key={f.key}>
                      <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:'0.6rem',color:'#64748b',marginBottom:'0.3rem' }}>{f.label}</div>
                      <input value={intake[f.key]} onChange={e=>setIntake(p=>({...p,[f.key]:e.target.value}))} placeholder={f.placeholder} style={inp}
                        onFocus={e=>e.target.style.borderColor='#1d4ed8'} onBlur={e=>e.target.style.borderColor='#dde3ec'} />
                    </div>
                  ))}
                  <div>
                    <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:'0.6rem',color:'#64748b',marginBottom:'0.3rem' }}>Industry</div>
                    <select value={intake.industry} onChange={e=>setIntake(p=>({...p,industry:e.target.value}))} style={{ ...inp,cursor:'pointer' }}>
                      <option value="">Select...</option>
                      {['Construction','Manufacturing','Professional Services','Healthcare','Retail','Logistics','Technology','Security Services','Financial Services','Legal','Education','Other'].map(o=><option key={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:'0.6rem',color:'#64748b',marginBottom:'0.3rem' }}>Employees</div>
                    <select value={intake.employees} onChange={e=>setIntake(p=>({...p,employees:e.target.value}))} style={{ ...inp,cursor:'pointer' }}>
                      <option value="">Select...</option>
                      {['1–5','6–10','11–25','26–50','51–100','100+'].map(o=><option key={o}>{o}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:'9px',color:'#1d4ed8',letterSpacing:'3px',marginTop:'0.25rem' }}>// YOUR DETAILS</div>
                <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.75rem' }}>
                  {[{key:'contact_name',label:'Your Name *',placeholder:'e.g. John Smith'},{key:'contact_email',label:'Email *',placeholder:'e.g. john@company.co.uk',type:'email'},{key:'contact_phone',label:'Phone',placeholder:'e.g. 07700 900123'}].map(f=>(
                    <div key={f.key}>
                      <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:'0.6rem',color:'#64748b',marginBottom:'0.3rem' }}>{f.label}</div>
                      <input value={intake[f.key]} onChange={e=>setIntake(p=>({...p,[f.key]:e.target.value}))} placeholder={f.placeholder} type={f.type||'text'} style={inp}
                        onFocus={e=>e.target.style.borderColor='#1d4ed8'} onBlur={e=>e.target.style.borderColor='#dde3ec'} />
                    </div>
                  ))}
                </div>
                <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:'9px',color:'#1d4ed8',letterSpacing:'3px',marginTop:'0.25rem' }}>// CONTEXT</div>
                <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.75rem' }}>
                  {[
                    {key:'biggest_concern',label:'Biggest Concern',opts:['Passing CE certification','Winning a government contract','Cyber insurance renewal','Protecting customer data','General security improvement','Ransomware / malware','Staff phishing attacks']},
                    {key:'ce_status',label:'CE Status',opts:['Never applied','Applied and failed','Certified — renewal due','Considering applying','Required for a contract']},
                    {key:'deadline',label:'Target Deadline',opts:['ASAP — urgent','Within 1 month','1–3 months','3–6 months','No fixed deadline']},
                    {key:'how_found',label:'How Did You Find Us',opts:['Google search','LinkedIn','Referral','GitHub','Direct / knew the brand','Other']},
                  ].map(f=>(
                    <div key={f.key}>
                      <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:'0.6rem',color:'#64748b',marginBottom:'0.3rem' }}>{f.label}</div>
                      <select value={intake[f.key]} onChange={e=>setIntake(p=>({...p,[f.key]:e.target.value}))} style={{ ...inp,cursor:'pointer' }}>
                        <option value="">Select...</option>
                        {f.opts.map(o=><option key={o}>{o}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:'0.6rem',color:'#64748b',marginBottom:'0.3rem' }}>Anything else? (optional)</div>
                  <textarea value={intake.notes} onChange={e=>setIntake(p=>({...p,notes:e.target.value}))} placeholder="Tell us about your setup or any specific concerns..." rows={3} style={{ ...inp,resize:'vertical' }}
                    onFocus={e=>e.target.style.borderColor='#1d4ed8'} onBlur={e=>e.target.style.borderColor='#dde3ec'} />
                </div>
                {/* GDPR consent — tightened */}
                <div style={{ background:'#f8faff',border:'1px solid #dde3ec',padding:'0.75rem 1rem',fontSize:'0.72rem',color:'#64748b',lineHeight:1.65 }}>
                  By submitting this form you consent to Tanasiom Aegis Security & Compliance contacting you about Cyber Essentials readiness services. Your details and self-check output will be used solely to prepare that discussion and will not be shared with third parties. Submitting does not create a client relationship. Governing law: England & Wales.
                </div>
                {sendError&&<div style={{ padding:'0.75rem',background:'#fef2f2',border:'1px solid #fecaca',fontFamily:"'Share Tech Mono',monospace",fontSize:'0.72rem',color:'#dc2626' }}>⚠ {sendError}</div>}
                <button onClick={handleIntakeSubmit} disabled={sending} style={{ width:'100%',background:sending?'#94a3b8':'#1d4ed8',color:'#fff',fontFamily:"'Bebas Neue',sans-serif",fontSize:'1rem',letterSpacing:'3px',padding:'1rem',border:'none',cursor:sending?'not-allowed':'pointer',clipPath:'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',transition:'all 0.2s' }}>
                  {sending?'SENDING...':'SEND MESSAGE →'}
                </button>
                <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:'0.6rem',color:'#94a3b8',letterSpacing:'2px',textAlign:'center' }}>NO OBLIGATION · WE'LL REPLY WITHIN 24 HOURS</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TEMPLATE MODAL */}
      {openModal !== null && (
        <TemplateModal
          t={TEMPLATES[openModal]}
          onClose={()=>setOpenModal(null)}
          templateAccepted={templateAccepted}
          onTemplateAccept={()=>setTemplateAccepted(true)}
        />
      )}

    </div>
  )
}