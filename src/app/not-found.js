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
    </div>
  );
};

export default NotFoundPage;
