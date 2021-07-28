// pages/api/register.js
import axios from 'axios'
import { NextRequest } from '@sentry/nextjs/dist/utils/instrumentServer'
import { NextApiResponse } from 'next'

const sleep = () => new Promise((resolve) => setTimeout(resolve, 350))

export default async function handler(req: NextRequest, res: NextApiResponse) {
  const { body, method } = req

  // Extract the email and captcha code from the request body
  // @ts-ignore
  const { form, captcha } = body

  if (method === 'POST') {
    // If email or captcha are missing return an error
    if (!captcha || !Object.keys(form).length) {
      return res.status(422).json({
        message: 'Unproccesable request, please provide the required fields',
      })
    }

    try {
      // Ping the google recaptcha verify API to verify the captcha code you received
      const captchaValidation = await axios
        .post(
          `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captcha}`,
          {
            headers: {
              'Content-Type':
                'application/x-www-form-urlencoded; charset=utf-8',
            },
          }
        )
        .then((res) => res.data)
      /**
             * The structure of response from the veirfy API is
             * {
             *  "success": true|false,
             *  "challenge_ts": timestamp,  // timestamp of the challenge load (ISO format yyyy-MM-dd'T'HH:mm:ssZZ)
             *  "hostname": string,         // the hostname of the site where the reCAPTCHA was solved
             *  "error-codes": [...]        // optional
        }
             */

      console.log(captchaValidation)

      if (captchaValidation) {
        // Return 200 if everything is successful
        return res.status(200).send('OK')
      }

      return res.status(422).json({
        message: 'Unproccesable request, Invalid captcha code',
      })
    } catch (error) {
      console.log(error)
      return res.status(422).json({ message: 'Something went wrong' })
    }
  }
  // Return 404 if someone pings the API with a method other than
  // POST
  return res.status(404).send('Not found')
}
