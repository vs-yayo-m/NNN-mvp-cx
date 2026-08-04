'use client';
import{AuthProvider}from'./authStore';import{CartProvider}from'./cartStore';import{OrderProvider}from'./orderStore';
export function Providers({children}:{children:React.ReactNode}){return <AuthProvider><CartProvider><OrderProvider>{children}</OrderProvider></CartProvider></AuthProvider>}
