import * as Yup from 'yup';

import Recipient from '../models/Recipient';

class RecipientController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      address: Yup.string().required(),
      number: Yup.number().required(),
      complement: Yup.number().required(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      zipcode: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations fails' });
    }

    const recipient = await Recipient.create(req.body);

    return res.json(recipient);
  }
}

export default new RecipientController();
