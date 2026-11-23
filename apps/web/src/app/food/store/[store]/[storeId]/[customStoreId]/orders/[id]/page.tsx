import StoreOrderDetails from "@/components/StoreModule/StoreOrderDetails";

const page = async ({ params }: { params: Promise<{ id?: string }> }) => {
  const { id } = await params;
  return <StoreOrderDetails moduleName="food" orderId={id || null} />;
};

export default page;
