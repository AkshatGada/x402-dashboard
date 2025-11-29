import { writable } from 'svelte/store';
import { browser } from '$app/environment';

type Theme = 'light' | 'dark';

// Initialize theme from localStorage or system preference
function getInitialTheme(): Theme {
	if (!browser) return 'light';
	
	const stored = localStorage.getItem('theme');
	if (stored === 'light' || stored === 'dark') {
		return stored;
	}
	
	// Check system preference
	if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
		return 'dark';
	}
	
	return 'light';
}

function createThemeStore() {
	const { subscribe, set } = writable<Theme>(getInitialTheme());
	
	return {
		subscribe,
		set: (theme: Theme) => {
			if (browser) {
				localStorage.setItem('theme', theme);
				document.documentElement.classList.toggle('dark', theme === 'dark');
			}
			set(theme);
		},
		toggle: () => {
			if (browser) {
				const current = localStorage.getItem('theme') === 'dark' ? 'dark' : 'light';
				const next: Theme = current === 'light' ? 'dark' : 'light';
				localStorage.setItem('theme', next);
				document.documentElement.classList.toggle('dark', next === 'dark');
				set(next);
			}
		},
		init: () => {
			if (browser) {
				const theme = getInitialTheme();
				document.documentElement.classList.toggle('dark', theme === 'dark');
				set(theme);
			}
		}
	};
}

export const theme = createThemeStore();

