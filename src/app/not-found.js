import Image from "next/image";

const NotFoundPage = () => {
  return (
    <div className="flex justify-center min-h-screen items-center">
      <Image
        src="/png/not-found-page.png"
        width={618}
        height={618}
        alt="not found page"
        className="w-full max-w-[618px] rounded-lg"
      />

      {/* <Image
        src="https://freefrontend.com/assets/img/html-css-404-page-templates/Pure-CSS-404-Error-Page.gif"
        width={1000}
        height={500}
        alt="not found page"
        className="w-full"
      /> */}

      {/* <p>Oopps! Page not found!</p>
      <p>Something went wrong!</p> */}
    </div>
  );
};

export default NotFoundPage;
