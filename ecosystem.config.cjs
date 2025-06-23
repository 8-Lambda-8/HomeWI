module.exports = {
  apps: [
    {
      name: 'HomeWI',
      port: '8083',
      exec_mode: 'cluster',
      instances: '2',
      autorestart: true,  
      script: './server/index.mjs'
    }
  ]
}
