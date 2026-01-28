import { AIProcessingResult } from '@/types';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

// System prompt for knowledge extraction
const SYSTEM_PROMPT = `אתה מערכת לעיבוד ידע. המשימה שלך לקבל URL ותוכן של דף ולהחזיר מידע מובנה.

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
- החזר JSON תקין בלבד`;

// Extract text content from URL
async function fetchUrlContent(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; KnowledgeCollector/1.0)',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const html = await response.text();
    
    // Basic HTML to text extraction
    // In production, you'd use cheerio or similar
    const textContent = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 10000); // Limit content length
    
    return textContent;
  } catch (error) {
    console.error('Error fetching URL content:', error);
    return '';
  }
}

// Detect platform from URL
function detectPlatform(url: string): string {
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

// Process URL with Claude AI
export async function processWithAI(url: string): Promise<AIProcessingResult> {
  // Fetch content
  const content = await fetchUrlContent(url);
  const detectedPlatform = detectPlatform(url);
  
  // Build prompt
  const userPrompt = `URL: ${url}
פלטפורמה מזוהה: ${detectedPlatform}

תוכן הדף:
${content || 'לא הצלחתי לחלץ תוכן. נתח על בסיס ה-URL בלבד.'}

החזר JSON עם הניתוח:`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: userPrompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.content[0].text;
    
    // Parse JSON response
    const result = JSON.parse(aiResponse);
    
    return {
      title: result.title || 'ללא כותרת',
      summary: result.summary || 'ללא תקציר',
      tags: Array.isArray(result.tags) ? result.tags.slice(0, 3) : ['כללי'],
      source: result.source || new URL(url).hostname,
      platform: result.platform || detectedPlatform,
      content_type: result.content_type || 'other',
    };
  } catch (error) {
    console.error('AI processing error:', error);
    
    // Fallback response
    return {
      title: 'תוכן חדש',
      summary: 'לא הצלחתי לעבד את התוכן אוטומטית.',
      tags: ['לסיווג'],
      source: new URL(url).hostname,
      platform: detectedPlatform,
      content_type: 'other',
    };
  }
}
