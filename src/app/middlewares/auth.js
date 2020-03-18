import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../../config/auth';
import Volunteer from '../models/Volunteers';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ erro: 'Token de acesso não informado' });
  }
  const [, token] = authHeader.split(' ');

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);
    req.userId = decoded.id;

    /** Salvando o tipo do usuário (admin) */
    const isAdmin = await Volunteer.findByPk(req.userId, {
      attributes: ['admin'],
    });
    req.isAdmin = isAdmin.admin;

    /** Depois verificar se é líder */

    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Token invalid' });
  }
};
