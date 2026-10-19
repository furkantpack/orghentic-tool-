import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "Orgentic",
  version: packageJson.version,
  copyright: `© ${currentYear}, Orgentic.`,
  meta: {
    title: "Orgentic - Organization Intelligence Workspace",
    description:
      "Orgentic helps teams map people, agents, costs, tasks, and transformation scenarios in one organization intelligence workspace.",
  },
};
