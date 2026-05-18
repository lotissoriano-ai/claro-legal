# Claro — Document Template Variable Dictionary

All 13 NY divorce form templates use `{{variable_name}}` placeholders.  
The app collects answers, then fills these in using **docxtemplater** (JS library).

---

## Complete Variable List

### Plaintiff (Wife)
| Variable | Interview Question | Example |
|---|---|---|
| `{{plaintiff_name}}` | "Enter the Wife's name" | Mary Smith |
| `{{plaintiff_address}}` | Wife's street + city/state/zip | 123 Main St, New York, NY 10007 |
| `{{plaintiff_address_street}}` | Street line only | 123 Main St |
| `{{plaintiff_address_city_state_zip}}` | City/state/zip line | New York, NY 10007 |
| `{{plaintiff_phone}}` | Wife's phone number | 212-555-1234 |
| `{{plaintiff_email}}` | Wife's email | mary@email.com |
| `{{plaintiff_dob}}` | Wife's date of birth | April 1, 1980 |
| `{{plaintiff_ssn}}` | Wife's Social Security Number | 123-45-6789 |
| `{{plaintiff_prior_surname}}` | Wife's maiden name to resume | Jones |

### Defendant (Husband)
| Variable | Interview Question | Example |
|---|---|---|
| `{{defendant_name}}` | "Enter the Husband's name" | Robert Smith |
| `{{defendant_address}}` | Husband's full address | 456 Oak Ave, Brooklyn, NY 11231 |
| `{{defendant_address_street}}` | Street line only | 456 Oak Ave |
| `{{defendant_address_city_state_zip}}` | City/state/zip line | Brooklyn, NY 11231 |
| `{{defendant_phone}}` | Husband's phone | 212-555-5678 |
| `{{defendant_email}}` | Husband's email | robert@email.com |
| `{{defendant_dob}}` | Husband's date of birth | October 1, 1975 |
| `{{defendant_ssn}}` | Husband's Social Security Number | 555-12-1212 |
| `{{defendant_fax}}` | Husband's fax (if any) | |

### Attorney
| Variable | Interview Question | Example |
|---|---|---|
| `{{attorney_name}}` | Attorney's full name | Jane Doe, Esq. |
| `{{attorney_address}}` | Attorney's full address | 11 Park Place, Suite 600, New York, NY 10007 |
| `{{attorney_address_line1}}` | Attorney street | 11 Park Place, Suite 600 |
| `{{attorney_address_line2}}` | Attorney city/state/zip | New York, NY 10007 |
| `{{attorney_phone}}` | Attorney phone | 212-233-1033 |
| `{{attorney_fax}}` | Attorney fax | 212-233-1034 |
| `{{attorney_bar_number}}` | Attorney Registration No. | 1234567 |

### Marriage & Case Info
| Variable | Interview Question | Example |
|---|---|---|
| `{{marriage_date}}` | "Enter the date of the marriage" | January 1, 2010 |
| `{{marriage_location}}` | "Enter where the parties were married" | City of New York, County of Kings, State of New York |
| `{{court_county}}` | "Where will the papers be filed" | New York |
| `{{index_number}}` | "Enter the Index Number" | 2026-123456 |
| `{{filing_date}}` | Date complaint is signed | May 15, 2026 |
| `{{filing_month}}` | Month complaint signed | May |
| `{{stipulation_date}}` | Date stipulation executed | May 15, 2026 |

### Service of Process
| Variable | Used In | Example |
|---|---|---|
| `{{server_name}}` | Affidavit of Service forms | Jane Doe |
| `{{server_address}}` | Affidavit of Service forms | 789 Broadway, New York, NY |
| `{{service_date}}` | Date papers were served | May 16, 2026 |

### Case Characteristics (drives conditional logic)
| Variable | Interview Question | Values |
|---|---|---|
| `{{plaintiff_type}}` | "Who is to bring the action" | wife / husband / same-sex-female / same-sex-male |
| `{{defendant_consent}}` | "The Defendant probably will..." | consent / default / contest |
| `{{grounds}}` | "What are the grounds" | no-fault / separation-agreement / etc. |
| `{{residency_basis}}` | Residency requirement | 2yr-plaintiff / married-in-ny / etc. |
| `{{venue_basis}}` | Basis of venue | plaintiff-resides / defendant-resides |
| `{{number_of_children}}` | "How many children" | 0 / 1 / 2 / etc. |
| `{{has_stipulation}}` | "Will a stipulation be executed?" | yes / no |
| `{{defendant_military}}` | "Is the Defendant in military service?" | yes / no |
| `{{plaintiff_employed}}` | "Is the Plaintiff currently employed?" | yes / no |
| `{{defendant_employed}}` | "Is the Defendant currently employed?" | yes / no |
| `{{maintenance_type}}` | "Re: maintenance" | husband-pays / wife-pays / none |

### Health Plans
| Variable | Form | Example |
|---|---|---|
| `{{plaintiff_health_plan}}` | UD-2, UD-6, UD-10 | Blue Cross / NOT APPLICABLE |
| `{{defendant_health_plan}}` | UD-2, UD-6, UD-10 | Aetna / NOT APPLICABLE |

---

## Forms Reference

| File | Form | Title |
|---|---|---|
| `UD-1_Summons_with_Notice.docx` | UD-1 | Summons with Notice |
| `UD-2_Verified_Complaint.docx` | UD-2 | Verified Complaint |
| `UD-5_Affirmation_of_Regularity.docx` | UD-5 | Affirmation of Regularity |
| `UD-6_Affidavit_of_Plaintiff.docx` | UD-6 | Affidavit of Plaintiff |
| `UD-7_Affidavit_of_Defendant.docx` | UD-7 | Affidavit of Defendant |
| `UD-8-1_Annual_Income_Worksheet.docx` | UD-8(1) | Annual Income Worksheet |
| `UD-8-2_Maintenance_Guidelines_Worksheet.docx` | UD-8(2) | Maintenance Guidelines Worksheet |
| `UD-9_Notice_of_Automatic_Orders.docx` | UD-9 | Notice of Automatic Orders |
| `UD-10_Findings_of_Fact_and_Conclusions_of_Law.docx` | UD-10 | Findings of Fact & Conclusions of Law |
| `UD-11_Judgment_of_Divorce.docx` | UD-11 | Judgment of Divorce |
| `UD-13_Request_for_Judicial_Intervention.docx` | UD-13 | Request for Judicial Intervention |
| `UD-14_Notice_of_Entry.docx` | UD-14 | Notice of Entry |
| `UD-15_Stipulation_of_Settlement.docx` | UD-15 | Stipulation of Settlement |

---

## How Document Generation Works (for devs)

1. User completes the intake form in the app → answers stored in Supabase
2. On "Generate Documents" → app fetches the user's answers
3. For each form, use **docxtemplater**:
   ```js
   import Docxtemplater from 'docxtemplater';
   import PizZip from 'pizzip';
   
   const zip = new PizZip(templateFileBuffer);
   const doc = new Docxtemplater(zip);
   doc.setData({
     plaintiff_name: "Mary Smith",
     defendant_name: "Robert Jones",
     marriage_date: "January 1, 2010",
     // ... all other variables
   });
   doc.render();
   const output = doc.getZip().generate({ type: 'blob' });
   ```
4. Output is a filled `.docx` ready for download
