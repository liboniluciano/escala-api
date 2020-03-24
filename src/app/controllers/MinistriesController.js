import * as Yup from 'yup';

import Ministries from '../models/Ministries';

class MinistriesController {
  async index(req, res) {
    const idMinistery = req.params.id;

    if (idMinistery) {
      const ministery = await Ministries.findOne({
        where: { id: idMinistery, disabled_at: null },
        attributes: ['id', 'name'],
      });

      if (!ministery) {
        return res
          .status(404)
          .json({ message: 'Este ministério não existe ou está desativado!' });
      }

      return res.json(ministery);
    }

    const ministries = await Ministries.findAll({
      where: { disabled_at: null },
      attributes: ['id', 'name'],
    });

    return res.json(ministries);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ erro: 'Os campos estão incorretos!' });
    }

    const { id } = await Ministries.create(req.body);

    const ministery = await Ministries.findByPk(id, {
      attributes: ['id', 'name'],
    });

    return res.status(201).json(ministery);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ erro: 'Os campos estão incorretos!' });
    }

    const ministery = await Ministries.findOne({
      where: { id: req.params.id, disabled_at: null },
      attributes: ['id', 'name'],
    });

    if (!ministery) {
      return res
        .status(404)
        .json({ message: 'Ministério não encontrado ou desativado!' });
    }

    const { id } = await ministery.update(req.body);

    const ministeryUpdate = await Ministries.findByPk(id, {
      attributes: ['id', 'name'],
    });

    return res.json(ministeryUpdate);
  }

  async delete(req, res) {
    const ministery = await Ministries.findByPk(req.params.id, {
      where: {
        disabled_at: null,
      },
    });

    if (!ministery) {
      return res
        .status(404)
        .json({ message: 'Ministério não encontrado ou desativado!' });
    }

    await ministery.update({ disabled_at: new Date() });

    return res.send();
  }
}

export default new MinistriesController();
