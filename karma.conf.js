// karma-ui5 usage: https://github.com/SAP/karma-ui5
module.exports = function (config) {
  const CI_MODE = !!config.singleRun;

  config.set({
    frameworks: ["ui5", "jasmine"],
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
        "cpro/js/ui5/mobx/test/MobxModel.test"
      ],
    },
    browsers: ["Chrome"],
    // files: [
    //   { pattern: "src/**/*.ts", included: false, served: true, watched: true, type: "ts" },
    //   { pattern: "test/**/*.test.ts", included: true, served: true, watched: true, type: "ts" },
    // ],
    // make Karma work with pnpm
    plugins: Object.keys(require("./package.json").devDependencies).flatMap((packageName) =>
      packageName.startsWith("karma-") && !packageName.startsWith("karma-cli") ? [require(packageName)] : []
    ),
  });
};
