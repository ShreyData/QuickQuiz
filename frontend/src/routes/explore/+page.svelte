<!--
SPDX-FileCopyrightText: 2023 Marlon W (Mawoka)

SPDX-License-Identifier: MPL-2.0
-->

<script lang="ts">
	import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';
	import { navbarVisible } from '$lib/stores.svelte.ts';
	import SearchCard from '$lib/search-card.svelte';
	import { getLocalization } from '$lib/i18n';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	const { t } = getLocalization();
	const quizzes = $derived(data.results.hits ?? []);
	const hasNextPage = $derived(quizzes.length === data.pageSize);

	navbarVisible.visible = true;

	const changePage = (page: number) => {
		// `resolve` accepts route IDs, so preserve this page query after resolving the route.
		// eslint-disable-next-line svelte/no-navigation-without-resolve
		void goto(`${resolve('/explore')}?page=${page}`, {
			noScroll: true,
			keepFocus: true
		});
	};
</script>

<svelte:head>
	<title>QuickQuiz - Explore quizzes</title>
	<meta name="description" content="Discover quizzes shared by the QuickQuiz community." />
</svelte:head>

<main class="qq-container min-h-[65vh] py-8 sm:py-12">
	<header class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
		<div>
			<p class="qq-display mb-1 text-2xl text-[var(--qq-green)]">Find something to learn</p>
			<h1 class="qq-page-heading">Explore quizzes</h1>
			<p class="mt-2 max-w-2xl text-[var(--qq-muted)]">
				Browse public quizzes, then open one to preview or play.
			</p>
		</div>
		<a href={resolve('/search')} class="qq-button-secondary">{$t('words.search')}</a>
	</header>

	{#if quizzes.length > 0}
		<p class="mb-4 text-sm text-[var(--qq-muted)]" aria-live="polite">
			Page {data.currentPage}
		</p>
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
			{#each quizzes as quiz (quiz.id)}
				<SearchCard {quiz} />
			{/each}
		</div>
		<nav class="mt-8 flex items-center justify-between" aria-label="Explore pages">
			<button
				type="button"
				class="qq-button-secondary"
				disabled={data.currentPage <= 1}
				onclick={() => changePage(data.currentPage - 1)}
			>
				Previous
			</button>
			<span class="text-sm text-[var(--qq-muted)]">Page {data.currentPage}</span>
			<button
				type="button"
				class="qq-button-secondary"
				disabled={!hasNextPage}
				onclick={() => changePage(data.currentPage + 1)}
			>
				Next
			</button>
		</nav>
	{:else}
		<section class="qq-card mx-auto max-w-2xl p-8 text-center sm:p-12">
			<div
				class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--qq-green-soft)] text-2xl"
				aria-hidden="true"
			>
				⌕
			</div>
			<h2 class="text-xl font-bold">No public quizzes to show yet</h2>
			<p class="mt-2 text-[var(--qq-muted)]">
				Try searching for a topic, or create a quiz and share it with the community.
			</p>
			<div class="mt-6 flex flex-wrap justify-center gap-3">
				<a href={resolve('/search')} class="qq-button-secondary">Search quizzes</a>
				<a href={resolve('/create')} class="qq-button-primary">Create a quiz</a>
			</div>
		</section>
	{/if}
</main>
