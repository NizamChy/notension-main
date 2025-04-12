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

  if (isDoctorPage && !user?._id) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Optionally, log the user info
  // console.log("User from cookie:", user);

  return NextResponse.next();
}
