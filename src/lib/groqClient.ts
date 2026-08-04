import 'server-only';
export async function groqJson(prompt:string){
  if(!process.env.GROQ_API_KEY)throw new Error('Missing GROQ_API_KEY');
  const res=await fetch('https://api.groq.com/openai/v1/chat/completions',{method:'POST',headers:{Authorization:`Bearer ${process.env.GROQ_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({model:'llama-3.1-8b-instant',temperature:0.1,response_format:{type:'json_object'},messages:[{role:'system',content:'Return strict JSON only.'},{role:'user',content:prompt}]})});
  if(!res.ok)throw new Error(`Groq ${res.status}`);const json=await res.json();return JSON.parse(json.choices?.[0]?.message?.content||'{}')
}
