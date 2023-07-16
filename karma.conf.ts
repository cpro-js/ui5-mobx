import { Config, ConfigOptions } from "karma";

interface UI5ConfigOptions {
  mode?: "script" | "html";
  config?: { async?: boolean; resourceRoots?: Record<string, string> };
  tests?: Array<string>;
}

interface ConfigWithUi5 extends Omit<Config, "set"> {
  set: (config: ConfigOptions & { ui5: UI5ConfigOptions }) => void;
  singleRun: boolean;
}

export default function (config: ConfigWithUi5) {
  const CI_MODE = !!config.singleRun;

  config.set({
    frameworks: ["ui5", "sinon", "jasmine"],
    // karma-ui5 usage: https://github.com/SAP/karma-ui5
    ui5: {
      mode: "script",
      config: {
        async: true,
        resourceRoots: {
          // map namespaces to local source paths in relative to "./base/"
          "cpro.js.ui5.mobx": "./base/src/cpro/js/ui5/mobx/",
          "cpro.js.ui5.mobx.test": "./base/test/cpro/js/ui5/mobx/",
        },
      },
      tests: [
        "cpro/js/ui5/mobx/test/MobxModelBasics.test",
        "cpro/js/ui5/mobx/test/MobxModelPropertyBinding.test",
        "cpro/js/ui5/mobx/test/MobxModelListBinding.test",
        "cpro/js/ui5/mobx/test/MobxModelContextBinding.test",
      ],
    },
    // logLevel: "debug",
    browsers: [CI_MODE ? "ChromeHeadless" : "Chrome"],
    browserConsoleLogOptions: {
      level: "error",
    },
    reporters: ["spec"],
    // make Karma work with pnpm
    plugins: Object.keys(require("./package.json").devDependencies).flatMap((packageName) =>
      packageName.startsWith("karma-") && !packageName.startsWith("karma-cli") ? [require(packageName)] : []
    ),
  });
}
