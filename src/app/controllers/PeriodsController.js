import * as Yup from 'yup';

import Periods from '../models/Periods';

class PeriodsController {
  async index(req, res) {
    const idPeriod = req.params.id;

    if (idPeriod) {
      const period = await Periods.findByPk(idPeriod, {
        where: { disabled_at: null },
        attributes: ['id', 'name'],
      });

      if (!period) {
        return res.status(404).json({
          message: 'O período não foi encontrado ou está desativado!',
        });
      }

      return res.json(period);
    }

    const periods = await Periods.findAll({
      where: { disabled_At: null },
      attributes: ['id', 'name'],
    });

    return res.json(periods);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(404).json({ erro: 'Os campos não estão válidos!' });
    }

    const { id } = await Periods.create(req.body);

    const period = await Periods.findByPk(id, {
      attributes: ['id', 'name'],
    });

    return res.status(201).json(period);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(404).json({ erro: 'Os campos não estão válidos!' });
    }

    const period = await Periods.findByPk(req.params.id, {
      where: { disabled_at: null },
    });

    if (!period) {
      return res.status(404).json({
        message: 'O período não foi encontrado ou está desativado!',
      });
    }

    const { id } = await period.update(req.body);

    const periodUpdated = await Periods.findByPk(id, {
      attributes: ['id', 'name'],
    });

    return res.json(periodUpdated);
  }

  async delete(req, res) {
    const period = await Periods.findByPk(req.params.id, {
      where: { disabled_at: null },
    });

    if (!period) {
      return res.status(404).json({
        message: 'O período não foi encontrado ou está desativado!',
      });
    }

    await period.update({
      disabled_at: new Date(),
    });

    return res.send();
  }
}

export default new PeriodsController();
