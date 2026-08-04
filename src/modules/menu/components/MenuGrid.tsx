'use client';
import{useState}from'react';import{MenuItem}from'@/types';import MenuItemCard from'./MenuItemCard';import ItemDetailSheet from'./ItemDetailSheet';
export default function MenuGrid({items}:{items:MenuItem[]}){const[sel,setSel]=useState<MenuItem|null>(null);return <>{items.length?<div className="grid grid-cols-2 gap-4 md:grid-cols-4">{items.map(i=><MenuItemCard key={i.id} item={i} onSelect={setSel}/>)}</div>:<div className="panel p-8 text-center">No dishes match this filter yet. Try another craving.</div>}<ItemDetailSheet item={sel} onClose={()=>setSel(null)}/></>}
