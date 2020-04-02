import * as Yup from 'yup';
import { Op } from 'sequelize';

import Scales from '../models/Scales';
import Groups from '../models/Groups';
import Periods from '../models/Periods';
import Ministries from '../models/Ministries';
import Volunteers from '../models/Volunteers';
import VolunteersGroups from '../models/VolunteersGroups';

class ScalesController {
  async store(req, res) {
    const schema = Yup.object().shape({
      id_group: Yup.number().required(),
      id_period: Yup.number().required(),
      id_ministery: Yup.number().required(),
      title: Yup.string()
        .min(6)
        .max(80)
        .required(),
      date: Yup.date().required(),
      observations: Yup.string()
        .max(300)
        .required(),
    });

    /** Validando payload */
    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ erro: 'Os campos estão inválidos!' });
    }

    const {
      id_group,
      id_period,
      id_ministery,
      title,
      date,
      observations,
    } = req.body;

    /** Validando ids de grupo, período e ministério */
    const group = await Groups.findByPk(id_group, {
      where: { disabled_at: null },
    });

    if (!group) {
      return res
        .status(404)
        .json({ message: 'Este grupo não existe ou está desativado!' });
    }

    const period = await Periods.findByPk(id_period, {
      where: { disabled_at: null },
    });

    if (!period) {
      return res
        .status(404)
        .json({ message: 'Este período não existe ou está desativado!' });
    }

    const ministery = await Ministries.findByPk(id_ministery, {
      where: { disabled_at: null },
    });

    if (!ministery) {
      return res
        .status(404)
        .json({ message: 'Este ministério não existe ou está desativado!' });
    }

    /** Verificar se aquele grupo já está escalado naquele dia e período */
    const scaleGroup = await Scales.findOne({
      where: { date, id_period },
    });

    if (scaleGroup) {
      return res
        .status(401)
        .json({ message: 'Este grupo já está escalado nesta data e período' });
    }

    /** Verificar se algum voluntário do grupo já está escalado na mesma data e período */
    const volunteers = await VolunteersGroups.findAll({
      where: { id_group },
      attributes: ['id_volunteer'],
    });

    /** Ids dos voluntários nos grupos */
    const groups = [];

    /** Pegando os ids dos voluntários do grupo */
    for (const volunteer of volunteers) {
      const volGroups = await VolunteersGroups.findAll({
        attributes: ['id_group'],
        where: { id_volunteer: volunteer.id_volunteer },
        group: ['id_group'],
      });

      /** Pegando grupos dos quais os voluntários fazem parte */
      for (const volGroup of volGroups) {
        if (groups[0] !== volGroup.id_group) groups.push(volGroup.id_group);
      }
    }

    /** Verificar se algum voluntário do grupo está escalado em outro grpo */

    for (const groupScale of groups) {
      const existsGroupScale = await Scales.findOne({
        where: {
          id_group: groupScale,
          [Op.or]: [{ date }, { id_period }],
        },
      });

      if (existsGroupScale) {
        return res.status(401).json({
          message:
            'Algum voluntário deste já está escalado nesta data e período em outro grupo!',
        });
      }
    }

    /** Salvando a escala */
    /*
    const { id } = await Scales.create({
      id_group,
      id_period,
      id_volunteer_created: req.userId,
      id_ministery,
      title,
      date,
      observations,
    });
    */

    /** Recuperando escala salva com as informações */
    /* const scale = await Scales.findByPk(id, {
      attributes: ['title', 'date', 'observations'],
      include: [
        {
          model: Groups,
          attributes: ['name'],
        },
        {
          model: Periods,
          attributes: ['name'],
        },
        {
          model: Ministries,
          attributes: ['name'],
        },
      ],
    });
    */
    console.log(groups);
    return res.json(groups);
    // return res.json(scale);
  }
}

export default new ScalesController();
