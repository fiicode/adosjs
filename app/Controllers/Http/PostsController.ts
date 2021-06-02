import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Application from '@ioc:Adonis/Core/Application'
import Post from 'App/Models/Post';
import { schema } from '@ioc:Adonis/Core/Validator';

export default class PostsController {
  public async index({ }: HttpContextContract) {
  }

  public async create({ view }: HttpContextContract) {
    return view.render('posts/create')
  }

  public async store({ request, auth, response }: HttpContextContract) {
    const req = await request.validate({
      schema: schema.create({
        caption: schema.string({}),
        image: schema.file({
          size: '2mb',
          extnames: ['jpg', 'png', 'jpeg', 'svg']
        })
      }),
      messages: {
        "caption.required": "Caption field is required",
        "image.required": "image file is required for post"
      }
    });

    const imageName = new Date().getTime().toString() + `.${req.image.extname}`
    await req.image.move(Application.publicPath('posts_images'), {
      name: imageName
    })
    const post = new Post()
    post.image = `posts_images/${imageName}`
    post.caption = req.caption
    post.userId = auth.user!.id
    post.save()


    return response.redirect(`/${auth.user!.username}`)
  }

  public async show({ }: HttpContextContract) {
  }

  public async edit({ }: HttpContextContract) {
  }

  public async update({ }: HttpContextContract) {
  }

  public async destroy({ }: HttpContextContract) {
  }
}
