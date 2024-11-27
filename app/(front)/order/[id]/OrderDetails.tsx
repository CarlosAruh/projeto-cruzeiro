'use client'

import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js'
import { OrderItem } from '@/lib/models/OrderModel'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import toast from 'react-hot-toast'
import useSWR from 'swr'
export default function OrderDetails({
  orderId,
  paypalClientId,
}: {
  orderId: string
  paypalClientId: string
}) {
  const { data: session } = useSession()

  function createPayPalOrder() {
    return fetch(`/api/orders/${orderId}/create-paypal-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((order) => order.id)
  }

  function onApprovePayPalOrder(data: any) {
    return fetch(`/api/orders/${orderId}/capture-paypal-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((orderData) => {
        toast.success('Pedido Pago ccom Sucesso!')
      })
  }

  const { data, error } = useSWR(`/api/orders/${orderId}`)
  if (error) return error.message
  if (!data) return 'Loading...'
  const {
    paymentMethod,
    shippingAddress,
    items,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isDelivered,
    deliveredAt,
    isPaid,
    paidAt,
  } = data
  return (
    <div>
      <h1 className="text-2xl py-4">Pedido {orderId}</h1>
      <div className="grid md:grid-cols-4 md:gap-5 my-4">
        <div className="md:col-span-3">
          <div className="card bg-base-300">
            <div className="card-body">
              <h2 className="card-title">Endereço de Entrega</h2>
              <p>{shippingAddress.fullName}</p>
              <p>
                {shippingAddress.address}, {shippingAddress.city},{' '}
                {shippingAddress.postalCode}, {shippingAddress.country}{' '}
              </p>
              {isDelivered ? (
                <div className="text-success">Entregue em: {deliveredAt}</div>
              ) : (
                <div className="text-error">Não Entregue</div>
              )}
            </div>
          </div>
          <div className="card bg-base-300 mt-4">
            <div className="card-body">
              <h2 className="card-title">Método de Pagamento</h2>
              <p>{paymentMethod}</p>
              {isPaid ? (
                <div className="text-success">Pago em {paidAt}</div>
              ) : (
                <div className="text-error">Não Pago</div>
              )}
            </div>
          </div>
          <div className="card bg-base-300 mt-4">
            <div className="card-body">
              <h2 className="card-title">Items</h2>
              <table className="table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Quantidade</th>
                    <th>Preço</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item: OrderItem) => (
                    <tr key={item.slug}>
                      <td>
                        <Link
                          href={`/product/${item.slug}`}
                          className="flex items-center"
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={50}
                          ></Image>
                          <span className="px-2">
                            {item.name} ({item.color} {item.size})
                          </span>
                        </Link>
                      </td>
                      <td>{item.qty}</td>
                      <td>R$ {item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div>
          <div className="card bg-base-300">
            <div className="card-body">
              <h2 className="card-title">Resumo da Compra</h2>
              <ul>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Items</div>
                    <div>R$ {itemsPrice}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Taxa</div>
                    <div>R$ {taxPrice}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Entrega</div>
                    <div>R$ {shippingPrice}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Total</div>
                    <div>R$ {totalPrice}</div>
                  </div>
                </li>
                {!isPaid && paymentMethod === 'PayPal' && (
                  <li>
                    <PayPalScriptProvider
                      options={{ clientId: paypalClientId, currency: 'BRL' }}
                    >
                      <PayPalButtons
                        createOrder={createPayPalOrder}
                        onApprove={onApprovePayPalOrder}
                      />
                    </PayPalScriptProvider>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
