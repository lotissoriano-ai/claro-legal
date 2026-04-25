import { useState } from "react";

// ── Spanish UI Sections & Questions ──────────────────────────────────────────
const SECTIONS = [
  {
    id: "plaintiff",
    title: "Su Información",
    subtitle: "La persona que solicita el divorcio (Demandante)",
    icon: "👤",
    fields: [
      { id: "p_first", label: "Nombre", type: "text", required: true },
      { id: "p_middle", label: "Segundo Nombre", type: "text" },
      { id: "p_last", label: "Apellido", type: "text", required: true },
      { id: "p_maiden", label: "Apellido de Soltera/o (si aplica)", type: "text" },
      { id: "p_address", label: "Dirección", type: "text", required: true },
      { id: "p_city", label: "Ciudad", type: "text", required: true },
      { id: "p_state", label: "Estado", type: "text", required: true, defaultValue: "New York" },
      { id: "p_zip", label: "Código Postal", type: "text", required: true },
      { id: "p_county", label: "Condado", type: "text", required: true, hint: "El condado donde presentará el caso" },
      { id: "p_phone", label: "Número de Teléfono", type: "tel" },
      { id: "p_email", label: "Correo Electrónico", type: "email" },
      { id: "p_dob", label: "Fecha de Nacimiento", type: "date", required: true },
      { id: "p_ssn_last4", label: "Últimos 4 dígitos del Seguro Social", type: "text", hint: "Solo se usa para registros del tribunal" },
    ],
  },
  {
    id: "defendant",
    title: "Información del Cónyuge",
    subtitle: "El otro cónyuge (Demandado/a)",
    icon: "👤",
    fields: [
      { id: "d_first", label: "Nombre", type: "text", required: true },
      { id: "d_middle", label: "Segundo Nombre", type: "text" },
      { id: "d_last", label: "Apellido", type: "text", required: true },
      { id: "d_maiden", label: "Apellido de Soltera/o (si aplica)", type: "text" },
      { id: "d_address", label: "Dirección", type: "text", required: true },
      { id: "d_city", label: "Ciudad", type: "text", required: true },
      { id: "d_state", label: "Estado", type: "text", required: true },
      { id: "d_zip", label: "Código Postal", type: "text", required: true },
      { id: "d_phone", label: "Número de Teléfono", type: "tel" },
      { id: "d_dob", label: "Fecha de Nacimiento", type: "date" },
    ],
  },
  {
    id: "marriage",
    title: "Detalles del Matrimonio",
    subtitle: "Información sobre su matrimonio",
    icon: "💍",
    fields: [
      { id: "m_date", label: "Fecha del Matrimonio", type: "date", required: true },
      { id: "m_city", label: "Ciudad donde se casaron", type: "text", required: true },
      { id: "m_state", label: "Estado/País donde se casaron", type: "text", required: true },
      { id: "m_type", label: "Tipo de Ceremonia", type: "select", required: true,
        options: ["Civil (Alcaldía/Tribunal)", "Religiosa", "Otra"],
        englishOptions: ["Civil (City Hall/Court)", "Religious", "Other"] },
      { id: "sep_date", label: "Fecha de Separación", type: "date", required: true,
        hint: "La fecha en que dejaron de vivir juntos como pareja" },
      { id: "ny_resident_years", label: "¿Cuánto tiempo ha vivido en Nueva York?", type: "select", required: true,
        options: ["Menos de 1 año", "1–2 años", "Más de 2 años (todo el matrimonio)", "Más de 2 años antes de la demanda"],
        englishOptions: ["Less than 1 year", "1–2 years", "2+ years (entire marriage)", "2+ years before action commenced"] },
      { id: "ground", label: "Motivo del Divorcio", type: "select", required: true,
        options: ["Ruptura irreparable del matrimonio por al menos 6 meses (DRL §170(7)) — más común"],
        englishOptions: ["Irretrievable breakdown of the marriage for at least 6 months (DRL §170(7)) — most common"] },
    ],
  },
  {
    id: "children",
    title: "Hijos",
    subtitle: "Información sobre hijos menores de edad",
    icon: "👶",
    fields: [
      { id: "has_children", label: "¿Tienen hijos menores de edad juntos?", type: "radio", required: true,
        options: ["Sí", "No"], englishOptions: ["Yes", "No"] },
      { id: "num_children", label: "Número de hijos", type: "number", showIf: { id: "has_children", value: "Sí" } },
      { id: "child1_name", label: "Hijo 1 — Nombre Completo", type: "text", showIf: { id: "has_children", value: "Sí" } },
      { id: "child1_dob", label: "Hijo 1 — Fecha de Nacimiento", type: "date", showIf: { id: "has_children", value: "Sí" } },
      { id: "child2_name", label: "Hijo 2 — Nombre Completo (si aplica)", type: "text", showIf: { id: "has_children", value: "Sí" } },
      { id: "child2_dob", label: "Hijo 2 — Fecha de Nacimiento", type: "date", showIf: { id: "has_children", value: "Sí" } },
      { id: "child3_name", label: "Hijo 3 — Nombre Completo (si aplica)", type: "text", showIf: { id: "has_children", value: "Sí" } },
      { id: "child3_dob", label: "Hijo 3 — Fecha de Nacimiento", type: "date", showIf: { id: "has_children", value: "Sí" } },
      { id: "custody", label: "Acuerdo de Custodia", type: "select", showIf: { id: "has_children", value: "Sí" },
        options: ["El Demandante tiene custodia exclusiva", "El Demandado tiene custodia exclusiva", "Custodia compartida"],
        englishOptions: ["Plaintiff has sole custody", "Defendant has sole custody", "Joint custody"] },
      { id: "primary_residence", label: "Los hijos viven principalmente con", type: "select", showIf: { id: "has_children", value: "Sí" },
        options: ["El Demandante", "El Demandado", "Dividido por igual"],
        englishOptions: ["Plaintiff", "Defendant", "Split equally"] },
    ],
  },
  {
    id: "support",
    title: "Manutención de los Hijos",
    subtitle: "Apoyo económico para los hijos menores",
    icon: "💰",
    fields: [
      { id: "p_income", label: "Su Ingreso Bruto Anual ($)", type: "number", showIf: { id: "has_children", value: "Sí" },
        hint: "De su declaración de impuestos más reciente" },
      { id: "d_income", label: "Ingreso Bruto Anual de su Cónyuge ($)", type: "number", showIf: { id: "has_children", value: "Sí" } },
      { id: "support_payer", label: "¿Quién pagará la manutención?", type: "select", showIf: { id: "has_children", value: "Sí" },
        options: ["El Demandante le paga al Demandado", "El Demandado le paga al Demandante", "Sin manutención (explicar en notas)"],
        englishOptions: ["Plaintiff pays Defendant", "Defendant pays Plaintiff", "No child support (explain in notes)"] },
      { id: "support_amount", label: "Monto Mensual Acordado ($)", type: "number",
        showIf: { id: "has_children", value: "Sí" }, hint: "Deje en blanco para usar la fórmula NY CSSA" },
      { id: "health_insurance", label: "¿Quién proporciona seguro médico a los hijos?", type: "select",
        showIf: { id: "has_children", value: "Sí" },
        options: ["El Demandante", "El Demandado", "Ambos / Plan conjunto", "Los hijos tienen Medicaid/CHIP"],
        englishOptions: ["Plaintiff", "Defendant", "Both / Joint plan", "Children covered by Medicaid/CHIP"] },
    ],
  },
  {
    id: "property",
    title: "Bienes y Activos",
    subtitle: "División de los bienes matrimoniales",
    icon: "🏠",
    fields: [
      { id: "has_real_estate", label: "¿Son dueños de bienes raíces juntos?", type: "radio",
        options: ["Sí", "No"], englishOptions: ["Yes", "No"], required: true },
      { id: "real_estate_address", label: "Dirección de la Propiedad", type: "text", showIf: { id: "has_real_estate", value: "Sí" } },
      { id: "real_estate_disposition", label: "¿Qué pasará con la propiedad?", type: "select",
        showIf: { id: "has_real_estate", value: "Sí" },
        options: ["El Demandante la conserva", "El Demandado la conserva", "Vender y dividir las ganancias", "Otro acuerdo"],
        englishOptions: ["Plaintiff keeps it", "Defendant keeps it", "Sell and split proceeds", "Other arrangement"] },
      { id: "has_pension", label: "¿Alguno tiene pensión o cuenta de jubilación?", type: "radio",
        options: ["Sí", "No"], englishOptions: ["Yes", "No"], required: true },
      { id: "pension_details", label: "Detalles de la Pensión/Jubilación", type: "textarea",
        showIf: { id: "has_pension", value: "Sí" },
        hint: "Describa la(s) cuenta(s) y cómo se dividirán. Puede requerirse un QDRO." },
      { id: "other_assets", label: "Otros bienes a dividir (opcional)", type: "textarea",
        hint: "Ej: vehículos, cuentas bancarias, inversiones, negocios" },
      { id: "debt_division", label: "¿Cómo se dividirán las deudas? (opcional)", type: "textarea" },
    ],
  },
  {
    id: "spousal",
    title: "Manutención Conyugal",
    subtitle: "También conocida como pensión alimenticia (alimony)",
    icon: "⚖️",
    fields: [
      { id: "maintenance", label: "¿Alguno de los cónyuges recibirá manutención conyugal?", type: "radio",
        options: ["Sí", "No"], englishOptions: ["Yes", "No"], required: true },
      { id: "maintenance_recipient", label: "¿Quién recibe la manutención?", type: "select",
        showIf: { id: "maintenance", value: "Sí" },
        options: ["El Demandante recibe del Demandado", "El Demandado recibe del Demandante"],
        englishOptions: ["Plaintiff receives from Defendant", "Defendant receives from Plaintiff"] },
      { id: "maintenance_amount", label: "Monto mensual ($)", type: "number", showIf: { id: "maintenance", value: "Sí" } },
      { id: "maintenance_duration", label: "Duración", type: "select",
        showIf: { id: "maintenance", value: "Sí" },
        options: ["1 año", "2 años", "3 años", "5 años", "Hasta nuevo matrimonio o fallecimiento", "Otro"],
        englishOptions: ["1 year", "2 years", "3 years", "5 years", "Until remarriage or death", "Other"] },
    ],
  },
  {
    id: "misc",
    title: "Detalles Finales",
    subtitle: "Cambio de nombre y notas adicionales",
    icon: "✏️",
    fields: [
      { id: "name_change", label: "¿Desea recuperar su apellido anterior?", type: "radio",
        options: ["Sí", "No"], englishOptions: ["Yes", "No"], required: true },
      { id: "former_name", label: "Nombre a recuperar", type: "text", showIf: { id: "name_change", value: "Sí" } },
      { id: "index_number", label: "Número de Índice del Tribunal (si ya fue asignado)", type: "text",
        hint: "Déjelo en blanco si aún no ha sido asignado" },
      { id: "notes", label: "Notas adicionales o circunstancias especiales", type: "textarea" },
    ],
  },
];

// ── English value translator (for documents) ──────────────────────────────────
function toEnglish(field, value) {
  if (!value || !field.englishOptions || !field.options) return value;
  const idx = field.options.indexOf(value);
  return idx !== -1 && field.englishOptions[idx] ? field.englishOptions[idx] : value;
}

function buildEnglishData(rawData) {
  const eng = { ...rawData };
  SECTIONS.forEach(section =>
    section.fields.forEach(field => {
      if (rawData[field.id] !== undefined) eng[field.id] = toEnglish(field, rawData[field.id]);
    })
  );
  return eng;
}

// ── Document generation (English output) ─────────────────────────────────────
function generateDoc(docType, rawData) {
  const d = buildEnglishData(rawData);
  const pName = `${d.p_first||""} ${d.p_middle||""} ${d.p_last||""}`.replace(/\s+/g," ").trim();
  const dName = `${d.d_first||""} ${d.d_middle||""} ${d.d_last||""}`.replace(/\s+/g," ").trim();
  const county = d.p_county || "___________";
  const idxNo = d.index_number || "Index No.: ___________";
  const today = new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"});
  const fmt = (v) => v ? new Date(v).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"}) : "___";
  const hr = "─".repeat(60);

  const header = `SUPREME COURT OF THE STATE OF NEW YORK
COUNTY OF ${county.toUpperCase()}
${hr}
${pName},
                                    Plaintiff,
              -against-                                    ${idxNo}

${dName},
                                    Defendant.
${hr}`;

  if (docType==="summons") return `${header}

SUMMONS WITH NOTICE

TO THE ABOVE-NAMED DEFENDANT:

YOU ARE HEREBY SUMMONED to serve a notice of appearance on the Plaintiff within 20 days after service of this Summons (not counting the day of service), or within 30 days if this Summons is not personally delivered to you within the State of New York.

In case of your failure to appear, judgment will be taken against you by default.

NOTICE: This action seeks to dissolve the marriage between the parties on grounds of Irretrievable Breakdown of the Marriage for at least six months pursuant to Domestic Relations Law §170(7).
${d.name_change==="Yes"&&d.former_name?`\nPlaintiff also seeks restoration of former name: ${d.former_name}.`:""}

Dated: ${today}                    County of ${county}, New York

_______________________________
${pName}, Plaintiff Pro Se
${d.p_address||""}
${d.p_city||""}, ${d.p_state||"New York"} ${d.p_zip||""}
Tel: ${d.p_phone||"___"}`;

  if (docType==="complaint") return `${header}

VERIFIED COMPLAINT FOR DIVORCE

Plaintiff ${pName} alleges:

1. PARTIES
   Plaintiff resides at ${d.p_address||"___"}, ${d.p_city||"___"}, New York ${d.p_zip||"___"}.
   Defendant resides at ${d.d_address||"___"}, ${d.d_city||"___"}, ${d.d_state||"___"} ${d.d_zip||"___"}.

2. JURISDICTION
   Plaintiff has resided in New York for ${d.ny_resident_years||"2+ years"}, satisfying DRL §230.

3. MARRIAGE
   The parties were married on ${fmt(d.m_date)} in ${d.m_city||"___"}, ${d.m_state||"___"} (${d.m_type||"civil"} ceremony).

4. SEPARATION
   The parties have lived separate and apart since ${fmt(d.sep_date)}.

5. GROUNDS
   The marriage has broken down irretrievably for at least six months pursuant to DRL §170(7).

6. CHILDREN
   ${d.has_children==="Yes"
     ?`Minor children: ${[d.child1_name,d.child2_name,d.child3_name].filter(Boolean).join("; ")}.`
     :"There are no minor children of this marriage."}

7. RELIEF REQUESTED
   a. Judgment of absolute divorce dissolving the marriage;
   ${d.name_change==="Yes"&&d.former_name?`b. Restoration of Plaintiff's former name: ${d.former_name};`:""}
   ${d.has_children==="Yes"?"c. Custody and child support per Settlement Agreement;":""}
   d. Such other relief as the Court deems just.

Dated: ${today}

_______________________________
${pName}, Plaintiff Pro Se`;

  if (docType==="affidavit") return `${header}

AFFIDAVIT OF PLAINTIFF

STATE OF NEW YORK  )
                   ) ss.:
COUNTY OF ${county.toUpperCase()} )

${pName}, being duly sworn, deposes and says:

1. I am the Plaintiff in this action.
2. I was married to ${dName} on ${fmt(d.m_date)} in ${d.m_city||"___"}, ${d.m_state||"___"}.
3. I am a resident of ${county} County, New York, and have resided in New York for ${d.ny_resident_years||"2+ years"}.
4. The marriage has broken down irretrievably for at least six months. We have lived separate and apart since ${fmt(d.sep_date)}.
5. ${d.has_children==="Yes"
     ?`Minor children of this marriage: ${[d.child1_name,d.child2_name,d.child3_name].filter(Boolean).join(", ")}.`
     :"There are no minor children born of this marriage."}
6. All economic issues have been resolved by a written Settlement Agreement annexed hereto.
7. No other matrimonial action is pending in any court.

WHEREFORE, I respectfully request a Judgment of Divorce be granted.

_______________________________        Sworn before me this
${pName}                               _____ day of __________, 20____

                                       _______________________________
                                       Notary Public`;

  if (docType==="settlement") return `${header}

STIPULATION OF SETTLEMENT AND SEPARATION AGREEMENT

Entered into on ${today} between:
PLAINTIFF: ${pName}, ${d.p_address||"___"}, ${d.p_city||"___"}, NY ${d.p_zip||"___"}
DEFENDANT: ${dName}, ${d.d_address||"___"}, ${d.d_city||"___"}, ${d.d_state||"___"} ${d.d_zip||"___"}

Married on ${fmt(d.m_date)}. The parties agree to resolve all matters as follows:

ARTICLE I — CUSTODY
${d.has_children==="Yes"
  ?`1.1 Children: ${[d.child1_name,d.child2_name,d.child3_name].filter(Boolean).join("; ")}.
1.2 Custody: ${d.custody||"To be determined"}.
1.3 Primary residence with: ${d.primary_residence||"___"}.`
  :"Not applicable — no minor children."}

ARTICLE II — CHILD SUPPORT
${d.has_children==="Yes"
  ?`2.1 ${d.support_payer||"___"} pays child support${d.support_amount?` of $${d.support_amount}/month`:" per NY CSSA formula"}.
2.2 Health insurance maintained by: ${d.health_insurance||"___"}.`
  :"Not applicable — no minor children."}

ARTICLE III — SPOUSAL MAINTENANCE
${d.maintenance==="Yes"
  ?`3.1 ${d.maintenance_recipient||"___"} shall pay $${d.maintenance_amount||"___"}/month.
3.2 Duration: ${d.maintenance_duration||"___"}. Terminates upon remarriage or death.`
  :"3.1 Neither party shall pay spousal maintenance. All claims are waived."}

ARTICLE IV — REAL PROPERTY
${d.has_real_estate==="Yes"
  ?`4.1 Property at ${d.real_estate_address||"___"}: ${d.real_estate_disposition||"___"}.`
  :"4.1 No jointly-owned real property."}

ARTICLE V — RETIREMENT ACCOUNTS
${d.has_pension==="Yes"
  ?`5.1 Retirement assets: ${d.pension_details||"___"}. A QDRO may be required.`
  :"5.1 No retirement accounts subject to division."}

ARTICLE VI — OTHER ASSETS & DEBTS
${d.other_assets?`6.1 Other assets: ${d.other_assets}`:"6.1 All other property divided to mutual satisfaction."}
${d.debt_division?`6.2 Debts: ${d.debt_division}`:"6.2 Each party responsible for debts in their own name."}

ARTICLE VII — GENERAL
7.1 Each party had opportunity to consult independent counsel.
7.2 This Agreement is entire understanding of the parties.
7.3 Incorporated but not merged into any Judgment of Divorce.

_______________________________        _______________________________
${pName}, Plaintiff                    ${dName}, Defendant

Notary: ________________________       Notary: ________________________`;

  if (docType==="childsupport") {
    const pI=parseFloat(d.p_income)||0, dI=parseFloat(d.d_income)||0, comb=pI+dI;
    const n=parseInt(d.num_children)||1;
    const rate={1:0.17,2:0.25,3:0.29,4:0.31,5:0.35}[Math.min(n,5)]||0.35;
    const basic=comb*rate, pS=comb>0?(pI/comb)*basic:0, dS=comb>0?(dI/comb)*basic:0;
    return `${header}

CHILD SUPPORT WORKSHEET (NY CSSA — DRL §240(1-b))

INCOME
  Plaintiff gross income:    $${pI.toLocaleString()}/year  ($${(pI/12).toFixed(2)}/month)
  Defendant gross income:    $${dI.toLocaleString()}/year  ($${(dI/12).toFixed(2)}/month)
  Combined income:           $${comb.toLocaleString()}/year

CALCULATION
  Children: ${n}   |   CSSA Rate: ${(rate*100).toFixed(0)}%   |   Basic Obligation: $${basic.toFixed(2)}/year

PRO-RATA SHARES
  Plaintiff (${comb>0?((pI/comb)*100).toFixed(1):0}%):  $${(pS/12).toFixed(2)}/month
  Defendant (${comb>0?((dI/comb)*100).toFixed(1):0}%):  $${(dS/12).toFixed(2)}/month

ORDER
  Paying parent: ${d.support_payer||"___"}
  ${d.support_amount?`Agreed amount: $${d.support_amount}/month (deviation from CSSA by mutual agreement)`:`CSSA calculated: $${(d.primary_residence==="Plaintiff"?dS:pS).toFixed(2)}/month`}
  Health insurance: ${d.health_insurance||"___"}

Prepared: ${today}`;
  }

  if (docType==="qdro") return `${header}

QUALIFIED DOMESTIC RELATIONS ORDER (QDRO)

Pursuant to Stipulation of Settlement dated ${today}.

PLAN PARTICIPANT: ${pName}
ALTERNATE PAYEE:  ${dName}

PLAN DETAILS:
${d.pension_details||"Plan name and account details to be completed upon receipt of plan information."}

THIS ORDER PROVIDES:
1. The Alternate Payee is assigned a marital share of the Plan Participant's benefits per the Settlement Agreement.
2. Division amount: [To be completed with plan-specific language — obtain from plan administrator].
3. This constitutes a QDRO under IRC §414(p) and ERISA §206(d).
4. The Plan Administrator shall pay benefits directly to the Alternate Payee per this Order.
5. This Order does not require benefits not otherwise provided under the Plan.

IMPORTANT: Obtain plan-specific QDRO language from the plan administrator before submitting.

SO ORDERED:
_______________________________
Justice, Supreme Court, ${county} County     Date: _______________`;

  if (docType==="noteofissue") return `${header}

NOTE OF ISSUE — MATRIMONIAL ACTION

Plaintiff: ${pName}   |   Defendant: ${dName}   |   County: ${county}

This case is certified ready for submission for a Judgment of Divorce (uncontested).

CHECKLIST:
☑  Summons with Notice served
☑  Verified Complaint filed
☑  Affidavit of Plaintiff executed
☑  Stipulation of Settlement signed by both parties
${d.has_children==="Yes"?"☑  Child Support Worksheet completed":"☐  Child Support Worksheet (N/A)"}
${d.has_pension==="Yes"?"☑  QDRO prepared":"☐  QDRO (N/A)"}
☑  Financial disclosure completed

RELIEF: Absolute Divorce pursuant to DRL §170(7).
${d.name_change==="Yes"&&d.former_name?`Name restoration: ${d.former_name}`:""}

Dated: ${today}

_______________________________
${pName}, Plaintiff Pro Se
${d.p_address||""}, ${d.p_city||""}, ${d.p_state||"NY"} ${d.p_zip||""}`;

  return "";
}

// ── Documents list ────────────────────────────────────────────────────────────
const DOCS = [
  { id:"summons",      label:"Citatorio con Aviso",      labelEn:"Summons with Notice",      desc:"Aviso formal al cónyuge de la demanda" },
  { id:"complaint",    label:"Demanda Verificada",        labelEn:"Verified Complaint",        desc:"Motivos y hechos del divorcio" },
  { id:"affidavit",    label:"Declaración Jurada",        labelEn:"Affidavit of Plaintiff",    desc:"Declaración bajo juramento del demandante" },
  { id:"settlement",   label:"Acuerdo de Separación",     labelEn:"Stipulation of Settlement", desc:"Acuerdo sobre todos los asuntos matrimoniales" },
  { id:"childsupport", label:"Hoja de Manutención",       labelEn:"Child Support Worksheet",   desc:"Cálculo NY CSSA (si hay hijos)" },
  { id:"qdro",         label:"Orden QDRO",                labelEn:"QDRO",                      desc:"División de jubilación (si aplica)" },
  { id:"noteofissue",  label:"Nota de Asunto",            labelEn:"Note of Issue",             desc:"Certifica que el caso está listo" },
];

// ── Styles ────────────────────────────────────────────────────────────────────
const navy="#1a1a2e", cream="#f5f3ef", sand="#e0ddd8", muted="#889";
const base = { fontFamily:"'Palatino Linotype','Book Antiqua',Palatino,serif", color:navy };
const card = { background:"#fff", borderRadius:"2px", border:`1px solid ${sand}`, padding:"40px", boxShadow:"0 2px 12px rgba(0,0,0,0.06)" };
const btnP = { background:navy, color:"#fff", border:"none", padding:"12px 32px", borderRadius:"2px", fontSize:"13px", cursor:"pointer", letterSpacing:"0.06em", fontFamily:"inherit", textTransform:"uppercase" };
const btnS = { background:"transparent", color:"#556", border:`1px solid ${sand}`, padding:"12px 24px", borderRadius:"2px", fontSize:"13px", cursor:"pointer", fontFamily:"inherit" };
const inp  = { width:"100%", padding:"10px 14px", border:`1px solid ${sand}`, borderRadius:"2px", fontSize:"15px", fontFamily:"inherit", background:"#fafaf8", outline:"none", boxSizing:"border-box" };

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({});
  const total = SECTIONS.length;

  const update = (id, val) => setData(p => ({ ...p, [id]: val }));
  const visible = (f) => !f.showIf || data[f.showIf.id] === f.showIf.value;
  const progress = step === 0 ? 0 : step > total ? 100 : Math.round((step / (total + 1)) * 100);

  function downloadDoc(docId) {
    const engData = buildEnglishData(data);
    const text = generateDoc(docId, data);
    const doc = DOCS.find(d => d.id === docId);
    const pSlug = `${engData.p_first||"p"}-${engData.p_last||""}`.toLowerCase().replace(/\s+/g,"-");
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${doc.labelEn} — Claro Legal</title>
<style>body{font-family:'Courier New',monospace;font-size:12px;line-height:1.7;max-width:720px;margin:40px auto;padding:0 40px;color:#000}pre{white-space:pre-wrap;word-wrap:break-word}.hd,.ft{text-align:center;font-size:11px;color:#666;padding:10px 0}.hd{border-bottom:1px solid #ccc;margin-bottom:24px}.ft{border-top:1px solid #ccc;margin-top:40px;color:#999}@media print{body{margin:0}}</style>
</head><body><div class="hd">CLARO LEGAL — ${doc.labelEn.toUpperCase()} — BORRADOR / DRAFT</div><pre>${text}</pre><div class="ft">Documento generado por Claro Legal. Solo es un borrador. Revise con un abogado antes de presentar. / Not legal advice.</div></body></html>`;
    const url = URL.createObjectURL(new Blob([html],{type:"text/html"}));
    const a = document.createElement("a"); a.href=url; a.download=`claro-legal-${docId}-${pSlug}.html`; a.click();
    URL.revokeObjectURL(url);
  }

  function downloadAll() {
    const eng = buildEnglishData(data);
    DOCS.forEach((doc,i) => {
      if (doc.id==="childsupport" && eng.has_children!=="Yes") return;
      if (doc.id==="qdro" && eng.has_pension!=="Yes") return;
      setTimeout(()=>downloadDoc(doc.id), i*350);
    });
  }

  const TopBar = ({right}) => (
    <div style={{background:navy,padding:"0 32px",display:"flex",alignItems:"center",justifyContent:"space-between",height:"68px"}}>
      <div style={{display:"flex",flexDirection:"column",justifyContent:"center"}}>
        <span style={{color:cream,fontSize:"20px",fontWeight:"bold",letterSpacing:"0.05em",lineHeight:"1.2"}}>Claro Legal</span>
        <span style={{color:"#c8a882",fontSize:"11px",fontStyle:"italic",letterSpacing:"0.04em",lineHeight:"1.2"}}>By your side for every form. · A tu lado en cada trámite.</span>
      </div>
      {right && <div style={{color:"#667",fontSize:"13px"}}>{right}</div>}
    </div>
  );

  const ProgressBar = () => (
    <div style={{height:"3px",background:"#ddd",borderRadius:"2px",marginBottom:"28px"}}>
      <div style={{height:"100%",width:`${progress}%`,background:navy,borderRadius:"2px",transition:"width 0.4s ease"}}/>
    </div>
  );

  // ── Welcome ─────────────────────────────────────────────────────────────────
  if (step===0) return (
    <div style={{minHeight:"100vh",background:cream,...base}}>
      <TopBar/>
      <div style={{maxWidth:"780px",margin:"0 auto",padding:"48px 24px"}}>
        <div style={{textAlign:"center",marginBottom:"40px"}}>
          <div style={{fontSize:"48px",marginBottom:"16px"}}>⚖️</div>
          <h1 style={{fontSize:"34px",fontWeight:"normal",letterSpacing:"-0.02em",marginBottom:"8px"}}>
            Divorcio No Disputado en Nueva York
          </h1>
          <p style={{fontSize:"18px",color:"#c8a882",fontStyle:"italic",marginBottom:"12px",letterSpacing:"0.02em"}}>
            By your side for every form. · <span style={{color:"#a08060"}}>A tu lado en cada trámite.</span>
          </p>
          <p style={{fontSize:"15px",color:"#667",maxWidth:"520px",margin:"0 auto",lineHeight:"1.8"}}>
            Responda las preguntas en español. Generamos todos los documentos legales en inglés, listos para presentar ante el tribunal.
          </p>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px",marginBottom:"28px"}}>
          <div style={{...card,padding:"24px"}}>
            <div style={{fontSize:"12px",fontWeight:"700",letterSpacing:"0.05em",textTransform:"uppercase",marginBottom:"14px",color:navy}}>📋 Documentos generados</div>
            {DOCS.map(d=>(
              <div key={d.id} style={{display:"flex",gap:"8px",padding:"5px 0",borderBottom:"1px solid #f0ede8",fontSize:"13px"}}>
                <span style={{color:"#88aabb",flexShrink:0}}>✓</span>
                <span><strong>{d.label}</strong><br/><span style={{color:muted,fontSize:"11px",fontStyle:"italic"}}>{d.labelEn}</span></span>
              </div>
            ))}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:"16px"}}>
            <div style={{...card,padding:"20px",borderLeft:`3px solid #88aabb`}}>
              <div style={{fontSize:"13px",fontWeight:"700",marginBottom:"8px"}}>🌐 Cuestionario en Español</div>
              <div style={{fontSize:"13px",color:muted,lineHeight:"1.6"}}>Todas las preguntas y explicaciones están en español para facilitar el proceso.</div>
            </div>
            <div style={{...card,padding:"20px",borderLeft:`3px solid #88bb88`}}>
              <div style={{fontSize:"13px",fontWeight:"700",marginBottom:"8px"}}>📄 Documentos en Inglés</div>
              <div style={{fontSize:"13px",color:muted,lineHeight:"1.6"}}>Los formularios legales se generan en inglés, tal como lo requiere el tribunal de Nueva York.</div>
            </div>
            <div style={{...card,padding:"20px",borderLeft:`3px solid ${navy}`}}>
              <div style={{fontSize:"13px",fontWeight:"700",marginBottom:"8px"}}>💾 Progreso guardado</div>
              <div style={{fontSize:"13px",color:muted,lineHeight:"1.6"}}>Sus respuestas se guardan durante la sesión. Puede navegar entre secciones libremente.</div>
            </div>
          </div>
        </div>

        <div style={{background:"#fff8e8",border:"1px solid #e8d8a0",borderRadius:"2px",padding:"16px",fontSize:"13px",color:"#776644",marginBottom:"28px"}}>
          ⚠️ <strong>Aviso Legal:</strong> Claro Legal genera borradores de documentos solo para fines informativos. No reemplaza el consejo de un abogado licenciado. Revise todos los documentos con un profesional antes de presentarlos ante el tribunal.
        </div>

        <div style={{textAlign:"center"}}>
          <button style={{...btnP,fontSize:"15px",padding:"16px 56px"}} onClick={()=>setStep(1)}>
            Comenzar Cuestionario →
          </button>
        </div>
      </div>
    </div>
  );

  // ── Review ──────────────────────────────────────────────────────────────────
  if (step===total+1) return (
    <div style={{minHeight:"100vh",background:cream,...base}}>
      <TopBar right="Revisión Final"/>
      <div style={{maxWidth:"780px",margin:"0 auto",padding:"40px 24px"}}>
        <ProgressBar/>
        <div style={card}>
          <h2 style={{fontSize:"24px",fontWeight:"normal",marginBottom:"4px"}}>Revise Su Información</h2>
          <p style={{fontSize:"14px",color:muted,marginBottom:"28px",fontStyle:"italic"}}>Confirme los datos antes de generar sus documentos en inglés.</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px 24px",marginBottom:"32px"}}>
            {[
              ["Demandante",`${data.p_first||""} ${data.p_last||""}`.trim()||"—"],
              ["Demandado/a",`${data.d_first||""} ${data.d_last||""}`.trim()||"—"],
              ["Condado", data.p_county||"—"],
              ["Fecha de Matrimonio", data.m_date?new Date(data.m_date).toLocaleDateString("es-US"):"—"],
              ["Fecha de Separación", data.sep_date?new Date(data.sep_date).toLocaleDateString("es-US"):"—"],
              ["Hijos Menores", data.has_children||"—"],
              ["Bienes Raíces", data.has_real_estate||"—"],
              ["Pensión/Jubilación", data.has_pension||"—"],
              ["Manutención Conyugal", data.maintenance||"—"],
              ["Recuperar Nombre", data.name_change==="Sí"?(data.former_name||"Sí"):"No"],
            ].map(([k,v])=>(
              <div key={k} style={{borderBottom:"1px solid #eee",padding:"8px 0"}}>
                <div style={{fontSize:"11px",color:muted,textTransform:"uppercase",letterSpacing:"0.05em"}}>{k}</div>
                <div style={{fontSize:"14px"}}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{display:"flex",justifyContent:"space-between"}}>
            <button style={btnS} onClick={()=>setStep(total)}>← Atrás</button>
            <button style={btnP} onClick={()=>setStep(total+2)}>Generar Documentos →</button>
          </div>
        </div>
      </div>
    </div>
  );

  // ── Documents ───────────────────────────────────────────────────────────────
  if (step===total+2) {
    const eng = buildEnglishData(data);
    return (
      <div style={{minHeight:"100vh",background:cream,...base}}>
        <TopBar right={<span style={{color:"#88bb88"}}>✓ Documentos Listos</span>}/>
        <div style={{maxWidth:"780px",margin:"0 auto",padding:"40px 24px"}}>
          <div style={card}>
            <div style={{textAlign:"center",marginBottom:"28px"}}>
              <div style={{fontSize:"40px",marginBottom:"10px"}}>📄</div>
              <h2 style={{fontSize:"24px",fontWeight:"normal",marginBottom:"6px"}}>Sus Documentos Están Listos</h2>
              <p style={{color:muted,fontStyle:"italic",fontSize:"13px"}}>
                Haga clic para descargar. Abra en su navegador → Archivo → Imprimir → Guardar como PDF para obtener el PDF listo para el tribunal.
              </p>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginBottom:"24px"}}>
              {DOCS.map(doc=>{
                const skip=(doc.id==="childsupport"&&eng.has_children!=="Yes")||(doc.id==="qdro"&&eng.has_pension!=="Yes");
                return (
                  <div key={doc.id}
                    style={{border:`1px solid ${sand}`,borderRadius:"2px",padding:"16px",cursor:skip?"default":"pointer",background:"#fafaf8",opacity:skip?0.4:1,transition:"border-color 0.2s,background 0.2s"}}
                    onClick={()=>!skip&&downloadDoc(doc.id)}
                    onMouseEnter={e=>{if(!skip){e.currentTarget.style.borderColor=navy;e.currentTarget.style.background="#f0ede8";}}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor=sand;e.currentTarget.style.background="#fafaf8";}}>
                    <div style={{fontSize:"14px",fontWeight:"600",marginBottom:"2px"}}>{doc.label}</div>
                    <div style={{fontSize:"11px",color:"#88aabb",fontStyle:"italic",marginBottom:"4px"}}>{doc.labelEn}</div>
                    <div style={{fontSize:"12px",color:muted}}>{skip?"No aplica":doc.desc}</div>
                    {!skip&&<div style={{fontSize:"11px",color:"#88aabb",marginTop:"8px"}}>↓ Descargar</div>}
                  </div>
                );
              })}
            </div>
            <div style={{textAlign:"center",marginBottom:"24px"}}>
              <button style={{...btnP,padding:"14px 40px"}} onClick={downloadAll}>↓ Descargar Todos los Documentos</button>
            </div>
            <div style={{background:"#f8f5f0",border:"1px solid #e8e0d0",borderRadius:"2px",padding:"16px",fontSize:"13px",color:"#665544",marginBottom:"16px"}}>
              <strong>Próximos pasos:</strong> Presente los documentos en la Corte Suprema del Condado de <strong>{data.p_county||"su condado"}</strong>. La tarifa de presentación es $335. Entregue el Citatorio a su cónyuge y presente prueba de notificación. Los documentos deben estar firmados ante un notario antes de presentarlos.
            </div>
            <div style={{textAlign:"center"}}>
              <button style={btnS} onClick={()=>setStep(total+1)}>← Volver a Revisión</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Questionnaire sections ──────────────────────────────────────────────────
  const section = SECTIONS[step-1];
  const fields = section.fields.filter(f=>visible(f));

  return (
    <div style={{minHeight:"100vh",background:cream,...base}}>
      <TopBar right={`Paso ${step} de ${total}`}/>
      <div style={{maxWidth:"780px",margin:"0 auto",padding:"40px 24px"}}>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:"12px",color:muted,marginBottom:"6px"}}>
          <span>{section.icon} {section.title}</span><span>{progress}%</span>
        </div>
        <ProgressBar/>
        <div style={{display:"flex",gap:"6px",marginBottom:"24px"}}>
          {SECTIONS.map((_,i)=>(
            <div key={i} title={SECTIONS[i].title}
              style={{width:"8px",height:"8px",borderRadius:"50%",cursor:"pointer",background:i+1===step?navy:i+1<step?"#88aabb":"#ddd",transition:"background 0.2s"}}
              onClick={()=>setStep(i+1)}/>
          ))}
        </div>

        <div style={card}>
          <h2 style={{fontSize:"24px",fontWeight:"normal",marginBottom:"4px"}}>{section.icon} {section.title}</h2>
          <p style={{fontSize:"14px",color:muted,marginBottom:"32px",fontStyle:"italic"}}>{section.subtitle}</p>

          {fields.map(field=>(
            <div key={field.id} style={{marginBottom:"20px"}}>
              <label style={{display:"block",fontSize:"12px",fontWeight:"600",marginBottom:"6px",color:"#334",letterSpacing:"0.04em",textTransform:"uppercase"}}>
                {field.label}{field.required&&<span style={{color:"#c44"}}> *</span>}
              </label>

              {field.type==="select"&&(
                <select style={{...inp,appearance:"none",cursor:"pointer"}} value={data[field.id]||""} onChange={e=>update(field.id,e.target.value)}>
                  <option value="">— Seleccione —</option>
                  {field.options.map(o=><option key={o} value={o}>{o}</option>)}
                </select>
              )}
              {field.type==="radio"&&(
                <div style={{display:"flex",gap:"20px",flexWrap:"wrap"}}>
                  {field.options.map(o=>(
                    <label key={o} style={{display:"flex",alignItems:"center",gap:"6px",cursor:"pointer",fontSize:"15px"}}>
                      <input type="radio" name={field.id} value={o} checked={data[field.id]===o} onChange={()=>update(field.id,o)}/>
                      {o}
                    </label>
                  ))}
                </div>
              )}
              {field.type==="textarea"&&(
                <textarea style={{...inp,minHeight:"80px",resize:"vertical"}} value={data[field.id]||""} onChange={e=>update(field.id,e.target.value)} placeholder={field.hint||""}/>
              )}
              {["text","number","date","tel","email"].includes(field.type)&&(
                <input type={field.type} style={inp} value={data[field.id]||field.defaultValue||""} onChange={e=>update(field.id,e.target.value)} placeholder={field.hint||""}/>
              )}
              {field.hint&&field.type!=="textarea"&&(
                <div style={{fontSize:"11px",color:"#99a",marginTop:"4px",fontStyle:"italic"}}>{field.hint}</div>
              )}
            </div>
          ))}

          <div style={{display:"flex",justifyContent:"space-between",marginTop:"32px"}}>
            <button style={btnS} onClick={()=>setStep(Math.max(0,step-1))}>
              {step===1?"← Inicio":"← Atrás"}
            </button>
            <button style={btnP} onClick={()=>setStep(step<total?step+1:total+1)}>
              {step===total?"Revisar →":"Continuar →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
