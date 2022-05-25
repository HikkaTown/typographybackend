module.exports = ({ env }) => ({
  auth: {
    secret: env("ADMIN_JWT_SECRET", "f928f7851d84d8ce0373622d90b40b3c"),
  },
  watchIgnoreFiles: ["**/private/**"],
});
