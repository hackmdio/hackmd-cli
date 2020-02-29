import {Command, flags} from '@oclif/command'
import * as inquirer from 'inquirer'

import {APIClient} from '../api'

export default class Login extends Command {
  static description = 'Login HackMD instance from CLI'

  static examples = [
    `$ codimd-cli login

Enter your email: hello@codimd.domain
Enter your password: *******

Login as HMD successfully!
`,
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    email: flags.string({char: 'u', description: 'Login email'})
  }

  async run() {
    const {flags} = this.parse(Login)

    let email = flags.email

    if (!email) {
      const out = await inquirer.prompt({
        type: 'input',
        name: 'email',
        message: 'Enter your email'
      })
      email = out.email
      if (!email) {
        // TODO: do more email validation
        return this.log('No email is given')
      }
    }

    const {password} = await inquirer.prompt({
      type: 'password',
      name: 'password',
      message: 'Enter your password'
    })

    try {
      if (await APIClient.login(email, password)) {
        return this.log('Login successfully')
      } else {
        this.log('Login failed, please ensure your email/password is set')
      }
    } catch (err) {
      this.error(err)
    }
  }
}
