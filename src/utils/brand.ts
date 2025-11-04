import figlet from "figlet";
import chalk from "chalk";

export function printBrand() {
  console.log(
    chalk.cyanBright(
      figlet.textSync("Aissist", { horizontalLayout: "default" })
    )
  );
  console.log(chalk.gray("Personal AI Assistant CLI\n"));
}
