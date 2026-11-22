import StoreOrderDetails from "@/components/StoreModule/StoreOrderDetails";

const page = async ({ params }: { params: Promise<{ id?: string }> }) => {
  const { id } = await params;
  return <StoreOrderDetails moduleName="grocery" orderId={id || null} />;
};

export default page;
