import { stripIndents } from "common-tags";
import { format } from "util";
import chalk from "chalk";
import moment from "moment";

const defaultFormat = "MMMM Do YYYY, h:mm:ss a";

export default class Logger {
    public constructor(public format = defaultFormat) {}
    public write (head: string, value: string,): void {
        const date = moment(Date.now()).format(this.format);
        const log = stripIndents`
            ${this.getEquals(head)} ${chalk.bold(head)} ${this.getEquals(head)}
            ${value}
            ${this.getEquals(date)} ${chalk.grey(date)} ${this.getEquals(date)}\n
        `;
        process.stdout.write(log);
    }

    public color(input: unknown, hex: string): string {
        input = typeof input === "string" ? input : format(input);
        return chalk.hex(hex)(input);
    }

    public getEquals(input: string, max = 50): string {
        const result = input.length > max ? 0 : max - input.length;
        return "=".repeat(result/2);
    }

    public print(input: unknown): void {
        process.stdout.write(format(input));
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