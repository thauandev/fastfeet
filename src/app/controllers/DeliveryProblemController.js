import * as Yup from 'yup';
import DeliveryProblem from '../models/DeliveryProblem';

class DeliveryProblemController {
  async index(req, res) {
    const { id } = req.params;

    const checkId = await DeliveryProblem.findOne({
      where: {
        delivery_id: id,
      },
    });
    if (!checkId) {
      return res.status(401).json({ error: 'Problem not find' });
    }

    return res.json(checkId);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    const { id } = req.params;
    const { description } = req.body;

    const deliveryProblem = await DeliveryProblem.create({
      delivery_id: id,
      description,
    });

    return res.json(deliveryProblem);
  }
}

export default new DeliveryProblemController();
