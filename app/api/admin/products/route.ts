import { auth } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import ProductModel from '@/lib/models/ProductModel'

export const GET = auth(async (req: any) => {
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json(
      { message: 'não autorizado' },
      {
        status: 401,
      }
    )
  }
  await dbConnect()
  const products = await ProductModel.find()
  return Response.json(products)
}) as any

export const POST = auth(async (req: any) => {
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json(
      { message: 'não autorizado' },
      {
        status: 401,
      }
    )
  }
  await dbConnect()
  const product = new ProductModel({
    name: 'nome exemplo',
    slug: 'nome-exemplo-' + Math.random(),
    image: '/images/camiseta.jpg',
    price: 0,
    category: 'categoria exemplo',
    brand: 'marca exemplo',
    countInStock: 0,
    description: 'descrição exemplo',
    rating: 0,
    numReviews: 0,
  })
  try {
    await product.save()
    return Response.json(
      { message: 'Produto criado com sucesso', product },
      {
        status: 201,
      }
    )
  } catch (err: any) {
    return Response.json(
      { message: err.message },
      {
        status: 500,
      }
    )
  }
}) as any