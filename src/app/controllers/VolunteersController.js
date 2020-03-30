import * as Yup from 'yup';
import Volunteers from '../models/Volunteers';

class VolunteersController {
  async index(req, res) {
    if (!req.isAdmin) {
      return res.status(404).json({
        erro: 'Você não tem permissão para acessar essa funcionalidade',
      });
    }
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
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .min(6)
        .required(),
      telephone: Yup.string().required(),
      admin: Yup.boolean(),
    });

    /** Validando payload */
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

    const { id, name, email, telephone, admin } = await Volunteers.create(
      req.body
    );

    return res.status(201).json({ id, name, email, telephone, admin });
  }

  async update(req, res) {
    /** Verificar payload */
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ erro: 'Os campos não estão corretos!' });
    }

    const { email, oldPassword } = req.body;

    const volunteer = await Volunteers.findByPk(req.userId);

    // Para atualizar o e-mail, deve ser diferente do atual
    if (email !== undefined && email !== volunteer.email) {
      // E deve ser diferente dos emails cadastrados
      const volunteerExists = await Volunteers.findOne({ where: { email } });

      if (volunteerExists) {
        return res
          .status(400)
          .json({ erro: 'Já existe um usuário com este e-mail!' });
      }
    }

    /** Verificar se o editado é o mesmo que o logado (user normal) */
    if (req.userId !== volunteer.id && req.isAdmin === false) {
      return res
        .status(400)
        .json({ erro: 'Você pode alterar apenas o seu cadastro!' });
    }

    /** Validando senhas */
    if (oldPassword && !(await volunteer.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const { id, name, telephone } = await volunteer.update(req.body);

    return res.json({ id, name, email, telephone });
  }
}

export default new VolunteersController();
