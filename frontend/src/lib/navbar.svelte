<!--
SPDX-FileCopyrightText: 2023 Marlon W (Mawoka)

SPDX-License-Identifier: MPL-2.0
-->

<script lang="ts">
	import '@fontsource/marck-script/index.css';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { beforeNavigate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { getLocalization } from '$lib/i18n';
	import { signedIn } from '$lib/stores';
	import { registration_disabled } from './config';

	const { t } = getLocalization();

	let menuOpen = $state(false);
	let darkMode = $state(false);

	onMount(() => {
		darkMode =
			localStorage.theme === 'dark' ||
			(!('theme' in localStorage) &&
				window.matchMedia('(prefers-color-scheme: dark)').matches);
	});

	beforeNavigate(() => {
		menuOpen = false;
	});

	const toggleTheme = () => {
		darkMode = !darkMode;
		localStorage.setItem('theme', darkMode ? 'dark' : 'light');
		document.documentElement.classList.toggle('dark', darkMode);
	};

	const isActive = (href: string) => page.url.pathname === href;
</script>

<svelte:head>
	<meta name="theme-color" content={darkMode ? '#24362b' : '#edf3eb'} />
</svelte:head>

<header
	class="fixed inset-x-0 top-0 z-40 border-b backdrop-blur-xl"
	style="border-color: var(--qq-border); background: color-mix(in srgb, var(--qq-surface) 90%, transparent);"
>
	<nav class="qq-container flex min-h-16 items-center justify-between gap-3" aria-label="Main">
		<a
			href={resolve('/')}
			class="flex shrink-0 items-center gap-2 text-[var(--qq-ink)] no-underline"
		>
			<img src="/quickquiz-mark.svg" alt="" class="h-9 w-9" />
			<span class="text-xl font-extrabold tracking-tight sm:text-2xl">QuickQuiz</span>
		</a>

		<div class="hidden items-center gap-1 md:flex">
			<a
				href={resolve('/explore')}
				aria-current={isActive('/explore') ? 'page' : undefined}
				class="btn-nav hover:bg-[var(--qq-green-soft)] hover:text-[var(--qq-ink)]"
				class:bg-[var(--qq-green-soft)]={isActive('/explore')}
				class:text-[var(--qq-ink)]={isActive('/explore')}
			>
				{$t('words.explore')}
			</a>
			<a
				href={resolve('/search')}
				aria-current={isActive('/search') ? 'page' : undefined}
				class="btn-nav hover:bg-[var(--qq-green-soft)] hover:text-[var(--qq-ink)]"
				class:bg-[var(--qq-green-soft)]={isActive('/search')}
				class:text-[var(--qq-ink)]={isActive('/search')}
			>
				{$t('words.search')}
			</a>
			{#if $signedIn}
				<a
					href={resolve('/dashboard')}
					aria-current={isActive('/dashboard') ? 'page' : undefined}
					class="btn-nav hover:bg-[var(--qq-green-soft)] hover:text-[var(--qq-ink)]"
					class:bg-[var(--qq-green-soft)]={isActive('/dashboard')}
					class:text-[var(--qq-ink)]={isActive('/dashboard')}
				>
					{$t('words.dashboard')}
				</a>
			{:else}
				<a
					href={resolve('/docs')}
					class="btn-nav hover:bg-[var(--qq-green-soft)] hover:text-[var(--qq-ink)]"
				>
					{$t('words.docs')}
				</a>
			{/if}
		</div>

		<div class="hidden items-center gap-2 md:flex">
			<a href={resolve('/play')} class="qq-button-secondary">{$t('words.play')}</a>
			{#if $signedIn}
				<form action="/api/v1/users/logout" method="get">
					<button type="submit" class="qq-button-secondary">{$t('words.logout')}</button>
				</form>
			{:else}
				{#if registration_disabled}
					<a href={resolve('/account/register')} class="qq-button-secondary"
						>{$t('words.register')}</a
					>
				{/if}
				<a href={resolve('/account/login')} class="qq-button-primary">{$t('words.login')}</a
				>
			{/if}
			<button
				type="button"
				class="flex h-11 w-11 items-center justify-center rounded-xl text-[var(--qq-ink)] transition hover:bg-[var(--qq-green-soft)]"
				onclick={toggleTheme}
				aria-label={darkMode ? 'Activate light mode' : 'Activate dark mode'}
				title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
			>
				{#if darkMode}
					<svg
						aria-hidden="true"
						viewBox="0 0 24 24"
						class="h-5 w-5"
						fill="none"
						stroke="currentColor"
						stroke-width="1.8"
					>
						<circle cx="12" cy="12" r="4" />
						<path
							stroke-linecap="round"
							d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"
						/>
					</svg>
				{:else}
					<svg
						aria-hidden="true"
						viewBox="0 0 24 24"
						class="h-5 w-5"
						fill="none"
						stroke="currentColor"
						stroke-width="1.8"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M20.4 15.4A8.5 8.5 0 0 1 8.6 3.6 8.5 8.5 0 1 0 20.4 15.4Z"
						/>
					</svg>
				{/if}
			</button>
		</div>

		<div class="flex items-center gap-1 md:hidden">
			<a href={resolve('/play')} class="qq-button-primary px-3">{$t('words.play')}</a>
			<button
				type="button"
				class="flex h-11 w-11 items-center justify-center rounded-xl text-[var(--qq-ink)] hover:bg-[var(--qq-green-soft)]"
				onclick={toggleTheme}
				aria-label={darkMode ? 'Activate light mode' : 'Activate dark mode'}
			>
				{#if darkMode}
					<span aria-hidden="true">☀</span>
				{:else}
					<span aria-hidden="true">☾</span>
				{/if}
			</button>
			<button
				type="button"
				class="flex h-11 w-11 items-center justify-center rounded-xl text-[var(--qq-ink)] hover:bg-[var(--qq-green-soft)]"
				aria-expanded={menuOpen}
				aria-controls="mobile-navigation"
				aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
				onclick={() => (menuOpen = !menuOpen)}
			>
				{#if menuOpen}
					<svg
						aria-hidden="true"
						viewBox="0 0 24 24"
						class="h-6 w-6"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<path stroke-linecap="round" d="m6 6 12 12M18 6 6 18" />
					</svg>
				{:else}
					<svg
						aria-hidden="true"
						viewBox="0 0 24 24"
						class="h-6 w-6"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<path stroke-linecap="round" d="M4 7h16M4 12h16M4 17h16" />
					</svg>
				{/if}
			</button>
		</div>
	</nav>

	{#if menuOpen}
		<div
			id="mobile-navigation"
			class="qq-container flex flex-col gap-1 border-t py-3 md:hidden"
			style="border-color: var(--qq-border);"
		>
			<a
				href={resolve('/explore')}
				aria-current={isActive('/explore') ? 'page' : undefined}
				class="rounded-lg px-3 py-3 font-semibold text-[var(--qq-ink)] hover:bg-[var(--qq-green-soft)]"
				>{$t('words.explore')}</a
			>
			<a
				href={resolve('/search')}
				aria-current={isActive('/search') ? 'page' : undefined}
				class="rounded-lg px-3 py-3 font-semibold text-[var(--qq-ink)] hover:bg-[var(--qq-green-soft)]"
				>{$t('words.search')}</a
			>
			{#if $signedIn}
				<a
					href={resolve('/dashboard')}
					class="rounded-lg px-3 py-3 font-semibold text-[var(--qq-ink)] hover:bg-[var(--qq-green-soft)]"
				>
					{$t('words.dashboard')}
				</a>
				<a
					href={resolve('/results')}
					class="rounded-lg px-3 py-3 font-semibold text-[var(--qq-ink)] hover:bg-[var(--qq-green-soft)]"
				>
					{$t('words.results')}
				</a>
				<a
					href={resolve('/account/settings')}
					class="rounded-lg px-3 py-3 font-semibold text-[var(--qq-ink)] hover:bg-[var(--qq-green-soft)]"
				>
					{$t('words.settings')}
				</a>
				<form action="/api/v1/users/logout" method="get">
					<button
						type="submit"
						class="w-full rounded-lg px-3 py-3 text-left font-semibold text-[var(--qq-ink)] hover:bg-[var(--qq-green-soft)]"
					>
						{$t('words.logout')}
					</button>
				</form>
			{:else}
				<a
					href={resolve('/docs')}
					class="rounded-lg px-3 py-3 font-semibold text-[var(--qq-ink)] hover:bg-[var(--qq-green-soft)]"
				>
					{$t('words.docs')}
				</a>
				<a
					href={resolve('/account/login')}
					class="rounded-lg px-3 py-3 font-semibold text-[var(--qq-ink)] hover:bg-[var(--qq-green-soft)]"
				>
					{$t('words.login')}
				</a>
				{#if registration_disabled}
					<a
						href={resolve('/account/register')}
						class="rounded-lg px-3 py-3 font-semibold text-[var(--qq-ink)] hover:bg-[var(--qq-green-soft)]"
					>
						{$t('words.register')}
					</a>
				{/if}
			{/if}
		</div>
	{/if}
</header>
