export const routing = (function () {
	let prevPath = $state('');
	let currentPath = $state('');
	let initiated = false;

	const api = {
		preserveScrollOnNavigate: false,
		preserveScrollOnce: false,

		setPath(_path: string) {
			if (initiated) prevPath = currentPath;
			else initiated = true;
			currentPath = _path;
		},
		getPath() {
			return currentPath;
		},
		getPrevPath() {
			return prevPath;
		},

		navigate
	};

	return api;
})();

export function navigate(
	_path: string,
	opts: SvelteFiveRouterNavigateOptions = { preserveScroll: false }
) {
	if (opts.preserveScroll) routing.preserveScrollOnce = true;
	routing.setPath(_path);
}

export interface SvelteFiveRouterNavigateOptions {
	preserveScroll: boolean;
}
