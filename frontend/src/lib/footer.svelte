<!--
SPDX-FileCopyrightText: 2023 Marlon W (Mawoka)

SPDX-License-Identifier: MPL-2.0
-->

<script lang="ts">
	import { resolve } from '$app/paths';
	import LanguageToggle from './language-toggle.svelte';
</script>

<footer
	class="mt-auto w-full border-t border-[var(--qq-border)] bg-[var(--qq-surface)] px-4 py-6 text-center text-[var(--qq-ink)]"
>
	<div class="mx-auto flex max-w-6xl flex-col items-center gap-4 sm:flex-row sm:justify-between">
		<a href={resolve('/')} class="flex items-center gap-2 font-semibold text-[var(--qq-ink)]">
			<img src="/quickquiz-mark.svg" alt="" class="h-7 w-7" />
			QuickQuiz
		</a>
		<nav aria-label="Footer" class="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm">
			<a class="underline hover:text-[var(--qq-green)]" href={resolve('/explore')}
				>Explore quizzes</a
			>
			<a class="underline hover:text-[var(--qq-green)]" href={resolve('/docs/attribution')}
				>Credits &amp; licenses</a
			>
			<a class="underline hover:text-[var(--qq-green)]" href={resolve('/docs/privacy-policy')}
				>Privacy</a
			>
			<a class="underline hover:text-[var(--qq-green)]" href={resolve('/docs/tos')}>Terms</a>
			<a
				class="underline hover:text-[var(--qq-green)]"
				href="https://github.com/ShreyData/QuickQuiz"
				target="_blank"
				rel="noopener noreferrer">GitHub</a
			>
		</nav>
		<LanguageToggle />
	</div>
</footer>
