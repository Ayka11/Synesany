import 'react-router';
module 'virtual:load-fonts.jsx' {
	export function LoadFonts(): null;
}

declare module '*.jsx' {
	const mod: any;
	export default mod;
}

declare module '*.js' {
	const mod: any;
	export default mod;
}

declare module 'react-router' {
	interface AppLoadContext {
		// add context properties here
	}
}
declare module 'npm:stripe' {
	import Stripe from 'stripe';
	export default Stripe;
}
declare module '@auth/create/react' {
	import { SessionProvider } from '@auth/react';
	export { SessionProvider };
}
