<!--
SPDX-FileCopyrightText: 2023 Marlon W (Mawoka)

SPDX-License-Identifier: MPL-2.0
-->

<script lang="ts">
	import { resolve } from '$app/paths';
	import DownloadQuiz from '$lib/components/DownloadQuiz.svelte';
	import { getLocalization } from '$lib/i18n';
	import Footer from '$lib/footer.svelte';
	import { signedIn } from '$lib/stores';
	import { navbarVisible } from '$lib/stores.svelte';
	import CommandpaletteNotice from '$lib/components/popover/commandpalettenotice.svelte';
	import StartGamePopup from '$lib/dashboard/start_game.svelte';
	import Analytics from './Analytics.svelte';
	import MediaComponent from '$lib/editor/MediaComponent.svelte';
	import type { PageData } from './$types';

	interface DashboardItem {
		id: string;
		type: 'quiz' | 'quiztivity';
		title: string;
		description?: string | null;
		public?: boolean;
		cover_image?: string | null;
		likes?: number;
		dislikes?: number;
		plays?: number;
		views?: number;
	}

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	const { t } = getLocalization();
	let searchTerm = $state('');
	let startGameId = $state<string | null>(null);
	let downloadId: string | null = $state(null);
	let items = $state<DashboardItem[]>([
		...data.quizzes.map((item) => ({ ...item, type: 'quiz' as const })),
		...data.quiztivities.map((item) => ({ ...item, type: 'quiztivity' as const }))
	]);
	let nextPage = $state(2);
	let hasMore = $state(
		data.quizzes.length === data.pageSize || data.quiztivities.length === data.pageSize
	);
	let loadingMore = $state(false);
	let loadMoreError = $state('');
	let deleteError = $state('');
	interface AnalyticsQuiz {
		likes: number;
		dislikes: number;
		plays: number;
		views: number;
	}
	let analyticsQuiz = $state<AnalyticsQuiz | undefined>();
	let filteredItems = $derived.by(() => {
		const query = searchTerm.trim().toLocaleLowerCase();
		if (!query) return items;
		return items.filter((item) =>
			`${item.title} ${item.description ?? ''}`.toLocaleLowerCase().includes(query)
		);
	});

	signedIn.set(true);
	navbarVisible.visible = true;

	const loadMore = async () => {
		if (loadingMore || !hasMore) return;
		loadingMore = true;
		loadMoreError = '';
		try {
			const [quizResponse, quiztivityResponse] = await Promise.all([
				fetch(`/api/v1/quiz/list?page_size=${data.pageSize}&page=${nextPage}`),
				fetch(`/api/v1/quiztivity/?page_size=${data.pageSize}&page=${nextPage}`)
			]);
			if (!quizResponse.ok || !quiztivityResponse.ok) {
				throw new Error('More quizzes could not be loaded. Please try again.');
			}
			const [quizzes, quiztivities] = await Promise.all([
				quizResponse.json(),
				quiztivityResponse.json()
			]);
			items = [
				...items,
				...quizzes.map((item) => ({ ...item, type: 'quiz' as const })),
				...quiztivities.map((item) => ({ ...item, type: 'quiztivity' as const }))
			];
			hasMore = quizzes.length === data.pageSize || quiztivities.length === data.pageSize;
			nextPage += 1;
		} catch (error) {
			loadMoreError =
				error instanceof Error ? error.message : 'More quizzes could not be loaded.';
		} finally {
			loadingMore = false;
		}
	};

	const deleteQuiz = async (item: DashboardItem) => {
		const confirmed = window.confirm(`Delete “${item.title}”? This cannot be undone.`);
		if (!confirmed) return;

		deleteError = '';
		try {
			const endpoint =
				item.type === 'quiz'
					? `/api/v1/quiz/delete/${encodeURIComponent(item.id)}`
					: `/api/v1/quiztivity/${encodeURIComponent(item.id)}`;
			const response = await fetch(endpoint, { method: 'DELETE' });
			if (!response.ok) {
				throw new Error(`This item could not be deleted (${response.status}).`);
			}
			items = items.filter(
				(candidate) => candidate.id !== item.id || candidate.type !== item.type
			);
		} catch (error) {
			deleteError =
				error instanceof Error ? error.message : 'This item could not be deleted.';
		}
	};
</script>

<svelte:head>
	<title>QuickQuiz - Dashboard</title>
	<meta name="description" content="Manage your QuickQuiz quizzes and results." />
</svelte:head>

<Analytics bind:quiz={analyticsQuiz} />
<CommandpaletteNotice />
<main class="qq-container min-h-[70vh] py-8 sm:py-12">
	<header class="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
		<div>
			<p class="qq-display mb-1 text-2xl text-[var(--qq-green)]">Welcome back</p>
			<h1 class="qq-page-heading">Your library</h1>
			<p class="mt-2 text-[var(--qq-muted)]">Create, find, and manage your learning games.</p>
		</div>
		<div class="flex flex-wrap gap-2">
			<a href={resolve('/create')} class="qq-button-primary"
				>＋ {$t('dashboard.create_quiz')}</a
			>
			<a href={resolve('/import')} class="qq-button-secondary">{$t('words.import')}</a>
		</div>
	</header>

	<nav class="mb-6 flex flex-wrap gap-2" aria-label="Library tools">
		<a href={resolve('/results')} class="qq-button-secondary">{$t('words.results')}</a>
		<a href={resolve('/edit/files')} class="qq-button-secondary">{$t('words.files_library')}</a>
		<a href={resolve('/account/settings')} class="qq-button-secondary">{$t('words.settings')}</a
		>
	</nav>

	{#if data.loadError}
		<p class="mb-5 rounded-xl border border-red-300 bg-red-50 p-4 text-red-900" role="alert">
			{data.loadError}
		</p>
	{/if}
	{#if deleteError}
		<p class="mb-5 rounded-xl border border-red-300 bg-red-50 p-4 text-red-900" role="alert">
			{deleteError}
		</p>
	{/if}

	<section aria-labelledby="library-heading">
		<div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
			<div>
				<h2 id="library-heading" class="text-xl font-bold">Your quizzes</h2>
				<p class="mt-1 text-sm text-[var(--qq-muted)]">
					{filteredItems.length} shown from {items.length} loaded
				</p>
			</div>
			<label class="w-full sm:max-w-sm">
				<span class="sr-only">{$t('dashboard.search_for_own_quizzes')}</span>
				<input
					type="search"
					class="qq-input"
					bind:value={searchTerm}
					placeholder={$t('dashboard.search_for_own_quizzes')}
				/>
			</label>
		</div>

		{#if items.length === 0 && !data.loadError}
			<section class="qq-card p-8 text-center sm:p-12">
				<h3 class="text-xl font-bold">Your library is ready for its first quiz</h3>
				<p class="mt-2 text-[var(--qq-muted)]">
					Create a quiz from scratch or bring in one you already have.
				</p>
				<div class="mt-6 flex flex-wrap justify-center gap-3">
					<a href={resolve('/create')} class="qq-button-primary">Create a quiz</a>
					<a href={resolve('/import')} class="qq-button-secondary">Import a quiz</a>
				</div>
			</section>
		{:else if filteredItems.length === 0}
			<section class="qq-card p-8 text-center">
				<h3 class="text-lg font-bold">No matches found</h3>
				<p class="mt-2 text-[var(--qq-muted)]">
					Try a different title or clear your search.
				</p>
				<button
					class="qq-button-secondary mt-4"
					type="button"
					onclick={() => (searchTerm = '')}
				>
					Clear search
				</button>
			</section>
		{:else}
			<div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
				{#each filteredItems as item (`${item.type}:${item.id}`)}
					<article class="qq-card flex min-w-0 flex-col overflow-hidden sm:flex-row">
						{#if item.cover_image && item.type === 'quiz'}
							<div class="h-40 shrink-0 bg-[var(--qq-green-soft)] sm:h-auto sm:w-36">
								<MediaComponent
									src={item.cover_image}
									css_classes="h-full w-full object-cover"
								/>
							</div>
						{/if}
						<div class="flex min-w-0 flex-1 flex-col p-5">
							<div class="flex items-start justify-between gap-3">
								<div class="min-w-0">
									<span
										class="text-xs font-semibold uppercase tracking-wide text-[var(--qq-muted)]"
									>
										{item.type === 'quiz' ? 'Quiz' : 'Interactive activity'}
										{#if item.public}
											· Public
										{:else if item.type === 'quiz'}
											· Private
										{/if}
									</span>
									<h3
										class="mt-1 truncate text-lg font-bold text-[var(--qq-ink)]"
									>
										{item.title || 'Untitled'}
									</h3>
								</div>
								{#if item.type === 'quiz'}
									<button
										type="button"
										class="shrink-0 rounded-lg p-2 text-sm font-semibold text-[var(--qq-muted)] hover:bg-[var(--qq-green-soft)]"
										aria-label={`Show analytics for ${item.title}`}
										title="Show quiz analytics"
										onclick={() =>
											(analyticsQuiz = {
												likes: item.likes ?? 0,
												dislikes: item.dislikes ?? 0,
												plays: item.plays ?? 0,
												views: item.views ?? 0
											})}>Stats</button
									>
								{/if}
							</div>
							<p class="mt-2 line-clamp-2 min-h-10 text-sm text-[var(--qq-muted)]">
								{item.description || 'No description yet.'}
							</p>
							<!-- SvelteKit route resolution doesn't accept these dynamic search parameters. -->
							<!-- eslint-disable svelte/no-navigation-without-resolve -->
							<div class="mt-auto flex flex-wrap gap-2 pt-4">
								{#if item.type === 'quiz'}
									<a
										href={`${resolve('/edit')}?quiz_id=${encodeURIComponent(item.id)}`}
										class="qq-button-primary">Edit</a
									>
									{#if item.public}
										<a
											href={resolve('/view/[quiz_id]', { quiz_id: item.id })}
											class="qq-button-secondary">Preview</a
										>
									{/if}
									<button
										type="button"
										class="qq-button-secondary"
										onclick={() => (startGameId = item.id)}
									>
										{$t('start_game.start_game')}
									</button>
									<button
										type="button"
										class="qq-button-secondary"
										onclick={() => (downloadId = item.id)}
									>
										{$t('words.download')}
									</button>
								{:else}
									<a
										href={`${resolve('/quiztivity/edit')}?id=${encodeURIComponent(item.id)}`}
										class="qq-button-primary">Edit</a
									>
									<a
										href={`${resolve('/quiztivity/play')}?id=${encodeURIComponent(item.id)}`}
										class="qq-button-secondary">Open</a
									>
								{/if}
								<button
									type="button"
									class="qq-button-secondary"
									aria-label={`Delete ${item.title}`}
									onclick={() => void deleteQuiz(item)}>Delete</button
								>
							</div>
							<!-- eslint-enable svelte/no-navigation-without-resolve -->
						</div>
					</article>
				{/each}
			</div>
		{/if}

		{#if loadMoreError}
			<p
				class="mt-5 rounded-xl border border-red-300 bg-red-50 p-4 text-red-900"
				role="alert"
			>
				{loadMoreError}
			</p>
		{/if}
		{#if hasMore}
			<div class="mt-8 text-center">
				<button
					type="button"
					class="qq-button-secondary"
					disabled={loadingMore}
					onclick={() => void loadMore()}
				>
					{loadingMore ? 'Loading more…' : 'Load more quizzes'}
				</button>
			</div>
		{/if}
	</section>
</main>
<Footer />
{#if startGameId}
	<StartGamePopup bind:quiz_id={startGameId} />
{/if}
<DownloadQuiz bind:quiz_id={downloadId} />
