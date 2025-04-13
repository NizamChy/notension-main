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

  // Redirect to home if user is logged in and tries to access login page
  if (isLoginPage && user?._id) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Redirect to login if user tries to access doctor page without being logged in
  if (isDoctorPage && !user?._id) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}
