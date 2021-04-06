import chalk from "chalk";

const log = (m) => {
  console.log(m);
};

const transform = (m) => {
  if (typeof m === "object") {
    m = JSON.stringify(m, null, 4);
  }

  return m;
};

const err = (m) => {
  log(chalk.red(transform(m)));
};
const warn = (m) => {
  log(chalk.yellow(transform(m)));
};
const ok = (m) => {
  log(chalk.green(transform(m)));
};
const accent = (m) => {
  log(chalk.cyan(transform(m)));
};

export { log, err, warn, ok, accent };
