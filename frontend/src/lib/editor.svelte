<!--
SPDX-FileCopyrightText: 2023 Marlon W (Mawoka)

SPDX-License-Identifier: MPL-2.0
-->

<script lang="ts">
	import { dataSchema } from '$lib/yupSchemas';
	import type { EditorData } from './quiz_types';
	import Sidebar from '$lib/editor/sidebar.svelte';
	import SettingsCard from '$lib/editor/settings-card.svelte';
	import QuizCard from '$lib/editor/card.svelte';
	import Spinner from './Spinner.svelte';
	import { getLocalization } from '$lib/i18n';
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';

	const { t } = getLocalization();

	let schemaInvalid = $state(false);
	let yupErrorMessage = $state('');
	let editorInitializing = $state(true);
	let initializationError = $state('');
	let saving = $state(false);
	let saveError = $state('');

	interface Props {
		data: EditorData;
		quiz_id: string | null;
	}

	let { data = $bindable(), quiz_id }: Props = $props();
	let selected_question = $state(-1);

	const validateInput = async (data: EditorData) => {
		try {
			await dataSchema.validate(data, { abortEarly: false });
			schemaInvalid = false;
			yupErrorMessage = '';
		} catch (err) {
			schemaInvalid = true;
			yupErrorMessage = err.errors ? err.errors[0] : '';
		}
	};
	$effect(() => {
		validateInput(data);
	});
	let edit_id: string = $state('');
	let confirm_to_leave = true;

	const getEditID = async () => {
		editorInitializing = true;
		initializationError = '';
		try {
			const endpoint =
				quiz_id === null
					? '/api/v1/editor/start?edit=false'
					: `/api/v1/editor/start?edit=true&quiz_id=${encodeURIComponent(quiz_id)}`;
			const response = await fetch(endpoint, {
				method: 'POST',
				signal: AbortSignal.timeout(15_000)
			});
			if (response.status === 401 || response.status === 403) {
				throw new Error($t('editor.authentication_required'));
			}
			if (!response.ok) {
				throw new Error($t('editor.start_failed', { status: response.status }));
			}
			const result: { token?: unknown } = await response.json();
			if (typeof result.token !== 'string' || result.token.length === 0) {
				throw new Error($t('editor.invalid_session'));
			}
			edit_id = result.token;
		} catch (error) {
			initializationError =
				error instanceof Error && error.name === 'TimeoutError'
					? $t('editor.start_timeout')
					: error instanceof Error
						? error.message
						: $t('editor.connection_failed');
		} finally {
			editorInitializing = false;
		}
	};
	onMount(() => {
		void getEditID();
	});

	const confirmUnload = (event: BeforeUnloadEvent) => {
		if (!confirm_to_leave) {
			return;
		}
		event.preventDefault();
		event.returnValue = 'Are you sure you want to leave?';
		localStorage.setItem('edit_game', JSON.stringify(data));
		return 'unload';
	};
	const saveQuiz = async (e: Event) => {
		e.preventDefault();
		if (schemaInvalid || saving) {
			return;
		}
		saving = true;
		saveError = '';
		try {
			const response = await fetch(
				`/api/v1/editor/finish?edit_id=${encodeURIComponent(edit_id)}`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(data),
					signal: AbortSignal.timeout(30_000)
				}
			);
			if (!response.ok) {
				throw new Error($t('editor.save_http_failed', { status: response.status }));
			}
			confirm_to_leave = false;
			await goto(resolve('/dashboard'));
		} catch (error) {
			saveError =
				error instanceof Error && error.name === 'TimeoutError'
					? $t('editor.save_timeout')
					: error instanceof Error
						? error.message
						: $t('editor.save_failed');
		} finally {
			saving = false;
		}
	};
</script>

<svelte:window onbeforeunload={confirmUnload} />
{#if editorInitializing}
	<div
		class="flex min-h-screen flex-col items-center justify-center gap-3 bg-[var(--qq-canvas)] text-[var(--qq-ink)]"
		role="status"
	>
		<Spinner />
		<p>{$t('editor.preparing')}</p>
	</div>
{:else if initializationError}
	<div
		class="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center gap-4 bg-[var(--qq-canvas)] px-6 text-center text-[var(--qq-ink)]"
	>
		<h1 class="text-3xl font-bold">{$t('editor.open_failed')}</h1>
		<p role="alert">{initializationError}</p>
		<button class="qq-button-primary" type="button" onclick={() => void getEditID()}
			>{$t('editor.retry')}</button
		>
	</div>
{:else}
	<form onsubmit={saveQuiz}>
		<div
			class="grid h-dvh w-full grid-cols-1 grid-rows-[minmax(12rem,35vh)_minmax(0,1fr)] overflow-hidden bg-[var(--qq-canvas)] md:grid-cols-[minmax(14rem,18rem)_minmax(0,1fr)] md:grid-rows-1"
		>
			<div
				class="min-h-0 min-w-0 overflow-hidden border-b border-[var(--qq-border)] bg-[var(--qq-surface)] md:border-b-0 md:border-r"
			>
				<Sidebar bind:data bind:selected_question />
			</div>
			<div class="flex min-w-0 flex-col overflow-hidden">
				<header
					class="flex min-h-[3.75rem] w-full shrink-0 flex-wrap items-center gap-3 border-b border-[var(--qq-border)] bg-[var(--qq-surface)] px-3 py-2 sm:px-5"
				>
					<a href={resolve('/dashboard')} class="qq-button-secondary min-h-10 px-3 py-2">
						<span aria-hidden="true">←</span>
						{$t('words.dashboard')}
					</a>
					<div class="min-w-0 flex-1">
						<p class="truncate font-semibold text-[var(--qq-ink)]">
							{data.title || $t('editor.no_title')}
						</p>
						{#if schemaInvalid}
							<p class="truncate text-sm font-medium text-red-700" role="status">
								{yupErrorMessage}
							</p>
						{:else if saveError}
							<p class="truncate text-sm font-medium text-red-700" role="alert">
								{saveError}
							</p>
						{/if}
					</div>
					<button
						class="qq-button-primary whitespace-nowrap"
						disabled={schemaInvalid || saving}
					>
						<span>{saving ? $t('editor.saving') : $t('words.save')}</span>
						<svg
							class="w-6 h-6 inline-block"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
							/>
						</svg>
					</button>
				</header>
				<div class="min-h-0 w-full flex-1 overflow-y-auto py-3 sm:py-5">
					{#if selected_question === -1}
						<SettingsCard bind:data bind:edit_id />
					{:else}
						<QuizCard bind:data bind:selected_question bind:edit_id />
					{/if}
				</div>
			</div>
		</div>
	</form>
{/if}
