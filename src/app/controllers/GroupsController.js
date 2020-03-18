import * as Yup from 'yup';
import Groups from '../models/Groups';

class GroupsController {
  async index(req, res) {
    const idGroup = req.params.id;

    /** Buscando grupos por id */
    if (idGroup) {
      const { id, name } = await Groups.findByPk(idGroup);
      return res.json({ id, name });
    }

    /** Buscando todos grupos que não foram desativados */
    const groups = await Groups.findAll({
      where: { desatived_at: null },
      attributes: ['id', 'name'],
    });
    return res.json(groups);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ erro: 'Os campos estão incorretos!' });
    }

    const group = await Groups.create({
      name: req.body.name,
      volunteer_id_created: req.userId,
    });

    const { id, name } = group;

    return res.status(201).json({ id, name });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ erro: 'Os campos estão incorretos!' });
    }

    const group = await Groups.findByPk(req.params.id, {
      where: { desatived_at: null },
    });

    if (!group) {
      return res
        .status(404)
        .json({ erro: 'Este grupo não existe ou foi desativado!' });
    }

    const { id, name } = await group.update(req.body);

    return res.json({ id, name });
  }

  async delete(req, res) {
    const group = await Groups.findByPk(req.params.id, {
      where: { desatived_at: null },
    });

    if (!group) {
      return res
        .status(404)
        .json({ erro: 'Este grupo não existe ou foi desativado!' });
    }

    console.log(group);
    await group.update({ desatived_at: new Date() });
    return res.send();
  }
}

export default new GroupsController();
