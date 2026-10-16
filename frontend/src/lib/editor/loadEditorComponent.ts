const EDITOR_COMPONENT_TIMEOUT_MS = 10_000;

export const loadEditorComponent = <T>(component: Promise<T>): Promise<T> =>
	new Promise((resolve, reject) => {
		const timeout = setTimeout(() => {
			reject(new Error('The editor component took too long to load.'));
		}, EDITOR_COMPONENT_TIMEOUT_MS);

		component.then(
			(loadedComponent) => {
				clearTimeout(timeout);
				resolve(loadedComponent);
			},
			(error) => {
				clearTimeout(timeout);
				reject(error);
			}
		);
	});
