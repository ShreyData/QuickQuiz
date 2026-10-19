// SPDX-FileCopyrightText: 2023 Marlon W (Mawoka)
//
// SPDX-License-Identifier: MPL-2.0

import type { PageLoad } from './$types';

const PAGE_SIZE = 20;

export const load = (async ({ fetch, url }) => {
	const requestedPage = Number.parseInt(url.searchParams.get('page') ?? '1', 10);
	const currentPage = Number.isFinite(requestedPage)
		? Math.max(1, Math.min(requestedPage, 50_000))
		: 1;
	const offset = (currentPage - 1) * PAGE_SIZE;
	const response = await fetch('/api/v1/search/', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			q: '*',
			sort: ['created_at:desc'],
			limit: PAGE_SIZE,
			offset
		})
	});
	if (!response.ok) {
		throw new Error(`Could not load quizzes (${response.status}).`);
	}
	return {
		results: await response.json(),
		currentPage,
		pageSize: PAGE_SIZE
	};
}) satisfies PageLoad;
