import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";

interface OrderAddress {
  address1: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface OrderProduct {
  _id?: string;
  productId?: string;
  product?: string;
  name?: string;
  qty: string;
  price: string | number;
  options?: { [key: string]: string };
}

interface Order {
  _id: string; // Ensure order ID is included
  orderConfirmation: boolean;
  deliveryStatus: string;
  price: number;
  deliveryCost: number;
  paymentMethod: string;
  paymentTime: string;
  receipt: string;
  orderAddress?: OrderAddress;
  products: OrderProduct[];
}

// Dummy productDetails lookup; replace with your actual data source
const productDetails: Record<string, any> = {
  // ...existing product details...
};

export const downloadPDF = (order: Order) => {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("Clouth My Shirt", 105, 20, { align: "center" });

  // Subtitle
  doc.setFontSize(18);
  doc.setFont("helvetica", "normal");
  doc.text("Order Details", 105, 30, { align: "center" });

  // Order details
  doc.setFontSize(12);
  let yPosition = 40;
  doc.text(`Order ID: ${order._id}`, 20, yPosition); // Use order._id
  yPosition += 10;
  doc.text(
    `Order Confirmation: ${order.orderConfirmation ? "Confirmed" : "Not Confirmed"}`,
    20,
    yPosition
  );
  yPosition += 10;
  doc.text(`Delivery Status: ${order.deliveryStatus}`, 20, yPosition);
  yPosition += 10;
  doc.text(`Total: ₹${order.price}`, 20, yPosition);
  yPosition += 10;
  doc.text(`Delivery Cost: ₹${order.deliveryCost}`, 20, yPosition);
  yPosition += 10;
  doc.text(`Payment Method: ${order.paymentMethod}`, 20, yPosition);
  yPosition += 10;
  doc.text(`Payment Time: ${new Date(order.paymentTime).toLocaleString()}`, 20, yPosition);
  yPosition += 10;
  doc.text(`Receipt: ${order.receipt}`, 20, yPosition);
  yPosition += 10;
  if (order.orderAddress) {
    doc.text("Address:", 20, yPosition);
    yPosition += 10;
    doc.text(
      `${order.orderAddress.address1}, ${order.orderAddress.city}, ${order.orderAddress.state}, ${order.orderAddress.zipCode}, ${order.orderAddress.country}`,
      20,
      yPosition
    );
    yPosition += 10;
  }

  // Loop through products and render detailed info
  order.products.forEach((product, index) => {
    // Start each product on a new page except the first if desired
    if (index > 0) {
      doc.addPage();
      yPosition = 20;
    }

    // Product heading
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(`Product ${index + 1}:`, 20, yPosition);
    yPosition += 10;

    // Product Details Section (clear label formatting)
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");

    // Ensure parameter labels are in block letters
    const labelStyle = { font: "helvetica", size: 12, fontStyle: "bold" };
    doc.setFont(labelStyle.font, labelStyle.fontStyle);

    // Product info
    doc.text("PRODUCT DETAILS:", 20, yPosition);
    yPosition += 10;
    doc.text("Product ID:", 20, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(`${product._id}`, 60, yPosition);
    yPosition += 10;
    doc.setFont(labelStyle.font, labelStyle.fontStyle);
    doc.text("Quantity:", 20, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(`${product.qty}`, 60, yPosition);
    yPosition += 10;
    doc.setFont(labelStyle.font, labelStyle.fontStyle);
    doc.text("Price:", 20, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(`₹${product.price}`, 60, yPosition);
    yPosition += 15;
  });

  // Thank you message
  yPosition += 20;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Thank you for visiting our website!", 105, yPosition, { align: "center" });

  // Save the PDF with an appropriate name
  doc.save(`${order._id}-details.pdf`); // Use order._id
};