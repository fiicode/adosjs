import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import User from 'App/Models/User';
import { DateTime } from 'luxon';

export default class EmailVerifiesController {

  public async index({ response, auth }: HttpContextContract) {
    // verification and send email
    // auth.user?.sendVerficationEmail(session)
    auth.user?.sendVerficationEmail()
    return response.redirect().back()
  }

  public async confirm({ response, params, request }: HttpContextContract) {
    // const userid = params.userid
    // const token = params.token
    // const user = await User.findOrFail(userid)
    // const sessionToken = session.get(`token-${userid}`)
    // if (sessionToken === token) {
    if (request.hasValidSignature()) {
      const user = await User.findByOrFail('email', params.email)
      user.email_verification_at = DateTime.local()
      user.save()
      // session.forget(`token-${userid}`)
      return response.redirect(`/${user.username}`)
    }
    // }
    return 'Invalid token'
  }
}
