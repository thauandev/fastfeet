import DeliveryProblem from '../models/DeliveryProblem';

class AllDeliveryProblemsController {
  async index(req, res) {
    const problems = await DeliveryProblem.findAll();

    return res.json(problems);
  }
}

export default new AllDeliveryProblemsController();
