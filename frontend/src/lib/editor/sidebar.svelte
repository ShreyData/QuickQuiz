<!--
SPDX-FileCopyrightText: 2023 Marlon W (Mawoka)

SPDX-License-Identifier: MPL-2.0
-->

<script lang="ts">
	import type { EditorData, Question } from '../quiz_types';
	import { QuizQuestionType } from '$lib/quiz_types';
	import { reach } from 'yup';
	import { ABCDQuestionSchema, dataSchema } from '../yupSchemas';
	import { createTippy } from 'svelte-tippy';
	import { getLocalization } from '$lib/i18n';
	import AddNewQuestionPopup from '$lib/editor/AddNewQuestionPopup.svelte';

	const { t } = getLocalization();

	interface Props {
		data: EditorData;
		selected_question?: number;
	}

	let { data = $bindable(), selected_question = $bindable(-1) }: Props = $props();

	let reorder_mode = $state(false);

	const tippy = createTippy({
		arrow: true,
		animation: 'perspective-subtle',
		placement: 'right'
	});
	let arr_of_cards: (HTMLDivElement | undefined)[] = $state(
		Array(data.questions.length).fill(undefined)
	);
	let propertyCard: HTMLDivElement | undefined = $state();
	let add_new_question_popup_open = $state(false);

	const empy_slide: Question = {
		type: QuizQuestionType.SLIDE,
		time: '120',
		question: 'Slide',
		image: undefined,
		answers: ''
	};

	const swapArrayElements = (arr, a: number, b: number) => {
		let _arr = [...arr];
		let temp = _arr[a];
		_arr[a] = _arr[b];
		_arr[b] = temp;
		return _arr;
	};

	const setSelectedQuestion = (index: number): void => {
		if (reorder_mode) {
			return;
		}
		selected_question = index;
		if (index === -1) {
			propertyCard?.scrollIntoView({
				behavior: 'smooth'
			});
		} else {
			arr_of_cards[index]?.scrollIntoView({
				behavior: 'smooth'
			});
		}
	};
	/*	onMount(() => {
            propertyCard.scrollIntoView({
                behavior: 'smooth'
            });
        });*/
</script>

<div class="flex h-full min-h-0 flex-col">
	<div
		class="flex shrink-0 items-center justify-between gap-2 border-b border-[var(--qq-border)] px-3 py-2.5 sm:px-4"
	>
		<div class="min-w-0">
			<h2 class="truncate text-sm font-bold text-[var(--qq-ink)]">Quiz outline</h2>
			<p class="text-xs text-[var(--qq-muted)]">
				{data.questions.length}
				{data.questions.length === 1 ? 'question' : 'questions'}
			</p>
		</div>
		<button
			type="button"
			class="qq-button-secondary min-h-9 px-2.5 py-1.5 text-xs"
			aria-pressed={reorder_mode}
			onclick={() => (reorder_mode = !reorder_mode)}
		>
			{#if reorder_mode}Done{:else}Reorder{/if}
		</button>
	</div>
	<div
		class="flex min-h-0 flex-1 gap-2 overflow-x-auto overscroll-contain px-3 py-3 md:flex-col md:overflow-x-hidden md:overflow-y-auto md:px-4"
	>
		<article
			bind:this={propertyCard}
			class="qq-card w-[min(78vw,18rem)] shrink-0 p-3 transition md:w-auto"
			style:background-color={selected_question === -1 ? 'var(--qq-green-soft)' : undefined}
			style:border-color={selected_question === -1 ? 'var(--qq-green)' : undefined}
		>
			<button
				type="button"
				class="mb-2 flex w-full items-center justify-between text-left text-[0.7rem] font-bold uppercase tracking-wider text-[var(--qq-muted)]"
				aria-current={selected_question === -1 ? 'page' : undefined}
				onclick={() => setSelectedQuestion(-1)}
			>
				<span>Quiz details</span>
				<span class="text-xs font-semibold normal-case tracking-normal">Edit</span>
			</button>
			<div
				use:tippy={{ content: data.title === '' ? "It's empty!" : data.title }}
				class="rounded-lg border border-[var(--qq-border)] p-1 transition"
				class:border-red-600={!reach(dataSchema, 'title').isValidSync(data.title)}
				class:border-solid={!reach(dataSchema, 'title').isValidSync(data.title)}
				class:border-2={!reach(dataSchema, 'title').isValidSync(data.title)}
			>
				<p
					class="w-full truncate rounded-sm bg-transparent text-left font-semibold text-[var(--qq-ink)]"
				>
					{#if data.title}
						{@html data.title}
					{:else}
						<i>{$t('editor.no_title')}</i>
					{/if}
				</p>
			</div>
			<div
				use:tippy={{ content: data.description === '' ? "It's empty!" : data.description }}
				class="rounded-lg border border-[var(--qq-border)] p-1 transition"
				class:border-red-600={!reach(dataSchema, 'description').isValidSync(
					data.description
				)}
				class:border-solid={!reach(dataSchema, 'description').isValidSync(data.description)}
				class:border-2={!reach(dataSchema, 'description').isValidSync(data.description)}
			>
				<textarea
					bind:value={data.description}
					class="w-full resize-none rounded-sm bg-transparent text-xs text-[var(--qq-ink)]"
				></textarea>
			</div>
			<div class="mt-1 flex w-full justify-start text-[var(--qq-muted)]">
				<button
					type="button"
					onclick={() => {
						data.public = !data.public;
					}}
					class="rounded-md px-2 py-1 text-xs font-semibold hover:bg-[var(--qq-green-soft)]"
				>
					{#if data.public}
						<svg
							class="w-5 h-5 inline-block"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<span>{$t('words.public')}</span>
					{:else}
						<svg
							class="w-5 h-5 inline-block"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
							/>
						</svg>
						<span>{$t('words.private')}</span>
					{/if}
				</button>
			</div>
		</article>
		{#each data.questions as question, index (question)}
			<article
				class="qq-card w-[min(78vw,18rem)] shrink-0 p-3 transition md:w-auto"
				style:background-color={index === selected_question
					? 'var(--qq-green-soft)'
					: undefined}
				style:border-color={index === selected_question ? 'var(--qq-green)' : undefined}
				bind:this={arr_of_cards[index]}
			>
				<div class="mb-2 flex items-center justify-between gap-2">
					<button
						type="button"
						class="min-w-0 flex-1 truncate text-left text-[0.65rem] font-bold uppercase tracking-wider text-[var(--qq-muted)]"
						aria-current={index === selected_question ? 'page' : undefined}
						onclick={() => setSelectedQuestion(index)}
					>
						Question {index + 1}
					</button>
					<span
						class="rounded-full bg-[var(--qq-green-soft)] px-2 py-0.5 text-[0.65rem] font-semibold text-[var(--qq-ink)]"
					>
						{question.type ?? 'Question'}
					</span>
					{#if reorder_mode}
						<button
							type="button"
							class="rounded-lg p-1.5 text-[var(--qq-muted)] hover:bg-[var(--qq-green-soft)] disabled:opacity-40"
							aria-label={`Move question ${index + 1} up`}
							title="Move up"
							disabled={index === 0}
							onclick={() => {
								data.questions = swapArrayElements(
									data.questions,
									index,
									index - 1
								);
							}}
						>
							<svg
								class="h-4 w-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="m5 15 7-7 7 7"
								/>
							</svg>
						</button>
						<button
							type="button"
							class="rounded-lg p-1.5 text-[var(--qq-muted)] hover:bg-[var(--qq-green-soft)] disabled:opacity-40"
							aria-label={`Move question ${index + 1} down`}
							title="Move down"
							disabled={index + 1 === data.questions.length}
							onclick={() => {
								data.questions = swapArrayElements(
									data.questions,
									index,
									index + 1
								);
							}}
						>
							<svg
								class="h-4 w-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="m19 9-7 7-7-7"
								/>
							</svg>
						</button>
					{/if}
					<button
						class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[var(--qq-muted)] transition hover:bg-red-50 hover:text-red-700"
						type="button"
						aria-label={`Delete question ${index + 1}`}
						title="Delete question"
						onclick={() => {
							if (confirm('Do you really want to delete this Question?')) {
								selected_question = -1;
								data.questions.splice(index, 1);
								data.questions = data.questions;
							}
						}}
					>
						<svg
							class="h-4 w-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 7h12m-10 0 .7 13h6.6L16 7M9 7V4h6v3m-5 4v5m4-5v5"
							/>
						</svg>
					</button>
				</div>
				<div class="space-y-2">
					<div
						use:tippy={{
							content: question.question === '' ? 'No title' : question.question
						}}
						class="m-1 border border-gray-500 rounded-lg p-0.5"
					>
						<h1
							class="whitespace-nowrap truncate text-center rounded-lg dark:text-white transition"
							class:bg-yellow-500={!reach(
								dataSchema,
								'questions[].question'
							).isValidSync(question.question)}
							class:dark:text-black={index === selected_question}
						>
							{#if question.question === ''}
								<span class="italic text-gray-500">{$t('editor.no_title')}</span>
							{:else}
								{@html question.question}
							{/if}
						</h1>
					</div>
					{#if question.image}
						<div class="flex justify-center align-middle pb-0.5">
							<img
								src="/api/v1/storage/download/{question.image}"
								class="h-10 border rounded-lg"
								alt="Not available"
								use:tippy={{
									content: `<img src="/api/v1/storage/download/${question.image}" alt="Not available" class="rounded-sm">`,
									allowHTML: true
								}}
							/>
						</div>
					{/if}

					{#if question.type === QuizQuestionType.ABCD || question.type === QuizQuestionType.CHECK}
						<div class="grid grid-cols-2 gap-2">
							{#if Array.isArray(question.answers)}
								{#each question.answers as answer, answerIndex (answerIndex)}
									<span
										class="whitespace-nowrap truncate rounded-lg p-0.5 text-sm text-center border border-gray-700"
										style:background-color={answer.color ??
											'var(--qq-surface-alt)'}
										style:color={answer.right ? '#065f46' : 'var(--qq-ink)'}
										class:font-semibold={answer.right}
										class:bg-yellow-500={!reach(
											ABCDQuestionSchema,
											'answer'
										).isValidSync(answer.answer)}
										use:tippy={{
											content:
												answer.answer === ''
													? $t('editor.empty')
													: answer.answer
										}}
										>{#if answer.answer === ''}
											<i>{$t('editor.empty')}</i>
										{:else}
											{answer.answer}
										{/if}</span
									>
								{/each}
							{/if}
						</div>
					{:else if question.type === QuizQuestionType.RANGE}
						<p class="text-center text-sm p-0.5">
							All numbers between {question.answers.min_correct}
							and {question.answers.max_correct} are correct, where numbers between {question
								.answers.min} and {question.answers.max} can be selected.
						</p>
					{:else if question.type === QuizQuestionType.VOTING || question.type === QuizQuestionType.TEXT}
						{#if Array.isArray(question.answers)}
							<div class="grid grid-cols-2 gap-2">
								{#each question.answers as answer, answerIndex (answerIndex)}
									<span
										class="whitespace-nowrap truncate rounded-lg p-0.5 text-sm text-center border border-gray-700"
										class:dark:bg-gray-500={answer.answer}
										class:bg-gray-300={answer.answer}
										class:bg-yellow-500={!reach(
											ABCDQuestionSchema,
											'answer'
										).isValidSync(answer.answer)}
										use:tippy={{
											content:
												answer.answer === ''
													? $t('editor.empty')
													: answer.answer
										}}
										>{#if answer.answer === ''}
											<i>{$t('editor.empty')}</i>
										{:else}
											{answer.answer}
										{/if}</span
									>
								{/each}
							</div>
						{/if}
					{:else if question.type === QuizQuestionType.SLIDE}
						<p>Some smart information on a slide</p>
					{:else if question.type === QuizQuestionType.ORDER}
						<p>Get thing's into the right order!</p>
					{:else}
						<p>Unknown Question Type (shouldn't happen)</p>
					{/if}
				</div>
			</article>
		{/each}
		<div
			class="grid h-28 w-[min(78vw,18rem)] shrink-0 grid-cols-2 overflow-hidden rounded-xl border border-dashed border-[var(--qq-border)] bg-[var(--qq-surface)] md:h-28 md:w-full"
		>
			<button
				type="button"
				class="flex h-full w-full flex-col items-center justify-center gap-1 border-r border-[var(--qq-border)] text-sm font-semibold text-[var(--qq-ink)] hover:bg-[var(--qq-green-soft)]"
				onclick={() => {
					add_new_question_popup_open = true;
				}}
			>
				<span class="w-full text-center">{$t('words.question')}</span>
				<svg
					class="h-6 w-6"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 6v6m0 0v6m0-6h6m-6 0H6"
					/>
				</svg>
			</button>
			<button
				type="button"
				class="flex h-full w-full flex-col items-center justify-center gap-1 text-sm font-semibold text-[var(--qq-ink)] hover:bg-[var(--qq-green-soft)]"
				onclick={() => {
					data.questions = [...data.questions, { ...empy_slide }];
				}}
			>
				<span class="w-full text-center">{$t('words.slide')}</span>
				<svg
					class="h-6 w-6"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 6v6m0 0v6m0-6h6m-6 0H6"
					/>
				</svg>
			</button>
		</div>
	</div>
</div>
{#if add_new_question_popup_open}
	<AddNewQuestionPopup
		bind:questions={data.questions}
		bind:open={add_new_question_popup_open}
		bind:selected_question
	/>
{/if}
