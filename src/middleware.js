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

  // console.log("hello from middleware");

  if (isLoginPage && user?._id) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isDoctorPage && !user?._id) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}
