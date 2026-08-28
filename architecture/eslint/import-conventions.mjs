const importGroup = (node) => {
  return node.specifiers.some((specifier) => specifier.type === "ImportSpecifier") ? 0 : 1;
};

const compareImports = (left, right) => {
  const groupDifference = importGroup(left) - importGroup(right);
  if (groupDifference !== 0) return groupDifference;
  const lengthDifference = right.range[1] - right.range[0] - (left.range[1] - left.range[0]);
  if (lengthDifference !== 0) return lengthDifference;
  return left.source.value.localeCompare(right.source.value, "en");
};

const sortImportsRule = {
  meta: {
    type: "layout",
    docs: { description: "Sort named imports before default imports, longest first" },
    fixable: "code",
    schema: [],
    messages: { unsorted: "Sort named imports before default imports and order each group longest first." },
  },
  create(context) {
    const sourceCode = context.sourceCode;
    return {
      "Program:exit"(program) {
        const imports = program.body.filter((node) => node.type === "ImportDeclaration");
        if (imports.length < 2) return;

        const sorted = [...imports].sort(compareImports);
        if (imports.every((node, index) => node === sorted[index])) return;

        const first = imports[0];
        const last = imports.at(-1);
        const betweenImportsHasComments = imports.slice(0, -1).some((node, index) => {
          const gap = sourceCode.text.slice(node.range[1], imports[index + 1].range[0]);
          return gap.trim().length > 0;
        });

        context.report({
          node: first,
          messageId: "unsorted",
          fix: betweenImportsHasComments
            ? null
            : (fixer) =>
                fixer.replaceTextRange(
                  [first.range[0], last.range[1]],
                  sorted
                    .map((node, index) => {
                      const separator = index > 0 && importGroup(sorted[index - 1]) !== importGroup(node) ? "\n\n" : "\n";
                      return `${index === 0 ? "" : separator}${sourceCode.getText(node)}`;
                    })
                    .join(""),
                ),
        });
      },
    };
  },
};

const noUiTypeDeclarationsRule = {
  meta: {
    type: "problem",
    docs: { description: "Keep UI contracts in the centralized types ownership tree" },
    schema: [],
    messages: { centralize: "Move UI props and view-model types to the centralized types ownership tree." },
  },
  create(context) {
    if (!context.filename.endsWith(".tsx")) return {};
    const report = (node) => context.report({ node, messageId: "centralize" });
    return {
      TSInterfaceDeclaration: report,
      TSTypeAliasDeclaration: report,
    };
  },
};

export const importConventionsPlugin = {
  rules: {
    "no-ui-type-declarations": noUiTypeDeclarationsRule,
    "sort-imports": sortImportsRule,
  },
};
