import * as Yup from 'yup';
import Delivery from '../models/Delivery';
import Recipient from '../models/Recipient';
import DeliveryMan from '../models/DeliveryMan';

class DeliveryController {
  async index(req, res) {
    const deliveries = await Delivery.findAll();

    return res.json(deliveries);
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

    const { recipient_id, deliveryman_id } = req.body;

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

    return res.json({ message: 'Delivery Man deleted' });
  }
}

export default new DeliveryController();
