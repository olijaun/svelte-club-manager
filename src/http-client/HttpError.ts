export class HttpError extends Error {
    _status: number;
    constructor(response: Response) {
        // from: https://joefallon.net/2018/09/typescript-try-catch-finally-and-custom-errors/
        super(response.statusText);
        // see: typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
        this.name = HttpError.name; // stack traces display correctly now 
        this._status = response.status;
    }

    public get status(): number {
        return this._status;
    }
}