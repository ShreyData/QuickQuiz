<!--
SPDX-FileCopyrightText: 2023 Marlon W (Mawoka)

SPDX-License-Identifier: MPL-2.0
-->

<script lang="ts">
	import type { EditorData } from '$lib/quiz_types';
	import { getLocalization } from '$lib/i18n';
	import Spinner from '$lib/Spinner.svelte';
	import { createTippy } from 'svelte-tippy';
	import LoadError from '$lib/editor/LoadError.svelte';
	import { loadEditorComponent } from '$lib/editor/loadEditorComponent';

	const { t } = getLocalization();

	let uppyOpen = $state(false);
	let bg_uppy_open = $state(false);

	interface Props {
		edit_id: string;
		data: EditorData;
	}

	let { edit_id = $bindable(), data = $bindable() }: Props = $props();

	let custom_bg_color = $state(Boolean(data.background_color));
	const theme_presets = [
		{ name: 'Classic', color: '#4F46E5' },
		{ name: 'Energy', color: '#FF8A65' },
		{ name: 'Mint', color: '#14B8A6' },
		{ name: 'Night', color: '#1F2937' }
	];
	const tippy = createTippy({
		arrow: true,
		animation: 'perspective-subtle'
	});

	const applyThemePreset = (presetColor: string) => {
		data.background_color = presetColor;
		custom_bg_color = true;
	};

	$effect(() => {
		data.background_color = custom_bg_color ? data.background_color : undefined;
	});
</script>

<div class="mx-auto min-h-full w-full max-w-4xl px-3 pb-10 sm:px-6">
	<div class="qq-card min-h-full overflow-hidden">
		<header class="border-b border-[var(--qq-border)] px-5 py-4 sm:px-8">
			<h1 class="text-xl font-bold text-[var(--qq-ink)]">Quiz details</h1>
			<p class="mt-1 text-sm text-[var(--qq-muted)]">
				Set the title, description, visibility, and appearance for your quiz.
			</p>
		</header>
		<div
			class="h-full px-4 pb-8 sm:px-8"
			style="background-repeat: no-repeat;background-size: 100% 100%;background-image: {data.background_image
				? `url("/api/v1/storage/download/${data.background_image}")`
				: `unset`}"
		>
			<div class="mx-auto w-full max-w-2xl pt-6">
				<p class="mb-2 text-sm font-semibold text-[var(--qq-ink)]">Quiz title</p>
			</div>
			<div class="mx-auto flex w-full max-w-2xl justify-center">
				{#await loadEditorComponent(import('$lib/inline-editor.svelte'))}
					<Spinner my_20={false} />
				{:then c}
					<c.default bind:text={data.title} label="Quiz title" />
				{:catch}
					<LoadError />
				{/await}
			</div>
			<div class="mx-auto mt-5 w-full max-w-2xl">
				<label
					for="quiz-description"
					class="mb-2 block text-sm font-semibold text-[var(--qq-ink)]"
				>
					Description
				</label>
				<textarea
					id="quiz-description"
					placeholder="What should players know about this quiz?"
					bind:value={data.description}
					rows="3"
					class="qq-input resize-y text-left"
				></textarea>
			</div>

			{#if data.cover_image != undefined && data.cover_image !== ''}
				<div class="mx-auto flex max-h-72 w-full max-w-2xl justify-center pt-6">
					<img
						src="/api/v1/storage/download/{data.cover_image}"
						alt="Quiz cover preview"
						class="h-auto max-h-72 w-auto rounded-xl border border-[var(--qq-border)]"
						oncontextmenu={(e: Event) => {
							e.preventDefault();
							data.cover_image = null;
						}}
					/>
				</div>
			{:else}
				{#await loadEditorComponent(import('$lib/editor/uploader.svelte'))}
					<Spinner my_20={false} />
				{:then c}
					<c.default bind:modalOpen={uppyOpen} {data} video_upload={false} />
				{:catch}
					<LoadError />
				{/await}
			{/if}
			<section
				class="mx-auto mt-8 flex w-full max-w-2xl flex-wrap items-center justify-between gap-4 rounded-xl border border-[var(--qq-border)] p-4"
			>
				<div>
					<h2 class="font-semibold text-[var(--qq-ink)]">Quiz visibility</h2>
					<p class="text-sm text-[var(--qq-muted)]">
						{#if data.public}Others can discover this quiz.{:else}Only you can access
							this quiz.{/if}
					</p>
				</div>
				<button
					type="button"
					onclick={() => {
						data.public = !data.public;
					}}
					class="qq-button-secondary"
					aria-pressed={data.public}
				>
					{#if data.public}
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
								d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<span>{$t('words.public')}</span>
					{:else}
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
								d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
							/>
						</svg>
						<span>{$t('words.private')}</span>
					{/if}
				</button>
			</section>
			<section
				class="mx-auto mt-8 w-full max-w-2xl rounded-xl border border-[var(--qq-border)] p-4 sm:p-5"
			>
				<div class="mb-4">
					<h2 class="font-semibold text-[var(--qq-ink)]">Theme presets</h2>
					<p class="text-sm text-[var(--qq-muted)]">
						Use a polished default palette so every quiz looks professional without
						extra edits.
					</p>
				</div>
				<div class="flex flex-wrap items-center gap-3">
					{#each theme_presets as preset (preset.name)}
						<button
							type="button"
							class="flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition hover:border-[var(--qq-green)] hover:bg-[var(--qq-green-soft)]"
							class:border-[var(--qq-green)]={data.background_color === preset.color}
							onclick={() => applyThemePreset(preset.color)}
						>
							<span
								class="h-4 w-4 rounded-full border border-white/80 shadow-sm"
								style:background-color={preset.color}
							></span>
							{preset.name}
						</button>
					{/each}
				</div>
			</section>
			<section
				class="mx-auto mt-8 w-full max-w-2xl rounded-xl border border-[var(--qq-border)] p-4 sm:p-5"
			>
				<div class="mb-4">
					<h2 class="font-semibold text-[var(--qq-ink)]">Background color</h2>
					<p class="text-sm text-[var(--qq-muted)]">
						Choose a custom color for quiz slides.
					</p>
				</div>
				<div class="flex flex-wrap items-center gap-4">
					<div
						class="flex h-12 w-16 items-center justify-center overflow-hidden rounded-lg border border-[var(--qq-border)] transition-all"
						class:opacity-50={custom_bg_color}
						use:tippy={{ content: 'use the standard background', placement: 'left' }}
					>
						<span class="h-full w-full bg-[var(--qq-canvas)]"></span>
					</div>
					<div>
						<label
							for="custom-bg-toggle"
							class="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-[var(--qq-ink)]"
						>
							<input
								type="checkbox"
								bind:checked={custom_bg_color}
								id="custom-bg-toggle"
								class="h-4 w-4 accent-[var(--qq-green)]"
							/>
							Use custom color
						</label>
					</div>
					<div
						class:opacity-50={!custom_bg_color}
						class="transition-all"
						use:tippy={{ content: 'Use your own background color', placement: 'right' }}
					>
						<input
							class:pointer-events-none={!custom_bg_color}
							type="color"
							aria-label="Custom quiz background color"
							class="h-12 w-16 rounded-lg border border-[var(--qq-border)] p-1 hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
							bind:value={data.background_color}
							disabled={!custom_bg_color}
						/>
					</div>
				</div>
			</section>
			<section
				class="mx-auto mt-8 w-full max-w-2xl rounded-xl border border-[var(--qq-border)] p-4 sm:p-5"
			>
				<div class="mb-4">
					<h2 class="font-semibold text-[var(--qq-ink)]">{$t('editor.bg_image')}</h2>
					<p class="text-sm text-[var(--qq-muted)]">
						Optional image behind your quiz content.
					</p>
				</div>
				{#if data.background_image}
					<button
						type="button"
						onclick={() => {
							data.background_image = undefined;
						}}
						class="qq-button-secondary"
						>Remove Background-Image
					</button>
				{:else}
					{#await loadEditorComponent(import('$lib/editor/uploader.svelte'))}
						<div class="pt-10">
							<Spinner my_20={false} />
						</div>
					{:then c}
						<c.default
							bind:modalOpen={bg_uppy_open}
							{data}
							selected_question={-1}
							video_upload={false}
						/>
					{:catch}
						<LoadError />
					{/await}
				{/if}
			</section>
		</div>
	</div>
</div>
