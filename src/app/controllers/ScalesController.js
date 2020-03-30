import * as Yup from 'yup';

import Scales from '../models/Scales';
import Groups from '../models/Groups';
import Periods from '../models/Periods';
import Ministries from '../models/Ministries';

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
      note: Yup.string()
        .max(300)
        .required(),
    });

    /** Validando payload */
    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ erro: 'Os campos estão inválidos!' });
    }

    const { id_group, id_period, id_ministery, date } = req.body;

    /** Validando ids de grupo, período e ministério */
    const group = await Groups.findByPk(id_group, {
      where: { desatived_at: null },
    });

    if (!group) {
      return res
        .status(404)
        .json({ message: 'Este grupo não existe ou está desativado!' });
    }

    const period = await Periods.findByPk(id_period, {
      where: { desatived_at: null },
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
    const scaleGroup = await Groups.findOne({
      where: { date, id_period },
    });

    if (scaleGroup) {
      return res
        .status(401)
        .json({ message: 'Este grupo já está escalado nesta data e período' });
    }

    /** Verificar se o voluntário está em alguma escala no mesmo período */

    return res.json({ ok: 'Ok' });
  }
}

export default new ScalesController();
