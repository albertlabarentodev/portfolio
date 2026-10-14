# Albert Labarento — portfolio

Next.js (App Router) + Tailwind CSS v4, with an "Ask my AI" assistant on the Claude API.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint     # type-check
```

Copy `.env.example` to `.env.local` and set:

- `ANTHROPIC_API_KEY` (optional). Without it, the assistant streams the canned answers from `content/site.ts`, so the page works offline.
- `SITE_URL`: the deployed URL, used for social preview images.

## Where things live

| Path | What |
| --- | --- |
| `content/site.ts` | All copy: projects, Lab, experience, notes, FAQ. Replace every `[bracketed]` placeholder. |
| `app/page.tsx` | Home page sections |
| `app/work/[slug]/page.tsx` | Case study pages (one per project) |
| `app/uses/page.tsx` | /uses page |
| `app/api/ask/route.ts` | Assistant endpoint: streams answers grounded in `content/site.ts` |
| `components/workflow-graph.tsx` | Animated hero diagram (canvas) |
| `components/ask-ai.tsx` | Chat UI |
| `components/sound.tsx` | Optional interface sounds (off by default) |
| `public/images/` | Project cover images |
| `design/covers.html` | Source for the cover images. Replace with real screenshots when you have them. |

## Design references

| Portfolio | Idea taken |
| --- | --- |
| brittanychiang.com | Cursor spotlight, numbered section labels, hoverable experience rows |
| bruno-simon.com | One signature interactive moment: the live workflow graph |
| joshwcomeau.com | Sound toggle, springy hovers, typing assistant |
| rauno.me | The Automation Lab grid of small experiments |
| leerob.com | Speed, Geist type, notes list, /uses page |

All animation stops for visitors who turn on reduced motion.
