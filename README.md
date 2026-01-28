# 📚 Knowledge Collector

אפליקציית PWA לאיסוף ידע אישי בלחיצה אחת מהמובייל.

![Version](https://img.shields.io/badge/version-1.0.0-green)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)

## ✨ מה זה?

Knowledge Collector היא אפליקציה פשוטה שמאפשרת לך:
- **לשתף לינק** מכל אפליקציה במובייל
- **לקבל ניתוח AI** אוטומטי (תקציר, תגיות, מקור)
- **לחפש ולסנן** את הידע שאספת

**Zero friction** - בלי טפסים, בלי בחירות, בלי סיסמאות.

## 🚀 התקנה מהירה

### 1. Clone & Install
```bash
git clone <your-repo>
cd knowledge-collector
npm install
```

### 2. Supabase Setup
1. צור פרויקט חדש ב-[Supabase](https://supabase.com)
2. לך ל-SQL Editor והרץ את `supabase/schema.sql`
3. העתק את ה-URL וה-Keys מ-Settings > API

### 3. Claude API
1. קבל API Key מ-[Anthropic Console](https://console.anthropic.com)

### 4. Environment Variables
צור קובץ `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ANTHROPIC_API_KEY=your_claude_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Run
```bash
npm run dev
```

פתח [http://localhost:3000](http://localhost:3000)

## 📱 התקנת PWA

### Android
1. פתח את האפליקציה ב-Chrome
2. לחץ על ⋮ (תפריט) > "Add to Home screen"
3. עכשיו תוכל לשתף לינקים ישירות לאפליקציה!

### iOS
1. פתח את האפליקציה ב-Safari
2. לחץ על כפתור Share > "Add to Home Screen"
3. Share Sheet יעבוד אחרי ההתקנה

## 🏗️ מבנה הפרויקט

```
knowledge-collector/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── save/route.ts      # שמירת פריט חדש
│   │   │   ├── items/route.ts     # רשימת פריטים
│   │   │   ├── items/[id]/route.ts # פריט בודד
│   │   │   ├── tags/route.ts      # תגיות
│   │   │   └── platforms/route.ts # פלטפורמות
│   │   ├── share/page.tsx         # מסך שמירה
│   │   ├── item/[id]/page.tsx     # מסך פרטים
│   │   ├── page.tsx               # ספריה (Home)
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui.tsx                 # UI Components
│   │   ├── FilterOverlay.tsx      # סינון
│   │   └── Providers.tsx          # React Query
│   ├── hooks/
│   │   ├── useKnowledge.ts        # Data hooks
│   │   └── useInView.ts           # Infinite scroll
│   ├── lib/
│   │   ├── supabase.ts            # Supabase client
│   │   └── ai.ts                  # Claude AI processing
│   └── types/
│       └── index.ts               # TypeScript types
├── public/
│   ├── manifest.json              # PWA manifest
│   └── icons/                     # App icons
├── supabase/
│   └── schema.sql                 # Database schema
└── docs/
    └── ARCHITECTURE.md            # System design
```

## 🔌 API Endpoints

| Method | Endpoint | תיאור |
|--------|----------|--------|
| `POST` | `/api/save` | שמירת URL חדש + עיבוד AI |
| `GET` | `/api/items` | רשימת פריטים עם חיפוש וסינון |
| `GET` | `/api/items/[id]` | פריט בודד |
| `GET` | `/api/tags` | כל התגיות |
| `GET` | `/api/platforms` | כל הפלטפורמות |

### דוגמת שימוש

```javascript
// שמירת לינק
const response = await fetch('/api/save', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ url: 'https://youtube.com/...' })
});

// חיפוש
const items = await fetch('/api/items?search=AI&tags=יזמות&page=1');
```

## 🤖 AI Processing

ה-Pipeline של עיבוד AI:

1. **Fetch URL** - מביא את תוכן הדף
2. **Detect Platform** - מזהה את הפלטפורמה (YouTube, Twitter, etc.)
3. **Claude Analysis** - מנתח ומחלץ:
   - כותרת (עד 60 תווים)
   - תקציר (2-3 משפטים)
   - 3 תגיות רלוונטיות
   - מקור (שם הכותב/ערוץ)
   - סוג תוכן (article/video/audio/post)

## 🎨 עיצוב

- **Mobile First** - מותאם למובייל
- **Dark Theme** - נוח לעיניים
- **RTL Support** - תמיכה מלאה בעברית
- **Glass Morphism** - אפקטי זכוכית מודרניים

## 🔐 אבטחה (MVP)

- משתמש יחיד - ללא אימות
- API Keys מוסתרים בצד השרת
- CORS מוגבל

## 📦 Production Deployment

### Vercel (מומלץ)
```bash
npm i -g vercel
vercel
```

### Environment Variables בפרודקשן
הוסף את כל המשתנים מ-`.env.local` ב-Vercel Dashboard.

## 🛠️ פיתוח עתידי

- [ ] מחיקת פריטים
- [ ] עריכת תגיות
- [ ] ייצוא לNotion/Obsidian
- [ ] תמיכה במספר משתמשים
- [ ] Sync בין מכשירים

## 📝 License

MIT

---

Built with ❤️ using Next.js, Supabase & Claude AI
