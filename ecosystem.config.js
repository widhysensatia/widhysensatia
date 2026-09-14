module.exports = {
  apps: [
    {
      name: "widhysensatia",
      script: "npm",
      args: "run start",
      env: {
        PORT: 3004,
        NODE_ENV: "production",
      },
    },
  ],
};
