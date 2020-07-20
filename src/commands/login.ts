import {Command, flags} from '@oclif/command'
import * as inquirer from 'inquirer'

import {APIClient} from '../api'
import config from '../config'

export default class Login extends Command {
  static description = 'Login to HackMD/CodiMD server from CLI'

  static examples = [
    `$ hackmd-cli login

Enter your email: hello@hackmd.io
Enter your password: *******

Login as HMD successfully!
`,
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    id: flags.string({char: 'u', description: 'Login email/username'}),
    ldap: flags.boolean()
  }

  async run() {
    const {flags} = this.parse(Login)

    let id = flags.id || config.loginID
    let password = config.loginPassword || ''
    const useLdap = flags.ldap || config.ldap

    if (!id) {
      if (useLdap) {
        const out = await inquirer.prompt({
          type: 'input',
          name: 'username',
          message: 'Enter your username'
        })
        id = out.username
        if (!id) {
          return this.log('No username is given')
        }
      } else {
        const out = await inquirer.prompt({
          type: 'input',
          name: 'email',
          message: 'Enter your email'
        })
        id = out.email
        if (!id) {
          // TODO: do more email validation
          return this.log('No email is given')
        }
      }
    }

    if (!password) {
      password = (await inquirer.prompt({
      type: 'password',
      name: 'password',
      message: 'Enter your password'
      })).password
    }

    try {
      if (useLdap) {
        await APIClient.loginLdap(id, password)
      } else {
        await APIClient.login(id, password)
      }

      const login = await APIClient.isLogin()
      if (login) {
        return this.log('Login successfully')
      } else {
        this.log('Login failed, please ensure your credentials are set')
      }
    } catch (err) {
      this.error(err)
    }
  }
}
