declare module 'next/server' {
  export class NextRequest extends Request {
    nextUrl: URL;
    cookies: any;
  }
  export class NextResponse extends Response {
    static json<T = any>(data: T, init?: ResponseInit): NextResponse;
    static redirect(url: string | URL, init?: number | ResponseInit): NextResponse;
    static next(init?: ResponseInit): NextResponse;
  }
}
