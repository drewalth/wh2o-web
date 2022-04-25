import { Contact, CreateContactDto } from '../types'
import { checkResponse, http } from '../lib'

export const createContactSubmission = async (
  input: CreateContactDto,
): Promise<Contact> => {
  return http
    .post('/contact/create', {
      body: JSON.stringify(input),
    })
    .then((res) => checkResponse(res))
}
