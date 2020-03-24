import * as Yup from 'yup';

import Volunteers from '../models/Volunteers';
import Ministry from '../models/Ministries';
import VolunteersMinistries from '../models/VolunteersMinistries';

class VolunteersMinistriesController {
  async index(req, res) {
    /** Buscar por id de ministério ou voluntário? */
    const idMinistry = req.params.id;

    const ministry = await Ministry.findOne({
      where: {
        id: idMinistry,
        disabled_at: null,
      },
    });

    if (!ministry) {
      return res
        .status(404)
        .json({ message: 'Ministério não encontrado ou desativado!' });
    }

    const volunteersMinistry = await VolunteersMinistries.findAll({
      attributes: ['id'],
      where: {
        id_ministry: idMinistry,
        disabled_at: null,
      },
      include: [
        {
          model: Ministry,
          attributes: ['id', 'name'],
        },
        {
          model: Volunteers,
          attributes: ['name'],
        },
      ],
    });

    return res.json(volunteersMinistry);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      id_volunteer: Yup.number().required(),
      id_ministry: Yup.number().required(),
      flg_leader: Yup.boolean(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Os campos estão inválidos!' });
    }

    const { id_volunteer, id_ministry } = req.body;

    /** Validando se existe voluntário e ministério */
    const volunteer = await Volunteers.findOne({
      where: { id: id_volunteer, disabled_at: null },
    });

    if (!volunteer) {
      return res.status(404).json({
        message: 'O voluntário não foi encontrado ou está desativado!',
      });
    }

    const ministry = await Ministry.findOne({
      where: { id: id_ministry, disabled_at: null },
    });

    if (!ministry) {
      return res.status(404).json({
        message: 'O ministério não foi encontrado ou está desativado!',
      });
    }

    const { id } = await VolunteersMinistries.create(req.body);

    const volunteerMinistry = await VolunteersMinistries.findByPk(id, {
      attributes: ['id'],
      include: [
        {
          model: Volunteers,
          attributes: ['id', 'name'],
        },
        {
          model: Ministry,
          attributes: ['id', 'name'],
        },
      ],
    });

    return res.status(201).json(volunteerMinistry);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      id_volunteer: Yup.number().required(),
      id_ministry: Yup.number().required(),
      flg_leader: Yup.boolean(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Os campos estão inválidos!' });
    }

    const { id_volunteer, id_ministry } = req.body;

    /** Validando se existe voluntário e ministério */
    const volunteer = await Volunteers.findOne({
      where: { id: id_volunteer, disabled_at: null },
    });

    if (!volunteer) {
      return res.status(404).json({
        message: 'O voluntário não foi encontrado ou está desativado!',
      });
    }

    const ministry = await Ministry.findOne({
      where: { id: id_ministry, disabled_at: null },
    });

    if (!ministry) {
      return res.status(404).json({
        message: 'O ministério não foi encontrado ou está desativado!',
      });
    }

    const volunteerMinistery = await VolunteersMinistries.findByPk(
      req.params.id
    );

    /** Verificar se o voluntário já está naquele ministério? */

    const { id } = await volunteerMinistery.update(req.body);

    const volunteerFormatted = await VolunteersMinistries.findByPk(id, {
      attributes: ['id'],
      include: [
        {
          model: Volunteers,
          attributes: ['id', 'name'],
        },
        {
          model: Ministry,
          attributes: ['id', 'name'],
        },
      ],
    });

    return res.json(volunteerFormatted);
  }

  async delete(req, res) {
    const schema = Yup.object().shape({
      id_volunteer: Yup.number().required(),
      id_ministry: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Os campos estão inválidos!' });
    }
    const { id_volunteer, id_ministry } = req.body;

    const volunteer = await VolunteersMinistries.findOne({
      where: {
        id_volunteer,
        id_ministry,
        disabled_at: null,
      },
    });

    if (!volunteer) {
      return res.status(404).json({
        message: 'O voluntário não foi encontrado ou está desativado!',
      });
    }

    await volunteer.update({
      disabled_at: new Date(),
    });

    return res.send();
  }
}

export default new VolunteersMinistriesController();
