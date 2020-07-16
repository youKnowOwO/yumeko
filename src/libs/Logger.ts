import { stripIndents } from "common-tags";
import { format } from "util";
import chalk from "chalk";
import moment from "moment";

const momentFormat = "MMMM Do YYYY, h:mm:ss a";

export default class Logger {
    public write (head: string, value: string): void {
        const date = this.date();
        const log = stripIndents`
            ${this.equal(chalk.bold(head))}
            ${value}
            ${this.equal(chalk.grey(date))}
            \u200B
        `;
        process.stdout.write(log);
    }

    public date(): string {
        return moment(Date.now()).format(momentFormat);
    }

    public color(input: unknown, hex: string): string {
        input = typeof input === "string" ? input : format(input);
        return chalk.hex(hex)(input);
    }

    public equal(input: string, max = 50): string {
        const result = input.length > max ? 0 : max - input.length;
        const eq = "=".repeat(result/2);
        return `${eq} ${input} ${eq}`;
    }

    public print(input: unknown): void {
        process.stdout.write(`${format(input)}\n`);
    }

    public info(value: unknown): void {
        return this.write(this.color("^w^) INFO", "2ECC71"), this.color(value, "1F8B4C"));
    }

    public error(value: unknown): void {
        return this.write(this.color("'-') ERROR", "E74C3C"), this.color(value, "C27C0E"));
    }

    public warn(value: unknown): void {
        return this.write(this.color("°^°) WARN", "FFFF00"), this.color(value, "992D22"));
    }
}