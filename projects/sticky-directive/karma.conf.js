// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

// The configuration of the SonarQube Reporter
const getSonarQubeReporterConfig = () => {
  const sonarQubeReportConfig = {
    sonarQubeUnitReporter: {
      sonarQubeVersion: "7.x",
      outputFile: "../../reports/ut_report.xml",
      overrideTestDescription: true,
      testPaths: ["projects/sticky-directive/src"],
      testFilePattern: ".spec.ts",
      useBrowserName: false
    }
  };

  return process.env.SONAR_QUBE ? sonarQubeReportConfig : {};
};

// Get the plugins of SonarQube
const getSonarQubePlugins = () => {
  const sonarQuebePlugins = [
    require("karma-sonarqube-unit-reporter")
  ];

  return process.env.SONAR_QUBE ? sonarQuebePlugins : [];
}

// Get the reporters of SonarQube
const getSonarQubeReporters = () => {
  const sonarQubeReporters = [
    "sonarqubeUnit"
  ];

  return process.env.SONAR_QUBE ? sonarQubeReporters : [];
};

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      ...getSonarQubePlugins(),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, '../../coverage'),
      reports: ['html', 'lcovonly'],
      fixWebpackSourcePaths: true
    },
    ...getSonarQubeReporterConfig(),
    reporters: ['progress', 'kjhtml', ...getSonarQubeReporters()],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false
  });
};
