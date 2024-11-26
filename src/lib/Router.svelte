<script lang="ts">
	import { BROWSER } from 'esm-env';
	import { type Component, type Snippet, onMount } from 'svelte';
	import { parse } from 'regexparam';
	import Blank from './Blank.svelte';
	import { routing, navigate } from './state.svelte';

	interface Props {
		routes: SvelteFiveRoute[];
		preserveScrollOnNavigate?: boolean;
		children?: Snippet;
	}
	interface SvelteFiveRoute {
		path: string;
		component: Component;
		isNotFound?: boolean;
	}

	const initialPath = routing.getPath();

	let { routes, preserveScrollOnNavigate = false, children }: Props = $props();
	let notFoundRoute = $derived(routes.find(({ isNotFound }) => isNotFound === true)!);
	let Screen: Component = $state(initialPath ? findScreen(initialPath) : Blank);

	routing.preserveScrollOnNavigate = preserveScrollOnNavigate;

	$effect(() => {
		const newPath = routing.getPath();

		Screen = findScreen(newPath);

		if (BROWSER) {
			history.pushState(null, '', newPath);
		}

		if (
			(!routing.preserveScrollOnNavigate ||
				(routing.preserveScrollOnNavigate && !routing.preserveScrollOnce)) &&
			BROWSER
		) {
			setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 300);
			if (routing.preserveScrollOnce) routing.preserveScrollOnce = false;
		}
	});

	onMount(() => {
		window.addEventListener('hashchange', () => {
			navigate(window.location.pathname);
		});

		window.addEventListener('popstate', (event: PopStateEvent) => {
			navigate(window.location.pathname);
			event.preventDefault();
		});
	});

	function findScreen(_path: string) {
		const route = routes.find((r) => doesPathMatch(r.path, _path));
		if (!route) return notFoundRoute.component;
		else return route.component;
	}

	function doesPathMatch(pattern: string, path: string): boolean {
		try {
			return parse(pattern).pattern.test(path);
		} catch (e) {
			return false;
		}
	}
</script>

<Screen />

{#if children}
	{@render children()}
{/if}
