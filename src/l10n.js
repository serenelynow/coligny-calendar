import LocalizedStrings from 'react-localization';
import {en} from './l10nBundles/_en.js';
import {es} from './l10nBundles/es.js';

const localeParam = {
	en, // load en first as it is a default
	es
};

export const l10n = new LocalizedStrings(localeParam);