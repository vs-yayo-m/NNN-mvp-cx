export type Variant={label:string;price:number};
export type MenuItem={id:string;categoryId:string;subcategory?:string;name:string;description?:string;image:string;isVeg:boolean;isAvailable:boolean;isPopular:boolean;isTodaysSpecial:boolean;tags:string[];variants:Variant[]};
export type Category={id:string;label:string;icon:string;sortOrder:number;group?:'food'|'bar'};
export type CartLine={lineId:string;itemId:string;name:string;image:string;variant:Variant;quantity:number;categoryId:string};
export type CheckoutDetails={name:string;phone:string;address:string;landmark?:string;notes?:string;orderType:'Delivery'|'Pickup';paymentMethod:'Cash on Delivery'|'eSewa'|'Khalti'};
export type Order={id:string;createdAt:string;lines:CartLine[];details:CheckoutDetails;subtotal:number;deliveryFee:number;discount:number;total:number;recurring?:boolean};
export type UserProfile={phone:string;name:string;addresses:string[];createdAt:string};
export type RecurringOrder={id:string;summary:string;lines:CartLine[];frequency:'Daily'|'Weekdays'|'Weekly';time:string;startDate:string;paused:boolean};
