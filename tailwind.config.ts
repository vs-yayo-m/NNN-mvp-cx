import type { Config } from 'tailwindcss';
export default { content:['./src/**/*.{ts,tsx}'], theme:{extend:{colors:{brand:'hsl(var(--brand))',ink:'hsl(var(--ink))',cream:'hsl(var(--cream))',card:'hsl(var(--card))'},fontFamily:{display:['var(--font-display)'],body:['var(--font-body)']},boxShadow:{soft:'0 18px 50px rgba(64,32,12,.12)'}}}, plugins:[] } satisfies Config;
