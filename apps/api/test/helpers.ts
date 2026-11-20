import { createApp } from "../src/app";
import { createAuth, type AuthConfig } from "../src/auth/auth";
import type { Db } from "../src/db/client";

export function testApp(db: Db, overrides: Partial<AuthConfig> & { demoLogin?: boolean; protectedPhones?: string[] } = {}) {
  const { demoLogin = true, protectedPhones = [], ...authOverrides } = overrides;
  const auth = createAuth(db, {
    secret: "test-secret-test-secret-test-secret-1234",
    baseURL: "http://localhost:4000",
    trustedOrigins: ["http://localhost:3000"],
    sms: null,
    ...authOverrides,
  });
  return createApp(db, { auth, smsEnabled: !!authOverrides.sms, demoLogin, protectedPhones });
}

// A tiny cookie jar for app.request().
export function client(app: ReturnType<typeof createApp>) {
  const jar = new Map<string, string>();
  const request = async (method: string, path: string, body?: unknown, init: RequestInit = {}) => {
    const headers = new Headers(init.headers);
    if (body !== undefined && !(body instanceof FormData)) headers.set("Content-Type", "application/json");
    if (jar.size) headers.set("Cookie", [...jar].map(([k, v]) => `${k}=${v}`).join("; "));
    headers.set("Origin", "http://localhost:3000");
    const res = await app.request(path, {
      method,
      headers,
      body: body === undefined ? undefined : body instanceof FormData ? body : JSON.stringify(body),
    });
    for (const c of res.headers.getSetCookie()) {
      const [pair] = c.split(";");
      const i = pair!.indexOf("=");
      const name = pair!.slice(0, i);
      const value = pair!.slice(i + 1);
      if (value && !/max-age=0/i.test(c)) jar.set(name, value);
      else jar.delete(name);
    }
    return { status: res.status, body: (await res.json()) as any };
  };
  return { request, jar };
}
