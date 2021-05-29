export type StyleFormat = 'uso';

export type SearchIndex = Array<SearchIndexItem>;

export type CategoriesIndex = Array<CategoriesIndexItem>;

export type CategoriesIndexItem = {
	/** Name */
	n: string;
	/** Styles */
	s: SearchIndex;
};

export type SearchIndexItem = {
	/** Format */
	f: StyleFormat;
	/** ID */
	i: number;
	/** Name */
	n: string;
	/** Category */
	c: string;
	/** Updated at */
	u: number;
	/** Total installs */
	t: number;
	/** Weekly installs */
	w: number;
	/** Rating */
	r: number;
	/** Author ID */
	ai: number;
	/** Author name*/
	an: string;
	/** Screnshot name */
	sn: string;
	/** Is screenshot archived */
	sa: boolean;
};

export type StyleInfo = {
	format: StyleFormat;
	name: string;
	description: string;
	additionalInfo: string;
	category: string;
	createdAt: string;
	updatedAt: string;
	license: string;
	author: StyleAuthor;
};

export type StyleAuthor = {
	id: number;
	name: string;
	homepage?: string;
};

export type StyleStats = {
	installs: StyleInstalls;
	rating: number;
};

export type StyleInstalls = {
	total: number;
	weekly: number;
};

export type StyleScreenshot = {
	name: string;
	archived: boolean;
};

export type StyleScreenshots = {
	main: StyleScreenshot;
	additional?: Array<StyleScreenshot>;
};

export type StyleDiscussions = {
	stats: StyleDiscussionStats;
	data: Array<StyleDiscussion>;
};

export type StyleDiscussionStats = {
	discussionsCount: number;
	commentsCount: number;
};

export type StyleDiscussion = {
	id: number;
	title: string;
	createdAt: string;
	author: StyleAuthor;
};

export type StyleData = {
	css: string;
	settings?: Array<StyleSetting>;
};

export type StyleSettingType = 'dropdown' | 'image' | 'color' | 'text';

export type StyleSetting = {
	key: string;
	label: string;
	type: StyleSettingType;
	options?: Array<StyleSettingOption>;
};

export type StyleSettingOption = {
	key: string;
	label: string;
	value: string;
	default: boolean;
};

export type Style = {
	id: number;
	info: StyleInfo;
	stats: StyleStats;
	screenshots: StyleScreenshots;
	discussions: StyleDiscussions;
	style: StyleData;
};
