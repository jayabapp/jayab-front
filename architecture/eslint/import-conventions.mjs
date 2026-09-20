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
  },
};
