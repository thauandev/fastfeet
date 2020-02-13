import { startOfHour, isBefore, parseISO } from 'date-fns';
import DeliveryProblem from '../models/DeliveryProblem';
import Delivery from '../models/Delivery';

class CancelDeliveryController {
  async delete(req, res) {
    const { id } = req.params;
    const { date } = req.query;
    const cancelDate = Number(date);

    if (!date) {
      return res.status(400).json({ error: 'Invalid date' });
    }

    const hourStart = startOfHour(parseISO(date));

    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permited' });
    }

    const problemID = await DeliveryProblem.findOne({
      where: {
        id,
      },
    });

    if (!problemID) {
      return res.status(401).json({ error: 'Problem not found' });
    }

    const deliveryIndex = problemID.delivery_id;

    const delivery = await Delivery.findOne({
      where: {
        id: deliveryIndex,
      },
    });

    await delivery.update({
      canceled_at: cancelDate,
    });

    return res.json({ messsage: 'Delivery canceled' });
  }
}

export default new CancelDeliveryController();
