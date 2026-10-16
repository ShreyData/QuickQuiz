<!--
SPDX-FileCopyrightText: 2023 Marlon W (Mawoka)

SPDX-License-Identifier: MPL-2.0
-->

<script lang="ts">
	import LanguageToggle from './language-toggle.svelte';
</script>

<footer class="mt-auto w-full bg-gray-700 px-4 py-6 text-center text-white">
	<div class="mx-auto flex max-w-6xl flex-col items-center gap-4 sm:flex-row sm:justify-between">
		<a href="/" class="flex items-center gap-2 font-semibold text-white">
			<img src="/quickquiz-mark.svg" alt="" class="h-7 w-7" />
			QuickQuiz
		</a>
		<nav aria-label="Footer" class="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm">
			<a class="underline hover:text-blue-300" href="/explore">Explore quizzes</a>
			<a class="underline hover:text-blue-300" href="/docs/attribution"
				>Credits &amp; licenses</a
			>
			<a class="underline hover:text-blue-300" href="/docs/privacy-policy">Privacy</a>
			<a class="underline hover:text-blue-300" href="/docs/tos">Terms</a>
			<a
				class="underline hover:text-blue-300"
				href="https://github.com/ShreyData/QuickQuiz"
				target="_blank"
				rel="noopener noreferrer">GitHub</a
			>
		</nav>
		<LanguageToggle />
	</div>
</footer>
