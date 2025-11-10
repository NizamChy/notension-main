import { NextResponse } from "next/server";

export function middleware(request) {
  const userCookie = request.cookies.get("user_info")?.value;

  let user = null;
  if (userCookie) {
    try {
      user = JSON.parse(userCookie);
    } catch (err) {
      console.error("Invalid user_info cookie");
    }
  }

  const isDoctorPage = request.nextUrl.pathname.startsWith("/medical-services");
  const isLoginPage = request.nextUrl.pathname.startsWith("/login");

  // if (isLoginPage && user?._id) {
  //   const redirectResponse = NextResponse.redirect(new URL("/", request.url));
  //   redirectResponse.headers.set("x-middleware-cache", "no-cache"); // ! FIX: Disable caching
  //   return redirectResponse;
  // }

  // if (isDoctorPage && !user?._id) {
  //   const redirectResponse = NextResponse.redirect(
  //     new URL("/login", request.url)
  //   );
  //   redirectResponse.headers.set("x-middleware-cache", "no-cache"); // ! FIX: Disable caching
  //   return redirectResponse;
  // }

  return NextResponse.next();
}
