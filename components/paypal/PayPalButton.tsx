"use client";

import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import type {
  CreateOrderActions,
  CreateOrderData,
  OnApproveActions,
  OnApproveData,
} from "@paypal/paypal-js";

import { paypalCheckPayment, setTransactionId } from "@/actions";

interface Props {
  orderId: string;
  amount: number;
  currency?: "USD" | "EUR";
}

export const PayPalButton = ({ orderId, amount, currency = "USD" }: Props) => {
  const [{ isPending }] = usePayPalScriptReducer();

  const roundedAmount = amount.toFixed(2);

  if (isPending) {
    return (
      <div className="animate-pulse mb-10 space-y-2">
        <div className="h-11 bg-gray-300 rounded" />
        <div className="h-11 bg-gray-300 rounded" />
      </div>
    );
  }

  const createOrder = async (
    _: CreateOrderData,
    actions: CreateOrderActions,
  ): Promise<string> => {
    const transactionId = await actions.order.create({
      intent: "CAPTURE", //el SDK de PayPal exige "CAPTURE" | "AUTHORIZE" en tsx
      purchase_units: [
        {
          invoice_id: orderId,
          amount: {
            currency_code: currency, // ✅ obligatorio
            value: roundedAmount,
          },
        },
      ],
    });

    const result = await setTransactionId(orderId, transactionId);

    if (!result.ok) {
      throw new Error("No se pudo guardar el ID de la transacción");
    }

    return transactionId;
  };

  const onApprove = async (_: OnApproveData, actions: OnApproveActions) => {
    const details = await actions.order?.capture();

    if (!details?.id) {
      throw new Error("PayPal no devolvió un ID de transacción");
    }

    const result = await paypalCheckPayment(details.id);

    if (!result.ok) {
      throw new Error(result.message ?? "Error al verificar el pago");
    }
  };

  return (
    <PayPalButtons
      createOrder={createOrder}
      onApprove={onApprove}
      forceReRender={[roundedAmount, currency]}
    />
  );
};
