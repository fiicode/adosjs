import Hash from '@ioc:Adonis/Core/Hash'
import { DateTime } from 'luxon'
import { BaseModel, beforeSave, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Mail from '@ioc:Adonis/Addons/Mail';
// import { nanoid } from 'nanoid';
import Env from '@ioc:Adonis/Core/Env';
import Route from '@ioc:Adonis/Core/Route'
import Post from './Post';
import Following from './Following';

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public email: string

  @column()
  public username: string

  @column()
  public avatar: string

  @column()
  public details: string

  @column()
  public password: string

  @column.dateTime()
  public email_verification_at: DateTime

  @hasMany(() => Post)
  public posts: HasMany<typeof Post>

  @hasMany(() => Following)
  public followings: HasMany<typeof Following>

  public async followers() {
    const followersCount = await Following.query().where('following_id', this.id)
    return followersCount.length
  }

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  public async sendVerficationEmail() {
    // const token = nanoid()
    // session.put(`token-${this.id}`, token)
    // const url = `${Env.get('APP_URL')}/confirm-email/${this.id}/${token}`
    const url = Env.get('APP_URL') + Route.makeSignedUrl('verifyEmail', {
      params: { email: this.email },
      expiresIn: '30m',
    })
    Mail.send((message) => {
      message.from('verify@adonis_web.com')
        .to(this.email)
        .subject('Please verify your email')
        .htmlView('emails/verify', { user: this, url })
    })
  }
}
