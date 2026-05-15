# Data Discovery Portal & CMS Integration Guide

## Overview
The **Data Discovery Portal** is an AI-powered engine designed to bridge the gap between technical database schemas and regulatory compliance. It automates the identification of PII (Personally Identifiable Information) and sensitive data within your databases, providing a structured **Governance Map** that integrates directly into the **Secure CMS Portal**.

---

## How it Fits into the CMS Ecosystem
The discovery process is the foundational step in building your organization's **Record of Processing Activities (RoPA)** and **Data Catalogue**.

### 1. Automated Inventory Creation
Instead of manually listing thousands of database columns, you upload your `.sql` schema artifacts here. The AI identifies technical fields (e.g., `cust_email_addr`) and maps them to standard **Data Entities** defined in the CMS (e.g., `Email Address`).

### 2. Purpose-Based Mapping in CMS
Once you export the **Governance Map (JSON/CSV)** from this portal:
- **Import to CMS**: Go to the **CMS Data Management** section and upload the file.
- **Link to Purposes**: In the CMS, you can now link these discovered tables/columns to specific **Processing Purposes** (e.g., "Marketing Outreach" or "Payroll Processing").
- **Legal Basis**: CMS will automatically suggest the necessary Legal Basis (Consent, Legitimate Interest, etc.) based on the sensitivity of the entities discovered by this tool.

### 3. Sensitivity & Risk Assessment
The sensitivity levels (Low, Medium, High, Critical) identified in this portal flow into the CMS **Risk Engine**:
- High-sensitivity mappings discovered here will automatically trigger a **DPIA (Data Protection Impact Assessment)** workflow in the CMS portal.
- Fields marked as 'Critical' will be flagged for immediate encryption or masking policies.

---

## Step-by-Step Workflow

### Step 1: Ingestion & Discovery
1. Enter the **Source Name** (e.g., `Customer_DB_Prod`).
2. Upload the `.sql` schema file.
3. Click **Process & Run Discovery**. The AI will scan the schema and suggest mappings based on your global Data Catalogue.

### Step 2: Validation & Overrides
- **Approve**: If the AI mapping is correct.
- **Remap**: Use the manual override if a column should be mapped to a different entity from the catalogue.
- **Status Tracking**: Only 'Approved' or 'Remapped' rows will be included in the final export.

### Step 3: Export & CMS Sync
1. Click **Export as JSON** (Recommended for system integration).
2. Login to your **Secure CMS Portal**.
3. Navigate to **Data Governance > Data Sources > Import Discovery Map**.
4. Upload your file. Your CMS Data Catalogue will now be populated with real-world technical metadata, ready for Purpose and Consent mapping.

---

## Key Benefits
- **Speed**: Reduce discovery time from weeks to minutes.
- **Accuracy**: AI reasoning explains *why* a field was classified, ensuring governance teams can trust the results.
- **Consistency**: Ensures the same data entity (e.g., `Phone Number`) is named and treated identically across every database in your enterprise.

---

*For technical support or catalogue updates, please contact the Governance Team via the Secure CMS Dashboard.*
