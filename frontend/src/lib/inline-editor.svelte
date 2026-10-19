<!--
SPDX-FileCopyrightText: 2023 Marlon W (Mawoka)

SPDX-License-Identifier: MPL-2.0
-->

<script lang="ts">
	import { run } from 'svelte/legacy';

	import {
		BalloonEditor,
		Essentials,
		Autoformat,
		Bold,
		Italic,
		Paragraph,
		TextTransformation,
		Superscript,
		Subscript,
		Strikethrough
	} from 'ckeditor5';
	import 'ckeditor5/ckeditor5.css';

	const triggerChange = () => {
		text = editor.getData();
	};

	import { onMount } from 'svelte';
	interface Props {
		// import Autoformat from "@ckeditor/ckeditor5-autoformat/src/autoformat"
		text?: string;
		label?: string;
	}

	let { text = $bindable(''), label = 'Editable text' }: Props = $props();

	let html_el = $state();

	run(() => {
		text = text.replace('<p>', '').replace('</p>', '');
	});
	let editor;
	onMount(() => {
		class Editor extends BalloonEditor {
			static builtinPlugins = [
				Essentials,
				Autoformat,
				Bold,
				Italic,
				Paragraph,
				TextTransformation,
				Strikethrough,
				Subscript,
				Superscript
			];

			static defaultConfig = {
				language: 'en'
			};
		}
		// BalloonEditor.builtinPlugins = [Strikethrough]
		Editor.create(html_el, {
			licenseKey: 'GPL',
			// plugins: [Strikethrough],
			config: {
				enterMode: BalloonEditor.ENTER_DIV,
				shiftEnterMode: BalloonEditor.ENTER_BR
			},
			toolbar: [
				'bold',
				'italic',
				'strikethrough',
				'superscript',
				'subscript',
				'|',
				'undo',
				'redo'
			]
		})
			.then((newEditor) => {
				editor = newEditor;
				editor.setData(text);
				editor.model.document.on('change:data', () => {
					triggerChange();
				});
			})
			.catch((error) => {
				console.error('There was a problem initializing the editor.', error);
			});
	});
</script>

<div class="w-full">
	<div
		bind:this={html_el}
		contenteditable="true"
		aria-label={label}
		class="min-h-14 w-full rounded-xl border border-[var(--qq-border)] bg-[var(--qq-surface)] px-4 py-3 text-left text-2xl font-semibold text-[var(--qq-ink)] outline-none transition focus-within:border-[var(--qq-green)] focus-within:ring-2 focus-within:ring-[var(--qq-green)] sm:text-3xl"
	></div>
</div>

<style>
	:global(.ck-editor__editable) {
		color: var(--qq-ink) !important;
		background-color: transparent !important;
	}

	:global(.ck-powered-by) {
		display: none;
	}
</style>
