import { Op } from 'sequelize';

import DeliveryMan from '../models/DeliveryMan';
import Delivery from '../models/Delivery';
import File from '../models/File';

class DeliveriesMadeController {
  async index(req, res) {
    const deliveryman = req.params;

    const checkId = await DeliveryMan.findOne({
      where: {
        id: deliveryman.id,
      },
    });

    if (!checkId) {
      return res.status(401).json({ error: 'Delivery Man does not exist' });
    }

    const deliveries = await Delivery.findAll({
      include: [
        {
          model: File,
          as: 'signature',
          attributes: ['name', 'path', 'url'],
        },
      ],
      where: {
        deliveryman_id: checkId.id,
        canceled_at: null,
        end_date: {
          [Op.ne]: null,
        },
      },
    });

    return res.json(deliveries);
  }
}

export default new DeliveriesMadeController();
