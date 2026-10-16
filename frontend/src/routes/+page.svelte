<!--
SPDX-FileCopyrightText: 2023 Marlon W (Mawoka)

SPDX-License-Identifier: MPL-2.0
-->

<script lang="ts">
	import { navbarVisible } from '$lib/stores.svelte.ts';
	import { getLocalization } from '$lib/i18n';
	import Footer from '$lib/footer.svelte';
	import { fade } from 'svelte/transition';

	import FindScreenshot from '$lib/assets/landing_new/find.webp';
	import ImportScreenshot from '$lib/assets/landing_new/import.webp';
	import EditScreenshot from '$lib/assets/landing_new/edit.webp';
	import SelectScreenshot from '$lib/assets/landing_new/select.webp';
	import ResultScreenshot from '$lib/assets/landing_new/result.webp';
	import WinnersScreenshot from '$lib/assets/landing_new/winners.webp';

	const { t } = getLocalization();

	navbarVisible.visible = true;

	// eslint-disable-next-line no-unused-vars
	enum SelectedCreateThing {
		// eslint-disable-next-line no-unused-vars
		Create,
		// eslint-disable-next-line no-unused-vars
		Find,
		// eslint-disable-next-line no-unused-vars
		Import
	}

	// eslint-disable-next-line no-unused-vars
	enum SelectedPlayThing {
		// eslint-disable-next-line no-unused-vars
		Select,
		// eslint-disable-next-line no-unused-vars
		Results,
		// eslint-disable-next-line no-unused-vars
		Winners
	}

	let selected_create_thing = $state(SelectedCreateThing.Create);
	let selected_play_thing = $state(SelectedPlayThing.Select);

	const quickquiz_reasons = [
		{
			headline: $t('index_page.no_player_limit'),
			content: $t('index_page.no_player_limit_content')
		},
		{
			headline: $t('index_page.no_tracking'),
			content: $t('index_page.no_tracking_content')
		},
		{
			headline: $t('index_page.self_hostable'),
			content: $t('index_page.self_hostable_content')
		},
		{
			headline: $t('index_page.user_friendly'),
			content: $t('index_page.user_friendly_content')
		},
		{
			headline: $t('index_page.quiz_results_downloadable'),
			content: $t('index_page.quiz_results_downloadable_content')
		},
		{
			headline: $t('index_page.multilingual'),
			content: $t('index_page.multilingual_content')
		},
		{
			headline: $t('index_page.dark_mode'),
			content: $t('index_page.dark_mode_content')
		},
		{
			headline: $t('index_page.download_quizzes'),
			content: $t('index_page.download_quizzes_content')
		}
	];
	let selected_quickquiz_reason = $state(0);
</script>

<svelte:head>
	<title>QuickQuiz - {$t('index_page.meta.title')}</title>
	<meta name="description" content={$t('index_page.meta.description')} />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="QuickQuiz - {$t('index_page.meta.title')}" />
	<meta property="og:description" content={$t('index_page.meta.description')} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="QuickQuiz - {$t('index_page.meta.title')}" />
	<meta name="twitter:description" content={$t('index_page.meta.description')} />
</svelte:head>
<div class="min-h-screen flex flex-col">
	<section class="pb-20">
		<div class="pt-12 text-center">
			<h1 class="sm:text-7xl text-5xl mt-6 font-bold tracking-tight">QuickQuiz</h1>
			<p class="text-xl mt-4">{$t('index_page.slogan')}</p>
			<div class="mt-8 flex flex-wrap justify-center gap-3">
				<a
					href="/create"
					class="rounded-lg bg-[#4e6e58] px-6 py-3 font-semibold text-white shadow transition hover:bg-[#3f5d49] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
					>{$t('words.create')}</a
				>
				<a
					href="/explore"
					class="rounded-lg border border-gray-700 bg-white/70 px-6 py-3 font-semibold text-gray-900 transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
					>{$t('words.explore')}</a
				>
			</div>
		</div>
	</section>
	<section>
		<h2 class="text-center text-5xl mb-6">{$t('index_page.how_does_classquiz_work')}</h2>

		<div class="flex justify-center w-full">
			<h3 class="text-center text-3xl rounded-t-lg bg-white/40 py-2 px-6">
				{$t('index_page.get_a_quiz')}
			</h3>
		</div>
		<div
			class="grid grid-rows-2 lg:grid-rows-1 lg:grid-cols-2 bg-white/40 shadow-lg mb-12 lg:mx-12 mx-4 rounded-lg"
		>
			<div>
				<div class="p-2 rounded-lg">
					{#if selected_create_thing === SelectedCreateThing.Create}
						<img
							class="rounded-lg relative"
							src={EditScreenshot}
							in:fade|global
							alt="Screenshot of the import-page showing an URL to Kahoot! entered"
						/>
					{:else if selected_create_thing === SelectedCreateThing.Find}
						<img
							class="rounded-lg relative"
							src={FindScreenshot}
							in:fade|global
							alt="Screenshot of the search-page showing one found quiz for the term 'Country'"
						/>
					{:else if selected_create_thing === SelectedCreateThing.Import}
						<img
							class="rounded-lg relative"
							src={ImportScreenshot}
							in:fade|global
							alt="Screenshot of the import-page showing an URL to Kahoot! entered"
						/>
					{:else}
						<p>Shouldn't happen!</p>
					{/if}
				</div>
			</div>
			<div
				class="lg:border-l lg:border-l-black lg:border-t-0 border-t border-t-black flex lg:flex-col flex-row stretch"
			>
				<div
					class="m-2 rounded-lg p-2 bg-white/40 transition-all cursor-pointer lg:h-full"
					onclick={() => {
						selected_create_thing = SelectedCreateThing.Create;
					}}
					onkeyup={() => {
						selected_create_thing = SelectedCreateThing.Create;
					}}
					class:shadow-2xl={selected_create_thing === SelectedCreateThing.Create}
					class:opacity-70={selected_create_thing !== SelectedCreateThing.Create}
					role="button"
					tabindex="0"
				>
					<div
						class="rounded-lg w-fit p-1 bg-lime-500 hover:bg-lime-400 transition shadow-lg"
					>
						<svg
							aria-label="Pencil-Icon"
							class="w-8 h-8 text-black"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
							/>
						</svg>
					</div>
					<h5 class="text-xl w-fit dark:text-black">{$t('words.create')}</h5>
					<p class="dark:text-black">{$t('index_page.create_a_quiz_from_scratch')}</p>
				</div>
				<div
					class="m-2 rounded-lg p-2 bg-white/40 transition-all cursor-pointer lg:h-full"
					onclick={() => {
						selected_create_thing = SelectedCreateThing.Find;
					}}
					onkeyup={() => {
						selected_create_thing = SelectedCreateThing.Find;
					}}
					role="button"
					tabindex="0"
					class:shadow-2xl={selected_create_thing === SelectedCreateThing.Find}
					class:opacity-70={selected_create_thing !== SelectedCreateThing.Find}
				>
					<div
						class="rounded-lg w-fit p-1 bg-lime-500 hover:bg-lime-400 transition shadow-lg"
					>
						<svg
							class="w-8 h-8 text-black"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
							aria-label="magnifying glass-Icon"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
							/>
						</svg>
					</div>
					<h5 class="text-xl dark:text-black">{$t('words.find')}</h5>
					<p class="dark:text-black">{$t('index_page.find_or_explore')}</p>
				</div>
			</div>
		</div>
	</section>

	<section class="mt-24">
		<div class="flex justify-center w-full">
			<h2 class="text-center text-3xl rounded-t-lg bg-white/40 py-2 px-6">
				{$t('index_page.play_quiz')}
			</h2>
		</div>

		<div
			class="grid grid-rows-2 lg:grid-rows-1 lg:grid-cols-2 bg-white/40 shadow-lg mb-12 lg:mx-12 mx-4 rounded-lg"
		>
			<div>
				<div class="p-2 rounded-lg">
					{#if selected_play_thing === SelectedPlayThing.Select}
						<img
							class="rounded-lg relative"
							src={SelectScreenshot}
							in:fade|global
							alt="Screenshot of the screen where an answer can be selected"
						/>
					{:else if selected_play_thing === SelectedPlayThing.Results}
						<img
							class="rounded-lg relative"
							src={ResultScreenshot}
							in:fade|global
							alt="Screenshot of the results with a table showing how many players chose which answer"
						/>
					{:else if selected_play_thing === SelectedPlayThing.Winners}
						<img
							class="rounded-lg relative"
							src={WinnersScreenshot}
							in:fade|global
							alt="Screenshot of the import-page showing an URL to Kahoot! entered"
						/>
					{:else}
						<p>Shouldn't happen!</p>
					{/if}
				</div>
			</div>
			<div
				class="lg:border-l lg:border-l-black lg:border-t-0 border-t border-t-black flex lg:flex-col flex-row stretch"
			>
				<div
					class="m-2 rounded-lg p-2 bg-white/40 transition-all cursor-pointer lg:h-full"
					onclick={() => {
						selected_play_thing = SelectedPlayThing.Select;
					}}
					onkeyup={() => {
						selected_play_thing = SelectedPlayThing.Select;
					}}
					role="button"
					tabindex="0"
					class:shadow-2xl={selected_play_thing === SelectedPlayThing.Select}
					class:opacity-70={selected_play_thing !== SelectedPlayThing.Select}
				>
					<div
						class="rounded-lg bg-emerald-300 w-fit p-1 hover:bg-lime-400 transition shadow-lg"
					>
						<svg
							aria-label="Mouse-Click icon"
							class="w-8 h-8 text-black"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
							/>
						</svg>
					</div>
					<h5 class="text-xl w-fit dark:text-black">{$t('index_page.select_answer')}</h5>
					<p class="dark:text-black">{$t('index_page.choose_answer_wisely')}</p>
				</div>
				<div
					class="m-2 rounded-lg p-2 bg-white/40 transition-all cursor-pointer lg:h-full"
					role="button"
					tabindex="0"
					onclick={() => {
						selected_play_thing = SelectedPlayThing.Results;
					}}
					onkeyup={() => {
						selected_play_thing = SelectedPlayThing.Results;
					}}
					class:shadow-2xl={selected_play_thing === SelectedPlayThing.Results}
					class:opacity-70={selected_play_thing !== SelectedPlayThing.Results}
				>
					<div
						class="rounded-lg bg-emerald-300 w-fit p-1 hover:bg-lime-400 transition shadow-lg"
					>
						<svg
							aria-label="context-menu icon"
							class="w-8 h-8 text-black"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 6h16M4 10h16M4 14h16M4 18h16"
							/>
						</svg>
					</div>
					<h5 class="text-xl dark:text-black">{$t('index_page.view_results')}</h5>
					<p class="dark:text-black">{$t('index_page.check_if_chosen_wisely')}</p>
				</div>
				<div
					class="m-2 rounded-lg p-2 bg-white/40 transition-all cursor-pointer lg:h-full"
					role="button"
					tabindex="0"
					onclick={() => {
						selected_play_thing = SelectedPlayThing.Winners;
					}}
					onkeyup={() => {
						selected_play_thing = SelectedPlayThing.Winners;
					}}
					class:shadow-2xl={selected_play_thing === SelectedPlayThing.Winners}
					class:opacity-70={selected_play_thing !== SelectedPlayThing.Winners}
				>
					<div
						class="rounded-lg bg-emerald-300 w-fit p-1 hover:bg-lime-400 transition shadow-lg"
					>
						<svg
							aria-label="sparkling stars-icon"
							class="w-8 h-8 text-black"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
							/>
						</svg>
					</div>
					<h5 class="text-xl dark:text-black">{$t('index_page.list_winners')}</h5>
					<p class="dark:text-black">{$t('index_page.get_ranking_and_winners')}</p>
				</div>
			</div>
		</div>
	</section>

	<section class="mt-24">
		<div class="flex justify-center w-full">
			<h2 class="text-center text-3xl rounded-t-lg bg-white/40 py-2 px-6">
				QuickQuiz highlights
			</h2>
		</div>

		<div
			class="grid grid-rows-2 lg:grid-rows-1 lg:grid-cols-2 bg-white/40 shadow-lg mb-12 lg:mx-12 mx-4 rounded-lg"
		>
			<div>
				<div class="p-12 rounded-lg flex justify-center items-center h-full">
					<p class="dark:text-black">
						{quickquiz_reasons[selected_quickquiz_reason].content}
					</p>
				</div>
			</div>
			<div
				class="lg:border-l lg:border-l-black lg:border-t-0 border-t border-t-black flex lg:flex-col flex-row stretch overflow-x-auto why-quickquiz"
			>
				{#each quickquiz_reasons as reason, index}
					<div
						class="m-2 rounded-lg p-2 bg-white/40 transition-all cursor-pointer lg:h-full"
						role="button"
						tabindex="0"
						onclick={() => {
							selected_quickquiz_reason = index;
						}}
						onkeyup={() => {
							selected_quickquiz_reason = index;
						}}
						class:shadow-2xl={selected_quickquiz_reason === index}
						class:opacity-70={selected_quickquiz_reason !== index}
					>
						<h5 class="text-xl dark:text-black">{reason.headline}</h5>
					</div>
				{/each}
			</div>
		</div>
	</section>
</div>
<Footer />

<style>
	.why-quickquiz::-webkit-scrollbar {
		height: 0.8rem;
		margin-bottom: 5rem;
	}

	.why-quickquiz::-webkit-scrollbar-track {
		box-shadow: inset 0 0 10px 10px transparent;
		border: solid 3px transparent;
	}

	.why-quickquiz::-webkit-scrollbar-thumb {
		box-shadow: inset 0 0 10px 10px #374151;
		border: solid 3px transparent;
		border-radius: 15px;
	}

	.why-quickquiz::-webkit-scrollbar-thumb:hover {
		box-shadow: inset 0 0 10px 10px #555;
		border: solid 3px transparent;
	}
</style>
