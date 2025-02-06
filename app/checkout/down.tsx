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
  orderId: string;
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
    
};

export const downloadPDF = (order: Order) => {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(18);
  doc.text("Order Details", 20, 20);

  // Order details
  doc.setFontSize(12);
  let yPosition = 30;
  doc.text(`Order ID: ${order.orderId}`, 20, yPosition);
  yPosition += 10;
  doc.text(
    `Order Confirmation: ${order.orderConfirmation ? "Confirmed" : "Not Confirmed"}`,
    20,
    yPosition
  );
  yPosition += 10;
  doc.text(`Delivery Status: ${order.deliveryStatus}`, 20, yPosition);
  yPosition += 10;
  doc.text(`Total: $${order.price}`, 20, yPosition);
  yPosition += 10;
  doc.text(`Delivery Cost: $${order.deliveryCost}`, 20, yPosition);
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
    doc.text(`${product.productId}`, 60, yPosition);
    yPosition += 10;
    doc.setFont(labelStyle.font, labelStyle.fontStyle);
    doc.text("Quantity:", 20, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(`${product.qty}`, 60, yPosition);
    yPosition += 10;
    doc.setFont(labelStyle.font, labelStyle.fontStyle);
    doc.text("Price:", 20, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(`$${product.price}`, 60, yPosition);
    yPosition += 15;

    // Get product specific details; fall back to empty object if none
    const details = productDetails[product.productId || ""] || {};

    // Divide details into two columns for the monogram section.
    const xOffset = 110; // X-coordinate for second column

    // Shirt Details Section
    doc.setFont(labelStyle.font, labelStyle.fontStyle);
    doc.text("Shirt details:", 20, yPosition);
    yPosition += 10;
    doc.setFont("helvetica", "normal");
    doc.text("Collar Style:", 20, yPosition);
    doc.text(`${details?.collarStyle || "N/A"}`, xOffset, yPosition);
    yPosition += 10;
    doc.text("Collar Button:", 20, yPosition);
    doc.text(`${details?.collarButton || "N/A"}`, xOffset, yPosition);
    yPosition += 10;
    doc.text("Collar Height:", 20, yPosition);
    doc.text(`${details?.collarHeight || "N/A"}`, xOffset, yPosition);
    yPosition += 10;
    doc.text("Cuff Style:", 20, yPosition);
    doc.text(`${details?.cuffStyle || "N/A"}`, xOffset, yPosition);
    yPosition += 10;
    doc.text("Cuff Links:", 20, yPosition);
    doc.text(`${details?.cuffLinks || "N/A"}`, xOffset, yPosition);
    yPosition += 10;
    doc.text("Fit:", 20, yPosition);
    doc.text(`${details?.fit || "N/A"}`, xOffset, yPosition);
    yPosition += 10;
    doc.text("Back:", 20, yPosition);
    doc.text(`${details?.back || "N/A"}`, xOffset, yPosition);
    yPosition += 10;
    doc.text("Bottom:", 20, yPosition);
    doc.text(`${details?.bottom || "N/A"}`, xOffset, yPosition);
    yPosition += 10;
    doc.text("Placket:", 20, yPosition);
    doc.text(`${details?.placket || "N/A"}`, xOffset, yPosition);
    yPosition += 10;
    doc.text("Pocket:", 20, yPosition);
    doc.text(`${details?.pocket || "N/A"}`, xOffset, yPosition);
    yPosition += 10;
    doc.text("Sleeves:", 20, yPosition);
    doc.text(`${details?.sleeves || "N/A"}`, xOffset, yPosition);
    yPosition += 10;
    doc.text("Fabric:", 20, yPosition);
    doc.text(`${details?.fabric?.fabricName || "N/A"}`, xOffset, yPosition);
    yPosition += 10;
    doc.text("Color:", 20, yPosition);
    doc.text(`${details?.color?.name || "N/A"}`, xOffset, yPosition);
    yPosition += 10;

    // Monogram Section
    doc.setFont(labelStyle.font, labelStyle.fontStyle);
    doc.text("MONOGRAM DETAILS:", 20, yPosition);
    yPosition += 10;
    doc.setFont("helvetica", "normal");
    doc.text("Monogram Text:", 20, yPosition);
    doc.text(`${details?.monogram?.text || "N/A"}`, xOffset, yPosition);
    yPosition += 10;
    doc.text("Monogram Color:", 20, yPosition);
    doc.text(`${details?.monogram?.color || "N/A"}`, xOffset, yPosition);
    yPosition += 10;
    doc.text("Monogram Style:", 20, yPosition);
    doc.text(`${details?.monogram?.style?.name || "N/A"}`, xOffset, yPosition);
    yPosition += 10;
    doc.text("Monogram Position:", 20, yPosition);
    doc.text(`${details?.monogram?.position?.name || "N/A"}`, xOffset, yPosition);
    yPosition += 15;

    // Add a new page for measurement details
    doc.addPage();
    yPosition = 20;

    // Measurement Section (split in two columns)
    doc.setFont(labelStyle.font, labelStyle.fontStyle);
    doc.text("MEASUREMENT DETAILS:", 20, yPosition);
    yPosition += 10;

    // Left column measurements
    doc.setFont("helvetica", "normal");
    doc.text("Collar:", 20, yPosition);
    doc.text(`${details?.measurement?.collar || "N/A"}`, xOffset, yPosition);
    yPosition += 10;
    doc.text("Neck:", 20, yPosition);
    doc.text(`${details?.measurement?.neck || "N/A"}`, xOffset, yPosition);
    yPosition += 10;
    doc.text("Chest:", 20, yPosition);
    doc.text(`${details?.measurement?.chest || "N/A"}`, xOffset, yPosition);
    yPosition += 10;
    doc.text("Half Chest:", 20, yPosition);
    doc.text(`${details?.measurement?.halfChest || "N/A"}`, xOffset, yPosition);
    yPosition += 10;
    doc.text("Waist:", 20, yPosition);
    doc.text(`${details?.measurement?.waist || "N/A"}`, xOffset, yPosition);
    yPosition += 10;
    doc.text("Half Waist:", 20, yPosition);
    doc.text(`${details?.measurement?.halfWaist || "N/A"}`, xOffset, yPosition);
    yPosition += 10;

    // Right column measurements
    doc.text("Hips:", 20, yPosition);
    doc.text(`${details?.measurement?.hips || "N/A"}`, xOffset, yPosition);
    yPosition += 10;
    doc.text("Half Hips:", 20, yPosition);
    doc.text(`${details?.measurement?.halfHips || "N/A"}`, xOffset, yPosition);
    yPosition += 10;
    doc.text("Shoulder:", 20, yPosition);
    doc.text(`${details?.measurement?.shoulder || "N/A"}`, xOffset, yPosition);
    yPosition += 10;
    doc.text("Sleeves Length:", 20, yPosition);
    doc.text(`${details?.measurement?.sleevesLength || "N/A"}`, xOffset, yPosition);
    yPosition += 10;
    doc.text("Upper Arm:", 20, yPosition);
    doc.text(`${details?.measurement?.upperArm || "N/A"}`, xOffset, yPosition);
    yPosition += 10;
    doc.text("Elbow:", 20, yPosition);
    doc.text(`${details?.measurement?.elbow || "N/A"}`, xOffset, yPosition);
    yPosition += 10;
    doc.text("Elbow Width:", 20, yPosition);
    doc.text(`${details?.measurement?.elbowWidth || "N/A"}`, xOffset, yPosition);
    yPosition += 10;
    doc.text("Forearm:", 20, yPosition);
    doc.text(`${details?.measurement?.forearm || "N/A"}`, xOffset, yPosition);
    yPosition += 10;
    doc.text("Cuff:", 20, yPosition);
    doc.text(`${details?.measurement?.cuff || "N/A"}`, xOffset, yPosition);
    yPosition += 15;
  });

  // Save the PDF with an appropriate name
  doc.save(`${order.orderId}-details.pdf`);
};