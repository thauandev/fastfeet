import * as Yup from 'yup';

import DeliveryMan from '../models/DeliveryMan';

class DeliveryManController {
  async index(req, res) {
    const deliverymens = await DeliveryMan.findAll();

    return res.json(deliverymens);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .required()
        .email(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations fails' });
    }

    const { name, email } = req.body;

    const checkName = await DeliveryMan.findOne({
      where: { name },
    });

    if (checkName) {
      return res.status(401).json({ error: 'User already exists' });
    }

    const checkEmail = await DeliveryMan.findOne({
      where: { email },
    });

    if (checkEmail) {
      return res.status(401).json({ error: 'Email already exists' });
    }

    const deliveryman = await DeliveryMan.create(req.body);

    return res.json(deliveryman);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations fails' });
    }

    const { name, email } = req.body;

    const checkID = req.params;

    const deliveryIndex = await DeliveryMan.findOne({
      where: { id: checkID.id },
    });

    if (!deliveryIndex) {
      return res.status(401).json({ error: 'Delivery man not exist' });
    }

    const checkName = await DeliveryMan.findOne({
      where: { name },
    });

    if (checkName) {
      return res.status(401).json({ error: 'User already exists' });
    }

    const checkEmail = await DeliveryMan.findOne({
      where: { email },
    });

    if (checkEmail) {
      return res.status(401).json({ error: 'Email already exists' });
    }

    await deliveryIndex.update(req.body);

    return res.json({
      name,
      email,
    });
  }

  async delete(req, res) {
    const checkID = req.params;

    const deliveryIndex = await DeliveryMan.findOne({
      where: { id: checkID.id },
    });

    if (!deliveryIndex) {
      return res.status(401).json({ error: 'Delivery man not exist' });
    }

    await deliveryIndex.destroy(checkID);

    return res.json({ message: 'Delivery Man deleted' });
  }
}

export default new DeliveryManController();
