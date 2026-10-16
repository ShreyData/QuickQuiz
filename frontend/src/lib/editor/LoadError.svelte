<!--
SPDX-FileCopyrightText: 2023 Marlon W (Mawoka)

SPDX-License-Identifier: MPL-2.0
-->

<script lang="ts">
	import { getLocalization } from '$lib/i18n';

	const { t } = getLocalization();
</script>

<div
	class="mx-auto my-8 max-w-lg rounded-lg border border-red-300 bg-red-50 p-5 text-center text-gray-900"
	role="alert"
>
	<p class="font-semibold">{$t('editor.component_load_failed')}</p>
	<p class="mt-1 text-sm">{$t('editor.component_load_help')}</p>
	<button
		class="mt-4 rounded-lg bg-gray-800 px-4 py-2 font-medium text-white hover:bg-gray-700"
		type="button"
		onclick={() => window.location.reload()}>{$t('editor.reload')}</button
	>
</div>
