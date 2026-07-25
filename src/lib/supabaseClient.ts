
// Memoized auth session state extractor
export const extractSessionMemo = (session: any) => session?.user || null;
