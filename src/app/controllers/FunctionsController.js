import * as Yup from 'yup';
import Functions from '../models/Functions';

class FunctionsController {
  async index(req, res) {
    const functions = await Functions.findAll({
      order: ['created_at'],
      attributes: ['id', 'name', 'disabled_at'],
    });

    return res.json(functions);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      id_category: Yup.number().required(),
      name: Yup.string()
        .max(60)
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ message: 'Os campos não estão válidos!' });
    }

    const func = await Functions.create(req.body);

    return res.status(201).json(func);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      id_category: Yup.number(),
      name: Yup.string().max(60),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ message: 'Os campos não estão válidos!' });
    }

    const idFunction = req.params.id;

    const func = await Functions.findByPk(idFunction);

    if (!func) {
      return res.status(404).json({ erro: 'Esta função não existe' });
    }

    const { id, id_category, name } = await func.update(req.body);

    return res.json({ id, name, id_category });
  }

  async delete(req, res) {
    const { id } = req.params;

    const func = await Functions.findByPk(id, {
      where: { disabled_at: null },
    });

    if (!func) {
      return res
        .status(404)
        .json({ erro: 'Esta função não existe ou está desativada' });
    }
    await func.update({ canceled_at: new Date() });

    return res.send();
  }
}

export default new FunctionsController();
