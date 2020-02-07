import DeliveryMan from '../models/DeliveryMan';
import Delivery from '../models/Delivery';

class OrderController {
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
      where: {
        deliveryman_id: checkId.id,
        canceled_at: null,
        end_date: null,
      },
    });

    return res.json(deliveries);
  }
}

export default new OrderController();
