import { startOfHour, isBefore, parseISO } from 'date-fns';

import Delivery from '../models/Delivery';

class EndDeliveryController {
  async update(req, res) {
    const { id, orderId } = req.params;

    const { signature_id } = req.body;

    const { date } = req.query;

    const endDate = Number(date);

    if (!date) {
      return res.status(400).json({ error: 'Invalid date' });
    }

    const hourStart = startOfHour(parseISO(date));

    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permited' });
    }
    const deliveryIndex = await Delivery.findOne({
      where: {
        id: orderId,
        canceled_at: null,
      },
    });

    if (!deliveryIndex) {
      return res.status(401).json({ error: 'Delivery does not exist' });
    }

    const deliveryManIndex = await Delivery.findOne({
      where: {
        deliveryman_id: id,
      },
    });

    if (!deliveryManIndex) {
      return res.status(401).json({ error: 'Delivery Man does not exist' });
    }

    await deliveryIndex.update({
      end_date: endDate,
      signature_id,
    });

    return res.json(deliveryIndex);
  }
}

export default new EndDeliveryController();
