// cucumber.js
module.exports = {
  default: [
    "--require support/world.js",
    "--require support/hooks.js",
    "--require step_definitions/**/*.js",
    "--format progress",
    "--format html:reports/cucumber-report.html",
    "--format json:reports/cucumber-report.json",
    "--parallel 1",
    "--tags \"@homepage\""
  ].join(" ")
};
