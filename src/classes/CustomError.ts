export default class CustomError extends Error {
    public constructor(public name: string, message?: string) {
        super(message);
    }
}