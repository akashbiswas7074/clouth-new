import { getOrderDetailsById } from "@/lib/database/actions/order.actions";
import Link from "next/link";

type PageProps = {
  params?: Promise<{ orderId?: string }>;
};

export const dynamic = 'force-dynamic'; // This ensures dynamic route handling

const OrderDetailPage = async (props: PageProps) => {
  const params = await props.params;
  if (!params || !params.orderId) {
    return <div>Error: Order ID not found</div>;
  }

  const orderId = params.orderId;
  const orderResponse = await getOrderDetailsById(orderId);

  console.log("---------------------------------------------------------------------------")
  console.log("---------------------------------------------------------------------------")
  console.log("---------------------------------------------------------------------------")
  console.log(orderResponse)
  if (!orderResponse.success) {
    return <div>Order not found: {orderResponse.message}</div>;
  }

  return (
    <div>
      <h1>Order Details</h1>
      <p>Order ID: {orderId}</p>
      {/* Add more order details here */}
    </div>
  );
};

export default OrderDetailPage;
