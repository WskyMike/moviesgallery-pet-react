export const apps = [
  {
    name: "server",
    script: "server.js",
    watch: false,
    autorestart: true,
    restart_delay: 3000,
    max_memory_restart: "300M",
    env: {
      NODE_ENV: "production",
      PORT: 3000,
    },
    log_date_format: "DD-MM-YYYY HH:mm:ss",
    error_file: "./logs/pm2-error.log",
    out_file: "./logs/pm2-out.log",
    combine_logs: true,
  },
];

export const deploy = {
  production: {
    user: "SSH_USERNAME",
    host: "SSH_HOSTMACHINE",
    ref: "origin/master",
    repo: "GIT_REPOSITORY",
    path: "DESTINATION_PATH",
    "pre-deploy-local": "",
    "post-deploy": "npm install && pm2 reload ecosystem.config.js --env production",
    "pre-setup": "",
  },
};
