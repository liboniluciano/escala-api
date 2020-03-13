import * as Yup from 'yup';
import Volunteers from '../models/Volunteers';

class VolunteersController {
  async index(req, res) {
    const idVolunteer = req.params.id;

    if (idVolunteer) {
      const volunteer = await Volunteers.findByPk(idVolunteer, {
        attributes: ['id', 'name', 'email', 'telephone', 'admin'],
      });
      return res.json(volunteer);
    }

    /** Listando todos os usuários ativos */
    const volunteers = await Volunteers.findAll({
      where: { disabled_at: null },
      attributes: ['id', 'name', 'email', 'telephone', 'admin'],
    });

    return res.json(volunteers);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().required(),
      password: Yup.string()
        .min(6)
        .required(),
      telephone: Yup.string().required(),
      admin: Yup.boolean(),
    });

    /** Valdiando payload */
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ erro: 'Os campos não estão corretos!' });
    }

    // Verificando se usuário existe (mesmo e-mail)
    const volunteer = await Volunteers.findOne({
      where: { email: req.body.email },
    });

    if (volunteer) {
      return res
        .status(400)
        .json({ erro: 'Já existe um usuário com este e-mail' });
    }

    const {
      id,
      name,
      email,
      telephone,
      admin,
      disabled,
    } = await Volunteers.create(req.body);

    return res
      .status(201)
      .json({ id, name, email, telephone, admin, disabled });
  }
}

export default new VolunteersController();
