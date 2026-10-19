<!--
SPDX-FileCopyrightText: 2023 Marlon W (Mawoka)

SPDX-License-Identifier: MPL-2.0
-->

<script lang="ts">
	import { resolve } from '$app/paths';
	import { getLocalization } from '$lib/i18n';

	const { t } = getLocalization();
	import ImportedOrNot from '$lib/view_quiz/imported_or_not.svelte';
	let { quiz } = $props();

	const highlightedSegments = (value: string | null | undefined) => {
		const text = value ?? '';
		const segments: { text: string; highlighted: boolean }[] = [];
		const highlights = /<em>([\s\S]*?)<\/em>/gi;
		let cursor = 0;

		for (const match of text.matchAll(highlights)) {
			const start = match.index ?? 0;
			if (start > cursor) {
				segments.push({ text: text.slice(cursor, start), highlighted: false });
			}
			segments.push({ text: match[1], highlighted: true });
			cursor = start + match[0].length;
		}
		if (cursor < text.length) {
			segments.push({ text: text.slice(cursor), highlighted: false });
		}
		return segments;
	};
</script>

<article
	class="qq-card group flex min-h-52 flex-col p-5 transition duration-150 hover:-translate-y-0.5 hover:shadow-lg"
>
	<div class="flex items-start justify-between gap-3">
		<h2 class="min-w-0 text-xl font-bold leading-snug text-[var(--qq-ink)]">
			<a
				href={resolve('/view/[quiz_id]', { quiz_id: quiz.id })}
				class="rounded-sm no-underline after:absolute after:inset-0 focus-visible:outline-2"
			>
				{#each highlightedSegments(quiz.title) as segment, index (`${index}-${segment.text}`)}
					{#if segment.highlighted}
						<mark
							class="rounded-sm bg-[var(--qq-green-soft)] px-0.5 font-semibold text-inherit"
							>{segment.text}</mark
						>
					{:else}
						{segment.text}
					{/if}
				{/each}
			</a>
		</h2>
		<span class="relative z-10 shrink-0">
			<ImportedOrNot imported={quiz.imported_from_kahoot} />
		</span>
	</div>
	<p class="mt-3 line-clamp-3 break-words text-sm leading-relaxed text-[var(--qq-muted)]">
		{#each highlightedSegments(quiz.description) as segment, index (`${index}-${segment.text}`)}
			{#if segment.highlighted}
				<mark class="rounded-sm bg-[var(--qq-green-soft)] px-0.5 font-semibold text-inherit"
					>{segment.text}</mark
				>
			{:else}
				{segment.text}
			{/if}
		{/each}
	</p>
	<div
		class="mt-auto flex items-center justify-between gap-3 pt-5 text-sm text-[var(--qq-muted)]"
	>
		<span>
			{#if quiz.imported_from_kahoot === true}
				{$t('explore_page.imported_by')}
			{:else}
				{$t('explore_page.made_by')}
			{/if}
			{#each highlightedSegments(quiz.user) as segment, index (`${index}-${segment.text}`)}
				{#if segment.highlighted}
					<mark
						class="rounded-sm bg-[var(--qq-green-soft)] px-0.5 font-semibold text-inherit"
						>{segment.text}</mark
					>
				{:else}
					{segment.text}
				{/if}
			{/each}
		</span>
		<span
			aria-hidden="true"
			class="text-lg text-[var(--qq-green)] transition group-hover:translate-x-1">→</span
		>
	</div>
</article>
