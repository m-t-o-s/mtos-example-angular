exports.config = {
  baseUrl: 'http://localhost:3000',
  rootElement: 'html',
  framework: 'jasmine2',
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['test/e2e/**/*.spec.js']
}
