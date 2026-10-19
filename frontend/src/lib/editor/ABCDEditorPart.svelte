<!--
SPDX-FileCopyrightText: 2023 Marlon W (Mawoka)

SPDX-License-Identifier: MPL-2.0
-->

<script lang="ts">
	import { run, preventDefault } from 'svelte/legacy';

	import type { Answer, Answers, EditorData } from '../quiz_types';
	import { QuizQuestionType } from '../quiz_types';
	import { fade } from 'svelte/transition';
	import { getLocalization } from '$lib/i18n';
	import { get_foreground_color } from '$lib/helpers';

	const { t } = getLocalization();

	const default_colors = ['#F7C948', '#5B8DEF', '#4BC0A7', '#FF7B72'];
	const is_answer_array = (answers: Answers): answers is Answer[] =>
		Array.isArray(answers) &&
		answers.every(
			(answer) =>
				typeof answer === 'object' &&
				answer !== null &&
				'right' in answer &&
				'answer' in answer
		);

	interface Props {
		selected_question: number;
		check_choice?: boolean;
		data: EditorData;
	}

	let { selected_question, check_choice = false, data = $bindable() }: Props = $props();
	if (!Array.isArray(data.questions[selected_question].answers)) {
		data.questions[selected_question].answers = [];
	}
	const save_colors = (data_local: EditorData) => {
		const answers = data_local.questions[selected_question].answers;
		if (selected_question === 0 && is_answer_array(answers)) {
			for (const [index, answer] of answers.entries()) {
				localStorage.setItem(
					`quiz_color:${index}:${data_local.title}`,
					answer.color ?? default_colors[index % default_colors.length]
				);
			}
		}
	};

	const get_empty_answer = (i: number): Answer => {
		return {
			answer: '',
			color: default_colors[i],
			right: false
		};
	};
	const apply_default_colors = () => {
		const answers = data.questions[selected_question].answers;
		if (!Array.isArray(answers)) {
			return;
		}
		for (const [index, answer] of answers.entries()) {
			if ('right' in answer) {
				answer.color = default_colors[index];
			}
		}
	};
	run(() => {
		save_colors(data);
	});
	data.questions[selected_question].type =
		check_choice === true ? QuizQuestionType.CHECK : QuizQuestionType.ABCD;
	const set_colors_if_unset = () => {
		const answers = data.questions[selected_question].answers;
		if (!is_answer_array(answers)) {
			return;
		}
		for (const [index, answer] of answers.entries()) {
			if (!answer.color) {
				answer.color = default_colors[index % default_colors.length];
			}
		}
	};
	run(() => {
		set_colors_if_unset();
		data;
		selected_question;
	});
</script>

<section class="w-full max-w-4xl px-4 sm:px-8">
	<div class="mb-3 flex flex-wrap items-center justify-between gap-2">
		<div>
			<h2 class="font-semibold text-[var(--qq-ink)]">Answer choices</h2>
			<p class="text-sm text-[var(--qq-muted)]">
				Choose the correct answer, then write the choices players will see.
			</p>
		</div>
		<button
			class="qq-button-secondary min-h-9 px-3 py-1.5 text-sm"
			type="button"
			onclick={() => {
				if (confirm('Reset the colors of this question to the QuickQuiz palette?')) {
					apply_default_colors();
				}
			}}
		>
			Reset colors
		</button>
	</div>
	<div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
		{#if is_answer_array(data.questions[selected_question].answers)}
			{#each data.questions[selected_question].answers as answer, index (answer)}
				<div
					out:fade={{ duration: 150 }}
					class="flex min-w-0 flex-col gap-3 rounded-xl border bg-[var(--qq-surface)] p-3 shadow-sm transition"
					class:border-amber-500={answer.answer.length === 0}
					class:border-emerald-500={answer.right}
				>
					<div class="flex items-center justify-between gap-2">
						<span
							class="text-xs font-bold uppercase tracking-wide text-[var(--qq-muted)]"
						>
							Answer {index + 1}
						</span>
						<div class="flex items-center gap-1">
							<button
								type="button"
								class="rounded-lg px-2 py-1 text-xs font-semibold transition"
								class:bg-emerald-100={answer.right}
								class:text-emerald-800={answer.right}
								class:text-[var(--qq-muted)]={!answer.right}
								aria-pressed={answer.right}
								aria-label={`Mark answer ${index + 1} ${answer.right ? 'incorrect' : 'correct'}`}
								onclick={() => (answer.right = !answer.right)}
							>
								{answer.right ? 'Correct' : 'Mark correct'}
							</button>
							<button
								type="button"
								class="rounded-lg p-1.5 text-[var(--qq-muted)] hover:bg-red-50 hover:text-red-700"
								aria-label={`Delete answer ${index + 1}`}
								title="Delete answer"
								onclick={() => {
									const answers = data.questions[selected_question].answers;
									if (!is_answer_array(answers)) {
										throw new Error(
											'Multiple-choice answers must be an answer array.'
										);
									}
									data.questions[selected_question].answers = answers.filter(
										(_, answer_index) => answer_index !== index
									);
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
					</div>
					<div class="flex items-center gap-2">
						<input
							bind:value={answer.answer}
							type="text"
							class="qq-input min-w-0 flex-1 text-center"
							style="background-color: {answer.color ??
								default_colors[index]}; color: {get_foreground_color(
								answer.color ?? default_colors[index]
							)}"
							placeholder={$t('editor.enter_answer')}
							aria-label={`Answer ${index + 1} text`}
						/>
						<label
							class="flex shrink-0 items-center gap-1 text-xs text-[var(--qq-muted)]"
						>
							<span class="sr-only">Answer {index + 1} color</span>
							<input
								class="h-9 w-10 cursor-pointer rounded-lg border border-[var(--qq-border)] bg-[var(--qq-surface)] p-1"
								type="color"
								bind:value={answer.color}
								aria-label={`Answer ${index + 1} color`}
								oncontextmenu={preventDefault(() => {
									answer.color = default_colors[index];
								})}
							/>
						</label>
					</div>
				</div>
			{/each}
		{/if}
		{#if is_answer_array(data.questions[selected_question].answers) && data.questions[selected_question].answers.length < 4}
			<button
				class="flex min-h-24 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--qq-border)] p-4 text-sm font-semibold text-[var(--qq-muted)] transition hover:border-[var(--qq-green)] hover:bg-[var(--qq-green-soft)]"
				type="button"
				in:fade={{ duration: 150 }}
				onclick={() => {
					const answers = data.questions[selected_question].answers;
					if (!is_answer_array(answers)) {
						throw new Error('Multiple-choice answers must be an answer array.');
					}
					data.questions[selected_question].answers = [
						...answers,
						get_empty_answer(answers.length)
					];
				}}
			>
				<span>{$t('editor_page.add_an_answer')}</span>
			</button>
		{/if}
	</div>
</section>
