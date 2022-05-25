const fs = require("fs");
const archiver = require("archiver");

module.exports = ({ env }) => ({
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", 1337),
  app: {
    keys: env.array("APP_KEYS"),
  },
  cron: {
    enabled: true,
    tasks: {
      "0 15 0 * * *": () => {
        console.log("каждый день в 00:15 делаем бэкап");
        let output = fs.createWriteStream(
          `private/backups/backup-${new Date().toLocaleDateString()}.zip`
        );
        let archive = archiver("zip", {
          zlib: { level: 9 }, // установить уровень сжатия
        });
        output.on("close", function () {
          console.log(`Всего ${archive.pointer()} байт`);
          console.log(
            "архиватор завершил архивирование файла, дескриптор потока вывода файла закрыт"
          );
        });
        output.on("end", function () {
          console.log("Источник данных исчерпан");
        });
        archive.on("warning", function (err) {
          if (err.code === "ENOENT") {
            console.warn("Сбои статов и другие неблокирующие ошибки");
          } else {
            throw err;
          }
        });
        archive.on("error", function (err) {
          throw err;
        });
        archive.pipe(output);
        archive.append(fs.createReadStream(".tmp/data.db"), {
          name: "data.db",
        });
        archive.directory("public/uploads", "uploads");
        archive.finalize();
      },
    },
  },
});
