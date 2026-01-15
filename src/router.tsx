import { MutationCache, QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { ErrorScreen } from "./components/layout/error-screen";
import { LoadingScreen } from "./components/layout/loading-screen";
import { NotFoundScreen } from "./components/layout/not-found-screen";
import { orpc } from "./integrations/orpc/client";
import { routeTree } from "./routeTree.gen";
import { getLocale, loadLocale } from "./utils/locale";
import { getTheme } from "./utils/theme";

const getQueryClient = () => {
	const queryClient = new QueryClient({
		defaultOptions: {
			mutations: {
				retry: false,
			},
			queries: {
				retry: false,
				refetchOnMount: false,
				refetchOnReconnect: false,
				refetchOnWindowFocus: false,
				gcTime: 60 * 1000, // 1 minute
				staleTime: 60 * 1000, // 1 minute
			},
		},
		mutationCache: new MutationCache({
			onSettled: () => {
				queryClient.invalidateQueries();
			},
		}),
	});

	return queryClient;
};

export const getRouter = async () => {
	const queryClient = getQueryClient();

	const [theme, locale] = await Promise.all([getTheme(), getLocale()]);
	await loadLocale(locale);

	const router = createRouter({
		routeTree,
		scrollRestoration: true,
		defaultPreload: "intent",
		defaultViewTransition: true,
		defaultStructuralSharing: true,
		defaultErrorComponent: ErrorScreen,
		defaultPendingComponent: LoadingScreen,
		defaultNotFoundComponent: NotFoundScreen,
		context: { orpc, queryClient, theme, locale, session: null },
	});

	setupRouterSsrQueryIntegration({
		router,
		queryClient,
		handleRedirects: true,
		wrapQueryClient: true,
	});

	return router;
};
