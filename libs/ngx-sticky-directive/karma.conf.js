// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

const { join } = require('path');
const getBaseKarmaConfig = require('../../karma.conf');

const shouldGenerateReport = () => process.env.SONAR_QUBE || process.env.CI;

// The configuration of the SonarQube Reporter
const getSonarQubeReporterConfig = () => {
  const sonarQubeReportConfig = {
    sonarQubeUnitReporter: {
      sonarQubeVersion: '8.x',
      outputFile: '../../reports/ut_report.xml',
      overrideTestDescription: true,
      testPaths: ['libs/ngx-sticky-directive/src'],
      testFilePattern: '.spec.ts',
      useBrowserName: false
    }
  };

  return shouldGenerateReport() ? sonarQubeReportConfig : {};
};

// Get the plugins of SonarQube
const getSonarQubePlugins = () => {
  const sonarQuebePlugins = [require('karma-sonarqube-unit-reporter')];

  return shouldGenerateReport() ? sonarQuebePlugins : [];
};

// Get the reporters of SonarQube
const getSonarQubeReporters = () => {
  const sonarQubeReporters = ['sonarqubeUnit'];

  return shouldGenerateReport() ? sonarQubeReporters : [];
};

module.exports = function(config) {
  const baseConfig = getBaseKarmaConfig();
  config.set({
    ...baseConfig,
    plugins: [...baseConfig.plugins, ...getSonarQubePlugins()],
    ...getSonarQubeReporterConfig(),
    reporters: [...baseConfig.reporters, ...getSonarQubeReporters()],
    coverageIstanbulReporter: {
      ...baseConfig.coverageIstanbulReporter,
      dir: join(__dirname, '../../coverage/libs/ngx-sticky-directive')
    }
  });
};
