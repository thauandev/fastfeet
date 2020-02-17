import { startOfHour, isBefore, parseISO } from 'date-fns';

import DeliveryProblem from '../models/DeliveryProblem';
import Delivery from '../models/Delivery';
import DeliveryMan from '../models/DeliveryMan';
import Recipient from '../models/Recipient';

import Mail from '../../lib/Mail';

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
        canceled_at: null,
      },
    });

    if (!delivery) {
      res.status(401).json({ error: 'Delivery cannot be canceled' });
    }

    await delivery.update({
      canceled_at: cancelDate,
    });

    const deliveryMan = await DeliveryMan.findOne({
      where: {
        id: delivery.deliveryman_id,
      },
    });

    const recipient = await Recipient.findOne({
      where: {
        id: delivery.recipient_id,
      },
    });

    await Mail.sendMail({
      to: `${deliveryMan.name} <${deliveryMan.email}`,
      subject: 'Você tem uma entrega cancelada',
      template: 'cancelation',
      context: {
        deliveryman: deliveryMan.name,
        recipient: recipient.name,
        product: delivery.product,
      },
    });

    return res.json({ messsage: 'Delivery canceled' });
  }
}

export default new CancelDeliveryController();
