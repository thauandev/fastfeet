import {
  startOfHour,
  parseISO,
  isBefore,
  getHours,
  startOfDay,
  endOfDay,
  getTime,
} from 'date-fns';
import { Op } from 'sequelize';
import Delivery from '../models/Delivery';

class StartDeliveryController {
  async update(req, res) {
    const { id, orderId } = req.params;

    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: 'Invalid date' });
    }

    const hourStart = startOfHour(parseISO(date));

    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permited' });
    }

    const startDate = Number(date);

    const dataAtual = getTime(startDate);

    const result = getHours(startDate);

    if (!result >= 8 && result < 18) {
      return res
        .status(401)
        .json({ error: 'Start delivery just in bussines hour' });
    }

    const deliveryIndex = await Delivery.findOne({
      where: {
        id: orderId,
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

    const qtdRetiradas = await Delivery.count({
      where: {
        deliveryman_id: id,
        canceled_at: null,
        start_date: {
          [Op.between]: [startOfDay(dataAtual), endOfDay(dataAtual)],
        },
      },
    });

    if (qtdRetiradas === 5) {
      return res.status(401).json({ error: 'Withdrawn limit exceeded ' });
    }

    await deliveryIndex.update({
      ...deliveryIndex,
      start_date: startDate,
    });

    return res.json(deliveryIndex);
  }
}

export default new StartDeliveryController();
