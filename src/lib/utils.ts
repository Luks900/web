import { DATA_PREFIX, FULL_PREFIX } from '$lib/constants';
import type { StyleScreenshot } from '$lib/types';

export function getScreenshot(screenshot: StyleScreenshot): string {
	return `${screenshot.archived ? DATA_PREFIX : FULL_PREFIX}/screenshots/${screenshot.name}`;
}

export function htmlToTemplate(html: string): HTMLTemplateElement {
	const temp = document.createElement('template');
	html = html.trim(); // Never return a space text node as a result
	temp.innerHTML = html;
	return temp;
}

export function addTargetBlank(template: HTMLTemplateElement): void {
	domMemes(template.content);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function domMemes(node: any) {
		for (const child of node.children) {
			if (child.nodeName === 'A') {
				try {
					if (new URL(child.href).host !== window.location.host) child.target = '_blank';
				} catch {
					child.target = '_blank';
				}
			}
			if (child.children && child.children.length > 0) {
				domMemes(child);
			}
		}
	}
}

export class Query {
	private watched: { [key: string]: string } = {};
	vars: { [key: string]: string } = {};
	constructor(query: string, watched: { [key: string]: string }) {
		this.setQuery(query);
		this.watched = watched;
	}
	setQuery(query: string): void {
		const qs = new URLSearchParams(query);
		for (const key in this.watched) {
			this.vars[key] = qs.get(key) || this.watched[key];
		}
	}
	getQuery(): URLSearchParams {
		const qs = new URLSearchParams();
		for (const key in this.vars) {
			if (this.vars[key] !== this.watched[key]) qs.set(key, this.vars[key]);
		}
		return qs;
	}
}
