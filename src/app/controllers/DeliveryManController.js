import * as Yup from 'yup';
import { Op } from 'sequelize';

import DeliveryMan from '../models/DeliveryMan';
import File from '../models/File';

class DeliveryManController {
  async index(req, res) {
    const { name } = req.query;
    let checkName = null;

    if (name == null) {
      const deliverymens = await DeliveryMan.findAll({
        attributes: ['id', 'name', 'email', 'avatar_id'],
        include: [
          {
            model: File,
            as: 'avatar',
            attributes: ['name', 'path', 'url'],
          },
        ],
      });
      checkName = deliverymens;
    }

    if (name != null) {
      const deliverymens = await DeliveryMan.findAll({
        attributes: ['id', 'name', 'email', 'avatar_id'],
        include: [
          {
            model: File,
            as: 'avatar',
            attributes: ['name', 'path', 'url'],
          },
        ],

        where: {
          name: {
            [Op.like]: name,
          },
        },
      });
      checkName = deliverymens;
    }

    return res.json(checkName);
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

    const deliveryman = req.body;

    const checkID = req.params;

    const deliveryManIndex = await DeliveryMan.findOne({
      where: { id: checkID.id },
    });

    if (!deliveryManIndex) {
      return res.status(401).json({ error: 'Delivery man not exist' });
    }

    const checkName = await DeliveryMan.findOne({
      where: { name: deliveryman.name },
    });

    if (checkName) {
      return res.status(401).json({ error: 'User already exists' });
    }

    const checkEmail = await DeliveryMan.findOne({
      where: { email: deliveryman.email },
    });

    if (checkEmail) {
      return res.status(401).json({ error: 'Email already exists' });
    }

    await deliveryManIndex.update(req.body);

    return res.json(deliveryman);
  }

  async delete(req, res) {
    const checkID = req.params;

    const deliveryManIndex = await DeliveryMan.findOne({
      where: { id: checkID.id },
    });

    if (!deliveryManIndex) {
      return res.status(401).json({ error: 'Delivery man not exist' });
    }

    await deliveryManIndex.destroy(checkID);

    return res.json({ message: 'Delivery Man deleted' });
  }
}

export default new DeliveryManController();
