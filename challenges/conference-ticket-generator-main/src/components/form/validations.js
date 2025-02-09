import { howManyChars } from '../../utils/utils'

/* 
  * validations[func] requires trimmed string -> str.trim()
*/
const validations = {
  validateUserName(name) {
    const messages = {
      long: 'Name is too long',
      short: 'Name is too short',
      empty: 'Name can\'t be empty',
      chars: 'Name must not contain numbers or signs'
    }

    return messages[
      (() => {
        const match = name.match(/[0-9!*\(\)+%\$\^\{\}\\\:\;\/\,\<\>"@_]/)?.[0]

        if (name.length === 0) return 'empty'
        if (name.length >= 64) return 'long'

        if (name.length < 3 && match) return 'chars'
        if (name.length < 3) return 'short'

        if (match) return 'chars'
      })()]
  },

  validateUserEmail(email) {
    const messages = {
      match: 'Email must match username@domain.tld',
      empty: 'Email can\'t be empty',
      usernameShort: 'Username is too short',
      domainShort: 'Domain is too short',
      tldShort: 'TLD is too short'
    }

    const splittedMail = email.split(/[@\.]/)
    /* 
     * splittedMail[0] = username
     * splittedMail[1] = domain || null
     * splittedMail[2] = tld || null
    */

    return messages[
      (() => {
        const howManyAts = howManyChars(email, '@')

        // order matters
        if (email.length === 0) return 'empty'

        if (splittedMail.length > 3) return 'match'

        if (splittedMail[0].length < 2) return 'usernameShort'

        if (!splittedMail[1]) return 'match'
        if (splittedMail[1].length < 2) return 'domainShort'

        if (!splittedMail[2]) return 'match'
        if (splittedMail[2].length < 2) return 'tldShort'

        if (howManyAts > 1 || howManyAts < 1) return 'match'
      })()]
  },

  validateUserGithubName(githubUser) {
    const messages = {
      empty: 'Github user can\'t be empty',
      short: 'Github user is too short',
      match: 'Github user must match @username'
    }

    return messages[
      (() => {
        const howManyAts = howManyChars(githubUser, '@')

        if (githubUser.length === 0) return 'empty'

        // In this case...[0] will be the @
        if (githubUser.split(/[@]/)[0] !== '') return 'match'

        // Github usersnames can be 1 char so we test for @ + char
        if (githubUser.length < 2) return 'short'

        if (howManyAts > 1 || howManyAts < 1) return 'match'
      })()]
  }
}

export default validations
