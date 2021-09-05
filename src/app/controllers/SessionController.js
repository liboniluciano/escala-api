import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import authConfig from '../../config/auth';
import Volunteers from '../models/Volunteers';

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .min(6)
        .required(),
    });

    /** Validando payload */
    if (!(await schema.isValid(req.body))) {
      return res.status(404).json({ erro: 'Os campos estão incorretos!' });
    }

    const { email, password } = req.body;

    const volunteer = await Volunteers.findOne({
      where: { email },
    });

    if (!volunteer) {
      return res.status(404).json({ erro: 'Voluntário não encontrado!' });
    }

    if (!(await volunteer.checkPassword(password))) {
      return res.status(401).json({ erro: 'A senha não corresponde!' });
    }

    const { id, name, telephone, admin } = volunteer;

    /** Gerando o hash */
    return res.json({
      user: {
        id,
        name,
        email,
        telephone,
        admin,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
