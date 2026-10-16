<!--
SPDX-FileCopyrightText: 2023 Marlon W (Mawoka)

SPDX-License-Identifier: MPL-2.0
-->

<script lang="ts">
	import type { Answers, Question } from '$lib/quiz_types';
	import { QuizQuestionType } from '$lib/quiz_types';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { getLocalization } from '$lib/i18n';

	interface Props {
		questions: Question[];
		open: boolean;
		selected_question: number;
	}

	let {
		questions = $bindable(),
		open = $bindable(),
		selected_question = $bindable()
	}: Props = $props();

	const { t } = getLocalization();
	onMount(() => {
		document.body.addEventListener('keydown', close_start_game_if_esc_is_pressed);
		return () =>
			document.body.removeEventListener('keydown', close_start_game_if_esc_is_pressed);
	});
	const close_start_game_if_esc_is_pressed = (key: KeyboardEvent) => {
		if (key.code === 'Escape') {
			open = false;
		}
	};
	const on_parent_click = (e: Event) => {
		if (e.target === e.currentTarget) {
			open = false;
		}
	};

	const question_types: {
		name: string;
		description: string;
		answers: Answers;
		type: QuizQuestionType;
	}[] = [
		{
			name: $t('words.multiple_choice'),
			description: $t('editor.abcd_description'),
			answers: [],
			type: QuizQuestionType.ABCD
		},
		{
			name: $t('words.voting'),
			description: $t('editor.voting_description'),
			answers: [],
			type: QuizQuestionType.VOTING
		},
		{
			name: $t('words.check_choice'),
			description: $t('editor.check_choice_description'),
			answers: [],
			type: QuizQuestionType.CHECK
		},
		{
			name: $t('words.order'),
			description: $t('editor.order_description'),
			answers: [],
			type: QuizQuestionType.ORDER
		},
		{
			name: $t('words.text'),
			description: $t('editor.text_description'),
			answers: [],
			type: QuizQuestionType.TEXT
		},
		{
			name: $t('words.range'),
			description: $t('editor.range_description'),
			answers: {
				max: 10,
				min: 0,
				max_correct: 7,
				min_correct: 3
			},
			type: QuizQuestionType.RANGE
		}
	];

	const add_question = (index: number) => {
		const empty_question: Question = {
			type: question_types[index].type,
			time: '20',
			question: '',
			image: undefined,
			answers: question_types[index].answers
		};
		questions = [...questions, { ...empty_question }];
		selected_question = questions.length - 1;
		open = false;
	};
</script>

<div
	class="fixed top-0 left-0 w-screen h-screen flex bg-black/50 z-50"
	onclick={on_parent_click}
	transition:fade={{ duration: 100 }}
	role="presentation"
>
	<div
		class="m-auto flex h-[85vh] w-[calc(100%-2rem)] max-w-5xl flex-col rounded-lg bg-white p-4 shadow-2xl dark:bg-gray-600 sm:p-6"
		role="dialog"
		aria-modal="true"
		aria-labelledby="question-type-title"
	>
		<div class="mb-6 flex items-start justify-between gap-4">
			<h1 class="text-2xl font-semibold sm:text-3xl" id="question-type-title">
				{$t('quiztivity.editor.select_page_type')}
			</h1>
			<button
				class="rounded-lg px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-500"
				type="button"
				onclick={() => (open = false)}
				aria-label="Close question type selector">Close</button
			>
		</div>
		<div class="grid grid-cols-1 gap-3 overflow-y-auto sm:grid-cols-2 lg:grid-cols-3">
			{#each question_types as qt, i}
				<div
					class="rounded-lg border border-[#B07156] p-4 transition hover:bg-[#d6edc9]/40"
				>
					<button
						class="w-full text-left text-lg font-semibold text-black dark:text-white"
						onclick={() => {
							add_question(i);
						}}>{qt.name}</button
					>
					<p class="mt-2 text-sm text-gray-700 dark:text-gray-200">{qt.description}</p>
				</div>
			{/each}
		</div>

		<div class="mt-auto flex justify-center">
			<p>
				{$t('editor.need_more_help')}
				<a
					href="/docs/quiz/question-types"
					target="_blank"
					class="text-sm font-bold underline text-blue-500 dark:text-blue-400"
					>{$t('editor.visit_docs')}</a
				>
			</p>
		</div>
	</div>
</div>
