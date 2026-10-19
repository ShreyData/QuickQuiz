<!--
SPDX-FileCopyrightText: 2023 Marlon W (Mawoka)

SPDX-License-Identifier: MPL-2.0
-->

<script lang="ts">
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import { getLocalization } from '$lib/i18n';
	import SearchCard from '$lib/search-card.svelte';

	const { t } = getLocalization();
	const PAGE_SIZE = 20;

	interface SearchHit {
		id: string;
		title: string;
		description?: string;
		user: string;
		imported_from_kahoot?: boolean;
		_formatted?: SearchHit;
	}

	let searchTerm = $state('');
	let hits = $state<SearchHit[]>([]);
	let loading = $state(false);
	let loadingMore = $state(false);
	let errorMessage = $state('');
	let hasSearched = $state(false);
	let hasMore = $state(false);
	let offset = $state(0);

	const search = async (append = false) => {
		const query = searchTerm.trim();
		if (query.length < 3 || (append && (loadingMore || !hasMore))) {
			return;
		}

		errorMessage = '';
		if (append) {
			loadingMore = true;
		} else {
			loading = true;
			hasSearched = true;
			offset = 0;
			hits = [];
		}

		try {
			const response = await fetch('/api/v1/search/', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					q: query,
					limit: PAGE_SIZE,
					offset: append ? offset : 0,
					attributesToHighlight: ['*']
				}),
				signal: AbortSignal.timeout(15_000)
			});
			if (!response.ok) {
				throw new Error(`Search could not be completed (${response.status}).`);
			}

			const result: { hits?: SearchHit[] } = await response.json();
			const nextHits = result.hits ?? [];
			hits = append ? [...hits, ...nextHits] : nextHits;
			offset = hits.length;
			hasMore = nextHits.length === PAGE_SIZE;

			const url = new URL(window.location.href);
			url.searchParams.set('q', query);
			window.history.replaceState(null, '', url);
		} catch (error) {
			errorMessage =
				error instanceof Error ? error.message : 'Search failed. Please try again.';
		} finally {
			loading = false;
			loadingMore = false;
		}
	};

	onMount(() => {
		const query = new URLSearchParams(window.location.search).get('q') ?? '';
		searchTerm = query;
		if (query.trim().length >= 3) {
			void search();
		}
	});
</script>

<svelte:head>
	<title>QuickQuiz - Search</title>
	<meta name="description" content="Search public QuickQuiz quizzes by topic." />
</svelte:head>

<main class="qq-container min-h-[65vh] py-8 sm:py-12">
	<header class="mb-7">
		<p class="qq-display mb-1 text-2xl text-[var(--qq-green)]">Your next big idea is here</p>
		<h1 class="qq-page-heading">Search quizzes</h1>
		<p class="mt-2 text-[var(--qq-muted)]">Find a quiz by subject, question, or keyword.</p>
	</header>

	<form
		class="qq-card flex flex-col gap-3 p-3 sm:flex-row sm:p-4"
		onsubmit={(event) => {
			event.preventDefault();
			void search();
		}}
	>
		<label class="sr-only" for="quiz-search">{$t('words.search')}</label>
		<input
			id="quiz-search"
			type="search"
			class="qq-input min-w-0 flex-1"
			placeholder={$t('search_page.at_least_3_characters')}
			bind:value={searchTerm}
			minlength="3"
			autocomplete="off"
		/>
		<button
			type="submit"
			class="qq-button-primary sm:min-w-32"
			disabled={searchTerm.trim().length < 3 || loading}
		>
			{loading ? 'Searching…' : $t('words.search')}
		</button>
	</form>

	{#if errorMessage}
		<p class="mt-5 rounded-xl border border-red-300 bg-red-50 p-4 text-red-900" role="alert">
			{errorMessage}
		</p>
	{:else if loading}
		<div class="py-16 text-center text-[var(--qq-muted)]" role="status" aria-live="polite">
			<span
				class="mx-auto mb-3 block h-8 w-8 animate-spin rounded-full border-4 border-[var(--qq-border)] border-t-[var(--qq-green)]"
			></span>
			Searching public quizzes…
		</div>
	{:else if hasSearched && hits.length > 0}
		<p class="my-5 text-sm text-[var(--qq-muted)]" aria-live="polite">
			Showing {hits.length} result{hits.length === 1 ? '' : 's'} for “{searchTerm.trim()}”
		</p>
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
			{#each hits as hit (hit.id)}
				<SearchCard quiz={hit._formatted ?? hit} />
			{/each}
		</div>
		{#if hasMore}
			<div class="mt-8 text-center">
				<button
					type="button"
					class="qq-button-secondary"
					disabled={loadingMore}
					onclick={() => void search(true)}
				>
					{loadingMore ? 'Loading…' : 'Load more results'}
				</button>
			</div>
		{/if}
	{:else if hasSearched}
		<section class="qq-card mt-6 p-8 text-center sm:p-12">
			<h2 class="text-xl font-bold">{$t('search_page.nothing_here')}</h2>
			<p class="mt-2 text-[var(--qq-muted)]">
				Try another search term, or explore all public quizzes.
			</p>
			<a href={resolve('/explore')} class="qq-button-secondary mt-5">{$t('words.explore')}</a>
		</section>
	{:else}
		<p class="mt-4 text-sm text-[var(--qq-muted)]" role="status">
			Enter at least 3 characters to search.
		</p>
	{/if}
</main>
