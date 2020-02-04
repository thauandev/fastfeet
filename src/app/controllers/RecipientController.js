import * as Yup from 'yup';

import Recipient from '../models/Recipient';

class RecipientController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      address: Yup.string().required(),
      number: Yup.number().required(),
      complement: Yup.string().required(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      zipcode: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations fails' });
    }

    const { name } = req.body;

    const checkName = await Recipient.findOne({
      where: { name },
    });

    if (!checkName) {
      return res.status(401).json({ error: 'Recipient already exist' });
    }

    const recipient = await Recipient.create(req.body);

    return res.json(recipient);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      address: Yup.string(),
      number: Yup.number(),
      complement: Yup.string(),
      state: Yup.string(),
      city: Yup.string(),
      zipcode: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations fails' });
    }

    const recipient = req.body;
    const checkID = req.params;

    const recipientIndex = await Recipient.findOne({
      where: { id: checkID.id },
    });

    const checkName = await Recipient.findOne({
      where: { name: recipient.name },
    });

    if (checkName) {
      return res.status(401).json({ error: 'Recipient already exist' });
    }

    await recipientIndex.update(req.body);

    return res.json(recipient);
  }
}

export default new RecipientController();
