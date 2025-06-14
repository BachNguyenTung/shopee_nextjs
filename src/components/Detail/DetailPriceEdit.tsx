import React, { useState } from 'react';
import { NumericFormat } from 'react-number-format';
import { useWebSocketAmin } from "@/hooks/useWebSocketAdmin";
import { doc, updateDoc } from 'firebase/firestore';
import { db } from "@/configs/firebase";

interface DetailPriceEditProps {
  productId: string;
  currentPrice: number;
}

export const DetailPriceEdit: React.FC<DetailPriceEditProps> = ({ productId, currentPrice }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newPrice, setNewPrice] = useState(currentPrice);
  const { socket } = useWebSocketAmin(productId);

  const handleUpdatePrice = async () => {
    console.log("🚀 Emitting price-update. Socket status:",
      socket ? `exists (id: ${socket.id})` : "null",
      socket?.connected ? "CONNECTED" : "DISCONNECTED"
    );

    if (!socket || !socket.connected) {
      console.error("❌ Cannot emit - socket not ready");
      return;
    }

    try {
      await updateDoc(doc(db, 'products', productId), { price: newPrice });

      // Add detailed emit with callback
      socket.emit('price-update', {
        productId,
        newPrice,
        timestamp: Date.now()
      }, (ack: any) => {
        if (ack) {
          console.log("✅ Server acknowledged:", ack);
        } else {
          console.log("❌ No acknowledgement from server");
        }
      });

      setIsEditing(false);
    } catch (error) {
      console.error('Error updating price:', error);
    }
  };

  if (!isEditing) {
    return (
      <div className="detail-product__price" onClick={() => setIsEditing(true)}>
        <NumericFormat
          value={currentPrice}
          prefix={"₫"}
          thousandSeparator={true}
          displayType="text"
        />
        <span className="ml-2 text-sm text-gray-500">(Click to edit)</span>
      </div>
    );
  }

  return (
    <div className="detail-product__price-edit" data-product-admin-id={productId}>
      <input
        type="number"
        value={newPrice}
        onChange={(e) => setNewPrice(Number(e.target.value))}
        className="border rounded px-2 py-1 mr-2"
      />
      <button
        onClick={handleUpdatePrice}
        className="bg-primary text-white px-4 py-1 rounded mr-2"
      >
        Save
      </button>
      <button
        onClick={() => {
          setIsEditing(false);
          setNewPrice(currentPrice);
        }}
        className="bg-gray-500 text-white px-4 py-1 rounded"
      >
        Cancel
      </button>
    </div>
  );
};
