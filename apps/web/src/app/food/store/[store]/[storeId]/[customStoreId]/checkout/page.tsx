import StoreCheckout from "@/components/StoreModule/StoreCheckout";

// Footer is rendered by the parent [customStoreId]/layout.
const page = () => {
  return (
    <div>
      <StoreCheckout moduleName="food" />
    </div>
  );
};

export default page;
