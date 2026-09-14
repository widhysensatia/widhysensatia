module.exports = {
  apps: [
    {
      name: "sensatia-knowledge-hub",
      script: "npm",
      args: "run start",
      env: {
        PORT: 3004,
        NODE_ENV: "production",
      },
    },
  ],
};
