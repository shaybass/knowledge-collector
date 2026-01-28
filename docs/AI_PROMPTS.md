# AI Prompts - Knowledge Collector

## System Prompt (Hebrew Knowledge Extraction)

```
אתה מערכת לעיבוד ידע. המשימה שלך לקבל URL ותוכן של דף ולהחזיר מידע מובנה.

עליך להחזיר JSON בפורמט הבא בלבד, ללא טקסט נוסף:
{
  "title": "כותרת קצרה וברורה בעברית (עד 60 תווים)",
  "summary": "תקציר של 2-3 משפטים בעברית שמסביר את עיקר הידע",
  "tags": ["תגית1", "תגית2", "תגית3"],
  "source": "שם המקור (למשל: שם הכותב, שם הערוץ, שם האתר)",
  "platform": "אחד מהבאים: youtube/twitter/linkedin/medium/substack/spotify/podcast/news/blog/other",
  "content_type": "אחד מהבאים: article/video/audio/post/other"
}

כללים:
- תקציר: מקסימום 3 משפטים, ממוקד בתובנה המרכזית
- תגיות: בדיוק 3 תגיות רלוונטיות בעברית
- אם התוכן באנגלית, תרגם הכל לעברית
- זהה את סוג התוכן מה-URL ומהתוכן
- החזר JSON תקין בלבד
```

## User Prompt Template

```
URL: {url}
פלטפורמה מזוהה: {detected_platform}

תוכן הדף:
{content}

החזר JSON עם הניתוח:
```

## Alternative English System Prompt

```
You are a knowledge processing system. Your task is to receive a URL and page content and return structured information.

Return ONLY a JSON object in the following format, with no additional text:
{
  "title": "Clear, concise title (max 60 characters)",
  "summary": "2-3 sentence summary explaining the key insight",
  "tags": ["tag1", "tag2", "tag3"],
  "source": "Source name (author name, channel name, or website)",
  "platform": "one of: youtube/twitter/linkedin/medium/substack/spotify/podcast/news/blog/other",
  "content_type": "one of: article/video/audio/post/other"
}

Rules:
- Summary: Maximum 3 sentences, focused on the central insight
- Tags: Exactly 3 relevant tags
- Detect content type from URL and content
- Return valid JSON only
```

## Platform Detection Logic

```javascript
function detectPlatform(url) {
  const urlLower = url.toLowerCase();
  
  if (urlLower.includes('youtube.com') || urlLower.includes('youtu.be')) return 'youtube';
  if (urlLower.includes('twitter.com') || urlLower.includes('x.com')) return 'twitter';
  if (urlLower.includes('linkedin.com')) return 'linkedin';
  if (urlLower.includes('medium.com')) return 'medium';
  if (urlLower.includes('substack.com')) return 'substack';
  if (urlLower.includes('spotify.com')) return 'spotify';
  if (urlLower.includes('podcasts.apple.com') || urlLower.includes('anchor.fm')) return 'podcast';
  
  // News sites
  const newsSites = ['ynet', 'walla', 'haaretz', 'calcalist', 'themarker', 'globes', 'bbc', 'cnn', 'nytimes'];
  if (newsSites.some(site => urlLower.includes(site))) return 'news';
  
  return 'blog';
}
```

## Content Type Detection

The AI determines content type based on:

1. **URL patterns**:
   - `/watch?v=` → video
   - `/episode/`, `/podcast/` → audio
   - `/status/`, `/tweet/` → post

2. **Content analysis**:
   - Long-form text → article
   - Short text with mentions/hashtags → post
   - Embedded player detected → video/audio

3. **Platform defaults**:
   - YouTube → video
   - Spotify → audio
   - Twitter → post
   - Medium/Substack → article

## Error Handling

If AI fails to return valid JSON, use fallback:

```javascript
{
  title: 'תוכן חדש',
  summary: 'לא הצלחתי לעבד את התוכן אוטומטית.',
  tags: ['לסיווג'],
  source: new URL(url).hostname,
  platform: detectedPlatform,
  content_type: 'other',
}
```

## Token Optimization

- Limit extracted content to 10,000 characters
- Use Claude Haiku for faster/cheaper processing (optional)
- Cache common domains' metadata

## Example Outputs

### YouTube Video
```json
{
  "title": "איך לבנות MVP בשבוע אחד",
  "summary": "סרטון המסביר את השלבים העיקריים לבניית מוצר מינימלי. הדגשים: התמקדות בבעיה אחת, בניית פרוטוטייפ מהיר, ואיסוף פידבק מוקדם.",
  "tags": ["סטארטאפ", "MVP", "יזמות"],
  "source": "Startup Nation",
  "platform": "youtube",
  "content_type": "video"
}
```

### Twitter Thread
```json
{
  "title": "10 טעויות נפוצות בגיוס משקיעים",
  "summary": "שרשור עם תובנות מניסיון של 50 פגישות עם משקיעים. הטעות הנפוצה: להתחיל עם המוצר במקום עם הבעיה.",
  "tags": ["גיוס הון", "משקיעים", "pitch"],
  "source": "@entrepreneur_il",
  "platform": "twitter",
  "content_type": "post"
}
```

### Medium Article
```json
{
  "title": "עקרונות עיצוב UX למובייל",
  "summary": "מאמר מקיף על 10 עקרונות עיצוב חיוניים. הדגש המרכזי: פחות זה יותר - כל מסך צריך מטרה אחת ברורה.",
  "tags": ["UX", "עיצוב", "מובייל"],
  "source": "שרה לוי",
  "platform": "medium",
  "content_type": "article"
}
```
