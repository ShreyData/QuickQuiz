<!--
SPDX-FileCopyrightText: 2023 Marlon W (Mawoka)

SPDX-License-Identifier: MPL-2.0
-->

<script lang="ts">
	import { run } from 'svelte/legacy';

	import type { EditorData } from '$lib/quiz_types';
	import { QuizQuestionType } from '$lib/quiz_types';
	import RangeEditor from '$lib/editor/RangeSelectorEditorPart.svelte';
	import { reach } from 'yup';
	import { dataSchema } from '$lib/yupSchemas';
	import Spinner from '../Spinner.svelte';
	import { createTippy } from 'svelte-tippy';
	import { getLocalization } from '$lib/i18n';
	import MediaComponent from '$lib/editor/MediaComponent.svelte';
	import { fade } from 'svelte/transition';
	import BrownButton from '$lib/components/buttons/brown.svelte';
	import LoadError from '$lib/editor/LoadError.svelte';
	import { loadEditorComponent } from '$lib/editor/loadEditorComponent';
	// import MediaComponent from "$lib/editor/MediaComponent.svelte";

	const { t } = getLocalization();

	const tippy = createTippy({
		arrow: true,
		animation: 'perspective-subtle',
		placement: 'top'
	});

	interface Props {
		data: EditorData;
		selected_question: number;
		edit_id: string;
	}

	let {
		data = $bindable(),
		selected_question = $bindable(),
		edit_id = $bindable()
	}: Props = $props();

	let advanced_options_open = $state(false);

	let uppyOpen = $state(false);
	let unique = $state({});

	/*eslint no-unused-vars: ["error", { "argsIgnorePattern": "^_" }]*/
	const correctTimeInput = (_) => {
		let time = data.questions[selected_question].time;
		if (time === null || time === undefined) {
			data.questions[selected_question].time = '';
			time = '';
		}
		if (data.questions[selected_question].time > 3) {
			data.questions[selected_question].time = data.questions[selected_question].time
				.toString()
				.slice(0, 3);
		}
	};
	const set_unique = () => {
		unique = {};
	};
	run(() => {
		correctTimeInput(data.questions[selected_question].time);
	});
	run(() => {
		selected_question;
		set_unique();
	});
	let image_url = $state('');

	const update_image_url = () => {
		image_url = data.questions[selected_question].image;
	};
	run(() => {
		update_image_url();
		selected_question;
		data.questions;
	});

	const type_to_name = {
		RANGE: $t('words.range'),
		ABCD: $t('words.multiple_choice'),
		VOTING: $t('words.voting'),
		TEXT: $t('words.text'),
		ORDER: $t('words.order'),
		CHECK: $t('words.check_choice')
	};

	/*
    if (typeof data.questions[selected_question].type !== QuizQuestionType) {
        console.log(data.questions[selected_question].type !== QuizQuestionType.ABCD || data.questions[selected_question].type !== QuizQuestionType.RANGE)
        data.questions[selected_question].type = QuizQuestionType.ABCD;
    }
     */
</script>

<div class="mx-auto h-full w-full max-w-5xl px-3 pb-10 sm:px-6">
	<div class="qq-card min-h-full overflow-hidden">
		<header
			class="flex items-center justify-between gap-4 border-b border-[var(--qq-border)] px-4 py-3 sm:px-6"
		>
			<div class="min-w-0">
				<p class="text-xs font-bold uppercase tracking-wider text-[var(--qq-muted)]">
					Question {selected_question + 1}
				</p>
				<h1 class="truncate text-lg font-bold text-[var(--qq-ink)]">
					{type_to_name[String(data.questions[selected_question].type)] ?? 'Question'}
				</h1>
			</div>
			<button
				class="qq-button-secondary min-h-10 px-3 py-2"
				type="button"
				aria-label={$t('editor.advanced_settings')}
				use:tippy={{ content: $t('editor.advanced_settings') }}
				onclick={() => (advanced_options_open = true)}
			>
				<svg
					class="h-5 w-5 text-[var(--qq-ink)]"
					aria-hidden="true"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
					<path
						d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</button>
		</header>
		{#if data.questions[selected_question].type === QuizQuestionType.SLIDE}
			{#await loadEditorComponent(import('./slide.svelte'))}
				<Spinner my_20={false} />
			{:then c}
				<c.default bind:data={data.questions[selected_question]} />
			{:catch}
				<LoadError />
			{/await}
		{:else}
			{@const type = data.questions[selected_question].type}
			<div class="flex flex-col px-4 pb-8 sm:px-8">
				<div class="mx-auto flex w-full max-w-3xl justify-center pt-8">
					{#key unique}
						{#await loadEditorComponent(import('$lib/inline-editor.svelte'))}
							<Spinner my_20={false} />
						{:then c}
							<div
								class="rounded-lg placeholder:italic placeholder:font-normal"
								class:bg-yellow-500={!reach(
									dataSchema,
									'questions[].question'
								).isValidSync(data.questions[selected_question].question)}
							>
								<c.default
									bind:text={data.questions[selected_question].question}
									label={`Question ${selected_question + 1} text`}
								/>
							</div>
						{:catch}
							<LoadError />
						{/await}
					{/key}
				</div>
				{#if data.questions[selected_question].image}
					<div class="flex h-72 w-full justify-center pt-8">
						<div class="h-72 relative">
							<button
								class="rounded-full absolute -top-2 -right-2 opacity-70 hover:opacity-100 transition"
								type="button"
								aria-label="Remove question image"
								onclick={() => {
									data.questions[selected_question].image = null;
								}}
							>
								<svg
									class="w-6 h-6 bg-red-500 rounded-full"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
							</button>
							<MediaComponent bind:src={image_url} />
						</div>
					</div>
				{:else}
					{#await loadEditorComponent(import('$lib/editor/uploader.svelte'))}
						<Spinner my_20={false} />
					{:then c}
						<c.default
							bind:modalOpen={uppyOpen}
							bind:edit_id
							bind:data
							bind:selected_question
							video_upload={true}
						/>
					{:catch}
						<LoadError />
					{/await}
				{/if}
				<div class="mt-6 flex justify-center">
					<div
						class="flex items-center gap-2 rounded-xl border border-[var(--qq-border)] px-3 py-2"
					>
						<svg
							class="w-8 h-8 inline-block"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<input
							type="number"
							max="999"
							min="1"
							class="qq-input w-24 p-2 text-center"
							bind:value={data.questions[selected_question].time}
						/>
						<p class="inline-block">s</p>
					</div>
				</div>
				<div class="mt-4 flex w-full justify-center">
					{#if type === QuizQuestionType.ABCD || type === QuizQuestionType.CHECK}
						{#await loadEditorComponent(import('$lib/editor/ABCDEditorPart.svelte'))}
							<Spinner my_20={false} />
						{:then c}
							<c.default
								bind:data
								bind:selected_question
								check_choice={type === QuizQuestionType.CHECK}
							/>
						{:catch}
							<LoadError />
						{/await}
					{:else if type === QuizQuestionType.RANGE}
						<RangeEditor bind:selected_question bind:data />
					{:else if type === QuizQuestionType.VOTING}
						{#await loadEditorComponent(import('$lib/editor/VotingEditorPart.svelte'))}
							<Spinner my_20={false} />
						{:then c}
							<c.default bind:data bind:selected_question />
						{:catch}
							<LoadError />
						{/await}
					{:else if type === QuizQuestionType.TEXT}
						{#await loadEditorComponent(import('$lib/editor/TextEditorPart.svelte'))}
							<Spinner my_20={false} />
						{:then c}
							<c.default bind:data bind:selected_question />
						{:catch}
							<LoadError />
						{/await}
					{:else if type === QuizQuestionType.ORDER}
						{#await loadEditorComponent(import('$lib/editor/OrderEditorPart.svelte'))}
							<Spinner my_20={false} />
						{:then c}
							<c.default bind:data bind:selected_question />
						{:catch}
							<LoadError />
						{/await}
					{/if}
				</div>
			</div>
		{/if}
	</div>
</div>

{#if advanced_options_open}
	<div
		class="fixed top-0 left-0 w-full h-full bg-black/60 flex"
		transition:fade|global={{ duration: 150 }}
	>
		<div
			class="w-1/4 h-1/3 m-auto bg-white dark:bg-gray-700 rounded-lg flex flex-col p-2 gap-2"
		>
			<h1 class="text-3xl mx-auto">{$t('editor.advanced_settings')}</h1>
			<label class="flex justify-around text-lg">
				<span class="my-auto">{$t('editor.hide_question_results')}</span>
				<input
					type="checkbox"
					bind:checked={data.questions[selected_question]['hide_results']}
				/>
			</label>
			<div class="mt-auto w-full">
				<BrownButton onclick={() => (advanced_options_open = false)}
					>{$t('words.close')}</BrownButton
				>
			</div>
		</div>
	</div>
{/if}
