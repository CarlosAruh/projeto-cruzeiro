import { auth } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import UserModel from '@/lib/models/UserModel'
export const DELETE = auth(async (...args: any) => {
  const [req, { params }] = args
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json(
      { message: 'não autorizado' },
      {
        status: 401,
      }
    )
  }
  try {
    await dbConnect()
    const user = await UserModel.findById(params.id)
    if (user) {
      if (user.isAdmin)
        return Response.json(
          { message: 'Usuario é admin' },
          {
            status: 400,
          }
        )
      await user.deleteOne()
      return Response.json({ message: 'Usuario deletado com sucesso' })
    } else {
      return Response.json(
        { message: 'Usuario não encontrado' },
        {
          status: 404,
        }
      )
    }
  } catch (err: any) {
    return Response.json(
      { message: err.message },
      {
        status: 500,
      }
    )
  }
}) as any
