import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User';
import Application from '@ioc:Adonis/Core/Application'
// import { UserFactory } from 'Database/factories';

export default class ProfilesController {
  public async index({ view, params, auth }: HttpContextContract) {
    const username = params.username;
    const user = await User.findBy('username', username)


    // await UserFactory.with('posts', 5).createMany(10)

    if (!user) {
      return view.render('errors.not-found')
    }
    await user.load('posts')
    await user.load('followings')
    await auth.user?.load('followings')
    const followers = await user.followers()
    return view.render('profile', { user, followers })
  }

  public async edit({ view }: HttpContextContract) {
    return view.render('accounts/edit')
  }

  public async update({ auth, request, response }: HttpContextContract) {
    const user = auth.user!
    const avatar = request.file('avatar')
    if (avatar) {
      const imageName = new Date().getTime().toString() + `.${avatar.extname}`
      await avatar.move(Application.publicPath('users_avatars'), {
        name: imageName,
      })
      user.avatar = `users_avatars/${imageName}`
    }

    user.details = request.input('details')
    user?.save()
    return response.redirect(`/${user!.username}`)
  }

}
