import * as Yup from 'yup';

import VolunteersGroups from '../models/VolunteersGroups';
import Volunteers from '../models/Volunteers';
import Groups from '../models/Groups';
import Functions from '../models/Functions';

class VolunteersGroupsController {
  async index(req, res) {
    /** Id do Grupo */
    const { id } = req.params;

    if (id) {
      const volunteersGroup = await VolunteersGroups.findOne({
        attributes: ['id_group'],
        where: { id_group: id },
        include: [
          {
            model: Groups,
            attributes: ['name'],
          },
          {
            model: Volunteers,
            attributes: ['name'],
          },
          {
            model: Functions,
            attributes: ['name'],
          },
        ],
      });

      return res.json(volunteersGroup);
    }

    const volunteersGroups = await VolunteersGroups.findAll({
      attributes: ['id_group'],
      include: [
        {
          model: Groups,
          attributes: ['name'],
        },
        {
          model: Volunteers,
          attributes: ['name'],
        },
        {
          model: Functions,
          attributes: ['name'],
        },
      ],
    });

    return res.json(volunteersGroups);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      id_volunteer: Yup.number().required(),
      id_group: Yup.number().required(),
      id_function: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ erro: 'Os campos estão inválidos!' });
    }

    const { id_volunteer, id_group, id_function } = req.body;

    /** Validando se os ids existem */
    const volunteer = await Volunteers.findByPk(id_volunteer, {
      where: { desatived_at: null },
    });

    if (!volunteer) {
      return res
        .status(404)
        .json({ erro: 'Este voluntário não existe ou está desativado!' });
    }

    const group = await Groups.findByPk(id_group, {
      where: { desatived_at: null },
    });

    if (!group) {
      return res
        .status(404)
        .json({ erro: 'Este grupo não existe ou está desativado!' });
    }

    const func = await Functions.findByPk(id_function, {
      where: { canceled_at: null },
    });

    if (!func) {
      return res
        .status(404)
        .json({ erro: 'Esta função não existe ou está desativada!' });
    }

    /** Verificando se o voluntário já está alocado naquela função do grupo */
    // const funcGroupExists = VolunteersGroups.findOne({
    //   where: { id_function },
    // });

    // if (funcGroupExists) {
    //   return res
    //     .status(401)
    //     .json({ erro: 'O voluntário já está alocado nesta função!' });
    // }

    /** Inserindo voluntário no grupo */
    const { id } = await VolunteersGroups.create(req.body);

    const volunteerGroup = await VolunteersGroups.findByPk(id, {
      attributes: ['id'],
      include: [
        {
          model: Volunteers,
          attributes: ['id', 'name'],
        },
        {
          model: Groups,
          attributes: ['id', 'name'],
        },
        {
          model: Functions,
          attributes: ['name'],
        },
      ],
    });

    return res.status(201).json(volunteerGroup);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      id_volunteer: Yup.number().required(),
      id_group: Yup.number(),
      id_function: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ erro: 'Os campos estão inválidos!' });
    }

    const { id_volunteer, id_group, id_function } = req.body;

    const volGroup = await VolunteersGroups.findOne({
      where: { id: req.params.id },
    });

    if (!volGroup) {
      return res.status(404).json({
        message: 'Não foi encontrado nenhum voluntário',
      });
    }

    /** Validando se os ids existem */
    const volunteer = await Volunteers.findByPk(id_volunteer, {
      where: { desatived_at: null },
    });

    if (!volunteer) {
      return res
        .status(404)
        .json({ erro: 'Este voluntário não existe ou está desativado!' });
    }

    const group = await Groups.findByPk(id_group, {
      where: { desatived_at: null },
    });

    if (!group) {
      return res
        .status(404)
        .json({ erro: 'Este grupo não existe ou está desativado!' });
    }

    const func = await Functions.findByPk(id_function, {
      where: { canceled_at: null },
    });

    if (!func) {
      return res
        .status(404)
        .json({ erro: 'Esta função não existe ou está desativada!' });
    }

    /** Validando se o voluntário está naquela função */

    /** Atualizando os dados do voluntário */
    const { id } = await volGroup.update(req.body);

    const volFuncFormatted = await VolunteersGroups.findByPk(id, {
      attributes: ['id'],
      include: [
        {
          model: Groups,
          attributes: ['name'],
        },
        {
          model: Volunteers,
          attributes: ['name'],
        },
        {
          model: Functions,
          attributes: ['name'],
        },
      ],
    });

    return res.status(200).json(volFuncFormatted);
  }

  async delete(req, res) {
    const { id_volunteer, id_group, id_function } = req.body;

    const existsVolFunc = await VolunteersGroups.findOne({
      where: {
        id: req.params.id,
        id_volunteer,
        id_group,
        id_function,
      },
    });

    if (!existsVolFunc) {
      return res.status(404).json({
        erro: 'Não foi encontrado nenhum voluntário com estes parâmetros!',
      });
    }

    if (existsVolFunc.disabled_at !== null) {
      return res
        .status(401)
        .json({ erro: 'Este voluntário já está desativado no grupo' });
    }

    await existsVolFunc.update({ disabled_at: new Date() });

    return res.send();
  }
}

export default new VolunteersGroupsController();
