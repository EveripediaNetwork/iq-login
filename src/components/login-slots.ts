export const defaultClassNames = {
	root: "min-h-[60vh] w-full flex items-center justify-center px-4 py-8",
	container: "relative w-full max-w-md",
	title: "text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl",
	description:
		"mx-auto max-w-[500px] text-muted-foreground text-sm md:text-base",
	card: "overflow-hidden rounded-lg border bg-card shadow",
	cardBody: "p-4",
	headerIcon:
		"flex items-center justify-center w-8 h-8 mx-auto rounded-lg bg-primary/10",
	headerTitle: "mt-3 mb-3 text-lg font-semibold",
	connectorList: "grid gap-3",
	connectorButton:
		"group relative flex items-center justify-between rounded-lg border bg-card p-4 text-left transition-colors hover:bg-accent disabled:opacity-50",
	connectorIcon: "size-8 text-primary",
	connectorLabel: "font-medium text-sm",
	connectorDescription: "text-xs text-muted-foreground",
	connectorError: "text-xs text-destructive mt-1",
	connectorArrow: "w-4 h-4 text-muted-foreground",
	connectedTitle: "font-medium text-sm",
	logoutButton:
		"p-1.5 rounded-full hover:bg-destructive/10 text-destructive transition-colors",
	addressBox: "rounded-lg bg-muted/50 border p-3 mb-4",
	addressText: "font-mono text-xs break-all",
	divider: "relative",
	dividerLabel: "bg-card px-2 text-muted-foreground",
	verificationCard: "rounded-lg border p-4 text-center",
	verificationIcon:
		"flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10",
	verificationTitle: "font-medium text-base",
	verificationDescription: "text-xs text-muted-foreground",
	signButton:
		"inline-flex w-full max-w-xs items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed",
	statusText: "flex items-center gap-2 py-1.5",
} as const satisfies Record<string, string>;

export type LoginSlot = keyof typeof defaultClassNames;
