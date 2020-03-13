import * as Yup from 'yup';
import Functions from '../models/Functions';

class FunctionsController {
  async index(req, res) {
    const functions = await Functions.findAll({
      order: ['created_at'],
      attributes: ['id', 'name', 'canceled_at'],
    });

    return res.json(functions);
  }

  async store(req, res) {
    const func = await Functions.create(req.body);

    return res.status(201).json(func);
  }

  async update(req, res) {
    const { id } = req.params;

    const schema = Yup.object().shape({
      name: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ erro: 'Os campos não estão corretos!' });
    }

    const func = await Functions.findByPk(id);

    if (!func) {
      return res.status(404).json({ erro: 'Esta função não existe' });
    }

    const { name, canceled_at } = await func.update(req.body);

    return res.json({ name, canceled_at });
  }

  async delete(req, res) {
    const { id } = req.params;

    const func = await Functions.findByPk(id);

    if (!func) {
      return res.status(404).json({ erro: 'Esta função não existe' });
    }

    if (func.canceled_at != null) {
      return res.status(400).json({ erro: 'Esta função foi desativada' });
    }

    await func.update({ canceled_at: new Date() });

    return res.send();
  }
}

export default new FunctionsController();
