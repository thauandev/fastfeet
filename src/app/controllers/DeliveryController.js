import * as Yup from 'yup';
import { Op } from 'sequelize';

import Delivery from '../models/Delivery';
import Recipient from '../models/Recipient';
import DeliveryMan from '../models/DeliveryMan';
import File from '../models/File';

import Mail from '../../lib/Mail';

class DeliveryController {
  async index(req, res) {
    const { product } = req.query;
    let checkDelivery = null;

    if (product == null) {
      const deliveries = await Delivery.findAll({
        include: [
          {
            model: File,
            as: 'signature',
            attributes: ['name', 'path', 'url'],
          },
        ],
      });

      checkDelivery = deliveries;
    }

    if (product != null) {
      const deliveries = await Delivery.findAll({
        include: [
          {
            model: File,
            as: 'signature',
            attributes: ['name', 'path', 'url'],
          },
        ],

        where: {
          product: {
            [Op.like]: product,
          },
        },
      });

      checkDelivery = deliveries;
    }

    return res.json(checkDelivery);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
      product: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { recipient_id, deliveryman_id, product } = req.body;

    const checkRecipient = await Recipient.findOne({
      where: {
        id: recipient_id,
      },
    });

    if (!checkRecipient) {
      return res.status(401).json({ error: 'Recipient does not exist' });
    }

    const checkDeliveryMan = await DeliveryMan.findOne({
      where: {
        id: deliveryman_id,
      },
    });

    if (!checkDeliveryMan) {
      return res.status(401).json({ error: 'Delivery Man does not exist' });
    }

    const delivery = await Delivery.create(req.body);

    await Mail.sendMail({
      to: `${checkDeliveryMan.name} <${checkDeliveryMan.email}`,
      subject: 'Você tem uma entrega cadastrada',
      template: 'delivery',
      context: {
        deliveryman: checkDeliveryMan.name,
        recipient: checkRecipient.name,
        product,
        recadress: checkRecipient.address,
        recnumber: checkRecipient.number,
        reccomplement: checkRecipient.complement,
        recstate: checkRecipient.state,
        reccity: checkRecipient.city,
        reczipcode: checkRecipient.zipcode,
      },
    });

    return res.json(delivery);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number(),
      deliveryman_id: Yup.number(),
      product: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const checkID = req.params;

    const { recipient_id, deliveryman_id } = req.body;

    const deliveryIndex = await Delivery.findOne({
      where: {
        id: checkID.id,
      },
    });

    if (!deliveryIndex) {
      return res.status(401).json({ error: 'Delivery does not exist' });
    }

    const checkRecipient = await Recipient.findOne({
      where: {
        id: recipient_id,
      },
    });

    if (!checkRecipient) {
      return res.status(401).json({ error: 'Recipient does not exist' });
    }

    const checkDeliveryMan = await DeliveryMan.findOne({
      where: {
        id: deliveryman_id,
      },
    });

    if (!checkDeliveryMan) {
      return res.status(401).json({ error: 'Delivery Man does not exist' });
    }

    await deliveryIndex.update(req.body);

    return res.json(req.body);
  }

  async delete(req, res) {
    const checkID = req.params;

    const deliveryIndex = await Delivery.findOne({
      where: {
        id: checkID.id,
      },
    });

    if (!deliveryIndex) {
      return res.status(401).json({ error: 'Delivery does not exist' });
    }

    await deliveryIndex.destroy(checkID);

    return res.json({ message: 'Delivery deleted' });
  }
}

export default new DeliveryController();
