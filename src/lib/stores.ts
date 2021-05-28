import { browser } from '$app/env';
import { DATA_PREFIX } from '$lib/constants';
import type { SearchIndex } from '$lib/types';

export type SortedSearchIndexes = {
	weeklyInstalls: SearchIndex;
	totalInstalls: SearchIndex;
	rating: SearchIndex;
	updated: SearchIndex;
	created: SearchIndex;
};

export const styleIndex = fetchOnce<SortedSearchIndexes>(() =>
	fetch(`${DATA_PREFIX}/search-index.json`).then((resp) => resp.json().then((e) => sort(e)))
);

function sort(weeklyInstalls: SearchIndex): SortedSearchIndexes {
	return {
		weeklyInstalls,
		totalInstalls: [...weeklyInstalls].sort((a, b) => b.t - a.t),
		rating: [...weeklyInstalls].sort((a, b) => b.r - a.r),
		updated: [...weeklyInstalls].sort((a, b) => b.u - a.u),
		created: [...weeklyInstalls].sort((a, b) => b.i - a.i)
	};
}

type DataType<T> = { isLoading: boolean; error?: Error; data?: T };
type HandlerType<T> = (newValue: { isLoading: boolean; error?: Error; data?: T }) => void;

export function fetchOnce<T>(
	promiseFn: any, // eslint-disable-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
	initialValue: DataType<T> = { isLoading: false }
): { subscribe: (handler: HandlerType<T>) => () => void } {
	let value = initialValue;
	const subs = [];

	function subscribe(handler: HandlerType<T>): () => void {
		subs.push(handler);

		if (value === initialValue && !value.isLoading && browser) {
			value.isLoading = true;
			const t = promiseFn();
			if (t instanceof Promise) {
				t.then((data: T) => {
					set({ isLoading: false, error: null, data });
				}).catch((e: Error) => {
					set({ isLoading: false, error: e, data: null });
				});
			} else {
				set({ isLoading: false, error: null, data: t });
			}
		}

		handler(value);

		return () => subs.splice(subs.indexOf(handler));
	}

	function set(newValue: { isLoading: boolean; error?: Error; data?: T }) {
		if (value === newValue) return;

		value = newValue;
		subs.forEach((s) => s(value));
	}

	return { subscribe };
}
