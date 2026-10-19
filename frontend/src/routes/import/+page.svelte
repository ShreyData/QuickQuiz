<!--
SPDX-FileCopyrightText: 2023 Marlon W (Mawoka)

SPDX-License-Identifier: MPL-2.0
-->

<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { getLocalization } from '$lib/i18n';
	import { navbarVisible } from '$lib/stores.svelte.ts';

	const { t } = getLocalization();
	const kahootRegex = /^https:\/\/create\.kahoot\.it\/details\/.*\/?([a-zA-Z-\d]{36})\/?$/;

	let urlInput = $state(page.url.searchParams.get('url') ?? '');
	let selectedFiles: FileList | null = $state(null);
	let isLoading = $state(false);
	let errorMessage = $state('');
	let successMessage = $state('');
	let urlValid = $derived(kahootRegex.test(urlInput.trim()));
	let fileExtension = $derived(selectedFiles?.[0]?.name.split('.').pop()?.toLowerCase() ?? '');
	let fileValid = $derived(fileExtension === 'xlsx' || fileExtension === 'cqa');

	navbarVisible.visible = true;

	const responseMessage = async (response: Response, fallback: string) => {
		try {
			const body: { detail?: unknown; message?: unknown } = await response.json();
			const message = body.detail ?? body.message;
			if (typeof message === 'string') return message;
		} catch {
			// Some upstream import failures return an empty or non-JSON response.
		}
		return `${fallback} (${response.status}).`;
	};

	const importKahoot = async (event: SubmitEvent) => {
		event.preventDefault();
		const match = kahootRegex.exec(urlInput.trim());
		if (!match || isLoading) return;

		isLoading = true;
		errorMessage = '';
		successMessage = '';
		try {
			const response = await fetch(`/api/v1/quiz/import/${encodeURIComponent(match[1])}`, {
				method: 'POST',
				signal: AbortSignal.timeout(120_000)
			});
			if (!response.ok) {
				throw new Error(
					await responseMessage(response, 'Could not import this Kahoot quiz')
				);
			}
			successMessage = 'Quiz imported. Opening your library…';
			await goto(resolve('/dashboard'));
		} catch (error) {
			errorMessage =
				error instanceof Error ? error.message : 'Import failed. Please try again.';
		} finally {
			isLoading = false;
		}
	};

	const importFile = async (event: SubmitEvent) => {
		event.preventDefault();
		const file = selectedFiles?.[0];
		if (!file || !fileValid || isLoading) return;

		isLoading = true;
		errorMessage = '';
		successMessage = '';
		try {
			const formData = new FormData();
			formData.append('file', file);
			const endpoint =
				fileExtension === 'xlsx' ? '/api/v1/quiz/excel-import' : '/api/v1/eximport/';
			const response = await fetch(endpoint, {
				method: 'POST',
				body: formData,
				signal: AbortSignal.timeout(120_000)
			});
			if (!response.ok) {
				throw new Error(await responseMessage(response, 'Could not import this file'));
			}
			successMessage = 'Quiz imported. Opening your library…';
			await goto(resolve('/dashboard'));
		} catch (error) {
			errorMessage =
				error instanceof Error ? error.message : 'Import failed. Please try again.';
		} finally {
			isLoading = false;
		}
	};
</script>

<svelte:head>
	<title>QuickQuiz - Import a quiz</title>
	<meta
		name="description"
		content="Bring a quiz into QuickQuiz from Kahoot, Excel, or a QuickQuiz export."
	/>
</svelte:head>

<main class="qq-container min-h-[70vh] py-8 sm:py-12">
	<header class="mb-8">
		<p class="qq-display mb-1 text-2xl text-[var(--qq-green)]">Bring your questions along</p>
		<h1 class="qq-page-heading">Import a quiz</h1>
		<p class="mt-2 max-w-2xl text-[var(--qq-muted)]">
			Choose the source that matches your quiz. Your original file is not modified.
		</p>
	</header>

	{#if errorMessage}
		<p class="mb-5 rounded-xl border border-red-300 bg-red-50 p-4 text-red-900" role="alert">
			{errorMessage}
		</p>
	{/if}
	{#if successMessage}
		<p
			class="mb-5 rounded-xl border border-green-300 bg-green-50 p-4 text-green-950"
			role="status"
		>
			{successMessage}
		</p>
	{/if}

	<div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
		<section class="qq-card flex flex-col p-5 sm:p-7">
			<div class="mb-5 flex items-start gap-4">
				<span
					class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--qq-green-soft)] text-lg font-bold text-[var(--qq-green)]"
					aria-hidden="true">1</span
				>
				<div>
					<h2 class="text-xl font-bold">{$t('import_page.a_kahoot_quiz')}</h2>
					<p class="mt-1 text-sm text-[var(--qq-muted)]">
						Paste the share link for a public Kahoot quiz.
					</p>
				</div>
			</div>

			<form class="mt-auto space-y-4" onsubmit={importKahoot}>
				<div>
					<label for="kahoot-url" class="mb-1 block text-sm font-semibold"
						>{$t('words.url')}</label
					>
					<input
						id="kahoot-url"
						bind:value={urlInput}
						type="url"
						class="qq-input"
						placeholder="https://create.kahoot.it/details/..."
						autocomplete="url"
						required
						aria-describedby="kahoot-hint"
					/>
					<p id="kahoot-hint" class="mt-2 text-sm text-[var(--qq-muted)]">
						{$t('import_page.url_should_look_like_this')}
					</p>
				</div>
				<button
					type="submit"
					class="qq-button-primary w-full"
					disabled={!urlValid || isLoading}
				>
					{isLoading ? 'Importing…' : $t('words.import')}
				</button>
			</form>
		</section>

		<section class="qq-card flex flex-col p-5 sm:p-7">
			<div class="mb-5 flex items-start gap-4">
				<span
					class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--qq-green-soft)] text-lg font-bold text-[var(--qq-green)]"
					aria-hidden="true">2</span
				>
				<div>
					<h2 class="text-xl font-bold">Import a file</h2>
					<p class="mt-1 text-sm text-[var(--qq-muted)]">
						Use a QuickQuiz export (.cqa) or a completed Excel template (.xlsx).
					</p>
				</div>
			</div>

			<form class="mt-auto space-y-4" onsubmit={importFile}>
				<div>
					<label for="quiz-file" class="mb-1 block text-sm font-semibold">Quiz file</label
					>
					<input
						id="quiz-file"
						bind:files={selectedFiles}
						type="file"
						accept=".cqa,.xlsx"
						class="qq-input file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--qq-green-soft)] file:px-3 file:py-2 file:font-semibold file:text-[var(--qq-ink)]"
						required
						aria-describedby="file-hint"
					/>
					<p id="file-hint" class="mt-2 text-sm text-[var(--qq-muted)]">
						{#if selectedFiles?.[0]}
							Selected: {selectedFiles[0].name}
						{:else}
							{$t('import_page.upload_file_ending')}
						{/if}
					</p>
				</div>
				<p class="text-sm text-[var(--qq-muted)]">
					{$t('import_page.this_side_classquiz_excel')}
				</p>
				<button
					type="submit"
					class="qq-button-primary w-full"
					disabled={!fileValid || isLoading}
				>
					{isLoading ? 'Importing…' : $t('words.import')}
				</button>
			</form>
		</section>
	</div>

	<p class="mt-6 text-center text-sm text-[var(--qq-muted)]">
		{$t('import_page.need_help')}
		<a
			href={resolve('/docs/import-from-kahoot')}
			class="font-semibold text-[var(--qq-green)] underline"
		>
			{$t('import_page.visit_docs')}
		</a>
	</p>
</main>
