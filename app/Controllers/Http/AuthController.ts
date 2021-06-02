import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'

export default class AuthController {

  public async login({ auth, request, response }: HttpContextContract) {
    const req = await request.validate({
      schema: schema.create({
        email: schema.string({}, [
          rules.email()
        ]),
        password: schema.string({}, [
          rules.minLength(2)
        ])
      }),
      messages: {
        'email.required': 'Email est requis',
        'password.required': 'Password est requis',
        'password.minLength': 'minimum {{ options.minLength }} caracteres'
      }
    })
    const email = req.email
    const password = req.password

    const user = await auth.use('web').attempt(email, password)

    return response.redirect(`/${user.username}`)
  }

  public async register({ request, response }: HttpContextContract) {
    const req = await request.validate({
      schema: schema.create({
        name: schema.string(),
        email: schema.string({}, [
          rules.email(),
          //rules.unique({ table: 'users', column: 'email' })
        ]),
        username: schema.string(),
        password: schema.string({}, [
          rules.confirmed()
        ])
      }),
      messages: {
        required: 'Le champ {{field}} est requis',
        'email.unique': 'email déjà pris',
        'username.required': 'Pseudo est requis',
        'password.required': 'Protéger votre compte, Ok'
      }
    })
    const user = new User()
    user.name = req.name
    user.email = req.email
    user.username = req.username
    user.password = req.password
    await user.save()

    //Send email verification
    user?.sendVerficationEmail()

    return response.redirect('/')
  }

  public async logout({ auth, response }: HttpContextContract) {
    await auth.logout()
    return response.redirect('/login')
  }
}
