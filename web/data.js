// Signal AI Demo — Data Layer
// Extracted from signal-demo Python outputs (March 2026)

const DEMO_DATA = {

  // =========================================================
  // UC1: Meeting Prep — NovaTech Solutions
  // Story: CSM walks into renewal meeting blind
  // =========================================================
  meetingPrep: {
    account: "NovaTech Solutions",
    segment: "Enterprise",
    industry: "Technology",
    contract: "$80,000",
    renewal: "24.4.2026",
    daysToRenewal: 51,
    csm: "Yoni Cohen",
    owner: "Dana Levy",

    contacts: [
      { name: "Avi Barak", title: "VP Customer Success", email: "avi.barak@novatech.com" },
      { name: "Dina Raz", title: "Head of IT", email: "dina.raz@novatech.com" },
      { name: "Oren Tamir", title: "CEO", email: "oren.tamir@novatech.com" },
      { name: "Noa Peretz", title: "Product Manager", email: "noa.peretz@novatech.com" }
    ],

    opportunities: [
      { name: "NovaTech - Renewal 2026", stage: "Negotiation", amount: "$80,000", close: "24.4.2026", prob: "60%", next: "לתאם שיחה עם ה-CEO לפני החידוש" },
      { name: "NovaTech - Analytics Add-on", stage: "Qualification", amount: "$45,000", close: "1.6.2026", prob: "20%", next: "הלקוח ביקש דמו, צריך לתאם" }
    ],

    cases: [
      { subject: "תקלה באינטגרציה עם מערכת ERP חיצונית — כמה מחלקות חסומות", priority: "Critical", status: "Open", opened: "28.2.2026" },
      { subject: "בקשה לגישת API למערכת BI", priority: "Medium", status: "In Progress", opened: "20.2.2026" }
    ],

    recentActivity: [
      { date: "15.2.2026", type: "call", who: "Yoni Cohen", subject: "שיחת סטטוס רבעונית", summary: "שיחה טובה עם אבי (VP CS). שביעות רצון גבוהה. אורן (CEO) שואל שאלות על ROI לפני החידוש." },
      { date: "20.2.2026", type: "email", who: "Dana Levy", subject: "שליחת הצעת חידוש", summary: "שלחתי הצעת חידוש לאבי ולאורן. מחכים לתגובה." },
      { date: "28.2.2026", type: "email", who: "Oren Rosen", subject: "תגובה לטיקט — תקלת אינטגרציה ERP", summary: "דינה כתבה: 'בלי האינטגרציה הזו 3 מחלקות עסקיות לא ב-100%, זה לא יכול לחכות'. נשמעת מאוד מתוסכלת." }
    ],

    blindSpots: [
      { icon: "🔴", text: "טיקט Critical פתוח 3 ימים — 3 מחלקות חסומות", detail: "דינה (Head of IT) מתוסכלת. כתבה: 'זה לא יכול לחכות'" },
      { icon: "📧", text: "מייל אחרון מהלקוח לא נענה 3 ימים", detail: "אבי (VP CS) ביקש עדכון על פיצ'ר X" },
      { icon: "👥", text: "Dana שלחה הצעת חידוש — יוני לא יודע", detail: "אורן (Support) ענה על טיקט — גם הוא לא מתואם" },
      { icon: "💰", text: "CEO שואל שאלות ROI לפני חידוש", detail: "אורן תמיר (CEO) רוצה לראות מספרים" }
    ],

    signal: {
      type: "Pre-Meeting Risk Alert",
      emoji: "⚠️",
      to: "Yoni Cohen",
      channel: "whatsapp",
      when: "בוקר הפגישה",
      message: {
        title: "Signal AI — הכנה לפגישה עם NovaTech Solutions",
        lines: [
          { icon: "💰", text: "חוזה: $80K | חידוש: 51 ימים" },
          { icon: "⚠️", text: "2 טיקטים פתוחים (אחד Critical)" },
          { icon: "📧", text: "המייל האחרון: לקוח ביקש עדכון על פיצ'ר X (לפני 3 ימים, לא נענה)" },
          { icon: "👥", text: "גם Dana ו-Oren היו בקשר עם הלקוח השבוע" },
          { icon: "💡", text: "המלצה: תתאם עם Dana לפני הפגישה. הלקוח מחכה לתשובה." }
        ]
      }
    },

    impact: {
      before: "יוני נכנס לפגישת חידוש בלי לדעת על טיקט Critical, מייל שלא נענה, והצעה שכבר נשלחה",
      after: "יוני מוכן: יודע על הטיקט, מתואם עם Dana, מגיע עם תשובות",
      metric: "$80K",
      metricLabel: "חידוש בסיכון — עכשיו מוגן"
    }
  },

  // =========================================================
  // UC2: Collision Detection — BlueWave Systems
  // Story: 3 people contact the same customer, uncoordinated
  // =========================================================
  collision: {
    account: "BlueWave Systems",
    segment: "Mid-Market",
    contract: "$95,000",

    people: [
      {
        name: "Shira Friedman",
        role: "CS",
        color: "#3b82f6",
        actions: [
          { date: "2.3.2026", type: "meeting", text: "פגישת סטטוס עם Keren (VP Ops)", detail: "מתוסכלת — הדוחות לא עובדים. ציינה 'מישהו מצוות מכירות שלכם גם דיבר איתנו'" }
        ]
      },
      {
        name: "Roi Shapira",
        role: "Sales",
        color: "#f59e0b",
        actions: [
          { date: "1.3.2026", type: "call", text: "שיחה עם Eyal (CTO) על שדרוג", detail: "לא יודע ששירה כבר דיברה עם קרן ומיכל שלחה הצעה לגל" }
        ]
      },
      {
        name: "Michal Katz",
        role: "Sales",
        color: "#ef4444",
        actions: [
          { date: "3.3.2026", type: "email", text: "שלחה הצעת מחיר ל-Gal (CFO)", detail: "לא ידעה שרועי כבר דיבר עם אייל על שדרוג" }
        ]
      }
    ],

    customerNoticed: true,
    customerQuote: "מישהו מצוות מכירות שלכם גם דיבר איתנו",

    signal: {
      type: "Collision Alert",
      emoji: "🤝",
      to: "Shira, Roi, Michal + Manager",
      channel: "email",
      message: {
        title: "Signal AI — Collision Alert: BlueWave Systems",
        lines: [
          { icon: "👤", text: "Shira (CS) — פגישת סטטוס עם VP Ops" },
          { icon: "👤", text: "Roi (Sales) — שיחה עם CTO על שדרוג" },
          { icon: "👤", text: "Michal (Sales) — שלחה הצעת מחיר ל-CFO" },
          { icon: "⚠️", text: "הם לא מתואמים. הלקוח כבר שם לב." },
          { icon: "💡", text: "המלצה: תאמו מסרים לפני הקשר הבא." }
        ]
      }
    },

    impact: {
      before: "3 אנשים יוצרים קשר עם אותו לקוח באותו שבוע. הלקוח מבחין בחוסר התיאום.",
      after: "כולם יודעים מה קרה, מתאמים מסרים, ממנים נקודת קשר אחת",
      metric: "$95K",
      metricLabel: "חשבון במקום מביך — עכשיו מתואם"
    }
  },

  // =========================================================
  // UC3: Risk Signal — Meridian Data
  // Story: The Ghost — customer went silent, nobody noticed
  // =========================================================
  risk: {
    account: "Meridian Data",
    segment: "SMB",
    industry: "Healthcare",
    contract: "$45,000",
    renewal: "10.7.2026",
    daysToRenewal: 128,
    csm: "Tal Avraham",

    riskScore: 100,
    riskLevel: "CRITICAL",

    signals: [
      { icon: "😤", type: "NEGATIVE SENTIMENT", date: "5.1.2026", text: "שיחה קצרה עם שי. אמר שהם עסוקים, יחזור אליי. לא חזר." },
      { icon: "😤", type: "NEGATIVE SENTIMENT", date: "15.1.2026", text: "התקשרתי, אין מענה. השארתי הודעה." },
      { icon: "😤", type: "NEGATIVE SENTIMENT", date: "20.1.2026", text: "שלחתי מייל: 'שי, מנסה לתפוס אותך'. אין תגובה." },
      { icon: "📉", type: "GOING QUIET", date: null, text: "42 ימים ללא פעילות (מאז 20.1.2026)" },
      { icon: "📭", type: "REPEATED NO-RESPONSE", date: null, text: "3 ניסיונות קשר ללא מענה" },
      { icon: "📊", type: "LOW PROBABILITY", date: null, text: "הזדמנות חידוש ב-40% בלבד" }
    ],

    scoreBreakdown: [
      { label: "Ghost account (42 days)", points: 35 },
      { label: "3 unanswered attempts", points: 25 },
      { label: "Negative sentiment (x3)", points: 20 },
      { label: "Low renewal probability", points: 20 }
    ],

    signal: {
      type: "Churn Risk Alert",
      emoji: "🚨",
      to: "Tal Avraham (CSM) + VP CS",
      channel: "teams",
      message: {
        title: "Signal AI — Risk Alert: Meridian Data",
        lines: [
          { icon: "🚨", text: "Risk Score: 100/100 — CRITICAL" },
          { icon: "💰", text: "$45,000 | חידוש: 128 ימים" },
          { icon: "📉", text: "42 ימים ללא פעילות" },
          { icon: "📭", text: "3 ניסיונות קשר — אף תגובה" },
          { icon: "💡", text: "המלצה: פנייה מיידית של CSM + מנהל. הלקוח בסיכון churn." }
        ]
      }
    },

    impact: {
      before: "אף אחד לא שם לב שהלקוח נעלם. ה-CSM ניסה 3 פעמים ועצר. אין אסקלציה.",
      after: "Signal AI תופס את הדפוס, מעלה את הציון ל-100, ודוחף התרעה ל-CSM + הנהלה",
      metric: "$45K",
      metricLabel: "churn שנתפס לפני שנגמר"
    }
  },

  // =========================================================
  // UC4: Sales Intelligence — Apex Industries
  // Story: AE knows 2/7 decision makers, CS has all the intel
  // =========================================================
  salesIntel: {
    account: "Apex Industries",
    segment: "Strategic",
    industry: "Manufacturing",
    contract: "$350,000",
    expansion: "$200,000",
    renewal: "1.7.2026",
    ae: "Eran Ben-David",
    csm: "Dana Levy",

    contacts: [
      { name: "Rami Ben-David", title: "CEO", role: "Economic Buyer", icon: "💰", aeKnows: true, lastContact: "27.2" },
      { name: "Noam Carmel", title: "CTO", role: "Technical Validator", icon: "🔧", aeKnows: true, lastContact: "3.3" },
      { name: "Amir Dror", title: "VP Manufacturing — East Division", role: "Division Decision", icon: "🏭", aeKnows: false },
      { name: "Ido Katz", title: "Director of Operations", role: "Operational Champion", icon: "🏗️", aeKnows: false },
      { name: "Shiri Goldstein", title: "VP CS", role: "User Champion", icon: "👥", aeKnows: false },
      { name: "Tali Ben-Ari", title: "Procurement Manager", role: "Process Gatekeeper", icon: "📋", aeKnows: false },
      { name: "Yael Friedman", title: "CFO", role: "Financial Approver", icon: "💵", aeKnows: false }
    ],

    hiddenIntel: [
      { type: "COMPETITOR", icon: "🚨", source: "Dana Levy", date: "20.2.2026", text: "אידו הזכיר: 'אנחנו גם מסתכלים על מתחרה — הם הציעו POC חינם לחטיבה החדשה'" },
      { type: "EXPANSION", icon: "📈", source: "Dana Levy", date: "24.2.2026", text: "אמיר דרור (VP חטיבה מזרח) התקשר בעצמו. שאל שאלות מפורטות. 'אני צריך להבין אם זה מתאים לנו'" },
      { type: "BUDGET", icon: "⏰", source: "Dana Levy", date: "26.2.2026", text: "יעל (CFO): 'תקציב ההרחבה מאושר ברמת הדירקטוריון. שחרור באפריל. חייב להיסגר עד סוף מרץ על הנייר'" },
      { type: "CHAMPION", icon: "🦸", source: "Dana Levy", date: "28.2.2026", text: "אידו כבר השתמש במוצר להדגים לצוות חטיבה מזרח. 'הם רואים מה אנחנו עושים ורוצים את אותו דבר'" },
      { type: "COMPETITOR", icon: "🚨", source: "Shira Friedman", date: "2.3.2026", text: "אמיר ציין: 'בודקים גם פתרונות אחרים'. ביקש מידע על תמיכה במפעלי ייצור" }
    ],

    signal: {
      type: "Pre-Visit Intelligence Alert",
      emoji: "🔎",
      to: "Eran Ben-David (AE)",
      channel: "slack",
      message: {
        title: "Signal AI — Intel Brief: Apex Industries",
        lines: [
          { icon: "📊", text: "אתה מכיר 2/7 מקבלי החלטות" },
          { icon: "🚨", text: "איום מתחרה: POC חינם לחטיבה החדשה" },
          { icon: "⏰", text: "חלון תקציב: חייב להיסגר עד סוף מרץ" },
          { icon: "🦸", text: "Champion פנימי: אידו (Dir Ops) דוחף בשבילך" },
          { icon: "💡", text: "המלצה: בקש intro מ-Dana לאמיר דרור. הגע עם הצעת POC משלך." }
        ]
      }
    },

    impact: {
      before: "AE מגיע לביקור ומכיר רק 2 מתוך 7 מקבלי החלטות. לא יודע על המתחרה, התקציב, או ה-Champion",
      after: "AE מגיע מוכן: יודע מי ה-Champion, מה האיום, מתי חלון התקציב נסגר",
      metric: "$550K",
      metricLabel: "חידוש $350K + הרחבה $200K — ה-AE עכשיו מוכן"
    }
  }
};
