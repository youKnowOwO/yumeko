export default class CustomError extends Error {
    public constructor(name: string, message?: string) {
        super(message);
        this.name = name;
    }
}