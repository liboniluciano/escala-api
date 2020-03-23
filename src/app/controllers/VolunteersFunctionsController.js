import * as Yup from 'yup';

import VolunteersFunctions from '../models/VolunteersFunctions';
import Volunteers from '../models/Volunteers';
import Functions from '../models/Functions';

class VolunteersFunctionsController {
  async index(req, res) {
    const idVolunteer = req.params.id;

    // TODO - pegar id de voluntário logado e buscar todos se for adm (ou req.params)

    /** Buscando voluntário por id */
    if (idVolunteer) {
      const volunteer = await VolunteersFunctions.findAll({
        where: { id_volunteer: idVolunteer },
        attributes: ['id'],
        include: [
          {
            model: Functions,
            attributes: ['name'],
          },
        ],
      });
      if (!volunteer) {
        return res.status(404).json({ erro: 'Voluntário não encontrado!' });
      }
      return res.json(volunteer);
    }

    /** Buscando todos os voluntários ativos */
    const { page = 1 } = req.query;

    const volunteers = await VolunteersFunctions.findAll({
      attributes: ['id'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: Volunteers,
          attributes: ['name'],
          where: { disabled_at: null },
        },
        {
          model: Functions,
          attributes: ['name'],
        },
      ],
    });

    return res.json(volunteers);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      id_volunteer: Yup.number().required(),
      id_function: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ erro: 'Os campos não estão corretos!' });
    }
    /** Validar se está alocando ele mesmo (caso não seja adm) */

    const { id_volunteer, id_function } = req.body;

    const volunteer = await Volunteers.findByPk(id_volunteer, {
      where: { disabled_at: null },
    });

    if (!volunteer) {
      return res
        .status(401)
        .json({ erro: 'Este voluntário não existe ou está desativado!' });
    }

    const func = await Functions.findByPk(id_function, {
      where: { canceled_at: null },
    });

    if (!func) {
      return res
        .status(401)
        .json({ erro: 'Esta função não existe ou está desativada!' });
    }

    /** Verificar se o voluntário já está alocado naquela função */
    const volunteerFunc = await VolunteersFunctions.findAll({
      where: { id_volunteer, id_function },
    });

    if (volunteerFunc.length !== 0) {
      return res
        .status(404)
        .json({ erro: 'O voluntário já está alocado nesta função!' });
    }

    const { id } = await VolunteersFunctions.create({
      id_volunteer,
      id_function,
    });

    const funcVolunteer = await VolunteersFunctions.findByPk(id, {
      attributes: ['id'],
      include: [
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

    return res.status(201).json(funcVolunteer);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      id_volunteer: Yup.number().required(),
      id_function: Yup.number().required(),
    });

    if (!schema.isValid(req.body)) {
      return res.status(401).json({ erro: 'Os campos estão incorretos!' });
    }

    const { id_volunteer, id_function } = req.body;

    const volFunc = await VolunteersFunctions.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!volFunc) {
      return res.status(404).json({
        erro: 'Não foi encontrado nenhum voluntário alocado nesta função!',
      });
    }

    /** Verificando se existe voluntário e função */
    const volunteer = await Volunteers.findByPk(id_volunteer, {
      where: { disabled_at: null },
    });

    if (!volunteer) {
      return res
        .status(404)
        .json({ erro: 'O voluntário não foi encontrado ou está desativado' });
    }

    const func = await Functions.findByPk(id_function, {
      where: { canceled_at: null },
    });

    if (!func) {
      return res
        .status(404)
        .json({ erro: 'A função não foi encontrado ou está desativada' });
    }

    /** Verificar se voluntário já está naquela função */
    const existFunction = await VolunteersFunctions.findOne({
      where: { id_function },
    });

    if (existFunction) {
      return res
        .status(401)
        .json({ erro: 'O voluntário já está alocado nesta função!' });
    }

    const { id } = await volFunc.update({ id_volunteer, id_function });

    const volFuncFormatted = await VolunteersFunctions.findByPk(id, {
      attributes: ['id'],
      include: [
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
    const volFunc = await VolunteersFunctions.findOne({
      where: {
        id: req.params.id,
        desatived_at: null,
      },
    });

    if (!volFunc) {
      return res.status(404).json({
        erro:
          'Não foi encontrado nenhum voluntário alocado nesta função ou está desativada!',
      });
    }

    await volFunc.update({
      desatived_at: new Date(),
    });

    return res.send();
  }
}

export default new VolunteersFunctionsController();
