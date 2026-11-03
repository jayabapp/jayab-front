// Non-React browser code (YupValidator, apiCall) cannot call useTranslations.
// The provider hands its translator over once per document: a language switch
// reloads the page (feature 03), so this never holds two languages, and it is
// never set on the server, where there is one request per locale.
type Translate = (
  key: string,
  values?: Record<string, string | number>,
) => string;

let current: Translate | null = null;

export const setBrowserTranslator = (translate: Translate) => {
  current = translate;
};

export const translateMessage = (
  key: string,
  values?: Record<string, string | number>,
) => (current ? current(key, values) : key);
