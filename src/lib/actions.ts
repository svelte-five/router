import { navigate } from './state.svelte';

export function link(node: HTMLElement) {
	const href = node.getAttribute('href');
	if (!href || !href.startsWith('/')) {
		return;
	}

	function onClick(event: MouseEvent) {
		const anchor = event.currentTarget as HTMLAnchorElement;

		if (
			(anchor.target === '' || anchor.target === '_self') &&
			shouldNavigate(event) &&
			doesHostMatch(event)
		) {
			event.preventDefault();
			navigate(anchor.pathname + anchor.search);
		}
	}

	node.addEventListener('click', onClick);

	return {
		destroy() {
			node.removeEventListener('click', onClick);
		}
	};
}

function shouldNavigate(event: MouseEvent) {
	return (
		!event.defaultPrevented &&
		event.button === 0 &&
		!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
	);
}

function doesHostMatch(event: MouseEvent) {
	const host = location.host;
	const target = event.currentTarget as HTMLAnchorElement;
	return (
		target.host === host ||
		target.href.indexOf(`https://${host}`) === 0 ||
		target.href.indexOf(`http://${host}`) === 0
	);
}
