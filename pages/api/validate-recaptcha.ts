import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const validateCaptcha = (response_key: any) => {
    console.log(typeof response_key)
    return new Promise((resolve, reject) => {
      const secret_key = process.env.RECAPTCHA_SECRET

      const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${response_key}`

      fetch(url, {
        method: 'post',
      })
        .then((response) => response.json())
        .then((google_response) => {
          if (google_response.success == true) {
            resolve(true)
          } else {
            resolve(false)
          }
        })
        .catch((err) => {
          console.log(err)
          resolve(false)
        })
    })
  }

  if (!(await validateCaptcha(req.body['g-recaptcha-response']))) {
    return res.redirect(`/captcha`)
  }
  delete req.body['g-recaptcha-response']
}
