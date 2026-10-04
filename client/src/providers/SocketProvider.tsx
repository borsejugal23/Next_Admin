"use client";

import { productKeys } from "@/lib/query-keys";
import { socket } from "@/lib/socket";
import { addNotification } from "@/stores/notification/reducer";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

type ProductUpdatedPayload = {
  id: string;
  title?: string;
  updatedAt?: string;
};

export default function SocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  useEffect(() => {
    const onConnect = () => {
      console.log("Connected:", socket.id);
    };

    const onDisconnect = () => {
      console.log("Disconnected");
    };

    const onConnectError = (error: Error) => {
      console.error("Socket connect error:", error.message);
    };

    const onProductUpdated = (data: ProductUpdatedPayload) => {
      const productTitle = data.title?.trim() || "Product";

      dispatch(
        addNotification({
          message: `"${productTitle}" was updated just now.`,
          updatedAt: data.updatedAt ?? new Date().toISOString(),
        }),
      );

      void queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);
    socket.on("productUpdated", onProductUpdated);

    if (socket.connected) {
      onConnect();
    } else {
      socket.connect();
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      socket.off("productUpdated", onProductUpdated);
    };
  }, [dispatch, queryClient]);

  return <>{children}</>;
}
