export default async (req, res, next) => {
  /** Verificando se o usuário é adm */
  if (req.isAdmin === false) {
    return res.status(404).json({
      erro: 'Você não tem permissão de acesso para esta funcionalidade!',
    });
  }
  return next();
};
