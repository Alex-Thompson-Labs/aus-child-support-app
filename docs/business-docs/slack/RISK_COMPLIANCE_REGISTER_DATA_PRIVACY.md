# Risk & Compliance Register (Data Privacy)

**Last Updated:** January 1, 2026  
**Status:** Phase 3A - Validation  
**Product:** Australian Child Support Calculator (auschildsupport.com)  
**Legal Framework:** Privacy Act 1988 (Cth) & Australian Privacy Principles (APPs)

---

## Overview

This document provides a comprehensive risk and compliance register for data privacy, covering Privacy Act 1988 compliance, risk identification, mitigation strategies, and ongoing compliance monitoring.

**Purpose:** Ensure legal compliance, protect user privacy, and mitigate data privacy risks across all business operations.

---

## 1. Legal Framework

### 1.1 Applicable Legislation

**Primary Legislation:**

- **Privacy Act 1988 (Cth)** - Primary privacy law in Australia
- **Australian Privacy Principles (APPs)** - 13 principles governing data handling

**Key Requirements:**

- APP 1: Open and transparent management of personal information
- APP 3: Collection of solicited personal information
- APP 5: Notification of collection
- APP 6: Use and disclosure of personal information
- APP 7: Direct marketing (not applicable - we don't do direct marketing)
- APP 8: Cross-border disclosure
- APP 11: Security of personal information
- APP 12: Access to personal information
- APP 13: Correction of personal information

**Regulatory Authority:**

- **Office of the Australian Information Commissioner (OAIC)** - Privacy regulator

---

### 1.2 Business Context

**What We Do:**

- Collect personal information from parents (lead generators)
- Store encrypted lead data in Supabase database
- Share qualified leads with family law firms (lawyers)
- Process payments via Stripe

**Data Types Collected:**

- Personal information (name, email, phone, address)
- Financial information (income, employment status)
- Family information (children, care arrangements)
- Technical data (IP address, browser information)

**Data Sharing:**

- Qualified leads shared with family law firms (with consent)
- Third-party service providers (Supabase, Stripe, Vercel, Google Analytics)

---

## 2. Risk Register

### 2.1 Risk Assessment Matrix

<table>
<thead>
<tr>
<th>Risk ID</th>
<th>Risk Description</th>
<th>Likelihood</th>
<th>Impact</th>
<th>Risk Level</th>
<th>Status</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>PR-001</strong></td>
<td>Unauthorized access to database</td>
<td>Low</td>
<td>High</td>
<td>Medium</td>
<td>✅ Mitigated</td>
</tr>
<tr>
<td><strong>PR-002</strong></td>
<td>Data breach (hacking, malware)</td>
<td>Low</td>
<td>High</td>
<td>Medium</td>
<td>✅ Mitigated</td>
</tr>
<tr>
<td><strong>PR-003</strong></td>
<td>Consent not obtained before sharing</td>
<td>Medium</td>
<td>High</td>
<td>High</td>
<td>✅ Mitigated</td>
</tr>
<tr>
<td><strong>PR-004</strong></td>
<td>Data shared without proper authorization</td>
<td>Medium</td>
<td>High</td>
<td>High</td>
<td>✅ Mitigated</td>
</tr>
<tr>
<td><strong>PR-005</strong></td>
<td>Inadequate data security measures</td>
<td>Low</td>
<td>High</td>
<td>Medium</td>
<td>✅ Mitigated</td>
</tr>
<tr>
<td><strong>PR-006</strong></td>
<td>Cross-border data transfer non-compliance</td>
<td>Low</td>
<td>Medium</td>
<td>Low</td>
<td>✅ Mitigated</td>
</tr>
<tr>
<td><strong>PR-007</strong></td>
<td>Failure to respond to data access requests</td>
<td>Low</td>
<td>Medium</td>
<td>Low</td>
<td>⚠️ Monitored</td>
</tr>
<tr>
<td><strong>PR-008</strong></td>
<td>Failure to delete data upon request</td>
<td>Low</td>
<td>Medium</td>
<td>Low</td>
<td>⚠️ Monitored</td>
</tr>
<tr>
<td><strong>PR-009</strong></td>
<td>Insufficient audit trails</td>
<td>Low</td>
<td>Medium</td>
<td>Low</td>
<td>✅ Mitigated</td>
</tr>
<tr>
<td><strong>PR-010</strong></td>
<td>Third-party data breach (Supabase, Stripe)</td>
<td>Low</td>
<td>High</td>
<td>Medium</td>
<td>⚠️ Monitored</td>
</tr>
<tr>
<td><strong>PR-011</strong></td>
<td>Email containing PII (before Secure Magic Link)</td>
<td>Medium</td>
<td>High</td>
<td>High</td>
<td>⚠️ In Progress</td>
</tr>
<tr>
<td><strong>PR-012</strong></td>
<td>Privacy policy not updated</td>
<td>Low</td>
<td>Medium</td>
<td>Low</td>
<td>✅ Mitigated</td>
</tr>
<tr>
<td><strong>PR-013</strong></td>
<td>Inadequate consent mechanism</td>
<td>Low</td>
<td>High</td>
<td>Medium</td>
<td>✅ Mitigated</td>
</tr>
</tbody>
</table>

---

## 3. Detailed Risk Analysis

### 3.1 High-Risk Items

#### PR-003: Consent Not Obtained Before Sharing

**Risk Description:**

- Lead data shared with lawyers without explicit consent from parent
- Violates APP 6 (use and disclosure) and APP 3 (collection)

**Current Mitigation:**

- ✅ Mandatory consent checkbox on inquiry form
- ✅ Privacy policy link provided before consent
- ✅ Consent must be checked before form submission
- ✅ Consent stored in database (audit trail)

**Remaining Risk:**

- ⚠️ Manual error (admin sends lead without checking consent)
- ⚠️ System bug (consent not properly validated)

**Additional Controls Needed:**

- Automated validation: System checks consent before allowing lead sharing
- Admin dashboard warning if consent not checked
- Regular audit of consent records

**Compliance Status:** ✅ Compliant (with monitoring)

---

#### PR-004: Data Shared Without Proper Authorization

**Risk Description:**

- Lead data shared with wrong lawyer or unauthorized party
- Violates APP 6 (use and disclosure)

**Current Mitigation:**

- ✅ Secure Magic Link system (time-limited access)
- ✅ Admin dashboard controls access
- ✅ Teaser email workflow (lawyer accepts before full details)
- ✅ Payment required before full access (reduces unauthorized sharing)

**Remaining Risk:**

- ⚠️ Manual error (admin sends to wrong lawyer)
- ⚠️ Secure Magic Link shared publicly (social media, etc.)

**Additional Controls Needed:**

- Automated lead routing (Phase 4+)
- Secure Magic Link expiration (24-48 hours)
- Access logging (who accessed which lead, when)

**Compliance Status:** ✅ Compliant (with monitoring)

---

#### PR-011: Email Containing PII (Before Secure Magic Link)

**Risk Description:**

- Teaser emails or notifications contain PII (name, email, phone)
- Violates APP 11 (security) - data should be encrypted/secure

**Current Status:**

- ⚠️ **In Progress:** Secure Magic Link implementation
- ⚠️ Current: Teaser emails may contain some PII

**Mitigation Plan:**

- ✅ Secure Magic Link system (no PII in emails)
- ✅ Teaser emails contain only case summary (no contact details)
- ✅ Full details only via Secure Magic Link (encrypted, time-limited)

**Target Completion:** Phase 3A (January 2026)

**Compliance Status:** ⚠️ In Progress (target: Compliant by Phase 3A completion)

---

### 3.2 Medium-Risk Items

#### PR-001: Unauthorized Access to Database

**Risk Description:**

- Unauthorized users access Supabase database
- Data breach, privacy violation

**Current Mitigation:**

- ✅ Supabase Row Level Security (RLS) policies
- ✅ Admin-only access via Supabase Auth
- ✅ Encrypted database storage
- ✅ Strong password requirements
- ✅ Environment variables for API keys (not in code)

**Remaining Risk:**

- ⚠️ Credential compromise (phishing, weak password)
- ⚠️ RLS policy misconfiguration

**Additional Controls Needed:**

- Two-factor authentication (2FA) for admin access
- Regular security audits
- Access logging and monitoring

**Compliance Status:** ✅ Compliant (with improvements planned)

---

#### PR-002: Data Breach (Hacking, Malware)

**Risk Description:**

- External attack compromises database or systems
- Data exfiltration, privacy violation

**Current Mitigation:**

- ✅ Supabase security (managed service, encryption at rest)
- ✅ HTTPS encryption (Vercel deployment)
- ✅ No sensitive data in code repository
- ✅ Environment variables for secrets

**Remaining Risk:**

- ⚠️ Application vulnerabilities (XSS, SQL injection)
- ⚠️ Third-party service breach (Supabase, Vercel)

**Additional Controls Needed:**

- Regular security updates
- Vulnerability scanning
- Incident response plan
- Data breach notification procedures

**Compliance Status:** ✅ Compliant (with monitoring)

---

#### PR-005: Inadequate Data Security Measures

**Risk Description:**

- Insufficient technical and organizational measures
- Violates APP 11 (security of personal information)

**Current Mitigation:**

- ✅ Encrypted database storage (Supabase)
- ✅ HTTPS encryption (Vercel)
- ✅ Access controls (RLS policies, admin-only)
- ✅ Secure Magic Link system (encrypted, time-limited)

**Remaining Risk:**

- ⚠️ No encryption for data in transit (if not using HTTPS)
- ⚠️ Insufficient access logging

**Additional Controls Needed:**

- Regular security assessments
- Access logging and monitoring
- Data encryption at rest verification

**Compliance Status:** ✅ Compliant (with improvements planned)

---

#### PR-010: Third-Party Data Breach (Supabase, Stripe)

**Risk Description:**

- Third-party service provider experiences data breach
- Our data compromised through vendor

**Current Mitigation:**

- ✅ Vendor assessment (Supabase, Stripe are reputable)
- ✅ Data minimization (only necessary data shared)
- ✅ Contractual requirements (vendor privacy policies)

**Remaining Risk:**

- ⚠️ Vendor breach beyond our control
- ⚠️ Insufficient vendor security

**Additional Controls Needed:**

- Vendor security assessments (annual)
- Incident response plan (vendor breach scenario)
- Data breach notification procedures

**Compliance Status:** ⚠️ Monitored (vendor-dependent risk)

---

### 3.3 Low-Risk Items

#### PR-006: Cross-Border Data Transfer Non-Compliance

**Risk Description:**

- Data transferred outside Australia without proper safeguards
- Violates APP 8 (cross-border disclosure)

**Current Mitigation:**

- ✅ Supabase (Sydney region) - data stored in Australia
- ✅ Vercel (may use global CDN, but data not stored)
- ✅ Google Analytics (may process outside AU, but anonymized)
- ✅ Privacy policy discloses cross-border transfers

**Remaining Risk:**

- ⚠️ Future vendor changes (may move data outside AU)
- ⚠️ Analytics data processed outside AU

**Additional Controls Needed:**

- Vendor assessment (data location)
- Contractual requirements (data residency)
- Privacy policy updates if vendors change

**Compliance Status:** ✅ Compliant (with monitoring)

---

#### PR-007: Failure to Respond to Data Access Requests

**Risk Description:**

- Parent requests access to their data, we fail to respond
- Violates APP 12 (access to personal information)

**Current Mitigation:**

- ✅ Privacy policy states 30-day response time
- ✅ Contact email: alex@auschildsupport.com
- ✅ Database allows data retrieval

**Remaining Risk:**

- ⚠️ Manual process (may be slow or missed)
- ⚠️ No automated access request system

**Additional Controls Needed:**

- Automated access request system (Phase 4+)
- Request tracking (spreadsheet or system)
- Regular review of pending requests

**Compliance Status:** ⚠️ Monitored (manual process, needs automation)

---

#### PR-008: Failure to Delete Data Upon Request

**Risk Description:**

- Parent requests deletion, we fail to delete
- Violates APP 13 (correction of personal information) and data rights

**Current Mitigation:**

- ✅ Privacy policy states deletion rights
- ✅ Database allows data deletion
- ✅ Contact email for requests

**Remaining Risk:**

- ⚠️ Manual process (may be slow or missed)
- ⚠️ Backup data not deleted (if backups exist)
- ⚠️ Legal retention requirements (may need to retain some data)

**Additional Controls Needed:**

- Automated deletion request system (Phase 4+)
- Request tracking
- Backup deletion procedures
- Legal retention policy (what must be retained)

**Compliance Status:** ⚠️ Monitored (manual process, needs automation)

---

#### PR-009: Insufficient Audit Trails

**Risk Description:**

- Cannot track who accessed what data, when
- Violates APP 1 (open and transparent management)

**Current Mitigation:**

- ✅ Supabase audit logs (database access)
- ✅ Lead status tracking (who changed status, when)
- ✅ Timestamp tracking (created_at, updated_at)

**Remaining Risk:**

- ⚠️ No detailed access logs (who viewed which lead)
- ⚠️ No Secure Magic Link access logging (yet)

**Additional Controls Needed:**

- Secure Magic Link access logging (Phase 3A)
- Detailed audit trail (who, what, when)
- Regular audit review

**Compliance Status:** ✅ Compliant (with improvements planned)

---

## 4. Compliance Requirements

### 4.1 Australian Privacy Principles (APPs)

#### APP 1: Open and Transparent Management

**Requirement:** Have a clearly expressed and up-to-date privacy policy.

**Current Status:** ✅ Compliant

- Privacy policy published at auschildsupport.com/privacy
- Last updated: December 27, 2024
- Covers all required elements

**Ongoing Requirements:**

- Review and update annually (or when practices change)
- Make policy easily accessible
- Explain how to make complaints

---

#### APP 3: Collection of Solicited Personal Information

**Requirement:** Only collect personal information that is reasonably necessary.

**Current Status:** ✅ Compliant

- Only collect information needed for calculator and lead generation
- No unnecessary data collection
- Consent obtained before collection

**Ongoing Requirements:**

- Regular review of data collection (ensure still necessary)
- Data minimization (collect only what's needed)

---

#### APP 5: Notification of Collection

**Requirement:** Notify individuals about collection of personal information.

**Current Status:** ✅ Compliant

- Privacy policy explains what we collect and why
- Consent checkbox on inquiry form
- Privacy policy link provided

**Ongoing Requirements:**

- Ensure privacy policy is clear and accessible
- Update if collection practices change

---

#### APP 6: Use and Disclosure

**Requirement:** Only use or disclose personal information for the purpose it was collected (or with consent).

**Current Status:** ✅ Compliant

- Data collected for lead generation
- Shared with lawyers only with explicit consent
- Consent checkbox mandatory

**Ongoing Requirements:**

- Verify consent before each disclosure
- No secondary use without consent

---

#### APP 8: Cross-Border Disclosure

**Requirement:** Take reasonable steps to ensure overseas recipients comply with privacy standards.

**Current Status:** ✅ Compliant

- Supabase (Sydney region) - data in Australia
- Privacy policy discloses potential cross-border transfers
- Vendor assessment (Supabase, Stripe are reputable)

**Ongoing Requirements:**

- Monitor vendor data locations
- Update privacy policy if vendors change
- Assess new vendors for data location

---

#### APP 11: Security of Personal Information

**Requirement:** Take reasonable steps to protect personal information.

**Current Status:** ✅ Compliant

- Encrypted database storage (Supabase)
- HTTPS encryption (Vercel)
- Access controls (RLS policies, admin-only)
- Secure Magic Link system (encrypted, time-limited)

**Ongoing Requirements:**

- Regular security assessments
- Keep systems updated
- Monitor for vulnerabilities

---

#### APP 12: Access to Personal Information

**Requirement:** Provide access to personal information upon request.

**Current Status:** ⚠️ Compliant (Manual Process)

- Privacy policy states 30-day response time
- Contact email: alex@auschildsupport.com
- Database allows data retrieval

**Improvements Needed:**

- Automated access request system (Phase 4+)
- Request tracking system
- Standardized response format

---

#### APP 13: Correction of Personal Information

**Requirement:** Correct personal information upon request.

**Current Status:** ⚠️ Compliant (Manual Process)

- Privacy policy states correction rights
- Contact email for requests
- Database allows data correction

**Improvements Needed:**

- Automated correction request system (Phase 4+)
- Request tracking system
- Verification process (ensure requester is data subject)

---

### 4.2 Data Breach Notification

**Requirement:** Notify OAIC and affected individuals of eligible data breaches.

**Current Status:** ⚠️ Procedure Documented (Not Tested)

- Privacy policy mentions breach notification
- No formal incident response plan yet

**Required Actions:**

- Develop incident response plan
- Define "eligible data breach" criteria
- Establish notification procedures (OAIC + individuals)
- Test breach response procedures

**Timeline:** Phase 3A (January 2026)

---

## 5. Mitigation Strategies

### 5.1 Technical Controls

<table>
<thead>
<tr>
<th>Control</th>
<th>Implementation</th>
<th>Status</th>
<th>Notes</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Database Encryption</strong></td>
<td>Supabase encryption at rest</td>
<td>✅ Implemented</td>
<td>Managed by Supabase</td>
</tr>
<tr>
<td><strong>HTTPS Encryption</strong></td>
<td>Vercel SSL/TLS</td>
<td>✅ Implemented</td>
<td>All traffic encrypted</td>
</tr>
<tr>
<td><strong>Access Controls</strong></td>
<td>Supabase RLS policies</td>
<td>✅ Implemented</td>
<td>Admin-only access</td>
</tr>
<tr>
<td><strong>Secure Magic Link</strong></td>
<td>Time-limited, encrypted tokens</td>
<td>⚠️ In Progress</td>
<td>Phase 3A target</td>
</tr>
<tr>
<td><strong>Environment Variables</strong></td>
<td>Secrets not in code</td>
<td>✅ Implemented</td>
<td>.env files, not tracked</td>
</tr>
<tr>
<td><strong>Password Security</strong></td>
<td>Strong password requirements</td>
<td>✅ Implemented</td>
<td>Supabase Auth</td>
</tr>
<tr>
<td><strong>2FA</strong></td>
<td>Two-factor authentication</td>
<td>⏳ Planned</td>
<td>Phase 4+</td>
</tr>
<tr>
<td><strong>Access Logging</strong></td>
<td>Database audit logs</td>
<td>✅ Implemented</td>
<td>Supabase logs</td>
</tr>
<tr>
<td><strong>Secure Magic Link Logging</strong></td>
<td>Access tracking</td>
<td>⏳ Planned</td>
<td>Phase 3A</td>
</tr>
</tbody>
</table>

---

### 5.2 Administrative Controls

<table>
<thead>
<tr>
<th>Control</th>
<th>Implementation</th>
<th>Status</th>
<th>Notes</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Privacy Policy</strong></td>
<td>Published and accessible</td>
<td>✅ Implemented</td>
<td>auschildsupport.com/privacy</td>
</tr>
<tr>
<td><strong>Consent Mechanism</strong></td>
<td>Mandatory checkbox</td>
<td>✅ Implemented</td>
<td>Inquiry form</td>
</tr>
<tr>
<td><strong>Data Minimization</strong></td>
<td>Only collect necessary data</td>
<td>✅ Implemented</td>
<td>Review regularly</td>
</tr>
<tr>
<td><strong>Vendor Assessment</strong></td>
<td>Supabase, Stripe assessed</td>
<td>✅ Implemented</td>
<td>Reputable vendors</td>
</tr>
<tr>
<td><strong>Access Request Process</strong></td>
<td>Manual process</td>
<td>⚠️ Manual</td>
<td>Needs automation</td>
</tr>
<tr>
<td><strong>Deletion Request Process</strong></td>
<td>Manual process</td>
<td>⚠️ Manual</td>
<td>Needs automation</td>
</tr>
<tr>
<td><strong>Incident Response Plan</strong></td>
<td>Procedure documented</td>
<td>⏳ Planned</td>
<td>Phase 3A</td>
</tr>
<tr>
<td><strong>Regular Audits</strong></td>
<td>Quarterly reviews</td>
<td>⏳ Planned</td>
<td>Phase 3B+</td>
</tr>
</tbody>
</table>

---

### 5.3 Organizational Controls

<table>
<thead>
<tr>
<th>Control</th>
<th>Implementation</th>
<th>Status</th>
<th>Notes</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Privacy Training</strong></td>
<td>Founder knowledge</td>
<td>✅ Implemented</td>
<td>Privacy Act awareness</td>
</tr>
<tr>
<td><strong>Documentation</strong></td>
<td>Privacy policy, this register</td>
<td>✅ Implemented</td>
<td>Comprehensive docs</td>
</tr>
<tr>
<td><strong>Compliance Monitoring</strong></td>
<td>Regular reviews</td>
<td>⏳ Planned</td>
<td>Quarterly from Phase 3B</td>
</tr>
<tr>
<td><strong>Vendor Contracts</strong></td>
<td>Review privacy policies</td>
<td>✅ Implemented</td>
<td>Supabase, Stripe reviewed</td>
</tr>
</tbody>
</table>

---

## 6. Data Handling Procedures

### 6.1 Data Collection

**Procedure:**

1. Parent uses calculator (no data collected yet)
2. Parent clicks "Get Legal Help" → Inquiry form shown
3. Privacy policy link displayed
4. Consent checkbox (mandatory) must be checked
5. Form submission → Data saved to database (encrypted)
6. Consent status stored in database (audit trail)

**Compliance:**

- ✅ APP 3: Only collect necessary information
- ✅ APP 5: Privacy policy provided before collection
- ✅ APP 6: Consent obtained before collection

---

### 6.2 Data Storage

**Procedure:**

1. Data stored in Supabase database (Sydney region)
2. Encrypted at rest (Supabase managed)
3. Access controlled via RLS policies
4. Admin-only access via Supabase Auth
5. Audit logs maintained (who accessed, when)

**Compliance:**

- ✅ APP 11: Reasonable security measures
- ✅ APP 8: Data stored in Australia (Sydney region)

---

### 6.3 Data Sharing (Lead Delivery)

**Procedure:**

1. Admin reviews lead (30-second quality check)
2. System verifies consent is checked
3. Teaser email sent to lawyer (case summary, no PII)
4. Lawyer accepts → Charged $50
5. Secure Magic Link generated (time-limited, encrypted)
6. Full details sent via Secure Magic Link (no PII in email)
7. Access logged (who accessed, when)

**Compliance:**

- ✅ APP 6: Consent obtained before disclosure
- ✅ APP 11: Secure transmission (Secure Magic Link)
- ✅ Audit trail maintained

---

### 6.4 Data Access Requests

**Procedure (Current - Manual):**

1. Parent emails alex@auschildsupport.com
2. Verify identity (email match, or request proof)
3. Retrieve data from database
4. Provide data in readable format (PDF or email)
5. Respond within 30 days (as stated in privacy policy)

**Compliance:**

- ✅ APP 12: Access provided upon request
- ⚠️ Manual process (needs automation)

**Improvements Needed:**

- Automated access request system (Phase 4+)
- Request tracking
- Standardized response format

---

### 6.5 Data Correction Requests

**Procedure (Current - Manual):**

1. Parent emails alex@auschildsupport.com
2. Verify identity (email match, or request proof)
3. Verify requested correction is accurate
4. Update data in database
5. Confirm correction completed
6. Respond within 30 days

**Compliance:**

- ✅ APP 13: Correction provided upon request
- ⚠️ Manual process (needs automation)

**Improvements Needed:**

- Automated correction request system (Phase 4+)
- Request tracking
- Verification process

---

### 6.6 Data Deletion Requests

**Procedure (Current - Manual):**

1. Parent emails alex@auschildsupport.com
2. Verify identity (email match, or request proof)
3. Check legal retention requirements (may need to retain some data)
4. Delete data from database (if no retention requirement)
5. Delete from backups (if backups exist)
6. Confirm deletion completed
7. Respond within 30 days

**Compliance:**

- ✅ APP 13: Deletion provided upon request (subject to legal limits)
- ⚠️ Manual process (needs automation)

**Improvements Needed:**

- Automated deletion request system (Phase 4+)
- Request tracking
- Legal retention policy (what must be retained)

---

## 7. Incident Response Plan

### 7.1 Data Breach Definition

**Eligible Data Breach (Privacy Act 1988):**

- Unauthorized access to, or disclosure of, personal information
- Likely to result in serious harm to individuals
- Entity has been unable to prevent the likely risk of serious harm

**Serious Harm Includes:**

- Physical harm
- Psychological harm
- Financial harm
- Reputational harm

---

### 7.2 Breach Response Procedure

**Step 1: Containment (Immediate)**

- Identify and isolate affected systems
- Revoke compromised access credentials
- Preserve evidence (logs, screenshots)

**Step 2: Assessment (Within 24 hours)**

- Determine scope of breach (what data, how many individuals)
- Assess risk of serious harm
- Determine if breach is "eligible" (requires notification)

**Step 3: Notification (If Eligible)**

- **OAIC Notification:** Within 30 days of becoming aware
- **Individual Notification:** As soon as practicable (if serious harm likely)
- **Content:** What happened, what data affected, what we're doing, how to protect themselves

**Step 4: Remediation**

- Fix security vulnerability (if applicable)
- Enhance security controls
- Review and update procedures

**Step 5: Documentation**

- Document breach details
- Document response actions
- Document lessons learned

---

### 7.3 Breach Notification Template

**To OAIC:**

- Description of breach
- Date/time of breach
- Data affected
- Number of individuals affected
- Steps taken to contain breach
- Steps taken to notify individuals
- Remediation measures

**To Affected Individuals:**

- What happened
- What information was affected
- What we're doing about it
- What they can do to protect themselves
- How to contact us

---

## 8. Compliance Monitoring

### 8.1 Regular Reviews

<table>
<thead>
<tr>
<th>Review Type</th>
<th>Frequency</th>
<th>Owner</th>
<th>Status</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Privacy Policy Review</strong></td>
<td>Annually (or when practices change)</td>
<td>Founder</td>
<td>⏳ Planned</td>
</tr>
<tr>
<td><strong>Security Assessment</strong></td>
<td>Quarterly</td>
<td>Founder</td>
<td>⏳ Planned (Phase 3B+)</td>
</tr>
<tr>
<td><strong>Vendor Assessment</strong></td>
<td>Annually</td>
<td>Founder</td>
<td>⏳ Planned</td>
</tr>
<tr>
<td><strong>Access Request Review</strong></td>
<td>Monthly</td>
<td>Founder</td>
<td>⏳ Planned (Phase 3B+)</td>
</tr>
<tr>
<td><strong>Incident Response Test</strong></td>
<td>Annually</td>
<td>Founder</td>
<td>⏳ Planned</td>
</tr>
</tbody>
</table>

---

### 8.2 Compliance Checklist

**Monthly (Phase 3B+):**

- [ ] Review pending access/correction/deletion requests
- [ ] Check for any security incidents
- [ ] Review access logs (unusual activity)
- [ ] Verify consent is being obtained for all leads

**Quarterly:**

- [ ] Security assessment (vulnerabilities, updates)
- [ ] Review privacy policy (still accurate)
- [ ] Review vendor privacy policies (any changes)
- [ ] Test incident response procedures

**Annually:**

- [ ] Comprehensive privacy policy review
- [ ] Vendor security assessment
- [ ] Full compliance audit
- [ ] Update this register

---

## 9. Key Takeaways

### 9.1 Compliance Status Summary

✅ **Compliant:**

- Privacy policy published and accessible
- Consent mechanism implemented
- Data encryption (at rest and in transit)
- Access controls (RLS policies, admin-only)
- Data stored in Australia (Sydney region)

⚠️ **In Progress:**

- Secure Magic Link implementation (Phase 3A)
- Incident response plan (Phase 3A)

⏳ **Planned:**

- Automated access/correction/deletion request systems (Phase 4+)
- Two-factor authentication (Phase 4+)
- Regular compliance audits (Phase 3B+)

---

### 9.2 Critical Risks

**High Priority:**

1. **PR-011:** Email containing PII (before Secure Magic Link) - **In Progress**
2. **PR-003:** Consent not obtained - **Mitigated** (with monitoring)
3. **PR-004:** Data shared without authorization - **Mitigated** (with monitoring)

**Medium Priority:**

1. **PR-001:** Unauthorized database access - **Mitigated** (with improvements planned)
2. **PR-002:** Data breach - **Mitigated** (with monitoring)
3. **PR-010:** Third-party breach - **Monitored** (vendor-dependent)

---

### 9.3 Next Steps

**Immediate (Phase 3A):**

1. Complete Secure Magic Link implementation (eliminate PII in emails)
2. Develop incident response plan
3. Test data access/correction/deletion procedures

**Short-term (Phase 3B):**

1. Implement access logging for Secure Magic Links
2. Establish regular compliance reviews
3. Document legal retention requirements

**Medium-term (Phase 4+):**

1. Automate access/correction/deletion request systems
2. Implement two-factor authentication
3. Conduct regular security assessments

---

**For related documentation:**

- `/public/privacy-policy.html` - Privacy policy
- `/docs/business-docs/BUSINESS_MODEL.md` - Business model (includes privacy approach)
- `/docs/business-docs/LEAD_QUALIFICATION_CRITERIA.md` - Lead qualification (includes consent)
