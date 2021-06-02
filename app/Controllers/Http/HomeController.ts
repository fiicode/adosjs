import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Post from 'App/Models/Post'

export default class HomeController {
  public async index({ view, auth, response }: HttpContextContract) {
    if (!auth.isAuthenticated) {
      return response.redirect('/login')
    }

    await auth.user?.load('followings')
    const followings = auth.user?.followings.map(f => f.followingId)
    const userIds = [auth.user!.id, ...followings ?? []]

    const posts = await Post.query().whereIn('userId', userIds).preload('user').orderBy('created_at', 'desc')

    return view.render('welcome', { posts })
  }
}
