'use client';
import Image from'next/image';import{useState}from'react';
export default function MenuImage({image,alt,className=''}:{image:string;alt:string;className?:string}){const[bad,setBad]=useState(false);if(bad)return <div className={`grid place-items-center bg-orange-100 text-3xl ${className}`}>🍽️</div>;return <Image src={image} alt={alt} fill sizes="(max-width:768px) 50vw, 25vw" className={`object-cover ${className}`} onError={()=>setBad(true)}/>}
