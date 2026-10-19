// SPDX-FileCopyrightText: 2023 Marlon W (Mawoka)
//
// SPDX-License-Identifier: MPL-2.0

import type { PageLoad } from './$types';

export const load = (async ({ fetch }) => {
	const pageSize = 24;
	try {
		const [quizResponse, quiztivityResponse] = await Promise.all([
			fetch(`/api/v1/quiz/list?page_size=${pageSize}&page=1`),
			fetch(`/api/v1/quiztivity/?page_size=${pageSize}&page=1`)
		]);
		if (!quizResponse.ok || !quiztivityResponse.ok) {
			throw new Error('Your quizzes could not be loaded. Refresh the page to try again.');
		}
		const [quizzes, quiztivities] = await Promise.all([
			quizResponse.json(),
			quiztivityResponse.json()
		]);
		return {
			quizzes,
			quiztivities,
			pageSize,
			loadError: ''
		};
	} catch (error) {
		return {
			quizzes: [],
			quiztivities: [],
			pageSize,
			loadError:
				error instanceof Error
					? error.message
					: 'Your quizzes could not be loaded. Refresh the page to try again.'
		};
	}
}) satisfies PageLoad;
