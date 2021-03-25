import { derived } from 'svelte/store';
import {isLoading, register, init, getLocaleFromNavigator, dictionary, locale, _, date, time, number} from 'svelte-i18n';

// got some ideas from here: https://github.com/ShanikaNishadhi/Svelte_i18n/blob/master/src/services/i18n.js

register('en', () => load('en'));
register('de', () => load('de'));

init({
    fallbackLocale: 'en',
    initialLocale: getLocaleFromNavigator(),
});

export function initI18n() {
}

export function changeLanguageTo(lang) {
    locale.set(lang);
}

function load(lang) {
    console.log('load locale ' + lang)

    locale.set(lang);

    return fetch('/lang/' + lang + ".json")
        .then(response => response.json());
}
const isLocaleLoaded = derived(isLoading, $isLoading => !$isLoading);

export { _, locale, isLocaleLoaded };

