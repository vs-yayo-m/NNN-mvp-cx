export const formatCurrency=(n:number)=>`Rs. ${Math.round(n).toLocaleString('en-NP')}`;
export const uid=(p='id')=>`${p}-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
export const maskPhone=(p:string)=>p.replace(/(\d{2})\d+(\d{2})/,'$1******$2');
