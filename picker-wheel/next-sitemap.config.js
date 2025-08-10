/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://pickerwheel.example',
  generateRobotsTxt: true,
  exclude: ['/manifest.webmanifest'],
};