import 'dotenv/config';

export default class Credentials {
  public static readonly email = process.env.EMAIL;
  public static readonly password = process.env.PASSWORD;
  // public static readonly port = process.env.PORT;
  public static readonly mailServer = process.env.EMAIL_SERVER;
}
