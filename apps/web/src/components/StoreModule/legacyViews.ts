// Typed views of the JS components the shared .tsx store-module components
// render. TS reads every prop of a JS component as required and `any`; these
// give them the props the JS actually takes. Drop an entry once its component
// is converted.
import type { ComponentType, MouseEvent, ReactNode } from "react";
import StoreItemCardJs from "./StoreItemCard";
import ProductDetailsViewJs, {
  ProductDetailsSkeleton as ProductDetailsSkeletonJs,
  discountLabelOf as discountLabelOfJs,
} from "./ProductDetailsView";
import ProductQuickViewJs from "./ProductQuickView";
import ProductDetailsPageJs from "./ProductDetailsPage";
import StoreListJs from "./StoreList";
import { InfiniteItemGrid as InfiniteItemGridJs, TypeBreadcrumb as TypeBreadcrumbJs } from "./ItemBrowse";
import { EmptyState as EmptyStateJs, PageHeader as PageHeaderJs } from "@/components/shared/UI/UI";
import { PriceRow as PriceRowJs } from "@/components/shared/CartUI/CartUI";
import CommonModalJs from "@/components/shared/CommonModal/CommonModal";
import LoginModalDetailsJs from "@/components/LoginSection/LoginModalDetails";
import FavoriteStoresJs from "@/components/FavoriteSection/FavoriteStores";

type ClickHandler = (event: MouseEvent<HTMLElement>) => void;
type Text = string | null | undefined;
type Amount = number | string | null | undefined;

export const StoreItemCard = StoreItemCardJs as ComponentType<{
  moduleName: string;
  imageSrc: string;
  title?: Text;
  subtitle?: Text;
  salePrice?: Amount;
  mrp?: Amount;
  discountLabel?: Text;
  isFavorite?: boolean;
  onClick?: ClickHandler;
  onFavoriteToggle?: ClickHandler;
  showCartControls?: boolean;
  quantity?: number;
  isAvailable?: boolean;
  onAddToCart?: ClickHandler;
  onIncrement?: ClickHandler;
  onDecrement?: ClickHandler;
}>;

export const ProductDetailsView = ProductDetailsViewJs as ComponentType<{
  variant?: "page" | "modal";
  imageSrc: string;
  title?: Text;
  altTitle?: Text;
  highlight?: Text;
  byline?: Text;
  chips?: Text[];
  badges?: { label: string; tone: string }[];
  discountLabel?: Text;
  salePrice?: Amount;
  mrp?: Amount;
  savings?: number;
  isAvailable?: boolean | null;
  details?: { label: string; value: Text }[];
  quantity?: number;
  isBusy?: boolean;
  onAddToCart?: ClickHandler;
  onIncrement?: ClickHandler;
  onDecrement?: ClickHandler;
  isFavorite?: boolean;
  onFavoriteToggle?: ClickHandler;
}>;

export const ProductDetailsSkeleton = ProductDetailsSkeletonJs as ComponentType<{
  variant?: "page" | "modal";
}>;

export const discountLabelOf = discountLabelOfJs as (
  item: { less?: number; less_type?: string } | null | undefined,
) => string | null;

export const ProductQuickView = ProductQuickViewJs as ComponentType<{
  isOpen: boolean;
  onClose: () => void;
  children?: ReactNode;
}>;

export const ProductDetailsPage = ProductDetailsPageJs as ComponentType<{
  basePath: string;
  isLoading: boolean;
  notFound: boolean;
  children?: ReactNode;
}>;

export const StoreList = StoreListJs as ComponentType<{
  moduleName: string;
  title: string;
  subtitle?: string;
  shops: unknown[];
  isLoading: boolean;
  onShopClick: (shop: never) => void;
  emptyTitle: string;
  emptyText: string;
}>;

export const InfiniteItemGrid = InfiniteItemGridJs as <T>(props: {
  items: T[];
  allLoaded: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  renderItem: (item: T) => ReactNode;
  emptyTitle?: string;
  emptyText?: string;
}) => ReactNode;

export const TypeBreadcrumb = TypeBreadcrumbJs as ComponentType<{
  typeName: Text;
  subTypeName: Text;
  onTypeClick: () => void;
}>;

export const EmptyState = EmptyStateJs as ComponentType<{
  icon?: ReactNode;
  title?: string;
  text?: ReactNode;
  action?: ReactNode;
  className?: string;
}>;

export const PageHeader = PageHeaderJs as ComponentType<{
  title: ReactNode;
  subtitle?: ReactNode;
  back?: string;
  backLabel?: string;
  actions?: ReactNode;
  className?: string;
}>;

export const CommonModal = CommonModalJs as ComponentType<{
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  children?: ReactNode;
}>;

export const LoginModalDetails = LoginModalDetailsJs as ComponentType<{
  onClose?: () => void;
  type?: string;
  redirectTo?: string;
  showHeading?: boolean;
  // Passed by the old item card; LoginModalDetails ignores it.
  handleAddToFavorite?: ClickHandler;
}>;

export const FavoriteStores = FavoriteStoresJs as ComponentType<{
  stores: unknown[];
  type: string;
  label: string;
  isFavoriteRoute: boolean;
  onStoreClick: (shop: never) => void;
  favoritesHref: string;
  browseHref: string;
}>;

export const PriceRow = PriceRowJs as ComponentType<{
  label: ReactNode;
  value: ReactNode;
  strong?: boolean;
  hint?: ReactNode;
}>;
